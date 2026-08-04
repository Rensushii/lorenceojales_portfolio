// Sections are shown/hidden by pagination.js rather than scrolled past, so
// entrance animations now replay each time a section becomes active instead
// of firing once on scroll-into-view.

export function initReveal() {
  // Nothing to wire up on load — see revealSection(), called by
  // pagination.js whenever a section is activated.
}

export function revealSection(sectionEl) {
  if (!sectionEl) return;
  const revealEls = sectionEl.querySelectorAll('.reveal');
  const staggerContainers = sectionEl.querySelectorAll('.stagger-container[data-stagger]');
  const timelines = sectionEl.querySelectorAll('[data-timeline-animate]');

  revealEls.forEach(el => el.classList.remove('revealed'));
  staggerContainers.forEach(el => el.classList.remove('revealed'));
  timelines.forEach(el => el.classList.remove('timeline-animated'));

  // Double rAF so the class removal above actually paints before the
  // classes are re-added — otherwise the browser coalesces both changes
  // and the transition never plays.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      revealEls.forEach(el => el.classList.add('revealed'));
      staggerContainers.forEach(el => el.classList.add('revealed'));
      timelines.forEach(el => el.classList.add('timeline-animated'));
    });
  });
}
