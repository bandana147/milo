import { getStatus } from '../utils/franklin.js';
import { urls, setStatus } from '../utils/state.js';
import { checkItem } from '../utils/sp/file.js';

function getFileName(editUrl) {
  const url = new URL(editUrl);
  return url.searchParams.get('file');
}

async function getDetails(path, fetchEditUrl = false) {
  setStatus('url', 'info', 'Getting URL details.');
  const json = await getStatus(path, fetchEditUrl);
  const filename = json.edit.url ? getFileName(json.edit.url) : undefined;
  const edit = { url: json.edit.url, status: json.edit.status, filename };

  if (!json.edit.url) {
    const fileDetails = await checkItem(path);
    // If file exist then show the file
    if (!fileDetails.error) {
      edit.url = 'fetch';
      edit.status = 200;
    }
  }
  setStatus('url');
  return {
    edit,
    preview: { url: json.preview.url, status: json.preview.status },
    live: { url: json.live.url, status: json.live.status },
  };
}

export async function getUrl(path, idx, type) {
  const urlDetails = await getDetails(path, 'auto');
  if (type === 'langstore') {
    urls.value[idx].langstore.actions = urlDetails
  } else {
    urls.value[idx].actions = urlDetails
  }
  return urlDetails.edit.url;
}

export default async function setActions(idx) {
  if (!urls.value[idx].actions) {
    urls.value[idx].actions = await getDetails(urls.value[idx].pathname);
    urls.value[idx].langstore.actions = await getDetails(urls.value[idx].langstore.pathname);
    urls.value = [...urls.value];
  }
}
