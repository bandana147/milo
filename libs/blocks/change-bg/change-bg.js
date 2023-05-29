import { getConfig, createTag } from '../../utils/utils.js';

const config = getConfig();
const base = config.miloLibs || config.codeRoot;
const assetKeys = {
  colorOverlayUrl: 'colorOverlayUrl',
  subjectUrl: 'yogaLadyUrl',
  bgScene1Url: 'scene1Url',
  bgScene2Url: 'scene2Url',
  bgPattern1Url: 'pattern1Url',
  bgPattern2Url: 'pattern2Url'
}

function renderAsset(container, placeHolderImg, images) {
  container.innerHTML = '';
  container.append(placeHolderImg);

  placeHolderImg.addEventListener('load', async () => {
      await import(`${base}/deps/blades/blade-changebg.js`);
      const customElem = document.createElement('blade-changebg');
      customElem.classList.add('blade');
      // Extracting asset keys and urls and passing it to the custom element
      images.forEach((item) => {
        const { children } = item;
        const keyName = children[0].textContent;
        const content = children[1];
        const src = content.querySelectorAll(':scope > picture > img')[0]?.src || content.querySelectorAll(':scope > a')[0]?.href;
        customElem.setAttribute(assetKeys[keyName], src);
      });
      container.innerHTML = '';
      container.append(customElem);
  });
}

export default function init(el) {
  const images = el.querySelectorAll(':scope > div');
  const firstImage = images[2]?.children[1];
  const src = firstImage.querySelectorAll(':scope > picture > img')[0]?.src || firstImage.querySelectorAll(':scope > a')[0]?.href;
  const placeHolderImg = createTag('img', { src, class: 'blade-placeholder' });

  // Render it inside marquee if its previous sibling is a marquee block
  if (el.previousElementSibling?.classList.contains('marquee')) {
    const marquee = el.previousElementSibling;
    const container = marquee.querySelectorAll(':scope > div:last-child > div:last-child')[0];
    renderAsset(container, placeHolderImg, images);
    el.remove();
  } else {
    renderAsset(el, placeHolderImg, images);
  }

  // const labels = el.querySelectorAll(':scope > div:nth-child(odd)');
  // const customElem = document.createElement('blade-changebg');
  // customElem.classList.add('blade');
  
  // //construct the attribute here and pass
  // const items = [...labels].map((label, idx) => {
  //   const type = label.children[0].textContent;
  //   const images = (label.nextElementSibling.firstElementChild).querySelectorAll(':scope > picture');
  //   customElem.setAttribute(`type-${idx+1}`, type);
  //   images.forEach((img, imgIndex)=> {
  //     const src = img.getElementsByTagName('img')[0]?.src || img.getElementsByTagName(':scope > a')[0]?.href;
  //     customElem.setAttribute(`${type}${imgIndex+1}Url`, src);
  //   })
  // });
  // console.log(customElem)

  // //pass the schema
  // const schema = [];
  // [...labels].map((label) => {
  //   let item = {};
  //   const type = label.children[0].textContent;
  //   item.label = type;
  //   item.images = [];
  //   const images = (label.nextElementSibling.firstElementChild).querySelectorAll(':scope > picture');
  //   images.forEach((img)=> {
  //     const src = img.getElementsByTagName('img')[0]?.src || img.getElementsByTagName(':scope > a')[0]?.href;
  //     item.images.push(src);
  //   })
  //   schema.push(item)
  // });

  // console.log(schema);
}
