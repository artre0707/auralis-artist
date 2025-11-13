import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export const ParallaxImage: React.FC<{ src: string; alt?: string; strength?: number; className?: string; imgClassName?: string; }> = ({
  src, alt = "", strength = 0.08, className, imgClassName
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${strength * 100}%`]); // 아래로 살짝 이동

  return (
    <div ref={ref} className={className}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className={imgClassName}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const t = e.currentTarget;
          t.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
                 <defs>
                   <linearGradient id='g' x1='0' x2='1'>
                     <stop offset='0' stop-color='#111'/>
                     <stop offset='1' stop-color='#222'/>
                   </linearGradient>
                 </defs>
                 <rect width='100%' height='100%' fill='url(#g)'/>
                 <text x='50%' y='50%' fill='#777' font-size='22' text-anchor='middle' font-family='Inter, sans-serif'>image not found</text>
               </svg>`
            );
        }}
      />
    </div>
  );
};