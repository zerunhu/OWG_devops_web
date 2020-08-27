import request from '@/utils/request'
export function Filelist() {
  return request({
    url: '/api/configfile/',
    method: 'get',
  })
}
export function Fileedit(pk) {
return request({
    url: '/api/configfile/'+pk+"/",
    method: 'get',
})
}
export function Filepush(pk,data) {
return request({
    url: '/api/configfile/'+pk+"/",
    method: 'put',
    data
})
}