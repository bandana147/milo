/* eslint-disable no-await-in-loop */
import { getMSALConfig, getReqOptions } from './msal.js';

const { baseUri } = await getMSALConfig();

function getDocDetails(path) {
  const parentArr = path.split('/');
  const name = parentArr.pop();
  const file = name.endsWith('.json') ? name.replace('.json', '.xlsx') : `${name}.docx`;
  const folder = parentArr.join('/');
  const split = file.split('.');
  return { folder, name: file, lockName: `${split[0]} (lock copy).${split[1]}` };
}

export async function getItem(path) {
  const docDetails = getDocDetails(path);
  const fullpath = `${baseUri}${docDetails.folder}/${docDetails.name}`;
  const options = getReqOptions();
  const resp = await fetch(fullpath, options);
  const json = await resp.json();
  return json;
}
