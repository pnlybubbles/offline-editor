const CodeMirror = require('codemirror');
const Vue = require('vue');
require('./glsl')(CodeMirror);

const EditorComponent = Vue.extend({
  template: '<div></div>',
  props: {
    mode: {
      type: String,
      default: 'xml',
    },
    active: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
      twoWay: true,
    },
  },
  data() {
    return {
      editor: null,
      defaultOptions: {
        lineNumbers: true,
        matchBrackets: true,
        theme: 'base16',
        scrollbarStyle: null,
        indentWithTabs: false,
        styleActiveLine: true,
        showCursorWhenSelecting: true,
        viewportMargin: Infinity,
        tabSize: 2,
        indentUnit: 2,
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
  },
  events: {
    sync() {
      this.content = this.editor.getDoc().getValue();
    },
    apply() {
      this.editor.getDoc().setValue(this.content);
    },
  },
});

Vue.component('editor', EditorComponent);
