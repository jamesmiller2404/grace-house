import type { NumberField } from "payload";

/**
 * Admin "image position" field pair for event images.
 *
 * The value is stored as two plain numbers (`imagePositionX` and
 * `imagePositionY`, each 0–100, like CSS `object-position` percentages),
 * so the frontend can reproduce the saved composition exactly with
 * `object-position: ${x}% ${y}%` on the event page's `object-cover` image.
 *
 * The admin panel renders `imagePositionY` as a custom component
 * (`./Field.tsx`): a 16:10 preview window — matching the event page's
 * image container — showing the currently selected image scaled to fill
 * ("cover") it. The editor drags the image with mouse or finger to set the
 * composition; drag is clamped to the image's real overflow (a
 * horizontally-filling image only moves up/down, a vertically-filling one
 * only left/right), so it can never leave empty space in the frame.
 * The companion `imagePositionX` field is `admin.hidden` — the dragger
 * keeps both values in sync.
 *
 * Callers pass their overrides (name, required, admin.description, ...).
 * The custom admin component is preserved even when the caller overrides
 * `admin` — overrides are merged, not allowed to clobber `components`.
 */
export function ImagePositionField(
  overrides: Partial<NumberField> = {},
): NumberField {
  const baseAdmin = {
    components: {
      Field: {
        // Path is relative to the payload config directory (grace-house/)
        // and resolved into the generated admin importMap.
        path: "./src/payload/fields/ImagePosition/Field.tsx",
      },
    },
  };

  return {
    type: "number",
    ...overrides,
    admin: {
      ...baseAdmin,
      ...overrides.admin,
      components: {
        ...baseAdmin.components,
        ...overrides.admin?.components,
      },
    },
  } as NumberField;
}