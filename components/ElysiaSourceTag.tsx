import React from "react";
import { useSiteContext } from "../contexts/SiteContext";
import { albumsData } from "../data/albums";
import { Headphones } from "lucide-react";

type Props = {
  albumKey?: string | null;
  sourceTitle?: string;
};

export default function ElysiaSourceTag({ albumKey, sourceTitle }: Props) {
  const { language } = useSiteContext();
  const album = albumKey && (albumsData as any)[albumKey] ? (albumsData as any)[albumKey] : undefined;

  const label = language === "KR" ? "수록:" : "From:";

  const youtube = album?.links?.youtube;
  const albumHref = album?.slug ? `#/albums/${album.slug}` : undefined;
  const href = youtube ?? albumHref;

  const title = sourceTitle ?? album?.title ?? "Original";

  const inner = (
    <>
      <Headphones className="inline-block mr-1 h-4 w-4 opacity-80 align-[-2px]" />
      <span className="mr-1.5 text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 dark:decoration-[#CBAE7A]/60 dark:hover:decoration-[#CBAE7A]">
        {title}
      </span>
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
    >
      {inner}
    </a>
  ) : (
    <span className="inline-flex items-center text-sm text-neutral-500 dark:text-neutral-400">{inner}</span>
  );
}