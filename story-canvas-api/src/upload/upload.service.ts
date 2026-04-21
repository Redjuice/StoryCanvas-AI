import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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

    const key = `stories/${Date.now()}-${fileName}`
    const mac = {
      accessKey,
      secretKey: Buffer.from(secretKey),
    }

    const policy = {
      scope: `${bucket}:${key}`,
      expires: 3600,
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":"$(fsize)","bucket":"$(bucket)"}',
    }

    const encodedPolicy = Buffer.from(JSON.stringify(policy)).toString('base64')
    const signature = this.hmacSha1(encodedPolicy, secretKey)
    const token = `${accessKey}:${this.base64UrlEncode(encodedPolicy)}:${signature}`

    return { token, key, domain }
  }

  getFileUrl(key: string): string {
    const domain = this.configService.get<string>('QINIU_DOMAIN')
    if (!domain) {
      return `https://example.com/${key}`
    }
    return `https://${domain}/${key}`
  }

  private hmacSha1(encodedPolicy: string, secretKey: string): string {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha1', Buffer.from(secretKey))
    hmac.update(encodedPolicy)
    return hmac.digest('base64')
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
}
