import Vue from 'vue'
import VueRouter from 'vue-router'

const authGuard = {
  beforeEnter: (to, from, next) => {
    if (localStorage.token) {
      next()
    } else {
      from.name ? next(from) : next('/login')
    }
  }
}

const alreadyLoggedIn = {
  beforeEnter: (to, from, next) => {
    if (!localStorage.token) {
      next()
    } else {
      from.name ? next(from) : next('/')
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
    ...alreadyLoggedIn
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/Register'),
    ...alreadyLoggedIn
  }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
