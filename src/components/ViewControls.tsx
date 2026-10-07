"use client";

export type ViewMode = "card" | "list";

export type ViewControlsProps = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
};

/**
 * Layout toggle matching photoshop_assets/listView.png: the grid icon (four
 * squares) switches to card view, the rows icon (four squares with lines)
 * switches to list view. Sorting lives in the list view's table headers.
 */
export default function ViewControls({ view, onViewChange }: ViewControlsProps) {
  return (
    <div role="group" aria-label="Layout" className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onViewChange("card")}
        aria-pressed={view === "card"}
        aria-label="Card view"
        title="Card view"
        className={
          "flex h-9 w-9 items-center justify-center rounded border transition " +
          (view === "card"
            ? "border-ink/60 bg-ink/5 text-ink"
            : "border-ink/20 bg-white text-ink/60 hover:text-ink")
        }
      >
        {/* Four-square grid icon */}
        <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
          <rect x="2" y="2" width="7" height="7" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" fill="currentColor" />
          <rect x="2" y="11" width="7" height="7" fill="currentColor" />
          <rect x="11" y="11" width="7" height="7" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onViewChange("list")}
        aria-pressed={view === "list"}
        aria-label="List view"
        title="List view"
        className={
          "flex h-9 w-9 items-center justify-center rounded border transition " +
          (view === "list"
            ? "border-ink/60 bg-ink/5 text-ink"
            : "border-ink/20 bg-white text-ink/60 hover:text-ink")
        }
      >
        {/* Four rows: small square + line each */}
        <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
          {[2.5, 6.5, 10.5, 14.5].map((y) => (
            <g key={y}>
              <rect x="2" y={y} width="3" height="2.6" fill="currentColor" />
              <rect
                x="7"
                y={y + 0.5}
                width="11"
                height="1.6"
                fill="currentColor"
              />
            </g>
          ))}
        </svg>
      </button>
    </div>
  );
}

/** Sort state shared by the sortable table headers. */
export type SortState<K extends string> = { key: K; ascending: boolean };

/**
 * Up/down arrow pair shown next to a sortable table header label. Clicking
 * the arrows activates that column; clicking again reverses the direction.
 */
export function SortArrows({
  active,
  ascending,
  label,
}: {
  active: boolean;
  ascending: boolean;
  /** Kept for API compatibility; the wrapping header button handles clicks. */
  onClick?: () => void;
  label: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="text-ink hover:text-terra inline-flex flex-col items-center align-middle leading-none transition"
    >
      <svg
        viewBox="0 0 10 6"
        className={
          active && ascending ? "text-terra h-2.5 w-2.5" : "h-2.5 w-2.5 opacity-50"
        }
        aria-hidden="true"
      >
        <path d="M5 0 L10 6 L0 6 Z" fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 10 6"
        className={
          active && !ascending
            ? "text-terra mt-0.5 h-2.5 w-2.5"
            : "mt-0.5 h-2.5 w-2.5 opacity-50"
        }
        aria-hidden="true"
      >
        <path d="M5 6 L0 0 L10 0 Z" fill="currentColor" />
      </svg>
    </span>
  );
}