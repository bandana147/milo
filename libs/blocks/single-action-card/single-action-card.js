/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
* Icon Block - v5.1
*/

import { createTag } from '../../utils/utils.js';

function decorateLayout(el) {
  const foreground = document.createElement('div');
  foreground.classList.add('foreground', 'container');
  el.appendChild(foreground);
  return foreground;
}

function decorateImage(block) {
  const image = block.querySelector(':scope img');
  if (!image) return;
  const wrapper = createTag('div', { class: 'card-image' });
  const picture = image.parentElement.cloneNode(true);
  wrapper.append(picture);
  image.closest('p')?.remove();
  return wrapper;
}

function decorateContent(block) {
  if (!block) return;
  const card = block.querySelector('h1, h2, h3, h4, h5, h6')?.closest('div');
  card?.classList.add('card-block');
  const content = createTag('div', { class: 'card-content' });
  const elems = card?.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  content.append(...elems);
  card.append(content);
  const headings = content?.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings?.[headings.length - 1];
  heading?.classList?.add('heading-XS');
  const paragraphs = content.querySelectorAll(":scope > p");
  paragraphs.forEach((item) => item.classList.add("body-XS"));
  const image = decorateImage(block);
  if (image) card.insertAdjacentElement('afterbegin', image);
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const blocks = el.querySelectorAll(':scope > div:not([class])');
  if (blocks.length > 1) foreground.classList.add('grid');
  [...blocks].forEach(block => {
    decorateContent(block);
    foreground.insertAdjacentElement('beforeEnd', block.children[0]);
    block.remove();
  });
}