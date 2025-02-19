import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import dotenv from 'dotenv'

dotenv.config()

const configService = new ConfigService()

export default new DataSource({
  database: configService.get('POSTGRES_DB'),
  entities: ['/app/entities/**/*.entity.ts'],
  host: configService.get('DB_HOST'),
  logging: false,
  migrations: ['/app/db/migrations/*.ts'],
  password: configService.get('POSTGRES_PASSWORD'),
  port: +(configService.get('DB_PORT') ?? 5432),
  synchronize: false,
  type: 'postgres',
  username: configService.get('POSTGRES_USERNAME'),
})