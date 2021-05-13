import request from '@/utils/request'
export function GetNodegroup(cluster) {
  return request({
    url: '/api/nodegroup/',
    method: 'get',
    params: { cluster: cluster }
  })
}
export function getCluster() {
  return request({
    url: '/api/cluster/',
    method: 'get',
  })
}
export function GetRealLog(path) {
  return request({
    url: '/api/RealLog/',
    method: 'get',
    params: { path: path }
  })
}
export function DeleteRealLog(data) {
  return request({
      url: '/api/RealLog/',
      method: 'delete',
      data
  })
}
export function ScaleNodeGroup(pk,data) {
    return request({
        url: '/api/nodegroup/'+pk+'/',
        method: 'put',
        data
    })
  }
