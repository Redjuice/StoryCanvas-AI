import { Injectable, Logger } from '@nestjs/common'
import { createHash } from 'crypto'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

@Injectable()
export class AICacheService {
  private readonly logger = new Logger(AICacheService.name)
  private readonly cache: Map<string, CacheEntry<any>> = new Map()
  private readonly ttl: number
  private readonly maxSize: number

  constructor(ttl: number = 3600000, maxSize: number = 1000) {
    this.ttl = ttl
    this.maxSize = maxSize
    this.startCleanupTimer()
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.logger.debug(`缓存已过期: ${key}`)
      return null
    }

    this.logger.debug(`缓存命中: ${key}`)
    return entry.value as T
  }

  set<T>(key: string, value: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl || this.ttl),
    })
    this.logger.debug(`缓存设置: ${key}`)
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.logger.log('缓存已清空')
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < oldestTime) {
        oldestTime = entry.expiresAt
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.logger.debug(`缓存驱逐(达到最大数量): ${oldestKey}`)
    }
  }

  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now()
      let cleaned = 0

      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(key)
          cleaned++
        }
      }

      if (cleaned > 0) {
        this.logger.debug(`缓存清理: 清除 ${cleaned} 个过期项`)
      }
    }, 60000)
  }

  generateKey(prompt: string, options?: Record<string, any>): string {
    const data = JSON.stringify({ prompt, options })
    return createHash('sha256').update(data).digest('hex').substring(0, 16)
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    }
  }
}
