import { IsString, IsOptional } from 'class-validator'

export class UpdateStoryDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  cover?: string
}
