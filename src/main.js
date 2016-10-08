require('./editor');
require('./view');
require('./tooltip');
const Vue = require('vue');
const Preview = require('./preview');
const Overlay = require('./overlay');

module.exports = (importedItems) => {
  importedItems = importedItems || [];

  importedItems.forEach((item, i) => {
    item.active = i === 0 ? true : false;
    item.tooltipVisible = false;
  });

  const preview = Preview();
  const overlay = Overlay();

  new Vue({
    el: '#editor',
    data: {
      items: importedItems,
    },
    ready() {
      Promise.all(this.items.map((item) => {
        return new Promise((resolve, reject) => {
          if (item.contentUrl) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', item.contentUrl);
            xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                item.content = xhr.responseText;
                resolve();
              } else {
                reject(xhr.statusText);
              }
            });
            xhr.addEventListener('timeout', reject);
            xhr.timeout = 2000;
            xhr.send();
          } else {
            resolve();
          }
        });
      })).then(() => {
        this.$broadcast('apply'); // EditorComponent has apply event to set content...
      }).catch((e) => {
        console.error(e);
      });
    },
    methods: {
      focus(index) {
        this.items.forEach((item, i) => {
          if (i === index && item.active) {
            clearTimeout(item.tooltipShowTimer);
            item.tooltipVisible = true;
          } else {
            item.active = i === index ? true : false;
          }
        });
      },
      onMouseover(index) {
        const item = this.items[index];
        if (!item.tooltipVisible) {
          item.tooltipShowTimer = setTimeout(() => {
            item.tooltipVisible = true;
          }, 1000);
        }
        clearTimeout(item.tooltipHideTimer);
      },
      onMouseout(index) {
        const item = this.items[index];
        if (item.tooltipVisible) {
          item.tooltipHideTimer = setTimeout(() => {
            item.tooltipVisible = false;
          }, 200);
        }
        clearTimeout(item.tooltipShowTimer);
      },
      add() {
        overlay.open({
          label: 'Add file',
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
        }).then((ret) => {
          if (ret.result) {
            if (this.items.map((item) => {
              return item.title;
            }).indexOf(ret.title) === -1) {
              this.items.push({
                title: ret.title,
                mode: ret.mode,
                content: '',
                active: false,
                tooltipVisible: false,
              });
              this.focus(this.items.length - 1);
            } else {
              overlay.open({
                label: 'Filename duplicated!',
                title: '',
                type: 'confirm',
                buttons: {
                  left: {
                    label: 'Cancel',
                    class: 'main',
                  },
                  right: {
                    label: 'OK',
                    class: 'main',
                  },
                },
              });
            }
          }
        });
      },
      rename(index) {
        const item = this.items[index];
        overlay.open({
          label: 'Rename file',
          title: item.title,
          type: 'prompt',
          buttons: {
            left: {
              label: 'Cancel',
              class: 'sub',
            },
            right: {
              label: 'Rename',
              class: 'main',
            },
          },
        }).then((ret) => {
          if (ret.result) {
            item.mode = ret.mode;
            item.title = ret.title;
          }
        });
      },
      del(index) {
        const item = this.items[index];
        overlay.open({
          label: 'Delete file',
          title: '',
          type: 'confirm',
          buttons: {
            left: {
              label: 'Cancel',
              class: 'main',
            },
            right: {
              label: 'Delete',
              class: 'sub',
            },
          },
        }).then((ret) => {
          if (ret.result) {
            this.items.splice(index, 1);
          }
        });
      },
      run() {
        this.$broadcast('sync'); // EditorComponent has sync event to bind content...
        preview.$emit('render', this.items); // OMG!!!
      },
    },
  });
};
