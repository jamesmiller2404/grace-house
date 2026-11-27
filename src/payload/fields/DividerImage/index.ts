import type { Field } from "payload";

/**
 * Reusable fields for a "Divider" block inside any collection's `blocks` array.
 * Stores the static path under `/images/dividers/...` (auto-discovered from
 * `public/images/dividers/`) plus Left / Center (default) / Right alignment.
 */
export function DividerBlockFields(): Field[] {
  const isDivider = (
    _data: Record<string, unknown>,
    siblingData: Record<string, unknown>,
  ) => (siblingData as { type?: string } | null)?.type === "Divider";

  return [
    {
      name: "dividerImagePath",
      type: "text",
      label: "Divider / Ending Image",
      admin: {
        condition: isDivider,
        components: {
          Field: {
            path: "./src/payload/fields/DividerImage/Field.tsx",
          },
        },
      },
    },
    {
      name: "dividerAlign",
      type: "select",
      label: "Alignment",
      defaultValue: "center",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
      admin: {
        condition: isDivider,
        hidden: true,
      },
    },
  ];
}
