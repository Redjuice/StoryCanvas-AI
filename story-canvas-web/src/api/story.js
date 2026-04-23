import axios from './index'

export const createStory = (data) => {
  return axios.post('/stories', data)
}

export const getStoryDetail = (id) => {
  return axios.get(`/stories/${id}`)
}

export const updateStory = (id, data) => {
  return axios.patch(`/stories/${id}`, data)
}

export const deleteStory = (id) => {
  return axios.delete(`/stories/${id}`)
}

export const getStoryList = (params) => {
  return axios.get('/stories', { params })
}

export const regeneratePage = (id, pageNum) => {
  return axios.post(`/stories/${id}/regenerate`, { pageNum })
}
