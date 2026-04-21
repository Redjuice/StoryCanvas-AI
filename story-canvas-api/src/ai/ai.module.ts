import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { AIService } from './ai.service'
import { AIController } from './ai.controller'
import { AICacheService } from './services/ai-cache.service'
import { OpenAIProvider } from './providers/openai.provider'
import { ClaudeProvider } from './providers/claude.provider'
import { GLMProvider } from './providers/glm.provider'

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AIController],
  providers: [
    AIService,
    AICacheService,
    OpenAIProvider,
    ClaudeProvider,
    GLMProvider,
  ],
  exports: [AIService],
})
export class AIModule {}
