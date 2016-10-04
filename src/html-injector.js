exports.default = (html, arrayOfSource) => {
  const doc = (new DOMParser()).parseFromString(html, 'text/html');
  arrayOfSource.forEach((obj) => {
    let ejectTag = null;
    let injectTag = null;
    switch (obj.mode) {
    case 'javascript':
      ejectTag = 'script';
      injectTag = 'script';
      break;
    case 'css':
      ejectTag = 'link';
      injectTag = 'style';
      break;
    default:
      return;
    }
    const ejectElm = doc.querySelector(`${ejectTag}[src="${obj.title}"]`);
    const injectElm = doc.createElement(injectTag);
    injectElm.innerHTML = obj.content;
    ejectElm.parentNode.replaceChild(injectElm, ejectElm);
  });
  return doc.documentElement.outerHTML;
};
