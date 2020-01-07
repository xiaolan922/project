import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // @符号代表src绝对路径
  { path: '/login', name: 'login', component: _ => import('@/views/login') },
  { path: '/home', name: 'home', component: _ => import('@/views/home') }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
