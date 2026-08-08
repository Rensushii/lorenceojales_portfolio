'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export function Lightbox() {
  const lightbox = useUIStore((s) => s.lightbox);
  const closeLightbox = useUIStore((s) => s.closeLightbox);
  const nextImage = useUIStore((s) => s.nextLightboxImage);
  const prevImage = useUIStore((s) => s.prevLightboxImage);

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightbox, closeLightbox, prevImage, nextImage]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {lightbox && (
        <motion.div
          className="fixed inset-0 z-[3000] flex cursor-zoom-out items-center justify-center bg-black/92 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <button
            aria-label="Close lightbox"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-accent-cyan hover:bg-white/[0.14]"
          >
            <X size={18} />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent-cyan hover:bg-accent-cyan/15"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent-cyan hover:bg-accent-cyan/15"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <motion.div
            key={lightbox.index}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative h-[80vh] w-[92vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.images[lightbox.index]}
              alt={`Gallery image ${lightbox.index + 1}`}
              fill
              sizes="92vw"
              className="rounded-xl border border-accent-cyan/30 object-contain shadow-elevated"
            />
          </motion.div>

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.08] bg-black/50 px-3.5 py-1.5 font-mono text-xs text-text-secondary">
            {lightbox.index + 1} / {lightbox.images.length}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
