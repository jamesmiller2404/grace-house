import type { TextField } from "payload";

/**
 * Reusable admin "time of day" field.
 *
 * The value is stored as plain text (e.g. "4:00 PM"), so it matches the seed
 * data and the frontend rendering exactly — but the admin panel renders a
 * custom component (`./Field.tsx`) that shows a text input (for manual entry)
 * next to a "Pick a time" popup with every half-hour of the day, like the
 * date field's picker popup.
 *
 * Callers pass their overrides (name, required, admin.description, ...).
 * The custom admin component is preserved even when the caller overrides
 * `admin` — overrides are merged, not allowed to clobber `components`.
 */
export function TimeField(overrides: Partial<TextField> = {}): TextField {
  const baseAdmin = {
    components: {
      Field: {
        // Path is relative to the payload config directory (grace-house/)
        // and resolved into the generated admin importMap.
        path: "./src/payload/fields/TimePicker/Field.tsx",
      },
    },
  };

  return {
    type: "text",
    ...overrides,
    admin: {
      ...baseAdmin,
      ...overrides.admin,
      components: {
        ...baseAdmin.components,
        ...overrides.admin?.components,
      },
    },
  } as TextField;
}