import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Smooth-scrolls to a section id, accounting for the fixed header height. */
export function scrollToSection(id: string, headerOffset = 80) {
  const target = document.querySelector(id);
  if (!target) return;
  const top =
    target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}
