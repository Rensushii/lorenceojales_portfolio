'use client';

import { useRef, useState } from 'react';
import { cn } from '@/app/(sections)/_lib/utils';
import { useIsMobile } from '@/app/(sections)/_hooks/useMediaQuery';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  /** 'light' uses a slightly brighter glass background, used on light-alt sections. */
  tone?: 'dark' | 'light';
  as?: 'div' | 'article';
}

/**
 * Glassmorphism card with a subtle 3D tilt-on-hover effect (desktop only).
 */
export function Card({ className, children, tone = 'dark', as = 'div' }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [style, setStyle] = useState<React.CSSProperties>({});
  const Tag = as;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`,
      transition: 'transform 0.1s ease-out',
    });
  }

  function handleMouseLeave() {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    });
  }

  return (
    <Tag
      ref={ref as never}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        'relative overflow-hidden rounded-lg border p-7 backdrop-blur-2xl transition-[border-color,box-shadow,background] duration-300',
        'shadow-card hover:shadow-card-hover',
        tone === 'dark'
          ? 'border-white/5 bg-[rgba(10,16,30,0.7)] hover:border-accent-cyan/35 hover:bg-[rgba(14,22,40,0.85)]'
          : 'border-white/[0.06] bg-white/[0.03] hover:border-accent-cyan/30 hover:bg-white/5',
        className
      )}
    >
      {children}
    </Tag>
  );
}
