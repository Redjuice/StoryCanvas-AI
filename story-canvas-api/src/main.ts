import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
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

  const config = new DocumentBuilder()
    .setTitle('StoryCanvas AI API')
    .setDescription('AI绘本生成器后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = configService.get('PORT', 3000)
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
  console.log(`API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
