import { create } from 'zustand';
import type { CertificationCategory } from '@/app/(sections)/_types';

interface LightboxState {
  images: string[];
  index: number;
}

interface UIState {
  // Project / achievement / resume modal
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // Gallery lightbox
  lightbox: LightboxState | null;
  openLightbox: (images: string[], index: number) => void;
  closeLightbox: () => void;
  nextLightboxImage: () => void;
  prevLightboxImage: () => void;

  // Certifications filter
  certFilter: CertificationCategory | 'all';
  setCertFilter: (filter: CertificationCategory | 'all') => void;

  // Mobile nav
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  lightbox: null,
  openLightbox: (images, index) => set({ lightbox: { images, index } }),
  closeLightbox: () => set({ lightbox: null }),
  nextLightboxImage: () => {
    const lb = get().lightbox;
    if (!lb) return;
    set({ lightbox: { ...lb, index: (lb.index + 1) % lb.images.length } });
  },
  prevLightboxImage: () => {
    const lb = get().lightbox;
    if (!lb) return;
    set({
      lightbox: {
        ...lb,
        index: (lb.index - 1 + lb.images.length) % lb.images.length,
      },
    });
  },

  certFilter: 'all',
  setCertFilter: (filter) => set({ certFilter: filter }),

  mobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));
