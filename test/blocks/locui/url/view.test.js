import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/locui/url/view.js';
import { urls } from '../../../../libs/blocks/locui/utils/state.js';
import { mockFetch } from '../../../helpers/generalHelpers.js';

const docUrls = [{
  actions: {
    edit: {
      url: 'fetchEditUrl',
      status: 200,
    },
    preview: {
      url: 'https://locui--milo--adobecom.hlx.page/drafts/blaishram/document2',
      status: 200,
    },
    live: {
      url: 'https://locui--milo--adobecom.hlx.live/drafts/blaishram/document2',
      status: 200,
    },
  },
  langStore: {
    lang: 'en',
    pathname: '/langstore/en/drafts/blaishram/document2',
    actions: {
      edit: {
        url: 'fetchEditUrl',
        status: 200,
      },
      preview: {
        url: 'https://locui--milo--adobecom.hlx.page/langstore/en/drafts/blaishram/document2',
        status: 200,
      },
      live: {
        url: 'https://locui--milo--adobecom.hlx.live/langstore/en/drafts/blaishram/document2',
        status: 404,
      },
    },
  },
  userInfo: {
    lastModifiedBy: 'Bandana Laishram',
    lastModifiedDateTime: '2023-07-21T06:11:46Z',
  },
}];

describe('View', () => {
  before(async () => {
    urls.value = docUrls;
    const review = html`<${View} item=${docUrls[0]} idx=${0}/>`;
    render(review, document.body);
  });

  it('should display the correct title', async () => {
    const payload = [{ id: 1, name: 'Test' }];
    window.fetch = mockFetch({ payload });
    const container = await waitForElement('.locui-url');
    const firstTitleElem = container.querySelector('h3').textContent;
    expect(firstTitleElem).to.equal('Path');
  });

  // it('should refresh languages when refresh button is clicked', async () => {
  //   const container = await waitForElement('.locui-status-toast-section');
  //   const toggleContainer = container.querySelector('.locui-status-toast');
  //   toggleContainer.click();
  //   expect(toggleContainer.classList[3]).to.equal('open');
  // });
});
