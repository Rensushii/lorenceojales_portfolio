import { isMobile, prefersReducedMotion } from './state.js';

export function initTiltAndShine() {
  if (isMobile || prefersReducedMotion) return;

  // 3D tilt
  const tiltCards = document.querySelectorAll(
    '[data-tilt-card], .card-premium:not(.achievement-card), .card-light-premium, .project-card-horizontal, .achievement-photo-card'
  );
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease';
    });
  });

  // Project card background parallax
  const projectCards = document.querySelectorAll('.project-card-horizontal[data-project-card]');
  projectCards.forEach(card => {
    const bgLayer = card.querySelector('.card-bg-layer');
    if (!bgLayer) return;
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const moveX = (x / rect.width - 0.5) * -8;
      const moveY = (y / rect.height - 0.5) * -8;
      bgLayer.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
      bgLayer.style.transition = 'transform 0.15s ease-out';
    });
    card.addEventListener('mouseleave', function () {
      bgLayer.style.transform = 'scale(1) translate(0px, 0px)';
      bgLayer.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });

  // Idle shine sweep
  const shineTargets = document.querySelectorAll(
    '.card-premium, .card-light-premium, .project-card-horizontal, .achievement-photo-card'
  );
  shineTargets.forEach(card => {
    let shineTimeout;
    const sweepEl = card.querySelector('.card-shine-sweep');
    const triggerShine = () => {
      clearTimeout(shineTimeout);
      if (sweepEl) {
        sweepEl.classList.remove('shine-active');
        void sweepEl.offsetWidth;
        sweepEl.classList.add('shine-active');
      } else {
        card.classList.remove('shine-active');
        void card.offsetWidth;
        card.classList.add('shine-active');
      }
      shineTimeout = setTimeout(() => {
        sweepEl?.classList.remove('shine-active');
        card.classList.remove('shine-active');
      }, 2600);
    };
    let idleShineInterval;
    card.addEventListener('mouseenter', () => { clearInterval(idleShineInterval); triggerShine(); });
    card.addEventListener('mouseleave', () => { idleShineInterval = setInterval(triggerShine, 6000); });
    idleShineInterval = setInterval(triggerShine, 6000);
  });
}
