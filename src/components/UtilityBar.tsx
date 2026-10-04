import { site } from "@/content/site";

export default function UtilityBar() {
  return (
    <div className="bg-[#17101d] text-sm text-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2">
        <span>Intake line {site.hours.label}</span>
        <a href={site.phoneHref} className="font-semibold text-gold">{site.phone}</a>
      </div>
    </div>
  );
}
