import React from 'react';
import { Link } from 'react-router-dom';
import { ParallaxImage } from './Parallax';
import { useReducedMotion } from 'framer-motion';

type Align = 'left' | 'center';
type Divider = 'none' | 'line' | 'fade';
type Size = 'sm' | 'md' | 'lg';
type BackgroundMode = 'parallax' | 'css' | 'none';

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

interface PageHeroProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  align?: Align;
  goldTitle?: boolean;
  size?: Size;
  divider?: Divider;
  breadcrumb?: { label: string; to?: string }[];
  actions?: React.ReactNode;

  /** 배경 이미지 URL (없으면 일반 헤더 레이아웃) */
  backgroundImage?: string;

  /** 배경 처리 모드: 'parallax' | 'css' | 'none' (기본: parallax, 이미지 없으면 자동 none) */
  backgroundMode?: BackgroundMode;

  /** 패럴랙스 강도 (기본 0.08) */
  parallaxStrength?: number;

  /** 배경 위 그라데이션 오버레이 표시 (기본: 이미지 있을 때 true) */
  gradientOverlay?: boolean;

  /** 접근성용 배경 대체 텍스트 (parallax 모드에서 사용) */
  backgroundAlt?: string;

  /** 오버레이에 추가 클래스 */
  overlayClassName?: string;

  className?: string;
  id?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  eyebrow,
  align = 'center',
  goldTitle = false,
  size = 'md',
  divider = 'none',
  breadcrumb,
  actions,
  backgroundImage,
  backgroundMode = 'parallax',
  parallaxStrength = 0.08,
  gradientOverlay = !!backgroundImage,
  backgroundAlt = '',
  overlayClassName,
  className,
  id,
}) => {
  const reduceMotion = useReducedMotion();

  // 실제 적용 모드 (이미지 없으면 none, Reduce Motion이면 parallax → css로 강등)
  const effectiveMode: BackgroundMode = !backgroundImage
    ? 'none'
    : (backgroundMode === 'parallax' && !reduceMotion ? 'parallax' : (backgroundMode === 'none' ? 'none' : 'css'));

  const hasBackground = effectiveMode !== 'none';
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  const titleSize =
    size === 'lg'
      ? 'text-3xl sm:text-4xl lg:text-5xl'
      : size === 'sm'
      ? 'text-xl sm:text-2xl'
      : 'text-2xl sm:text-3xl lg:text-4xl';

  // 브랜드 타이포 일관성 유지 (auralis-* 클래스 사용)
  const titleCls = cx(
    'auralis-hero-title tracking-tight',
    titleSize,
    goldTitle ? 'text-gradient-gold' : 'text-neutral-900 dark:text-neutral-100'
  );

  return (
    <section
      id={id}
      className={cx(
        'relative',
        hasBackground ? 'rounded-3xl overflow-hidden mb-8' : 'pt-16 pb-8 md:pt-20 md:pb-10',
        className
      )}
    >
      {/* 배경 레이어 */}
      {hasBackground && (
        <>
          {effectiveMode === 'parallax' ? (
            <ParallaxImage
              src={backgroundImage!}
              alt={backgroundAlt || (typeof title === 'string' ? title : '')}
              strength={parallaxStrength}
              className="absolute inset-0 -z-10 overflow-hidden"
              imgClassName="w-full h-full object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-center bg-cover"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}

          {gradientOverlay && (
            <div
              aria-hidden
              className={cx(
                'absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/20 to-transparent',
                overlayClassName
              )}
            />
          )}
        </>
      )}

      {/* 컨텐츠 */}
      <div className={cx('relative z-10', hasBackground ? 'px-4 sm:px-6 lg:px-8 py-20' : '')}>
        {(breadcrumb?.length || actions) && (
          <div
            className={cx(
              'mb-3 flex w-full max-w-5xl mx-auto',
              align === 'center' ? 'justify-center' : 'justify-between'
            )}
          >
            {breadcrumb?.length ? (
              <nav
                aria-label="Breadcrumb"
                className={cx(
                  align === 'center' && 'hidden sm:block',
                  hasBackground ? 'text-white/80' : 'text-subtle'
                )}
              >
                <ol className="flex flex-wrap items-center gap-2 text-xs">
                  {breadcrumb.map((b, i) => (
                    <li key={`${b.label}-${i}`} className="flex items-center gap-2">
                      {b.to ? (
                        <Link to={b.to} className="underline underline-offset-4 hover:text-white">
                          {b.label}
                        </Link>
                      ) : (
                        <span className="opacity-80">{b.label}</span>
                      )}
                      {i < breadcrumb.length - 1 && <span aria-hidden>›</span>}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : (
              <span />
            )}

            {actions && <div className={cx(align === 'center' && 'hidden sm:block')}>{actions}</div>}
          </div>
        )}

        <header className={cx('flex flex-col', alignCls)}>
          {eyebrow && (
            <div
              className={cx(
                'mb-2 text-xs sm:text-[13px] uppercase tracking-widest',
                hasBackground ? 'text-white/80' : 'text-subtle'
              )}
            >
              {eyebrow}
            </div>
          )}

          <h1 className={cx(titleCls, hasBackground && 'text-white')}>{title}</h1>

          {subtitle && (
            <p
              className={cx(
                'auralis-subtitle mt-3 text-sm sm:text-base max-w-2xl',
                hasBackground ? 'text-neutral-100/90' : 'text-subtle'
              )}
            >
              {subtitle}
            </p>
          )}

          {divider !== 'none' && (
            <div className={cx('w-48 mt-5', align === 'center' ? 'mx-auto' : '')}>
              {divider === 'line' ? (
                <div className="h-px w-full bg-current opacity-20" />
              ) : (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-40" />
              )}
            </div>
          )}

          {actions && align === 'center' && <div className="mt-6 sm:hidden">{actions}</div>}
        </header>
      </div>
    </section>
  );
};

export default PageHero;
