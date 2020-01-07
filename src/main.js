import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'

import '@/assets/css/global.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

// 公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 把axios函数写到Vue原型中
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
