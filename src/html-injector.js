exports.default = (html, arrayOfSource) => {
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
  return doc.documentElement.outerHTML;
};
