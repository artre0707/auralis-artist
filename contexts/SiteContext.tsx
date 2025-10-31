import React, { createContext, useContext } from 'react';
import type { Language } from '@/App';
import type { MuseSeed } from '@/types/muse';

interface SiteContextType {
  language: Language;
  toggleLanguage: () => void;
  isAnnouncementVisible: boolean;
  museSeed: MuseSeed | null;
  setMuseSeed: (seed: MuseSeed | null) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteLayout component');
  }
  return context;
};

export default SiteContext;
