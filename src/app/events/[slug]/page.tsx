import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import EventPage from "@/components/EventPage";
import { getEventDetail, eventDetails } from "@/content/events";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return eventDetails.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventDetail(slug);
  if (!event) return {};
  return {
    title: `${event.title} — Grace House`,
  };
}

/**
 * A single event page, rendered from `eventDetails` content.
 * All `/events/<slug>` routes share the same layout via EventPage.
 */
export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const event = getEventDetail(slug);
  if (!event) notFound();

  return (
    <>
      <Nav />
      <main>
        <EventPage event={event} />
      </main>
    </>
  );
}