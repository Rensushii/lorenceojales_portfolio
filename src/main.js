import './styles/main.css';

import loadingHtml from './sections/loading.html?raw';
import navHtml from './sections/nav.html?raw';
import heroHtml from './sections/hero.html?raw';
import aboutHtml from './sections/about.html?raw';
import experienceHtml from './sections/experience.html?raw';
import projectsHtml from './sections/projects.html?raw';
import achievementsHtml from './sections/achievements.html?raw';
import skillsHtml from './sections/skills.html?raw';
import certificationsHtml from './sections/certifications.html?raw';
import contactHtml from './sections/contact.html?raw'; // includes the merged .section-footer
import projectModalsHtml from './sections/project-modals.html?raw';
import miscModalsHtml from './sections/misc-modals.html?raw';

import { initLoadingScreen } from './js/loading.js';
import { initNav } from './js/nav.js';
import { initPagination } from './js/pagination.js';
import { initSpotlight, initMagnetic } from './js/spotlight.js';
import { initTypewriter } from './js/typewriter.js';
import { initReveal } from './js/reveal.js';
import { initTiltAndShine } from './js/tilt.js';
import { initLightbox } from './js/lightbox.js';
import { initCertifications } from './js/certifications.js';
import { initAchievements } from './js/achievements.js';
import { initModals } from './js/modals.js';
import { initContactForm } from './js/contactForm.js';
import { initLightRays } from './js/lightRays.js';
import { initFluidHero } from './js/fluidHero.js';
import './js/state.js'; // registers window.openModal / window.closeModal used by inline onclick handlers

// ---- 1. Compose the page from partials ----
// #pageOuter holds every top-level section stacked at inset:0; pagination.js
// toggles which one has .active — see src/styles/pagination.css.
const app = document.getElementById('app');
app.innerHTML =
  loadingHtml +
  navHtml +
  `<main id="pageOuter">${heroHtml}${aboutHtml}${experienceHtml}${projectsHtml}${achievementsHtml}${skillsHtml}${certificationsHtml}${contactHtml}</main>` +
  projectModalsHtml +
  miscModalsHtml;

// ---- 2. Loading screen must start immediately ----
initLoadingScreen();

// ---- 3. Load third-party scripts (Three.js for hero effects, EmailJS for contact form) ----
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function loadThirdPartyScripts() {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
  } catch (e) { console.warn('Three.js failed to load — hero visual effects disabled.', e); }
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js');
  } catch (e) { console.warn('EmailJS failed to load — contact form will not send.', e); }
}

// ---- 4. Initialize every feature ----
function initAll() {
  initNav();
  initPagination(); // activates the "home" section and wires up all in-page nav links
  initSpotlight();
  initMagnetic();
  initTypewriter();
  initReveal();
  initTiltAndShine();
  initLightbox();
  initCertifications();
  initAchievements();
  initModals();
  initContactForm();
  try { initLightRays(); } catch (e) { console.error('Light rays init failed:', e); }
  try { initFluidHero(); } catch (e) { console.error('Fluid hero init failed:', e); }

  // If Three.js never loaded (offline / blocked CDN), don't leave the
  // loading screen up forever — the window 'load' fallback in loading.js
  // already covers this, but this gives a faster explicit signal too.
  if (!window.THREE) window.hideLoadingScreen?.();
}

loadThirdPartyScripts().then(initAll);
