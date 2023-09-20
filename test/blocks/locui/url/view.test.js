import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View, { handleAction } from '../../../../libs/blocks/locui/url/view.js';
// import { mockFetch } from '../../../helpers/generalHelpers.js';
import { mockRes } from '../../global-navigation/test-utilities.js';
import { urls } from '../../../../libs/blocks/locui/utils/state.js';
import { mockPayload, docUrls } from './urls-mockdata.js';

describe('View', () => {
  before(async () => {
    const review = html`<${View} item=${docUrls[0]} idx=${0}/>`;
    urls.value = [...docUrls];
    render(review, document.body);
  });

  it('should display the correct title', async () => {
    const container = await waitForElement('.locui-url');
    const firstTitleElem = container.querySelector('h3').textContent;
    expect(firstTitleElem).to.equal('Path');
  });

  it('should display the page path', async () => {
    const container = await waitForElement('.locui-url');
    const urlPath = container.querySelector('.locui-url-path').textContent;
    expect(urlPath).to.eql('/drafts/sharathkannan/docs/discover');
    sinon.restore();
    sinon.reset();
  });

  it('should call handleAction when button is clicked', async () => {
    const container = await waitForElement('.locui-url');
    const toggleContainer = container.querySelector('.locui-url-action.locui-url-action-view');
    const stub = sinon.stub(window, 'open');
    toggleContainer.click();
    expect(stub.called).to.be.true;
    sinon.restore();
    sinon.reset();
  });

  it('should call handleAction and open the doc in an editable url', async () => {
    sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: mockPayload }));
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    const test = sinon.stub(window, 'open');
    urls.value = [...docUrls];
    await handleAction('fetchEditUrl', '/drafts/sharathkannan/docs/discover', '0', 'source');
    expect(test.called).to.be.true;
  });

  it('should contain last modified by', async () => {
    const container = await waitForElement('.locui-url');
    const lastModifiedBy = container.querySelector('.locui-user-info').childNodes[1].textContent;
    expect(lastModifiedBy).to.eql('Bandana Laishram');
    sinon.restore();
  });
});
