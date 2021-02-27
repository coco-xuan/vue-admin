import Vue from 'vue'



import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main } from 'element-ui'
// import { lang } from 'element-ui/lib/locale/lang/zh-CN'
// import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css';

// locale.use(lang)
// import format from 'element-ui/lib/locale/format'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message
