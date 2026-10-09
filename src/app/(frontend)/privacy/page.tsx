import Link from "next/link";
import { site } from "@/content/site";

export const metadata = {
  title: "Privacy — Grace House",
};

const sections = [
  {
    heading: "Information We Collect",
    paragraphs: [
      "We collect information you choose to provide, such as your name, phone number, and email address when you call, email, or fill out a form on this site. We may also collect standard technical information (such as browser type and pages visited) used to keep the site running smoothly.",
    ],
  },
  {
    heading: "How We Use Information",
    paragraphs: [
      "We use the information you provide to respond to your inquiries, provide information about our services, and improve the site. We do not sell, rent, or trade your personal information to third parties.",
    ],
  },
  {
    heading: "Cookies and Analytics",
    paragraphs: [
      "This site may use cookies and similar technologies to understand how visitors use the site. You can set your browser to refuse cookies, though some parts of the site may not function as intended.",
    ],
  },
  {
    heading: "Information Sharing",
    paragraphs: [
      "We share personal information only when necessary to provide requested services, when required by law, or to protect the safety of our residents, staff, and visitors.",
    ],
  },
  {
    heading: "Data Security",
    paragraphs: [
      "We take reasonable steps to protect the personal information we hold from loss, misuse, and unauthorized access. No method of transmission over the internet is completely secure, however, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "Your Choices",
    paragraphs: [
      "You may request to review, update, or delete the personal information we have collected about you. Contact us using the details below and we will respond in a reasonable timeframe.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      `If you have questions about this privacy statement, please contact ${site.name} at ${site.phone} or ${site.email}.`,
    ],
  },
];

export default function PrivacyPage() {
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
            <li aria-current="page">Privacy</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">Privacy Statement</h1>
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
                <p
                  key={paragraph}
                  className="text-ink mt-3 leading-relaxed"
                >
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
