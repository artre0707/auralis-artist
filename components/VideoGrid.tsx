import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContext } from '../contexts/SiteContext';
import VideoModal from './VideoModal';

type VideoItem = { id: string; title: string; thumbnail: string; url: string };

interface Props {
  videos: VideoItem[];
  heading?: string;
  sub?: string;
  className?: string;
}

const VideoGrid: React.FC<Props> = ({ videos, heading, sub, className = '' }) => {
  const { language } = useSiteContext();
  const [active, setActive] = useState<VideoItem | null>(null);

  const i18n = {
    heading: heading ?? (language === 'KR' ? '비주얼 여정' : 'Visual Journey'),
    sub: sub ?? (language === 'KR' ? '영상으로 만나는 순간들' : 'Moments in Motion'),
  };

  return (
    <section className={`mx-auto max-w-6xl px-6 py-12 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="font-serif text-[26px] sm:text-[32px] tracking-tight">{i18n.heading}</h3>
        <p className="mt-2 text-sm italic text-neutral-600 dark:text-neutral-300">{i18n.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <motion.div
            key={v.id}
            whileHover={{ scale: 1.02 }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-card bg-card shadow-sm"
            onClick={() => setActive(v)}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100">{v.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && <VideoModal video={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default VideoGrid;
