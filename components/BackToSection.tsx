import React from "react";
import { Link } from "react-router-dom";
import Btn from "../components/Btn";
import { useSiteContext } from '../contexts/SiteContext';

type SectionType = "news" | "magazine" | "albums";

interface BackToSectionProps {
  type?: SectionType;
  className?: string;
  align?: "center" | "left";
}

// FIX: Removed hardcoded arrows from labels; they are now handled by the Btn component.
const LABELS = {
  EN: {
    news: "Back to News",
    magazine: "Back to Magazine",
    albums: "Back to Albums",
  },
  KR: {
    news: "뉴스로 돌아가기",
    magazine: "매거진으로 돌아가기",
    albums: "앨범으로 돌아가기",
  },
};

const PATHS: Record<SectionType, string> = {
  news: "/news",
  magazine: "/magazine",
  albums: "/albums",
};

const BackToSection: React.FC<BackToSectionProps> = ({
  type = "news",
  className = "",
  align = "center",
}) => {
  const { language } = useSiteContext();
  const label = language === 'KR' ? LABELS.KR[type] : LABELS.EN[type];
  const to = PATHS[type];

  return (
    <div className={`mt-10 md:mt-12 mb-8 ${className}`}>
      {/* 골드 라인 */}
      <div className="h-px w-40 mx-auto bg-[#CBAE7A] opacity-90 mb-8" />

      {/* 버튼 */}
      <div className={align === "center" ? "text-center" : ""}>
        <Link to={to} aria-label={label}>
          <Btn
            variant="outlineGhost"
            arrow
            className="translate-y-1 transition-transform duration-300 hover:-translate-y-0.5"
          >
            {label}
          </Btn>
        </Link>
      </div>
    </div>
  );
};

export default BackToSection;