const CodeMirror = require('codemirror');
const Vue = require('vue');
const objectAssign = require('object-assign');

const EditorComponent = Vue.extend({
  template: '<div class="codemirror-container"></div>',
  props: ['content', 'mode', 'active'],
  data() {
    return {
      editor: null,
      defaultOptions: {
        lineNumbers: true,
        matchBrackets: true,
      },
    };
  },
  ready() {
    this.editor = CodeMirror(this.$el);
    Object.keys(this.defaultOptions).forEach((k) => {
      this.editor.setOption(k, this.defaultOptions[k]);
    });
    this.editor.setOption('value', this.content);
    this.$watch('active', (v) => {
      if (v) {
        this.editor.focus();
      }
    }, {
      immediate: true,
    });
    this.$watch('mode', (v) => {
      this.editor.setOption('mode', v);
    }, {
      immediate: true,
    });
    console.log(this.editor.getOption('mode'));
  },
});

Vue.component('editor', EditorComponent);
