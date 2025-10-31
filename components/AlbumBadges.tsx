// FIX: The original content of this file was incorrect, defining and exporting
// the NewsSection component instead of AlbumBadges. This caused a prop type
// error where AlbumBadges was used. The content has been replaced with the
// correct AlbumBadges component implementation.
import React from 'react';

interface AlbumBadgesProps {
  tags: string[] | null;
}

const AlbumBadges: React.FC<AlbumBadgesProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default AlbumBadges;
