

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { useTheme } from '@/hooks/useTheme';
import { useStarfield } from '@/hooks/useStarfield';

interface HeaderProps {
  isScrolled: boolean;
}

const ALBUMS_BASE = '/albums';

const navLinks = [
  { href: '/', en: 'Prelude', kr: '전주곡', end: true },
  { href: '/news', en: 'Notes', kr: '노트' },
  { href: ALBUMS_BASE, en: 'Collections', kr: '작품집' },
  { href: '/studio', en: 'Canvas', kr: '캔버스' },
  { href: '/magazine', en: 'Magazine', kr: '매거진', end: true },
  { href: '/elysia', en: 'Elysia', kr: '엘리시아' },
  { href: '/about', en: 'Journey', kr: '여정' },
];

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useSiteContext();
  const { theme, setTheme } = useTheme();
  const { stars, setStars } = useStarfield();
  const location = useLocation();

  const isHome = location.pathname === '/';

  // 홈 = 투명 / 서브 기본 = 약간 밝은 검정 / 스크롤 or 메뉴열림 = 기존 bg-card
  const headerBgClass =
    isScrolled || isMenuOpen
      ? 'bg-card shadow-sm border-b border-base'
      : isHome
      ? 'bg-transparent'
      : 'bg-[rgba(44,44,48,0.9)] backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.25)]';

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleStars = () => setStars(stars === 'on' ? 'off' : 'on');
  const starsOn = stars === 'on';

  const starsContent = {
    desktop: {
      EN: starsOn ? 'Stars On' : 'Stars Off',
      KR: starsOn ? '별빛 켜기' : '별빛 끄기',
    },
    mobile: {
      EN: starsOn ? 'Stars: On' : 'Stars: Off',
      KR: starsOn ? '별빛: 켜기' : '별빛: 끄기',
    },
    title: {
      EN: starsOn ? 'Turn stars off' : 'Turn stars on',
      KR: starsOn ? '별빛 끄기' : '별빛 켜기',
    },
  };

  const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.95-4.243l-1.59-1.59M3 12h2.25m.386-6.364L6.75 7.25M12 6a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
  );

  const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.697-2.648z" />
    </svg>
  );

  const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );

  const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const NavItem: React.FC<{ link: typeof navLinks[0]; isMobile?: boolean }> = ({ link, isMobile }) => {
    const linkContent = language === 'EN' ? link.en : link.kr;
    const mobileClasses =
      'hover:bg-black/5 dark:hover:bg-white/5 block w-full text-left px-3 py-2 rounded-md text-base font-medium tracking-wider';
    const desktopClasses =
      'text-sm font-medium tracking-wider uppercase transition-colors hover:text-[var(--link)]';

    return (
      <NavLink
        to={link.href}
        end={link.end}
        onClick={() => isMobile && setIsMenuOpen(false)}
        className={({ isActive }) =>
          `${isMobile ? mobileClasses : desktopClasses} ${
            isActive ? 'accent-text' : (isScrolled || isMenuOpen ? 'text-subtle' : 'text-white/90')
          }`
        }
      >
        {linkContent}
      </NavLink>
    );
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${headerBgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Auralis and ARTRE home"
              className={`font-playfair text-2xl font-bold tracking-wide transition-colors hover:text-[var(--link)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm px-1 ${
                isScrolled || isMenuOpen ? '' : 'text-white'
              }`}
            >
              A⋅R
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <NavItem key={link.href} link={link} />
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleStars}
              className={`hidden sm:inline-block text-xs px-3 py-1.5 rounded-full transition-colors ${
                starsOn
                  ? 'accent-bg text-white'
                  : 'bg-card text-subtle hover:bg-black/5 dark:hover:bg-white/5 border border-card'
              }`}
              aria-pressed={starsOn}
              aria-label="Toggle starfield"
              title={starsContent.title[language]}
            >
              {starsContent.desktop[language]}
            </button>
            <button
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              className={`p-1.5 rounded-full transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:bg-black/10 dark:hover:bg-white/10 ${
                isScrolled || isMenuOpen ? 'text-subtle' : 'text-white/90'
              }`}
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${
                isScrolled || isMenuOpen ? 'text-subtle' : 'text-white/90'
              }`}
            >
              {language === 'EN' ? 'KR' : 'EN'}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                className={`p-1.5 rounded-md transition-colors ${
                  isScrolled || isMenuOpen ? 'text-subtle' : 'text-white/90'
                } hover:bg-black/10 dark:hover:bg-white/10`}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-base bg-[rgba(28,28,32,0.92)] backdrop-blur-md">
          {navLinks.map((link) => (
            <NavItem key={link.href} link={link} isMobile />
          ))}
          <div className="pt-2 pl-3 sm:hidden">
            <button
              onClick={toggleStars}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                starsOn ? 'accent-bg text-white' : 'bg-black/5 dark:bg-white/5 text-subtle'
              }`}
              aria-pressed={starsOn}
              title={starsContent.title[language]}
            >
              {starsContent.mobile[language]}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;