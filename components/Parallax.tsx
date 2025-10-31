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
      />
    </div>
  );
};
