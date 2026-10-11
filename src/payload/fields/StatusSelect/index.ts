import type { SelectField } from "payload";

/**
 * Reusable admin "status" select field — a plain dropdown, not a searchable
 * combobox.
 *
 * Payload's built-in select field always renders a searchable react-select
 * (isSearchable is hardcoded true in its admin component and is not exposed
 * through the field config), which lets editors type free text into the
 * control. The admin panel instead renders the custom component
 * (`./Field.tsx`): the exact same markup and styling as Payload's select,
 * but with isSearchable/isClearable/isSortable off, so the field only ever
 * accepts its configured choices.
 *
 * Callers pass their overrides (name, options, required, admin.width, ...).
 * The custom admin component is preserved even when the caller overrides
 * `admin` — overrides are merged, not allowed to clobber `components`.
 */
export function StatusSelectField(
  overrides: Partial<SelectField> = {},
): SelectField {
  const baseAdmin = {
    components: {
      Field: {
        // Path is relative to the payload config directory (grace-house/)
        // and resolved into the generated admin importMap.
        path: "./src/payload/fields/StatusSelect/Field.tsx",
      },
    },
  };

  return {
    type: "select",
    ...overrides,
    admin: {
      ...baseAdmin,
      ...overrides.admin,
      components: {
        ...baseAdmin.components,
        ...overrides.admin?.components,
      },
    },
  } as SelectField;
}
