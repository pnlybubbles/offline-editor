exports.default = (html, arrayOfSource, insertScript) => {
  const doc = (new DOMParser()).parseFromString(html, 'text/html');
  arrayOfSource.forEach((obj) => {
    let ejectTag = null;
    let ejectTagAttr = null;
    let injectTag = null;
    switch (obj.mode) {
    case 'javascript':
      ejectTag = 'script';
      ejectTagAttr = 'src';
      injectTag = 'script';
      break;
    case 'css':
      ejectTag = 'link';
      ejectTagAttr = 'href';
      injectTag = 'style';
      break;
    default:
      return;
    }
    const ejectElm = doc.querySelector(`${ejectTag}[${ejectTagAttr}="${obj.title}"]`);
    if (!ejectElm) { return; }
    const injectElm = doc.createElement(injectTag);
    injectElm.innerHTML = obj.content;
    ejectElm.parentNode.replaceChild(injectElm, ejectElm);
  });
  insertScript.forEach((str) => {
    const injectElm = (new DOMParser()).parseFromString(str, 'text/html').querySelector('script');
    doc.head.insertBefore(injectElm, doc.head.firstElementChild);
  });
  return doc.documentElement.outerHTML;
};
