import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Carry the old `phone` field's value into the picker fields, dropping the
  // old columns in between (in that order, because the Local API cannot write
  // the row while the old `phone` / `phone_href` columns — still NOT NULL in
  // the table — are gone from the config, and their values cannot be read
  // once dropped).
  //
  // 1. Read the old display numbers straight from the table (read-only — the
  //    config no longer declares `phone`, so the Local API cannot select it).
  // 2. Drop the old columns (their values are captured above).
  // 3. Write each row's choice through the Local API: the old number becomes
  //    either a live reference to the matching number registered in the
  //    contact-info global (`registered:<id>` — the Get Help Now strip then
  //    follows the number if it's edited in the Contact Info panel) or, when
  //    nothing matches (e.g. the global is still empty on a fresh install), a
  //    custom picker value carrying the old number itself.
  // 4. Mark the choice required. Rows with no old number (not possible while
  //    `phone` was required, but guarded anyway) get a bare custom choice so
  //    this cannot fail; the front end falls back to the first registered
  //    number for them.
  const result = await db.execute(
    sql`SELECT "id", "phone" FROM "get_help_now"`,
  )
  const rows = ((result as unknown as { rows?: unknown[] }).rows ??
    (result as unknown as unknown[])) as {
    id: number
    phone: string | null
  }[]

  await db.execute(sql`
   ALTER TABLE "get_help_now" DROP COLUMN "phone";
  ALTER TABLE "get_help_now" DROP COLUMN "phone_href";`)

  const contact = await payload.findGlobal({ slug: 'contact-info', req })
  const registered = (contact.phoneNumbers ?? []) as {
    id: string
    value: string
  }[]
  for (const row of rows) {
    const oldPhone = row.phone?.trim()
    const match = oldPhone
      ? registered.find((entry) => entry.value === oldPhone)
      : undefined
    await payload.update({
      collection: 'get-help-now',
      id: row.id,
      req,
      data: match
        ? { phoneChoice: `registered:${match.id}` }
        : {
            phoneChoice: 'custom',
            ...(oldPhone ? { phoneCustom: oldPhone } : {}),
          },
    })
  }

  await db.execute(sql`
   ALTER TABLE "get_help_now" ALTER COLUMN "phone_choice" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "get_help_now" ALTER COLUMN "phone_choice" DROP NOT NULL;
  ALTER TABLE "get_help_now" ADD COLUMN "phone" varchar NOT NULL;
  ALTER TABLE "get_help_now" ADD COLUMN "phone_href" varchar NOT NULL;`)
}
