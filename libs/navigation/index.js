const authoringPath = new URLSearchParams(window.location.search).get('authoringpath') || '/federal/home';
const env = new URLSearchParams(window.location.search).get('env') || 'qa';
const privacyId = new URLSearchParams(window.location.search).get('privacyid');
const locale = new URLSearchParams(window.location.search).get('locale');
const navBranch = new URLSearchParams(window.location.search).get('navbranch');

async function init() {
  const { default: loadBlock } = await import(`https://${navBranch}--milo--adobecom.hlx.page/libs/navigation/navigation.js`);
  loadBlock({ env, locale, footer: { authoringPath, privacyId }, header: { authoringPath, imsClientId: 'milo' } });
}
init();
