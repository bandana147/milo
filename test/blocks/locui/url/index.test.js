import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import setActions, { getDetails, getFileName, formatDate, getUrl } from '../../../../libs/blocks/locui/url/index.js';
import { mockRes } from '../../global-navigation/test-utilities.js';
import { urls } from '../../../../libs/blocks/locui/utils/state.js';
import { mockPayload, docUrls } from './urls-mockdata.js';

describe('View', () => {
  before(async () => {
    urls.value = [...docUrls];
  });
  it('should return a filename', () => {
    const filename = getFileName('https://test/doc/path/Doc.aspx?file=doc.docx');
    expect(filename).eql('doc.docx');
  });
  it('should format date', async () => {
    const formattedDate = formatDate('04/13/2023');
    expect(formattedDate).eql('4/13/23');
  });

  it('should format date', async () => {
    const formattedDate = formatDate('2015');
    expect(formattedDate).to.not.be.null;
  });

  it('should return detail object with actions key', async () => {
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: mockPayload }));
    const test = await getDetails('/drafts/sharathkannan/docs/discover');
    expect(test).to.have.keys(['actions', 'userInfo']);
    sinon.restore();
  });
  it('should return detail object with actions key', async () => {
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    const tempPayload = { ...mockPayload };
    delete tempPayload.edit.url;
    sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: tempPayload }));
    const test = await getDetails('/drafts/sharathkannan/docs/discover');
    expect(test).to.have.keys(['actions', 'userInfo']);
    sinon.restore();
  });
  it('should call the fetch method when langstore.actions is not present', async () => {
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    const fetchStub = sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: mockPayload }));
    const tempDocUrls = [...docUrls];
    delete tempDocUrls[0].langstore.actions;
    urls.value = tempDocUrls;
    await setActions(0);
    expect(fetchStub.called).to.be.true;
    sinon.restore();
  });
  it('should call the fetch method when  actions is not present', async () => {
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    const tempDocUrls = [...docUrls];
    delete tempDocUrls[0].actions;
    urls.value = tempDocUrls;
    const fetchStub = sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: mockPayload }));
    await setActions(0);
    expect(fetchStub.called).to.be.true;
    sinon.restore();
  });

  it('should return an edit url', async () => {
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: mockPayload }));
    const editUrl = await getUrl('/drafts/sharathkannan/docs/discover', 0);
    expect(editUrl).to.not.be.null;
    sinon.restore();
  });

  it('should return an edit url for langstore type', async () => {
    sinon.stub(URLSearchParams.prototype, 'get').returns('dev');
    sinon.stub(window, 'fetch').callsFake(() => mockRes({ payload: mockPayload }));
    const editUrl = await getUrl('/drafts/sharathkannan/docs/discover', 0, 'langstore');
    expect(editUrl).to.not.be.null;
    sinon.restore();
  });
});
