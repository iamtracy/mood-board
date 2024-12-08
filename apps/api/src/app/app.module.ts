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
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + './**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    MoodModule
  ],
})
export class AppModule {}
