import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as qiniu from 'qiniu'

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)

  constructor(private readonly configService: ConfigService) {}

  getUploadToken(fileName: string): { token: string; key: string; domain: string } {
    const accessKey = this.configService.get<string>('QINIU_ACCESS_KEY')
    const secretKey = this.configService.get<string>('QINIU_SECRET_KEY')
    const bucket = this.configService.get<string>('QINIU_BUCKET')
    const domain = this.configService.get<string>('QINIU_DOMAIN') || ''

    if (!accessKey || !secretKey || !bucket) {
      this.logger.warn('七牛云配置不完整，返回模拟token')
      return {
        token: 'mock-token-' + Date.now(),
        key: `stories/${Date.now()}-${fileName}`,
        domain,
      }
    }

    const key = `avatars/${Date.now()}-${fileName}`

    // 使用七牛云 SDK 生成上传凭证
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const options = {
      scope: `${bucket}:${key}`,
      expires: 3600,
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const token = putPolicy.uploadToken(mac)

    return { token, key, domain }
  }

  getFileUrl(key: string): string {
    const domain = this.configService.get<string>('QINIU_DOMAIN')
    if (!domain) {
      return `https://example.com/${key}`
    }
    return `http://${domain}/${key}`
  }
}
