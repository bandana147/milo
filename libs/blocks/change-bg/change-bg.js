import { getConfig, createTag } from '../../utils/utils.js';

const config = getConfig();
const base = config.miloLibs || config.codeRoot;
import(`${base}/deps/blades/blade-changebg.js`);

function renderAsset(container, customElem, placeHolderImg) {
  container.innerHTML = '';
  container.append(placeHolderImg);
  placeHolderImg.addEventListener('load', async () => {
    await import(`${base}/deps/blades/blade-changebg.js`);
  });
  container.innerHTML = '';
  container.append(customElem);
}

export default function init(el) {
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

  const placeHolderImg = createTag('img', { src: images[1]?.children[1]?.querySelectorAll(':scope > picture > img')[0]?.src, class: 'blade' });
  // Render it inside marquee if its previous sibling is a marquee block
  if (el.previousElementSibling?.classList.contains('marquee')) {
    const marquee = el.previousElementSibling;
    const container = marquee.querySelectorAll(':scope > div:last-child > div:last-child')[0];
    renderAsset(container, customElem, placeHolderImg);
    el.remove();
  } else {
    renderAsset(el, customElem, placeHolderImg);
  }
}
