import type { TextField } from "payload";

/**
 * Reusable admin picker for a contact point registered in the Contact Info
 * panel (/admin/globals/contact-info) — a phone number, email address or
 * physical address — the same plain-dropdown treatment as StatusSelect
 * (src/payload/fields/StatusSelect/), plus:
 *
 *  - the choices load live from the Contact Info global, so numbers/emails
 *    registered there appear immediately in every picker;
 *  - every picker also offers "Other (enter manually)", which reveals the
 *    caller's own custom-value field (pair this with a `*Custom` text field
 *    conditioned on the stored value being "custom");
 *  - the stored value is either `registered:<row id>` — a live reference, so
 *    editing the number once in Contact Info updates every picker that chose
 *    it — or `custom`.
 *
 * The field is a plain text field server-side (a single varchar column, no
 * enum to migrate when numbers are registered/removed); the dropdown UI and
 * the "Missing — pick again" display for a deleted row live in the client
 * component (./Field.tsx, through the per-kind wrappers ./PhoneField.tsx /
 * ./EmailField.tsx). Callers pass their overrides (name, required, admin.*).
 * The custom admin component is preserved even when the caller overrides
 * `admin` — overrides are merged, not allowed to clobber `components`.
 */

/** Which registered list a picker offers — matches ContactSelectProps in Field.tsx. */
export type ContactSelectKind = "phone" | "email" | "address";

export function ContactSelectField(
  kind: ContactSelectKind,
  overrides: Partial<TextField> = {},
): TextField {
  const baseAdmin = {
    components: {
      Field: {
        // Path is relative to the payload config directory (grace-house/)
        // and resolved into the generated admin importMap.
        path: `./src/payload/fields/ContactSelect/${
          kind === "phone" ? "PhoneField" : kind === "email" ? "EmailField" : "AddressField"
        }.tsx`,
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
