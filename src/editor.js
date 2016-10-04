const CodeMirror = require('codemirror');
const Vue = require('vue');

const EditorComponent = Vue.extend({
  template: '<div class="codemirror-container"></div>',
  props: ['text', 'active'],
  data() {
    return {
      editor: null,
      options: {
        lineNumbers: true
      },
    };
  },
  ready() {
    this.editor = CodeMirror(this.$el);
    Object.keys(this.options).forEach((k) => {
      this.editor.setOption(k, this.options[k]);
    });
    this.editor.setOption('value', this.text);
    this.$watch('active', (v) => {
      if (v) {
        this.editor.focus();
      }
    });
  },
});

Vue.component('editor', EditorComponent);
