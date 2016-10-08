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
      this.vm.show();
      process.nextTick(() => {
        this.vm.$els.title.focus();
      });
      this.vm.$once('close', (res) => {
        if (typeof res !== 'undefined' && res !== null) {
          resolve({
            result: res,
            title: this.vm.config.title === '' ? 'notitle' : this.vm.config.title,
            mode: this.vm.filestat.mode,
          });
        } else {
          reject();
        }
      });
    });
  }

  close() {
    this.vm.$emit('close');
  }
}

module.exports = () => {
  const vm = new Vue({
    el: '#overlay',
    data: {
      visible: false,
      config: {
        label: 'Label',
        title: '',
        type: 'prompt',
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
    },
    computed: {
      filestat() {
        return modeDetector(this.config.title);
      },
      filetype() {
        return this.filestat.mode ? this.filestat.modeDisplay : 'Unknown';
      },
    },
    methods: {
      show() {
        this.visible = true;
      },
      hide(res) {
        this.visible = false;
        this.$emit('close', res);
      },
    },
  });

  return new Overlay(vm);
};
