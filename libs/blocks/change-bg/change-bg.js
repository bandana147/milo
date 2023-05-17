import { getConfig, createTag } from '../../utils/utils.js';

const config = getConfig();
const base = config.miloLibs || config.codeRoot;

function renderAsset(container, placeHolderImg, images) {
  container.innerHTML = '';
  container.append(placeHolderImg);

  placeHolderImg.addEventListener('load', () => {
    // setTimeout(async () => {
      import(`${base}/deps/blades/blade-changebg.js`);
      const customElem = document.createElement('blade-changebg');
      customElem.classList.add('blade');
      // Extracting asset keys and urls and passing it to the custom element
      images.forEach((item) => {
        const { children } = item;
        const keyName = children[0].textContent;
        const content = children[1];
        const src = content.querySelectorAll(':scope > picture > img')[0]?.src || content.querySelectorAll(':scope > a')[0]?.href;
        customElem.setAttribute(keyName, src);
      });
      container.innerHTML = '';
      container.append(customElem);
    // }, 1000);
  });
}

export default function init(el) {
  const images = el.querySelectorAll(':scope > div');
  const firstImage = images[0]?.children[1];
  const src = firstImage.querySelectorAll(':scope > picture > img')[0]?.src || firstImage.querySelectorAll(':scope > a')[0]?.href;
  const placeHolderImg = createTag('img', { src, class: 'blade' });

  // Render it inside marquee if its previous sibling is a marquee block
  if (el.previousElementSibling?.classList.contains('marquee')) {
    const marquee = el.previousElementSibling;
    const container = marquee.querySelectorAll(':scope > div:last-child > div:last-child')[0];
    renderAsset(container, placeHolderImg, images);
    el.remove();
  } else {
    renderAsset(el, placeHolderImg, images);
  }
}
