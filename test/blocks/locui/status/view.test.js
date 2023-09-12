import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/locui/status/view.js';
import { statuses } from '../../../../libs/blocks/locui/utils/state.js';

const status = [{
  type: 'info',
  description: 'Test description',
  text: 'Success',
}];

describe('View', () => {
  before(async () => {
    statuses.value = status;
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should render status', async () => {
    const container = await waitForElement('.locui-status-toast-section');
    expect(container).to.exist;
  });

  it('should refresh languages when refresh button is clicked', async () => {
    const container = await waitForElement('.locui-status-toast-section');
    const toggleContainer = container.querySelector('.locui-status-toast');
    toggleContainer.click();
    expect(toggleContainer.classList[3]).to.equal('open');
  });
});
