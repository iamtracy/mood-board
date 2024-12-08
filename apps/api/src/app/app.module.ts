import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'

import { join } from 'path'

import { MoodModule } from './mood/mood.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppConfig, DatabaseConfig } from '../config'

@Module({
  imports: [
    ...(
      (process.env.NODE_ENV === 'production')
        ? [
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'mood-board'),
              exclude: ['/api/(.*)'],
            }),
          ]
        :
        []
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    MoodModule
  ],
})
export class AppModule {}
