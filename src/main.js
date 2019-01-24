// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// 引入 element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App'
import router from './router'
import store from './vuex/store'

// 引入 axios
import axios from 'axios'
// 挂载到 Vue 的原型上
Vue.prototype.axios = axios

// 注册 element-ui
Vue.use(ElementUI);

Vue.config.productionTip = false


// store.dispatch('GET_USERLIST').then(() => {
//   console.log('用户数据：', store.state.userList)
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
