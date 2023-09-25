import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/locui/actions/view.js';
import { projectStatus, buttonStatus, languages, siteConfig } from '../../../../libs/blocks/locui/utils/state.js';
import { accessToken } from '../../../../libs/tools/sharepoint/state.js';
import { mockActionsdata } from './actions-mockdata.js';

describe('View', () => {
  before(async () => {
    accessToken.value = mockActionsdata.token;
    projectStatus.value = mockActionsdata.projectStatus;
    buttonStatus.value = mockActionsdata.buttonStatus;
    languages.value = [mockActionsdata.languages];
    siteConfig.value = mockActionsdata.siteConfig;
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should display the correct section header', async () => {
    const container = await waitForElement('.locui-section');
    const sectionHeader = container.querySelector('.locui-section-label').textContent;
    expect(sectionHeader).to.equal('Actions');
  });

  it('should contain find fragment button', async () => {
    const container = await waitForElement('.locui-section');
    const sectionHeader = container.querySelector('.locui-urls-heading-action').textContent;
    expect(sectionHeader).to.equal('Find Fragments');
  });

  it('should contain find sync button button', async () => {
    const container = await waitForElement('.locui-section');
    const sectionHeader = container.querySelectorAll('.locui-urls-heading-action')[1].textContent;
    expect(sectionHeader).to.equal('Send for localization');
  });

  it('should render rollout button if ALT lang is not present', async () => {
    siteConfig.value = { locales: { data: [{ languagecode: 'ja' }] } };
    const container = await waitForElement('.locui-section');
    const sectionHeader = container.querySelectorAll('.locui-urls-heading-action')[2].textContent;
    expect(sectionHeader).to.equal('Rollout all');
  });

  it('should render rollout button', async () => {
    projectStatus.value = { ...mockActionsdata.projectStatus, projectStatus: true };
    const container = await waitForElement('.locui-section');
    const sectionHeader = container.querySelectorAll('.locui-urls-heading-action')[2].textContent;
    expect(sectionHeader).to.equal('Rollout all');
  });

  it('should return null when project status is not fetched', async () => {
    projectStatus.value = { ...mockActionsdata.projectStatus, projectStatus: true, fetched: false };
    const container = View();
    expect(container).to.be.null;
  });
});
