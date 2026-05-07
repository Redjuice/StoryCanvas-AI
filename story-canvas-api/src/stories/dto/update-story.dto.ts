import { IsString, IsOptional, IsArray, ValidateNested, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

class UpdatePageDto {
  @IsInt()
  pageNumber: number

  @IsString()
  @IsOptional()
  content?: string

  @IsString()
  @IsOptional()
  imageUrl?: string
}

export class UpdateStoryDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  cover?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePageDto)
  @IsOptional()
  pages?: UpdatePageDto[]
}
