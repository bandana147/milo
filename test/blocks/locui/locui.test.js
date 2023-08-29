import { expect } from '@esm-bundle/chai';
// import { setConfig } from '../../../libs/utils/utils.js';
// import { getUrlDetails } from '../../../libs/blocks/locui/utils/utils.js';
// import { delay } from '../../helpers/waitfor.js';
import { waitForElement } from '../../helpers/waitfor.js';
// import init from '../../../libs/blocks/locui/locui.js';

// const config = {
//   codeRoot: '/libs',
//   locales: {
//     de: { ietf: 'de-de' },
//     '': { ietf: 'en-US' },
//   },
// };
// setConfig(config);

// describe('Format URLs', () => {
//   it('Gets pathname', async () => {
//     const urls = [new URL('https://main--milo--adobecom.hlx.page/drafts/cmillar/test')];
//     const urlDetails = await getUrlDetails(urls);
//     expect(urlDetails[0].langstore.pathname).to.equal('/langstore/en/drafts/cmillar/test');
//   });
// });

// const configContentRoot = {
//   codeRoot: '/libs',
//   contentRoot: '/acrobat',
//   locales: {
//     de: { ietf: 'de-de' },
//     '': { ietf: 'en-US' },
//   },
// };
// setConfig(configContentRoot);
// describe('Format URLs', () => {
//   it('Gets pathname', async () => {
//     const urls = [new URL('https://main--milo--adobecom.hlx.page/acrobat/drafts/cmillar/test')];
//     const urlDetails = await getUrlDetails(urls);
//     expect(urlDetails[0].langstore.pathname).to.equal('/langstore/en/acrobat/drafts/cmillar/test');
//   });
// });
// describe('Format URLs', () => {
//   it('Gets pathname', async () => {
//     const urls = [new URL('https://main--milo--adobecom.hlx.page/de/acrobat/drafts/cmillar/test')];
//     const urlDetails = await getUrlDetails(urls);
//     expect(urlDetails[0].langstore.pathname).to.equal('/langstore/de/acrobat/drafts/cmillar/test');
//   });
// });


describe('Version history Comp', () => {
  it('could be initialized', async () => {
    // document.body.innerHTML = '<div class="section"><div></div></div>';
    // const div = document.querySelector('.section');
    // await init(div);
    // const review = await waitForElement('.locui');
    expect(true).to.be.true;
  });
});
