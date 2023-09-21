import { html } from '../../../deps/htm-preact.js';
import { languages, projectStatus, loadStatus } from '../utils/state.js';
import { syncToLangstore, startProject, rollout } from './index.js';
import { findFragments } from '../../../tools/sharepoint/franklin.js';

const SYNCED = 'sync-done';

const StatusActions = {
  'notStarted': ['findFragments', 'sync'],
  'sync-done': ['start'],
  'rollout': ['rollout'],
  'completed': ['rollout']
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
    action: () => rollout('all'),
    label: 'Rollout all',
    disabled: loadStatus.value['rollingOut-all'],
  },
}

function ActionButtons(config) {
  return html`
    <button
      class="locui-urls-heading-action"
      onClick=${config.action}
      disabled=${config.disabled}>${config.label}</button>`;
}

function huithu() {
  loadStatus.value = { fetching: true }
}

export default function Actions() {
  if (projectStatus.value.fetched) {
    const actions = StatusActions[projectStatus.value.projectStatus || 'notStarted'] || [];
    const localeCodes = languages.value.map((lang) => lang.localeCode);
    const isRolloutReady = localeCodes.some(locale => ['translated', 'completed'].includes(projectStatus.value[locale]?.status));
    if (isRolloutReady) {
      actions.push('rollout');
    }
    if (actions.length > 0) {
      return html`
        <div class=locui-section>
          <div class=locui-section-heading>
            <h2 class=locui-section-label onclick=${huithu}>Actions</h2>
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
