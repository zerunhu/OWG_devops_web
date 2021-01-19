import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

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
export function GetWorldStatus(pk) {
  return request({
    url: '/api/world/'+pk+"/status/",
    method: 'get',
  })
}
export function getHistory(pk) {
  return request({
    url: '/api/world/'+pk+"/history/",
    method: 'get',
  })
}
export function RestartApp(pk,data) {
  return request({
    url: '/api/world/'+pk+"/restart/",
    method: 'post',
    data
  })
}
export function BackupRedis(pk) {
  return request({
    url: '/api/world/'+pk+"/backup/",
    method: 'get',
  })
}
// export function UpdateServerList(data) {
//   var instance = axios.create({
//       baseURL: '',
//       headers: {
//       'Content-Type': 'multipart/form-data',
//       'Authorization': "JWT " +getToken(),
//       }
//   });
//   return instance.post('/api/api/world/serverlist/',data)
// }
export function UpdateServerList(data) {
  return request({
    url: '/api/world/serverlist/',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
export function UpdateSecurityGroup(pk,data) {
  return request({
    url: '/api/world/'+pk+"/securitygroup/",
    method: 'post',
    data
  })
}
export function getServerlistonline(cluster_name,version) {
  return request({
    url: '/api/world/serverlistonline/',
    method: 'get',
    params: { cluster: cluster_name,version: version }
  })
}
export function updateServerlistonline(data) {
  return request({
    url: '/api/world/updateserverlistonline/',
    method: 'post',
    data
  })
} 
export function updateNotice(data) {
  return request({
    url: '/api/world/notice/',
    method: 'post',
    data
  })
} 