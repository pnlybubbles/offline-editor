require('./editor');
require('./view');
require('./tooltip');
const Vue = require('vue');
const Preview = require('./preview');
const Overlay = require('./overlay');

module.exports = (importedItems) => {
  importedItems = importedItems || [];

  const preview = Preview();
  const overlay = Overlay();

  new Vue({
    el: '#editor',
    data: {
      items: importedItems,
    },
    beforeCompile() {
      this.items.forEach((item, i) => {
        item.active = i === 0 ? true : false;
        item.tooltipVisible = false;
      });
    },
    activate() {
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
          item.active = i == index ? true : false;
        });
      },
      onMouseover(index) {
        const item = this.items[index];
        if (!item.tooltipVisible) {
          item.tooltipShowTimer = setTimeout(() => {
            item.tooltipVisible = true;
          }, 500);
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
        }).then((title) => {
          if (title) {
            this.items.push({
              title: title,
              mode: '',
              content: '',
              active: true,
              tooltipVisible: false,
            });
          }
        });
      },
      rename(index) {
        const item = this.items[index];
        overlay.open({
          label: 'Rename file',
          title: item.title,
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
        }).then((title) => {
          if (title) {
            item.title = title;
          }
        });
      },
      del(index) {
        const item = this.items[index];
        overlay.open({
          label: 'Delete file',
          title: item.title,
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
        }).then((title) => {
          if (title) {
            item.splice(index, 1);
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
