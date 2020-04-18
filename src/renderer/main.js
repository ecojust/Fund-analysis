/*********************
 *
 * @Author: 桔子桑
 * @Date: 2019-07-24 01:40:10
 * @FilePath: /Fund-analysis/src/renderer/main.js
 * @Description: 文件描述
 *
*********************/
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'


import GeminiScrollbar from 'vue-gemini-scrollbar'
Vue.use(GeminiScrollbar)


import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
 



if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
