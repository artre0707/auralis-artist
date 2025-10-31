import React from "react";

type SmartLinkCardProps = {
  smartLinkUrl?: string;
  albumKey?: keyof typeof SMART_LINKS;
  title?: string;
  height?: number;
  showButtonFallback?: boolean;
};

/** 앨범별 Believe Smart Link 매핑 — 필요할 때 계속 추가 */
export const SMART_LINKS = {
  "resonance-after-the-first-suite": "https://auralis.bfan.link/resonance-after-the-first-suite-2",
  "heart-ballet-music": "https://believemusic.link/heart-ballet-music",
  "serene-horizons-morning-dew": "https://believemusic.link/lullabook-series-1",
} as const;

export default function SmartLinkCard({
  smartLinkUrl,
  albumKey,
  title = "Listen on All Platforms",
  height = 600,
  showButtonFallback = true,
}: SmartLinkCardProps) {
  const url = smartLinkUrl || (albumKey ? SMART_LINKS[albumKey] : undefined);

  if (!url) return null; // 주소 없으면 아무 것도 렌더하지 않음

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h3 className="text-center font-serif text-2xl text-neutral-900 dark:text-neutral-50 mb-4">
        {title}
      </h3>

      <div className="flex justify-center">
        <iframe
          src={url}
          title="Believe Smart Link"
          width="100%"
          height={height}
          style={{ border: "none", borderRadius: 16, overflow: "hidden" }}
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {showButtonFallback && (
        <div className="mt-4 text-center">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-neutral-800 ring-1 ring-black/10 transition hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/10"
          >
            Open All Platforms
          </a>
        </div>
      )}
    </section>
  );
}