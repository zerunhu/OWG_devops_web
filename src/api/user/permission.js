import request from '@/utils/request'
export function getPermission() {
    return request({
      url: '/api/permission/',
      method: 'get',
    })
  }
  export function deletePermission(data) {
    return request({
      url: '/api/permission/',
      method: 'delete',
      data
    })
  }
  export function addPermission(data) {
    return request({
      url: '/api/permission/',
      method: 'post',
      data
    })
  }