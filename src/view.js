const Vue = require('vue');

const ViewComponent = Vue.extend({
  template: '<div></div>',
  data() {
    return {
      child: null,
    };
  },
  props: {
    html: {
      type: String,
      default: '',
    },
  },
  methods: {
    reload() {
      if (this.child) {
        this.$el.removeChild(this.child);
      }
      this.child = this.$el.appendChild(document.createElement('iframe'));
      const doc = this.child.contentDocument;
      doc.open();
      doc.write(this.html);
      doc.close();
    },
  },
});

Vue.component('view', ViewComponent);
