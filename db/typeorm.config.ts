import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import dotenv from 'dotenv'

dotenv.config()

const isDevelopment = process.env.NODE_ENV === 'development'

const configService = new ConfigService()

const entitiesPath = isDevelopment
  ? `${__dirname}/../entities/**/*.entity.{ts,js}`
  : '/app/entities/**/*.entity.{ts,js}'

const migrationsPath = isDevelopment
  ? `${__dirname}/../db/migrations/*.{ts,js}`
  : '/app/db/migrations/*.{ts,js}'

export default new DataSource({
  database: configService.get('POSTGRES_DB'),
  entities: [entitiesPath],
  host: configService.get('DB_HOST'),
  logging: isDevelopment,
  migrations: [migrationsPath],
  password: configService.get('POSTGRES_PASSWORD'),
  port: +(configService.get('DB_PORT') ?? 5432),
  synchronize: isDevelopment,
  type: 'postgres',
  username: configService.get('POSTGRES_USERNAME'),
})