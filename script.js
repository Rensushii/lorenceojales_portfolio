document.addEventListener('DOMContentLoaded', () => {
  // Sticky header scroll effect
  const headerInner = document.querySelector('.header-inner');
  if (headerInner) {
    window.addEventListener('scroll', () => {
      headerInner.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.querySelector('i').className = mobileNav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.querySelector('i').className = 'fas fa-bars';
      });
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.querySelector('i').className = 'fas fa-bars';
      }
    });
  }

  // Active nav link detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .mobile-nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  // Footer year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});