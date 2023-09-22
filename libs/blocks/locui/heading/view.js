import { html } from '../../../deps/htm-preact.js';
import { heading, urls, languages, statuses, projectStatus } from '../utils/state.js';
import { user } from '../../../tools/sharepoint/state.js';
import { getProjectStatus } from '../actions/index.js';
import setDetails from '../loc/index.js';

async function handleRefresh() {
  languages.value = [];
  urls.value = [];
  statuses.value = {};
  setDetails();
}

export default function Heading() {
  return html`
    <div class=locui-project-heading>
      <div class=locui-project-heading-column>
        <h2 class=locui-section-label>Project</h2>
        <div class=locui-project-details-project>
          <span>${heading.value.name}</span>
          ${heading.value.editUrl && html`<a class=locui-project-details-edit href="${heading.value.editUrl}" target="_blank">Edit</a>`}
          ${heading.value.name && html`<a class=locui-project-details-refresh onClick=${handleRefresh}>Refresh</a>`}
        </div>
        <div class=locui-project-status>
            <h2 class=locui-section-label>Status</h2>
          ${projectStatus.value.projectStatusText && html`<div class=locui-project-details-project>
            <span>${projectStatus.value.projectStatusText}</span>
            <a class=locui-project-details-refresh onClick=${() => getProjectStatus(true)}>Refresh</a>
          </div>`}
        </div>
      </div>
      <div class=locui-project-heading-column>
        <h2 class=locui-section-label>LOGGED IN</h2>
        <div class=locui-project-details-name>
          <span>${user.value}</span>
        </div>
      </div>
    </div>`;
}
