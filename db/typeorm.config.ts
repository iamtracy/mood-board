import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import dotenv from 'dotenv'

dotenv.config()

const isDevelopment = process.env.NODE_ENV === 'development'

const configService = new ConfigService()

export default new DataSource({
  database: configService.get('POSTGRES_DB'),
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  host: configService.get('DB_HOST'),
  logging: isDevelopment,
  migrations: [`${__dirname}/../db/migrations/*.ts`],
  password: configService.get('POSTGRES_PASSWORD'),
  port: +(configService.get('DB_PORT') ?? 5432),
  synchronize: isDevelopment,
  type: 'postgres',
  username: configService.get('POSTGRES_USERNAME'),
})