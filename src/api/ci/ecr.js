import request from '@/utils/request'
export function GetEcrImages() {
  return request({
    url: '/api/app/',
    method: 'get',
  })
}
export function GetEcrTags(image, cluster) {
    return request({
      url: '/api/ci/image/',
      method: 'get',
      params: { app: image, cluster: cluster }
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