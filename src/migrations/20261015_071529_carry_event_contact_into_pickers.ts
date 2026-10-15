import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** The legacy seeded placeholder values (see the old seedEvents defaults). */
const LEGACY_PLACEHOLDER_PHONE = '(916) 555-5555'
const LEGACY_PLACEHOLDER_EMAIL = 'ghemail@gmail.com'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Carry each event's old contact values into the new picker fields before
  // the old columns are dropped (in that order: the Local API cannot write a
  // row while the old `contact_phone` / `contact_email` columns are gone from
  // the config, and their values cannot be read once dropped).
  //
  // 1. Read the old values straight from the table (read-only — the config no
  //    longer declares those fields, so the Local API cannot select them).
  // 2. Drop the old columns.
  // 3. Per event, write the picker fields through the Local API:
  //    - an old value that matches an entry registered in the Contact Info
  //      panel becomes a live reference (`registered:<id>`);
  //    - any other real value is preserved as a custom picker value;
  //    - the legacy seeded placeholder values (and empty values) are not
  //      carried, so those events fall back to the first registered entry —
  //      the placeholder numbers were never real contact details.
  const result = await db.execute(
    sql`SELECT "id", "contact_phone", "contact_email" FROM "events"`,
  )
  const rows = ((result as unknown as { rows?: unknown[] }).rows ??
    (result as unknown as unknown[])) as {
    id: number
    contact_phone: string | null
    contact_email: string | null
  }[]

  await db.execute(sql`
   ALTER TABLE "events" DROP COLUMN "contact_phone";
  ALTER TABLE "events" DROP COLUMN "contact_email";`)

  const contact = await payload.findGlobal({ slug: 'contact-info', req })
  const registeredPhones = (contact.phoneNumbers ?? []) as {
    id: string
    value: string
  }[]
  const registeredEmails = (contact.emails ?? []) as {
    id: string
    value: string
  }[]

  /** The picker fields for one old value, or an empty object when it is not worth carrying. */
  const carry = (
    oldValue: string | null,
    registered: { id: string; value: string }[],
    placeholder: string,
    choiceKey: 'phoneChoice' | 'emailChoice',
    customKey: 'phoneCustom' | 'emailCustom',
  ): Record<string, string> => {
    const value = oldValue?.trim()
    if (!value) return {}
    const match = registered.find((entry) => entry.value === value)
    if (match) return { [choiceKey]: `registered:${match.id}` }
    if (value.toLowerCase() === placeholder.toLowerCase()) return {}
    return { [choiceKey]: 'custom', [customKey]: value }
  }

  for (const row of rows) {
    const data = {
      ...carry(
        row.contact_phone,
        registeredPhones,
        LEGACY_PLACEHOLDER_PHONE,
        'phoneChoice',
        'phoneCustom',
      ),
      ...carry(
        row.contact_email,
        registeredEmails,
        LEGACY_PLACEHOLDER_EMAIL,
        'emailChoice',
        'emailCustom',
      ),
    }
    if (Object.keys(data).length === 0) continue
    await payload.update({
      collection: 'events',
      id: row.id,
      req,
      data: { contact: data },
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "events" ADD COLUMN "contact_email" varchar;`)
}
