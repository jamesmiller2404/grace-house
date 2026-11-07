import type { SelectField } from "payload";

/** Button selector for content block types. The stored values stay unchanged
 * (Heading, Paragraph, Photo) to preserve compatibility with existing content.
 */
export function BlockTypeButtonsField(
  overrides: Partial<SelectField> = {},
): SelectField {
  const baseAdmin = {
    components: {
      Field: {
        path: "./src/payload/fields/BlockTypeButtons/Field.tsx",
      },
    },
  };

  return {
    type: "select",
    options: [
      { label: "Header", value: "Heading" },
      { label: "Paragraph", value: "Paragraph" },
    ],
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
