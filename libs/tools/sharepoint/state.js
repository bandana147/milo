import { signal } from '../../deps/htm-preact.js';

const account = signal({});
const accessToken = signal('');
const accessTokenExtra = signal('');
const user = signal('');

export { user, account, accessToken, accessTokenExtra };
