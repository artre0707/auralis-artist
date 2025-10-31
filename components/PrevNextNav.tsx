import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Btn from "../components/Btn";
import { useSiteContext } from "../contexts/SiteContext";

type LangTitle =
  | string
  | {
      EN: string;
      KR: string;
    };

export type NavItem = {
  slug: string;
  title: LangTitle;
  date?: string; // YYYY-MM-DD 권장 (정렬용)
};

type SectionType = "news" | "magazine" | "albums";

interface PrevNextNavProps {
  /** 전체 리스트(최소 slug/title 필요). date가 있으면 날짜 기준 정렬 */
  items?: NavItem[];
  /** 현재 상세 페이지의 slug */
  currentSlug?: string;

  /** 직접 prev/next를 지정하고 싶을 때 */
  prev?: NavItem | null;
  next?: NavItem | null;

  /** 링크 prefix. 예) "/news", "/magazine", "/albums" */
  basePath: string;

  /** 날짜 정렬 방향. 기본값: desc(최신→과거) */
  order?: "asc" | "desc";
  /** 레이아웃 클래스 */
  className?: string;

  /** 섹션 타입(라벨 다국어에 사용) */
  type?: SectionType;
}

function parseDate(s?: string) {
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t);
}

function getDisplayTitle(t: LangTitle, lang: "EN" | "KR") {
  return typeof t === "string" ? t : t[lang] ?? t.EN ?? "";
}

// FIX: Removed hardcoded arrows from labels; they are now handled by the Btn component.
const LABELS = {
  EN: {
    prev: "Previous",
    next: "Next",
    prev_news: "Previous News",
    next_news: "Next News",
    prev_mag: "Previous Magazine",
    next_mag: "Next Magazine",
    prev_alb: "Previous Album",
    next_alb: "Next Album",
  },
  KR: {
    prev: "이전",
    next: "다음",
    prev_news: "이전 뉴스",
    next_news: "다음 뉴스",
    prev_mag: "이전 매거진",
    next_mag: "다음 매거진",
    prev_alb: "이전 앨범",
    next_alb: "다음 앨범",
  },
};

const PrevNextNav: React.FC<PrevNextNavProps> = ({
  items,
  currentSlug,
  prev,
  next,
  basePath,
  order = "desc",
  className = "",
  type,
}) => {
  const { language } = useSiteContext();
  const lang = (language || "EN") as "EN" | "KR";

  const computed = useMemo(() => {
    if (!items || !currentSlug) return { prev: null as NavItem | null, next: null as NavItem | null };
    const xs = [...items];

    // date가 있는 경우에만 날짜 정렬 적용
    xs.sort((a, b) => {
      const da = parseDate(a.date)?.getTime() ?? 0;
      const db = parseDate(b.date)?.getTime() ?? 0;
      return order === "asc" ? da - db : db - da;
    });

    const idx = xs.findIndex((x) => x.slug === currentSlug);
    if (idx === -1) return { prev: null, next: null };

    // 정렬 방향 기준으로 “앞/뒤” 계산
    const prevItem = xs[idx - 1] ?? null;
    const nextItem = xs[idx + 1] ?? null;
    return { prev: prevItem, next: nextItem };
  }, [items, currentSlug, order]);

  const finalPrev = prev ?? computed.prev;
  const finalNext = next ?? computed.next;

  const text = (() => {
    switch (type) {
      case "news":
        return { prev: LABELS[lang].prev_news, next: LABELS[lang].next_news };
      case "magazine":
        return { prev: LABELS[lang].prev_mag, next: LABELS[lang].next_mag };
      case "albums":
        return { prev: LABELS[lang].prev_alb, next: LABELS[lang].next_alb };
      default:
        return { prev: LABELS[lang].prev, next: LABELS[lang].next };
    }
  })();

  return (
    <nav
      aria-label="Pagination"
      className={`mt-12 pt-6 border-t border-[var(--border)] ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Prev */}
        <div className="md:justify-self-start">
          {finalPrev ? (
            <Link
              to={`${basePath}/${finalPrev.slug}`}
              rel="prev"
              aria-label={text.prev + ": " + getDisplayTitle(finalPrev.title, lang)}
              className="block"
            >
              <Btn variant="outlineGhost" arrowLeft arrow={false} className="w-full md:w-auto text-left">
                <span className="block text-xs text-subtle mb-0.5">{text.prev}</span>
                <span className="block">{getDisplayTitle(finalPrev.title, lang)}</span>
              </Btn>
            </Link>
          ) : (
            <div className="opacity-50">
              <Btn disabled variant="outlineGhost" arrowLeft arrow={false} className="w-full md:w-auto text-left">
                {text.prev}
              </Btn>
            </div>
          )}
        </div>

        {/* Next */}
        <div className="md:justify-self-end">
          {finalNext ? (
            <Link
              to={`${basePath}/${finalNext.slug}`}
              rel="next"
              aria-label={text.next + ": " + getDisplayTitle(finalNext.title, lang)}
              className="block"
            >
              <Btn variant="outlineGhost" arrow className="w-full md:w-auto text-right md:text-left">
                <span className="block text-xs text-subtle mb-0.5">{text.next}</span>
                <span className="block">{getDisplayTitle(finalNext.title, lang)}</span>
              </Btn>
            </Link>
          ) : (
            <div className="opacity-50 md:text-right">
              <Btn disabled variant="outlineGhost" arrow className="w-full md:w-auto">
                {text.next}
              </Btn>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PrevNextNav;