import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "events_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar NOT NULL,
      "heading" varchar NOT NULL,
      PRIMARY KEY ("id")
    );

    CREATE TABLE "events_blocks_paragraphs" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar NOT NULL,
      "text" varchar,
      PRIMARY KEY ("id")
    );

    ALTER TABLE "events_blocks"
      ADD CONSTRAINT "events_blocks_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "events_blocks_paragraphs"
      ADD CONSTRAINT "events_blocks_paragraphs_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."events_blocks"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "events_blocks_order_idx" ON "events_blocks" USING btree ("_order");
    CREATE INDEX "events_blocks_parent_id_idx" ON "events_blocks" USING btree ("_parent_id");
    CREATE INDEX "events_blocks_paragraphs_order_idx" ON "events_blocks_paragraphs" USING btree ("_order");
    CREATE INDEX "events_blocks_paragraphs_parent_id_idx" ON "events_blocks_paragraphs" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events_blocks_paragraphs" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "events_blocks" DISABLE ROW LEVEL SECURITY;

    DROP INDEX "events_blocks_paragraphs_parent_id_idx";
    DROP INDEX "events_blocks_paragraphs_order_idx";
    DROP INDEX "events_blocks_parent_id_idx";
    DROP INDEX "events_blocks_order_idx";

    DROP TABLE "events_blocks_paragraphs" CASCADE;
    DROP TABLE "events_blocks" CASCADE;
  `)
}