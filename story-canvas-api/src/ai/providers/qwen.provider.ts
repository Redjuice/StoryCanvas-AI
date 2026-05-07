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
export class QwenProvider implements AIProvider {
  readonly name = 'Qwen (通义千问)'
  readonly providerType: ProviderType = 'qwen'
  private readonly logger = new Logger(QwenProvider.name)
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultModel: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('QWEN_API_KEY') || ''
    this.baseUrl = this.configService.get('QWEN_BASE_URL') || 'https://dashscope.aliyuncs.com/api/v1'
    this.defaultModel = this.configService.get('QWEN_MODEL') || 'qwen-turbo'
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    const model = options?.model || this.defaultModel
    this.logger.log(`Qwen 生成文本, 模型: ${model}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/services/aigc/text-generation/generation`,
          {
            model,
            input: {
              messages: [{ role: 'user', content: prompt }],
            },
            parameters: {
              temperature: options?.temperature ?? 0.7,
              max_tokens: options?.maxTokens ?? 2048,
              top_p: options?.topP ?? 0.95,
              result_format: 'message',
            },
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

      const output = response.data.output
      const usage = response.data.usage

      return {
        text: output?.choices?.[0]?.message?.content || output?.text || '',
        usage: {
          promptTokens: usage?.input_tokens || 0,
          completionTokens: usage?.output_tokens || 0,
          totalTokens: (usage?.input_tokens || 0) + (usage?.output_tokens || 0),
        },
        finishReason: output?.choices?.[0]?.finish_reason,
      }
    } catch (error) {
      this.logger.error(`Qwen 文本生成失败: ${error.message}`, error.stack)
      throw new Error(`Qwen 文本生成失败: ${error.message}`)
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
    this.logger.log(`Qwen 生成图像, 提示词: ${prompt.substring(0, 50)}...`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/services/aigc/text2image/image-synthesis`,
          {
            model: 'wanx-v1',
            input: {
              prompt,
              size: options?.size || '1024x1024',
            },
            parameters: {
              n: options?.n || 1,
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

      const results = response.data.output?.results || response.data.results || []
      return {
        url: results[0]?.url || '',
        revisedPrompt: prompt,
        usage: { n: options?.n || 1 },
      }
    } catch (error) {
      this.logger.error(`Qwen 图像生成失败: ${error.message}`, error.stack)
      this.logger.warn('返回模拟图像结果')
      return {
        url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
        revisedPrompt: prompt,
        usage: { n: 1 },
      }
    }
  }

  async computeEmbedding(text: string): Promise<number[]> {
    this.logger.log(`Qwen 计算 Embedding, 文本长度: ${text.length}`)
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/services/embeddings/text-embedding/text-embedding`,
          {
            model: 'text-embedding-v2',
            input: {
              texts: [text],
            },
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

      const embeddings = response.data.output?.embeddings || []
      return embeddings[0]?.embedding || []
    } catch (error) {
      this.logger.error(`Qwen Embedding 计算失败: ${error.message}`, error.stack)
      throw new Error(`Qwen Embedding 计算失败: ${error.message}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/services/aigc/text-generation/generation`,
          {
            model: this.defaultModel,
            input: {
              messages: [{ role: 'user', content: 'ping' }],
            },
            parameters: {
              max_tokens: 1,
              result_format: 'message',
            },
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
