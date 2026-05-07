# AI 服务模块 - 扩展开发指南

本文档说明如何为 AI 服务模块添加新的 AI 模型适配器。

---

## 1. 模块架构

```
src/ai/
├── interfaces/
│   └── ai-provider.interface.ts    # AI Provider 接口定义
├── providers/
│   ├── minimax.provider.ts         # MiniMax 适配器
│   ├── kimi.provider.ts            # Kimi (Moonshot) 适配器
│   ├── qwen.provider.ts            # 通义千问适配器
│   └── grsai.provider.ts           # GRSAI 适配器
├── services/
│   └── ai-cache.service.ts         # 缓存服务
├── dto/
│   └── ai.dto.ts                   # DTO 定义
├── ai.service.ts                   # AI 主服务
├── ai.controller.ts                # API 控制器
└── ai.module.ts                    # 模块定义
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

### 步骤 2: 更新 ProviderType 类型

编辑 `src/ai/interfaces/ai-provider.interface.ts`，添加新的 provider 类型:

```typescript
export type ProviderType = 'minimax' | 'kimi' | 'qwen' | 'grsai' | 'custom' | 'myprovider'
```

### 步骤 3: 在 Module 中注册

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

### 步骤 4: 在 AIService 中注册

编辑 `src/ai/ai.service.ts`:

1. 在构造函数中注入新的 Provider
2. 在 `getProvider` 方法中添加 case
3. 在 `isProviderConfigured` 方法中添加配置检查
4. 在 `healthCheck` 方法中添加健康检查

```typescript
constructor(
  // ... 其他 providers
  private readonly myProvider: MyProvider,
) {
  // ...
}

private getProvider(type: ProviderType): AIProvider {
  switch (type) {
    case 'minimax':
      return this.minimaxProvider
    case 'kimi':
      return this.kimiProvider
    case 'qwen':
      return this.qwenProvider
    case 'grsai':
      return this.grsaiProvider
    case 'myprovider':  // 添加新case
      return this.myProvider
    default:
      this.logger.warn(`未知的 provider 类型: ${type}，使用默认 MiniMax`)
      return this.minimaxProvider
  }
}

private isProviderConfigured(type: ProviderType): boolean {
  switch (type) {
    // ... 其他 case
    case 'myprovider':
      return !!this.configService.get('MYPROVIDER_API_KEY')
    default:
      return false
  }
}

async healthCheck(): Promise<Record<ProviderType, boolean>> {
  const results: Record<ProviderType, boolean> = {
    minimax: false,
    kimi: false,
    qwen: false,
    grsai: false,
    myprovider: false,  // 添加新 provider
    custom: false,
  }

  results.minimax = await this.minimaxProvider.healthCheck()
  results.kimi = await this.kimiProvider.healthCheck()
  results.qwen = await this.qwenProvider.healthCheck()
  results.grsai = await this.grsaiProvider.healthCheck()
  results.myprovider = await this.myProvider.healthCheck()  // 添加健康检查

  return results
}
```

### 步骤 5: 添加环境变量配置

在 `.env` 文件中添加配置:

```env
MYPROVIDER_API_KEY=your-api-key
MYPROVIDER_MODEL=model-name
MYPROVIDER_BASE_URL=https://api.myprovider.com/v1
```

### 步骤 6: 配置默认使用

在 `.env` 中设置默认 Provider:

```env
AI_TEXT_PROVIDER=minimax    # 可选: minimax | kimi | grsai | myprovider
AI_IMAGE_PROVIDER=qwen      # 可选: qwen | grsai
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

## 4. 配置验证机制

系统启动时会自动验证 AI 提供商配置:

### 验证逻辑

1. **读取环境变量** `AI_TEXT_PROVIDER` 和 `AI_IMAGE_PROVIDER`
2. **验证 API Key** 是否已配置
3. **自动回退** 到第一个可用的提供商
4. **抛出错误** 如果没有可用的提供商

### 提供商优先级

**文本生成** (按优先级排序):
1. MiniMax
2. Kimi (Moonshot)
3. GRSAI

**图像生成** (按优先级排序):
1. Qwen (通义千问)
2. GRSAI

### 配置检查方法

```typescript
private isProviderConfigured(type: ProviderType): boolean {
  switch (type) {
    case 'minimax':
      return !!this.configService.get('MINIMAX_API_KEY')
    case 'kimi':
      return !!this.configService.get('KIMI_API_KEY')
    case 'qwen':
      return !!this.configService.get('QWEN_API_KEY')
    case 'grsai':
      return !!this.configService.get('GRSAI_API_KEY')
    default:
      return false
  }
}
```

---

## 5. 模型切换方式

### 方式 1: 环境变量配置（推荐）

编辑 `.env` 文件:

```env
AI_TEXT_PROVIDER=minimax   # 切换文本生成 Provider
AI_IMAGE_PROVIDER=qwen     # 切换图像生成 Provider
```

### 方式 2: API 动态切换

调用测试接口:

```bash
curl -X POST http://localhost:3000/api/ai/test-provider \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"provider": "kimi", "prompt": "测试"}'
```

---

## 6. 健康检查

访问健康检查接口:

```bash
curl http://localhost:3000/api/health
```

返回示例:

```json
{
  "status": "ok",
  "timestamp": "2026-05-06T10:30:00.000Z",
  "services": {
    "database": true,
    "ai": {
      "minimax": true,
      "kimi": true,
      "qwen": true,
      "grsai": false
    }
  }
}
```

---

## 7. 缓存机制

缓存默认开启，可通过环境变量配置:

```env
AI_CACHE_ENABLED=true
AI_CACHE_TTL=3600000        # 缓存时间（毫秒）
AI_CACHE_MAX_SIZE=1000       # 最大缓存条目
```

---

## 8. 当前支持的提供商

| 提供商 | 类型 | 文本生成 | 图像生成 | 状态 |
|--------|------|---------|---------|------|
| **MiniMax** | 国产 | ✅ | ❌ | 可用 |
| **Kimi** | 国产 | ✅ | ❌ | 可用 |
| **Qwen** | 国产 | ✅ | ✅ | 可用 |
| **GRSAI** | 国产 | ✅ | ✅ | 可用 |

---

**文档版本:** 2.0  
**最后更新:** 2026-05-06
