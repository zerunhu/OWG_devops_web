import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token: token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


export function getUser() {
  return request({
    url: '/api/users/',
    method: 'get',
  })
}
export function deleteUser(pk) {
  return request({
    url: '/api/users/'+pk+'/',
    method: 'delete',
  })
}
export function addUser(data) {
  return request({
    url: '/api/users/',
    method: 'post',
    data
  })
}
export function getGroups(pk,data) {
  return request({
    url: '/api/GetGroups/',
    method: 'get',
  })
}