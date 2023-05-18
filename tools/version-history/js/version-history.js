// import { getConfig } from '../../loc/config.js';
import { loadingOFF, loadingON } from '../../loc/utils.js';
import { connectWithSPRest, getAuthorizedRequestOptionSP } from '../../loc/sharepoint.js';

async function init() {
  loadingON('Fetch token for sharepoint API\'s... please wait');
  await connectWithSPRest();
  loadingOFF('Token successful...done');
  const options = getAuthorizedRequestOptionSP();
  const listUrl = '/sites/adobecom/Shared Documents/milo';
  const documentUrl = '/drafts/blaishram/document.docx';
  document.getElementById('project-url').textContent = documentUrl;
  const list_title = 'Documents';
  const item_id = '3226';
  
  const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileByServerRelativeUrl('${listUrl}${documentUrl}')`;
  const url2 = `https://adobe.sharepoint.com/sites/adobecom/_api/web/lists/getByTitle('${list_title}')/items(${item_id})/File/CheckOut()`;
  const url3 = `https://adobe.sharepoint.com/sites/adobecom/_api/web/lists/getByTitle('${list_title}')/items(${item_id})/File/Versions`;
  
  const fetchVersions = async () => {
    const documentData = await fetch(url, options);
    const {CheckInComment, TimeLastModified, UIVersionLabel} = await documentData.json();

    const currentVersion = {
      VersionLabel: UIVersionLabel,
      CheckInComment,
      Created: TimeLastModified
    }

    const versions = await fetch(`${url}/Versions`, options);
    const { value } = await versions.json();

    const versionHistory = [...value, currentVersion];

    const createTd = (data) => {
      const td = document.createElement('td');
      td.textContent = data;
      return td;
    }

    const createTr = (data) => {
      const trElement = document.createElement('tr');
      const { VersionLabel, CheckInComment, Created } = data;
      trElement.appendChild(createTd(VersionLabel));
      trElement.appendChild(createTd(Created.split('T')[0]));
      trElement.appendChild(createTd(CheckInComment));
      return trElement;
    }
    const versionDataParent = document.querySelector("#addVersionHistory");
    versionDataParent.innerHTML='';
    versionHistory.reverse().forEach((item) => {
      versionDataParent.appendChild(createTr(item));
    });
  }

  const callOptions = getAuthorizedRequestOptionSP({
    method: 'POST'
  });

  const checkoutAPICall = async () => {
    await fetch(`${url}/CheckOut()`, callOptions);
  }

  const checkinAPICall = async (comment) => {
    await fetch(`${url}/CheckIn(comment='${comment}', checkintype='1')`, callOptions);
  }

  document.getElementById('create').addEventListener('click', async (e) => {
    e.preventDefault();
    loadingON('Creating new version');
    const comment = document.querySelector('#comment').value;
    if (comment) {
      await checkoutAPICall();
      await checkinAPICall(`Through API: ${comment}`);
      await fetchVersions();
    }
    loadingON('New version created');
  });

  fetchVersions();
}

export default init;
