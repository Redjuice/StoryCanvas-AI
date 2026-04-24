import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { SendResetCodeDto } from './dto/send-reset-code.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: '登出成功' }
  }

  @Post('send-reset-code')
  @HttpCode(HttpStatus.OK)
  async sendResetCode(@Body() dto: SendResetCodeDto) {
    return this.authService.sendResetCode(dto)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }
}
