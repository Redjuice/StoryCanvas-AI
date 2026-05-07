import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { AIService } from './ai.service'
import { AIController } from './ai.controller'
import { AICacheService } from './services/ai-cache.service'
import { MiniMaxProvider } from './providers/minimax.provider'
import { KimiProvider } from './providers/kimi.provider'
import { QwenProvider } from './providers/qwen.provider'
import { GRSAIProvider } from './providers/grsai.provider'

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AIController],
  providers: [
    AIService,
    AICacheService,
    MiniMaxProvider,
    KimiProvider,
    QwenProvider,
    GRSAIProvider,
  ],
  exports: [AIService],
})
export class AIModule {}
