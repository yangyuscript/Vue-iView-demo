import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import iView from 'iview'
import 'iView/dist/styles/iview.css'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/components/Index'

Vue.use(Router)
Vue.use(VueResource)
Vue.use(iView)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/index',
      component: Index
    }
  ]
})
