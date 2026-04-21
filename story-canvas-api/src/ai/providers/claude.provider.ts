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
export class ClaudeProvider implements AIProvider {
  readonly name = 'Anthropic Claude'
  readonly providerType: ProviderType = 'anthropic'
  private readonly logger = new Logger(ClaudeProvider.name)
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultModel: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('ANTHROPIC_API_KEY') || ''
    this.baseUrl = this.configService.get('ANTHROPIC_BASE_URL') || 'https://api.anthropic.com/v1'
    this.defaultModel = this.configService.get('ANTHROPIC_MODEL') || 'claude-3-opus-20240229'
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    const model = options?.model || this.defaultModel
    this.logger.log(`Claude 生成文本, 模型: ${model}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/messages`,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens || 4096,
            top_p: options?.topP,
            stop_sequences: options?.stop,
          },
          {
            headers: {
              'x-api-key': this.apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          },
        ),
      )

      return {
        text: response.data.content[0]?.text || '',
        usage: {
          promptTokens: response.data.usage?.input_tokens || 0,
          completionTokens: response.data.usage?.output_tokens || 0,
          totalTokens: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0),
        },
        finishReason: response.data.stop_reason,
      }
    } catch (error) {
      this.logger.error(`Claude 文本生成失败: ${error.message}`, error.stack)
      throw new Error(`Claude 文本生成失败: ${error.message}`)
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
    _prompt: string,
    _options?: ImageGenerateOptions,
  ): Promise<ImageGenerationResult> {
    this.logger.warn('Claude 当前不支持图像生成，请使用其他提供商')
    throw new Error('Claude 当前不支持图像生成')
  }

  async computeEmbedding(_text: string): Promise<number[]> {
    this.logger.warn('Claude 当前不支持 Embedding，请使用其他提供商')
    throw new Error('Claude 当前不支持 Embedding')
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/messages`,
          {
            model: this.defaultModel,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          },
          {
            headers: {
              'x-api-key': this.apiKey,
              'anthropic-version': '2023-06-01',
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
