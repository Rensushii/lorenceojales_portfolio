import { revealSection } from './reveal.js';

const VALID_SECTION_IDS = [
  'home', 'about', 'experience', 'projects',
  'achievements', 'skills', 'certifications', 'contact'
];

let currentSectionId = null;

function setActiveNavLinks(id) {
  document.querySelectorAll('.nav-list a, .mobile-nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
  });
}

function goToSection(id, { skipTransition = false } = {}) {
  if (!VALID_SECTION_IDS.includes(id)) return;
  const targetEl = document.getElementById(id);
  if (!targetEl || id === currentSectionId) return;

  const sections = document.querySelectorAll('#pageOuter > section[id]');
  const applyChange = () => {
    sections.forEach(sec => sec.classList.toggle('active', sec.id === id));
    targetEl.scrollTop = 0;
    setActiveNavLinks(id);
    currentSectionId = id;
    history.replaceState(null, '', '#' + id);
    revealSection(targetEl);
  };

  if (!skipTransition && document.startViewTransition) {
    document.startViewTransition(applyChange);
  } else {
    applyChange();
  }
}

export function initPagination() {
  // Any in-page anchor link (nav bar, mobile menu, hero "View Projects" CTA,
  // logo, etc.) drives section changes — the only way to move between
  // sections. Links with a bare "#" (the resume button) are left alone so
  // their own click handler (opening the resume modal) still runs.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.length < 2) return; // ignore bare "#"
    const id = href.slice(1);
    if (!VALID_SECTION_IDS.includes(id)) return;
    e.preventDefault();
    goToSection(id);
  });

  const initialId = (location.hash || '#home').slice(1);
  goToSection(VALID_SECTION_IDS.includes(initialId) ? initialId : 'home', { skipTransition: true });
}
