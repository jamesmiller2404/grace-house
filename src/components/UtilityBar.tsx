import { site } from "@/content/site";

export default function UtilityBar() {
  return (
    <div className="text-cream bg-[#17101d] text-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2">
        <span>Intake line {site.hours.label}</span>
        <a href={site.phoneHref} className="text-gold font-semibold">
          {site.phone}
        </a>
      </div>
    </div>
  );
}
