import { getPayload } from 'payload'
import config from '@payload-config'
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
    <main className="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <h1>Grace House Nor Cal: Frequently Asked Questions</h1>
      {docs.map((f) => (
        <details key={f.id} className="faq-item">
          <summary>{f.question}</summary>
          <div className="faq-answer">
            <RichText data={f.answer} />
          </div>
        </details>
      ))}
    </main>
  )
}