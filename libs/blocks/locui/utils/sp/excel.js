import { heading, setStatus } from '../state.js';
import { getMSALConfig, getReqOptions } from './msal.js';

export default async function updateExcelTable(values) {
  setStatus('sharepoint', 'info', 'Adding URLs to your project.');
  const { baseUri } = await getMSALConfig();

  const excel = `${heading.value.path}.xlsx`;
  const path = `${baseUri}${excel}:/workbook/tables/URL/rows/add`;
  const options = getReqOptions({ body: { values }, method: 'POST' });

  const res = await fetch(path, options);
  if (!res.ok) {
    setStatus('sharepoint', 'error', 'Fragment found but couldn\'t add the URLs to project.');
    return;
  }
  setStatus('sharepoint');
}
