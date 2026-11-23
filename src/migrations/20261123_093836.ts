import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_admin_notifications_target_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_admin_notifications_category" AS ENUM('media-video', 'content', 'events', 'security', 'system');
  CREATE TYPE "public"."enum_admin_notifications_severity" AS ENUM('info', 'success', 'warning', 'error');
  CREATE TABLE "admin_notifications_target_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_admin_notifications_target_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "admin_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar,
  	"category" "enum_admin_notifications_category" DEFAULT 'system',
  	"severity" "enum_admin_notifications_severity" DEFAULT 'info',
  	"action_url" varchar,
  	"actor_id" integer,
  	"dedupe_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "admin_notifications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "admin_notifications_id" integer;
  ALTER TABLE "admin_notifications_target_roles" ADD CONSTRAINT "admin_notifications_target_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admin_notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admin_notifications_rels" ADD CONSTRAINT "admin_notifications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admin_notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admin_notifications_rels" ADD CONSTRAINT "admin_notifications_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admin_notifications_target_roles_order_idx" ON "admin_notifications_target_roles" USING btree ("order");
  CREATE INDEX "admin_notifications_target_roles_parent_idx" ON "admin_notifications_target_roles" USING btree ("parent_id");
  CREATE INDEX "admin_notifications_actor_idx" ON "admin_notifications" USING btree ("actor_id");
  CREATE INDEX "admin_notifications_dedupe_key_idx" ON "admin_notifications" USING btree ("dedupe_key");
  CREATE INDEX "admin_notifications_updated_at_idx" ON "admin_notifications" USING btree ("updated_at");
  CREATE INDEX "admin_notifications_created_at_idx" ON "admin_notifications" USING btree ("created_at");
  CREATE INDEX "admin_notifications_rels_order_idx" ON "admin_notifications_rels" USING btree ("order");
  CREATE INDEX "admin_notifications_rels_parent_idx" ON "admin_notifications_rels" USING btree ("parent_id");
  CREATE INDEX "admin_notifications_rels_path_idx" ON "admin_notifications_rels" USING btree ("path");
  CREATE INDEX "admin_notifications_rels_users_id_idx" ON "admin_notifications_rels" USING btree ("users_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_notifications_fk" FOREIGN KEY ("admin_notifications_id") REFERENCES "public"."admin_notifications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_admin_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_notifications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admin_notifications_target_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admin_notifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admin_notifications_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "admin_notifications_target_roles" CASCADE;
  DROP TABLE "admin_notifications" CASCADE;
  DROP TABLE "admin_notifications_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_admin_notifications_fk";
  
  DROP INDEX "payload_locked_documents_rels_admin_notifications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "admin_notifications_id";
  DROP TYPE "public"."enum_admin_notifications_target_roles";
  DROP TYPE "public"."enum_admin_notifications_category";
  DROP TYPE "public"."enum_admin_notifications_severity";`)
}
