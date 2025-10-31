import React from 'react';
import HeroSection from '../components/HeroSection';
import NewsSection from '../components/NewsSection';
import AboutSection from '../components/AboutSection';
import DiscographySection from '../components/DiscographySection';
import MediaSection from '../components/MediaSection';
import ConnectSection from '../components/ConnectSection';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <NewsSection showTitle={false} />
      <DiscographySection />
      <MediaSection />
      <AboutSection />
      <ConnectSection />
    </>
  );
};

export default Home;