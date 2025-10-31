import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSiteContext } from '../contexts/SiteContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Studio() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useSiteContext();

  const tab = (params.get('tab') ?? 'muse').toLowerCase();
  const from = (params.get('from') ?? '').toLowerCase();

  const prefill = useMemo(() => {
    const slug = params.get('slug') || params.get('albumSlug') || '';
    const title = params.get('title') || params.get('albumTitle') || '';
    const catalogue = params.get('catalogue') || params.get('catalogueNo') || '';
    const cover = params.get('cover') || params.get('coverUrl') || '';
    return { slug, title, catalogue, cover };
  }, [params]);

  const backHref = params.get('returnTo') || (prefill.slug ? `/albums/${prefill.slug}` : '/albums');

  const labels = {
    EN: { back: 'Back to album', prefilled: 'Prefilled from album' },
    KR: { back: '앨범으로 돌아가기', prefilled: '앨범 정보가 자동으로 채워졌습니다' },
  } as const;
  const t = labels[language];

  const cameFromAlbum =
    (params.get('from') || '').toLowerCase() === 'album' ||
    !!params.get('returnTo') ||
    !!(params.get('slug') || params.get('albumSlug')) ||
    !!(params.get('title') || params.get('albumTitle')) ||
    !!(params.get('catalogue') || params.get('catalogueNo')) ||
    !!(params.get('cover') || params.get('coverUrl'));

  const [museTitle, setMuseTitle] = useState('');
  const [museNotes, setMuseNotes] = useState('');
  const [museCover, setMuseCover] = useState<string>('');

  const didPrefill = useRef(false);
  useEffect(() => {
    if (didPrefill.current) return;
    if (tab === 'muse' && from === 'album') {
      if (prefill.title) setMuseTitle(prefill.title);
      if (prefill.catalogue) setMuseNotes(prev => prev || `Catalogue: ${prefill.catalogue}`);
      if (prefill.cover) setMuseCover(prefill.cover);
    }
    didPrefill.current = true;
  }, [tab, from, prefill]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [showBar, setShowBar] = useState(true);
  const lastY = useRef<number>(0);
  useEffect(() => {
    lastY.current = window.scrollY || 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y < 80) setShowBar(true);
      else if (y > lastY.current + 4) setShowBar(false);
      else if (y < lastY.current - 4) setShowBar(true);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [leaving, setLeaving] = useState(false);
  const onBackClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => navigate(backHref), 220);
  };

  return (
    <>
      {cameFromAlbum && (
        <div
          className={[
            'sticky top-0 z-30 border-b border-card',
            'bg-[rgb(18,18,22)/0.8] dark:bg-[rgb(10,10,12)/0.8]',
            'backdrop-blur supports-[backdrop-filter]:backdrop-blur-md',
            'transition-transform duration-300',
            showBar ? 'translate-y-0' : '-translate-y-full',
          ].join(' ')}
        >
          <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
            <span className="text-subtle">{t.prefilled}</span>
            <Link
              to={backHref}
              onClick={onBackClick}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 ring-1 ring-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              ← {t.back}
            </Link>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!leaving && (
          <motion.main
            key="studio-page"
            className="max-w-5xl mx-auto px-6 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {tab === 'muse' && (
              <>
                {cameFromAlbum && (prefill.title || prefill.catalogue || prefill.cover || prefill.slug) && (
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-card bg-card p-3 text-sm">
                    {prefill.cover && (
                      <img src={prefill.cover} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        Prefilled from album:{' '}
                        <span className="text-[var(--accent)]">{prefill.title || prefill.slug}</span>
                      </p>
                      {prefill.catalogue && <p className="text-subtle">Catalogue: {prefill.catalogue}</p>}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-subtle">Idea Title</span>
                    <input
                      value={museTitle}
                      onChange={(e) => setMuseTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-card bg-card px-3 py-2"
                      placeholder="Title your idea"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-subtle">Notes</span>
                    <textarea
                      value={museNotes}
                      onChange={(e) => setMuseNotes(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-card bg-card px-3 py-2"
                      rows={4}
                      placeholder="Describe the mood, tempo, instruments..."
                    />
                  </label>

                  {museCover && (
                    <div className="flex items-center gap-3">
                      <img src={museCover} alt="" className="h-14 w-14 rounded object-cover" />
                      <span className="text-xs text-subtle">Cover preview (from album)</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === 'notebook' && (
              <div className="text-sm text-subtle">
                Start free. This notebook opens blank by design.
              </div>
            )}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
