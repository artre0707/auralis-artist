import React, { useState } from "react";
import PageHero from "../components/PageHero";
import MuseSection from "./studio/Muse";
import NotebookSection from "./studio/Notebook";
import CollabSection from "./studio/Collab";
import { useSiteContext } from "../contexts/SiteContext";
import PageContainer from "../components/PageContainer";

export type NotebookNote = {
  title: string;
  seed: string;
  chords: string;
  tempo: string;
  notes: string;
  createdAt: string;
};

type Tab = "Muse" | "Notebook" | "Collab";

const content = {
  EN: {
    title: "Auralis Studio",
    subtitle: "From inspiration to creation — explore, sketch, and collaborate.",
    tabs: { muse: "Muse", notebook: "Notebook", collab: "Collab" },
  },
  KR: {
    title: "Auralis 스튜디오",
    subtitle: "영감에서 창조까지 — 탐색하고, 스케치하고, 협업하세요.",
    tabs: { muse: "뮤즈", notebook: "노트북", collab: "협업" },
  },
};

export default function Studio() {
  const { language } = useSiteContext();
  const c = content[language];
  const [tab, setTab] = useState<Tab>("Muse");

  // Muse에서 만든 결과를 Notebook에 저장한 뒤 탭 전환
  const handleSendToNotebook = (note: NotebookNote, goToNotebook = true) => {
    const key = "auralis-notebook";
    try {
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([note, ...prev]));
      if (goToNotebook) setTab("Notebook");
    } catch (e) {
      console.error("Failed to save to notebook:", e);
    }
  };

  return (
    <PageContainer>
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <PageHero
          title={c.title}
          subtitle={c.subtitle}
        />

        {/* Tabs */}
        <nav className="-mt-4 mb-10 flex justify-center gap-6 text-sm">
          {(["Muse", "Notebook", "Collab"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 border-b-2 transition-colors ${
                tab === t
                  ? "border-amber-500 text-amber-700 dark:text-amber-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {c.tabs[t.toLowerCase() as keyof typeof c.tabs]}
            </button>
          ))}
        </nav>

        {/* Sections */}
        {tab === "Muse" && <MuseSection onSendToNotebook={handleSendToNotebook} onPublishToReaders={() => {}} />}
        {tab === "Notebook" && <NotebookSection />}
        {tab === "Collab" && <CollabSection />}
      </main>
    </PageContainer>
  );
}