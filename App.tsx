
import React, { useEffect, lazy, Suspense } from 'react';
// Keep wildcard import to prevent module resolution issues with CDN.
import * as ReactRouterDOM from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import SiteLayout from "./pages/SiteLayout";
import RouteTransition from './components/RouteTransition';

const Home = lazy(() => import("./pages/Home"));
const Albums = lazy(() => import("./pages/Albums"));
const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import('./pages/NewsArticle'));
const AlbumDetail = lazy(() => import("./pages/AlbumDetail"));
const Studio = lazy(() => import('./pages/Studio'));
const MagazineIndex = lazy(() => import('./pages/MagazineIndex'));
const MagazineArticle = lazy(() => import('./pages/MagazineArticle'));
const ElysiaIndex = lazy(() => import("./pages/elysia/ElysiaIndex"));
const ElysiaArticle = lazy(() => import("./pages/elysia/ElysiaArticle"));
const NotFound = lazy(() => import('./pages/NotFound'));


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
  // Always use HashRouter as suggested by the user's code, simplifying the router logic.
  const Router = ReactRouterDOM.HashRouter;

  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <SiteLayout>
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-subtle">Loading...</div>}>
          <AnimatedRoutes />
        </Suspense>
      </SiteLayout>
    </Router>
  );
}

export default App;
