'use client';

import { RefObject, useEffect, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  /** Normalized 0-1 position relative to the tracked element. */
  nx: number;
  ny: number;
}

/**
 * Tracks mouse position, either globally or relative to a given element ref.
 * Used for 3D tilt effects and parallax backgrounds.
 */
export function useMousePosition(ref?: RefObject<HTMLElement>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    nx: 0.5,
    ny: 0.5,
  });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({
          x,
          y,
          nx: rect.width ? x / rect.width : 0.5,
          ny: rect.height ? y / rect.height : 0.5,
        });
      } else {
        setPosition({
          x: e.clientX,
          y: e.clientY,
          nx: window.innerWidth ? e.clientX / window.innerWidth : 0.5,
          ny: window.innerHeight ? e.clientY / window.innerHeight : 0.5,
        });
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [ref]);

  return position;
}
