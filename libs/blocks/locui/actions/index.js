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
  languages,
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
    const status = await statusResponse.json();
    projectStatus.value = { ...status, fetched: true };
    return status;
  } catch (err) {
    projectStatus.value = { ...projectStatus.value, projectStatusText: 'Not Started', fetched: true };
    return { error: err };
  }
}

export async function pollProjectStatus(status, pollingInterval, callback, languageCode) {
  let timerId;

  try {
    const response = await getProjectStatus();
    const expectedStatus = languageCode ? response[languageCode]?.status : response.projectStatus;
    if (expectedStatus !== status) {
      timerId = setTimeout(() => pollProjectStatus(status, pollingInterval, callback, languageCode), pollingInterval);
    } else {
      languageCode && setStatus('project', 'info', 'Rollout completed', { timeout: 2000 });
      if (callback) {
        callback();
      }
      clearTimeout(timerId);
    }
  } catch (error) {
    setStatus('project', 'error', `Error while fetching status - ${error}`);
  }
}

export async function syncToLangstore() {
  try {
    await createProject();
    const projectHash = md5(previewPath.value);
    setStatus('project', 'info', 'Starting project sync', { timeout: 2000 });
    await fetch(`${apiUrl}start-sync?project=${projectHash}`, { method: 'POST' });
    buttonStatus.value = { syncing: false };
    pollProjectStatus('sync-done', 5000, onSyncComplete);
  } catch (error) {
    setStatus('project', 'error', `Syncing failed: ${error}`);
    buttonStatus.value = { syncing: false };
  }
}

export async function createProject() {
  const projectUrl = previewPath.value;
  try {
    setStatus('project', 'info', 'Creating project');
    const createResponse = await fetch(`${apiUrl}create-project`, {
      method: 'POST',
      body: projectUrl,
    });
    if (createResponse.status === 201) {
      setStatus('project', 'info', 'Project created successfully!', { timeout: 3000 });
      await getProjectStatus();
    }
  } catch (error) {
    setStatus('project', 'error', 'Failed to create project');
  }
}

export async function startProject() {
  const projectUrl = previewPath.value;
  const projectHash = md5(projectUrl);
  setStatus('project', 'info', 'Starting project');
  buttonStatus.value = { starting: true };

  try {
    const startResponse = await fetch(`${apiUrl}/start-project?project=${projectHash}`, { method: 'POST' });
    buttonStatus.value = { starting: false };
    if (startResponse.status === 201) {
      setStatus('project', 'info', 'Project started successfully!', { timeout: 1000 });
      await pollProjectStatus('completed', 5000);
    }
  } catch (error) {
    setStatus('project', 'error', 'Failed to start project');
    buttonStatus.value = { starting: false };
  }
}

export async function rollout(languageCode) {
  buttonStatus.value = { ...buttonStatus.value, [`rollingOut-${languageCode}`]: true };
  setStatus('project', 'info', 'Initiating rollout');
  try {
    const projectUrl = previewPath.value;
    const projectHash = md5(projectUrl);
    let reroll = false;
    if (languageCode === 'all') {
      const localeCodes = languages.value.map((lang) => lang.localeCode);
      reroll = localeCodes.some(locale => projectStatus.value[locale]?.status === 'completed') && localeCodes.every(locale => projectStatus.value[locale]?.status !== 'translated');
    } else {
      reroll =  projectStatus.value[languageCode].status === 'completed';
    }
    await fetch(`${apiUrl}start-rollout?project=${projectHash}&languageCode=${languageCode}&reroll=${reroll}`, { method: 'POST' });
    setStatus('project');
    buttonStatus.value = { ...buttonStatus.value, [`rollingOut-${languageCode}`]: false };
    await pollProjectStatus('completed', 5000, undefined, languageCode);
  } catch (err) {
    setStatus('project', 'error', 'Failed to roll out files', { timeout: 2000 });
    buttonStatus.value = { ...buttonStatus.value, [`rollingOut-${languageCode}`]: false };
  }
}

