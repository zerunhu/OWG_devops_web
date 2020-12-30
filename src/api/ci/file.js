import request from '@/utils/request'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

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
export function fileDownload(pk) {
  return request({
      url: '/api/configfile/'+pk+"/download/",
      method: 'post',
      responseType: 'blob',
  })
}
export function fileUpload(data,pk) {
  var instance = axios.create({
    baseURL: '',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': "JWT " +getToken(),
    }
  });
  return instance.post('/api/api/configfile/'+pk+'/upload/',data)
}
export function syncFile(pk) {
  return request({
      url: '/api/configfile/'+pk+"/syncFile/",
      method: 'get',
  })
}

