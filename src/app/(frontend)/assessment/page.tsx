import Link from "next/link";
import { site } from "@/content/site";

export const metadata = {
  title: "Assessment — Grace House",
};

const sections = [
  {
    heading: "About This Assessment",
    paragraphs: [
      "Start your application, anytime.\n\nYou don't have to wait for office hours or a phone call to take the first step. This short assessment asks the same questions our staff would ask you over the phone, so you can answer them on your own time, whether that's at midnight or on your lunch break.",
    ],
  },
  {
    heading: "What to Expect",
    paragraphs: [
      "It takes about 10 minutes.\n\nThe questions are about your current situation and help us understand whether our program is the right fit.\n\nTake your time. You can answer in your own words wherever there's space to add detail.",
    ],
  },
  {
    heading: "What Happens Next",
    paragraphs: [
      `A member of our team will personally review your answers within two business days. If the program looks like a good fit, we'll reach out to talk about next steps. If it isn't, we'll still do our best to point you toward other resources.\n\nPlease note: Completing the assessment doesn't guarantee a spot in the program, but it's the fastest way to get your information in front of our team.`,
    ],
    cta: { label: "Begin Assessment", href: "#" },
  },
  {
    heading: "Need Help Now?",
    paragraphs: [
      `If you need to speak with someone right away, call us at ${site.phone} or email ${site.email}. If you are experiencing a crisis, please use one of the 24/7 resources listed below or dial 988 for the Suicide & Crisis Lifeline.`,
    ],
  },
];

export default function AssessmentPage() {
  return (
    <main className="flex-1 bg-[#e7d8c3] px-6 py-14">
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
            <li aria-current="page">Assessment</li>
          </ol>
        </nav>

        <div className="bg-gold mb-4 h-[4px] w-28 rounded-full" />
        <h1 className="font-heading text-ink text-5xl">Start Your Assessment</h1>
        <p className="text-ink/70 mt-4 max-w-[60ch] leading-relaxed">
          Placeholder page — the Grace House Assessment Form is coming soon.
        </p>

        <div className="mt-10 max-w-[70ch] space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-ink text-2xl font-semibold">
                {section.heading}
              </h2>
              {section.paragraphs
                .flatMap((paragraph) => paragraph.split("\n\n"))
                .map((paragraph) => (
                  <p key={paragraph} className="text-ink mt-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              {section.cta && (
                <Link
                  href={section.cta.href}
                  className="bg-terra hover:bg-terra/90 mt-5 inline-block rounded-md px-6 py-3 font-semibold text-white"
                >
                  {section.cta.label}
                </Link>
              )}
            </section>
          ))}
        </div>

        <div className="ml-[100px] mt-8 max-w-[70ch] bg-[#9f5741] px-8 py-8 rounded-md">
          <h2 className="font-heading text-ink text-2xl">
            NOTE:
          </h2>
          <div className="text-ink mt-3 space-y-3 text-sm font-semibold leading-relaxed">
            {`Beta-only note for the client (will be removed before launch)

Advantages to this approach: Screening questions that staff currently ask by phone are answered online instead, and staff review the responses and make the final decision. This means:

- Access any hour: People in crisis can take action at 2 a.m. instead of waiting for someone to pick up, which gives them a real sense of progress.

- Fewer repetitive screening calls: Eligibility questions are answered in writing ahead of time by a certain percentage of perspective residence, so staff review them on their own schedule and reserve more phone conversations for applicants who appear to be a good fit.

- Staff stay in control: Nothing is automated. A person reviews every submission and makes every decision.`
              .split("\n\n")
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
