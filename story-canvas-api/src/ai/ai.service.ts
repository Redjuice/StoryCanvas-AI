import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenAIProvider } from './providers/openai.provider'
import { ClaudeProvider } from './providers/claude.provider'
import { GLMProvider } from './providers/glm.provider'
import { AICacheService } from './services/ai-cache.service'
import {
  AIProvider,
  ProviderType,
  GenerateOptions,
  GenerationResult,
  ImageGenerateOptions,
  ImageGenerationResult,
} from './interfaces/ai-provider.interface'

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name)
  private readonly textProvider: AIProvider
  private readonly imageProvider: AIProvider

  constructor(
    private readonly configService: ConfigService,
    private readonly openAIProvider: OpenAIProvider,
    private readonly claudeProvider: ClaudeProvider,
    private readonly glmProvider: GLMProvider,
    private readonly cacheService: AICacheService,
  ) {
    const textProviderType = (this.configService.get('AI_TEXT_PROVIDER') || 'openai') as ProviderType
    const imageProviderType = (this.configService.get('AI_IMAGE_PROVIDER') || 'openai') as ProviderType

    this.textProvider = this.getProvider(textProviderType)
    this.imageProvider = this.getProvider(imageProviderType)

    this.logger.log(`文本生成 provider: ${this.textProvider.name}`)
    this.logger.log(`图像生成 provider: ${this.imageProvider.name}`)
  }

  getProviderForTest(type: ProviderType): AIProvider {
    return this.getProvider(type)
  }

  private getProvider(type: ProviderType): AIProvider {
    switch (type) {
      case 'openai':
        return this.openAIProvider
      case 'anthropic':
        return this.claudeProvider
      case 'glm':
        return this.glmProvider
      default:
        this.logger.warn(`未知的 provider 类型: ${type}，使用默认 OpenAI`)
        return this.openAIProvider
    }
  }

  async generateStory(theme: string, ageGroup: string, pageCount: number): Promise<GenerationResult> {
    const prompt = this.buildStoryPrompt(theme, ageGroup, pageCount)
    return this.textProvider.generateText(prompt)
  }

  async generatePageText(storyContext: string, pageNum: number): Promise<GenerationResult> {
    const prompt = `基于以下故事背景，为第${pageNum}页生成1-2句话的文本描述：\n\n${storyContext}`
    return this.textProvider.generateText(prompt)
  }

  async generateImage(prompt: string, style?: string): Promise<ImageGenerationResult> {
    const fullPrompt = this.buildImagePrompt(prompt, style)
    return this.imageProvider.generateImage(fullPrompt)
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    const cacheKey = this.cacheService.generateKey(prompt, options)
    const cached = this.cacheService.get<GenerationResult>(cacheKey)
    if (cached) {
      return cached
    }

    const result = await this.textProvider.generateText(prompt, options)
    this.cacheService.set(cacheKey, result)
    return result
  }

  async generateImageWithCache(
    prompt: string,
    options?: ImageGenerateOptions,
  ): Promise<ImageGenerationResult> {
    const cacheKey = this.cacheService.generateKey(prompt, options)
    const cached = this.cacheService.get<ImageGenerationResult>(cacheKey)
    if (cached) {
      return cached
    }

    const fullPrompt = this.buildImagePrompt(prompt)
    const result = await this.imageProvider.generateImage(fullPrompt, options)
    this.cacheService.set(cacheKey, result, 86400000)
    return result
  }

  async healthCheck(): Promise<Record<ProviderType, boolean>> {
    const results: Record<ProviderType, boolean> = {
      openai: false,
      anthropic: false,
      glm: false,
      custom: false,
    }

    results.openai = await this.openAIProvider.healthCheck()
    results.anthropic = await this.claudeProvider.healthCheck()
    results.glm = await this.glmProvider.healthCheck()

    return results
  }

  getCurrentProviders(): { text: string; image: string } {
    return {
      text: this.textProvider.name,
      image: this.imageProvider.name,
    }
  }

  private buildStoryPrompt(theme: string, ageGroup: string, pageCount: number): string {
    const ageDescriptions: Record<string, string> = {
      '0-3': '适合0-3岁幼儿，语言极其简单，重复性强',
      '3-6': '适合3-6岁儿童，语言简单有趣，有一定情节',
      '6-9': '适合6-9岁儿童，语言丰富，情节完整',
    }

    return `请为一个${ageGroup}岁的孩子创作一个关于"${theme}"的绘本故事。
要求：
1. 共${pageCount}页，每页1-2句话
2. 语言${ageDescriptions[ageGroup] || '适合儿童'}
3. 故事情节生动有趣
4. 返回JSON格式：{"title": "故事标题", "pages": ["第1页文字", "第2页文字", ...]}`
  }

  private buildImagePrompt(text: string, style?: string): string {
    const styles: Record<string, string> = {
      cartoon: '卡通风格，可爱活泼',
      watercolor: '水彩画风格，梦幻柔和',
      illustration: '插画风格，精美细致',
    }

    return `${text}, ${styles[style || 'cartoon']}, 儿童绘本插图，高质量，色彩鲜艳`
  }
}
