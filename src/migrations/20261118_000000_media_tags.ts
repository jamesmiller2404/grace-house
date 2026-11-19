import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "media_tags" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX "media_tags_name_idx" ON "media_tags" USING btree ("name");
    CREATE INDEX "media_tags_updated_at_idx" ON "media_tags" USING btree ("updated_at");
    CREATE INDEX "media_tags_created_at_idx" ON "media_tags" USING btree ("created_at");

    ALTER TABLE "media_rels"
      ADD COLUMN "media_tags_id" integer;

    CREATE INDEX "media_rels_media_tags_id_idx"
      ON "media_rels" USING btree ("media_tags_id");

    ALTER TABLE "media_rels"
      ADD CONSTRAINT "media_rels_media_tags_fk"
      FOREIGN KEY ("media_tags_id") REFERENCES "media_tags"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN "media_tags_id" integer;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_media_tags_fk"
      FOREIGN KEY ("media_tags_id") REFERENCES "media_tags"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "payload_locked_documents_rels_media_tags_id_idx"
      ON "payload_locked_documents_rels" USING btree ("media_tags_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT "payload_locked_documents_rels_media_tags_fk";

    DROP INDEX "payload_locked_documents_rels_media_tags_id_idx";

    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN "media_tags_id";

    ALTER TABLE "media_rels"
      DROP CONSTRAINT "media_rels_media_tags_fk";

    DROP INDEX "media_rels_media_tags_id_idx";

    ALTER TABLE "media_rels"
      DROP COLUMN "media_tags_id";

    DROP TABLE "media_tags";
  `);
}
