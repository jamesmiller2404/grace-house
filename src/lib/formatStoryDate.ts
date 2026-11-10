/**
 * Story date formatting — renders "May 30, 2026" for full dates and
 * "May 2026" for month/year. Accepts the legacy text values ("MM/DD/YYYY",
 * "MM/YYYY") and the timestamps the standard Payload date field stores
 * (any "YYYY-MM-DD..." ISO string uses the stored calendar day as-is, so no
 * timezone math can shift the displayed date).
 */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatStoryDate(raw: string): string {
  const full = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(\d{4})$/.exec(raw);
  if (full) return `${MONTHS[Number(full[1]) - 1]} ${Number(full[2])}, ${full[3]}`;

  const monthYear = /^(0?[1-9]|1[0-2])\/(\d{4})$/.exec(raw);
  if (monthYear) return `${MONTHS[Number(monthYear[1]) - 1]} ${monthYear[2]}`;

  // Payload date fields (the same "dayOnly" picker Events uses) store the
  // chosen day as a timestamp — "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss+00" or a
  // full ISO "YYYY-MM-DDTHH:mm:ss.sssZ". Take the calendar day straight from
  // the stored value so no timezone math can shift the displayed date.
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (iso) return `${MONTHS[Number(iso[2]) - 1]} ${Number(iso[3])}, ${iso[1]}`;

  // Fallback: anything Date can parse.
  const parsed = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw);
  if (!Number.isNaN(parsed.getTime())) {
    return `${MONTHS[parsed.getMonth()]} ${parsed.getDate()}, ${parsed.getFullYear()}`;
  }
  return raw;
}

/** Label for the date line under a name: graduates, vs. staff/volunteers. */
export function storyDateLabel(tag: string): string {
  return tag === "Graduate" ? "Graduated" : "Began";
}
