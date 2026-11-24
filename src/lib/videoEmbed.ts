import { extractYouTubeId } from "@/lib/youtube";

export type ParsedVideo =
  | { provider: "youtube"; id: string }
  | { provider: "vimeo"; id: string; hash?: string };

const VIMEO_ID_REGEX = /^\d{4,15}$/;
const VIMEO_HASH_REGEX = /^[a-zA-Z0-9]{6,20}$/;

/**
 * Extracts Vimeo video ID (and optional unlisted privacy hash) from standard
 * vimeo.com or player.vimeo.com URLs.
 */
export function extractVimeoInfo(
  rawUrl?: string | null,
): { id: string; hash?: string } | null {
  if (typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();

    if (host !== "vimeo.com" && host !== "player.vimeo.com") {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    const queryHash = parsed.searchParams.get("h") || undefined;

    if (host === "player.vimeo.com") {
      if (segments[0] === "video" && VIMEO_ID_REGEX.test(segments[1] || "")) {
        return {
          id: segments[1],
          hash:
            queryHash && VIMEO_HASH_REGEX.test(queryHash) ? queryHash : undefined,
        };
      }
      return null;
    }

    // Standard vimeo.com/<id> or vimeo.com/<id>/<hash>
    if (VIMEO_ID_REGEX.test(segments[0] || "")) {
      const pathHash =
        segments[1] && VIMEO_HASH_REGEX.test(segments[1]) ? segments[1] : undefined;
      return {
        id: segments[0],
        hash:
          pathHash ??
          (queryHash && VIMEO_HASH_REGEX.test(queryHash) ? queryHash : undefined),
      };
    }

    // vimeo.com/channels/<name>/<id> or vimeo.com/groups/<name>/videos/<id>
    const lastSegment = segments[segments.length - 1] || "";
    if (VIMEO_ID_REGEX.test(lastSegment)) {
      return {
        id: lastSegment,
        hash:
          queryHash && VIMEO_HASH_REGEX.test(queryHash) ? queryHash : undefined,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function parseVideoUrl(rawUrl?: string | null): ParsedVideo | null {
  const ytId = extractYouTubeId(rawUrl);
  if (ytId) {
    return { provider: "youtube", id: ytId };
  }

  const vimeo = extractVimeoInfo(rawUrl);
  if (vimeo) {
    return { provider: "vimeo", id: vimeo.id, hash: vimeo.hash };
  }

  return null;
}

export function isValidVideoUrl(rawUrl?: string | null): boolean {
  return parseVideoUrl(rawUrl) !== null;
}

export function getVimeoEmbedUrl(id: string, hash?: string): string {
  const params = new URLSearchParams({
    controls: "0",
    title: "0",
    byline: "0",
    portrait: "0",
    badge: "0",
    dnt: "1",
    pip: "0",
    playsinline: "1",
    transparent: "0",
  });
  if (hash) {
    params.set("h", hash);
  }
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}
