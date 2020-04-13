import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/User/Users'
import Roles from '@/components/power/Roles'
import Rights from '@/components/power/Rights'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:
        [
          { path: '/welcome', component: Welcome },
          { path: '/users', component: Users },
          { path: '/roles', component: Roles },
          { path: '/rights', component: Rights },
        ]
    }
  ]
})

// 路由导航守卫
// router.beforeEach((to, from, next) => {
//   //to 将要跳转的路径
//   //from 从哪里跳转
//   //next 放行   next()   next("/login")

//   if (to.path === '/login') return next();
//   const tokenStr = window.sessionStorage.getItem('token');
//   if (!tokenStr) return next('/login');
//   next();

// })

export default router