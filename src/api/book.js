import request from '@/utils/request'
export function getBook() {
  return request({
    url: '/api/books/',
    method: 'get',
  })
}

export function addBook(data) {
    return request({
      url: '/api/books/',
      method: 'post',
      data
    })
  }

export function putBook(id,data) {
    return request({
      url: '/api/books/'+id+'/',
      method: 'put',
      data
    })
  }
  
export function deleteBook(id) {
    return request({
      url: '/api/books/'+id+'/',
      method: 'delete',
    })
  }

export function detailBook(id) {
    return request({
      url: '/api/books/'+id+'/',
      method: 'get',
    })
  }