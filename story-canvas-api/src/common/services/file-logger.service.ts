import { Injectable, LoggerService, LogLevel } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class FileLoggerService implements LoggerService {
  private logDir = path.join(process.cwd(), 'logs')
  private logFile = path.join(this.logDir, 'application.log')
  private errorFile = path.join(this.logDir, 'error.log')

  constructor() {
    this.ensureLogDir()
  }

  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  private formatMessage(message: any, context?: string): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` [${context}]` : ''
    return `[${timestamp}]${contextStr} ${message}`
  }

  private writeToFile(filePath: string, message: string) {
    try {
      fs.appendFileSync(filePath, message + '\n')
    } catch (error) {
      console.error('写入日志文件失败:', error)
    }
  }

  log(message: any, context?: string) {
    const formatted = this.formatMessage(message, context)
    this.writeToFile(this.logFile, formatted)
    console.log(formatted)
  }

  error(message: any, trace?: string, context?: string) {
    const formatted = this.formatMessage(message, context)
    this.writeToFile(this.logFile, formatted)
    this.writeToFile(this.errorFile, formatted)
    if (trace) {
      this.writeToFile(this.errorFile, trace)
    }
    console.error(formatted)
  }

  warn(message: any, context?: string) {
    const formatted = this.formatMessage(message, context)
    this.writeToFile(this.logFile, formatted)
    console.warn(formatted)
  }

  debug(message: any, context?: string) {
    const formatted = this.formatMessage(message, context)
    this.writeToFile(this.logFile, formatted)
    console.debug(formatted)
  }

  verbose(message: any, context?: string) {
    const formatted = this.formatMessage(message, context)
    this.writeToFile(this.logFile, formatted)
    console.log(formatted)
  }

  setLogLevels(levels: LogLevel[]) {
    // 实现日志级别设置
  }
}
