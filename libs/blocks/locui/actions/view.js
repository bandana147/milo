import { html } from '../../../deps/htm-preact.js';
import { spAccessToken, urls, projectStatus, buttonStatus } from '../utils/state.js';
import { findFragments, syncToLangstore, startProject, getProjectStatus, createProject } from './index.js';

const SHOW_SYNC_STATES = ['sync', 'created'];
const PROJECT_INPROGRESS_CODES = ['download', 'start-glaas', 'export', 'waiting', 'incoming', 'rollout'];
const SYNCED = 'sync-done';

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
          class="locui-urls-heading-action"
          disabled=${!spAccessToken.value}
          onClick=${findFragments}>Find Fragments</button>`}
        ${status && SHOW_SYNC_STATES.includes(status) && html`<button
          onClick=${syncToLangstore}
          disabled=${buttonStatus.value.sync?.loading}
          class="locui-urls-heading-action ">
          Sync to Langstore <span>(${urls.value[0].langstore.lang})</span>
        </button>`}
        ${status === SYNCED && html`<button 
          class="locui-urls-heading-action"
          disabled=${buttonStatus.value.start?.loading}
          onClick=${startProject}>Start project</button>`}
        ${notStarted && html`<button 
          class="locui-urls-heading-action"
          disabled=${buttonStatus.value.create?.loading}
          onClick=${createProject}>Create project</button>`}
        ${(status && PROJECT_INPROGRESS_CODES.includes(status)) && html`<button 
          class="locui-urls-heading-action"
          disabled=${buttonStatus.value.status?.loading}
          onClick=${()=> { getProjectStatus(true) }}>Get status</button>`}
      </div>
    </div>
  `;
}
