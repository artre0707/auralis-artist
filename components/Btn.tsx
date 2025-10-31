import React from "react";
import { Link } from "react-router-dom";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

interface BtnProps {
  to?: string;
  href?: string;
  state?: any;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  variant?:
    | "solid"
    | "outline"
    | "ghost"
    | "outlineGhost"
    | "back"
    | "primaryGlow";
  size?: "sm" | "md" | "lg";
  arrow?: boolean; // 항상 오른쪽 화살표 표시 (기본값 true)
  // FIX: Add arrowLeft prop for left-pointing arrow.
  arrowLeft?: boolean;
  className?: string;
  disabled?: boolean;
  disabledTitle?: string;
  type?: "button" | "submit";
}

const Btn: React.FC<BtnProps> = ({
  to,
  href,
  onClick,
  children,
  variant = "solid",
  arrow = true, // ✅ 항상 오른쪽 화살표
  // FIX: Destructure arrowLeft prop.
  arrowLeft,
  className,
  disabled,
  disabledTitle,
  type = "button",
  state,
  size,
}) => {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  const styles = {
    solid: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
    primaryGlow:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] dark:hover:text-[#F5E3B5] shadow-[0_4px_15px_rgba(203,174,122,0.4)] hover:shadow-[0_4px_20px_rgba(203,174,122,0.6)] transition-shadow",
    outline:
      "border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white",
    ghost:
      "text-[var(--accent)] hover:text-[var(--accent-hover)] px-3 py-1 text-sm",
    outlineGhost:
      "border border-[var(--border)] hover:border-[var(--accent)] text-subtle hover:text-[var(--accent)] px-4 py-2 text-sm " +
      "dark:text-neutral-200 dark:hover:text-[var(--accent)] dark:border-white/15 dark:hover:border-[var(--accent)]",
    back: cx(
      "px-4 py-2 text-sm font-medium rounded-full border backdrop-blur-sm",
      "border-black/10 bg-white/70 text-neutral-800 hover:bg-white/90",
      "dark:border-white/20 dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/15"
    ),
  } as const;

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  } as const;

  const hasOwnSize = ["ghost", "outlineGhost", "back"].includes(variant);
  const sizeToUse = size || "md";

  // ✅ 오른쪽 화살표만 존재
  const inner = (
    // FIX: Render left arrow when arrowLeft is true, and ensure only one arrow is shown.
    <span className="inline-flex items-center gap-2">
      {arrowLeft && (
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:-translate-x-[2px]"
        >
          ←
        </span>
      )}
      <span>{children}</span>
      {arrow && !arrowLeft && (
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-[2px]"
        >
          →
        </span>
      )}
    </span>
  );

  const classes = cx(
    base,
    styles[variant],
    !hasOwnSize && sizeClasses[sizeToUse],
    className,
    disabled && "opacity-60 cursor-not-allowed"
  );

  const title = disabled ? disabledTitle : undefined;

  // 🔒 비활성화 처리
  if (disabled) {
    return (
      <button
        type={type}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-disabled="true"
        disabled
        title={title}
        className={classes}
      >
        {inner}
      </button>
    );
  }

  // ✅ 내부 라우터 이동 지원 (예: /elysia)
  if (to) {
    return (
      <Link to={to} state={state} title={title} className={classes} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  // ✅ 외부 링크 처리
  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        title={title}
        className={classes}
        onClick={onClick}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  // ✅ 일반 버튼
  return (
    <button type={type} onClick={onClick} title={title} className={classes}>
      {inner}
    </button>
  );
};

export default Btn;
