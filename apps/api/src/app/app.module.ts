import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'

import { join } from 'path'

import { MoodModule } from './mood/mood.module'

const {
  DB_HOST,
  DB_PORT,
  NODE_ENV,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env

const isProduction = NODE_ENV === 'production'

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
      database: POSTGRES_DB,
      host: DB_HOST,
      password: POSTGRES_PASSWORD,
      port: +DB_PORT,
      synchronize: !isProduction,
      type: 'postgres',
      username: POSTGRES_USERNAME,
      autoLoadEntities: true,
    }),
    MoodModule
  ],
})
export class AppModule {}
