import { readFile } from "fs/promises";
import path from "path";
import type { Payload } from "payload";

import { eventDetails } from "@/content/events";
import { heroDefaults } from "@/content/hero";
import { defaultHomeLayout } from "@/content/homeLayout";
import { introDefaults } from "@/content/intro";
import { missionPage } from "@/content/mission";
import { donateDefaults } from "@/content/donate";
import { pillars } from "@/content/pillars";
import { stories } from "@/content/stories";
import { storyProfiles } from "@/content/storyProfiles";
import { MAX_CUSTOM_PAGES } from "@/payload/collections/CustomPages";
import type { Story } from "../../payload-types";

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

/**
 * Seed the `hero` collection with the front page hero copy that already
 * exists in the app (the hero section in src/content/homePage.ts), uploading
 * its background image from public/images as a media document. Runs once,
 * when the hero collection is empty.
 */
export async function seedHero(payload: Payload): Promise<void> {
  // Upload the default hero image (e.g. /images/hero1a.jpg from public/).
  let imageId: number | undefined;
  try {
    const filePath = path.resolve(
      "public",
      heroDefaults.image.replace(/^[/\\]/, ""),
    );
    const data = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const media = await payload.create({
      collection: "media",
      data: {
        alt: "Grace House front page hero image",
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
      `Seed: could not upload the hero image "${heroDefaults.image}" — seeding the Hero without it.`,
    );
    payload.logger.debug({ error });
  }

  await payload.create({
    collection: "hero",
    data: {
      heading: heroDefaults.heading,
      eyebrow: heroDefaults.eyebrow,
      image: imageId,
    },
  });

  payload.logger.info(
    "Seed: created the front page Hero from src/content/homePage.ts.",
  );
}

/**
 * Seed the `intro` collection with the "What is Grace House" copy that already
 * exists in the app (`introDefaults` in src/content/intro.ts), so the admin
 * panel starts with the real section content. Runs once, when the intro
 * collection is empty.
 */
export async function seedIntro(payload: Payload): Promise<void> {
  await payload.create({
    collection: "intro",
    data: {
      heading: introDefaults.heading,
      body: introDefaults.body,
      pullQuote: introDefaults.pullQuote,
      linkLabel: introDefaults.linkLabel,
      linkHref: introDefaults.linkHref,
      bgColor: introDefaults.bgColor,
      textColor: introDefaults.textColor,
      linkColor: introDefaults.linkColor,
      linkHoverColor: introDefaults.linkHoverColor,
    },
  });

  payload.logger.info(
    "Seed: created the front page Intro section from src/content/intro.ts.",
  );
}

/**
 * Seed the `home-layout` global with the home page section order that already
 * exists in the app (`defaultHomeLayout` in src/content/homeLayout.ts), so the
 * admin panel (/admin/globals/home-layout) starts with every section listed,
 * shown and in the current order. Only writes when the layout is still empty,
 * so it never overwrites an editor's saved order.
 */
export async function seedHomeLayout(payload: Payload): Promise<void> {
  const current = await payload.findGlobal({ slug: "home-layout" });
  if (current.sections && current.sections.length > 0) return;

  await payload.updateGlobal({
    slug: "home-layout",
    data: {
      sections: defaultHomeLayout,
    },
  });

  payload.logger.info(
    "Seed: created the home page layout from src/content/homeLayout.ts.",
  );
}

/**
 * Upload one image from public/ as a `media` document and return its id.
 * Shared by seedStories (the events / hero seeds keep their own inline copies
 * so this addition never touches their behaviour).
 */
async function uploadSeedImage(
  payload: Payload,
  imagePath: string,
  alt: string,
): Promise<number> {
  const filePath = path.resolve("public", imagePath.replace(/^[/\\]/, ""));
  const data = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const media = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data,
      mimetype: MIME_TYPES[extension] ?? "application/octet-stream",
      name: path.basename(filePath),
      size: data.byteLength,
    },
  });
  return media.id;
}

/**
 * Seed the `stories` collection with the profiles that already exist in the
 * app (`storyProfiles` in src/content/storyProfiles.ts, plus the card fields
 * from `stories` in src/content/stories.ts), uploading each portrait and
 * memory photo from public/images as a media document so every seeded story
 * has its photos. Runs once, when the stories collection is empty.
 */
export async function seedStories(payload: Payload): Promise<void> {
  for (const profile of storyProfiles) {
    // The card fields (date, excerpt, readLabel) live in src/content/stories.ts.
    const card = stories.find((item) => item.name === profile.name);

    // 1. Upload the portrait photo (skipped if the file cannot be read).
    let imageId: number | undefined;
    if (profile.image) {
      try {
        imageId = await uploadSeedImage(
          payload,
          profile.image,
          `${profile.name} — story portrait`,
        );
      } catch (error) {
        payload.logger.error(
          `Seed: could not upload the portrait "${profile.image}" for "${profile.name}" — seeding the story without it.`,
        );
        payload.logger.debug({ error });
      }
    }

    // 2. Upload the memories gallery photos.
    const memories: Array<{ image: number; alt: string; caption: string }> = [];
    for (const memory of profile.memories) {
      try {
        const id = await uploadSeedImage(payload, memory.image, memory.alt);
        memories.push({ image: id, alt: memory.alt, caption: memory.caption });
      } catch (error) {
        payload.logger.error(
          `Seed: could not upload a memory photo "${memory.image}" for "${profile.name}" — skipping it.`,
        );
        payload.logger.debug({ error });
      }
    }

    // 3. Create the story with all of its information.
    await payload.create({
      collection: "stories",
      data: {
        name: profile.name,
        // Narrow the free-form tag to the role select's choices.
        role:
          profile.tag === "Volunteer" || profile.tag === "Staff"
            ? profile.tag
            : "Graduate",
        image: imageId,
        imagePositionX: 50,
        imagePositionY: 50,
        pullQuote: profile.heroQuote,
        body: profile.body.map((block) => ({
          type: block.type === "h2" ? "Heading" : "Paragraph",
          text: block.text,
        })),
        bannerQuote: {
          quote: profile.quoteBand.quote,
          attribution: profile.quoteBand.attribution,
        },
        // The pillar that mattered most, stored by its title.
        pillar: (pillars[profile.pillarIndex]?.title ??
          pillars[0].title) as Story["pillar"],
        date: card?.date,
        excerpt: card?.excerpt,
        readLabel: card?.readLabel,
        closing: {
          heading: profile.closing.heading,
          paragraphs: profile.closing.paragraphs.map((text) => ({ text })),
        },
        pronouns: {
          subject: profile.pronouns.subject,
          possessive: profile.pronouns.possessive,
        },
        memories,
      },
    });
  }

  payload.logger.info(
    `Seed: created ${storyProfiles.length} stories from src/content/storyProfiles.ts.`,
  );
}

/**
 * Seed the `donate` collection with the Donate page copy that already exists
 * in the app (`donateDefaults` in src/content/donate.ts), so the admin panel
 * starts with the real page content. Runs once, when the donate collection is
 * empty.
 */
export async function seedDonate(payload: Payload): Promise<void> {
  const d = donateDefaults;
  await payload.create({
    collection: "donate",
    data: {
      title: d.title,
      intro: d.intro,
      paypal: d.paypal,
      venmo: d.venmo,
      note: d.note,
      blocks: d.blocks,
    },
  });

  payload.logger.info(
    "Seed: created the Donate page from src/content/donate.ts.",
  );
}

/**
 * Seed the `custom-pages` collection with the three pre-wired spare pages —
 * "Spare Page 1/2/3", each disabled (hidden from the header's "More"
 * dropdown, URL 404s) and empty, ready for an editor to put to work. Runs
 * once, when the collection is empty, and tops up any missing spare page
 * numbers afterwards so the collection always offers all three.
 */
export async function seedCustomPages(payload: Payload): Promise<void> {
  for (let i = 1; i <= MAX_CUSTOM_PAGES; i++) {
    await payload.create({
      collection: "custom-pages",
      data: {
        title: `Spare Page ${i}`,
        enabled: false,
        blocks: [],
      },
    });
  }

  payload.logger.info(
    "Seed: created the three spare custom pages (hidden until used).",
  );
}
