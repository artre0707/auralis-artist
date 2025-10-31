import { motion, Variants } from "framer-motion";
import React from "react";

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const FadeIn: React.FC<React.PropsWithChildren<{ delay?: number; className?: string }>> = ({ children, delay=0, className }) => (
  <motion.div
    className={className}
    variants={rise}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);
