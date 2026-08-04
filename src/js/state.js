export const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

let activeScrollLocks = 0;

export function lockBodyScroll() {
  activeScrollLocks++;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

export function unlockBodyScroll() {
  activeScrollLocks--;
  if (activeScrollLocks <= 0) {
    activeScrollLocks = 0;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal && !modal.classList.contains('active')) {
    modal.classList.add('active');
    lockBodyScroll();
    modal.scrollTop = 0;
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal && modal.classList.contains('active')) {
    modal.classList.remove('active');
    unlockBodyScroll();
  }
}

// Expose globally since section partials use inline onclick="openModal(...)"
// (kept identical to the original markup so the HTML partials don't need rewriting).
window.openModal = openModal;
window.closeModal = closeModal;
