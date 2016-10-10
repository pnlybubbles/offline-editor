const xhrMock = require('xhr-mock');

xhrMock.setup();

xhrMock.mock((req, res) => {
  let item = null;
  window.__HOOK_OBJECTS.forEach((i) => {
    if (i.title === req.url().replace(document.location.origin + document.location.pathname.replace(/\/[^\/]*?$/, '') + '/', '').replace(/^\.\//, '')) {
      item = i;
    }
  });
  if (item) {
    return res
      .status(200)
      .header('Content-Type', 'text/plain') // OMG!!!
      .body(item.content);
  } else {
    return xhrMock.THROUGH_TO_REAL_XHR;
  }
});
