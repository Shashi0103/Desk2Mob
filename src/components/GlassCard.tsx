import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      backdrop-blur-lg bg-white/10 
      border border-white/20 
      rounded-2xl shadow-xl 
      p-8 
      transition-all duration-300 
      hover:bg-white/15 
      hover:border-white/30
      ${className}
    `}>
      {children}
    </div>
  );
};