import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "board" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar DEFAULT 'Board of Directors' NOT NULL,
      "intro" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "board_members" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "role" varchar NOT NULL,
      "image_id" integer
    );

    CREATE INDEX "board_updated_at_idx" ON "board" USING btree ("updated_at");
    CREATE INDEX "board_created_at_idx" ON "board" USING btree ("created_at");
    CREATE INDEX "board_members_order_idx" ON "board_members" USING btree ("_order");
    CREATE INDEX "board_members_parent_id_idx" ON "board_members" USING btree ("_parent_id");
    CREATE INDEX "board_members_image_idx" ON "board_members" USING btree ("image_id");

    ALTER TABLE "board_members"
      ADD CONSTRAINT "board_members_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."board"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "board_members"
      ADD CONSTRAINT "board_members_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "board_members" DROP CONSTRAINT "board_members_parent_id_fk";
    ALTER TABLE "board_members" DROP CONSTRAINT "board_members_image_id_media_id_fk";
    DROP TABLE "board_members";
    DROP TABLE "board";
  `)
}
