import { html } from '../../../deps/htm-preact.js';
import { languages, projectStatus } from '../utils/state.js';

const statusLabel = {
  'waiting for incoming translation': 'In progress'
}
function SelectedLocales(item) {
  const selectedLocales = item.Locales ? item.Locales.split('\n') : [];
  const allLocales = item.locales;
  const locales = selectedLocales.length > 0 ? selectedLocales : allLocales;

  if (locales.length <= 0) {
    return null;
  }

  return html`
    <p class=locui-project-label>Locales</p>
      <div class=locui-subproject-locales>
      ${locales.map((locale) => html`<span class=locui-subproject-locale>${locale}</span>`)}
    </div>
  `
}

function Language({ item }) {
  const { value = {}} = projectStatus;
  const langStatus = value[item.locales[0]]?.status;
  const status = value.projectStatus;
  
  return html`
    <li class=locui-subproject>
      <p class=locui-project-label>Language</p>
      <h3 class=locui-subproject-name>${item.Language}</h3>
      <p class=locui-project-label>Action</p>
      <h3 class=locui-subproject-name>${item.Action}</h3>
      <p class=locui-project-label>Items</p>
      <h3 class=locui-subproject-name>${item.size}</h3>
      ${SelectedLocales(item)}
      <div class="language-status green-btn">
        <label>${langStatus || statusLabel[status] || 'Not started'}</label>
      </div>
      ${langStatus === 'Translated' && html`<div class="green-btn rollout-btn">Rollout</div>`}
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
        ${languages.value.map((proj) => html`<${Language} item=${proj} />`)}
      </ul>
    </div>
  `;
}
