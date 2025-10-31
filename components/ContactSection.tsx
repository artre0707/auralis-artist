import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';

const ALBUMS_BASE = '/albums';

const navLinks = [
  { href: '/', en: 'Prelude', kr: '전주곡' },
  { href: '/news', en: 'Notes', kr: '노트' },
  { href: ALBUMS_BASE, en: 'Collections', kr: '작품집' },
  { href: '/studio', en: 'Canvas', kr: '캔버스' },
  { href: '/magazine', en: 'Magazine', kr: '매거진' },
  { href: '/elysia', en: 'Elysia', kr: '엘리시아' },
  { href: '/about', en: 'Journey', kr: '여정' },
];

const ContactSection: React.FC = () => {
  const { language } = useSiteContext();

  return (
    <footer id="contact" className="bg-transparent border-none text-[#CBB78A">
      <div className="container mx-auto px-6 py-12 text-center">
        <nav aria-label="Footer Navigation" className="mb-6">
          <ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs sm:text-sm sm:gap-x-6">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link 
                  to={link.href} 
                  className="text-subtle text-link-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                >
                  {language === 'EN' ? link.en : link.kr}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-neutral-500 dark:text-neutral-200 font-normal leading-relaxed tracking-wide">
          © 2025 Auralis & ARTRE. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default ContactSection;