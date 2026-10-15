import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone_choice" varchar NOT NULL,
  	"phone_custom" varchar,
  	"email_choice" varchar NOT NULL,
  	"email_custom" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "get_help_now" ADD COLUMN "phone_choice" varchar;
  ALTER TABLE "get_help_now" ADD COLUMN "phone_custom" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer" CASCADE;
  ALTER TABLE "get_help_now" DROP COLUMN "phone_choice";
  ALTER TABLE "get_help_now" DROP COLUMN "phone_custom";`)
}
