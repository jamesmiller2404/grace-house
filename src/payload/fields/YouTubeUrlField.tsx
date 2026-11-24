"use client";

import React from "react";
import { FieldError, useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import VideoEmbed from "@/components/VideoEmbed";
import { parseVideoUrl } from "@/lib/videoEmbed";

const YouTubeUrlField: React.FC<TextFieldClientProps> = ({
  field,
  path: pathFromProps,
  readOnly,
}) => {
  const { disabled, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  });

  const textValue = typeof value === "string" ? value : "";
  const parsed = parseVideoUrl(textValue);
  const isDisabled = Boolean(readOnly || disabled);
  const placeholder =
    typeof field.admin?.placeholder === "string"
      ? field.admin.placeholder
      : "https://www.youtube.com/watch?v=... or https://vimeo.com/...";

  const videoKey = parsed
    ? `${parsed.provider}-${parsed.id}-${parsed.provider === "vimeo" ? parsed.hash || "" : ""}`
    : "";

  return (
    <div className="field-type text" id={`field-${path.replace(/\./g, "__")}`}>
      <div className="field-type__wrap">
        <input
          type="url"
          value={textValue}
          disabled={isDisabled}
          placeholder={placeholder}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </div>
      <FieldError path={path} showError={showError} />
      {textValue.trim().length > 0 && !parsed && (
        <div
          className="field-description"
          style={{ color: "var(--theme-error-500, #d46655)", marginTop: "6px" }}
        >
          Enter a valid YouTube or Vimeo link (youtube.com/watch?v=..., youtu.be/..., or vimeo.com/...).
        </div>
      )}
      {parsed && (
        <div
          className="gh-photo-block-preview"
          style={{ maxWidth: "560px", marginTop: "8px", background: "transparent", border: "none" }}
        >
          <VideoEmbed key={videoKey} videoUrl={textValue} compact />
          {!isDisabled && (
            <button
              type="button"
              className="gh-photo-block-preview__remove"
              style={{ zIndex: 10 }}
              onClick={() => setValue("")}
              aria-label="Remove video"
              title="Remove video"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeUrlField;
