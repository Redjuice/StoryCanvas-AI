# AI 服务模块 - 扩展开发指南

本文档说明如何为 AI 服务模块添加新的 AI 模型适配器。

---

## 1. 模块架构

```
src/ai/
├── interfaces/
│   └── ai-provider.interface.ts    # AI Provider 接口定义
├── providers/
│   ├── openai.provider.ts        # OpenAI 适配器
│   ├── claude.provider.ts         # Claude 适配器
│   └── glm.provider.ts           # GLM 适配器
├── services/
│   └── ai-cache.service.ts       # 缓存服务
├── dto/
│   └── ai.dto.ts                 # DTO 定义
├── ai.service.ts                 # AI 主服务
├── ai.controller.ts              # API 控制器
└── ai.module.ts                  # 模块定义
```

---

## 2. 添加新模型适配器步骤

### 步骤 1: 创建适配器文件

在 `src/ai/providers/` 目录下创建新的适配器文件，例如 `myprovider.provider.ts`:

```typescript
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
export class MyProvider implements AIProvider {
  readonly name = 'My AI Provider'
  readonly providerType: ProviderType = 'custom'
  private readonly logger = new Logger(MyProvider.name)
  
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async generateText(prompt: string, options?: GenerateOptions): Promise<GenerationResult> {
    // 实现文本生成逻辑
  }

  async generateTextBatch(prompts: string[], options?: GenerateOptions): Promise<GenerationResult[]> {
    // 实现批量文本生成
  }

  async generateImage(prompt: string, options?: ImageGenerateOptions): Promise<ImageGenerationResult> {
    // 实现图像生成（可选）
  }

  async computeEmbedding(text: string): Promise<number[]> {
    // 实现 Embedding 计算（可选）
  }

  async healthCheck(): Promise<boolean> {
    // 实现健康检查
  }
}
```

### 步骤 2: 在 Module 中注册

编辑 `src/ai/ai.module.ts`，添加新的 Provider:

```typescript
import { Module } from '@nestjs/common'
import { MyProvider } from './providers/myprovider.provider'

@Module({
  providers: [
    // ... 其他 providers
    MyProvider,
  ],
  // ...
})
export class AIModule {}
```

### 步骤 3: 在 AIService 中注册

编辑 `src/ai/ai.service.ts`，在 `getProvider` 方法中添加 case:

```typescript
private getProvider(type: ProviderType): AIProvider {
  switch (type) {
    case 'openai':
      return this.openAIProvider
    case 'anthropic':
      return this.claudeProvider
    case 'glm':
      return this.glmProvider
    case 'custom':  // 添加新case
      return this.myProvider
    default:
      return this.openAIProvider
  }
}
```

### 步骤 4: 添加环境变量配置

在 `.env` 文件中添加配置:

```env
MYPROVIDER_API_KEY=your-api-key
MYPROVIDER_MODEL=model-name
MYPROVIDER_BASE_URL=https://api.myprovider.com/v1
```

### 步骤 5: 配置默认使用

在 `.env` 中设置默认 Provider:

```env
AI_TEXT_PROVIDER=custom
AI_IMAGE_PROVIDER=custom
```

---

## 3. 接口规范

所有适配器必须实现 `AIProvider` 接口:

| 方法 | 说明 | 必需 |
|------|------|------|
| `name` | 提供商名称 | 是 |
| `providerType` | 提供商类型 | 是 |
| `generateText()` | 文本生成 | 是 |
| `generateTextBatch()` | 批量文本生成 | 是 |
| `generateImage()` | 图像生成 | 可选 |
| `computeEmbedding()` | Embedding 计算 | 可选 |
| `healthCheck()` | 健康检查 | 是 |

---

## 4. 模型切换方式

### 方式 1: 环境变量配置（推荐）

编辑 `.env` 文件:

```env
AI_TEXT_PROVIDER=openai   # 切换文本生成 Provider
AI_IMAGE_PROVIDER=glm    # 切换图像生成 Provider
```

### 方式 2: API 动态切换

调用测试接口:

```bash
curl -X POST http://localhost:3000/api/ai/test-provider \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"provider": "glm", "prompt": "测试"}'
```

---

## 5. 健康检查

访问健康检查接口:

```bash
curl http://localhost:3000/api/ai/health \
  -H "Authorization: Bearer <token>"
```

返回示例:

```json
{
  "providers": {
    "openai": true,
    "anthropic": true,
    "glm": false
  },
  "currentProviders": {
    "text": "OpenAI",
    "image": "OpenAI"
  },
  "cache": {
    "size": 10,
    "maxSize": 1000,
    "ttl": 3600000
  }
}
```

---

## 6. 缓存机制

缓存默认开启，可通过环境变量配置:

```env
AI_CACHE_ENABLED=true
AI_CACHE_TTL=3600000        # 缓存时间（毫秒）
AI_CACHE_MAX_SIZE=1000       # 最大缓存条目
```

---

**文档版本:** 1.0  
**最后更新:** 2026-04-20
