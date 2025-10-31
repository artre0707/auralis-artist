// pages/Albums.tsx
import React from 'react';
import PageContainer from '../components/PageContainer';
import PageHero from '../components/PageHero';
import { useSiteContext } from '../contexts/SiteContext';
import DiscographyBySeries from '../components/DiscographyBySeries';

const content = {
  EN: { title: 'Collections', subtitle: 'Where quiet emotions find their form in sound.' },
  KR: { title: '작품집', subtitle: '고요한 감정들이 소리로 피어나는 곳' },
};

const Albums: React.FC = () => {
  const { language } = useSiteContext();
  const c = content[language];
  return (
    <PageContainer>
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <PageHero title={c.title} subtitle={c.subtitle} />
        <DiscographyBySeries />
      </main>
    </PageContainer>
  );
};

export default Albums;
