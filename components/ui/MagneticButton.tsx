'use client';

import { useRef, useState } from 'react';
import { useIsMobile } from '@/app/(sections)/_hooks/useMediaQuery';

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
}

/**
 * Wraps a button/link so it gently follows the cursor on hover.
 * Disabled on mobile and touch devices.
 */
export function MagneticButton({ children, strength = 0.18 }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isMobile = useIsMobile();
  const [transform, setTransform] = useState('translate(0px, 0px)');

  function handleMouseMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform(`translate(${x * strength}px, ${y * strength}px)`);
  }

  function handleMouseLeave() {
    setTransform('translate(0px, 0px)');
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', transform, transition: 'transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94)' }}
    >
      {children}
    </span>
  );
}
