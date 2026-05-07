import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator'

export class GenerateTextDto {
  @IsString()
  prompt: string

  @IsOptional()
  @IsNumber()
  temperature?: number

  @IsOptional()
  @IsNumber()
  maxTokens?: number
}

export class GenerateImageDto {
  @IsString()
  prompt: string

  @IsOptional()
  @IsString()
  @IsEnum(['256x256', '512x512', '1024x1024'])
  size?: '256x256' | '512x512' | '1024x1024'

  @IsOptional()
  @IsString()
  style?: string
}

export class TestProviderDto {
  @IsString()
  @IsEnum(['minimax', 'kimi', 'qwen', 'grsai'])
  provider: 'minimax' | 'kimi' | 'qwen' | 'grsai'

  @IsString()
  prompt: string

  @IsOptional()
  @IsNumber()
  temperature?: number
}
