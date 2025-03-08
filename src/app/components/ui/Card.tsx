'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
};

export default function Card({ 
  children, 
  className = '', 
  animate = true,
  delay = 0
}: CardProps) {
  return (
    <motion.div
      className={`bg-card p-6 rounded-xl ${className}`}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={animate ? { once: true } : undefined}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
} 