import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/locui/loc/view.js';
import { mockFetch } from '../../../helpers/generalHelpers.js';

const ogFetch = window.fetch;

describe('View', () => {
  afterEach(() => {
    // Do not build up any test state - reset window.fetch to it's original state
    window.fetch = ogFetch;
  });

  beforeEach(async () => {
    window.msal = {
      PublicClientApplication: function t() {
        return {
          getAllAccounts: () => [{ username: 'test' }],
          loginPopup: sinon.stub().resolves(),
          acquireTokenSilent: sinon.stub().resolves({ accessToken: 'fake-access-token' }),
        };
      },
    };
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should display the correct title', async () => {
    const payload = [{ id: 1, name: 'Test' }];
    window.fetch = mockFetch({ payload });
    const container = await waitForElement('.locui');
    const firstTitleElem = container.querySelector('h1')[0];
    console.log(firstTitleElem, 'firstTitleElem');
    expect(firstTitleElem).to.equal('Milo Localizationd');
  });
});
