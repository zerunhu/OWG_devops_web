import request from '@/utils/request'
export function getOperationPlan(type) {
    return request({
        url: '/api/plan/',
        method: 'get',
        params: { type: type }
    })
}
export function detailOperationPlan(pk) {
    return request({
        url: '/api/plan/'+pk+"/",
        method: 'get',
    })
}
export function addOperationPlan(data) {
    return request({
      url: '/api/plan/',
      method: 'post',
      data
    })
} 
export function updateOperationPlan(pk,data) {
    return request({
      url: '/api/plan/'+pk+"/",
      method: 'put',
      data
    })
} 
export function completeOperationPlan(pk) {
    return request({
      url: '/api/plan/'+pk+"/complete/",
      method: 'post',
    })
} 
export function deleteOperationPlan(pk) {
    return request({
      url: '/api/plan/'+pk+"/",
      method: 'delete',
    })
} 
export function getImages(cluster) {
    return request({
      url: '/api/images/',
      method: 'get',
      params: { cluster: cluster }
    })
  }
export function getWorlds() {
    return request({
        url: '/api/world/prodworld/',
        method: 'get',
    })
}