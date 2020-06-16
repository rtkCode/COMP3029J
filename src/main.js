import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'
import qs from 'qs';
import global from "./global.js"
import router from './router'

Vue.config.productionTip = false

Vue.use(Antd);
Vue.prototype.$qs = qs
Vue.prototype.$http= axios;
Vue.prototype.$global = global;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
