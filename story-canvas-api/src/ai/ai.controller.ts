import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { AIService } from './ai.service'
import { AICacheService } from './services/ai-cache.service'
import { GenerateTextDto, GenerateImageDto, TestProviderDto } from './dto/ai.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly cacheService: AICacheService,
  ) {}

  @Post('generate-text')
  async generateText(@Body() dto: GenerateTextDto) {
    return this.aiService.generateText(dto.prompt, {
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    })
  }

  @Post('generate-image')
  async generateImage(@Body() dto: GenerateImageDto) {
    return this.aiService.generateImage(dto.prompt, dto.style)
  }

  @Post('test-provider')
  async testProvider(@Body() dto: TestProviderDto) {
    const startTime = Date.now()
    const provider = this.aiService.getProviderForTest(dto.provider)
    const result = await provider.generateText(
      dto.prompt,
      { temperature: dto.temperature },
    )
    const duration = Date.now() - startTime

    return {
      provider: dto.provider,
      result: result.text,
      duration: `${duration}ms`,
      usage: result.usage,
    }
  }

  @Get('health')
  async healthCheck() {
    const providerHealth = await this.aiService.healthCheck()
    const cacheStats = this.cacheService.getStats()
    const currentProviders = this.aiService.getCurrentProviders()

    return {
      providers: providerHealth,
      currentProviders,
      cache: cacheStats,
    }
  }

  @Get('cache/stats')
  getCacheStats() {
    return this.cacheService.getStats()
  }

  @Post('cache/clear')
  clearCache() {
    this.cacheService.clear()
    return { message: '缓存已清空' }
  }
}
