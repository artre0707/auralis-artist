// components/NewsBody.tsx
import React from 'react';
import type { Language } from '../App';

type Props = { text?: string; language: Language };

function splitParagraphs(text: string) {
  // 두 줄 이상 개행 → 문단 분리
  return text.trim().split(/\n{2,}/g).map(s => s.trim()).filter(Boolean);
}

// (선택) 아주 간단한 인라인 마크업: **bold**
function inlineMarkup(s: string) {
  // 굵게
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((chunk, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(chunk);
    if (m) return <strong key={i}>{m[1]}</strong>;
    // 한 줄 개행은 <br/> 처리
    const withBr = chunk.split('\n').reduce<React.ReactNode[]>((acc, line, idx) => {
      if (idx > 0) acc.push(<br key={`br-${i}-${idx}`} />);
      acc.push(line);
      return acc;
    }, []);
    return <React.Fragment key={i}>{withBr}</React.Fragment>;
  });
}

const NewsBody: React.FC<Props> = ({ text, language }) => {
  if (!text) return null;
  const paras = splitParagraphs(text);

  return (
    <div className={`prose prose-zinc dark:prose-invert max-w-none ${
      language === 'KR' ? 'font-noto-kr' : ''
    }`}>
      {paras.map((p, idx) => (
        <p key={idx}>{inlineMarkup(p)}</p>
      ))}
    </div>
  );
};

export default NewsBody;
