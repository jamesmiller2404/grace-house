import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventPage from "@/components/EventPage";
import { getEventBySlug } from "@/payload/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.title} — Grace House`,
  };
}

/**
 * A single event page, rendered from the `events` collection in the database
 * (managed in /admin/collections/events). The slug is derived from the event's
 * title, so every event in the database gets a page automatically, and all
 * `/events/<slug>` routes share the same layout via EventPage. Pages render at
 * request time, so edits made in the admin panel show up immediately.
 */
export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <main className="flex-1">
        <EventPage event={event} />
      </main>
    </>
  );
}
