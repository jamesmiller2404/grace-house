import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { lexicalToText } from '@/lib/lexicalToText'

export const metadata = {
  title: 'Frequently Asked Questions | Grace House Nor Cal',
  description:
    'Answers about Grace House Nor Cal, a faith-based recovery program in Carmichael, CA: cost, length of stay, daily schedule, rules, and staff.',
}

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'faq',
    where: { published: { equals: true } },
    sort: 'order',
    pagination: false,
  })

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: docs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: lexicalToText(f.answer).trim() },
    })),
  }

  return (
    <main className="bg-sand flex-1 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="text-terra pb-1 text-base font-bold"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-ink/60 font-normal">
              ›
            </li>
            <li aria-current="page">Common Questions</li>
          </ol>
        </nav>
        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-anchor mt-4 text-5xl">
          Grace House Nor Cal - Common Questions
        </h1>
        <div className="mt-4">
          {docs.map((f) => (
            <details key={f.id} className="faq-item">
              <summary>{f.question}</summary>
              <div className="faq-answer">
                <RichText data={f.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  )
}