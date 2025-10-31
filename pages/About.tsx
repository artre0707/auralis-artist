// pages/About.tsx
import React from 'react';
import PageContainer from '@/components/PageContainer';
import PageHero from '@/components/PageHero';
import { useSiteContext } from '@/contexts/SiteContext';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

type Lang = 'EN' | 'KR';

const copy = {
  EN: {
    heroTitle: 'Auralis',
    heroSubtitle: 'Where silence becomes music',
    sections: {
      aboutTitle: 'About the Artist',
      aboutP1:
        'Auralis is a Korean composer and pianist whose music embodies the stillness between light and emotion. Drawing upon classical sensitivity and contemporary minimalism, she creates soundscapes where each tone breathes with quiet intention.',
      aboutP2:
        'Her works blur the boundary between what is heard and what is felt—between the seen and unseen. Each project unfolds as a meditation on time, gratitude, and resonance, expressed through refined restraint and clarity.',
      philosophyTitle: 'Artistic Philosophy',
      philosophyQuote: '“Music begins where words fall silent.”',
      philosophyP1:
        'For Auralis, composition is an act of still awareness — a dialogue between sound and silence. Every piece begins not with an idea, but with a space to listen. Within that space, memory and light find their form in tone and motion.',
      collectionsTitle: 'Collections & Works',
      collectionsP1:
        'The Resonance Series, Serene Horizons, and Light & Faith embody distinct facets of her sound universe. Each collection reveals a chapter of her evolving musical journey — from introspective piano textures to contemplative orchestral atmospheres.',
      studioTitle: 'Studio Vision',
      studioP1:
        'Auralis Studio serves as both an instrument and a sanctuary. Every recording, mixing, and mastering process follows the same pursuit — capturing not volume, but vibration; not performance, but presence. The studio itself becomes part of the resonance.',
      connectTitle: 'Connect',
      ctaTitle: 'With Gratitude',
      ctaBody:
        'Thank you for listening with a quiet heart. May these sounds bring a gentle light to your moments.',
      ctaPrimary: 'Explore the Music',
      ctaSecondary: 'Composer’s Journal',
    },
  },
  KR: {
    heroTitle: '오랄리스',
    heroSubtitle: '고요가 음악이 되는 곳',
    sections: {
      aboutTitle: '아티스트 소개',
      aboutP1:
        '오랄리스는 빛과 감정 사이의 고요를 음악으로 담아내는 한국의 작곡가이자 피아니스트입니다. 클래식의 섬세함과 현대적 미니멀리즘을 기반으로, 각 음이 고요한 의도를 품은 채 숨 쉬는 사운드스케이프를 만들어 갑니다.',
      aboutP2:
        '그녀의 작품은 들리는 것과 느껴지는 것, 보이는 세계와 보이지 않는 세계의 경계를 흐리게 합니다. 모든 프로젝트는 시간과 감사, 그리고 공명에 대한 명상으로 이어지며, 절제와 명료함 속에서 빛의 언어로 표현됩니다.',
      philosophyTitle: '예술적 철학',
      philosophyQuote: '“음악은 말이 멈추는 곳에서 시작된다.”',
      philosophyP1:
        '오랄리스에게 작곡은 ‘고요한 자각의 행위’이며, 소리와 침묵이 대화하는 순간입니다. 모든 곡은 하나의 생각이 아니라, 먼저 “귀 기울이는 공간”에서 시작됩니다. 그 안에서 기억과 빛은 음과 움직임의 형태를 얻습니다.',
      collectionsTitle: '작품과 시리즈',
      collectionsP1:
        'Resonance, Serene Horizons, Light & Faith 시리즈는 오랄리스의 사운드 세계를 구성하는 서로 다른 결을 보여줍니다. 각 시리즈는 그녀의 음악적 여정 속 한 장을 이루며, 내면적인 피아노 질감에서 명상적인 오케스트라의 공간감까지 확장됩니다.',
      studioTitle: '스튜디오 비전',
      studioP1:
        '오랄리스 스튜디오는 악기이자 성소(聖所)로 존재합니다. 모든 녹음·믹싱·마스터링 과정은 “소리의 크기”가 아니라 “진동과 존재감”을 담기 위한 여정으로 이어지며, 그 안에서 스튜디오 자체가 하나의 공명체가 됩니다.',
      connectTitle: '함께하기',
      ctaTitle: 'Stay in Touch',
      ctaBody:
        '고요한 마음으로 들어주셔서 감사합니다. 이 음악들이 당신의 하루에 부드러운 빛이 되기를 바랍니다.',
      ctaPrimary: '음악 살펴보기',
      ctaSecondary: '작곡가의 노트',
    },
  },
} as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function About() {
  const { language } = useSiteContext();
  const navigate = useNavigate();
  const lang = (language as Lang) || 'EN';
  const c = copy[lang];

  const motionProps = {
    variants: fadeUp,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: 0.2 },
  };

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>, path: string) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--x', `${x}px`);
    btn.style.setProperty('--y', `${y}px`);
    btn.classList.add('glow-pulse');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      navigate(path);
      setTimeout(() => {
        document.body.classList.remove('fade-out');
        btn.classList.remove('glow-pulse');
      }, 350);
    }, 180);
  };

  return (
    <PageContainer>
      {/* ✅ 한글 전용 폰트 축소 */}
      {lang === 'KR' && (
        <style>{`
          /* 전체 기본 본문 */
          main {
            font-size: 0.94rem;       /* 약 6% 축소 */
            line-height: 1.85;
          }

          /* 소제목 */
          h2.auralis-section-title {
            font-size: 1.1rem !important;
          }

          /* Connect 섹션 내 리스트와 문단 */
          main ul, main p {
            font-size: 0.94rem;
            line-height: 1.8;
          }

          /* 영문은 영향받지 않음 */
        `}</style>
      )}
      <PageHero
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        align="center"
        goldTitle
        divider="line"
      />

      <main
        className="max-w-4xl mx-auto px-6 md:px-8 py-14 md:py-20 text-[15px] md:text-[16px] leading-[1.8]"
      >
        {/* About */}
        <motion.section {...motionProps} className="space-y-3 mb-10">
          <h2 className="auralis-section-title text-xl md:text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--heading)] to-[color:rgba(203,174,122,0.65)]">
            {c.sections.aboutTitle}
          </h2>
          <div className="prose prose-neutral dark:prose-invert prose-auralis">
            <p className="text-[var(--text)] opacity-[0.85]">{c.sections.aboutP1}</p>
            <p className="text-[var(--text)] opacity-75">{c.sections.aboutP2}</p>
          </div>
        </motion.section>

        {/* Philosophy */}
        <motion.section {...motionProps} className="mt-14">
          <h2 className="auralis-section-title text-xl md:text-2xl tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[var(--heading)] to-[color:rgba(203,174,122,0.65)]">
            {c.sections.philosophyTitle}
          </h2>
          <blockquote className="border-l-[3px] border-[var(--gold,#CBAE7A)]/80 pl-5">
            <p className="auralis-section-title text-lg md:text-xl italic text-[var(--heading)] opacity-90">
              {c.sections.philosophyQuote}
            </p>
            <div className="prose prose-neutral dark:prose-invert prose-auralis">
              <p className="mt-3 text-sm md:text-[15px] text-[var(--text)] opacity-75">
                {c.sections.philosophyP1}
              </p>
            </div>
          </blockquote>
        </motion.section>

        {/* Collections */}
        <motion.section {...motionProps} className="mt-16">
          <h2 className="auralis-section-title text-xl md:text-2xl tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[var(--heading)] to-[color:rgba(203,174,122,0.65)]">
            {c.sections.collectionsTitle}
          </h2>
          <div className="prose prose-neutral dark:prose-invert prose-auralis">
            <p className="text-[var(--text)] opacity-[0.85]">{c.sections.collectionsP1}</p>
          </div>
        </motion.section>

        {/* Studio */}
        <motion.section {...motionProps} className="mt-14">
          <h2 className="auralis-section-title text-xl md:text-2xl tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[var(--heading)] to-[color:rgba(203,174,122,0.65)]">
            {c.sections.studioTitle}
          </h2>
          <div className="prose prose-neutral dark:prose-invert prose-auralis">
            <p className="text-[var(--text)] opacity-[0.85]">{c.sections.studioP1}</p>
          </div>
        </motion.section>

        {/* Connect */}
        <motion.section {...motionProps} className="mt-20 border-t border-[var(--border)] pt-8">
          <h2 className="auralis-section-title text-xl md:text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--heading)] to-[color:rgba(203,174,122,0.65)]">
            {c.sections.connectTitle}
          </h2>

          {/* English */}
          {lang === 'EN' && (
            <div className="prose prose-neutral dark:prose-invert prose-auralis max-w-none">
              <h3 className="auralis-section-title text-lg md:text-xl text-[var(--heading)] mb-2">
                Collaboration · Licensing · Music Use
              </h3>
              <p className="text-sm text-[var(--text)] opacity-80 mb-3">
                For professional inquiries regarding collaboration, licensing, synchronization,
                broadcast, or music use across film/TV, advertising, digital content, live events,
                and publications, please contact:
              </p>
              <p className="text-[14px] md:text-[15px] mb-3">
                <span className="opacity-70">ARTRE (Label): </span>
                <a
                  href="mailto:artre0707@gmail.com"
                  className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                >
                  artre0707@gmail.com
                </a>
              </p>
              <ul className="list-disc list-inside text-[13.5px] text-[var(--text)] opacity-75 space-y-1 mb-3">
                <li>Project overview — format/platform, audience, short synopsis, timeline</li>
                <li>Intended track(s) from the Auralis catalogue and usage context</li>
                <li>Rights scope — media, territory, term, duration</li>
                <li>Budget range (if available) and clearance requirements</li>
              </ul>
              <p className="text-[13.5px] text-[var(--text)] opacity-65 italic mb-4">
                All rights remain with Auralis Music / ARTRE unless otherwise agreed in writing.
              </p>
              <div className="h-px bg-[var(--border)]/60 my-6 md:my-8"></div>
              <h3 className="auralis-section-title text-lg md:text-xl text-[var(--heading)] mb-2">
                Artist & Audience
              </h3>
              <p className="text-sm text-[var(--text)] opacity-80 mb-3">
                For messages from listeners, fans, and general inquiries:
              </p>
              <ul className="space-y-1 text-[14px] md:text-[15px]">
                <li>
                  <span className="opacity-70">Artist:</span> Auralis
                </li>
                <li>
                  <span className="opacity-70">E-mail:</span>{' '}
                  <a
                    href="mailto:auralis.artist.official@gmail.com"
                    className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                  >
                    auralis.artist.official@gmail.com
                  </a>
                </li>
                <li>
                  <span className="opacity-70">YouTube:</span>{' '}
                  <a
                    href="https://www.youtube.com/@auralis.artist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                  >
                    @auralis.artist
                  </a>
                </li>
                <li>
                  <span className="opacity-70">Instagram:</span>{' '}
                  <a
                    href="https://www.instagram.com/auralis.artist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                  >
                    @auralis.artist
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Korean */}
          {lang === 'KR' && (
            <div className="prose prose-neutral dark:prose-invert prose-auralis max-w-none">
              <h3 className="auralis-section-title text-lg md:text-xl text-[var(--heading)] mb-2">
                협업 · 음악 사용 · 저작권 문의
              </h3>
              <p className="text-sm text-[var(--text)] opacity-80 mb-3">
                영화/방송, 광고, 디지털 콘텐츠, 라이브 공연, 출판 등
                음악 사용·싱크·라이선스·협업 관련 공식 문의는 아래 이메일로 연락해 주세요.
              </p>
              <p className="text-[14px] md:text-[15px] mb-3">
                <span className="opacity-70">ARTRE (아르트레): </span>
                <a
                  href="mailto:artre0707@gmail.com"
                  className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                >
                  artre0707@gmail.com
                </a>
              </p>
              <ul className="list-disc list-inside text-[13.5px] text-[var(--text)] opacity-75 space-y-1 mb-3">
                <li>프로젝트 개요 (형식·플랫폼, 대상, 간단 시놉시스, 일정)</li>
                <li>사용 희망 트랙(Auralis 카탈로그)과 사용 문맥(장면/배치, 구간)</li>
                <li>권리 범위(매체, 지역, 기간, 사용 길이)</li>
                <li>예산 범위(가능 시) 및 전달물/클리어런스 요구사항</li>
              </ul>
              <p className="text-[13.5px] text-[var(--text)] opacity-65 italic mb-4">
                모든 권리는 Auralis Music / ARTRE 에 귀속되며, 서면 합의 없이 사용될 수 없습니다.
              </p>
              <div className="h-px bg-[var(--border)]/60 my-6 md:my-8"></div>
              <h3 className="auralis-section-title text-lg md:text-xl text-[var(--heading)] mb-2 mt-8 md:mt-10">
                아티스트 & 리스너
              </h3>
              <p className="text-sm text-[var(--text)] opacity-80 mb-3">
                감상자, 팬, 기타 일반 문의는 아래로 연락해 주세요.
              </p>
              <ul className="space-y-1 text-[14px] md:text-[15px]">
                <li>
                  <span className="opacity-70">아티스트:</span> 오랄리스 (Auralis)
                </li>
                <li>
                  <span className="opacity-70">이메일:</span>{' '}
                  <a
                    href="mailto:auralis.artist.official@gmail.com"
                    className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                  >
                    auralis.artist.official@gmail.com
                  </a>
                </li>
                <li>
                  <span className="opacity-70">유튜브:</span>{' '}
                  <a
                    href="https://www.youtube.com/@auralis.artist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                  >
                    @auralis.artist
                  </a>
                </li>
                <li>
                  <span className="opacity-70">인스타그램:</span>{' '}
                  <a
                    href="https://www.instagram.com/auralis.artist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-[var(--gold,#CBAE7A)]"
                  >
                    @auralis.artist
                  </a>
                </li>
              </ul>
            </div>
          )}
        </motion.section>
      </main>
    </PageContainer>
  );
}