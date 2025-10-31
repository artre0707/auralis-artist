import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import Starfield from '../components/Starfield';
import SiteContext from '../contexts/SiteContext';
import ContactSection from '../components/ContactSection';
import type { Language } from '../App';
import type { MuseSeed } from '../types/muse';
import { migrateElysiaMeta } from '../utils/migrateElysiaMeta';

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnouncementVisible, setAnnouncementVisible] = useState(false);
  const [museSeed, setMuseSeed] = useState<MuseSeed | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    try {
      if (localStorage.getItem('auralis_announce_closed') !== 'true') {
        setAnnouncementVisible(true);
      }
    } catch (e) {
      setAnnouncementVisible(true);
    }

    // Run Elysia migration once
    const migrationResult = migrateElysiaMeta();
    console.log("Elysia meta migration result:", migrationResult);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'KR' ? 'ko' : 'en';
    document.body.dataset.lang = language;
  }, [language]);
  
  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'EN' ? 'KR' : 'EN'));
  };
  
  const handleAnnouncementClose = () => {
    try {
      localStorage.setItem('auralis_announce_closed', 'true');
    } catch (e) {
      console.error("Could not write to localStorage", e);
    }
    setAnnouncementVisible(false);
  };

  return (
    <SiteContext.Provider value={{ language, toggleLanguage: handleLanguageToggle, isAnnouncementVisible, museSeed, setMuseSeed }}>
      <Starfield />
      <div className="min-h-screen flex flex-col">
        <Header 
          isScrolled={isScrolled}
        />
        <AnnouncementBar isVisible={isAnnouncementVisible} onClose={handleAnnouncementClose} />
        <main id="auralis-main" className="flex-grow">
          {children}
        </main>
        <ContactSection />
      </div>
    </SiteContext.Provider>
  );
};

export default SiteLayout;