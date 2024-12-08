import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'

  const config = new DocumentBuilder()
    .setTitle('MoodBoard Api')
    .setDescription('The MoodBoard API description')
    .setVersion('1.0')
    .build()
    
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/openapi', app, documentFactory)

  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
