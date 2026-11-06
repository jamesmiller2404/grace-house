import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_events_blocks_type" AS ENUM('Paragraph', 'Heading');

    ALTER TABLE "events_blocks"
      ADD COLUMN "type" "public"."enum_events_blocks_type" NOT NULL DEFAULT 'Paragraph';

    ALTER TABLE "events_blocks"
      ADD COLUMN "text" varchar;

    UPDATE "events_blocks" SET "text" = '';

    ALTER TABLE "events_blocks"
      ALTER COLUMN "text" SET NOT NULL;

    ALTER TABLE "events_blocks"
      DROP COLUMN "heading";

    DROP TABLE "events_blocks_paragraphs" CASCADE;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "events_blocks_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "events_blocks" RENAME COLUMN "type" TO "heading";
  ALTER TABLE "events_blocks_paragraphs" ADD CONSTRAINT "events_blocks_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_blocks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_blocks_paragraphs_order_idx" ON "events_blocks_paragraphs" USING btree ("_order");
  CREATE INDEX "events_blocks_paragraphs_parent_id_idx" ON "events_blocks_paragraphs" USING btree ("_parent_id");
  ALTER TABLE "events_blocks" DROP COLUMN "text";
  DROP TYPE "public"."enum_events_blocks_type";`)
}
