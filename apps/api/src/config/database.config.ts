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
    type: 'postgres',
    logging:  isDevelopment,
    migrations: [`${__dirname}/../../../db/migrations/*.ts`],
    entities: [`${__dirname}/../app/**/*.entity.ts`],
    host: DB_HOST,
    port: DB_PORT,
    username: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    synchronize: isDevelopment,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
}))
