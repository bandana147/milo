const authoringPath = new URLSearchParams(window.location.search).get('authoringpath') || '/federal/home';
const env = new URLSearchParams(window.location.search).get('env') || 'qa';
const privacyId = new URLSearchParams(window.location.search).get('privacyid');
const locale = new URLSearchParams(window.location.search).get('locale');

async function init() {
  const scriptEnv = env === 'qa' ? 'feds' : env;
  const { default: loadBlock } = await import(`https://${scriptEnv}--milo--adobecom.hlx.page/libs/navigation/navigation.js`);
  loadBlock({ env, locale, footer: { authoringPath, privacyId }, header: { authoringPath, imsClientId: 'milo' } });
}
init();
