import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import SiteLayout from "./pages/SiteLayout";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import About from "./pages/About";
import News from "./pages/News";
import NewsArticle from './pages/NewsArticle';
import AlbumDetail from "./pages/AlbumDetail";
import Studio from './pages/Studio';
import RouteTransition from './components/RouteTransition';
import MagazineIndex from './pages/MagazineIndex';
import MagazineArticle from './pages/MagazineArticle';
import ElysiaIndex from "./pages/elysia/ElysiaIndex";
import ElysiaArticle from "./pages/elysia/ElysiaArticle";
import NotFound from './pages/NotFound';

export type Language = 'EN' | 'KR';

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <RouteTransition key={location.pathname}>
        <Routes location={location}>
          {/* Home */}
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />

          {/* Albums (alias: Collections) */}
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:slug" element={<AlbumDetail />} />
          <Route path="/collections" element={<Albums />} />
          <Route path="/collections/:slug" element={<AlbumDetail />} />

          {/* About / News / Magazine */}
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/magazine" element={<MagazineIndex />} />
          <Route path="/magazine/:slug" element={<MagazineArticle />} />

          {/* Elysia */}
          <Route path="/elysia" element={<ElysiaIndex />} />
          <Route path="/elysia/:id" element={<ElysiaArticle />} />

          {/* Studio */}
          <Route path="/studio" element={<Studio />} />
          <Route path="/studio/:tab" element={<Studio />} />

          {/* Redirect old /canvas paths */}
          <Route path="/canvas" element={<Navigate to="/studio" replace />} />
          <Route path="/canvas/:tab" element={<Navigate to="/studio/:tab" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteTransition>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTopOnRouteChange />
      <SiteLayout>
        <AnimatedRoutes />
      </SiteLayout>
    </HashRouter>
  );
}

export default App;