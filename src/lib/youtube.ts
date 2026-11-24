const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts the 11-character YouTube video ID from standard watch, short,
 * shorts, or embed URLs. Returns null when the input is not a valid YouTube link.
 */
export function extractYouTubeId(rawUrl?: string | null): string | null {
  if (typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] || "";
      return YOUTUBE_ID_REGEX.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v") || "";
        return YOUTUBE_ID_REGEX.test(id) ? id : null;
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      if (
        (segments[0] === "embed" ||
          segments[0] === "shorts" ||
          segments[0] === "live" ||
          segments[0] === "v") &&
        segments[1]
      ) {
        return YOUTUBE_ID_REGEX.test(segments[1]) ? segments[1] : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function isValidYouTubeUrl(rawUrl?: string | null): boolean {
  return extractYouTubeId(rawUrl) !== null;
}

export function getYouTubeEmbedUrl(rawUrl?: string | null): string | null {
  const id = extractYouTubeId(rawUrl);
  if (!id) return null;
  const params = new URLSearchParams({
    controls: "0",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    playsinline: "1",
    fs: "0",
    disablekb: "0",
    enablejsapi: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
