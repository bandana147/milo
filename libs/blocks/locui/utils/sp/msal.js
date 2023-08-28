/* global msal */
import { loadScript, getConfig } from '../../../../utils/utils.js';
import { getSiteConfig, spAccessToken } from '../state.js';

let msalConfig;

const login = { redirectUri: '/tools/loc/spauth' };
const siteKeys = ['clientId', 'authority', 'site', 'driveId', 'folderPath'];

const cache = {
  cacheLocation: 'sessionStorage',
  storeAuthStateInCookie: false,
};

const telemetry = {
  application: {
    appName: 'Adobe Franklin Localization',
    appVersion: '0.0.1',
  },
};

export function getMSALConfig() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!msalConfig) {
      const { configs } = await getSiteConfig();
      const { data } = configs;
      const configValues = {};
      siteKeys.forEach((key) => {
        const currentData = data.find((item) => (item.key === `prod.sharepoint.${key}`));
        configValues[key] = currentData?.value;
      });
      const { clientId, authority, site, folderPath = '', driveId } = configValues;
      const paths = folderPath.split('/');
      const root = paths[paths.length - 1];
      const auth = { clientId, authority };
      const config = getConfig();
      const base = config.miloLibs || config.codeRoot;
      await loadScript(`${base}/deps/msal-browser-2.34.0.js`);
      msalConfig = {
        login,
        auth,
        cache,
        telemetry,
        site,
        baseUri: driveId ? `${site}/drives/${driveId}/root:/${root}` : `${site}/drive/root:/${root}`,
        system: {
          loggerOptions: {
            logLevel: msal.LogLevel.Error,
            loggerCallback: (level, message, containsPii) => {
              if (containsPii) { return; }
              switch (level) {
                case msal.LogLevel.Error:
                  console.error(message);
                  return;
                case msal.LogLevel.Info:
                  console.info(message);
                  return;
                case msal.LogLevel.Verbose:
                  console.debug(message);
                  return;
                case msal.LogLevel.Warning:
                  console.warn(message);
                  return;
                default:
                  console.log(message);
              }
            },
          },
        },
      };
      resolve(msalConfig);
    }
    resolve(msalConfig);
  });
}

export function getReqOptions({ body = null, method = 'GET' } = {}) {
  const bearer = `Bearer ${spAccessToken.value}`;
  const headerOpts = { Authorization: bearer, 'Content-Type': 'application/json' };
  const headers = new Headers(headerOpts);
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}
