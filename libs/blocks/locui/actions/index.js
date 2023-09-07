/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateExcelTable from '../utils/sp/excel.js';
import { heading, setStatus, urls, languages, previewPath, projectStatus, buttonStatus, synced } from '../utils/state.js';
import { origin, preview } from '../utils/franklin.js';
import { decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../loc/index.js';
import '../../../deps/md5.min.js';
import getServiceConfig from '../../../utils/service-config.js';

let apiUrl = '';

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
      setStatus('excel', 'info', 'Excel refreshed.', null, 1500);
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
  const fragments = [...doc.querySelectorAll('.fragment')];
  const fragmentUrls = fragments.reduce((rdx, fragment) => {
    // Normalize the fragment path to support production urls.
    const pathname = new URL(fragment.href).pathname.replace('.html', '');
    const fragmentUrl = new URL(`${origin}${pathname}`);
    // Look for duplicates that are already in the urls
    const dupe = urls.value.some((url) => url.href === fragmentUrl.href);
    if (!dupe) rdx.push(fragmentUrl);
    return rdx;
  }, []);
  if (fragmentUrls.length === 0) return [];
  return getUrls(fragmentUrls);
}

function updateFileDetails() {
  synced.value = true;
  const newUrls = urls.value.map(url=> {
    delete url.langstore.actions;
    return url;
  });
  urls.value = newUrls;
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
  setStatus('fragments', 'info', `${forExcel.length} fragments found.`, null, 1500);

  if (forExcel.length > 0) {
    const newLangs = languages.value.map(item=> {
      item.size = item.size + forExcel.length;
      return item;
    });
    languages.value = newLangs;
    urls.value = [...urls.value];
    updateExcelTable(forExcel);
    updateExcelJson();
  }
}

export async function syncToLangstore() {
  buttonStatus.value = { sync: { loading: true } }
  const projectHash = md5(previewPath.value);
  try {
    await fetch(`${apiUrl}start-sync?project=${projectHash}`, {
      method: 'POST',
    });
    setStatus('project', 'info', 'Successfully started syncing');
    checkStatus('sync-done', 5000, updateFileDetails);
  } catch (error) {
    setStatus('project', 'error', `Syncing failed: ${error}`);
    buttonStatus.value = { sync: { loading: false } }
  }
}
export async function checkStatus(status, pollingInterval = Infinity, callback) {
  let timerId;

  try {
    const response = await getProjectStatus();
    if (response.projectStatus !== status) {
      timerId = setTimeout(() => checkStatus(status, pollingInterval, callback), pollingInterval);
      setStatus('project', 'info', response.projectStatusText);
    } else {
      callback && callback();
      clearTimeout(timerId);
      setStatus('project', 'info', response.projectStatusText, undefined, 1000);
    }
  } catch (error) {
    setStatus('project', 'error', `Error while fetching status - ${error}`);
  }
}

export async function createProject() {
  buttonStatus.value = { create: { loading: true } };
  const projectUrl = previewPath.value;
  try {
    setStatus('project', 'info', 'Creating project');
    const createResponse = await fetch(`${apiUrl}create-project`, {
      method: 'POST',
      body: projectUrl
    });
    if (createResponse.status === 201) {
      setStatus('project', 'info', 'Project created successfully!', undefined, 1000);
      projectStatus.value = { projectStatus: 'created' };
      await getProjectStatus();
    }
    buttonStatus.value = { create: { loading: false } };
  } catch (error) {
    setStatus('project', 'error', 'Failed to create project');
    buttonStatus.value = { create: { loading: false } };
  }
}

export async function startProject() {
  buttonStatus.value = { start: { loading: true } };
  const projectUrl = previewPath.value;
  const projectHash = md5(projectUrl);
  setStatus('project', 'info', 'Starting project');
  try {
    const startResponse = await fetch(`${apiUrl}/start-project?project=${projectHash}`, {
      method: 'POST',
    });
    if (startResponse.status === 201) {
      setStatus('project', 'info', 'Project started successfully!', undefined, 1000);
      await checkStatus('waiting', 5000);
    }
    buttonStatus.value = { start: { loading: false } };
  } catch (error) {
    setStatus('project', 'error', 'Failed to start project');
    buttonStatus.value = { start: { loading: false } };
  }
}

export async function getProjectStatus(showStatus) {
  if (!apiUrl) {
    const { miloc } = await getServiceConfig(origin);
    apiUrl = miloc.url;
  }
  if (showStatus) {
    buttonStatus.value = { status: { loading: true } };
  }
  const projectHash = md5(previewPath.value);
  try {
    const statusResponse = await fetch(`${apiUrl}project-status?project=${projectHash}`, {
      method: 'GET',
    });

    if (!statusResponse.ok) {
      const error = statusResponse.json();
      setStatus('project', 'error', `Failed to get project status: ${error}`);
    }
    const status = await statusResponse.json();
    projectStatus.value = status;
    showStatus && setStatus('project', 'info', status.projectStatusText, undefined, 1000);
    buttonStatus.value = { status: { loading: false } };
    return status;
  } catch (err) {
    projectStatus.value = { ...projectStatus.value, projectStatusText: 'Not Started' };
    buttonStatus.value = { status: { loading: false } };
  }
}

export async function rolloutFiles(languageCode) {
  buttonStatus.value = { rollout: { loading: true } };
  setStatus('project', 'info', 'Initiating rollout');
  try {
    const projectUrl = previewPath.value;
    const projectHash = md5(projectUrl);
    await fetch(`${apiUrl}start-rollout?project=${projectHash}&languageCode=${languageCode}`, {
      method: 'POST',
    });

    setStatus('project', 'info', 'Rollout started succesfully', undefined, 1000);
    buttonStatus.value = { rollout: { loading: false } };
  } catch (err) {
    setStatus('project', 'error', 'Failed to roll out files');
    buttonStatus.value = { rollout: { loading: false } };
  }
}
