import Vue from 'vue'
import Router from 'vue-router'



const Login = () => import('./components/Login.vue')
const Home = () => import('./components/Home.vue')
const Welcome = () => import('./components/Welcome.vue')
const User = () => import('./components/User.vue')
const Rights = () => import('components/User/Rights.vue')
const Roles = () => import('components/User/Roles.vue')
Vue.use(Router)

const routers = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: User
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }]
  }
]


const router = new Router({
  mode: 'history',
  routes: routers
})

// 挂载路由守卫  

router.beforeEach((to, from, next) => {
  // to表示访问的路径
  // from 表示从哪个路径跳转而来
  // next是一个函数 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenLogin = window.sessionStorage.getItem('token');
  if (!tokenLogin) return next('/login')
  next()


})






export default router