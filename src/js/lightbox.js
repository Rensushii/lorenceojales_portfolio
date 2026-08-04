import { lockBodyScroll, unlockBodyScroll } from './state.js';

export function initLightbox() {
  let currentLightboxImages = [];
  let currentLightboxIndex = 0;
  const lightboxEl = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  if (!lightboxEl) return;

  function openLightbox(imagesArray, startIndex) {
    if (!imagesArray || imagesArray.length === 0) return;
    currentLightboxImages = imagesArray;
    currentLightboxIndex = Math.min(startIndex, imagesArray.length - 1);
    updateLightboxImage();
    lightboxEl.classList.add('active');
    lockBodyScroll();
  }

  function updateLightboxImage() {
    if (currentLightboxImages.length === 0) return;
    lightboxImg.src = currentLightboxImages[currentLightboxIndex];
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
    lightboxPrev.style.display = currentLightboxImages.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = currentLightboxImages.length > 1 ? 'flex' : 'none';
  }

  function closeLightbox() {
    lightboxEl.classList.remove('active');
    unlockBodyScroll();
    currentLightboxImages = [];
  }

  function navigateLightbox(delta) {
    if (currentLightboxImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + delta + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxImage();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));
  lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightboxEl.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Gallery click delegation — works for certification grid + project galleries,
  // including ones rendered dynamically later (certifications).
  document.addEventListener('click', function (e) {
    const img = e.target.closest('.cert-img, .project-gallery img');
    if (!img) return;
    if (img.classList.contains('cert-img')) {
      const allVisibleImages = Array.from(document.querySelectorAll('.cert-img')).map(i => i.src);
      const idx = allVisibleImages.indexOf(img.src);
      if (idx !== -1) openLightbox(allVisibleImages, idx);
      return;
    }
    const container = img.closest('.project-gallery');
    if (!container) return;
    const allImages = Array.from(container.querySelectorAll('img'));
    const allUrls = allImages.map(i => i.src);
    const idx = allUrls.indexOf(img.src);
    if (idx !== -1) openLightbox(allUrls, idx);
  });
}
