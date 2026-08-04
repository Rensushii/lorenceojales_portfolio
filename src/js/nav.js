export function initNav() {
  const headerInner = document.getElementById('headerInner');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const allNavLinks = document.querySelectorAll('.nav-list a, .mobile-nav a');

  if (headerInner) {
    window.addEventListener('scroll', () => {
      headerInner.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

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

  // Smooth scroll with header-height offset. Uses the View Transitions API
  // when available for a subtle cross-fade, and falls back to normal
  // smooth scrolling everywhere else.
  allNavLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          const scrollToTarget = () => window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          if (document.startViewTransition) {
            document.startViewTransition(scrollToTarget);
          } else {
            scrollToTarget();
          }
        }
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) currentId = section.getAttribute('id');
    });
    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}
