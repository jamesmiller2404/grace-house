"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  RenderCustomComponent,
  useField,
  usePayloadAPI,
  type ReactSelectOption,
} from "@payloadcms/ui";
import type {
  TextFieldClientProps,
  Validate,
} from "payload";
import React, { useCallback, useMemo } from "react";

/**
 * Generic admin component for the ContactSelect field factory (./index.ts) —
 * a dropdown of the phone numbers / email addresses registered in the
 * Contact Info panel (/admin/globals/contact-info) plus an "Other (enter
 * manually)" choice that reveals the caller's custom-value text field.
 *
 * Payload's select field cannot take dynamic options (this version's
 * `options` only accepts a static list), so this component loads the
 * registered list live from the Contact Info global's public REST endpoint
 * (same origin as the admin panel) and renders it in Payload's own select
 * markup — the same .field-type.select / .field-label / .field-type__wrap
 * classes and non-searchable ReactSelect as StatusSelect
 * (src/payload/fields/StatusSelect/Field.tsx), whose markup this copies.
 *
 * Which list is offered — phone numbers or emails — is baked in by the thin
 * wrappers (./PhoneField.tsx, ./EmailField.tsx) through `contactKind`, since
 * a field's `custom` config is not guaranteed to reach the client component.
 *
 * The stored value is either `registered:<row id>` (a live reference: edit the
 * number once in the Contact Info panel and every picker follows) or
 * `custom`. If a picked row has since been deleted, it shows as "Missing —
 * pick again" so the saved choice is never silently cleared; the front end
 * (src/payload/queries.ts -> resolveContact) falls back to the first
 * registered entry in that case.
 */

/** One registered phone/email row as the Contact Info global's REST API returns it. */
type RegisteredRow = { id: string; label?: string | null; value: string };

export type ContactSelectProps = TextFieldClientProps & {
  /**
   * Which registered list this picker offers — set by the wrappers: the
   * phone-number, email-address or physical-address rows of the Contact
   * Info global.
   */
  contactKind: "phone" | "email" | "address";
};

const REGISTERED_PREFIX = "registered:";

const ContactSelectField: React.FC<ContactSelectProps> = ({
  contactKind,
  ...props
}) => {
  const {
    field,
    field: { label, localized, required },
    path: pathFromProps,
    readOnly,
    validate,
  } = props;

  // TextFieldClientProps["field"]["admin"] resolves to a Pick-over-optional
  // type that TypeScript refuses to destructure cleanly (TS2339 on perfectly
  // real properties) — the same structural cast StatusSelect uses.
  const { className, description, placeholder } = (field.admin ?? {}) as {
    className?: string;
    description?: string;
    placeholder?: string;
  };

  // The registered phone numbers / emails, loaded live from the Contact Info
  // global (same origin as the admin panel, public read).
  const [{ data, isError, isLoading }] = usePayloadAPI(
    "/api/globals/contact-info",
  );
  const contactRows = (data ?? {}) as {
    phoneNumbers?: RegisteredRow[];
    emails?: RegisteredRow[];
    addresses?: RegisteredRow[];
  };

  // The dropdown's choices: every registered entry of this kind (labelled
  // "Office — (916) 470-0408" / "Grace House — 6121 Marwick Way, …"), plus
  // the manual-entry choice.
  const options = useMemo(() => {
    const rows =
      (contactKind === "phone"
        ? contactRows.phoneNumbers
        : contactKind === "email"
          ? contactRows.emails
          : contactRows.addresses) ?? [];
    const registered = rows
      .filter((row) => row.value?.trim())
      .map((row) => ({
        label: row.label ? `${row.label} — ${row.value}` : row.value,
        value: `${REGISTERED_PREFIX}${row.id}`,
      }));
    return [
      ...registered,
      { label: "Other (enter manually)", value: "custom" },
    ];
  }, [contactKind, contactRows]);

  // Same validation wiring as StatusSelect (src/payload/fields/StatusSelect/
  // Field.tsx): keep the server-provided validate function, but hand it the
  // context shape useField's Validate expects — the cast just satisfies the
  // full parameter type of the text field's own validate function.
  const memoizedValidate = useCallback<Validate>(
    (value, validationOptions) => {
      if (typeof validate === "function") {
        return validate(
          value,
          validationOptions as unknown as Parameters<typeof validate>[1],
        );
      }
      return true;
    },
    [validate],
  );

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } =
      {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField<string | null>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  });

  const onChange = useCallback(
    (selectedOption: ReactSelectOption | ReactSelectOption[]) => {
      if (!readOnly && !disabled) {
        const optionValue =
          selectedOption && !Array.isArray(selectedOption)
            ? selectedOption.value
            : null;
        const newValue = typeof optionValue === "string" ? optionValue : null;
        // The dropdown is not clearable, so a change always carries a choice.
        setValue(newValue);
      }
    },
    [readOnly, disabled, setValue],
  );

  // ReactSelect wants the selected option object, not the raw stored value.
  // A value that is not in the options (a registered row deleted since it
  // was picked, or the list still loading) keeps its own option so the saved
  // choice is displayed, never silently cleared.
  const valueToRender = useMemo(() => {
    if (typeof value === "string" && value) {
      const matchingOption = options.find((option) => option.value === value);
      if (matchingOption) return matchingOption;
      return {
        label: isLoading
          ? "…"
          : `Missing — pick again (${value.replace(REGISTERED_PREFIX, "")})`,
        value,
      };
    }
    return null;
  }, [value, options, isLoading]);

  // The same style merge Payload's built-in fields use: admin.width becomes
  // the --field-width custom property, and an explicit style.flex still wins.
  const style = useMemo(() => {
    const merged: Record<string, unknown> = {
      ...(field.admin?.style ?? {}),
    };
    if (field.admin?.width) {
      merged["--field-width"] = field.admin.width;
    } else {
      merged.flex = "1 1 auto";
    }
    if (typeof field.admin?.style?.flex === "string") {
      merged.flex = field.admin.style.flex;
    }
    return merged as React.CSSProperties;
  }, [field]);

  return (
    <div
      className={`field-type select${className ? ` ${className}` : ""}`}
      id={`field-${path.replace(/\./g, "__")}`}
      style={style}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel
            label={label}
            localized={localized}
            path={path}
            required={required}
          />
        }
      />
      <div className="field-type__wrap">
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        {BeforeInput}
        <ReactSelect
          disabled={readOnly || disabled}
          isClearable={false}
          isSearchable={false}
          isSortable={false}
          isLoading={isLoading && !isError}
          onChange={onChange}
          options={options}
          placeholder={isLoading && !isError ? "Loading…" : placeholder}
          showError={showError}
          value={valueToRender ?? undefined}
        />
        {AfterInput}
      </div>
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  );
};

export default ContactSelectField;
