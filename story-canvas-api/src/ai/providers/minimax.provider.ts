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
          `${this.baseUrl}/text/chatcompletion_v2`,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2048,
            top_p: options?.topP ?? 0.95,
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

      const choice = response.data.choices?.[0]
      return {
        text: choice?.message?.content || choice?.text || '',
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0,
        },
        finishReason: choice?.finish_reason,
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

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/image/generation`,
          {
            model: 'image-01',
            prompt,
            aspect_ratio: '1:1',
            response_format: 'url',
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

      const imageUrl = response.data.data?.image_url || response.data.image_url
      if (!imageUrl) {
        throw new Error('MiniMax 未返回图像 URL')
      }

      return {
        url: imageUrl,
        revisedPrompt: prompt,
        usage: { n: 1 },
      }
    } catch (error) {
      this.logger.error(`MiniMax 图像生成失败: ${error.message}`, error.stack)
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
