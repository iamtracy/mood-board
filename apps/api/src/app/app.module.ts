import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'

import { join } from 'path'

const isProduction = process.env.NODE_ENV === 'production'

const {
  DB_HOST,
  DB_PORT,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
} = process.env

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: +DB_PORT,
      username: POSTGRES_USERNAME,
      password: POSTGRES_PASSWORD,
      synchronize: !isProduction,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
