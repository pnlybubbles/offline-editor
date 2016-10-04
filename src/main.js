require('./editor');

const Vue = require('vue');

const contents = new Vue({
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
    }
  }
});

// const previewDocument = document.getElementById('preview').contentDocument;
// const injectScript = previewDocument.createElement('script');
// injectScript.innerHTML = 'console.log("inject")';
// previewDocument.open();
// previewDocument.write(dynamicHTML);
// previewDocument.head.insertBefore(injectScript, previewDocument.head.firstElementChild);
// previewDocument.close();
