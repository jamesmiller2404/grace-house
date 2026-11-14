import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "cost" DROP DEFAULT;
  ALTER TABLE "footer" ADD COLUMN "brand_name" varchar DEFAULT 'Grace House';
  ALTER TABLE "footer" ADD COLUMN "brand_tagline" varchar DEFAULT 'NOR CAL';
  ALTER TABLE "footer" ADD COLUMN "mission_text" varchar DEFAULT 'To see families restored and give hope to the hopeless.';
  ALTER TABLE "footer" ADD COLUMN "memorial_photo_id" integer;
  ALTER TABLE "footer" ADD COLUMN "memorial_photo_alt" varchar DEFAULT 'Pastor Lonnie';
  ALTER TABLE "footer" ADD COLUMN "memorial_name" varchar DEFAULT 'Lonnie W. Nix';
  ALTER TABLE "footer" ADD COLUMN "memorial_dates" varchar DEFAULT '1956–2021';
  ALTER TABLE "footer" ADD COLUMN "get_help_label" varchar DEFAULT 'Get Help';
  ALTER TABLE "footer" ADD COLUMN "hours_text" varchar DEFAULT 'Mon–Fri, 9am–5pm';
  ALTER TABLE "footer" ADD COLUMN "intakes_text" varchar DEFAULT 'Intakes on weekdays only';
  ALTER TABLE "footer" ADD CONSTRAINT "footer_memorial_photo_id_media_id_fk" FOREIGN KEY ("memorial_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "footer_memorial_photo_idx" ON "footer" USING btree ("memorial_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP CONSTRAINT "footer_memorial_photo_id_media_id_fk";
  
  DROP INDEX "footer_memorial_photo_idx";
  ALTER TABLE "events" ALTER COLUMN "cost" SET DEFAULT 'Free';
  ALTER TABLE "footer" DROP COLUMN "brand_name";
  ALTER TABLE "footer" DROP COLUMN "brand_tagline";
  ALTER TABLE "footer" DROP COLUMN "mission_text";
  ALTER TABLE "footer" DROP COLUMN "memorial_photo_id";
  ALTER TABLE "footer" DROP COLUMN "memorial_photo_alt";
  ALTER TABLE "footer" DROP COLUMN "memorial_name";
  ALTER TABLE "footer" DROP COLUMN "memorial_dates";
  ALTER TABLE "footer" DROP COLUMN "get_help_label";
  ALTER TABLE "footer" DROP COLUMN "hours_text";
  ALTER TABLE "footer" DROP COLUMN "intakes_text";`)
}
