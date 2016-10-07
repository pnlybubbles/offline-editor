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
      objectAssign(this.vm.buttons.left, config.buttons.left);
      objectAssign(this.vm.buttons.right, config.buttons.right);
      this.vm.show();
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
    },
    computed: {
      filetype() {
        const stat = modeDetector(this.title);
        return stat.mode ? stat.ext : 'unkown';
      },
    },
    ready() {
      this.hide();
    },
    methods: {
      show() {
        this.$el.style.display = 'block';
        this.$el.querySelector('.title').focus();
      },
      hide(res) {
        this.$el.style.display = 'none';
        this.$emit('close', res);
      },
    },
  });

  return new Overlay(vm);
};
