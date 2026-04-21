import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    let message: string | object
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse()
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exceptionResponse
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(`未捕获的异常: ${exception.message}`, exception.stack)
    } else {
      message = '服务器内部错误'
    }

    const errorResponse = {
      code: status,
      message: typeof message === 'string' ? message : (message as any).message || '未知错误',
      timestamp: new Date().toISOString(),
    }

    response.status(status).json(errorResponse)
  }
}
