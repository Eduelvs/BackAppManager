import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1768089600000 implements MigrationInterface {
  name = 'InitialSchema1768089600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "plano" (
        "id" uuid NOT NULL,
        "nome" character varying NOT NULL,
        "id_user" uuid NOT NULL,
        CONSTRAINT "PK_plano" PRIMARY KEY ("id"),
        CONSTRAINT "FK_plano_id_user" FOREIGN KEY ("id_user")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plano_id_user" ON "plano" ("id_user")
    `);

    await queryRunner.query(`
      CREATE TABLE "plano_ano" (
        "id" uuid NOT NULL,
        "ano" integer NOT NULL,
        "valor_mensal" numeric(12,2) NOT NULL,
        "taxa" numeric(8,4) NOT NULL,
        "id_plan" uuid NOT NULL,
        CONSTRAINT "PK_plano_ano" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_plano_ano_id_plan_ano" UNIQUE ("id_plan", "ano"),
        CONSTRAINT "FK_plano_ano_id_plan" FOREIGN KEY ("id_plan")
          REFERENCES "plano"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plano_ano_id_plan" ON "plano_ano" ("id_plan")
    `);

    await queryRunner.query(`
      CREATE TABLE "plano_ano_mes" (
        "id" uuid NOT NULL,
        "id_plano_ano" uuid NOT NULL,
        "valor" numeric(12,2) NOT NULL,
        "mes" smallint NOT NULL,
        CONSTRAINT "PK_plano_ano_mes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_plano_ano_mes_id_plano_ano_mes" UNIQUE ("id_plano_ano", "mes"),
        CONSTRAINT "FK_plano_ano_mes_id_plano_ano" FOREIGN KEY ("id_plano_ano")
          REFERENCES "plano_ano"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plano_ano_mes_id_plano_ano" ON "plano_ano_mes" ("id_plano_ano")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "plano_ano_mes"`);
    await queryRunner.query(`DROP TABLE "plano_ano"`);
    await queryRunner.query(`DROP TABLE "plano"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
