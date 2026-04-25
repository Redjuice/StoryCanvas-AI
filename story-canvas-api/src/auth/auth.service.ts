import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { MailService } from '../mail/mail.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { SendResetCodeDto } from './dto/send-reset-code.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class AuthService {
  private resetCodes: Map<string, { code: string; expiresAt: Date }> = new Map()

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nickname } = registerDto

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('邮箱已被注册')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: nickname || email.split('@')[0],
      },
    })

    return this.generateToken(user)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('认证失败')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('认证失败')
    }

    return this.generateToken(user)
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email }
    return {
      token: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    }
  }

  async sendResetCode(dto: SendResetCodeDto) {
    const { email } = dto

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    this.resetCodes.set(email, { code, expiresAt })

    // 发送邮件
    try {
      await this.mailService.sendVerificationCode(email, code)
    } catch (error) {
      console.error('邮件发送失败:', error)
      throw new Error(`验证码发送失败: ${error.message}`)
    }

    return { message: '验证码已发送' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, code, newPassword } = dto

    const resetCode = this.resetCodes.get(email)

    if (!resetCode) {
      throw new UnauthorizedException('验证码不存在或已过期')
    }

    if (resetCode.code !== code) {
      throw new UnauthorizedException('验证码错误')
    }

    if (new Date() > resetCode.expiresAt) {
      this.resetCodes.delete(email)
      throw new UnauthorizedException('验证码已过期')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    this.resetCodes.delete(email)

    return { message: '密码重置成功' }
  }
}
