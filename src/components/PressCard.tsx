import Image from "next/image";
import type { NewsAndSupportItem } from "@/payload/queries";

function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * PressCard — one card component with two variants:
 *  - `news`: external article link ("Read article")
 *  - `letter`: PDF letter of support ("Read letter (PDF)" + file size)
 */
export default function PressCard({ item }: { item: NewsAndSupportItem }) {
  const isLetter = item.type === "letter";
  const href = isLetter ? item.fileUrl : item.externalUrl;
  const formattedDate = formatDisplayDate(item.date);
  const sizeLabel = isLetter ? formatFileSize(item.fileSize) : "";

  if (!href) return null;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)]">
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-anchor">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.thumbnailAlt || item.title}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-anchor via-[#3d2c4d] to-[#261b31] px-6 text-center"
          >
            <Image
              src="/images/crown.png"
              alt=""
              width={108}
              height={39}
              style={{ width: "auto" }}
              className="h-9 opacity-85"
            />
            <span className="h-[2px] w-12 rounded-full bg-gold/70" />
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">
              {isLetter ? "Letter of Support" : "Grace House News"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold tracking-[0.12em] uppercase">
          <span
            className={
              isLetter
                ? "rounded-md bg-anchor/10 px-2.5 py-1 text-anchor"
                : "rounded-md bg-lift/25 px-2.5 py-1 text-ink"
            }
          >
            {isLetter ? "Letter of Support" : "In the News"}
          </span>
          <time dateTime={item.date} className="text-ink/65 font-semibold tracking-normal normal-case text-sm">
            {formattedDate}
          </time>
        </div>

        <h3 className="font-heading text-anchor mt-3 text-2xl leading-snug">
          {item.title}
        </h3>

        <p className="text-terra mt-1.5 text-sm font-semibold">
          {isLetter ? `From ${item.source}` : item.source}
        </p>

        {item.summary && (
          <p className="text-ink/85 mt-3 text-base leading-relaxed">
            {isLetter ? `“${item.summary}”` : item.summary}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              isLetter
                ? `Read letter from ${item.source} (PDF, opens in new tab)`
                : `Read article "${item.title}" on ${item.source} (opens in new tab)`
            }
            className="bg-terra hover:bg-terra/90 focus-visible:outline-terra inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span>{isLetter ? "Read letter (PDF)" : "Read article"}</span>
            <span aria-hidden="true">↗</span>
          </a>

          {isLetter && (
            <span className="text-ink/60 text-xs font-semibold tracking-wide uppercase">
              {sizeLabel ? `PDF · ${sizeLabel}` : "PDF"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
