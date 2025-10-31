import React from 'react';

type Align = 'left' | 'center';
type Spacing = 'none' | 'sm' | 'md' | 'lg';

const GAP: Record<Spacing, string> = {
  none: '',
  sm: 'mb-5 md:mb-6',
  md: 'mb-8 md:mb-10 lg:mb-12',   // 기본
  lg: 'mb-12 md:mb-14 lg:mb-16',  // 넉넉
};

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  divider = false,
  spacing = 'md',
  className = '',
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: Align;
  divider?: boolean;
  spacing?: Spacing;   // ✅ 아래 여백 강도
  className?: string;
}) {
  const alignCls = align === 'left' ? 'text-left' : 'text-center';

  return (
    <header className={`${alignCls} ${GAP[spacing]} ${className}`}>
      <h2 className="auralis-section-title text-2xl sm:text-3xl lg:text-4xl tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="auralis-subtitle mt-2 text-sm sm:text-base text-subtle">
          {subtitle}
        </p>
      )}
      {divider && (
        <div className="mt-6 mx-auto w-16 h-px bg-[var(--accent)]/70" />
      )}
    </header>
  );
}