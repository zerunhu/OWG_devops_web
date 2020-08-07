import { asyncRouterMap, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {   //检查route.meta的roles如果有，就匹配下面的规则，主要是来过滤roles和meta.role
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true   //没有定义权限直接默认是true允许访问
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRouterMap
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }   //遍历所有的routes的路由
    if (hasPermission(roles, tmp)) {  //判断是否有用户的role是否在route路由里有权限
      if (tmp.children) {   
        tmp.children = filterAsyncRoutes(tmp.children, roles)  //遍历子来吧所有的子路由权限判断
      }
      res.push(tmp)   //有权限就给字段加一个路由
    }
  })

  return res   //最后返回的是一个这个用户的role有权限访问的route页面
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {   //如果用户是admin的话，直接给所有的权限
        accessedRoutes = asyncRouterMap || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles)   //得到用户能访问的页面
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
