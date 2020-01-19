import Vue from 'vue'
import VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Home')
  },
  {
    path: '/login',
    name: 'auth',
    component: () => import('@/components/Auth')
  }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
