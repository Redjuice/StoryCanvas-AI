import { IsString, IsNumber, IsEnum, Max, Min } from 'class-validator'

export class CreateStoryDto {
  @IsString()
  theme: string

  @IsString()
  @IsEnum(['0-3', '3-6', '6-9'] as const)
  ageGroup: string

  @IsString()
  @IsEnum(['cartoon', 'watercolor', 'illustration'] as const)
  style: string

  @IsNumber()
  @Min(3)
  @Max(10)
  pageCount: number

  @IsNumber()
  @Min(1)
  @Max(4)
  imagesPerPage: number
}
