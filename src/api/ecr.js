import request from '@/utils/request'
export function GetEcrImages() {
  return request({
    url: '/api/GetEcrImages/',
    method: 'get',
  })
}
export function GetEcrTags(image) {
    return request({
      url: '/api/GetEcrTags/',
      method: 'get',
      params: { app: image }
    })
  }
// export function testapi() {
//     return request({
//       url: '/api/testapi/',
//       method: 'get',
//     })
//   }
// export function pushData(data) {
//   return request({
//     url: '/api/testapi/',
//     method: 'post',
//     data
//   })
// }
// export function healapi(image) {
// return request({
//     url: '/api/healthy/',
//     method: 'get',
// })
// }