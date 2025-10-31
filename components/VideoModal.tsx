import React from 'react';
import { motion } from 'framer-motion';

function toEmbedSrc(input: string) {
  try {
    const url = new URL(input);
    const id = url.searchParams.get('v') || url.pathname.replace('/', '');
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
  } catch {
    return `https://www.youtube-nocookie.com/embed/${input}?autoplay=1`;
  }
}

const VideoModal: React.FC<{ video: { title: string; url: string }; onClose: () => void }> = ({
  video,
  onClose,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-[90%] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-lg bg-black"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={toEmbedSrc(video.url)}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label="Close video"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
};

export default VideoModal;
