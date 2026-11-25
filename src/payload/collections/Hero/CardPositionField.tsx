"use client";

import { useField, useForm, useFormFields } from "@payloadcms/ui";
import { buildHeroTextShadow } from "@/content/hero";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Data = Record<string, unknown>;
const record = (value: unknown): Data =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Data) : {};
const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;
const mediaId = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  const item = record(value);
  return item.id == null ? "" : String(item.id);
};
const mediaUrl = (value: unknown): string => {
  const item = record(value);
  return text(item.url, text(item.thumbnailURL));
};

function hexToRgba(hex: string, opacityPercent: number): string {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#0f172a";
  const r = parseInt(clean.slice(1, 3), 16);
  const g = parseInt(clean.slice(3, 5), 16);
  const b = parseInt(clean.slice(5, 7), 16);
  const a = Math.max(0, Math.min(100, opacityPercent)) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Virtual desktop canvas width matching max-w-7xl (1280px) on the homepage. */
const VIRTUAL_WIDTH = 1280;

export default function CardPositionField() {
  const { value: xVal, setValue: setX } = useField<number>({ path: "cardPositionX" });
  const { value: yVal, setValue: setY } = useField<number>({ path: "cardPositionY" });
  const fields = useFormFields(([state]) => state);
  const { getData } = useForm();
  const data = useMemo(() => {
    void fields;
    return record(getData());
  }, [fields, getData]);

  const x = typeof xVal === "number" && !Number.isNaN(xVal) ? clamp(xVal) : 50;
  const y = typeof yVal === "number" && !Number.isNaN(yVal) ? clamp(yVal) : 5;

  const cardColor = text(data.cardColor, "#0f172a");
  const cardOpacity = typeof data.cardOpacity === "number" ? data.cardOpacity : 55;
  const heading = text(data.heading);
  const eyebrow = text(data.eyebrow);
  const subtext = text(data.subtext);
  const headingColor = text(data.headingColor, "#ffffff");
  const eyebrowColor = text(data.eyebrowColor, "#c9a45c");
  const subtextColor = text(data.subtextColor, "#f7f3eb");
  const headingFontSize =
    typeof data.headingFontSize === "number" && data.headingFontSize > 0
      ? data.headingFontSize
      : 60;
  const eyebrowFontSize =
    typeof data.eyebrowFontSize === "number" && data.eyebrowFontSize > 0
      ? data.eyebrowFontSize
      : 19;
  const subtextFontSize =
    typeof data.subtextFontSize === "number" && data.subtextFontSize > 0
      ? data.subtextFontSize
      : 18;
  const shadowRec = record(data.textShadow);
  const computedTextShadow = buildHeroTextShadow({
    enabled: Boolean(shadowRec.enabled),
    color: text(shadowRec.color, "#000000"),
    opacity: typeof shadowRec.opacity === "number" ? shadowRec.opacity : 75,
    distance: typeof shadowRec.distance === "number" ? shadowRec.distance : 4,
    angle: typeof shadowRec.angle === "number" ? shadowRec.angle : 135,
    fuzziness: typeof shadowRec.fuzziness === "number" ? shadowRec.fuzziness : 6,
    extent: typeof shadowRec.extent === "number" ? shadowRec.extent : 0,
  });
  const cardWidth =
    typeof data.cardWidth === "number" && data.cardWidth > 0 ? data.cardWidth : undefined;
  const cardHeight =
    typeof data.cardHeight === "number" && data.cardHeight > 0 ? data.cardHeight : undefined;

  const primary = record(data.primaryCta);
  const secondary = record(data.secondaryCta);
  const primaryEnabled = primary.enabled !== false && Boolean(text(primary.label, "Get Help").trim());
  const secondaryEnabled = secondary.enabled !== false && Boolean(text(secondary.label, "Our Stories").trim());

  const [resolvedMedia, setResolvedMedia] = useState<Record<string, string>>({});
  const imageId = mediaId(data.image);
  const directUrl = mediaUrl(data.image);

  useEffect(() => {
    if (!imageId || directUrl) return;
    const controller = new AbortController();
    void fetch("/api/media/" + encodeURIComponent(imageId) + "?depth=0", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload: unknown) => {
        if (!payload) return;
        const doc = record(record(payload).doc ?? payload);
        const thumb = record(record(doc.sizes).thumbnail);
        const url = text(doc.url, text(thumb.url));
        if (url) setResolvedMedia({ [imageId]: url });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [imageId, directUrl]);

  const bgImage = directUrl || resolvedMedia[imageId] || "/images/hero1a.jpg";

  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [stageWidth, setStageWidth] = useState(640);
  const [imgAspect, setImgAspect] = useState(608 / 1280);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      if (el.clientWidth > 0) setStageWidth(el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = stageWidth / VIRTUAL_WIDTH;
  const virtualHeight = Math.round(VIRTUAL_WIDTH * imgAspect);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;
      const nextX = clamp(((clientX - rect.left) / rect.width) * 100);
      const nextY = clamp(((clientY - rect.top) / rect.height) * 100);
      setX(nextX);
      setY(nextY);
    },
    [setX, setY],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPointer(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const hasHeading = Boolean(heading.trim());
  const hasEyebrow = Boolean(eyebrow.trim());
  const hasSubtext = Boolean(subtext.trim());

  return (
    <div className="gh-hero-position-picker">
      <div className="gh-hero-position-header">
        <span className="field-label">Interactive Card Placement (1:1 Desktop Scale)</span>
        <button
          type="button"
          className="gh-hero-reset-btn"
          onClick={() => {
            setX(50);
            setY(5);
          }}
        >
          Reset to Default (50%, 5%)
        </button>
      </div>

      <div
        ref={stageRef}
        className="gh-hero-position-stage"
        role="application"
        aria-label="Drag or click to position the hero card over the background image"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ height: `${Math.round(stageWidth * imgAspect)}px` }}
      >
        <div
          style={{
            position: "relative",
            width: `${VIRTUAL_WIDTH}px`,
            height: `${virtualHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                setImgAspect(img.naturalHeight / img.naturalWidth);
              }
            }}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(36, 39, 37, 0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-${x}%, -${y}%)`,
              backgroundColor: hexToRgba(cardColor, cardOpacity),
              width: cardWidth ? `min(${cardWidth}px, calc(100% - 32px))` : undefined,
              maxWidth: "calc(100% - 32px)",
              minHeight: cardHeight ? `${cardHeight}px` : undefined,
              padding: "32px 40px",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.25)",
              outline: "2px dashed rgba(255, 255, 255, 0.45)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            {hasHeading && (
              <div
                style={{
                  color: headingColor,
                  fontSize: `${headingFontSize}px`,
                  lineHeight: 1.15,
                  fontFamily: "Georgia, serif",
                  fontWeight: 400,
                  textShadow: computedTextShadow,
                }}
              >
                {heading}
              </div>
            )}
            {hasEyebrow && (
              <div
                style={{
                  color: eyebrowColor,
                  fontSize: `${eyebrowFontSize}px`,
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: hasHeading ? "16px" : 0,
                  textShadow: computedTextShadow,
                }}
              >
                {eyebrow}
              </div>
            )}
            {hasSubtext && (
              <div
                style={{
                  color: subtextColor,
                  fontSize: `${subtextFontSize}px`,
                  lineHeight: 1.35,
                  marginTop: hasHeading || hasEyebrow ? "12px" : 0,
                  textShadow: computedTextShadow,
                }}
              >
                {subtext}
              </div>
            )}
            {(primaryEnabled || secondaryEnabled) && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: hasHeading || hasEyebrow || hasSubtext ? "24px" : 0,
                }}
              >
                {primaryEnabled && (
                  <span
                    style={{
                      backgroundColor: text(primary.bgColor, "#9e5640"),
                      color: text(primary.textColor, "#ffffff"),
                      padding: "12px 32px",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {text(primary.label, "Get Help")}
                  </span>
                )}
                {secondaryEnabled && (
                  <span
                    style={{
                      backgroundColor: text(secondary.bgColor, "#ffffff"),
                      color: text(secondary.textColor, "#242725"),
                      padding: "12px 32px",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {text(secondary.label, "Our Stories")}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="gh-hero-position-sliders">
        <label className="gh-hero-slider-control">
          <span>X: {x}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            className="gh-hero-range"
          />
        </label>
        <label className="gh-hero-slider-control">
          <span>Y: {y}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
            className="gh-hero-range"
          />
        </label>
      </div>
    </div>
  );
}
