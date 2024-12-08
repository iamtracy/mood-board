import { ConfigService, registerAs } from '@nestjs/config'

const configService = new ConfigService()

export default registerAs('database', () => ({
    type: 'postgres',
    entities: [`${__dirname}/../**/*.entity.{js,ts}`],
    logging:  configService.get('NODE_ENV') === 'development',
    migrations: [`${__dirname}/../../../db/migrations/*.ts`],
    migrationsTableName: 'migrations',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    synchronize: configService.get('NODE_ENV') === 'development',
}))
