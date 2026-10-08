/**
 * Story date formatting — supports both "MM/DD/YYYY" and "MM/YYYY" input.
 * Full dates render as "May 30, 2026"; month/year renders as "May 2026".
 * ISO "YYYY-MM-DD" is accepted as a fallback for older data.
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

  // Fallback: ISO "YYYY-MM-DD" (or anything Date can parse).
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
