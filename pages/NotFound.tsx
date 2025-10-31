import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useSiteContext } from '../contexts/SiteContext';

const NotFound: React.FC = () => {
    const { language } = useSiteContext();
    const c = {
        title: language === 'KR' ? '페이지를 찾을 수 없습니다' : 'Page Not Found',
        body: language === 'KR' ? '요청하신 페이지가 존재하지 않습니다.' : 'The page you are looking for does not exist.',
        back: language === 'KR' ? '홈으로 돌아가기' : 'Back to Home',
    };

  return (
    <PageContainer>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="auralis-hero-title text-4xl md:text-5xl font-medium tracking-tight mb-4">{c.title}</h1>
        <p className="text-subtle">{c.body}</p>
        <Link to="/" className="text-link mt-6 inline-block">{c.back}</Link>
      </div>
    </PageContainer>
  );
};

export default NotFound;
