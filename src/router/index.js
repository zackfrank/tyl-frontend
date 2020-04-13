import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const authGuard = {
  beforeEnter: (to, from, next) => {
    if (localStorage.token) {
      next()
    } else {
      next('/login')
    }
  }
}

const loggedIn = {
  beforeEnter: (to, from, next) => {
    if (store.state.auth.token) {
      next('/')
    } else {
      next()
    }
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Home'),
    ...authGuard
  },
  {
    path: '/login',
    name: 'auth',
    component: () => import('@/components/Auth'),
    ...loggedIn
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/Register'),
    ...loggedIn
  }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
