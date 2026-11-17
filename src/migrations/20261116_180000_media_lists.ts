import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "media_lists" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX "media_lists_name_idx" ON "media_lists" USING btree ("name");
    CREATE INDEX "media_lists_updated_at_idx" ON "media_lists" USING btree ("updated_at");
    CREATE INDEX "media_lists_created_at_idx" ON "media_lists" USING btree ("created_at");

    CREATE TABLE "media_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "media_lists_id" integer
    );

    CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
    CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
    CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
    CREATE INDEX "media_rels_media_lists_id_idx" ON "media_rels" USING btree ("media_lists_id");

    ALTER TABLE "media_rels"
      ADD CONSTRAINT "media_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "media_rels"
      ADD CONSTRAINT "media_rels_media_lists_fk"
      FOREIGN KEY ("media_lists_id") REFERENCES "media_lists"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN "media_lists_id" integer;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_media_lists_fk"
      FOREIGN KEY ("media_lists_id") REFERENCES "media_lists"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "payload_locked_documents_rels_media_lists_id_idx"
      ON "payload_locked_documents_rels" USING btree ("media_lists_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT "payload_locked_documents_rels_media_lists_fk";

    DROP INDEX "payload_locked_documents_rels_media_lists_id_idx";

    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN "media_lists_id";

    ALTER TABLE "media_rels" DROP CONSTRAINT "media_rels_parent_fk";
    ALTER TABLE "media_rels" DROP CONSTRAINT "media_rels_media_lists_fk";

    DROP TABLE "media_rels";
    DROP TABLE "media_lists";
  `);
}
