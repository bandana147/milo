import { getConfig } from '../../utils/utils.js';

const config = getConfig();
const base = config.miloLibs || config.codeRoot;

import(`${base}/deps/blades/blade-changebg.js`);

export default async function init(el) {
  const customElem = document.createElement('blade-changebg');
  customElem.classList.add('blade');
  // Extracting asset keys and urls and passing it to the custom element
  const images = el.querySelectorAll(':scope > div');
  images.forEach((item) => {
    const { children } = item;
    const keyName = children[0].textContent;
    const content = children[1];
    const src = content.querySelectorAll(':scope > picture > img')[0]?.src || content.querySelectorAll(':scope > a')[0]?.href;
    customElem.setAttribute(keyName, src);
  });
  el.innerHTML = '';
  el.append(customElem);

  // Render it inside marquee if its previous sibling is a marquee block
  if (el.previousElementSibling?.classList.contains('marquee')) {
    const marquee = el.previousElementSibling;
    const container = marquee.querySelectorAll(':scope > div:last-child > div:last-child')[0];
    container.innerHTML = '';
    container.append(customElem);
    el.remove();
  }
}
