import Link from "next/link";
import { site } from "@/content/site";

export const metadata = {
  title: "Accessibility — Grace House",
};

const sections = [
  {
    heading: "Our Commitment",
    paragraphs: [
      `${site.name} is committed to ensuring that our website is accessible to people of all abilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and to continually improve the usability and accessibility of the site.`,
    ],
  },
  {
    heading: "Measures We Take",
    paragraphs: [
      "We design and build this site with semantic HTML, meaningful alternative text for images, sufficient color contrast, keyboard navigability, and visible focus indicators. We test the site with assistive technologies and review new content for accessibility before it is published.",
    ],
  },
  {
    heading: "Known Limitations",
    paragraphs: [
      "Despite our best efforts, some areas of the site may not yet be fully accessible. We welcome your feedback and will address reported issues as quickly as possible.",
    ],
  },
  {
    heading: "Conformance Status",
    paragraphs: [
      "This website is partially conformant with WCAG 2.1 Level AA. Partial conformance means that some parts of the content do not fully conform to the accessibility standard.",
    ],
  },
  {
    heading: "Feedback",
    paragraphs: [
      `If you experience any difficulty accessing content on this site, or if you need information in an alternative format, please contact us at ${site.phone} or ${site.email}. We aim to respond within two business days.`,
    ],
  },
];

export default function AccessibilityPage() {
  return (
    <main className="flex-1 bg-cream px-6 py-14">
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
            <li aria-current="page">Accessibility</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">Accessibility Statement</h1>
        <p className="text-ink/70 mt-4 max-w-[60ch] leading-relaxed">
          Last updated: October 2026
        </p>

        <div className="mt-10 max-w-[70ch] space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-ink text-2xl font-semibold">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-ink mt-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
