import { html } from '../../../deps/htm-preact.js';
import { languages, projectStatus, buttonStatus } from '../utils/state.js';
import { rolloutFiles } from '../actions/index.js';

function SelectedLocales(item) {
  const selectedLocales = item.Locales ? item.Locales.split('\n') : [];

  if (selectedLocales.length <= 0) {
    return null;
  }

  return html`
    <p class=locui-project-label>Locales</p>
      <div class=locui-subproject-locales>
      ${selectedLocales.map((locale) => html`<span class=locui-subproject-locale>${locale}</span>`)}
    </div>
  `;
}

function Language({ item }) {
  const { value = {} } = projectStatus;
  const langStatus = value[item.localeCode]?.status;

  return html`
    <li class=locui-subproject>
      <p class=locui-project-label>Language</p>
      <h3 class=locui-subproject-name>${item.Language}</h3>
      <p class=locui-project-label>Action</p>
      <h3 class=locui-subproject-name>${item.Action}</h3>
      ${item.Workflow && html`<p class=locui-project-label>Method</p>
      <h3 class=locui-subproject-name>${item.Workflow}</h3>`}
      <p class=locui-project-label>Items</p>
      <h3 class=locui-subproject-name>${item.size}</h3>
      ${SelectedLocales(item)}
      ${value.projectStatusText && html`<div class="language-status status-bar">
        <label>${langStatus || 'Not started'} </label>
      </div>`}
      ${langStatus === 'translated' && html`<div class="status-bar rollout-btn" disabled=${buttonStatus.value.rollout} onclick=${() => { rolloutFiles(item.localeCode); }}>Rollout</div>`}
    </li>
  `;
}

export default function Langs() {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Languages</h2>
      </div>
      <ul class=locui-subprojects>
        ${languages.value.map((proj) => html`<${Language} key='${proj.Language}-${proj.size}' item=${proj} />`)}
      </ul>
    </div>
  `;
}
