import { DataSource } from 'typeorm'

const {
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USERNAME,
  DB_HOST,
  DB_PORT = 5432,
  NODE_ENV,
} = process.env

const isDevelopment = NODE_ENV === 'development'

export default new DataSource({
  database: POSTGRES_DB,
  migrations: ['/apps/db/migrations/*-migration.{ts,js}'],
  host: DB_HOST,
  logging: isDevelopment,
  password: POSTGRES_PASSWORD,
  port: +DB_PORT,
  synchronize: isDevelopment,
  type: 'postgres',
  username: POSTGRES_USERNAME,
})