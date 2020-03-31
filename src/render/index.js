import Vue from 'vue'
import router from './router'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Select, Option, Input, Tabs, TabPane, FormItem, Form, ColorPicker, Slider } from 'element-ui'

Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(ColorPicker)
Vue.use(Slider)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
