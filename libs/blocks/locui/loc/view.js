import { html, useEffect } from '../../../deps/htm-preact.js';
import setDetails, { loginToSharePoint } from './index.js';
import { heading, languages, urls, showLogin } from '../utils/state.js';

import Heading from '../heading/view.js';
import Langs from '../langs/view.js';
import Actions from '../actions/view.js';
import Urls from '../urls/view.js';
import Status from '../status/view.js';

export default function Localization() {
  useEffect(() => {
    loginToSharePoint();
    setDetails();
  }, []);

  return html`
    <h1>Milo Localization</h1>
    ${showLogin.value ? html`<div class=login-error-container><p>The login popup was blocked. Please use the button below.</p>
    <button class=login-action onClick="${loginToSharePoint}">Open login</button></div>`: html`
    ${heading.value.editUrl && html`<${Heading} />`}
    ${urls.value.length > 0 && html`<${Actions} />`}
    ${languages.value.length > 0 && html`<${Langs} />`}
    ${urls.value.length > 0 && html`<${Urls} />`}`}
    <${Status} />`;
}
