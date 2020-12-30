import request from '@/utils/request'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

export function fileUpload(data,pk) {
  var instance = axios.create({
    baseURL: '',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': "JWT " +getToken(),
    }
  });
  return instance.post('/api/test',data)
}
export function update_serverList(data) {
    var instance = axios.create({
        baseURL: '',
        headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': "JWT " +getToken(),
        }
    });
    return instance.post('/api/test',data)
}


