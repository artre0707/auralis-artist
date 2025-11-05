import React from 'react';
import { useSiteContext } from '../contexts/SiteContext';
import { albumsData } from '../data/albums';
import Btn from './Btn';
import SectionHeader from './SectionHeader';
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';

type Props = { albumSlug: string; showHeader?: boolean };

const copy = {
  EN: { title: 'Feeling Inspired?', subtitle: 'Translate your inspiration into a new musical idea with the Auralis Muse.', cta: 'Try in Studio' },
  KR: { title: '영감을 받았나요?', subtitle: '오랄리스 뮤즈와 함께 당신의 영감을 새로운 음악 아이디어로 바꿔보세요.', cta: '캔버스에서 시도하기' },
};

const InspiredCTA: React.FC<Props> = ({ albumSlug, showHeader = false }) => {
  const { language } = useSiteContext();
  const t = copy[language];
  
  const studioLink = `/studio?album=${encodeURIComponent(albumSlug)}`;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {showHeader && (
          <SectionHeader
            title={t.title}
            subtitle={t.subtitle}
            divider
            spacing="md"
          />
        )}
        <div>
          {/* FIX: Changed href to 'to' for internal navigation with the Btn component, which now uses react-router's Link. */}
          <Btn 
            to={studioLink}
            state={{ albumKey: albumSlug }}
            variant="outlineGhost" 
            arrow
          >
            {t.cta}
          </Btn>
        </div>
      </div>
    </section>
  );
};

export default InspiredCTA;