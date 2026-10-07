"use client";

export type ViewMode = "card" | "list";
export type SortMode = "date" | "name";

export type ViewControlsProps = {
  view: ViewMode;
  sort: SortMode;
  onViewChange: (view: ViewMode) => void;
  onSortChange: (sort: SortMode) => void;
};

/**
 * Shared display controls for the Lives Changed and Upcoming Events pages:
 * a "Card / List" layout toggle and a "Date / Name" sort toggle. Rendered as
 * two labelled button groups with aria-pressed so screen readers announce
 * the active option; plain buttons keep both keyboard accessible.
 */
export default function ViewControls({
  view,
  sort,
  onViewChange,
  onSortChange,
}: ViewControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      <div role="group" aria-label="Layout" className="flex items-center gap-3">
        <span className="text-ink/70 text-sm font-bold tracking-[0.05em] uppercase">
          View
        </span>
        <div className="border-ink/20 flex overflow-hidden rounded-md border bg-white">
          <ToggleButton
            active={view === "card"}
            onClick={() => onViewChange("card")}
          >
            Card
          </ToggleButton>
          <ToggleButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
          >
            List
          </ToggleButton>
        </div>
      </div>

      <div
        role="group"
        aria-label="Sort by"
        className="flex items-center gap-3"
      >
        <span className="text-ink/70 text-sm font-bold tracking-[0.05em] uppercase">
          Sort by
        </span>
        <div className="border-ink/20 flex overflow-hidden rounded-md border bg-white">
          <ToggleButton
            active={sort === "date"}
            onClick={() => onSortChange("date")}
          >
            Date
          </ToggleButton>
          <ToggleButton
            active={sort === "name"}
            onClick={() => onSortChange("name")}
          >
            Name
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "px-4 py-1.5 text-sm font-bold tracking-[0.05em] uppercase transition " +
        (active ? "bg-terra text-white" : "text-ink hover:text-terra")
      }
    >
      {children}
    </button>
  );
}
