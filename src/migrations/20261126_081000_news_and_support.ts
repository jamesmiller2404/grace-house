import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_news_and_support_type" AS ENUM('news', 'letter');
    CREATE TYPE "public"."enum_news_and_support_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__news_and_support_v_version_type" AS ENUM('news', 'letter');
    CREATE TYPE "public"."enum__news_and_support_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "news_and_support" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "type" "enum_news_and_support_type" DEFAULT 'news',
      "date" timestamp(3) with time zone,
      "source" varchar,
      "summary" varchar,
      "external_url" varchar,
      "file_id" integer,
      "thumbnail_id" integer,
      "permission_confirmed" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_news_and_support_status" DEFAULT 'draft'
    );

    CREATE TABLE "_news_and_support_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_type" "enum__news_and_support_v_version_type" DEFAULT 'news',
      "version_date" timestamp(3) with time zone,
      "version_source" varchar,
      "version_summary" varchar,
      "version_external_url" varchar,
      "version_file_id" integer,
      "version_thumbnail_id" integer,
      "version_permission_confirmed" boolean DEFAULT false,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__news_and_support_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "news_and_support_id" integer;

    ALTER TABLE "news_and_support" ADD CONSTRAINT "news_and_support_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "news_and_support" ADD CONSTRAINT "news_and_support_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_news_and_support_v" ADD CONSTRAINT "_news_and_support_v_parent_id_news_and_support_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news_and_support"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_news_and_support_v" ADD CONSTRAINT "_news_and_support_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_news_and_support_v" ADD CONSTRAINT "_news_and_support_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_and_support_fk" FOREIGN KEY ("news_and_support_id") REFERENCES "public"."news_and_support"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "news_and_support_file_idx" ON "news_and_support" USING btree ("file_id");
    CREATE INDEX "news_and_support_thumbnail_idx" ON "news_and_support" USING btree ("thumbnail_id");
    CREATE INDEX "news_and_support_updated_at_idx" ON "news_and_support" USING btree ("updated_at");
    CREATE INDEX "news_and_support_created_at_idx" ON "news_and_support" USING btree ("created_at");
    CREATE INDEX "news_and_support__status_idx" ON "news_and_support" USING btree ("_status");

    CREATE INDEX "_news_and_support_v_parent_idx" ON "_news_and_support_v" USING btree ("parent_id");
    CREATE INDEX "_news_and_support_v_version_version_file_idx" ON "_news_and_support_v" USING btree ("version_file_id");
    CREATE INDEX "_news_and_support_v_version_version_thumbnail_idx" ON "_news_and_support_v" USING btree ("version_thumbnail_id");
    CREATE INDEX "_news_and_support_v_version_version_updated_at_idx" ON "_news_and_support_v" USING btree ("version_updated_at");
    CREATE INDEX "_news_and_support_v_version_version_created_at_idx" ON "_news_and_support_v" USING btree ("version_created_at");
    CREATE INDEX "_news_and_support_v_version_version__status_idx" ON "_news_and_support_v" USING btree ("version__status");
    CREATE INDEX "_news_and_support_v_created_at_idx" ON "_news_and_support_v" USING btree ("created_at");
    CREATE INDEX "_news_and_support_v_updated_at_idx" ON "_news_and_support_v" USING btree ("updated_at");
    CREATE INDEX "_news_and_support_v_latest_idx" ON "_news_and_support_v" USING btree ("latest");

    CREATE INDEX "payload_locked_documents_rels_news_and_support_id_idx" ON "payload_locked_documents_rels" USING btree ("news_and_support_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_news_and_support_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_news_and_support_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "news_and_support_id";
    DROP TABLE IF EXISTS "_news_and_support_v" CASCADE;
    DROP TABLE IF EXISTS "news_and_support" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__news_and_support_v_version_status";
    DROP TYPE IF EXISTS "public"."enum__news_and_support_v_version_type";
    DROP TYPE IF EXISTS "public"."enum_news_and_support_status";
    DROP TYPE IF EXISTS "public"."enum_news_and_support_type";
  `)
}
