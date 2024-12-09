import { registerAs } from '@nestjs/config'
import { MoodEntity } from '../app/entities/mood.entity'

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
    entities: [MoodEntity],
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
