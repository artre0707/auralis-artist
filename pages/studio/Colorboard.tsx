import React from 'react';
import { useSiteContext } from '../../contexts/SiteContext';

export default function Colorboard() {
    const { language } = useSiteContext();
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-serif">
                {language === 'EN' ? 'Studio Colorboard' : '스튜디오 컬러보드'}
            </h2>
            <p className="text-subtle mt-2">
                {language === 'EN' ? 'Coming soon.' : '곧 제공될 예정입니다.'}
            </p>
        </div>
    );
}