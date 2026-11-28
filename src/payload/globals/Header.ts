import { revalidatePath } from "next/cache";
import type { GlobalConfig } from "payload";

function safeRevalidateLayout() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Ignore when invoked outside a Next.js request context (e.g. CLI/migrations).
  }
}

const topBarEnabled = (_data: Record<string, unknown>, sibling: Record<string, unknown>) =>
  sibling?.enabled !== false;

/**
 * Header global — manages the site-wide top utility bar (visibility toggle,
 * colors, rich text, social/utility icons, and action buttons). Placed in the
 * same "Home Page" admin group as Footer.
 */
export const Header: GlobalConfig = {
  slug: "header",
  label: "Header",
  access: {
    read: () => true,
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        safeRevalidateLayout();
        return doc;
      },
    ],
  },
  admin: {
    group: "Home Page",
    description:
      "Configure the site-wide header top bar: toggle visibility, add rich text, social media or utility icons, and action buttons with links.",
  },
  fields: [
    {
      name: "topBar",
      type: "group",
      label: "Top Bar",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Show top bar",
          defaultValue: true,
          admin: {
            description:
              "Uncheck to hide the top bar across the entire site. When hidden, the main header automatically adjusts its layout and height.",
          },
        },
        {
          type: "row",
          admin: {
            condition: topBarEnabled,
          },
          fields: [
            {
              name: "backgroundColor",
              type: "text",
              label: "Background Color",
              defaultValue: "#624e92",
              admin: {
                width: "50%",
                description: "Hex color for the top bar background (default #624e92).",
                components: {
                  Field: {
                    path: "./src/payload/collections/Hero/ColorField.tsx",
                  },
                },
              },
            },
            {
              name: "textColor",
              type: "text",
              label: "Text & Icon Color",
              defaultValue: "#110d17",
              admin: {
                width: "50%",
                description: "Default hex color for text and icons in the top bar (default #110d17).",
                components: {
                  Field: {
                    path: "./src/payload/collections/Hero/ColorField.tsx",
                  },
                },
              },
            },
          ],
        },
        {
          name: "content",
          type: "richText",
          label: "Top Bar Text (optional)",
          admin: {
            condition: topBarEnabled,
            description:
              "Optional rich text shown on the left side of the top bar (supports bold, italic, and links).",
          },
        },
        {
          name: "phone",
          type: "text",
          label: "Centered Phone Number (optional)",
          admin: {
            condition: topBarEnabled,
            placeholder: "e.g. 916-470-0408",
            description:
              "Optional phone number centered in the middle of the top bar (automatically clickable as a tel: link).",
          },
        },
        {
          name: "icons",
          type: "array",
          label: "Social Media & Utility Icons (optional)",
          labels: {
            singular: "Social / Utility Icon",
            plural: "Social Media & Utility Icons",
          },
          admin: {
            condition: topBarEnabled,
            initCollapsed: false,
            description:
              "Add clickable social media or utility icons (Facebook, Instagram, YouTube, Phone, Email, etc.) to the top bar.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "icon",
                  type: "select",
                  label: "Icon",
                  required: true,
                  defaultValue: "facebook",
                  options: [
                    { label: "Facebook", value: "facebook" },
                    { label: "Instagram", value: "instagram" },
                    { label: "YouTube", value: "youtube" },
                    { label: "X (Twitter)", value: "x" },
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "TikTok", value: "tiktok" },
                    { label: "Phone", value: "phone" },
                    { label: "Email", value: "mail" },
                    { label: "Location Pin", value: "location" },
                    { label: "Clock / Hours", value: "clock" },
                    { label: "Heart", value: "heart" },
                    { label: "Info", value: "info" },
                  ],
                  admin: { width: "33%" },
                },
                {
                  name: "label",
                  type: "text",
                  label: "Label (tooltip / screen reader)",
                  required: true,
                  admin: {
                    width: "33%",
                    placeholder: "e.g. Follow us on Facebook",
                  },
                },
                {
                  name: "href",
                  type: "text",
                  label: "Link URL",
                  required: true,
                  admin: {
                    width: "34%",
                    placeholder: "https://... or tel:... or mailto:...",
                  },
                },
              ],
            },
            {
              name: "openInNewTab",
              type: "checkbox",
              label: "Open in new tab",
              defaultValue: true,
            },
          ],
        },
        {
          name: "buttons",
          type: "array",
          label: "Top Bar Buttons",
          labels: {
            singular: "Button",
            plural: "Buttons",
          },
          defaultValue: [
            {
              label: "GET HELP",
              href: "/get-help",
              bgColor: "#9e5640",
              textColor: "#ffffff",
              openInNewTab: false,
            },
            {
              label: "DONATE",
              href: "/support",
              bgColor: "#e3a857",
              textColor: "#242725",
              openInNewTab: false,
            },
          ],
          admin: {
            condition: topBarEnabled,
            initCollapsed: false,
            description:
              "Action buttons shown on the right side of the top bar (e.g. GET HELP and DONATE).",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "label",
                  type: "text",
                  label: "Button Label",
                  required: true,
                  admin: {
                    width: "50%",
                    placeholder: "e.g. GET HELP",
                  },
                },
                {
                  name: "href",
                  type: "text",
                  label: "Button Link",
                  required: true,
                  admin: {
                    width: "50%",
                    placeholder: "/get-help or https://...",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "bgColor",
                  type: "text",
                  label: "Background Color",
                  defaultValue: "#9e5640",
                  admin: {
                    width: "50%",
                    components: {
                      Field: {
                        path: "./src/payload/collections/Hero/ColorField.tsx",
                      },
                    },
                  },
                },
                {
                  name: "textColor",
                  type: "text",
                  label: "Text Color",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field: {
                        path: "./src/payload/collections/Hero/ColorField.tsx",
                      },
                    },
                  },
                },
              ],
            },
            {
              name: "openInNewTab",
              type: "checkbox",
              label: "Open in new tab",
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
};
