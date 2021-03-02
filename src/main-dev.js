import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/base.css'
import './assets/font/iconfont.css'
// import ElementUI from 'element-ui'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'





Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config

})













Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})







new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
