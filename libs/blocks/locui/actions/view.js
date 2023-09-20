import { html } from '../../../deps/htm-preact.js';
import { languages, projectStatus, buttonStatus, siteConfig } from '../utils/state.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import { sendForLocalization, rollOutFiles } from './index.js';
import { findFragments } from '../../../tools/sharepoint/franklin.js';

function isAltLangTranslated(languageCode) {
  const locales = siteConfig.value.locales?.data;
  const altLang = locales?.find(lang=> lang.languagecode === languageCode)?.altLanguagecode;
  if(!altLang) return true;
  return projectStatus.value[altLang]?.status === 'translated';
}

function ActionButtons(status, isRolloutReady) {
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
    ${isRolloutReady && html`<button 
      class="locui-urls-heading-action"
      disabled=${buttonStatus.value.rollout?.loading}
      onClick=${()=> rollOutFiles('all')}>Rollout all</button>`}
  `;
}

export default function Actions() {
  const status = projectStatus.value?.projectStatus;
  const localeCodes = languages.value.map((lang) => lang.localeCode);
  const isRolloutReady = localeCodes.some(locale => {
    return projectStatus.value[locale]?.status === 'translated' && isAltLangTranslated(locale);
  });
   
  if (!projectStatus.value.loading && (!status || isRolloutReady)) {
    return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Actions</h2>
      </div>
      <div class=locui-url-heading-actions>
      ${ActionButtons(status, isRolloutReady)}
      </div>
    </div>
  `;
  }

  return null; 
}
