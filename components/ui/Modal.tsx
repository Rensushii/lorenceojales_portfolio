'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { modalOverlay, scaleIn } from '@/app/(sections)/_lib/animations';
import { cn } from '@/app/(sections)/_lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  /** Wider layout for the resume viewer. */
  size?: 'default' | 'wide';
}

export function Modal({ isOpen, onClose, children, labelledBy, size = 'default' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lock body scroll + manage focus while open
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative max-h-[88vh] w-full overflow-y-auto rounded-lg border border-accent-cyan/25 bg-[#0a101e] p-6 text-text-primary shadow-elevated outline-none sm:p-7',
              size === 'wide' ? 'max-w-[1000px]' : 'max-w-[900px]'
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-3.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:border-accent-cyan hover:bg-white/10"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
