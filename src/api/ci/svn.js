import request from '@/utils/request'
export function getSvnInfo() {
  return request({
    url: '/api/svninfo/',
    method: 'get',
  })
}