export type MuseSeed = {
  title: string;
  prompt: string;
  meta?: {
    albumKey?: string;
    series?: string;
    catalogueNo?: string;
    releaseDate?: string;
    cover?: string;
    links?: { spotify?: string; apple?: string; youtube?: string };
    note?: string;
  };
};
