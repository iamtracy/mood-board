import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733754839309 implements MigrationInterface {
    name = 'Migration1733754839309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mood" ("id" SERIAL NOT NULL, "mood" character varying NOT NULL, CONSTRAINT "PK_cd069bf46deedf0ef3a7771f44b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mood"`);
    }

}
