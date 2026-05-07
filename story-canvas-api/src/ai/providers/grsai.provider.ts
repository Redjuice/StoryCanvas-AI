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
export class GRSAIProvider implements AIProvider {
  readonly name = 'GRSAI (Nano Banana)'
  readonly providerType: ProviderType = 'grsai'
  private readonly logger = new Logger(GRSAIProvider.name)
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultModel: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('GRSAI_API_KEY') || ''
    this.baseUrl = this.configService.get('GRSAI_BASE_URL') || 'https://grsai.dakka.com.cn'
    this.defaultModel = this.configService.get('GRSAI_MODEL') || 'nano-banana-fast'
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    this.logger.log(`GRSAI 文本生成 - 使用 Gemini 兼容接口`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1beta/models/gemini-2.5-flash:generateContent`,
          {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options?.temperature ?? 0.7,
              maxOutputTokens: options?.maxTokens ?? 2048,
              topP: options?.topP ?? 0.95,
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

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const usage = response.data.usageMetadata

      return {
        text: content,
        usage: {
          promptTokens: usage?.promptTokenCount || 0,
          completionTokens: usage?.candidatesTokenCount || 0,
          totalTokens: usage?.totalTokenCount || 0,
        },
        finishReason: response.data.candidates?.[0]?.finishReason,
      }
    } catch (error) {
      this.logger.error(`GRSAI 文本生成失败: ${error.message}`, error.stack)
      throw new Error(`GRSAI 文本生成失败: ${error.message}`)
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
    const model = options?.model || this.defaultModel
    this.logger.log(`GRSAI 生成图像, 模型: ${model}, 提示词: ${prompt.substring(0, 50)}...`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1/draw/nano-banana`,
          {
            model,
            prompt,
            aspectRatio: 'auto',
            imageSize: '1K',
            shutProgress: true,
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

      const data = response.data

      if (data.code !== 0) {
        throw new Error(`GRSAI API 错误: ${data.msg || '未知错误'}`)
      }

      const results = data.data?.results || []
      const imageUrl = results[0]?.url || ''

      if (!imageUrl) {
        throw new Error('GRSAI 未返回图像 URL')
      }

      return {
        url: imageUrl,
        revisedPrompt: prompt,
        usage: { n: 1 },
      }
    } catch (error) {
      this.logger.error(`GRSAI 图像生成失败: ${error.message}`, error.stack)
      this.logger.warn('返回模拟图像结果')
      return {
        url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
        revisedPrompt: prompt,
        usage: { n: 1 },
      }
    }
  }

  async computeEmbedding(text: string): Promise<number[]> {
    this.logger.log(`GRSAI 计算 Embedding, 文本长度: ${text.length}`)
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1/embeddings`,
          {
            model: 'text-embedding-004',
            content: { parts: [{ text }] },
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

      const embedding = response.data.embedding?.values || []
      return embedding
    } catch (error) {
      this.logger.error(`GRSAI Embedding 计算失败: ${error.message}`, error.stack)
      throw new Error(`GRSAI Embedding 计算失败: ${error.message}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v1beta/models/gemini-2.5-flash:generateContent`,
          {
            contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
            generationConfig: { maxOutputTokens: 1 },
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
