import type { CollectionConfig } from "payload";

const showCardCondition = (data: Record<string, unknown> | undefined) =>
  data?.showCard !== false;

/**
 * Front-page hero — the Payload version of the hero section in
 * `src/content/homePage.ts` (each field maps 1:1 to that section's props).
 *
 * The admin panel (/admin/collections/hero) gives an editor:
 *  - the background image, chosen from the Media collection
 *  - optional overlay card toggle, color, opacity, X/Y placement, and width/height
 *  - optional main heading and subline ("eyebrow") with customizable text colors
 *  - two optional CTA buttons with customizable labels, links, and colors
 *
 * Only one document should exist here; the site reads the first one.
 */
export const Hero: CollectionConfig = {
  slug: "hero",
  labels: {
    singular: "Hero",
    plural: "Hero",
  },
  // Public site content — allow anonymous reads of the REST API.
  // (The site itself reads through the Local API, which bypasses
  // access control; this opens the public /api/hero endpoint.)
  access: {
    read: () => true,
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "editor",
  },
  admin: {
    group: "Home Page",
    useAsTitle: "heading",
    defaultColumns: ["heading", "eyebrow", "updatedAt"],
    description:
      "The front page hero: background image, optional overlay card (color, opacity, position, size), optional heading/subline, and optional action buttons.",
    components: {
      beforeList: [
        { path: "./src/payload/components/DashboardListButton.tsx" },
      ],
      views: {
        edit: {
          default: {
            Component: {
              path: "./src/payload/collections/Hero/EditView.tsx",
            },
          },
        },
      },
      // "Cancel" and "Done" buttons next to Save on the edit page — they
      // render in the document controls bar (before the Save button, in
      // array order) so the bar reads "Cancel | Done | Save", exactly like
      // the Events pages. Both Cancel and Done return to the Hero list.
      edit: {
        beforeDocumentControls: [
          {
            path: "./src/payload/collections/Hero/CancelToDashboardButton.tsx",
          },
          {
            path: "./src/payload/collections/Hero/DoneToListButton.tsx",
          },
        ],
      },
    },
  },
  fields: [
    {
      name: "heroPreview",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "./src/payload/collections/Hero/PreviewField.tsx",
          },
        },
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: false,
      admin: {
        components: {
          Field: {
            path: "./src/payload/fields/MediaPickerUploadField.tsx",
          },
        },
        description:
          "The background image behind the hero section. Optional — the site falls back to the default image when empty.",
      },
    },
    {
      name: "showCard",
      type: "checkbox",
      label: "Show overlay card",
      defaultValue: true,
      admin: {
        description:
          "Uncheck to hide the translucent card, text, and buttons and display only the hero background image.",
      },
    },
    {
      name: "heading",
      type: "text",
      required: false,
      label: false,
      admin: {
        placeholder: "Heading (optional)...",
        description:
          "Optional main heading inside the hero card (e.g. \"Hope Starts Here\"). Leave blank to hide.",
        condition: showCardCondition,
      },
    },
    {
      name: "eyebrow",
      type: "text",
      label: false,
      admin: {
        placeholder: "Eyebrow (optional)...",
        description:
          "Optional subline shown beneath the heading (e.g. \"Faith-Based Recovery\"). Leave blank to hide.",
        condition: showCardCondition,
      },
    },
    {
      name: "subtext",
      type: "text",
      label: false,
      admin: {
        placeholder: "Third text line (optional)...",
        description:
          "Optional third line of text shown beneath the eyebrow. Leave blank to hide.",
        condition: showCardCondition,
      },
    },
    {
      type: "collapsible",
      label: "Card Appearance & Colors",
      admin: {
        initCollapsed: false,
        condition: showCardCondition,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "cardColor",
              type: "text",
              label: "Card Background Color",
              defaultValue: "#0f172a",
              admin: {
                width: "50%",
                description: "Hex color for the overlay card (default #0f172a).",
                components: {
                  Field: {
                    path: "./src/payload/collections/Hero/ColorField.tsx",
                  },
                },
              },
            },
            {
              name: "cardOpacity",
              type: "number",
              label: "Card Opacity (%)",
              min: 0,
              max: 100,
              defaultValue: 55,
              admin: {
                width: "50%",
                description: "0% is fully transparent, 100% is solid (default 55%).",
                components: {
                  Field: {
                    path: "./src/payload/collections/Hero/OpacityField.tsx",
                  },
                },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "headingColor",
              type: "text",
              label: "Heading Text Color",
              defaultValue: "#ffffff",
              admin: {
                width: "50%",
                description: "Hex color for the heading text (default #ffffff).",
                components: {
                  Field: {
                    path: "./src/payload/collections/Hero/ColorField.tsx",
                  },
                },
              },
            },
            {
              name: "eyebrowColor",
              type: "text",
              label: "Eyebrow Text Color",
              defaultValue: "#c9a45c",
              admin: {
                width: "50%",
                description: "Hex color for the subline text (default #c9a45c).",
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
          type: "row",
          fields: [
            {
              name: "headingFontSize",
              type: "number",
              label: "Heading Font Size (px)",
              min: 16,
              max: 120,
              defaultValue: 60,
              admin: {
                width: "50%",
                description: "Desktop heading size in pixels (16–120, default 60).",
              },
            },
            {
              name: "eyebrowFontSize",
              type: "number",
              label: "Eyebrow Font Size (px)",
              min: 10,
              max: 48,
              defaultValue: 19,
              admin: {
                width: "50%",
                description: "Desktop subline size in pixels (10–48, default 19).",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "subtextColor",
              type: "text",
              label: "Third Line Text Color",
              defaultValue: "#f7f3eb",
              admin: {
                width: "50%",
                description: "Hex color for the optional third text line (default #f7f3eb).",
                components: {
                  Field: {
                    path: "./src/payload/collections/Hero/ColorField.tsx",
                  },
                },
              },
            },
            {
              name: "subtextFontSize",
              type: "number",
              label: "Third Line Font Size (px)",
              min: 10,
              max: 48,
              defaultValue: 18,
              admin: {
                width: "50%",
                description: "Desktop third-line size in pixels (10–48, default 18).",
              },
            },
          ],
        },
        {
          name: "textShadow",
          type: "group",
          label: "Text Drop Shadow (Heading & Eyebrow)",
          fields: [
            {
              name: "enabled",
              type: "checkbox",
              label: "Enable Text Drop Shadow",
              defaultValue: false,
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  Boolean((siblingData as { enabled?: boolean } | null)?.enabled),
              },
              fields: [
                {
                  name: "color",
                  type: "text",
                  label: "Shadow Color",
                  defaultValue: "#000000",
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
                  name: "opacity",
                  type: "number",
                  label: "Shadow Opacity (%)",
                  min: 0,
                  max: 100,
                  defaultValue: 75,
                  admin: {
                    width: "50%",
                    components: {
                      Field: {
                        path: "./src/payload/collections/Hero/OpacityField.tsx",
                      },
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  Boolean((siblingData as { enabled?: boolean } | null)?.enabled),
              },
              fields: [
                {
                  name: "distance",
                  type: "number",
                  label: "Distance (px)",
                  min: 0,
                  max: 50,
                  defaultValue: 4,
                  admin: {
                    width: "50%",
                    description: "How far the shadow is offset from the text (0–50px).",
                  },
                },
                {
                  name: "angle",
                  type: "number",
                  label: "Angle (deg)",
                  min: 0,
                  max: 360,
                  defaultValue: 135,
                  admin: {
                    width: "50%",
                    description: "Direction of the shadow in degrees (0–360°).",
                  },
                },
              ],
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  Boolean((siblingData as { enabled?: boolean } | null)?.enabled),
              },
              fields: [
                {
                  name: "fuzziness",
                  type: "number",
                  label: "Fuzziness / Blur (px)",
                  min: 0,
                  max: 50,
                  defaultValue: 6,
                  admin: {
                    width: "50%",
                    description: "Softness/blur radius of the shadow (0–50px).",
                  },
                },
                {
                  name: "extent",
                  type: "number",
                  label: "Extent / Spread (px)",
                  min: 0,
                  max: 20,
                  defaultValue: 0,
                  admin: {
                    width: "50%",
                    description: "How far the shadow expands outward before blurring (0–20px).",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Card Position & Size",
      admin: {
        initCollapsed: false,
        condition: showCardCondition,
      },
      fields: [
        {
          name: "cardPositionPicker",
          type: "ui",
          admin: {
            components: {
              Field: {
                path: "./src/payload/collections/Hero/CardPositionField.tsx",
              },
            },
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "cardPositionX",
              type: "number",
              label: "Horizontal Position X (%)",
              min: 0,
              max: 100,
              defaultValue: 50,
              admin: {
                width: "50%",
                description: "0% = left edge, 50% = centered, 100% = right edge.",
              },
            },
            {
              name: "cardPositionY",
              type: "number",
              label: "Vertical Position Y (%)",
              min: 0,
              max: 100,
              defaultValue: 5,
              admin: {
                width: "50%",
                description: "0% = top edge, 50% = middle, 100% = bottom edge.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "cardWidth",
              type: "number",
              label: "Card Width (px)",
              min: 200,
              max: 1200,
              admin: {
                width: "50%",
                placeholder: "Auto (default)",
                description:
                  "Optional width in pixels (200–1200). Leave blank for default auto-fit width.",
              },
            },
            {
              name: "cardHeight",
              type: "number",
              label: "Card Height (px)",
              min: 100,
              max: 600,
              admin: {
                width: "50%",
                placeholder: "Auto (default)",
                description:
                  "Optional minimum height in pixels (100–600). Leave blank for default auto-fit height.",
              },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Buttons",
      admin: {
        initCollapsed: false,
        condition: showCardCondition,
      },
      fields: [
        {
          name: "primaryCta",
          type: "group",
          label: "Primary Button",
          fields: [
            {
              name: "enabled",
              type: "checkbox",
              label: "Show Primary Button",
              defaultValue: true,
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  (siblingData as { enabled?: boolean } | null)?.enabled !== false,
              },
              fields: [
                {
                  name: "label",
                  type: "text",
                  label: "Button Label",
                  defaultValue: "Get Help",
                  admin: {
                    width: "50%",
                    placeholder: "Get Help",
                  },
                },
                {
                  name: "href",
                  type: "text",
                  label: "Button Link",
                  defaultValue: "#help",
                  admin: {
                    width: "50%",
                    placeholder: "#help or /get-help",
                  },
                },
              ],
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  (siblingData as { enabled?: boolean } | null)?.enabled !== false,
              },
              fields: [
                {
                  name: "bgColor",
                  type: "text",
                  label: "Button Background Color",
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
                  label: "Button Text Color",
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
          ],
        },
        {
          name: "secondaryCta",
          type: "group",
          label: "Secondary Button",
          fields: [
            {
              name: "enabled",
              type: "checkbox",
              label: "Show Secondary Button",
              defaultValue: true,
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  (siblingData as { enabled?: boolean } | null)?.enabled !== false,
              },
              fields: [
                {
                  name: "label",
                  type: "text",
                  label: "Button Label",
                  defaultValue: "Our Stories",
                  admin: {
                    width: "50%",
                    placeholder: "Our Stories",
                  },
                },
                {
                  name: "href",
                  type: "text",
                  label: "Button Link",
                  defaultValue: "/#stories",
                  admin: {
                    width: "50%",
                    placeholder: "/#stories or /stories",
                  },
                },
              ],
            },
            {
              type: "row",
              admin: {
                condition: (_data, siblingData) =>
                  (siblingData as { enabled?: boolean } | null)?.enabled !== false,
              },
              fields: [
                {
                  name: "bgColor",
                  type: "text",
                  label: "Button Background Color",
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
                {
                  name: "textColor",
                  type: "text",
                  label: "Button Text Color",
                  defaultValue: "#242725",
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
          ],
        },
      ],
    },
  ],
};
