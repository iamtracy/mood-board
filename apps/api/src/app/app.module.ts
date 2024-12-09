import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { join } from 'path'

import { AppConfig, DatabaseConfig } from '../config'
import { MoodModule } from './mood/mood.module'
import { HealthModule } from './health/health.module'

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
    MoodModule,
    HealthModule,
  ],
})
export class AppModule {}
