import request from './index'

export const uploadApi = {
  // 获取七牛云上传Token
  getUploadToken(fileName) {
    return request.post('/upload/token', { fileName })
  },

  // 上传文件到七牛云
  async uploadToQiniu(file, onProgress) {
    // 1. 获取上传Token
    const res = await this.getUploadToken(file.name)
    const tokenRes = res.data || res
    if (!tokenRes.token) {
      throw new Error('获取上传凭证失败')
    }

    const { token, key, domain } = tokenRes

    // 2. 构建FormData
    const formData = new FormData()
    formData.append('token', token)
    formData.append('key', key)
    formData.append('file', file)

    // 3. 上传到七牛云 (使用华南区域上传地址)
    const response = await fetch('https://up-z2.qiniup.com', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '上传失败')
    }

    const result = await response.json()

    // 4. 返回文件URL
    return {
      url: `http://${domain}/${result.key}`,
      key: result.key,
      hash: result.hash,
    }
  },
}
