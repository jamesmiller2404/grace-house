"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  ReactSelect,
  RenderCustomComponent,
  useField,
  withCondition,
  type ReactSelectOption,
} from "@payloadcms/ui";
import type {
  Option,
  OptionObject,
  SelectFieldClientProps,
  Validate,
} from "payload";
import React, { useCallback, useMemo } from "react";

/**
 * Admin component for `StatusSelectField` (./index.ts) — Payload's select
 * field with one deliberate difference: the control is a plain dropdown.
 *
 * Payload's built-in SelectInput always renders a searchable react-select
 * (isSearchable is hardcoded true there and is not exposed through the
 * select field's config), which puts a free-text input inside the control.
 * This component reproduces Payload's exact markup (the same
 * .field-type.select / .field-label / .field-type__wrap classes and the
 * same ReactSelect element with its rs__ classes), so the Events EditView
 * styling — the dark dropdown colors and the label-beside-control layout —
 * keeps working unchanged. The only functional change is
 * isSearchable: false, so the status field only ever accepts its
 * configured choices.
 */

const StatusSelectComponent: React.FC<SelectFieldClientProps> = (props) => {
  const {
    field,
    field: { label, localized, options: optionsFromProps = [], required },
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
  } = props;

  // SelectFieldClientProps["field"]["admin"] resolves to a Pick-over-optional
  // type that TypeScript refuses to destructure cleanly (TS2339 on perfectly
  // real properties). Our factory configs only ever put plain strings in
  // these three admin props, so read them through a structural cast.
  const { className, description, placeholder } = (field.admin ?? {}) as {
    className?: string;
    description?: string;
    placeholder?: string;
  };

  // Payload allows options as plain strings or { label, value } objects —
  // normalize to objects, exactly like Payload's own formatOptions helper.
  const options = useMemo<OptionObject[]>(
    () =>
      optionsFromProps.map((option: Option): OptionObject =>
        typeof option === "string" ? { label: option, value: option } : option,
      ),
    [optionsFromProps],
  );

  // Same validation wiring as Payload's built-in select field: keep the
  // server-provided validate function, but hand it the hasMany / options /
  // required context it expects alongside the base validation options that
  // useField passes through.
  const memoizedValidate = useCallback<Validate>(
    (value, validationOptions) => {
      if (typeof validate === "function") {
        return validate(value, {
          ...validationOptions,
          hasMany: false,
          options,
          required,
          // The built-in select validation only reads hasMany / options /
          // required off this object; the cast just satisfies its full
          // ValidateOptions<SelectField> parameter type.
        } as Parameters<typeof validate>[1]);
      }
      return true;
    },
    [validate, required, options],
  );

  const {
    customComponents: {
      AfterInput,
      BeforeInput,
      Description,
      Error,
      Label,
    } = {},
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
        // The dropdown is not clearable, so a change always carries a choice —
        // only forward non-null values to the caller's onChange.
        if (newValue !== null && typeof onChangeFromProps === "function") {
          onChangeFromProps(newValue);
        }
        setValue(newValue);
      }
    },
    [readOnly, disabled, setValue, onChangeFromProps],
  );

  // ReactSelect wants the selected option object, not the raw stored value.
  const valueToRender = useMemo(() => {
    if (typeof value === "string" && value) {
      const matchingOption = options.find((option) => option.value === value);
      return {
        label: matchingOption ? matchingOption.label : value,
        value: matchingOption?.value ?? value,
      };
    }
    return null;
  }, [value, options]);

  // The same style merge Payload's built-in fields use (mergeFieldStyles
  // is not exported from the package root): admin.width becomes the
  // --field-width custom property (25% for Events.status), and an explicit
  // style.flex still wins.
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
          onChange={onChange}
          options={options}
          placeholder={placeholder}
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

export const StatusSelectField = withCondition(StatusSelectComponent);

export default StatusSelectField;
