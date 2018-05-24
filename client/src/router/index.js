import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Layout from '@/components/layout'
import IndexPage from '@/components/index'
import Admin from '@/components/admin'
import Students from '@/components/students'
import Course from '@/components/course'


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children:[
        {
          path: 'index',
          name: 'index',
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          },
          component: IndexPage
        },
        {
          path: 'admin',
          name: 'admin',
          component: Admin
        },
        {
          path: 'students',
          name: 'students',
          component: Students
        },
        {
          path: 'course',
          name: 'course',
          component: Course
        },{
          path: '*',           //其他路径都跳转到首页
          redirect: 'index'
       }
      ]
    },
    {
      path: '*',           //其他路径都跳转到登录
      redirect: 'login'
   }
  ]
})
