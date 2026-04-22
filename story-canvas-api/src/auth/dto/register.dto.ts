import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Password123', description: '密码，最少6位' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string

  @ApiPropertyOptional({ example: '昵称', description: '用户昵称' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string
}
