import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // The legacy "date" column stored text — "MM/DD/YYYY", month-only
  // "MM/YYYY", or ISO timestamps. Postgres refuses to auto-cast varchar to
  // timestamptz, so convert explicitly: month-only values (which a timestamp
  // cannot represent — Denise "11/2026", Mike "06/2025") become NULL until a
  // date is re-picked in the admin, full legacy dates are parsed with an
  // explicit MM/DD/YYYY format, and ISO timestamps cast directly. NULLs stay
  // NULL.
  await db.execute(sql`
   ALTER TABLE "stories" ALTER COLUMN "role" DROP NOT NULL;
  ALTER TABLE "stories" ALTER COLUMN "date" SET DATA TYPE timestamp(3) with time zone
  USING CASE
   WHEN "date" ~ '^[0-9]{1,2}/[0-9]{4}$' THEN NULL
   WHEN "date" ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$' THEN to_date("date", 'MM/DD/YYYY')::timestamptz
   ELSE "date"::timestamptz
  END;
  ALTER TABLE "stories" ALTER COLUMN "show_memories" SET DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "stories" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "stories" ALTER COLUMN "date" SET DATA TYPE varchar;
  ALTER TABLE "stories" ALTER COLUMN "show_memories" SET DEFAULT true;`)
}
