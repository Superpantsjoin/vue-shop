import Vue from 'vue'
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Element from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message
// Vue.use(Element, { size: 'small', zIndex: 3000 })