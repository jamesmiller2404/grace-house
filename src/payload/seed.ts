import { readFile } from "fs/promises";
import path from "path";
import type { Payload } from "payload";

import { eventDetails } from "@/content/events";
import { missionPage } from "@/content/mission";

/** Mime types for the image extensions used in public/images. */
const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Phone/email from the existing event pages in src/content/events.ts. */
const CONTACT_PHONE = "(916) 555-5555";
const CONTACT_EMAIL = "ghemail@gmail.com";

/**
 * Seed the `events` and `media` collections with the events that already
 * exist in the app (`eventDetails` in src/content/events.ts), uploading the
 * referenced images from public/images as media documents so every seeded
 * event has its accompanying image. Runs once, when the events collection
 * is empty.
 */
export async function seedEvents(payload: Payload): Promise<void> {
  for (const detail of eventDetails) {
    // 1. Upload the event image (e.g. /images/halloween1.png from public/).
    let imageId: number | undefined;
    try {
      const filePath = path.resolve(
        "public",
        detail.image.replace(/^[/\\]/, ""),
      );
      const data = await readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();
      const media = await payload.create({
        collection: "media",
        data: {
          alt: `${detail.title} event image`,
        },
        file: {
          data,
          mimetype: MIME_TYPES[extension] ?? "application/octet-stream",
          name: path.basename(filePath),
          size: data.byteLength,
        },
      });
      imageId = media.id;
    } catch (error) {
      payload.logger.error(
        `Seed: could not upload image "${detail.image}" for "${detail.title}" — skipping event.`,
      );
      payload.logger.debug({ error });
      continue;
    }

    // 2. Create the event with all of its information.
    await payload.create({
      collection: "events",
      data: {
        title: detail.title,
        description: detail.description,
        status:
          detail.status === "Past" || detail.status === "Cancelled"
            ? detail.status
            : "Upcoming",
        date: detail.date,
        startTime: detail.startTime,
        endTime: detail.endTime,
        location: detail.location,
        city: detail.city,
        cost: detail.cost,
        image: imageId,
        about: detail.about.map((text) => ({ text })),
        whatToExpect: detail.whatToExpect.map((text) => ({ text })),
        contact: {
          phone: CONTACT_PHONE,
          email: CONTACT_EMAIL,
        },
      },
    });
  }

  payload.logger.info(
    `Seed: created ${eventDetails.length} events from src/content/events.ts.`,
  );
}

/**
 * Seed the `mission-page` collection with the Mission page copy that
 * already exists in the app (`missionPage` in src/content/mission.ts), so
 * the admin panel starts with the real page content. Runs once, when the
 * mission-page collection is empty.
 */
export async function seedMissionPage(payload: Payload): Promise<void> {
  await payload.create({
    collection: "mission-page",
    data: {
      title: missionPage.missionHeading,
      body: missionPage.missionStatement,
    },
  });

  payload.logger.info(
    "Seed: created the Mission page from src/content/mission.ts.",
  );
}
