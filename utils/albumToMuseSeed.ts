import { Album } from '../data/albums';
import { MuseSeed } from '../types/muse';
import type { Language } from '../App';

export function albumToMuseSeed(a: Album, lang: Language): MuseSeed {
  const content = a.content[lang];
  return {
    title: a.title,
    prompt: content.feelingInspiredText || content.description.join(' ') || '',
    meta: {
      albumKey: a.slug,
      series: a.seriesInfo?.name[lang],
      catalogueNo: a.catalogueNo,
      releaseDate: a.details.releaseDate,
      cover: a.coverUrl,
      links: {
        spotify: a.links?.spotify || undefined,
        apple: a.links?.appleMusic || undefined,
        youtube: a.links?.youtube || undefined,
      },
    },
  };
}
