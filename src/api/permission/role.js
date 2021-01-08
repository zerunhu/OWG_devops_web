import request from '@/utils/request'
export function getRoles() {
  return request({
    url: '/api/role/',
    method: 'get',
  })
}
export function addRole(data) {
  return request({
    url: '/api/role/',
    method: 'post',
    data
  })
}
export function deleteRole(pk) {
  return request({
    url: '/api/role/'+pk+"/",
    method: 'delete',
  })
}
export function getUser(pk) {
  return request({
    url: '/api/role/'+pk+'/',
    method: 'get',
  })
}
export function deleteUser(pk,data) {
  return request({
    url: '/api/role/'+pk+"/delete_user/",
    method: 'post',
    data
  })
}
export function addUser(pk,data) {
  return request({
    url: '/api/role/'+pk+"/add_user/",
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