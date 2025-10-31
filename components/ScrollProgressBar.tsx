import React, { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const val = max > 0 ? (window.scrollY / max) * 100 : 0;
      setP(val);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-[70] h-[2px] bg-[var(--accent)] transition-[width] duration-75"
         style={{ width: `${p}%` }} />
  );
}
