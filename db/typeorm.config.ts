import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import * as path from 'path'

config()

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join('/apps/api/**/*.entity.{ts,js}')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
})

// export const typeOrmConfig = () => ({
  // type: 'postgres',
  // host: configService.get('DB_HOST'),
  // port: configService.get('DB_PORT'),
  // username: configService.get('POSTGRES_USERNAME'),
  // password: configService.get('POSTGRES_PASSWORD'),
  // database: configService.get('POSTGRES_DB'),
  // entities: [path.join(__dirname, '../apps/api/**/*.entity.{ts,js}')],
  // synchronize: configService.get('NODE_ENV') === 'development',
  // logging: configService.get('NODE_ENV') === 'development',
  // migrations: [path.join(__dirname, '**/migrations/*{.ts,.js}')],
// })