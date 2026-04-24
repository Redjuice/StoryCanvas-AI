import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.qq.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    })
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const appName = this.configService.get('APP_NAME', 'StoryCanvas AI')

    await this.transporter.sendMail({
      from: `"${appName}" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: `【${appName}】密码重置验证码`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">密码重置</h2>
          <p style="color: #666; font-size: 14px;">您好，</p>
          <p style="color: #666; font-size: 14px;">您正在重置密码，验证码为：</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px;">验证码有效期为 10 分钟，请勿泄露给他人。</p>
          <p style="color: #999; font-size: 12px;">如非本人操作，请忽略此邮件。</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #ccc; font-size: 12px; text-align: center;">${appName}</p>
        </div>
      `,
    })
  }
}
