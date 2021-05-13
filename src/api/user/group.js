import request from '@/utils/request'
export function getGroups() {
  return request({
    url: '/api/groups/',
    method: 'get',
  })
}
export function addGroup(data) {
  return request({
    url: '/api/groups/',
    method: 'post',
    data
  })
}
export function deleteGroup(data) {
  return request({
    url: '/api/groups/',
    method: 'delete',
    data
  })
}
export function editGroup(data) {
  return request({
    url: '/api/groups/',
    method: 'put',
    data
  })
}

export function getUser(pk) {
  return request({
    url: '/api/group/user/',
    method: 'get',
    params: { pk: pk }
  })
}
export function deleteUser(data) {
  return request({
    url: '/api/group/user/',
    method: 'delete',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/api/group/user/',
    method: 'post',
    data
  })
}
export function getAllusers() {
  return request({
    url: '/api/users/',
    method: 'get',
  })
}

export function getGroupPermission(data) {
  return request({
    url: '/api/group/permission/', 
    method: 'get',
    params: { group_id: data }
  })
}

export function updateGroupPermission(data) {
  return request({
    url: '/api/group/permission/', 
    method: 'put',
    data
  })
}