"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { getVimeoEmbedUrl, parseVideoUrl } from "@/lib/videoEmbed";

type YTPlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  loadModule?: (module: string) => void;
  unloadModule?: (module: string) => void;
  setOption?: (module: string, option: string, value: unknown) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayerInstance;
};

type VimeoTextTrack = {
  language: string;
  kind: string;
  label: string;
  mode: string;
};

type VimeoPlayerInstance = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setCurrentTime: (seconds: number) => Promise<number>;
  getDuration: () => Promise<number>;
  getVideoWidth: () => Promise<number>;
  getVideoHeight: () => Promise<number>;
  getTextTracks?: () => Promise<VimeoTextTrack[]>;
  enableTextTrack?: (language: string, kind?: string) => Promise<unknown>;
  disableTextTrack?: () => Promise<void>;
  on: (event: string, callback: (data?: { seconds?: number; duration?: number }) => void) => void;
  destroy: () => Promise<void>;
};

type VimeoNamespace = {
  Player: new (iframe: HTMLIFrameElement) => VimeoPlayerInstance;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
    Vimeo?: VimeoNamespace;
  }
}

let ytApiPromise: Promise<YTNamespace> | null = null;
let vimeoApiPromise: Promise<VimeoNamespace> | null = null;

function loadYouTubeAPI(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API requires a browser."));
  }
  if (window.YT && typeof window.YT.Player === "function") {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<YTNamespace>((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT) resolve(window.YT);
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    } else {
      const check = window.setInterval(() => {
        if (window.YT && typeof window.YT.Player === "function") {
          window.clearInterval(check);
          resolve(window.YT);
        }
      }, 50);
    }
  });

  return ytApiPromise;
}

function loadVimeoAPI(): Promise<VimeoNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Vimeo API requires a browser."));
  }
  if (window.Vimeo && typeof window.Vimeo.Player === "function") {
    return Promise.resolve(window.Vimeo);
  }
  if (vimeoApiPromise) return vimeoApiPromise;

  vimeoApiPromise = new Promise<VimeoNamespace>((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://player.vimeo.com/api/player.js"]',
    );
    if (existingScript) {
      const check = window.setInterval(() => {
        if (window.Vimeo && typeof window.Vimeo.Player === "function") {
          window.clearInterval(check);
          resolve(window.Vimeo);
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = () => {
      if (window.Vimeo) {
        resolve(window.Vimeo);
      } else {
        reject(new Error("Vimeo Player API failed to initialize."));
      }
    };
    script.onerror = () => reject(new Error("Could not load Vimeo Player API."));
    document.head.appendChild(script);
  });

  return vimeoApiPromise;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export type VideoEmbedProps = {
  videoUrl: string;
  caption?: string;
  compact?: boolean;
};

export default function VideoEmbed({
  videoUrl,
  caption,
  compact = false,
}: VideoEmbedProps) {
  const parsed = parseVideoUrl(videoUrl);
  const reactId = useId().replace(/:/g, "");
  const ytContainerId = `gh-yt-${reactId}`;

  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const vimeoIframeRef = useRef<HTMLIFrameElement | null>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerInstance | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [vimeoTracks, setVimeoTracks] = useState<VimeoTextTrack[]>([]);
  const [aspectRatio, setAspectRatio] = useState<number>(() =>
    videoUrl.includes("/shorts/") ? 9 / 16 : 16 / 9,
  );

  const provider = parsed?.provider ?? null;
  const videoId = parsed?.id ?? null;
  const vimeoHash = parsed?.provider === "vimeo" ? parsed.hash : undefined;

  useEffect(() => {
    if (provider !== "youtube" || !videoId) return;
    let cancelled = false;

    void fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((meta: { width?: unknown; height?: unknown } | null) => {
        if (
          !cancelled &&
          typeof meta?.width === "number" &&
          typeof meta?.height === "number" &&
          meta.width > 0 &&
          meta.height > 0
        ) {
          setAspectRatio(meta.width / meta.height);
        }
      })
      .catch(() => undefined);

    void loadYouTubeAPI().then((YT) => {
      if (cancelled) return;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = new YT.Player(ytContainerId, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
          fs: 1,
          disablekb: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (cancelled || !ytPlayerRef.current) return;
            setReady(true);
            setDuration(ytPlayerRef.current.getDuration() || 0);
          },
          onStateChange: (event) => {
            if (cancelled) return;
            setPlaying(event.data === 1);
            if (event.data === 0) {
              setCurrentTime(0);
            }
            if (ytPlayerRef.current) {
              const dur = ytPlayerRef.current.getDuration();
              if (dur > 0) setDuration(dur);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
      setReady(false);
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [provider, videoId, ytContainerId]);

  useEffect(() => {
    if (provider !== "vimeo" || !videoId) return;
    const iframe = vimeoIframeRef.current;
    if (!iframe) return;
    let cancelled = false;

    void loadVimeoAPI().then((Vimeo) => {
      if (cancelled || !vimeoIframeRef.current) return;
      const player = new Vimeo.Player(vimeoIframeRef.current);
      vimeoPlayerRef.current = player;

      void Promise.all([
        player.getDuration().catch(() => 0),
        player.getVideoWidth().catch(() => 0),
        player.getVideoHeight().catch(() => 0),
        player.getTextTracks ? player.getTextTracks().catch(() => []) : Promise.resolve([]),
      ]).then(([dur, w, h, tracks]) => {
        if (!cancelled) {
          if (Number.isFinite(dur) && dur > 0) setDuration(dur);
          if (w > 0 && h > 0) setAspectRatio(w / h);
          if (Array.isArray(tracks)) {
            setVimeoTracks(tracks);
            setCaptionsOn(tracks.some((t) => t.mode === "showing"));
          }
          setReady(true);
        }
      });

      player.on("play", () => {
        if (!cancelled) setPlaying(true);
      });
      player.on("pause", () => {
        if (!cancelled) setPlaying(false);
      });
      player.on("ended", () => {
        if (!cancelled) {
          setPlaying(false);
          setCurrentTime(0);
        }
      });
      player.on("timeupdate", (data) => {
        if (cancelled || draggingRef.current) return;
        if (typeof data?.seconds === "number") setCurrentTime(data.seconds);
        if (typeof data?.duration === "number" && data.duration > 0) {
          setDuration(data.duration);
        }
      });
    });

    return () => {
      cancelled = true;
      void vimeoPlayerRef.current?.destroy().catch(() => undefined);
      vimeoPlayerRef.current = null;
      setReady(false);
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [provider, videoId, vimeoHash]);

  useEffect(() => {
    if (provider !== "youtube" || !ready || !playing) return;
    const interval = window.setInterval(() => {
      if (!ytPlayerRef.current || draggingRef.current) return;
      const t = ytPlayerRef.current.getCurrentTime();
      const d = ytPlayerRef.current.getDuration();
      if (Number.isFinite(t)) setCurrentTime(t);
      if (Number.isFinite(d) && d > 0) setDuration(d);
    }, 250);
    return () => window.clearInterval(interval);
  }, [provider, ready, playing]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(
        Boolean(wrapperRef.current && document.fullscreenElement === wrapperRef.current),
      );
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  if (!parsed) return null;

  const togglePlay = () => {
    if (!ready) return;
    if (parsed.provider === "youtube") {
      if (!ytPlayerRef.current) return;
      if (playing) {
        ytPlayerRef.current.pauseVideo();
      } else {
        ytPlayerRef.current.playVideo();
      }
      return;
    }

    if (!vimeoPlayerRef.current) return;
    if (playing) {
      void vimeoPlayerRef.current.pause();
    } else {
      void vimeoPlayerRef.current.play();
    }
  };

  const handleStop = () => {
    if (!ready) return;
    if (parsed.provider === "youtube") {
      if (!ytPlayerRef.current) return;
      ytPlayerRef.current.pauseVideo();
      ytPlayerRef.current.seekTo(0, true);
      setPlaying(false);
      setCurrentTime(0);
      return;
    }

    if (!vimeoPlayerRef.current) return;
    void vimeoPlayerRef.current.pause();
    void vimeoPlayerRef.current.setCurrentTime(0);
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleScrub = (nextSeconds: number) => {
    setCurrentTime(nextSeconds);
    if (!ready) return;
    if (parsed.provider === "youtube") {
      ytPlayerRef.current?.seekTo(nextSeconds, true);
    } else {
      void vimeoPlayerRef.current?.setCurrentTime(nextSeconds);
    }
  };

  const toggleCaptions = () => {
    if (!ready) return;
    const next = !captionsOn;
    if (parsed.provider === "youtube") {
      const yt = ytPlayerRef.current;
      if (!yt) return;
      if (next) {
        yt.loadModule?.("captions");
        yt.setOption?.("captions", "track", { languageCode: "en" });
      } else {
        yt.unloadModule?.("captions");
      }
      setCaptionsOn(next);
      return;
    }

    const vimeo = vimeoPlayerRef.current;
    if (!vimeo) return;
    if (next) {
      const preferred =
        vimeoTracks.find((t) => t.language.startsWith("en")) || vimeoTracks[0];
      if (preferred) {
        void vimeo.enableTextTrack?.(preferred.language, preferred.kind);
        setCaptionsOn(true);
      }
    } else {
      void vimeo.disableTextTrack?.();
      setCaptionsOn(false);
    }
  };

  const canToggleCaptions =
    parsed.provider === "youtube" || vimeoTracks.length > 0;

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen errors if blocked by browser/iframe policy.
    }
  };

  return (
    <figure className={compact ? "my-3" : "my-8"} style={compact ? { margin: "12px 0" } : undefined}>
      <div
        ref={wrapperRef}
        className="flex flex-col overflow-hidden rounded-lg border border-ink/15 bg-black shadow-sm"
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "8px",
          background: "#000",
          border: "1px solid rgba(201, 164, 92, 0.28)",
          ...(!isFullscreen && aspectRatio < 1 ? { maxWidth: "420px" } : {}),
        }}
      >
        <div
          className={
            isFullscreen
              ? "relative flex-1 w-full bg-black"
              : "relative w-full bg-black"
          }
          style={{
            position: "relative",
            width: "100%",
            background: "#000",
            ...(isFullscreen
              ? { flex: "1 1 0%" }
              : { aspectRatio: String(aspectRatio) }),
          }}
        >
          {parsed.provider === "youtube" ? (
            <div
              key={`yt-${parsed.id}`}
              id={ytContainerId}
              className="h-full w-full"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <iframe
              key={`vimeo-${parsed.id}-${parsed.hash || ""}`}
              ref={vimeoIframeRef}
              src={getVimeoEmbedUrl(parsed.id, parsed.hash)}
              title={caption || "Vimeo video"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
                display: "block",
              }}
            />
          )}
        </div>

        <div
          className="flex flex-wrap items-center gap-2 bg-[#1d1825] px-3 py-2.5 text-[#f5f1ea] sm:flex-nowrap sm:gap-3"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
            background: "#1d1825",
            padding: "10px 12px",
            color: "#f5f1ea",
            borderTop: "1px solid rgba(201, 164, 92, 0.25)",
          }}
        >
          <button
            type="button"
            disabled={!ready}
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className="inline-flex h-8 min-w-[60px] items-center justify-center rounded border border-[#c9a45c]/60 bg-[#c9a45c] px-2.5 text-xs font-bold tracking-wide text-[#141118] uppercase transition hover:bg-[#e3a857] disabled:opacity-50"
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            disabled={!ready}
            onClick={handleStop}
            aria-label="Stop video"
            className="inline-flex h-8 items-center justify-center rounded border border-[#4a405c] bg-[#261e32] px-2.5 text-xs font-semibold text-[#f5f1ea] transition hover:border-[#c9a45c] disabled:opacity-50"
          >
            Stop
          </button>

          <input
            type="range"
            min={0}
            max={duration > 0 ? duration : 100}
            step={0.5}
            value={Math.min(currentTime, duration > 0 ? duration : 100)}
            disabled={!ready || duration <= 0}
            aria-label="Seek video"
            onMouseDown={() => {
              draggingRef.current = true;
            }}
            onMouseUp={() => {
              draggingRef.current = false;
            }}
            onTouchStart={() => {
              draggingRef.current = true;
            }}
            onTouchEnd={() => {
              draggingRef.current = false;
            }}
            onChange={(event) => handleScrub(Number(event.currentTarget.value))}
            className="order-first h-2 w-full min-w-0 basis-full cursor-pointer accent-[#c9a45c] sm:order-none sm:h-1.5 sm:w-auto sm:flex-1 sm:basis-auto"
          />

          <span className="ml-auto font-mono text-xs whitespace-nowrap text-[#dad5dd] sm:ml-0 sm:min-w-[78px] sm:text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {canToggleCaptions && (
            <button
              type="button"
              disabled={!ready}
              onClick={toggleCaptions}
              aria-pressed={captionsOn}
              aria-label={captionsOn ? "Turn off captions" : "Turn on captions"}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded border px-2 text-xs font-bold transition disabled:opacity-50"
              style={{
                borderColor: captionsOn ? "#c9a45c" : "#4a405c",
                background: captionsOn ? "#c9a45c" : "#261e32",
                color: captionsOn ? "#141118" : "#f5f1ea",
              }}
            >
              CC
            </button>
          )}

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded border border-[#4a405c] bg-[#261e32] px-2.5 text-xs font-semibold text-[#f5f1ea] transition hover:border-[#c9a45c]"
          >
            {isFullscreen ? "Exit" : "Full"}
          </button>
        </div>
      </div>

      {caption && (
        <figcaption className="text-ink/70 mt-2 text-sm">{caption}</figcaption>
      )}
    </figure>
  );
}
