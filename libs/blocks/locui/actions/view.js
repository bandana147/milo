import { html } from '../../../deps/htm-preact.js';
import { urls, projectStatus, buttonStatus } from '../utils/state.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import { syncToLangstore, startProject, getProjectStatus, createProject } from './index.js';
import { findFragments } from '../../../tools/sharepoint/franklin.js';

const SYNCED = 'sync-done';
const SHOW_SYNC_STATES = ['sync', 'created', SYNCED];
const PROJECT_INPROGRESS_CODES = ['download', 'start-glaas', 'export', 'waiting', 'incoming', 'rollout'];

function Loader() {
  return html`<div class="shimmer-loader loader-pink"/>`;
}

function ActionButtons(status) {
  const notStarted = !status;
  return html`
    ${notStarted && html`<button 
      class="locui-urls-heading-action"
      disabled=${!accessToken.value}
      onClick=${findFragments}>Find Fragments</button>`}
    ${status && SHOW_SYNC_STATES.includes(status) && html`<button
      class="locui-urls-heading-action"
      onClick=${syncToLangstore}
      disabled=${buttonStatus.value.sync?.loading}>
      Sync to Langstore <span>(${urls.value[0].langstore.lang})</span></button>`}
    ${notStarted && html`<button 
      class="locui-urls-heading-action"
      disabled=${buttonStatus.value.create?.loading}
      onClick=${createProject}>Create project</button>`}
    ${status === SYNCED && html`<button 
      class="locui-urls-heading-action"
      disabled=${buttonStatus.value.start?.loading}
      onClick=${startProject}>Start project</button>`}
    ${(status && PROJECT_INPROGRESS_CODES.includes(status)) && html`<button 
      class="locui-urls-heading-action"
      disabled=${buttonStatus.value.status?.loading}
      onClick=${() => { getProjectStatus(true); }}>Get status</button>`}
  `;
}

export default function Actions() {
  const status = projectStatus.value?.projectStatus;
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
      ${!projectStatus.value?.projectStatusText ? Loader() : ActionButtons(status)}
      </div>
    </div>
  `;
}
