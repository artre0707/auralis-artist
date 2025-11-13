import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { albumsData, Album } from '@/data/albums';

// --- Seeding and Randomization Utilities ---

// Simple string hash function for seed generation
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getSeed = (): string => {
  try {
    const sessionSeed = sessionStorage.getItem('featured:seed');
    if (sessionSeed) return sessionSeed;

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const userAgent = navigator.userAgent || '';
    const newSeed = `${date}-${simpleHash(userAgent)}`;
    sessionStorage.setItem('featured:seed', newSeed);
    return newSeed;
  } catch {
    // Fallback if sessionStorage is not available
    return new Date().toISOString().split('T')[0];
  }
};

// LCG (Linear Congruential Generator) seeded random function
const createSeededRandom = (seedStr: string) => {
  let seed = simpleHash(seedStr);
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2**32;
    return seed / 2**32;
  };
};

// Fisher-Yates shuffle with a seeded RNG
const seededShuffle = <T,>(array: T[], rng: () => number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Album Card Component ---

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  const albumContent = album.content[language];

  return (
    <Link
      to={`/albums/${album.slug}`}
      className="group block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/50 rounded-2xl transition-all duration-300"
    >
      <div className="rounded-2xl overflow-hidden bg-card shadow-sm border border-card transition-transform w-full">
        <img
          src={album.coverUrl}
          alt={`Cover for ${album.title}`}
          className="w-full aspect-square object-cover dark:brightness-90 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const t = e.currentTarget;
            t.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
                   <defs>
                     <linearGradient id='g' x1='0' x2='1'>
                       <stop offset='0' stop-color='#111'/>
                       <stop offset='1' stop-color='#222'/>
                     </linearGradient>
                   </defs>
                   <rect width='100%' height='100%' fill='url(#g)'/>
                   <text x='50%' y='50%' fill='#777' font-size='22' text-anchor='middle' font-family='Inter, sans-serif'>image not found</text>
                 </svg>`
              );
          }}
        />
      </div>
      <div className="mt-3 sm:mt-4">
        <h3 className="font-normal text-sm sm:text-lg text-neutral-800 dark:text-neutral-200 leading-snug sm:leading-relaxed group-hover:text-[#CBAE7A] transition-colors duration-200">
          {album.title}
        </h3>
        <p className="text-[11px] sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-snug sm:leading-relaxed">
          {albumContent.subtitle}
        </p>
      </div>
    </Link>
  );
};

// --- Main Component ---

const FeaturedMixedTrio: React.FC = () => {
    const trio = useMemo(() => {
        const seed = getSeed();
        const rng = createSeededRandom(seed);
        
        const allAlbums = Object.values(albumsData);
        const released = allAlbums.filter((a) => a.status === 'released');
        const upcoming = allAlbums.filter((a) => a.status === 'upcoming');
        
        const shuffledReleased = seededShuffle(released, rng);
        const shuffledUpcoming = seededShuffle(upcoming, rng);
        
        let selected: Album[] = [];
        
        // 1. Pick up to 2 released albums
        selected.push(...shuffledReleased.slice(0, 2));

        // 2. Pick 1 upcoming album
        if (shuffledUpcoming.length > 0) {
            selected.push(shuffledUpcoming[0]);
        }
        
        // 3. Ensure there are exactly 3 albums, filling from remaining pools
        const remainingPool = [...shuffledReleased, ...shuffledUpcoming].filter(a => !selected.find(s => s.slug === a.slug));
        
        while (selected.length < 3 && remainingPool.length > 0) {
            selected.push(remainingPool.shift()!);
        }
        
        return selected.slice(0, 3);
    }, []);

    if (trio.length === 0) {
        return null;
    }

    return (
        <section className="py-12 sm:py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
                    {trio.map(album => (
                        <AlbumCard key={album.slug} album={album} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedMixedTrio;