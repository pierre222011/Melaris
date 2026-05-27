import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'none';
}

export default function GlassCard({ children, className = '', glowColor = 'none' }: GlassCardProps) {
  let glowClasses = '';
  
  if (glowColor === 'blue') {
    glowClasses = 'hover:border-[#4F8EF7]/50 hover:shadow-[0_0_30px_rgba(79,142,247,0.15)]';
  } else if (glowColor === 'purple') {
    glowClasses = 'hover:border-[#9333EA]/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.15)]';
  }

  return (
    <div className={`glass rounded-2xl p-6 transition-all duration-300 ${glowClasses} ${className}`}>
      {children}
    </div>
  );
}
