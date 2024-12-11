import { registerAs } from '@nestjs/config'

const {
    DB_HOST,
    DB_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
} = process.env

const isDevelopment = process.env.NODE_ENV === 'development'

export default registerAs('database', () => ({
    autoLoadEntities: true,
    database: POSTGRES_DB,
    host: DB_HOST,
    logging:  isDevelopment,
    password: POSTGRES_PASSWORD,
    port: DB_PORT,
    synchronize: isDevelopment,
    type: 'postgres',
    username: POSTGRES_USERNAME,
    ssl: isDevelopment ? false : { rejectUnauthorized: false },
}))
