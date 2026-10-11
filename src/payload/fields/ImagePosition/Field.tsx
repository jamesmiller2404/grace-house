"use client";

import { useFormFields, useField } from "@payloadcms/ui";
import type { NumberFieldClientProps } from "payload";
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Admin component for `ImagePositionField` (./index.ts), attached to the
 * event's `imagePositionY` field.
 *
 * Shows a 16:10 preview window — the exact aspect of the event page's
 * image container — with the event's currently selected image scaled to
 * fill ("cover") it. Dragging the image with the mouse or a finger moves
 * the visible crop, mirroring exactly how the page will render the image
 * with `object-position: ${x}% ${y}%`. The drag is clamped to the image's
 * real overflow per axis, so the frame can never show empty space.
 *
 * The image itself is read from the sibling `image` upload field's form
 * state (a media id, since Events.image has a single relationTo) and its
 * url/width/height come from the public /api/media REST endpoint.
 */

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const styles: Record<string, React.CSSProperties> = {
  window: {
    position: "relative",
    width: "100%",
    maxWidth: 560,
    aspectRatio: "16 / 10",
    overflow: "hidden",
    borderRadius: "var(--style-radius-m, 4px)",
    border: "1px solid var(--theme-elevation-150)",
    background: "var(--theme-elevation-50)",
    touchAction: "none",
    cursor: "grab",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  windowDragging: { cursor: "grabbing" },
  image: {
    position: "absolute",
    pointerEvents: "none",
    display: "block",
  },
  empty: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    textAlign: "center",
    fontSize: 13,
    color: "var(--theme-elevation-500)",
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "var(--theme-elevation-500)",
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: "var(--theme-error, #b91c1c)",
  },
};

/** Read the media id from the sibling `image` upload field's form state. */
function mediaIdFromFormState(
  fields: Record<string, { value?: unknown }>,
): number | undefined {
  const value = fields?.image?.value;
  const unwrap = (candidate: unknown): number | undefined => {
    if (typeof candidate === "number") return candidate;
    if (typeof candidate === "string" && candidate !== "") {
      return Number(candidate);
    }
    return undefined;
  };
  const direct = unwrap(value);
  if (direct !== undefined) return direct;
  // hasMany-style { relationTo, value } — harmless to also handle.
  if (value && typeof value === "object") {
    return unwrap((value as { value?: unknown }).value);
  }
  return undefined;
}

type MediaInfo = { url: string; width?: number | null; height?: number | null };

const ImagePositionField: React.FC<NumberFieldClientProps> = ({
  path,
  field,
}) => {
  // The two saved percentages. This component is attached to imagePositionY
  // and also drives the hidden imagePositionX sibling field.
  const yField = useField<number>({ path });
  const xField = useField<number>({ path: "imagePositionX" });
  // The sibling `image` upload field's value (a media id), re-read whenever
  // the admin picks a different image or the form hydrates.
  const imageId = useFormFields((fields) => mediaIdFromFormState(fields[0]));

  const [mediaState, setMediaState] = useState<{
    id: number | undefined;
    info?: MediaInfo;
    error?: boolean;
  }>({ id: undefined });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);

  // Only show media/error info that matches the currently selected image,
  // so a stale fetch for a since-replaced image never flashes through.
  const media =
    imageId !== undefined && mediaState.id === imageId
      ? mediaState.info
      : undefined;
  const fetchError =
    imageId !== undefined && mediaState.id === imageId && mediaState.error;

  const windowRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef({
    pointerX: 0,
    pointerY: 0,
    xPercent: 50,
    yPercent: 50,
  });

  const xPercent = clamp(xField.value ?? 50, 0, 100);
  const yPercent = clamp(yField.value ?? 50, 0, 100);

  // Track the selected image: whenever the sibling `image` field's value
  // changes (or on first load), fetch its url and intrinsic dimensions.
  useEffect(() => {
    if (imageId === undefined || Number.isNaN(imageId)) return;
    let cancelled = false;
    fetch(`/api/media/${imageId}`, { credentials: "include" })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(String(res.status))),
      )
      .then((doc) => {
        if (cancelled) return;
        setMediaState({
          id: imageId,
          info: doc?.url
            ? { url: doc.url, width: doc.width, height: doc.height }
            : undefined,
        });
      })
      .catch(() => {
        if (!cancelled) setMediaState({ id: imageId, error: true });
      });
    return () => {
      cancelled = true;
    };
    // imageId is intentionally the trigger: fetching whenever the admin
    // picks a different image (or the form hydrates an existing event).
  }, [imageId]);

  // Measure the preview window (responsive admin column widths).
  useEffect(() => {
    const element = windowRef.current;
    if (!element) return;
    const measure = () =>
      setWindowSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [media]);

  // How the image is laid out to cover the 16:10 window — identical to
  // CSS object-fit: cover (this is what the event page renders).
  const layout = (() => {
    if (!media?.width || !media.height || !windowSize.width) return undefined;
    const scale = Math.max(
      windowSize.width / media.width,
      windowSize.height / media.height,
    );
    return {
      width: media.width * scale,
      height: media.height * scale,
      overflowX: Math.max(0, media.width * scale - windowSize.width),
      overflowY: Math.max(0, media.height * scale - windowSize.height),
    };
  })();

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!layout) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStart.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        xPercent,
        yPercent,
      };
      setDragging(true);
    },
    [layout, xPercent, yPercent],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || !layout) return;
      // Dragging the image right/down moves the visible crop left/up:
      // object-position percentages move opposite to the pointer.
      const dx = event.clientX - dragStart.current.pointerX;
      const dy = event.clientY - dragStart.current.pointerY;
      // An axis without overflow has no room to move — keep it centered.
      const nextX =
        layout.overflowX > 0
          ? clamp(
              dragStart.current.xPercent - (dx / layout.overflowX) * 100,
              0,
              100,
            )
          : 50;
      const nextY =
        layout.overflowY > 0
          ? clamp(
              dragStart.current.yPercent - (dy / layout.overflowY) * 100,
              0,
              100,
            )
          : 50;
      xField.setValue(Math.round(nextX * 10) / 10);
      yField.setValue(Math.round(nextY * 10) / 10);
    },
    [dragging, layout, xField, yField],
  );

  const onPointerEnd = useCallback(() => setDragging(false), []);

  const descriptionText =
    typeof field?.admin?.description === "string"
      ? field.admin.description
      : undefined;

  return (
    <div className="field-type number">
      <div
        ref={windowRef}
        onPointerCancel={onPointerEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        style={{
          ...styles.window,
          ...(dragging ? styles.windowDragging : undefined),
        }}
      >
        {media && layout && (
          <img
            alt=""
            draggable={false}
            src={media.url}
            style={{
              ...styles.image,
              width: layout.width,
              height: layout.height,
              // Mirrors object-position: x% aligns x% of the image with
              // x% of the window — the same math the event page renders.
              left: -(layout.overflowX * xPercent) / 100,
              top: -(layout.overflowY * yPercent) / 100,
            }}
          />
        )}
        {!media && (
          <div style={styles.empty}>
            An event image is optional — choose one above to position it in
            the event page frame.
          </div>
        )}
      </div>
      {media && layout && (
        <div style={styles.hint}>
          Drag the image with your mouse or finger to set its position in the
          event page frame
          {layout.overflowY > 0 ? " (up/down)" : ""}
          {layout.overflowX > 0 ? " (left/right)" : ""}
          {layout.overflowX === 0 && layout.overflowY === 0
            ? ". This image fills the frame exactly — no adjustment needed"
            : ""}
          .
        </div>
      )}
      {fetchError && (
        <div style={styles.error}>
          Could not load the selected image for positioning.
        </div>
      )}
      {descriptionText && (
        <div className="field-description">{descriptionText}</div>
      )}
    </div>
  );
};

export default ImagePositionField;