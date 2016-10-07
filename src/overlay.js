const Vue = require('vue');
const objectAssign = require('object-assign');
const modeDetector = require('./mode-detector');

class Overlay {
  constructor(vm) {
    this.vm = vm;
  }

  open(config) {
    return new Promise((resolve, reject) => {
      this.vm.label = config.label;
      this.vm.title = config.title;
      objectAssign(this.vm.buttons, config.buttons);
      this.vm.show();
      process.nextTick(() => {
        this.vm.$els.title.focus();
      });
      this.vm.$once('close', (res) => {
        if (res != null) {
          resolve(res ? (this.vm.title === '' ? 'notitle' : this.vm.title) : null);
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
      label: 'Label',
      title: '',
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
      titleEl: null,
    },
    computed: {
      filetype() {
        const stat = modeDetector(this.title);
        return stat.mode ? stat.modeDisplay : 'Unknown';
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
