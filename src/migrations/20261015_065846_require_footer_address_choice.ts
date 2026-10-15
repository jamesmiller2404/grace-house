import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Fill the footer's address choice before marking it required. The footer
  // table only holds a row on databases where the global has already been
  // written (e.g. this project's dev database) — on a fresh install the
  // migrations run before any seed, the row does not exist yet, and the boot
  // seed (seedFooter) fills the choice afterwards.
  const footer = await payload.findGlobal({ slug: 'footer', req })
  if (footer.id != null && !footer.addressChoice) {
    const contact = await payload.findGlobal({ slug: 'contact-info', req })
    const registered = (contact.addresses ?? []) as {
      id: string
      value: string
    }[]
    const first = registered[0]
    await payload.updateGlobal({
      slug: 'footer',
      req,
      data: first
        ? { addressChoice: `registered:${first.id}` }
        : {
            // No registered address yet (the seeds have not run): a custom
            // choice carrying the organization's address — the same value
            // seedContactInfo registers on first boot.
            addressChoice: 'custom',
            addressCustom: '6121 Marwick Way, Carmichael, CA 95608',
          },
    })
  }

  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "address_choice" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "address_choice" DROP NOT NULL;`)
}
