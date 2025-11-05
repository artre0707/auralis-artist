import React, { useEffect } from 'react';
// FIX: Changed import to wildcard to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
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
  const { pathname } = ReactRouterDOM.useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

const AnimatedRoutes = () => {
  const location = ReactRouterDOM.useLocation();
  return (
    <AnimatePresence mode="wait">
      <RouteTransition key={location.pathname}>
        <ReactRouterDOM.Routes location={location}>
          {/* Home */}
          <ReactRouterDOM.Route index element={<Home />} />
          <ReactRouterDOM.Route path="/" element={<Home />} />

          {/* Albums (alias: Collections) */}
          <ReactRouterDOM.Route path="/albums" element={<Albums />} />
          <ReactRouterDOM.Route path="/albums/:slug" element={<AlbumDetail />} />
          <ReactRouterDOM.Route path="/collections" element={<Albums />} />
          <ReactRouterDOM.Route path="/collections/:slug" element={<AlbumDetail />} />

          {/* About / News / Magazine */}
          <ReactRouterDOM.Route path="/about" element={<About />} />
          <ReactRouterDOM.Route path="/news" element={<News />} />
          <ReactRouterDOM.Route path="/news/:slug" element={<NewsArticle />} />
          <ReactRouterDOM.Route path="/magazine" element={<MagazineIndex />} />
          <ReactRouterDOM.Route path="/magazine/:slug" element={<MagazineArticle />} />

          {/* Elysia */}
          <ReactRouterDOM.Route path="/elysia" element={<ElysiaIndex />} />
          <ReactRouterDOM.Route path="/elysia/:id" element={<ElysiaArticle />} />

          {/* Studio */}
          <ReactRouterDOM.Route path="/studio" element={<Studio />} />
          <ReactRouterDOM.Route path="/studio/:tab" element={<Studio />} />

          {/* Redirect old /canvas paths */}
          <ReactRouterDOM.Route path="/canvas" element={<ReactRouterDOM.Navigate to="/studio" replace />} />
          <ReactRouterDOM.Route path="/canvas/:tab" element={<ReactRouterDOM.Navigate to="/studio/:tab" replace />} />

          {/* 404 */}
          <ReactRouterDOM.Route path="*" element={<NotFound />} />
        </ReactRouterDOM.Routes>
      </RouteTransition>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ReactRouterDOM.HashRouter>
      <ScrollToTopOnRouteChange />
      <SiteLayout>
        <AnimatedRoutes />
      </SiteLayout>
    </ReactRouterDOM.HashRouter>
  );
}

export default App;