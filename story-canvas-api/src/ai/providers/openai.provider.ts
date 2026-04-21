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
  ProviderConfig,
} from '../interfaces/ai-provider.interface'

@Injectable()
export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI'
  readonly providerType: ProviderType = 'openai'
  private readonly logger = new Logger(OpenAIProvider.name)
  private readonly config: ProviderConfig

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.config = {
      apiKey: this.configService.get('OPENAI_API_KEY') || '',
      baseUrl: this.configService.get('OPENAI_BASE_URL') || 'https://api.openai.com/v1',
      defaultModel: this.configService.get('OPENAI_MODEL') || 'gpt-4',
      timeout: this.configService.get('OPENAI_TIMEOUT') || 60000,
      maxRetries: this.configService.get('OPENAI_MAX_RETRIES') || 3,
    }
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    const model = options?.model || this.config.defaultModel
    this.logger.log(`生成文本, 模型: ${model}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/chat/completions`,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2000,
            top_p: options?.topP,
            frequency_penalty: options?.frequencyPenalty,
            presence_penalty: options?.presencePenalty,
            stop: options?.stop,
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: this.config.timeout,
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
      this.logger.error(`OpenAI 文本生成失败: ${error.message}`, error.stack)
      throw new Error(`OpenAI 文本生成失败: ${error.message}`)
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
    const model = options?.model || 'dall-e-3'
    const size = options?.size || '1024x1024'
    this.logger.log(`生成图像, 模型: ${model}, 提示词: ${prompt.substring(0, 50)}...`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/images/generations`,
          {
            model,
            prompt,
            n: options?.n || 1,
            size,
            quality: options?.quality || 'standard',
            style: options?.style || 'vivid',
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: (this.config.timeout || 60000) * 2,
          },
        ),
      )

      return {
        url: response.data.data[0]?.url || '',
        revisedPrompt: response.data.data[0]?.revised_prompt,
        usage: { n: response.data.data.length },
      }
    } catch (error) {
      this.logger.error(`OpenAI 图像生成失败: ${error.message}`, error.stack)
      throw new Error(`OpenAI 图像生成失败: ${error.message}`)
    }
  }

  async computeEmbedding(text: string): Promise<number[]> {
    this.logger.log(`计算 Embedding, 文本长度: ${text.length}`)

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/embeddings`,
          {
            model: 'text-embedding-3-small',
            input: text,
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: this.config.timeout,
          },
        ),
      )

      return response.data.data[0]?.embedding || []
    } catch (error) {
      this.logger.error(`OpenAI Embedding 计算失败: ${error.message}`, error.stack)
      throw new Error(`OpenAI Embedding 计算失败: ${error.message}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.config.baseUrl}/models`, {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          timeout: 5000,
        }),
      )
      return response.status === 200
    } catch {
      return false
    }
  }
}
