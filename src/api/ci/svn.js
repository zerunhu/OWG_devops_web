import request from '@/utils/request'
export function getSvnInfo() {
  return request({
    url: '/api/GetSvnInfo/',
    method: 'get',
  })
}