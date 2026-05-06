import { IsString, IsOptional, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string

  @IsString()
  @IsOptional()
  avatar?: string

  @IsString()
  @IsOptional()
  bio?: string
}
