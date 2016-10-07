const Vue = require('vue');

const TooltipComponent = Vue.extend({
  template: '<div class="__tooltip"><slot></slot></div>',
});

Vue.component('tooltip', TooltipComponent);

const TooltipItemComponent = Vue.extend({
  template: '<div class="__tooltip-item"><slot></slot></div>',
});

Vue.component('tooltip-item', TooltipItemComponent);
