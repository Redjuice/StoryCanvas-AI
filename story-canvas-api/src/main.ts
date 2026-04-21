import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  const configService = app.get(ConfigService)
  const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:5173')

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  })

  app.setGlobalPrefix('api')

  const port = configService.get('PORT', 3000)
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap()
