import { html } from '../../../deps/htm-preact.js';
import { projectStatus, buttonStatus } from '../utils/state.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import { sendForLocalization } from './index.js';
import { findFragments } from '../../../tools/sharepoint/franklin.js';

const SYNCED = 'sync-done';
const SHOW_SYNC_STATES = ['sync', 'created', SYNCED];
const PROJECT_INPROGRESS_CODES = ['download', 'start-glaas', 'export', 'waiting', 'incoming', 'rollout'];

function ActionButtons(status) {
  const notStarted = !status;
  return html`
    ${notStarted && html`<button 
      class="locui-urls-heading-action"
      disabled=${!accessToken.value}
      onClick=${findFragments}>Find Fragments</button>`}
    ${notStarted && html`<button 
      class="locui-urls-heading-action"
      disabled=${buttonStatus.value.start?.loading}
      onClick=${sendForLocalization}>Send for localization</button>`}
  `;
}

export default function Actions() {
  const status = projectStatus.value?.projectStatus;
  if (status) {
    return null;
  }
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
      ${ActionButtons(status)}
      </div>
    </div>
  `;
}
