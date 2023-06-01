import { html, render } from '../../deps/htm-preact.js';

export default async function init(el) {
  const x = await fetch('https://version-history--milo--bandana147.hlx.page/drafts/blaishram/document1.plain.html');
  render(x, el);
}
