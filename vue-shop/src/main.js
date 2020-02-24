import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css' // 全局样式表
import './plugins/element.js' // element组件
import 'element-ui/lib/theme-chalk/index.css' // element组件样式
import './assets/fonts/iconfont.css' // 阿里字体图标
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor' // 富文本编辑器
// require styles 富文本编辑器css
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (date) {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = ('0' + (dt.getMonth() + 1)).slice(-2)
  const d = ('0' + dt.getDate()).slice(-2)
  const hh = ('0' + dt.getHours()).slice(-2)
  const mm = ('0' + dt.getMinutes()).slice(-2)
  const ss = ('0' + dt.getSeconds()).slice(-2)
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
