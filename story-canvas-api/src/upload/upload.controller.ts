import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common'
import { UploadService } from './upload.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('token')
  async getToken(@Body('fileName') fileName: string) {
    try {
      if (!fileName) {
        return { token: '', key: '', domain: '', message: '文件名不能为空' }
      }
      return await this.uploadService.getUploadToken(fileName)
    } catch (error) {
      throw new BadRequestException('获取上传令牌失败')
    }
  }
}
