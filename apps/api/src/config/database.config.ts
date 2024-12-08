import { ConfigService, registerAs } from '@nestjs/config'
import { MoodEntity } from '../app/mood/mood.entity'

const configService = new ConfigService()

export default registerAs('database', () => ({
    type: 'postgres',
    entities: [MoodEntity],
    logging:  configService.get('NODE_ENV') === 'development',
    migrations: [`${__dirname}/../../../db/migrations/*.ts`],
    migrationsTableName: 'migrations',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    synchronize: configService.get('NODE_ENV') === 'development',
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
}))
