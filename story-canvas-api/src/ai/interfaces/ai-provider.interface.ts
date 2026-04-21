/**
 * AI Provider 统一接口
 * 所有AI模型适配器必须实现此接口
 */
export interface AIProvider {
  /** 提供商名称 */
  readonly name: string
  readonly providerType: ProviderType

  /**
   * 文本生成
   * @param prompt 提示词
   * @param options 生成选项
   */
  generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult>

  /**
   * 批量文本生成
   * @param prompts 提示词列表
   * @param options 生成选项
   */
  generateTextBatch(prompts: string[], options?: GenerateOptions): Promise<GenerationResult[]>

  /**
   * 图像生成
   * @param prompt 图像描述
   * @param options 生成选项
   */
  generateImage(prompt: string, options?: ImageGenerateOptions): Promise<ImageGenerationResult>

  /**
   * Embedding 计算
   * @param text 输入文本
   */
  computeEmbedding(text: string): Promise<number[]>

  /**
   * 健康检查
   */
  healthCheck(): Promise<boolean>
}

export interface GenerateOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
}

export interface ImageGenerateOptions {
  model?: string
  size?: '256x256' | '512x512' | '1024x1024'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
  n?: number
}

export interface GenerationResult {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
}

export interface ImageGenerationResult {
  url: string
  revisedPrompt?: string
  usage?: {
    n: number
  }
}

export type ProviderType = 'openai' | 'anthropic' | 'glm' | 'custom'

export interface ProviderConfig {
  apiKey: string
  baseUrl?: string
  defaultModel?: string
  timeout?: number
  maxRetries?: number
}

export interface AIServiceConfig {
  textProvider: ProviderType
  imageProvider: ProviderType
  providers: Record<ProviderType, ProviderConfig>
  cache?: {
    enabled: boolean
    ttl: number
    maxSize: number
  }
}
