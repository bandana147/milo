import { urls, languages, heading, setStatus } from "../../blocks/locui/utils/state.js";
import { getConfig, getLocale, decorateSections } from "../../utils/utils.js";
import { updateExcelTable } from "./file.js";

const ADMIN = 'https://admin.hlx.page';

const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || 'adobecom';
const repo = urlParams.get('repo') || 'milo';
const ref = urlParams.get('ref') || 'main';

export const origin = `https://${ref}--${repo}--${owner}.hlx.page`;

async function updateExcelJson() {
  let count = 1;
  const excelUpdated = setInterval(async () => {
    setStatus('excel', 'info', `Refreshing project. Try #${count}`);
    const previewResp = await preview(`${heading.value.path}.json`);
    const resp = await fetch(previewResp.preview.url);
    const json = await resp.json();
    count += 1;
    if (count > 10 || json.urls.data.length === urls.value.length) {
      clearInterval(excelUpdated);
      setStatus('excel', 'info', 'Excel refreshed.', { timeout: 1500 });
    }
  }, 1000);
}

async function findPageFragments(path) {
  const resp = await fetch(`${origin}${path}`);
  if (!resp.ok) return [];
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  decorateSections(doc, true);
  const fragments = [...doc.querySelectorAll('.fragment'), ...doc.querySelectorAll('img[alt*="/fragments/"]')];
  const fragmentUrls = fragments.reduce((rdx, fragment) => {
    const url = fragment.tagName === 'A' ? fragment.href : fragment.alt;
    // Normalize the fragment path to support production urls.
    const pathname = new URL(url).pathname.replace('.html', '');
    const fragmentUrl = new URL(`${origin}${pathname}`);
    // Look for duplicates that are already in the urls
    const dupe = urls.value.some((url) => url.href === fragmentUrl.href);
    if (!dupe) rdx.push(fragmentUrl);
    return rdx;
  }, []);
  if (fragmentUrls.length === 0) return [];
  return getUrls(fragmentUrls);
}

export async function getStatus(url = '', editUrl = 'auto') {
  let path = `${ADMIN}/status/${owner}/${repo}/${ref}${url}`;
  path = editUrl ? `${path}?editUrl=${editUrl}` : path;
  const resp = await fetch(path);
  const json = await resp.json();
  return json;
}

export async function preview(path) {
  const url = `${ADMIN}/preview/${owner}/${repo}/${ref}${path}`;
  const resp = await fetch(url, { method: 'POST' });
  const json = await resp.json();
  return json;
}

export function getUrls(jsonUrls) {
  const { locales } = getConfig();
  // Assume all URLs will be the same locale as the first URL
  const locale = getLocale(locales, jsonUrls[0].pathname);
  const langstorePrefix = locale.prefix ? `/langstore${locale.prefix}` : '/langstore/en';
  // Loop through each url to get langstore information
  return jsonUrls.map((url) => {
    url.langstore = {
      lang: locale.prefix ? locale.prefix.replace('/', '') : 'en',
      pathname: url.pathname.replace(locale.prefix, langstorePrefix),
    };
    return url;
  });
}

export async function findFragments() {
  setStatus('fragments', 'info', 'Finding fragments.');
  const found = urls.value.map((url) => findPageFragments(url.pathname));
  const pageFragments = await Promise.all(found);
  // For each page, loop through all the found fragments
  const forExcel = pageFragments.reduce((rdx, fragments) => {
    if (fragments.length > 0) {
      fragments.forEach((fragment) => {
        urls.value.push(fragment);
        rdx.push([fragment.href]);
      });
    }
    return rdx;
  }, []);
  setStatus('fragments', 'info', `${forExcel.length} fragments found.`, { timeout: 1500 });

  if (forExcel.length > 0) {
    const newLangs = languages.value.map((item) => {
      item.size += forExcel.length;
      return item;
    });
    languages.value = newLangs;
    urls.value = [...urls.value];
    setStatus('sharepoint', 'info', 'Adding URLs to your project.');
    const res = await updateExcelTable(forExcel, heading.value.path);
    if (!res.ok) {
      setStatus('sharepoint', 'error', 'Fragment found but couldn\'t add the URLs to project.');
      return;
    }
    setStatus('sharepoint');
    updateExcelJson();
  }
}
