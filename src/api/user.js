import request from '@/utils/request'
import axios from 'axios';
export function login(data) {
  return axios({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return axios({
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
