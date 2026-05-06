import request from './index'

export function getUserInfo() {
  return request.get('/user/info')
}

export function updateUserInfo(data) {
  return request.patch('/user/info', data)
}

export function changePassword(data) {
  return request.post('/auth/change-password', data)
}
