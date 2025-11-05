import React, { useState, useEffect } from 'react';
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '../contexts/SiteContext';
import type { Language } from '../App';

const content = {
  EN: {
    title: 'About Auralis',
    text: 'Pianist and composer exploring the quiet between notes.',
    link: 'where her story unfolds →',
  },
  KR: {
    title: '오랄리스 소개',
    text: '음표 사이의 고요를 탐구하는 피아니스트이자 작곡가.',
    link: '그 이야기를 만나보는 곳 →',
  },
};

const AboutSection: React.FC = () => {
  const { language } = useSiteContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const currentContent = content[language];

  // 버튼 베이스 (about 칩 안에서 쓰는 미니 사이즈)
  const BUTTON_INLINE =
    'auralis-btn group relative overflow-hidden z-0 align-middle inline-flex items-center gap-1 rounded-full ' +
    'border px-3 py-1.5 text-sm font-medium transition ' +
    'border-neutral-300/20 ' +
    "before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    'before:transition-opacity before:duration-[600ms] before:ease-in-out ' +
    'before:opacity-0 group-hover:before:opacity-100 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40';

  const forceStyles = `
    .auralis-btn { color: #B89B64; }
    .auralis-btn::before { background-color: rgba(203,174,122,0.10); }
    .auralis-btn:hover { color: #B89B64; }
    .auralis-btn .arrow { display:inline-block; transform: translateX(0); transition: transform 200ms ease; }
    .auralis-btn:hover .arrow,
    .auralis-btn:focus-visible .arrow { transform: translateX(3px); }
    body.dark .auralis-btn,
    html.dark .auralis-btn,
    [data-theme="dark"] .auralis-btn {
      color: #E7CF9F;
      background: transparent;
    }
    body.dark .auralis-btn:hover,
    html.dark .auralis-btn:hover,
    [data-theme="dark"] .auralis-btn:hover { color: #0b0d12; }
  `;

  const labelText = currentContent.link.replace(/→/g, '').trim();

  // ✅ KR일 때만 폰트 전체 살짝 축소 (about 섹션 전용)
  const textScaleKR = language === 'KR' ? 'text-[93%] leading-[1.65]' : '';

  return (
    <section
      id="about-auralis"
      className={`scroll-mt-28 md:scroll-mt-32 py-12 sm:py-14 lg:py-16 text-center transition-all ${textScaleKR}`}
    >
      <style>{forceStyles}</style>

      <div className="max-w-screen-lg mx-auto px-4">
        <h2
          className="auralis-heading font-serif text-2xl sm:text-3xl lg:text-4xl mb-6 transition-opacity duration-700 ease-in-out"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          {currentContent.title}
        </h2>

        <p
          id="about-oneliner"
          className={`inline-block px-4 py-2 rounded-full bg-card border-card border shadow-sm text-sm sm:text-base leading-snug transition-all duration-700 ease-in-out hover:shadow-md hover:scale-[1.01] ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className={language === 'KR' ? 'font-noto-kr' : ''}>{currentContent.text}</span>

          {/* 미니 버튼 */}
          <ReactRouterDOM.Link
            to="/about"
            className={`${BUTTON_INLINE} ml-2`}
            aria-label={language === 'EN' ? 'Read about Auralis' : '오랄리스 소개 페이지로'}
          >
            <span
              className={`relative z-10 inline-flex items-center gap-1 ${
                language === 'KR' ? 'font-noto-kr' : ''
              }`}
            >
              <span>{labelText}</span>
              <span aria-hidden className="arrow">→</span>
            </span>
          </ReactRouterDOM.Link>
        </p>
      </div>
    </section>
  );
};

export default AboutSection;