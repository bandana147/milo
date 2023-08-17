import { html } from '../../../deps/htm-preact.js';
import { spAccessToken, urls, projectStatus } from '../utils/state.js';
import {
  findFragments,
  syncToLangstore,
  startLocalize,
  rolloutFiles,
} from './index.js';

export default function Actions() {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
        <button 
          class=locui-urls-heading-action
          disabled=${!spAccessToken.value}
          onClick=${findFragments}>Find Fragments</button>
        <button
          onClick=${syncToLangstore}
          class=locui-urls-heading-action>
          Sync to Langstore <span>(${urls.value[0].langstore.lang})</span></button>
          ${projectStatus.value.projectStatus === 'not started' && html`<button 
          class=locui-urls-heading-action
          onClick=${startLocalize}>Localize</button>`}
          ${projectStatus.value.projectStatus === 'translated' && html`<button 
          class=locui-urls-heading-action
          onClick=${rolloutFiles}>Rollout</button>`}
      </div>
    </div>
  `;
}
