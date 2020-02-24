import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('../components/Welcome.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../components/Users.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('../components/Roles.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('../components/Rights.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('../components/Goods.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('../components/Params.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../components/Categories.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../components/Orders.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../components/Reports.vue')
      },
      {
        path: 'goods/addGoodPage',
        name: 'addGoodPage',
        component: () => import('../components/AddGood.vue')
      }
    ],
    redirect: '/home/welcome'
  }
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由全局守卫

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
