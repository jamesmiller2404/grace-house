import type { NumberField } from "payload";

/**
 * Per-collection configuration for the reusable image-position field pair.
 * These are forwarded to the admin component through the field config's
 * `clientProps` (Payload spreads a component's `clientProps` onto it as
 * top-level props), so the same component can serve any collection.
 */
export type ImagePositionOptions = {
  /**
   * CSS aspect-ratio of the frame the preview mimics. It must match the
   * aspect-ratio the frontend renders the image in, or the saved composition
   * won't match the site. Defaults to "16 / 10" (the event page frame);
   * e.g. the Stories profile frame is "4 / 5".
   */
  aspectRatio?: string;
  /**
   * Name of the sibling upload field that holds the image. Defaults to
   * "image".
   */
  imageField?: string;
  /**
   * Path of the sibling number field that holds the horizontal position.
   * Defaults to "imagePositionX".
   */
  xField?: string;
};

/**
 * Admin "image position" field pair for a collection's featured image.
 *
 * The value is stored as two plain numbers (`imagePositionX` and
 * `imagePositionY`, each 0–100, like CSS `object-position` percentages),
 * so the frontend can reproduce the saved composition exactly with
 * `object-position: ${x}% ${y}%` on the page's `object-cover` image.
 *
 * The admin panel renders `imagePositionY` as a custom component
 * (`./Field.tsx`): a preview window at the frame's aspect ratio — matching
 * the page's image container — showing the currently selected image scaled
 * to fill ("cover") it. The editor drags the image with mouse or finger to
 * set the composition; drag is clamped to the image's real overflow (a
 * width-filling image only moves up/down, a height-filling one only
 * left/right), so it can never leave empty space in the frame.
 * The companion `imagePositionX` field is `admin.hidden` — the dragger
 * keeps both values in sync.
 *
 * Callers pass their overrides (name, required, admin.description, ...) as
 * the first argument, and their collection-specific options (aspect ratio,
 * sibling field names) as the second. The custom admin component is
 * preserved even when the caller overrides `admin` — overrides are merged,
 * not allowed to clobber `components`.
 */
export function ImagePositionField(
  overrides: Partial<NumberField> = {},
  options: ImagePositionOptions = {},
): NumberField {
  const baseAdmin = {
    components: {
      Field: {
        // Path is relative to the payload config directory (grace-house/)
        // and resolved into the generated admin importMap.
        path: "./src/payload/fields/ImagePosition/Field.tsx",
        // Forwarded to the component as props (see ImagePositionOptions).
        clientProps: {
          aspectRatio: options.aspectRatio,
          imageField: options.imageField,
          xField: options.xField,
        },
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