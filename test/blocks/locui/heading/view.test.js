import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/locui/heading/view.js';
import { languages, heading, projectStatus } from '../../../../libs/blocks/locui/utils/state.js';

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
    heading.value = {
      "name": "fBook_001234d3ffplpbn",
      "editUrl": "https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc={B117D213-406A-4B68-A1D0-73DD5E5B56BE}",
      "path": "/drafts/blaishram/fbook-001234d3ffplpbn"
    };
    projectStatus.value = { projectStatusText: 'Waiting'}
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should display the correct title', async () => {
    const container = await waitForElement('.locui-project-heading');
    const firstTitleElem = container.querySelector('h2').textContent;
    expect(firstTitleElem).to.equal('Project');
  });

  it('should display edit button when editUrl is present', async () => {
    const container = await waitForElement('.locui-project-heading');
    const editElem = container.querySelector('.locui-project-details-edit');
    expect(editElem).to.exist;
  });

  it('should refresh languages when refresh button is clicked', async () => {
    const container = await waitForElement('.locui-project-heading');
    const editElem = container.querySelector('.locui-project-details-refresh');
    editElem.click();
    expect(languages.value).to.be.empty;
  });
});
