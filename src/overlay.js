const Vue = require('vue');
const objectAssign = require('object-assign');
const modeDetector = require('./mode-detector');

class Overlay {
  constructor(vm) {
    this.vm = vm;
  }

  open(config) {
    return new Promise((resolve, reject) => {
      objectAssign(this.vm.config, config);
      this.vm.error = null;
      this.vm.show();
      process.nextTick(() => {
        this.vm.$els.title.focus();
      });
      this.vm.$once('close', (res) => {
        if (this.unwatch) { this.unwatch(); }
        if (typeof res !== 'undefined' && res !== null) {
          resolve({
            result: res,
            filename: this.vm.filename,
            mode: this.vm.filestat.mode,
          });
        } else {
          reject();
        }
      });
    });
  }

  errorHandler(cb) {
    this.unwatch = this.vm.$watch('filename', (filename) => {
      this.vm.error = cb(filename);
    }, {immediate: true});
  }

  close() {
    this.vm.$emit('close');
  }
}

module.exports = () => {
  const vm = new Vue({
    el: '#overlay',
    data: {
      visible: true,
      config: {
        label: 'Label',
        title: '',
        subTitle: '',
        type: 'no-plate',
        buttons: {
          left: {
            label: 'Cancel',
            class: 'sub',
          },
          right: {
            label: 'OK',
            class: 'main',
          },
        },
      },
      titleEl: null,
      error: null,
    },
    computed: {
      filestat() {
        return modeDetector(this.config.title);
      },
      filetype() {
        return this.filestat.mode ? this.filestat.modeDisplay : 'Unknown';
      },
      filename() {
        return this.config.title === '' ? 'notitle' : this.config.title;
      },
    },
    methods: {
      show() {
        this.visible = true;
      },
      hide(res) {
        if (!(this.error && res)) {
          this.visible = false;
          this.$emit('close', res);
        }
      },
    },
  });

  return new Overlay(vm);
};
