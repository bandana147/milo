import { getReqOptions } from './utils/msal.js';

const urlParams = new URLSearchParams(window.location.href);
const referrer = urlParams.get("referrer");
const sourceCode = referrer?.match(/sourcedoc=([^&]+)/)[1];
const sourceId = decodeURIComponent(sourceCode);
const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileById('${sourceId}')`;

export const fetchVersions = async () => {
  const options = getReqOptions({
    contentType: 'application/json;odata=verbose',
    accept: 'application/json;odata=nometadata'
  });
  const documentData = await fetch(url, options);
  const d = await documentData.json();
  const { CheckInComment, TimeLastModified, UIVersionLabel, ServerRelativeUrl, ID } = d;
  const currentVersion = {
    ID,
    Url: ServerRelativeUrl,
    VersionLabel: UIVersionLabel,
    CheckInComment,
    Created: TimeLastModified,
    IsCurrentVersion: true,
  }

  const versions = await fetch(`${url}/Versions`, options);
  const { value } = await versions.json();

  const versionHistory = [...value, currentVersion];
  return versionHistory.reverse().filter((item) => item.VersionLabel.indexOf('.0') !== -1);
}

export const createHistoryTag = async (comment = 'default') => {
  const callOptions = getReqOptions({
    method: 'POST'
  });
  await fetch(`${url}/Publish('${comment}')`, callOptions);
}



