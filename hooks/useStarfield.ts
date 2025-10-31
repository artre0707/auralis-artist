import { useEffect, useState } from 'react';
type StarState = 'on' | 'off';

export function useStarfield() {
  const getInitial = (): StarState => {
    if (typeof window === 'undefined') return 'off';
    const saved = localStorage.getItem('stars') as StarState | null;
    return saved ?? 'off';
  };
  const [stars, setStars] = useState<StarState>(getInitial);

  useEffect(() => {
    document.body.dataset.stars = stars;
    try {
      localStorage.setItem('stars', stars);
      window.dispatchEvent(new CustomEvent('stars:change', { detail: { state: stars } }));
    } catch (e) {
      console.error("Could not save starfield preference.", e);
    }
  }, [stars]);

  return { stars, setStars };
}