import axios from './index'

export const login = (data) => {
  return axios.post('/auth/login', data)
}

export const register = (data) => {
  return axios.post('/auth/register', data)
}

export const getUserInfo = () => {
  return axios.get('/user/info')
}

export const updateUserInfo = (data) => {
  return axios.patch('/user/info', data)
}

export const logout = () => {
  return axios.post('/auth/logout')
}

export const sendResetCode = (data) => {
  return axios.post('/auth/send-reset-code', data)
}

export const resetPassword = (data) => {
  return axios.post('/auth/reset-password', data)
}
