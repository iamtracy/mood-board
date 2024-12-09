import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { DataSource } from 'typeorm'

const configService = new ConfigService()

export default new DataSource({
  database: configService.get('POSTGRES_DB'),
  entities: [join('/apps/api/**/*.entity.{ts,js}')],
  host: configService.get('DB_HOST'),
  logging: configService.get('NODE_ENV') === 'development',
  password: configService.get('POSTGRES_PASSWORD'),
  port: configService.get('DB_PORT'),
  synchronize: configService.get('NODE_ENV') === 'development',
  type: 'postgres',
  username: configService.get('POSTGRES_USERNAME'),
})