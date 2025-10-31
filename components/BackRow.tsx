import React from "react";
import { Link } from "react-router-dom";

// 간단한 유틸
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type BackItem = {
  to: string;
  label: string;         // 예: '← Back to Albums'
  ariaLabel?: string;
};

export const BackRow: React.FC<{ items: BackItem[]; className?: string }> = ({
  items,
  className,
}) => {
  return (
    <div
      className={cx(
        // 위치를 "약간 아래"로: 섹션 하단 여백 확보
        "mt-10 sm:mt-12 flex flex-wrap justify-center gap-3",
        className
      )}
    >
      {items.map((it) => (
        <Link
          key={it.to + it.label}
          to={it.to}
          aria-label={it.ariaLabel || it.label}
          className={cx(
            // 버튼 베이스
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
            "border shadow-sm backdrop-blur-sm transition",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",

            // ☀️ 라이트 모드
            "bg-white/70 text-neutral-800 border-black/10 hover:bg-white/90",

            // 🌙 다크 모드(가독도 ↑)
            "dark:bg-white/10 dark:text-neutral-100 dark:border-white/20 dark:hover:bg-white/15"
          )}
        >
          <span aria-hidden>←</span>
          <span>{it.label.replace(/^←\s*/, "")}</span>
        </Link>
      ))}
    </div>
  );
};
