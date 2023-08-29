import { html } from '../../../deps/htm-preact.js';
import { spAccessToken, urls, projectStatus } from '../utils/state.js';
import { findFragments, syncToLangstore, startLocalize, getProjectStatus } from './index.js';

const SHOW_SYNC_STATES = ['sync', 'created'];
const PROJECT_INPROGRESS_CODES = ['download', 'start-glaas', 'export', 'waiting', 'incoming', 'rollout'];
const SYNCED = 'sync-done';
const ButtonLabel = {
  [SYNCED]: 'Start project',
  notStarted: 'Create project'
}

export default function Actions() {
  const status = projectStatus.value?.projectStatus;
  const notStarted = !status;
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
        ${notStarted && html`<button 
          class="green-btn locui-urls-heading-action"
          disabled=${!spAccessToken.value}
          onClick=${findFragments}>Find Fragments</button>`}
        ${status && SHOW_SYNC_STATES.includes(status) && html`<button
          onClick=${syncToLangstore}
          class="green-btn locui-urls-heading-action">
          Sync to Langstore <span>(${urls.value[0].langstore.lang})</span>
        </button>`}
        ${(notStarted || status === SYNCED) && html`<button 
          class="green-btn locui-urls-heading-action"
          onClick=${startLocalize}>${ButtonLabel[(status || 'notStarted')]}</button>`}
        ${(status && PROJECT_INPROGRESS_CODES.includes(status)) && html`<button 
          class="green-btn locui-urls-heading-action"
          onClick=${()=> { getProjectStatus(true) }}>Get status</button>`}
      </div>
    </div>
  `;
}
