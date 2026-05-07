import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import {
  AIProvider,
  ProviderType,
  GenerateOptions,
  GenerationResult,
  ImageGenerateOptions,
  ImageGenerationResult,
} from '../interfaces/ai-provider.interface'

@Injectable()
export class MiniMaxProvider implements AIProvider {
  readonly name = 'MiniMax'
  readonly providerType: ProviderType = 'minimax'
  private readonly logger = new Logger(MiniMaxProvider.name)
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultModel: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('MINIMAX_API_KEY') || ''
    this.baseUrl = this.configService.get('MINIMAX_BASE_URL') || 'https://api.minimax.chat/v1'
    this.defaultModel = this.configService.get('MINIMAX_MODEL') || 'abab6.5s-chat'
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    const model = options?.model || this.defaultModel
    this.logger.log(`MiniMax 生成文本, 模型: ${model}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.minimaxi.com/anthropic/v1/messages',
          {
            model: 'MiniMax-M2.5',
            messages: [{ role: 'user', content: prompt }],
            system: '你是一位世界级的儿童绘本设计师和故事讲述者。你制作的绘本能根据源素材和目标受众进行调整。凡事皆有故事，而你要找到最佳的讲述方式。每一页必须包含以下4个部分：// NARRATIVE GOAL (叙事目标) // KEY CONTENT (关键内容) // VISUAL (视觉画面) // LAYOUT (布局结构) **至关重要 (CRITICAL):** - 避免"标题：副标题"格式，这很AI感 - 禁止"不仅仅是[X]，而是[Y]"这种废话 - 封底不要用"谢谢观看"，要有设计感的结束语',
            stream: false,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          },
        ),
      )

      const content = response.data.content || []
      const textContent = content.find((c: any) => c.type === 'text')
      return {
        text: textContent?.text || '',
        usage: {
          promptTokens: response.data.usage?.input_tokens || 0,
          completionTokens: response.data.usage?.output_tokens || 0,
          totalTokens: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0),
        },
        finishReason: response.data.stop_reason,
      }
    } catch (error) {
      this.logger.error(`MiniMax 文本生成失败: ${error.message}`, error.stack)
      throw new Error(`MiniMax 文本生成失败: ${error.message}`)
    }
  }

  async generateTextBatch(
    prompts: string[],
    options?: GenerateOptions,
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = []
    for (const prompt of prompts) {
      const result = await this.generateText(prompt, options)
      results.push(result)
    }
    return results
  }

  async generateImage(
    prompt: string,
    options?: ImageGenerateOptions,
  ): Promise<ImageGenerationResult> {
    this.logger.log(`MiniMax 生成图像, 提示词: ${prompt.substring(0, 50)}...`)

    const styleMap: Record<string, string> = {
      cartoon: '漫画',
      watercolor: '水彩',
      medieval: '中世纪',
      vitality: '元气',
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.minimaxi.com/v1/image_generation',
          {
            model: 'image-01-live',
            prompt,
            aspect_ratio: '16:9',
            response_format: 'url',
            n: 1,
            prompt_optimizer: true,
            style: {
              style_type: styleMap[options?.style || 'cartoon'] || '漫画',
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 120000,
          },
        ),
      )

      this.logger.debug(`MiniMax 图像生成响应: ${JSON.stringify(response.data)}`)

      const imageUrls = response.data.data?.image_urls || []
      const imageUrl = imageUrls[0]

      if (!imageUrl) {
        this.logger.error(`MiniMax 响应格式异常: ${JSON.stringify(response.data)}`)
        throw new Error('MiniMax 未返回图像 URL')
      }

      return {
        url: imageUrl,
        revisedPrompt: prompt,
        usage: { n: 1 },
      }
    } catch (error) {
      this.logger.error(`MiniMax 图像生成失败: ${error.message}`)
      if (error.response) {
        this.logger.error(`MiniMax 错误响应: ${JSON.stringify(error.response.data)}`)
      }
      this.logger.warn('返回模拟图像结果')
      return {
        url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
        revisedPrompt: prompt,
        usage: { n: 1 },
      }
    }
  }

  async computeEmbedding(text: string): Promise<number[]> {
    this.logger.log(`MiniMax 计算 Embedding, 文本长度: ${text.length}`)
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/embeddings`,
          {
            model: 'embo-01',
            input: text,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          },
        ),
      )
      return response.data.data?.[0]?.embedding || []
    } catch (error) {
      this.logger.error(`MiniMax Embedding 计算失败: ${error.message}`, error.stack)
      throw new Error(`MiniMax Embedding 计算失败: ${error.message}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/text/chatcompletion_v2`,
          {
            model: this.defaultModel,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
            timeout: 5000,
          },
        ),
      )
      return true
    } catch {
      return false
    }
  }
}
