import { html } from '../../../deps/htm-preact.js';
import { urls, languages, siteConfig, projectStatus, buttonStatus } from '../utils/state.js';
import { rollout } from '../actions/index.js';

function SelectedLocales(item) {
  const data = siteConfig.value?.locales?.data || [];
  const defaultLocales = data.find((lang) => lang.languagecode === item.localeCode)?.livecopies;
  const selectedLocales = item.locales || (defaultLocales || '').split(',');

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
  const showRollout = ['translated', 'completed'].includes(langStatus);
  const doneTitle = langStatus === 'translated' || langStatus === 'in-progress' ? 'Translated' : 'Rolled out';
  const doneCount = value[item.localeCode]?.done || 0;

  return html`
    <li class="locui-subproject ${langStatus || 'not-started'}">
      <p class=locui-project-label>Language</p>
      <h3 class=locui-subproject-name>${item.Language}</h3>
      <p class=locui-project-label>Action</p>
      <h3 class=locui-subproject-name>${item.Action}</h3>
      ${item.Workflow && html`<p class=locui-project-label>Method</p>
      <h3 class=locui-subproject-name>${item.Workflow}</h3>`}
      <div class=item-count-wrapper>
        <div>
          <p class=locui-project-label>Items</p>
          <h3 class=locui-subproject-name>${urls.value.length}</h3>
        </div>
        ${doneCount > 0 && html`<div>
          <p class=locui-project-label>${doneTitle}</p>
          <h3 class=locui-subproject-name>${doneCount}</h3>
        </div>`}
      </div>
      ${SelectedLocales(item)}
      ${value.projectStatusText && html`<div class="language-status">
        <label>${langStatus || 'Not started'} </label>
      </div>`}
      ${showRollout && html
      `<div class="rollout-btn ${buttonStatus.value[`rollingOut-${item.localeCode}`] ? 'disabled' : ''}"
        onclick=${() => { rollout(item.localeCode); }}>${langStatus === 'completed' ? 'Re rollout' : 'Rollout' }</div>`}
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
