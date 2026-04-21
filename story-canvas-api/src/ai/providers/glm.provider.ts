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
export class GLMProvider implements AIProvider {
  readonly name = 'Zhipu AI (GLM)'
  readonly providerType: ProviderType = 'glm'
  private readonly logger = new Logger(GLMProvider.name)
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultModel: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('GLM_API_KEY') || ''
    this.baseUrl = this.configService.get('GLM_BASE_URL') || 'https://open.bigmodel.cn/api/paas/v4'
    this.defaultModel = this.configService.get('GLM_MODEL') || 'glm-4'
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    const model = options?.model || this.defaultModel
    this.logger.log(`GLM 生成文本, 模型: ${model}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/chat/completions`,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2048,
            top_p: options?.topP,
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

      return {
        text: response.data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0,
        },
        finishReason: response.data.choices[0]?.finish_reason,
      }
    } catch (error) {
      this.logger.error(`GLM 文本生成失败: ${error.message}`, error.stack)
      throw new Error(`GLM 文本生成失败: ${error.message}`)
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
    const model = options?.model || 'cogview-3'
    this.logger.log(`GLM 生成图像, 模型: ${model}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/images/generations`,
          {
            model,
            prompt,
            n: options?.n || 1,
            size: options?.size || '1024x1024',
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

      return {
        url: response.data.data[0]?.url || '',
        revisedPrompt: prompt,
        usage: { n: response.data.data.length },
      }
    } catch (error) {
      this.logger.error(`GLM 图像生成失败: ${error.message}`, error.stack)
      throw new Error(`GLM 图像生成失败: ${error.message}`)
    }
  }

  async computeEmbedding(text: string): Promise<number[]> {
    this.logger.log(`GLM 计算 Embedding, 文本长度: ${text.length}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/embeddings`,
          {
            model: 'embedding-2',
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

      return response.data.data[0]?.embedding || []
    } catch (error) {
      this.logger.error(`GLM Embedding 计算失败: ${error.message}`, error.stack)
      throw new Error(`GLM Embedding 计算失败: ${error.message}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/chat/completions`,
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
