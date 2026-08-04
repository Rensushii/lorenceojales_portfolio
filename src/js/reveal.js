import { isMobile, prefersReducedMotion } from './state.js';

export function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!isMobile && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  if (isMobile) {
    document.querySelectorAll('.stagger-container[data-stagger]').forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('.timeline-modern[data-timeline-animate]').forEach(el => el.classList.add('timeline-animated'));
    return;
  }

  const staggerContainers = document.querySelectorAll('.stagger-container[data-stagger]');
  if (staggerContainers.length > 0) {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    staggerContainers.forEach(el => staggerObserver.observe(el));
    setTimeout(() => {
      staggerContainers.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('revealed');
      });
    }, 200);
  }

  const timelines = document.querySelectorAll('[data-timeline-animate]');
  if (timelines.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-animated');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    timelines.forEach(el => timelineObserver.observe(el));
  }
}
