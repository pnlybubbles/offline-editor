require('./editor');
require('./view');
const objectAssign = require('object-assign');
const htmlInjector = require('./html-injector');

const Vue = require('vue');

new Vue({
  el: '#editor',
  data: {
    items: [
      {
        title: 'sample.html',
        mode: 'htmlmixed',
        content: '',
        contentUrl: '__dynamic/index.html',
        active: true,
      }, {
        title: 'sample.js',
        mode: 'javascript',
        content: '',
        contentUrl: '__dynamic/index.js',
        active: false,
      }, {
        title: 'sample.css',
        mode: 'css',
        content: '',
        contentUrl: '__dynamic/index.css',
        active: false,
      }, {
        title: 'external.txt',
        mode: '',
        content: '',
        contentUrl: '__dynamic/external.txt',
        active: false,
      },
    ],
  },
  ready() {
    Promise.all(this.items.map((item) => {
      return new Promise((resolve, reject) => {
        if (item.contentUrl) {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', item.contentUrl);
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              item.content = xhr.responseText;
              resolve();
            } else {
              reject(xhr.statusText);
            }
          });
          xhr.addEventListener('timeout', reject);
          xhr.timeout = 2000;
          xhr.send();
        } else {
          resolve();
        }
      });
    })).then(() => {
      this.$broadcast('apply'); // EditorComponent has apply event to set content...
    }).catch((e) => {
      console.error(e);
    });
  },
  methods: {
    focus(index) {
      this.items.forEach((item, i) => {
        item.active = i == index ? true : false;
      });
    },
    run() {
      this.$broadcast('sync'); // EditorComponent has sync event to bind content...
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
