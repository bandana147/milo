/* global msal */
import { user, spAccessToken } from './state.js';
import { getMSALConfig } from './msal.js';

export default async function loginToSharePoint(scope = []) {
  console.log('I am fetching')
  const msalConfig = await getMSALConfig();
  const pca = new msal.PublicClientApplication(msalConfig);

  let account = pca.getAllAccounts()[0];
  if (!account) {
    await pca.loginPopup(msalConfig.login);
    [account] = pca.getAllAccounts();
  }
  user.value = account.username;

  const scopes = scope;
  const reqDetails = { account, scopes };

  try {
    const res = await pca.acquireTokenSilent(reqDetails);
    spAccessToken.value = res.accessToken;
    console.log('I am fetching done', res.accessToken)
  } catch {
    // couldn't get access token
  }
}
