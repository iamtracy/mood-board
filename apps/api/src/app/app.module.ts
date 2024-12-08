import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { join } from 'path'

import { AppConfig, DatabaseConfig } from '../config'
import { MoodModule } from './mood/mood.module'
import { MoodEntity } from './mood/mood.entity'
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
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [MoodEntity],
        synchronize: configService.get('NODE_ENV') === 'development',
        extra: {
          ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : null,
        }
      }),
      inject: [ConfigService],
    }),
    MoodModule,
    HealthModule,
  ],
})
export class AppModule {}
