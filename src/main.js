require('./editor');
require('./view');
const Vue = require('vue');
const Preview = require('./preview');
const Overlay = require('./overlay');

module.exports = (importedItems) => {
  importedItems = importedItems || [];
  importedItems.forEach((item, i) => {
    item.active = i === 0 ? true : false;
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
          item.active = i == index ? true : false;
        });
      },
      add() {
        overlay.open({
          label: 'Add file',
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
            });
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
