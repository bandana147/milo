import parseMarkdown from '../../../tools/loc/helix/parseMarkdown.js';
import { mdast2docx } from '../../../tools/loc/helix/mdast2docx.bundle.js';

async function getMD() {
    const md = await fetch('assets/doc-from-sp.md').then((response) => response.text());
    console.log(md);

    console.log('Converting MD to MDAST');
    const mdast = getMdastFromMd(md);
    console.log(mdast);

    console.log('Converting MDAST to DOCX');
    const docx = await mdast2docx(mdast);

    const encodedUri = window.URL.createObjectURL(docx);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample.docx");

    link.click();
}

function getMdastFromMd(mdContent) {
    const state = { content: { data: mdContent }, log: '' };
    parseMarkdown(state);
    return state.content.mdast;
}

export default async function init(el) {
  await getMD();
}