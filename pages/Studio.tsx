// pages/Studio.tsx
import React, { useEffect, useMemo } from "react";
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
import PageContainer from "../components/PageContainer";
import PageHero from "../components/PageHero";
import { useSiteContext } from "../contexts/SiteContext";
import { albumsData } from '../data/albums';
import { albumToMuseSeed } from '../utils/albumToMuseSeed';

// Sections
import MuseSection from "./studio/Muse";
import NotebookSection from "./studio/Notebook";
import CollabSection from "./studio/Collab";
import Colorboard from "./studio/Colorboard";


// Newly added magazine storage utility
import { saveNote, ElysiaNote } from "../services/magazineStore";

type AlbumKey = keyof typeof albumsData;

function getAlbumKeySafe(k?: string | null): AlbumKey | null {
  if (!k) return null;
  return (k in albumsData ? (k as AlbumKey) : null);
}

const STUDIO_ALBUM_KEY_SS = 'studio:lastAlbumKey';

type Tab = "Muse" | "Notebook" | "Collab" | "Colorboard";
const TABS: Tab[] = ["Muse", "Notebook", "Collab", "Colorboard"];

const labels = {
  EN: {
    title: "Canvas",
    subtitle: "From inspiration to reflection — compose, share, and collaborate.",
    tabs: { Muse: "Muse", Notebook: "Notebook", Collab: "Collab", Colorboard: "Colorboard" },
    ctas: { toReaders: "Open Elysia Notes", posted: "Posted to Elysia Notes" }
  },
  KR: {
    title: "Canvas",
    subtitle: "영감에서 감상으로 — 창작하고, 나누고, 함께 이어가세요",
    tabs: { Muse: "뮤즈", Notebook: "노트북", Collab: "협업", Colorboard: "컬러보드" },
    ctas: { toReaders: "엘리시아 노트 열기", posted: "엘리시아 노트로 게시됨" }
  }
};

export default function Studio() {
  const { language, setMuseSeed } = useSiteContext();
  const L = labels[language];
  const [params, setParams] = ReactRouterDOM.useSearchParams();
  const navigate = ReactRouterDOM.useNavigate();
  const location = ReactRouterDOM.useLocation();
  const { tab: tabFromParam } = ReactRouterDOM.useParams<{ tab?: string }>();

  const tab: Tab = useMemo(() => {
    const rawTab = tabFromParam || params.get('tab') || 'Muse';
    const normalized = rawTab.charAt(0).toUpperCase() + rawTab.slice(1).toLowerCase();
    return TABS.includes(normalized as Tab) ? (normalized as Tab) : 'Muse';
  }, [tabFromParam, params]);
  
  const albumKey: AlbumKey | null = useMemo(() => {
    const fromQuery = getAlbumKeySafe(params.get('album'));
    if (fromQuery) return fromQuery;

    const fromState = getAlbumKeySafe((location.state as any)?.albumKey ?? null);
    if (fromState) return fromState;

    const fromSS = getAlbumKeySafe(sessionStorage.getItem(STUDIO_ALBUM_KEY_SS));
    return fromSS;
  }, [params, location.state]);

  useEffect(() => {
    if (albumKey) {
        const album = albumsData[albumKey];
        sessionStorage.setItem(STUDIO_ALBUM_KEY_SS, albumKey);
        setMuseSeed(albumToMuseSeed(album, language));
    } else {
        setMuseSeed(null);
    }
  }, [albumKey, setMuseSeed, language]);

  useEffect(() => {
    if (!TABS.includes(tab)) {
      setParams({ tab: 'Muse' }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Muse → Elysia direct publishing
  const handlePublish = (payload: Omit<ElysiaNote, "id"|"createdAt"|"likes"|"featured">) => {
    const id = saveNote(payload);
    // FIX: Explicitly cast `id` to a string to resolve the type error. Despite the function signature, the type is being inferred as `string | number`.
    navigate(`/elysia/${String(id)}`);
  };

  return (
    <PageContainer>
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <PageHero title={L.title} subtitle={L.subtitle} align="center" goldTitle divider="none" />

        {/* Tab Navigation */}
        <nav className="-mt-4 mb-10 flex justify-center gap-6 text-sm">
          {TABS.map((t) => (
            <ReactRouterDOM.NavLink
              key={t}
              to={t === 'Muse' ? '/studio' : `/studio/${t.toLowerCase()}`}
              end={t === 'Muse'}
              className={({ isActive }) => `pb-2 border-b-2 transition-colors ${
                isActive
                  ? "border-amber-500 text-amber-700 dark:text-amber-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {L.tabs[t as keyof typeof L.tabs]}
            </ReactRouterDOM.NavLink>
          ))}
        </nav>

        {/* Tab Content */}
        {tab === "Muse" && <MuseSection
          onSendToNotebook={(note, goToNotebook = true) => {
            try {
              const key = "auralis-notebook";
              const prev = JSON.parse(localStorage.getItem(key) || "[]");
              const withId = { id: crypto.randomUUID(), createdAt: Date.now(), ...note };
              localStorage.setItem(key, JSON.stringify([withId, ...prev]));
              if (goToNotebook) navigate('/studio/notebook');
            } catch (e) { console.error(e); }
          }}
          onPublishToReaders={handlePublish}
        />}

        {tab === "Notebook" && (
          <>
            <NotebookSection />
            <div className="mt-8 flex justify-center">
              <ReactRouterDOM.Link
                to="/elysia"
                className="rounded-full px-4 py-2 border border-[var(--border)] hover:border-amber-300/70 text-sm"
              >
                {L.ctas.toReaders}
              </ReactRouterDOM.Link>
            </div>
          </>
        )}

        {tab === "Collab" && <CollabSection />}
        {tab === "Colorboard" && <Colorboard />}
      </main>
    </PageContainer>
  );
}