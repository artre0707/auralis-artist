import React from 'react';
import clsx from 'clsx';
import { useSiteContext } from '@/contexts/SiteContext';

type Props = {
  en?: string;
  kr?: string;
};

export default function ReleaseCaption({ en, kr }: Props) {
  const { language } = useSiteContext();

  const text = language === 'KR' ? kr : en;
  if (!text) return null;

  return (
    <p
      className={clsx(
        'release-caption text-sm italic mt-1',
        'text-neutral-500 dark:text-neutral-400 opacity-80'
      )}
      style={{
        fontSize: '0.85em',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
      }}
    >
      {text}
    </p>
  );
}
