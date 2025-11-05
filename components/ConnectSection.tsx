

import React, { useMemo, useState } from "react";
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
import { useSiteContext } from "@/contexts/SiteContext";
import SubscribeForm from "./SubscribeForm";

const ALBUMS_BASE = '/albums';
type IGItem = { href: string; src: string; alt: string };
type Lang = "EN" | "KR";

type Copy = {
  title: string;
  subtitle: string;
  follow: string;
  followSub: string;
  listen: string;
  listenSub: string;
  watchListen: string;
  watchListenSub: string;
  visitChannel: string;
  instagram: string;
  seeMoreIG: string;
  newsletter: string;
  newsletterSub: string;
  disclaimer: string;
  pressContact: string;
  pressContactSub: string;
  downloadEPK: string;
  newestRelease: string;
  socials: Record<"youtube"|"instagram"|"tiktok"|"soundcloud"|"facebook"|"website", string>;
  streaming: Record<"spotify"|"appleMusic"|"amazonMusic"|"bandcamp"|"flo"|"vibe", string>;
};

const content: Record<Lang, Omit<Copy, 'disclaimer'>> = {
  EN: {
    title: "In Harmony with Auralis",
    subtitle: "Closer to the music and moments of Auralis",
    follow: "Follow",
    followSub: "Follow Auralis across platforms to stay close to the moments between notes",
    listen: "Listen",
    listenSub: "Listen to Auralis — where sound and silence meet",
    watchListen: "Feel, and Stay in the Moment",
    watchListenSub: "Echoes of reflection and movement, where music finds its stillness",
    visitChannel: "Into the world of Auralis →",
    instagram: "Instagram",
    seeMoreIG: "Into the moments of light →",
    newsletter: "Newsletter",
    newsletterSub: "Quiet updates, first listens, and behind-the-scenes notes",
    pressContact: "Press & Contact",
    pressContactSub: "For collaborations, bookings, or licensing inquiries.",
    downloadEPK: "Download EPK (PDF)",
    newestRelease: "Newest release:",
    socials: { youtube:"YouTube", instagram:"Instagram", tiktok:"TikTok", soundcloud:"SoundCloud", facebook:"Facebook", website:"Website" },
    streaming: { spotify:"Spotify", appleMusic:"Apple Music", amazonMusic:"Amazon Music", bandcamp:"Bandcamp", flo: "FLO", vibe: "VIBE" }
  },
  KR: {
    title: "오랄리스와 조화롭게",
    subtitle: "오랄리스의 음악과 소식, 가까이에서",
    follow: "팔로우",
    followSub: "음표 사이의 순간들이 고요히 펼쳐지는 곳",
    listen: "감상하기",
    listenSub: "소리와 고요가 어우러지는 오랄리스의 순간",
    watchListen: "느끼고, 함께 머물다",
    watchListenSub: "사색과 움직임의 메아리, 그곳에서 음악은 고요를 만납니다",
    visitChannel: "Into the world of Auralis →",
    instagram: "인스타그램",
    seeMoreIG: "빛의 순간으로 →",
    newsletter: "뉴스레터",
    newsletterSub: "고요한 소식, 새로운 선율, 그리고 무대 뒤의 이야기",
    pressContact: "언론 및 연락처",
    pressContactSub: "협업, 공연, 라이선스 문의",
    downloadEPK: "EPK 다운로드 (PDF)",
    newestRelease: "최신 발매:",
    socials: { youtube:"YouTube", instagram:"Instagram", tiktok:"TikTok", soundcloud:"SoundCloud", facebook:"Facebook", website:"Website" },
    streaming: { spotify:"Spotify", appleMusic:"Apple Music", amazonMusic:"Amazon Music", bandcamp:"Bandcamp", flo: "FLO", vibe: "VIBE" }
  }
};

const followLinks = [
  { key: "youtube", href: "https://www.youtube.com/@auralis.artist" },
  { key: "instagram", href: "https://www.instagram.com/auralis.artist" },
  { key: "tiktok", href: "https://www.tiktok.com/@auralis.artist" },
  { key: "soundcloud", href: "https://soundcloud.com/auralisartist" },
  { key: "facebook", href: "https://facebook.com/auralis.artist" },
  { key: "website", href: "http://auralis-music.com" }
] as const;

const staticInstagramPosts: IGItem[] = [
  { href: "https://www.instagram.com/auralis.artist/", src: "https://picsum.photos/seed/ig1/300/300", alt: "Auralis on Instagram" },
  { href: "https://www.instagram.com/auralis.artist/", src: "https://picsum.photos/seed/ig2/300/300", alt: "Auralis on Instagram" },
  { href: "https://www.instagram.com/auralis.artist/", src: "https://picsum.photos/seed/ig3/300/300", alt: "Auralis on Instagram" }
];

const ConnectSection: React.FC = () => {
  const { language } = useSiteContext();
  const c = useMemo(() => content[((language as Lang) || "EN")], [language]);

  // 공통 칩(타원): 높이/패딩 고정 + hover 리프트 & 골드글로우
  const chip =
    "universal-chip inline-flex items-center justify-center rounded-full " +
    "border border-card px-3.5 py-2 h-9 text-sm leading-none whitespace-nowrap " +
    "transition duration-300 bg-[var(--card)] " +
    "hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(203,174,122,0.25)] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] " +
    "dark:bg-transparent dark:text-neutral-100 dark:border-white/20 dark:hover:border-[#CBAE7A]";
  const chipFull = chip + " w-full";

  // 공통 카드: 살짝 떠오름 + 골드빛 외곽
  const card =
    "bg-card border border-card rounded-2xl shadow-sm p-5 " +
    "transition-transform duration-300 hover:-translate-y-0.5 " +
    "hover:shadow-[0_10px_30px_rgba(203,174,122,0.18)] hover:border-[#CBAE7A]/40";

  return (
    <section id="connect-section" className="scroll-mt-28 md:scroll-mt-32 py-20">
      {/* 타이틀 (Watch & Listen 과 동일 톤) */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="auralis-section-title text-3xl md:text-4xl font-semibold leading-snug dark:text-neutral-100">
          {c.title}
        </h2>
        <p className="auralis-subtitle mt-2 text-neutral-600 dark:text-neutral-200">{c.subtitle}</p>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* LEFT: Follow + Listen */}
        <div className="space-y-6">
          {/* Follow */}
          <div className={card}>
            <h3 className="text-lg font-medium text-link">{c.follow}</h3>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-200 leading-relaxed">{c.followSub}</p>

            {/* 3x2, 칩을 셀 너비로 통일 */}
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {followLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={chipFull}
                  >
                    {c.socials[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Listen */}
          <div className={card}>
            <h3 className="text-lg font-medium text-link">{c.listen}</h3>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-200 leading-relaxed">{c.listenSub}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a href="https://open.spotify.com/artist/48Y3hooTTdatHfOBLCQRDP" target="_blank" rel="noopener noreferrer" className={chipFull}>
                {c.streaming.spotify}
              </a>
              <a href="https://music.apple.com/kr/artist/auralis/49597004" target="_blank" rel="noopener noreferrer" className={chipFull}>{c.streaming.appleMusic}</a>
              <a tabIndex={-1} aria-disabled="true" className={`${chipFull} opacity-70 cursor-not-allowed`}>
                {c.streaming.amazonMusic}
              </a>
              <a href="https://auralis-official.bandcamp.com/album/resonance-after-the-first-suite" target="_blank" rel="noopener noreferrer" className={chipFull}>
                {c.streaming.bandcamp}
              </a>
              <a href="https://www.music-flo.com/detail/artist/412675301/track?sortType=POPULARITY&roleType=ALL" target="_blank" rel="noopener noreferrer" className={chipFull}>
                {c.streaming.flo}
              </a>
              <a tabIndex={-1} aria-disabled="true" className={`${chipFull} opacity-70 cursor-not-allowed`}>
                {c.streaming.vibe}
              </a>
            </div>

            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-300">
              {c.newestRelease}{" "}
              <ReactRouterDOM.Link
                to={`${ALBUMS_BASE}/resonance-after-the-first-suite`}
                className="underline underline-offset-4 text-link-hover dark:text-neutral-200"
              >
                Resonance: After the First Suite
              </ReactRouterDOM.Link>
            </p>
          </div>
        </div>

        {/* CENTER: Hero + Instagram */}
        <div className="space-y-6">
          {/* Hero */}
          <div className={card + " overflow-hidden"}>
            <a href="https://www.youtube.com/@auralis.artist" target="_blank" rel="noopener noreferrer">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="https://picsum.photos/seed/yt-teaser/800/600"
                  alt="Latest video teaser"
                  className="h-full w-full object-cover dark:brightness-90"
                />
              </div>
              <div className="p-5 md:p-4">
                <h3 className="text-lg font-medium dark:text-neutral-100">{c.watchListen}</h3>
                <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-200">{c.watchListenSub}</p>
                <span className="mt-3 inline-block text-sm underline underline-offset-4">
                  {c.visitChannel}
                </span>
              </div>
            </a>
          </div>

          {/* Instagram */}
          <div className={card}>
            <h3 className="text-lg font-medium text-link">{c.instagram}</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {staticInstagramPosts.map((post, i) => (
                <a
                  key={i}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md overflow-hidden"
                  aria-label={`${post.alt} ${i + 1}`}
                >
                  <img
                    src={post.src}
                    alt={post.alt}
                    className="w-full aspect-square object-cover dark:brightness-90"
                  />
                </a>
              ))}
            </div>
            <a
              href="https://www.instagram.com/auralis.artist"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm underline underline-offset-4 text-link-hover"
            >
              {c.seeMoreIG}
            </a>
          </div>
        </div>

        {/* RIGHT: Newsletter + Press */}
        <div className="space-y-6">
          {/* Newsletter */}
          <div className={card}>
            <h3 className="text-lg font-medium text-link">{c.newsletter}</h3>
            <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-200 leading-relaxed">{c.newsletterSub}</p>
            <SubscribeForm language={language as Lang} />
          </div>

          {/* Press & Contact — 간격 축소(한 줄) */}
          <div className={card}>
            <h3 className="text-lg font-medium text-link">{c.pressContact}</h3>
            <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-200 leading-relaxed">{c.pressContactSub}</p>
            <div className="mt-3 flex items-center gap-3 flex-nowrap">
              <span className="rounded-full accent-border border px-4 py-1.5 text-sm min-w-[140px] text-center opacity-70 cursor-not-allowed">
                {c.downloadEPK}
              </span>
              <a
                href="mailto:artre0707@gmail.com"
                className="text-sm underline underline-offset-4 text-link-hover whitespace-nowrap"
              >
                artre0707@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Shooting-star-ish Divider (subtle) */}
      <div className="relative mx-auto mt-8 w-44 sm:w-52 lg:w-60 h-[0.5px] bg-gradient-to-r from-transparent via-[#CBAE7A]/20 to-transparent dark:via-[#CBAE7A]/12">
        {/* 작은 빛 점 */}
        <span className="absolute left-1/2 -translate-x-1/2 -top-[3px] h-1 w-1 rounded-full bg-[#CBAE7A]/70 shadow-[0_0_8px_rgba(203,174,122,0.55)] blur-[0.3px]" />
      </div>
    </section>
  );
};

export default ConnectSection;