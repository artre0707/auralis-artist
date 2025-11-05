import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSiteContext } from '../contexts/SiteContext';
import { motion, AnimatePresence } from 'framer-motion';
import { saveNote } from '../services/magazineStore';

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
    EN: {
      back: 'Back to album',
      prefilled: 'Prefilled from album',
      ideaTitle: 'Idea Title',
      notes: 'Notes',
      coverPreview: 'Cover preview (from album)',
      save: 'Save & Open',
      saving: 'Saving…',
      emptyTitle: 'Please enter a title.',
      translate: 'Translate',
      en2ko: 'EN → KR',
      ko2en: 'KR → EN',
      translating: 'Translating…',
      result: 'Translation Result',
    },
    KR: {
      back: '앨범으로 돌아가기',
      prefilled: '앨범 정보가 자동으로 채워졌습니다',
      ideaTitle: '아이디어 제목',
      notes: '노트',
      coverPreview: '커버 미리보기 (앨범에서 가져옴)',
      save: '저장하고 열기',
      saving: '저장 중…',
      emptyTitle: '제목을 입력해 주세요.',
      translate: '번역',
      en2ko: '영 → 한',
      ko2en: '한 → 영',
      translating: '번역 중…',
      result: '번역 결과',
    },
  } as const;
  const t = labels[(language as 'EN' | 'KR') || 'EN'];

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
  const [saving, setSaving] = useState(false);

  // ✅ 번역 위젯 상태
  const [trLoading, setTrLoading] = useState(false);
  const [trText, setTrText] = useState(''); // 번역 결과

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

  // ✅ 저장 핸들러
  async function handleSave() {
    if (!museTitle.trim()) {
      alert(t.emptyTitle);
      return;
    }
    try {
      setSaving(true);
      // FIX: The saveNote function correctly returns a string, so the explicit String() cast is redundant and can cause type errors in some environments.
      const id = saveNote({
          title: museTitle,
          body: museNotes,
          cover: museCover || undefined,
          albumSlug: prefill.slug || undefined,
          catalogue: prefill.catalogue || undefined,
        });
      navigate(`/elysia/${id}`);
    } finally {
      setSaving(false);
    }
  }

  // ✅ 번역 호출 (양방향 지원)
  async function callTranslate(dir: 'en2ko' | 'ko2en') {
    const text = museNotes?.trim() || museTitle?.trim() || '';
    if (!text) {
      alert(language === 'KR' ? '번역할 텍스트가 없습니다.' : 'Nothing to translate.');
      return;
    }
    const source = dir === 'en2ko' ? 'en' : 'ko';
    const target = dir === 'en2ko' ? 'ko' : 'en';

    setTrLoading(true);
    setTrText('');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          source,
          target,
          formal: target === 'ko' ? 'formal' : 'formal',
        }),
      });

      const raw = await res.text();
      if (!res.ok) {
        alert(`API ${res.status}\n${raw.slice(0, 400)}`);
        return;
        }
      const data = JSON.parse(raw);
      const out = String(data?.text || '');
      setTrText(out);
    } catch (e: any) {
      alert(`요청 실패: ${e?.message || e}`);
    } finally {
      setTrLoading(false);
    }
  }

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
                    <span className="text-sm text-subtle">{t.ideaTitle}</span>
                    <input
                      value={museTitle}
                      onChange={(e) => setMuseTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-card bg-card px-3 py-2"
                      placeholder="Title your idea"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-subtle">{t.notes}</span>
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
                      <span className="text-xs text-subtle">{t.coverPreview}</span>
                    </div>
                  )}
                </div>

                {/* ✅ 번역 위젯 */}
                <div className="mt-6 rounded-xl border border-card bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">{t.translate}</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => callTranslate('en2ko')}
                        disabled={trLoading}
                        className="rounded-lg px-3 py-1 ring-1 ring-[var(--accent)]/50 hover:bg-[var(--accent)]/10 disabled:opacity-60"
                      >
                        {trLoading ? t.translating : t.en2ko}
                      </button>
                      <button
                        type="button"
                        onClick={() => callTranslate('ko2en')}
                        disabled={trLoading}
                        className="rounded-lg px-3 py-1 ring-1 ring-[var(--accent)]/50 hover:bg-[var(--accent)]/10 disabled:opacity-60"
                      >
                        {trLoading ? t.translating : t.ko2en}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-subtle">
                    * {language === 'KR'
                      ? '노트 또는 제목에 있는 텍스트를 자동으로 번역합니다.'
                      : 'Automatically translates from your Notes or Title.'}
                  </div>

                  {trText && (
                    <div className="mt-3 rounded-lg bg-background/60 p-3 text-sm whitespace-pre-wrap">
                      <div className="mb-1 font-medium">{t.result}</div>
                      {trText}
                    </div>
                  )}
                </div>

                {/* ✅ 저장 버튼 */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2
                               bg-[var(--accent)] text-black hover:opacity-90
                               disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {saving ? t.saving : t.save}
                  </button>
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
