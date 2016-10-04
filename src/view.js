const Vue = require('vue');

const ViewComponent = Vue.extend({
  template: '<iframe></iframe>',
  props: {
    html: {
      type: String,
      default: '',
    },
  },
  ready() {
    const doc = this.$el.contentDocument;
    this.$watch('html', (str) => {
      doc.open();
      doc.write(str);
      doc.close();
    }, {
      immediate: true,
    });
  },
});

Vue.component('view', ViewComponent);
