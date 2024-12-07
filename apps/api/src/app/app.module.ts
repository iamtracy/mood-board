import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'

import { join } from 'path'

const isProduction = process.env.NODE_ENV === 'production'

@Module({
  imports: [
    ...(
      isProduction
        ? [
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'mood-board'),
              exclude: ['/api/(.*)'],
            }),
          ]
        :
        []
      ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
