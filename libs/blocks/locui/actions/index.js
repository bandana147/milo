/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* global md5 */

import {
  urls,
  synced,
  setStatus,
  previewPath,
  projectStatus,
  buttonStatus,
} from '../utils/state.js';
import { origin } from '../../../tools/sharepoint/franklin.js';
import '../../../deps/md5.min.js';
import getServiceConfig from '../../../utils/service-config.js';

let apiUrl = '';

async function onSyncComplete() {
  synced.value = true;
  const newUrls = urls.value.map((url) => {
    delete url.langstore.actions;
    return url;
  });
  urls.value = newUrls;
  await startProject();
}

export async function getProjectStatus(showStatus) {
  if (!apiUrl) {
    const { miloc } = await getServiceConfig(origin);
    apiUrl = miloc.url;
  }

  if (showStatus) {
    setStatus('project', 'info', 'Getting latest project status', { timeout: 1000 });
  }

  const projectHash = md5(previewPath.value);
  try {
    const statusResponse = await fetch(`${apiUrl}project-status?project=${projectHash}`, { method: 'GET' });
    if (!statusResponse.ok) {
      const error = statusResponse.json();
      setStatus('project', 'error', `Failed to get project status: ${error}`);
    }
    const status = await statusResponse.json();
    projectStatus.value = status;
    buttonStatus.value = { status: { loading: false } };
    return status;
  } catch (err) {
    projectStatus.value = { ...projectStatus.value, projectStatusText: 'Not Started' };
    buttonStatus.value = { status: { loading: false } };
    return { error: err };
  }
}

export async function checkStatus(status, pollingInterval, callback, languageCode) {
  let timerId;
  try {
    const response = await getProjectStatus();
    const expectedStatus = languageCode ? response[languageCode].status : response.projectStatus;
    if (expectedStatus !== status) {
      timerId = setTimeout(() => checkStatus(status, pollingInterval, callback, languageCode), pollingInterval);
      languageCode && setStatus('project', 'info', response[languageCode]?.statusText);
    } else {
      if (callback) {
        callback();
      }
      clearTimeout(timerId);
      languageCode && setStatus('project', 'info', response[languageCode]?.statusText, { timeout: 1000 });
    }
  } catch (error) {
    setStatus('project', 'error', `Error while fetching status - ${error}`);
  }
}

export async function syncToLangstore() {
  buttonStatus.value = { sync: { loading: true } };
  const projectHash = md5(previewPath.value);
  try {
    setStatus('project', 'info', 'Starting project sync');
    await fetch(`${apiUrl}start-sync?project=${projectHash}`, { method: 'POST' });
    setStatus('project', 'info', 'Successfully started syncing');
    checkStatus('sync-done', 5000, onSyncComplete);
  } catch (error) {
    setStatus('project', 'error', `Syncing failed: ${error}`);
    buttonStatus.value = { sync: { loading: false } };
  }
}

export async function createProject() {
  buttonStatus.value = { create: { loading: true } };
  const projectUrl = previewPath.value;
  try {
    setStatus('project', 'info', 'Creating project');
    const createResponse = await fetch(`${apiUrl}create-project`, {
      method: 'POST',
      body: projectUrl,
    });
    if (createResponse.status === 201) {
      setStatus('project', 'info', 'Project created successfully!', { timeout: 1000 });
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
  const projectUrl = previewPath.value;
  const projectHash = md5(projectUrl);
  setStatus('project', 'info', 'Starting project');
  try {
    const startResponse = await fetch(`${apiUrl}/start-project?project=${projectHash}`, { method: 'POST' });
    if (startResponse.status === 201) {
      setStatus('project', 'info', 'Project started successfully!', { timeout: 1000 });
      await checkStatus('waiting', 5000);
    }
  } catch (error) {
    setStatus('project', 'error', 'Failed to start project');
  }
}

export async function sendForLocalization() {
  buttonStatus.value = { start: { loading: true } };
  try {
    await createProject();
    await syncToLangstore();
    buttonStatus.value = { start: { loading: false } };
  } catch (error) {
    setStatus('project', 'error', 'Failed to send project for localization');
    buttonStatus.value = { start: { loading: false } };
  }
}

export async function rolloutFiles(languageCode) {
  buttonStatus.value = { rollout: { loading: true } };
  setStatus('project', 'info', 'Initiating rollout');
  try {
    const projectUrl = previewPath.value;
    const projectHash = md5(projectUrl);
    await fetch(`${apiUrl}start-rollout?project=${projectHash}&languageCode=${languageCode}`, { method: 'POST' });
    await checkStatus('completed', 5000, undefined, languageCode);
  } catch (err) {
    setStatus('project', 'error', 'Failed to roll out files', { timeout: 2000 });
    buttonStatus.value = { rollout: { loading: false } };
  }
}
