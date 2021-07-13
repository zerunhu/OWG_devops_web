import request from '@/utils/request'

export function getCluster() {
  return request({
    url: '/api/cluster/',
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
export function updateWorld(data) {
  return request({
    url: '/api/world/batchUpdate/',
    method: 'post',
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
export function BackupRedis(data) {
  return request({
    url: '/api/world/batchBackup/',
    method: 'post',
    data
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

export function UpdateClientList(data) {
  return request({
    url: '/api/world/clientlist/',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}

export function UpdateSecurityGroup(pk) {
  return request({
    url: '/api/world/'+pk+"/securitygroup/",
    method: 'post',
  })
}
export function batchUpdateSecurityGroup(data) {
  return request({
    url: '/api/world/batchsecuritygroup/',
    method: 'post',
    data
  })
}
export function getWorldUrl(pk) {
  return request({
    url: '/api/world/url/',
    method: 'get',
    params: { id: pk }
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
    url: '/api/world/serverlistonline/',
    method: 'put',
    data
  })
} 
export function addServerlistonline(data) {
  return request({
    url: '/api/world/serverlistonline/',
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
export function operateHistory(type,cluster,worldType) {
  return request({
    url: '/api/world/operateHistory/',
    method: 'get',
    params: { type: type, cluster:cluster, worldType:worldType }
  })
} 


export function getAutoClearDeadNumber(pk) {
  return request({
    url: '/api/world/'+pk+'/autoClearDeadNumber/',
    method: 'get',
  })
} 
export function switchAutoClearDeadNumber(pk,data) {
  return request({
    url: '/api/world/'+pk+'/autoClearDeadNumber/',
    method: 'post',
    data
  })
} 
export function clearDeadNumber(pk) {
  return request({
    url: '/api/world/'+pk+'/clearDeadNumber/',
    method: 'post',
  })
} 