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

function updateFileDetails() {
  synced.value = true;
  const newUrls = urls.value.map((url) => {
    delete url.langstore.actions;
    return url;
  });
  urls.value = newUrls;
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
    const statusResponse = await fetch(`${apiUrl}project-status?project=${projectHash}`, { method: 'GET' });

    if (!statusResponse.ok) {
      const error = statusResponse.json();
      setStatus('project', 'error', `Failed to get project status: ${error}`);
    }
    const status = await statusResponse.json();
    projectStatus.value = status;
    if (showStatus) {
      setStatus('project', 'info', status.projectStatusText, { timeout: 1000 });
    }
    buttonStatus.value = { status: { loading: false } };
    return status;
  } catch (err) {
    projectStatus.value = { ...projectStatus.value, projectStatusText: 'Not Started' };
    buttonStatus.value = { status: { loading: false } };
    return { error: err };
  }
}

export async function checkStatus(status, pollingInterval, callback) {
  let timerId;

  try {
    const response = await getProjectStatus();
    if (response.projectStatus !== status) {
      timerId = setTimeout(() => checkStatus(status, pollingInterval, callback), pollingInterval);
      setStatus('project', 'info', response.projectStatusText);
    } else {
      if (callback) {
        callback();
      }
      clearTimeout(timerId);
      setStatus('project', 'info', response.projectStatusText, { timeout: 1000 });
    }
  } catch (error) {
    setStatus('project', 'error', `Error while fetching status - ${error}`);
  }
}

export async function syncToLangstore() {
  buttonStatus.value = { sync: { loading: true } };
  const projectHash = md5(previewPath.value);
  try {
    await fetch(`${apiUrl}start-sync?project=${projectHash}`, { method: 'POST' });
    setStatus('project', 'info', 'Successfully started syncing');
    checkStatus('sync-done', 5000, updateFileDetails);
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
  buttonStatus.value = { start: { loading: true } };
  const projectUrl = previewPath.value;
  const projectHash = md5(projectUrl);
  setStatus('project', 'info', 'Starting project');
  try {
    const startResponse = await fetch(`${apiUrl}/start-project?project=${projectHash}`, { method: 'POST' });
    if (startResponse.status === 201) {
      setStatus('project', 'info', 'Project started successfully!', { timeout: 1000 });
      await checkStatus('waiting', 5000);
    }
    buttonStatus.value = { start: { loading: false } };
  } catch (error) {
    setStatus('project', 'error', 'Failed to start project');
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
    setStatus('project', 'info', 'Rollout started succesfully', { timeout: 1000 });
    buttonStatus.value = { rollout: { loading: false } };
  } catch (err) {
    setStatus('project', 'error', 'Failed to roll out files');
    buttonStatus.value = { rollout: { loading: false } };
  }
}
