import { html } from '../../../deps/htm-preact.js';
import { spAccessToken, urls, projectStatus } from '../utils/state.js';
import {
  findFragments,
  syncToLangstore,
  startLocalize,
  getProjectStatus
} from './index.js';

const SYNCED = 'sync to langstore completed';
const ButtonLabel = {
  [SYNCED]: 'Start project',
  notStarted: 'Create project'
}

export default function Actions() {
  const status = projectStatus.value?.projectStatus;
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
        ${!status && html`<button 
          class="green-btn locui-urls-heading-action"
          disabled=${!spAccessToken.value}
          onClick=${findFragments}>Find Fragments</button>`}
        ${status && html`<button
          onClick=${syncToLangstore}
          class="green-btn locui-urls-heading-action">
          Sync to Langstore <span>(${urls.value[0].langstore.lang})</span>
        </button>`}
          ${(!status || status === SYNCED) && html`<button 
          class="green-btn locui-urls-heading-action"
          onClick=${startLocalize}>${ButtonLabel[(status || 'notStarted')]}</button>`}
          ${status && html`<button 
          class="green-btn locui-urls-heading-action"
          onClick=${getProjectStatus}>Get status</button>`}
      </div>
    </div>
  `;
}
