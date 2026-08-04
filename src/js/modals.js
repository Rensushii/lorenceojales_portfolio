import { openModal, closeModal } from './state.js';

export function initModals() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('imageLightbox');
      if (lightbox && lightbox.classList.contains('active')) return;
      const activeModals = document.querySelectorAll('.modal-overlay.active');
      activeModals.forEach(modal => {
        const modalId = modal.getAttribute('id');
        if (modalId) closeModal(modalId);
      });
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
      closeModal(e.target.getAttribute('id'));
    }
  });

  const resumeViewBtn = document.getElementById('resumeViewBtn');
  if (resumeViewBtn) {
    resumeViewBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal('modal-resume');
    });
  }

  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}
