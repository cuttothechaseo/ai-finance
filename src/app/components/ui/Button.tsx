'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
};

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
}: ButtonProps) {
  const baseClasses = variant === 'primary' 
    ? 'primary-button' 
    : 'secondary-button';
  
  return (
    <motion.button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: variant === 'primary' 
          ? "0 0 15px rgba(168, 85, 247, 0.5)" 
          : "0 0 10px rgba(255, 255, 255, 0.2)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
} 