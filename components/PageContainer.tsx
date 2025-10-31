import React from 'react';
import { useSiteContext } from '../contexts/SiteContext';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
    const { isAnnouncementVisible } = useSiteContext();

    return (
        <div className={`pt-16 ${className || ''}`}>
            {isAnnouncementVisible && <div className="h-10 md:h-12"></div>}
            {children}
        </div>
    )
}

export default PageContainer;