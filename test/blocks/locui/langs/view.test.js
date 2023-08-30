import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/locui/langs/view.js';
import { languages } from '../../../../libs/blocks/locui/utils/state.js';

const selLanguages = [
  {
      "Language": "Vietnamese",
      "Action": "English Copy",
      "Locales": "",
      "Workflow": "",
      "size": 3,
      "locales": [
          "vn_vi"
      ],
      "localeCode": "vi"
  },
  {
      "Language": "Hindi",
      "Action": "Translate",
      "Locales": "",
      "Workflow": "",
      "size": 3,
      "locales": [],
      "localeCode": "hi"
  }
];

describe('View', () => {
  before(async () => {
    languages.value = selLanguages;
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should display the correct title', async () => {
    const container = await waitForElement('.locui-section');
    const firstTitleElem = container.querySelector('h2').textContent;
    expect(firstTitleElem).to.equal('Languages');
  });

  it('should display correct language card number', async () => {
    const container = await waitForElement('.locui-section');
    const localeElem = container.querySelectorAll('.locui-subproject');
    expect(localeElem.length).to.equal(selLanguages.length);
  });
});
