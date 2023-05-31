import { loadingOFF, loadingON } from '../../loc/utils.js';
import { connectWithSPRest, getAuthorizedRequestOptionSP } from '../../loc/sharepoint.js';

async function init() {
  const loaderElem = document.getElementById('loader');
  const contentElem = document.getElementById('content');
  await connectWithSPRest();
  loaderElem.classList.add('none');
  contentElem.classList.remove('none');

  const options = getAuthorizedRequestOptionSP();

  const urlParams = new URLSearchParams(window.location.href);
  const referrer = urlParams.get("referrer");
  const sourceCode = referrer.match(/sourcedoc=([^&]+)/)[1];
  const sourceId = decodeURIComponent(sourceCode);

  const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileById('${sourceId}')`;

  const fetchVersions = async (onlyMajorVersions = false) => {
    const documentData = await fetch(url, options);
    const { CheckInComment, TimeLastModified, UIVersionLabel, ServerRelativeUrl } = await documentData.json();
    const projectDetailsWrapper = document.getElementById('project-url');
    if (projectDetailsWrapper) {
      projectDetailsWrapper.textContent = `${ServerRelativeUrl}`;
    }

    const currentVersion = {
      Url: ServerRelativeUrl,
      VersionLabel: UIVersionLabel,
      CheckInComment,
      Created: TimeLastModified,
      isCurrent: true
    }

    const versions = await fetch(`${url}/Versions`, options);
    const { value } = await versions.json();

    const versionHistory = [...value, currentVersion];

    const createTd = (data) => {
      const td = document.createElement('td');
      td.textContent = data;
      return td;
    }

    const addTagLabel = (trElement, data) => {
      const tagName = document.createElement('a');
      tagName.textContent = data.VersionLabel;
      tagName.classList.add('link');
      tagName.addEventListener('click', async () => {
        const fileUrl = data.isCurrent ? `https://adobe.sharepoint.com/${data.Url}` : `https://adobe.sharepoint.com/sites/adobecom/${data.Url}`;
        const a = document.createElement('a');
        a.href = fileUrl;
        a.click();
      })
      const td = document.createElement('td');
      td.append(tagName);
      trElement.appendChild(td);
    }

    const createTr = (data) => {
      const trElement = document.createElement('tr');
      const { CheckInComment, Created } = data;

      addTagLabel(trElement, data);
      trElement.appendChild(createTd(Created.split('T')[0]));
      trElement.appendChild(createTd(CheckInComment));
      return trElement;
    }
    const versionDataParent = document.querySelector("#addVersionHistory");
    versionDataParent.innerHTML = '';
    versionHistory.reverse().forEach((item) => {
      if (onlyMajorVersions && item.VersionLabel.indexOf('.0') !== -1) {
        versionDataParent.appendChild(createTr(item));
      }
    });
  }

  const publishCommentCall = async (comment) => {
    const callOptions = getAuthorizedRequestOptionSP({
      method: 'POST'
    });
    await fetch(`${url}/Publish('${comment}')`, callOptions);
    document.querySelector('#comment').value = '';
  }

  document.getElementById('publish').addEventListener('click', async (e) => {
    e.preventDefault();
    loadingON('Publish comment');
    const comment = document.querySelector('#comment').value;
    if (comment) {
      await publishCommentCall(`Through API: ${comment}`);
      await fetchVersions(true);
    }
    loadingOFF('Published');
  });

  fetchVersions(true);
}

export default init;
