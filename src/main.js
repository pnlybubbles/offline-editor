require('./editor');
require('./view');
const objectAssign = require('object-assign');
const htmlInjector = require('./html-injector').default;

const Vue = require('vue');

new Vue({
  el: '#editor',
  data: {
    items: [
      {
        title: 'sample.html',
        mode: 'htmlmixed',
        content: `<!DOCTYPE html>
<html>
<head>
  <title></title>
  <script type="text/javascript" src="sample.js"></script>
  <link rel="stylesheet" type="text/css" href="sample.css">
</head>
<body>
  <h3>Hi, Chieri!</h3>
  <pre id="external"></pre>
</body>
</html>
`,
        active: true,
      }, {
        title: 'sample.js',
        mode: 'javascript',
        content: `console.log(\'Hi, Chieri.\');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'external.txt');
xhr.onreadystatechange = function() {
  document.getElementById('external').innerHTML = xhr.responseText;
};
xhr.send();
`,
        active: false,
      }, {
        title: 'sample.css',
        mode: 'css',
        content: `body {
  background-color: #fdf;
}
`,
        active: false,
      }, {
        title: 'external.txt',
        mode: '',
        content: `Chieri is so cute!
`,
        active: false,
      },
    ],
  },
  methods: {
    focus(index) {
      this.items.forEach((item, i) => {
        item.active = i == index ? true : false;
      });
    },
    run() {
      this.$broadcast('sync'); // EditorComponent has sync event...
      preview.$emit('render', this.items); // OMG!!!
    },
  },
});

const preview = new Vue({
  el: '#preview',
  data: {
    html: '',
  },
  events: {
    render(items) {
      let html = null;
      items.forEach((item) => {
        if (item.title === 'sample.html') {
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
