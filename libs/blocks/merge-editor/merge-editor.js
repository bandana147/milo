function importCSS(cssFilePath) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssFilePath;
  document.head.appendChild(link);
}

export default async function init(el) { 
  const rootEl = document.createElement('div');
  rootEl.id = 'root';
  el.append(rootEl)
  await import('../../../build/merge-editor/merge-editor-bundle.js');
  importCSS('../../../build/merge-editor/merge-editor-main.css');
}