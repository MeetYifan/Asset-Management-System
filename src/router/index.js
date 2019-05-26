import Vue from 'vue'
import Router from 'vue-router'

// 引入组件
// import login from '@/components/login'
// import index from '@/components/index'

// 异步加载
const login = () => import('@/components/login')
const index = () => import('@/components/index')
const home = () => import('@/components/home')
const assetslist = () => import('@/components/assetslist')
// const userlist = () => import('@/components/userlist')
const addasset = () => import('@/components/addasset')
const repair = () => import('@/components/repair')
const usage = () => import('@/components/usage')
const assetsinfo = () => import('@/components/assetsinfo')
const depreciation = () => import('@/components/depreciation')
const personal = () => import('@/components/personal')
const staff = () => import('@/components/staff')
const addstaff = () => import('@/components/addstaff')
const operate = () => import('@/components/operate')

// const passwordedit = () => import('@/components/passwordedit')

// 注册路由
Vue.use(Router)
const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    redirect: '/home',
    name: 'index',
    component: index,
    children: [
      {
        path: '/home',
        name: 'home',
        component: home
      },        
      {
        path: '/assetslist',
        name: 'assetslist',
        component: assetslist,
        children:[
          {
            path:'operate',
            name: 'operate',
            component: operate,
          },
        ]
      },
      {
        path: '/addasset',
        name: 'addasset',
        component: addasset
      },
      {
        path: '/repair',
        name: 'repair',
        component: repair
      },
      {
        path: '/usage',
        name: 'usage',
        component: usage
      },
      {
        path: '/assetsinfo',
        name: 'assetsinfo',
        component: assetsinfo
      },
      {
        path: '/depreciation',
        name: 'depreciation',
        component: depreciation
      },
      {
        path: '/personal',
        name: 'personal',
        component: personal
      },
      {
        path: '/staff',
        name: 'staff',
        component: staff
      },
      {
        path: '/addstaff',
        name: 'addstaff',
        component: addstaff
      }
    ]
  }
]

const router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  let token = window.sessionStorage.getItem('userinfo') 
  const nextRoute = ['home','assetslist','index','addasset','repair','usage','assetsinfo','depreciation','personal','staff','addstaff']
  if (nextRoute.indexOf(to.name) >= 0 && (!token || token === null)) {
    next({
      path: '/login',
      // query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

// console.log('---',routes)




// 导出路由
export default router
