import { html } from '../../../deps/htm-preact.js';
import { urls, languages, projectStatus, loadStatus } from '../utils/state.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import { syncToLangstore, startProject, rollOutFiles } from './index.js';
import { findFragments } from '../../../tools/sharepoint/franklin.js';

const SYNCED = 'sync-done';

const StatusActions = {
  'notStarted': ['findFragments', 'sync'],
  'sync': ['sync'],
  'sync-done': ['start'],
  'rollout': ['rollout']
}

const ActionConfig = {
  findFragments: {
    action: findFragments,
    label: 'Find Fragments'
  },
  sync: {
    action: syncToLangstore,
    label: `Sync to Langstore(en)`,
    disabled: loadStatus.value.syncing,
  },
  start: {
    action: startProject,
    label: `Send for localization`,
    disabled: loadStatus.value.starting,
  },
  rollout: {
    action: () => rollOutFiles('all'),
    label: 'Rollout all',
    disabled: loadStatus.value.rollingOut,
  },
}

function ActionButtons(config) {
  return html`
    <button
      class="locui-urls-heading-action"
      onClick=${config.action}
      disabled=${config.disabled}>${config.label}</button>`;
}

export default function Actions() {
  if (projectStatus.value.fetched) {
    const actions = StatusActions[projectStatus.value.projectStatus || 'notStarted'] || [];
    const localeCodes = languages.value.map((lang) => lang.localeCode);
    const isRolloutReady = localeCodes.some(locale => projectStatus.value[locale]?.status === 'translated');
    if (isRolloutReady) {
      actions.push('rollout');
    }
    if (actions.length > 0) {
      return html`
        <div class=locui-section>
          <div class=locui-section-heading>
            <h2 class=locui-section-label>Actions</h2>
          </div>
          <div class=locui-url-heading-actions>
          ${actions.map(action => ActionButtons(ActionConfig[action]))}
          </div>
        </div>`;
    } else {
      return null;
    }
  }
  return null;
}
