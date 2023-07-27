import { html, useEffect } from '../../../deps/htm-preact.js';
import setActions, { getUrl } from './index.js';

async function handleAction(url, path, idx, type) {
  debugger
  if(url === 'fetch') {
    url = await getUrl(path, idx, type)
  }
  window.open(url, '_blank');
}

function Actions({ label, parent, idx, type }) {
  return html`
    <h3 class=locui-url-label>${label}</h3>
    <div class=locui-url-source-actions>
      <button
        class="locui-url-action locui-url-action-edit ${parent.actions?.edit?.status !== 200 ? 'disabled' : ''}"
        onClick=${() => { handleAction(parent.actions?.edit.url, parent.pathname, idx, type); }}>Edit</button>
      <button
        class="locui-url-action locui-url-action-view ${parent.actions?.preview?.status !== 200 ? 'disabled' : ''}"
        onClick=${() => { handleAction(parent.actions?.preview.url, parent.pathname, idx, type); }}>Preview</button>
      <button
        class="locui-url-action locui-url-action-view ${parent.actions?.live?.status !== 200 ? 'disabled' : ''}"
        onClick=${() => { handleAction(parent.actions?.live.url, parent.pathname, idx, type); }}>Live</button>
    </div>
  `;
}

export default function Url({ item, idx }) {
  useEffect(() => { setActions(idx); }, [idx]);
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
      </div>
    </li>
  `;
}
