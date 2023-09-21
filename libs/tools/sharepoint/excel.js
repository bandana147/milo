// import { heading, setStatus } from '../state.js';
import { getReqOptions } from './msal.js';
import { getBaseUrl } from './file.js';

export default async function updateExcelTable(values, fileName) {
  const excel = `${fileName}.xlsx`;
  const baseUri = await getBaseUrl();
  const path = `${baseUri}${excel}:/workbook/tables/URL/rows/add`;
  const options = getReqOptions({ body: { values }, method: 'POST' });
  return fetch(path, options);
}
