import { html } from '../../../deps/htm-preact.js';
import { statuses } from '../utils/state.js';

function toggleDesc(e) {
  e.target.closest('.locui-status-toast').classList.toggle('open');
}

function onClickAction(e, status) {
  e.stopPropagation();
  status.action.callback();
}

function Toast({ status }) {
  return html`
    <div onClick=${toggleDesc}
      class="locui-status-toast locui-status-toast-type-${status.type}
      ${status.description && 'has-description'}">
      <div class=locui-status-toast-content>
        <div>
          <span class=locui-status-toast-content-type>${status.type}</span>
          <span class=locui-status-toast-text>${status.text}</span>
        </div>
        ${status.action && html`
        <div class=locui-status-toast-button onclick=${(e) => { onClickAction(e, status) }}>${status.action.label}</div>`}
      </div>
      ${status.description && html`
        <p class=locui-status-toast-description>${status.description}</p>
        <div class=locui-status-toast-expand>Expand</div>`}
    </div>
  `;
}

export default function Status() {
  const statusArr = Object.keys(statuses.value).map((key) => statuses.value[key]);
  return html`
    <div class=locui-status-toast-section>
      ${statusArr.map((status) => status && html`<${Toast} status=${status} />`)}
    </div>
  `;
}
