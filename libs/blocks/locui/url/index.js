import { getStatus } from '../../../tools/sharepoint/franklin.js';
import { urls, setStatus } from '../utils/state.js';
import { getItem } from '../../../tools/sharepoint/file.js';

function getFileName(editUrl) {
  const url = new URL(editUrl);
  return url.searchParams.get('file');
}

async function getDetails(path, fetchEditUrl = false) {
  setStatus('url', 'info', 'Getting URL details.');
  const json = await getStatus(path, fetchEditUrl);
  const filename = json.edit.url ? getFileName(json.edit.url) : undefined;
  const edit = { url: json.edit.url, status: json.edit.status, filename };
  const fileDetails = await getItem(path);

  if (!json.edit.url && !fileDetails.error) {
    edit.url = 'fetchEditUrl';
    edit.status = 200;
  }

  setStatus('url');
  return {
    actions: {
      edit,
      preview: { url: json.preview.url, status: json.preview.status },
      live: { url: json.live.url, status: json.live.status },
    },
    userInfo: {
      lastModifiedBy: fileDetails.lastModifiedBy?.user?.displayName,
      lastModifiedDateTime: fileDetails.lastModifiedDateTime,
    },
  };
}

export async function getUrl(path, idx, type) {
  const { actions, userInfo } = await getDetails(path, 'auto');
  if (type === 'langstore') {
    urls.value[idx].langstore.actions = actions;
  } else {
    urls.value[idx].actions = actions;
  }
  urls.value[idx].userInfo = userInfo;
  return actions.edit.url;
}

export default async function setActions(idx) {
  if (!urls.value[idx].actions || !urls.value[idx].langstore?.actions) {
    if (!urls.value[idx].actions) {
      const { actions, userInfo } = await getDetails(urls.value[idx].pathname);
      urls.value[idx].actions = actions;
      urls.value[idx].userInfo = userInfo;
    }

    if (!urls.value[idx].langstore?.actions) {
      const langStoreDetails = await getDetails(urls.value[idx].langstore.pathname);
      urls.value[idx].langstore.actions = langStoreDetails.actions;
    }
    urls.value = [...urls.value];
  }
}

export function formatDate(date) {
  let newDate;

  if (!Number.isNaN(+date)) {
    const hours = Math.floor((+date % 1) * 24);
    const minutes = Math.floor((((+date % 1) * 24) - hours) * 60);
    const offsetUTC = 24 - (new Date().getTimezoneOffset() / 60);
    newDate = new Date(Date.UTC(0, 0, +date, hours - offsetUTC, minutes));
  } else {
    newDate = new Date(date);
  }

  const localDateFormat = new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
  );

  return localDateFormat.toLocaleString([], { dateStyle: 'short' });
}
