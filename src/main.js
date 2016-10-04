require('./editor');
require('./view');
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
</head>
<body>
</body>
</html>
`,
        active: true,
      }, {
        title: 'sample.js',
        mode: 'javascript',
        content: `console.log(\'Hi, Chieri.\');
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
      let html = null;
      this.items.forEach((item) => {
        if (item.title === 'sample.html') {
          html = item.content;
        }
      });
      if (!html) {
        console.error('Error: entry html not found.');
        return;
      }
      preview.$emit('render', htmlInjector(html, this.items)); // OMG!!!
    },
  },
});

const preview = new Vue({
  el: '#preview',
  data: {
    html: '',
  },
  events: {
    render(str) {
      this.html = str;
    },
  },
});
