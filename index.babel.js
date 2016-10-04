require('./src/editor');

const Vue = require('vue');

const contents = new Vue({
  el: '#editor',
  data: {
    items: [
      {title: 'alkasdlkfjakljsdflkajdsf', active: true},
      {title: 'b', active: false},
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
