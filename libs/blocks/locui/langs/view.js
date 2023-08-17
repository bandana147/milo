import { html } from '../../../deps/htm-preact.js';
import { languages, projectStatus } from '../utils/state.js';

function Language({ item }) {
  const hasLocales = item.locales?.length > 0;
  const { languageStatus = {}} = projectStatus.value;
  console.log(item.Language)
  return html`
    <li class=locui-subproject>
      <p class=locui-project-label>Language</p>
      <h3 class=locui-subproject-name>${item.Language}</h3>
      <p class=locui-project-label>Action</p>
      <h3 class=locui-subproject-name>${item.Action}</h3>
      <p class=locui-project-label>Items</p>
      <h3 class=locui-subproject-name>${item.size}</h3>
      ${hasLocales && html`
        <p class=locui-project-label>Locales</p>
        <div class=locui-subproject-locales>
          ${item.locales.map((locale) => html`<span class=locui-subproject-locale>${locale}</span>`)}
        </div>
      `}
      <p class=locui-project-label>Status</p>
      <div class=language-status>
        <div><label>Completed</label>: <span>${languageStatus[item.locales[0]].done}</span></div>
        <div><label>Error</label>: <span>${languageStatus[item.locales[0]].error}</span></div>
        <div><label>Total</label>: <span>${languageStatus[item.locales[0]].total}</span></div>
      </div>
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
