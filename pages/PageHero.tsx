import React from 'react';
import { Link } from 'react-router-dom';

type Align = 'left' | 'center';
type Divider = 'none' | 'line' | 'fade';
type Size = 'sm' | 'md' | 'lg';

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
  backgroundImage?: string;
  gradientOverlay?: boolean;
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
  gradientOverlay = !!backgroundImage,
  className,
  id,
}) => {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  const titleSize =
    size === 'lg'
      ? 'text-3xl sm:text-4xl lg:text-5xl'
      : size === 'sm'
      ? 'text-xl sm:text-2xl'
      : 'text-2xl sm:text-3xl lg:text-4xl';

  const titleCls = cx(
    'font-playfair tracking-tight',
    titleSize,
    goldTitle ? 'text-gradient-gold' : 'text-neutral-900 dark:text-neutral-100'
  );

  return (
    <section
      id={id}
      className={cx(
        'relative',
        backgroundImage ? 'rounded-3xl overflow-hidden mb-8' : 'pt-24 pb-12',
        className
      )}
    >
      {backgroundImage && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {gradientOverlay && (
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
            />
          )}
        </>
      )}

      <div className={cx('relative z-10', backgroundImage ? 'px-4 sm:px-6 lg:px-8 py-20' : '')}>
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
                className={cx(align === 'center' && 'hidden sm:block', backgroundImage ? 'text-white/80' : 'text-subtle')}
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
                backgroundImage ? 'text-white/80' : 'text-subtle'
              )}
            >
              {eyebrow}
            </div>
          )}

          <h1 className={cx(titleCls, backgroundImage && 'text-white')}>{title}</h1>

          {subtitle && (
            <p
              className={cx(
                'mt-3 text-sm sm:text-base max-w-2xl',
                backgroundImage ? 'text-neutral-100/90' : 'text-subtle'
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
