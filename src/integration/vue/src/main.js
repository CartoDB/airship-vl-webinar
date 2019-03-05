import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/as-\w+/];

import '@carto/airship-style/dist/airship.css';

import { defineCustomElements } from '@carto/airship-components/dist/loader';
defineCustomElements(window);



new Vue({
  render: h => h(App)
}).$mount('#app');
