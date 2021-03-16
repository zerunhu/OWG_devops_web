import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        // component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      },
      {
        path: 'menu3',
        component: () => import('@/views/nested/menu3/index'),
        name: 'Menu3',
        meta: { title: 'menu3' },
        // children: [
        //   {
        //     path: 'menu3-1',
        //     component: () => import('@/views/nested/menu3/menu1-detail'),
        //     name: 'Menu3-detail',
        //     meta: { title: 'Menu3-detail1111' }
        //   } 
        // ]
      },
      {
        path: 'menu/:id(\\d+)',
        component: () => import('@/views/nested/menu3/menu1-detail'),
        name: 'menudetail',
        meta: { 
          title: 'menu', 
          noCache: true, 
          activeMenu: '/nested/menu',
        },
        hidden: true
      },
      {
        path: 'test',
        component: () => import('@/views/nested/test/index'),
        name: 'test',
        meta: { title: 'test' },
      }
    ]
  },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    name: 'Permission',
    alwaysShow: true,
    meta: { roles: ['admin'] , title: "Permission", icon: 'edit' }, 
    children: [
    { 
      path: 'role',
      component: () => import('@/views/permission/'),
      name: 'Role Permission',
      meta: { roles: ['admin'] , title: "Role Permission" } 
    },
    { 
      path: 'role/:id(\\d+)',
      component: () => import('@/views/permission/detail'),
      name: 'role详情',
      meta: { roles: ['admin'] , title: "RoleDetail" },
      hidden: true
    },
  ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'User',
    alwaysShow: true,
    meta: { roles: ['admin'] , title: "User", icon: 'user' }, 
    children: [
    { 
      path: '',
      component: () => import('@/views/user/'),
      name: 'User Manager',
      meta: { roles: ['admin'] , title: "User Manager" } 
    },
  ]
  },
  {
    path: '/integration',
    component: Layout,
    name: 'ci',
    alwaysShow: true,
    meta: { roles: ['admin',"Development","Operation"] , title: "ContinuousIntegra", icon: 'ci' }, //页面需要的权限
    children: [
    { 
      path: 'svn',
      component: () => import('@/views/ci/svn/'),
      name: 'svn测试页面',
      meta: { roles: ['admin',"Development","Operation"] , title: "Svn List" }  
    },
    { 
      path: 'ci',
      component: () => import('@/views/ci/cicontainers/'),
      name: '创建ci_container界面',
      meta: { roles: ['admin',"Development","Operation"] , title: "CI List" }  
    },
    { 
      path: 'image',
      component: () => import('@/views/ci/ecr/'),
      name: 'ecr_image信息',
      meta: { roles: ['admin',"Development","Operation"] , title: "Image List" }  
    },
    { 
      path: 'file/edit/:id(\\d+)',
      component: () => import('@/views/ci/file/edit'),
      name: 'config详情修改',
      meta: { roles: ['admin',"Development","Operation"] , title: "File" },
      hidden: true
    },
    {
      path: 'file/list',
      component: () => import('@/views/ci/file/list'),
      name: 'config_file列表',
      meta: { roles: ['admin',"Development"] , title: 'Config List' }
    }
    ]
  },
  {
    path: '/deploy',
    component: Layout,
    name: 'cd',
    alwaysShow: true,
    meta: { roles: ['admin',"Development","Operation"] , title: "ContinuousDeploy", icon: 'cd' }, //页面需要的权限
    children: [
    { 
      path: 'cluster',
      component: () => import('@/views/cd/cluster/'),
      name: 'cluster',
      meta: { roles: ['admin',"Development","Operation"] , title: "Cluster" }  
    },
    { 
      path: 'nodegroup',
      component: () => import('@/views/cd/nodegroup/'),
      name: 'nodegroup',
      meta: { roles: ['admin',"Development","Operation"] , title: "Nodegroup" }  
    },
    { 
      path: 'world',
      component: () => import('@/views/cd/world/index'),
      name: 'world',
      meta: { roles: ['admin',"Development","Operation"] , title: "World" },
    },
    { 
      path: 'world/serverlist',
      component: () => import('@/views/cd/world/serverlist'),
      name: 'world_serverlist',
      meta: { roles: ['admin',"Development","Operation"] , title: "ServerList"},
      hidden: true,
    },
    ]
  },
  {
    path: '/plan',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Operation Plan',
        component: () => import('@/views/operationplan/index'),
        meta: { title: 'Operation Plan', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
