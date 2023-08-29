import { html, useEffect } from '../../../deps/htm-preact.js';
import setActions, { getUrl, formatDate } from './index.js';

async function handleAction(url, path, idx, type) {
  if (url === 'fetchEditUrl') {
    url = await getUrl(path, idx, type)
  }
  window.open(url, '_blank');
}

function Actions({ label, parent, idx, type }) {
  const { pathname, actions, } = parent;
  const isJsonFile = pathname.toLowerCase().endsWith(".json");
  return html`
    <h3 class=locui-url-label>${label}</h3>
    <div class=locui-url-source-actions>
      <button
        class="locui-url-action locui-url-action-edit ${isJsonFile ? 'xlsx' : ''} ${actions?.edit?.status !== 200 ? 'disabled' : ''}"
        onClick=${() => { handleAction(actions?.edit.url, pathname, idx, type); }}>Edit</button>
      <button
        class="locui-url-action locui-url-action-view ${actions?.preview?.status !== 200 ? 'disabled' : ''}"
        onClick=${() => { handleAction(actions?.preview.url, pathname, idx, type); }}>Preview</button>
      <button
        class="locui-url-action locui-url-action-view ${actions?.live?.status !== 200 ? 'disabled' : ''}"
        onClick=${() => { handleAction(actions?.live.url, pathname, idx, type); }}>Live</button>
    </div>
  `;
}

export default function Url({ item, idx }) {
  useEffect(() => { setActions(idx); }, [idx]);
  const formattedDate = formatDate(item.userInfo?.lastModifiedDateTime);

  return html`
    <li class=locui-url>
      <div class=locui-url-details>
        <h3 class=locui-url-label>Path</h3>
        <p class=locui-url-path>${item.pathname}</p>
        <div class=locui-url-actions>
          <div class=locui-url-source>
            <${Actions} idx=${idx} label=Source parent=${item} type="source" />
          </div>
          <div class=locui-url-langstore>
            <${Actions} idx=${idx} type="langstore" label="Langstore (${item.langstore.lang})" parent=${item.langstore} />
          </div>
        </div>
      </div>
      <div class=locui-url-dates>
        <h3 class=locui-url-label>Details</h3>
        ${item.userInfo && html`<p class=locui-user-info><span class=info-title>Modified by: </span>${item.userInfo?.lastModifiedBy}</p><p class=locui-user-info><span class=info-title>Last Modified: </span>${formattedDate}</p>`}
      </div>
    </li>
  `;
}
