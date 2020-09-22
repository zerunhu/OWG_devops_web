import request from '@/utils/request'
export function getCluster() {
  return request({
    url: '/api/GetCluster/',
    method: 'get',
  })
}
export function getWorld(cluster, type) {
  return request({
    url: '/api/world/',
    method: 'get',
    params: { cluster: cluster, type: type }
  })
}
export function createWorld(data) {
  return request({
    url: '/api/world/',
    method: 'post',
    data
  })
}
export function getImages(cluster) {
  return request({
    url: '/api/images/',
    method: 'get',
    params: { cluster: cluster }
  })
}
export function updateWorld(pk,data) {
  return request({
    url: '/api/world/'+pk+'/',
    method: 'put',
    data
  })
}
export function deleteWorld(pk) {
    return request({
      url: '/api/world/'+pk+'/',
      method: 'delete',
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
export function ScaleNodeGroup(data) {
    return request({
        url: '/api/nodegroup/1/',
        method: 'put',
        data
    })
  }
