// Section navigation itself (click → change section, active-link highlight)
// is handled by pagination.js now that sections are paginated rather than
// scrolled. This module only owns the mobile hamburger menu — the header no
// longer needs scroll-triggered styling since it always sits above a full,
// static section.
export function initNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  function closeMobileNav() {
    mobileNav?.classList.remove('open');
    mobileNavBackdrop?.classList.remove('open');
    const icon = hamburgerBtn?.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      mobileNavBackdrop?.classList.toggle('open', isOpen);
      const icon = hamburgerBtn.querySelector('i');
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
    mobileNavBackdrop?.addEventListener('click', closeMobileNav);
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) closeMobileNav();
    });
  }
}
