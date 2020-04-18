/*********************
 *
 * @Author: 桔子桑
 * @Date: 2019-07-23 18:26:46
 * @FilePath: /Fund-analysis/src/renderer/router/index.js
 * @Description: 文件描述
 *
*********************/
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: require('@/pages/Index').default
    },
    {
      path: '/FundOverview',
      name: 'FundOverview',
      component: require('@/pages/FundOverview').default
    },
    {
      path: '/FundDetails',
      name: 'FundDetails',
      component: require('@/pages/FundDetails').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
