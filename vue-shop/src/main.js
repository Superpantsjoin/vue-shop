import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css' // 全局样式表
import './plugins/element.js' // element组件
import 'element-ui/lib/theme-chalk/index.css' // element组件样式
import './assets/fonts/iconfont.css' // 阿里字体图标
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
