import Vue from 'vue'
import Router from 'vue-router'



const Login = () => import(/* webpackChunkName: "login_home_welcome"  */ './components/Login.vue')
const Home = () => import( /* webpackChunkName: "login_home_welcome"  */'./components/Home.vue')
const Welcome = () => import( /* webpackChunkName: "login_home_welcome"  */'./components/Welcome.vue')

const User = () => import(/* webpackChunkName: "user_rights_roles"  */'./components/User.vue')
const Rights = () => import(/* webpackChunkName: "user_rights_roles"  */'components/user/Rights.vue')
const Roles = () => import( /* webpackChunkName: "user_rights_roles"  */'components/user/Roles.vue')

const Cate = () => import( /* webpackChunkName: "cate_params"  */'components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params"  */'components/goods/Params.vue')

const GoodList = () => import( /* webpackChunkName: "good_add"  */'components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "good_add"  */'components/goods/Add.vue')

const Order = () => import( /* webpackChunkName: "order_report"  */'components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "order_report"  */'components/report/Report.vue')

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
    },
    {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    },
    {
      path: '/goods',
      component: GoodList,

    }, {
      path: '/goods/add',
      component: Add
    },
    {
      path: '/orders',
      component: Order
    }, {
      path: '/reports',
      component: Report
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