const Vue = require('vue');
const objectAssign = require('object-assign');
const htmlInjector = require('./html-injector');

module.exports = () => {
  return new Vue({
    el: '#preview',
    data: {
      html: '',
    },
    events: {
      render(items) {
        let html = null;
        items.forEach((item) => {
          if (item.title === 'index.html') {
            html = item.content;
          }
        });
        if (!html) {
          console.error('Error: entry html not found.');
          return;
        }
        const escapedItem = items.map((v) => {
          return objectAssign({}, v, {content: escape(v.content)});
        });
        const hookItems = [
          `<script>window.__HOOK_OBJECTS = ${JSON.stringify(escapedItem)}; window.__HOOK_OBJECTS.forEach(function(v) { v.content = unescape(v.content); });</script>`, // OMG!!!!!
          '<script type="text/javascript" src="__static/hook.js"></script>',
        ];
        this.html = htmlInjector(html, items, hookItems);
      },
    },
  });
};
