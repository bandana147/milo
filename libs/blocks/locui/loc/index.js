import { getStatus, preview } from '../../../tools/sharepoint/franklin.js';
import {
  urls,
  heading,
  setStatus,
  languages,
  showLogin,
  getSiteConfig,
  previewPath,
} from '../utils/state.js';
import { getProjectStatus, checkStatus } from '../actions/index.js';
import login from '../../../tools/sharepoint/login.js';
import { getUrls } from '../../../tools/sharepoint/franklin.js';

const PROJECT_INPROGRESS_CODES = ['download', 'start-glaas', 'export', 'waiting', 'incoming', 'rollout'];
const LANG_ACTIONS = ['Translate', 'English Copy', 'Rollout'];
const MOCK_REFERRER = 'https%3A%2F%2Fadobe.sharepoint.com%2F%3Ax%3A%2Fr%2Fsites%2Fadobecom%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257B94460FAC-CDEE-4B31-B8E0-AA5E3F45DCC5%257D%26file%3Dwesco-demo.xlsx';

const urlParams = new URLSearchParams(window.location.search);

let resourcePath;

function removeFileExtension(filename) {
  const lastIndex = filename.lastIndexOf('.');
  return filename.substring(0, lastIndex);
}

async function loadLocales() {
  const config = await getSiteConfig();
  languages.value.forEach((language) => {
    const found = config.locales.data.find(
      (locale) => language.Language === locale.language,
    );
    language.locales = found?.livecopies.split(',');
    language.localeCode = found?.languagecode;
  });
  languages.value = [...languages.value];
}

async function loadDetails() {
  setStatus('details', 'info', 'Loading languages and URLs.');
  try {
    const resp = await fetch(previewPath.value);
    const json = await resp.json();
    const jsonUrls = json.urls.data.map((item) => new URL(item.URL));
    if (jsonUrls.length <= 0) {
      setStatus('details', 'error', 'No document URLs found!');
      return;
    }
    const projectUrls = getUrls(jsonUrls);
    const projectLangs = json.languages.data.reduce((rdx, lang) => {
      if (LANG_ACTIONS.includes(lang.Action)) {
        lang.size = projectUrls.length;
        rdx.push(lang);
      }
      return rdx;
    }, []);

    if (projectLangs.length <= 0) {
      setStatus('details', 'error', 'No language selected!');
      return;
    }
    languages.value = projectLangs;
    urls.value = projectUrls;
    setStatus('details');
  } catch (err) {
    setStatus('details', 'error', `Error loading languages and URLs.: ${err}`);
  }
}

async function loadHeading() {
  setStatus('details', 'info', 'Getting latest project info.');
  const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
  const json = await getStatus('', editUrl);
  resourcePath = json.resourcePath;
  previewPath.value = json.preview.url;
  const path = resourcePath.replace(/\.[^/.]+$/, '');
  setStatus('details');
  const projectName = removeFileExtension(json.edit.name).replaceAll('-', ' ');
  document.title = projectName;
  heading.value = { name: projectName, editUrl: json.edit.url, path };
  await preview(`${path}.json`);
}

async function loadStatus() {
  const status = await getProjectStatus();
  const projectInProgress = PROJECT_INPROGRESS_CODES.includes(status?.projectStatus);
  // const rolloutInProgress = status.some((loc)=> loc.status?)
  if (projectInProgress) {
    checkStatus('waiting', 10000);
  }
}

export async function loginToSharePoint() {
  const telemetry = { application: { appName: 'Adobe Localization UI' } };
  const scopes = ['files.readwrite', 'sites.readwrite.all'];
  try {
    await login({ scopes, telemetry });
    showLogin.value = false;
  } catch {
    showLogin.value = true;
  }
}

export default async function setDetails() {
  await loadHeading();
  await loadDetails();
  await loadLocales();
  await loadStatus();
}
