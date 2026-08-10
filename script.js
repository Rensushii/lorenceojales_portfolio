/* ============================================================
   LORENCE B. OJALES — PORTFOLIO SCRIPT
   Modular, theme-aware, performance-tuned version.
   ============================================================ */

// ============================================================
//  DEVICE / CAPABILITY DETECTION
// ============================================================
const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Rough "low power" heuristic: small viewport + touch + (optionally) low core count.
const isLowPower = isMobile && (navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : true);
let webglSupported = true;
try {
    const testCanvas = document.createElement('canvas');
    webglSupported = !!(window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
} catch (e) {
    webglSupported = false;
}

document.documentElement.classList.remove('no-js');
if (isLowPower) document.documentElement.classList.add('perf-lite');

// ============================================================
//  THEME (dark / light) — toggle, persistence, system default
// ============================================================
const Theme = (function () {
    const STORAGE_KEY = 'portfolio-theme';

    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function store(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable, ignore */ }
    }
    function systemPreference() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    function current() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#f3f6fb' : '#030711');
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
            btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        });
    }
    function toggle() {
        const next = current() === 'dark' ? 'light' : 'dark';
        apply(next);
        store(next);
        return next;
    }
    function init() {
        // The blocking inline snippet in <head> already set the initial attribute
        // to avoid a flash of the wrong theme; this just wires up listeners.
        apply(current());
        if (!getStored()) {
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
                if (!getStored()) apply(e.matches ? 'light' : 'dark');
            });
        }
    }
    return { init, toggle, current };
})();

// ============================================================
//  LOADING SCREEN
// ============================================================
(function () {
    const loader = document.getElementById('loading-screen');
    const loaderStartTime = Date.now();
    const MIN_LOADER_DURATION = isMobile ? 700 : 1400;
    if (loader) {
        loader.style.display = 'flex';
        document.body.classList.add('loading');
    }
    window._loaderHidden = false;
    window.hideLoadingScreen = function () {
        const elapsed = Date.now() - loaderStartTime;
        const remaining = Math.max(0, MIN_LOADER_DURATION - elapsed);
        setTimeout(() => {
            if (window._loaderHidden) return;
            window._loaderHidden = true;
            const el = document.getElementById('loading-screen');
            if (!el) return;
            el.classList.add('loader-fade-out');
            document.body.classList.remove('loading');
            setTimeout(() => { if (el) el.style.display = 'none'; }, 500);
        }, remaining);
    };
    const fallbackTimer = setTimeout(() => window.hideLoadingScreen && window.hideLoadingScreen(), 5000);
    window.addEventListener('load', () => {
        clearTimeout(fallbackTimer);
        window.hideLoadingScreen && window.hideLoadingScreen();
    });
})();

// ============================================================
//  GENERAL HELPERS
// ============================================================
let activeScrollLocks = 0;
function lockBodyScroll() {
    activeScrollLocks++;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}
function unlockBodyScroll() {
    activeScrollLocks = Math.max(0, activeScrollLocks - 1);
    if (activeScrollLocks === 0) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && !modal.classList.contains('active')) {
        modal.classList.add('active');
        lockBodyScroll();
        modal.scrollTop = 0;
    }
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        unlockBodyScroll();
    }
}
// Simple debounce utility, used for resize/scroll-heavy handlers.
function debounce(fn, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

// ============================================================
//  ACHIEVEMENT DATA
// ============================================================
const achievementData = [{
    id: 'hackathon',
    img: 'images/achievements/hackathon.jpg',
    title: 'Hackathon Winner',
    subtitle: '2nd Place · Hack the Future: Smart Batangas Province Hackathon Challenge',
    venue: 'University of Batangas, Batangas City',
    date: 'November 21–22, 2025',
    body: `<p>My team and I developed <strong>TugonLipa</strong>, an AI‑powered smart community platform that earned <strong>2nd Place</strong> at the Hack the Future: Smart Batangas Province Hackathon Challenge.</p>
          <p>The platform integrates a centralized emergency hotline, a barangay‑focused social feed, and an AI‑driven assistance agent to help citizens report issues and receive real‑time updates.</p>
          <p>This achievement reflects our ability to rapidly prototype, integrate AI, and deliver civic technology that addresses real community needs.</p>
          <p style="margin-top:12px;"><a href="https://ub.edu.ph/tugon-lipa-project-secures-2nd-place-at-philippine-innovation-conference-2025/" target="_blank" rel="noopener" class="award-link" style="display:inline-flex;"><i class="fas fa-external-link-alt"></i> Read Article</a></p>`
}, {
    id: 'breadboarding',
    img: 'images/achievements/breadboarding.jpg',
    title: 'Breadboarding Competition',
    subtitle: 'Participant · ICpEp.se Region 4A CPE Challenge 2025',
    venue: 'Colegio de San Juan de Letran, Calamba, Laguna',
    date: 'November 15, 2025',
    body: `<p>Participated in the Breadboarding Competition at the ICpEp.se Region 4A CPE Challenge 2025, demonstrating hands‑on circuit design and prototyping skills.</p>
          <p>The competition tested our ability to quickly assemble and debug electronic circuits under time pressure, reinforcing my practical knowledge of analog and digital electronics.</p>`
}, {
    id: 'programming',
    img: 'images/achievements/programming.jpg',
    title: 'C++ Programming Competition',
    subtitle: 'Participant · ICpEp.se Region 4A CPE Challenge 2024',
    venue: 'De La Salle Lipa, Lipa City, Batangas',
    date: 'December 3, 2024',
    body: `<p>Competed in the C++ Programming Competition at the ICpEp.se Region 4A CPE Challenge 2024, solving algorithmic problems under a timed setting.</p>
          <p>The experience sharpened my problem‑solving skills, algorithmic thinking, and ability to write efficient, clean C++ code under pressure.</p>`
}];

function openAchievementModal(index) {
    const data = achievementData[index];
    if (!data) return;
    document.getElementById('achievementModalImg').src = data.img;
    document.getElementById('achievementModalTitle').textContent = data.title;
    document.getElementById('achievementModalSub').textContent = data.subtitle;
    document.getElementById('achievementModalVenue').textContent = data.venue;
    document.getElementById('achievementModalDate').textContent = data.date;
    document.getElementById('achievementModalBody').innerHTML = data.body;
    openModal('modal-achievement');
}

// ============================================================
//  CERTIFICATIONS DATA
// ============================================================
const certificationsData = [
    { title: "IEEE Open Silicon TinyTapeout Philippine IC Design Bootcamp", date: "April 29, 2026", categories: ["seminar"], imgUrl: "images/certifications/ieee-tinytapeout.jpg" },
    { title: "Network Support and Security", date: "March 23, 2026", categories: ["training"], imgUrl: "images/certifications/network-support-security.jpg" },
    { title: "Digital Safety and Security Awareness", date: "March 23, 2026", categories: ["training"], imgUrl: "images/certifications/digital-safety.jpg" },
    { title: "Introduction to Modern AI", date: "March 9, 2026", categories: ["training"], imgUrl: "images/certifications/intro-modern-ai.jpg" },
    { title: "Ethical Hacker", date: "February 25, 2026", categories: ["training"], imgUrl: "images/certifications/ethical-hacker.jpg" },
    { title: "Practical Application of Cybersecurity Framework", date: "December 6, 2025", categories: ["webinar", "icpep"], imgUrl: "images/certifications/cybersecurity-framework.jpg" },
    { title: "Tugon Lipa – 2nd place in the Hack the Future: Smart Batangas Province Hackathon", date: "November 22, 2025", categories: ["hackathon"], imgUrl: "images/certifications/tugon-lipa-hackathon.jpg" },
    { title: "Batangas AI and Cybersecurity Congress 2025", date: "November 7, 2025", categories: ["seminar"], imgUrl: "images/certifications/batangas-ai-cybersecurity.jpg" },
    { title: "Cyber 101 for Institute of Computer Engineers of the Philippines, Inc.", date: "April 24, 2025", categories: ["webinar", "icpep"], imgUrl: "images/certifications/cyber-101.jpg" },
    { title: "AI and Prompt Engineering in Educational Settings", date: "April 5, 2025", categories: ["webinar", "icpep"], imgUrl: "images/certifications/ai-prompt-engineering.jpg" },
    { title: "Hybrid AVG-drone using YOLOv8 and Arduino-Raspberry Pi for defect detection and structural health monitoring in built infrastructure", date: "March 22, 2025", categories: ["webinar", "icpep"], imgUrl: "images/certifications/hybrid-drone.jpg" },
    { title: "Training and Education in Medical Imaging for AI in PACS: Equipping the Next Generation", date: "March 8, 2025", categories: ["webinar", "icpep"], imgUrl: "images/certifications/medical-imaging-ai.jpg" },
    { title: "CCNAv7: Introduction to Networks", date: "January 21, 2025", categories: ["training"], imgUrl: "images/certifications/ccna-intro-networks.jpg" },
    { title: "Tech Nexus 2024: Empowering Campus Innovators", date: "December 7, 2024", categories: ["seminar"], imgUrl: "images/certifications/tech-nexus-2024.jpg" }
];

const categoryLabels = { webinar: 'Online Webinar', icpep: 'ICpEP', training: 'Course/Training', seminar: 'Seminar', hackathon: 'Hackathon' };

function renderCertifications(filter = 'all') {
    const container = document.getElementById('certsGrid');
    if (!container) return;
    const filtered = filter === 'all' ? certificationsData : certificationsData.filter(c => c.categories.includes(filter));
    const frag = document.createDocumentFragment();
    filtered.forEach((cert) => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        const img = document.createElement('img');
        img.src = cert.imgUrl;
        img.alt = cert.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.className = 'cert-img';
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cert-info';
        const tagsHtml = cert.categories.map(cat => `<span class="cert-tag">${categoryLabels[cat] || cat}</span>`).join('');
        infoDiv.innerHTML = `
            <div class="cert-title">${cert.title}</div>
            <div class="cert-date"><i class="far fa-calendar-alt"></i> ${cert.date}</div>
            <div class="cert-tags">${tagsHtml}</div>
        `;
        card.appendChild(img);
        card.appendChild(infoDiv);
        frag.appendChild(card);
    });
    container.innerHTML = '';
    container.appendChild(frag);
}

// ============================================================
//  IMAGE LIGHTBOX
// ============================================================
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let lightboxEl, lightboxImg, lightboxCounter, lightboxClose, lightboxPrev, lightboxNext;

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

// ============================================================
//  DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    Theme.init();

    if (window.emailjs) emailjs.init("jJ0ZadOUacvrkPfPT");
    renderCertifications('all');

    lightboxEl = document.getElementById('imageLightbox');
    lightboxImg = document.getElementById('lightboxImage');
    lightboxCounter = document.getElementById('lightboxCounter');
    lightboxClose = document.getElementById('lightboxClose');
    lightboxPrev = document.getElementById('lightboxPrev');
    lightboxNext = document.getElementById('lightboxNext');

    if (lightboxEl) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
        lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });
    }
    document.addEventListener('keydown', (e) => {
        if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Gallery click delegation (event delegation avoids per-image listeners)
    document.addEventListener('click', (e) => {
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
        const allUrls = Array.from(container.querySelectorAll('img')).map(i => i.src);
        const idx = allUrls.indexOf(img.src);
        if (idx !== -1) openLightbox(allUrls, idx);
    });

    document.querySelectorAll('#certFilterBar .filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#certFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCertifications(this.getAttribute('data-filter'));
        });
    });

    // ===== Theme toggle button(s) =====
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => Theme.toggle());
    });

    // ===== Header / nav =====
    const headerInner = document.getElementById('headerInner');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const allNavLinks = document.querySelectorAll('.nav-list a, .mobile-nav a');
    const revealEls = document.querySelectorAll('.reveal');
    const yearSpan = document.getElementById('currentYear');
    const spotlight = document.getElementById('spotlight');
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (headerInner) {
        window.addEventListener('scroll', () => {
            headerInner.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }
    if (backToTopBtn) {
        window.addEventListener('scroll', debounce(() => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 500);
        }, 100), { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }
    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('open');
            const icon = hamburgerBtn.querySelector('i');
            icon.className = mobileNav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburgerBtn.querySelector('i').className = 'fas fa-bars';
            });
        });
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('open');
                hamburgerBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
    allNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }
    window.addEventListener('scroll', debounce(updateActiveNav, 60), { passive: true });
    updateActiveNav();

    // ===== Reveal on scroll =====
    if (!isMobile && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ===== Spotlight cursor glow (desktop, fine pointer only) =====
    if (spotlight && !isTouchDevice && !isMobile) {
        let mouseX = -500, mouseY = -500, targetX = mouseX, targetY = mouseY;
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX; targetY = e.clientY;
            spotlight.classList.add('active');
        });
        document.addEventListener('mouseleave', () => spotlight.classList.remove('active'));

        function animateSpotlight() {
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;
            spotlight.style.left = mouseX + 'px';
            spotlight.style.top = mouseY + 'px';
            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }

    // ===== Magnetic button hover (desktop only) =====
    const magneticWraps = document.querySelectorAll('.magnetic-wrap[data-magnetic]');
    if (!isTouchDevice && !isMobile) {
        magneticWraps.forEach(wrap => {
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                wrap.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
            });
            wrap.addEventListener('mouseleave', () => { wrap.style.transform = 'translate(0px, 0px)'; });
        });
    }

    // ===== Role typewriter =====
    const roleSwitcherText = document.getElementById('roleSwitcherText');
    if (roleSwitcherText) {
        const roles = ['Computer Engineer', 'Embedded Systems Developer', 'IoT & Robotics Enthusiast', 'Full-Stack Developer'];
        let roleIndex = 0, currentText = '';
        const typingSpeed = isMobile ? 120 : 80;
        const deletingSpeed = isMobile ? 60 : 40;
        const pauseBeforeDelete = isMobile ? 1500 : 2000;
        const pauseBeforeNext = isMobile ? 400 : 500;

        function typeChar() {
            const full = roles[roleIndex];
            if (currentText.length < full.length) {
                currentText += full.charAt(currentText.length);
                roleSwitcherText.textContent = currentText;
                setTimeout(typeChar, typingSpeed);
            } else {
                setTimeout(deleteChar, pauseBeforeDelete);
            }
        }
        function deleteChar() {
            if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                roleSwitcherText.textContent = currentText;
                setTimeout(deleteChar, deletingSpeed);
            } else {
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeChar, pauseBeforeNext);
            }
        }
        if (!prefersReducedMotion) {
            typeChar();
        } else {
            roleSwitcherText.textContent = roles[0];
        }
    }

    const resumeViewBtn = document.getElementById('resumeViewBtn');
    if (resumeViewBtn) {
        resumeViewBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-resume'); });
    }

    // ===== Contact form (EmailJS) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!window.emailjs) return;
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            emailjs.sendForm('service_76iix6u', 'template_zdd5ea4', this)
                .then(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    contactForm.reset();
                    setTimeout(() => { submitBtn.innerHTML = originalHTML; submitBtn.style.background = ''; submitBtn.disabled = false; }, 3000);
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
                    submitBtn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
                    setTimeout(() => { submitBtn.innerHTML = originalHTML; submitBtn.style.background = ''; submitBtn.disabled = false; }, 3000);
                });
        });
    }

    // ===== Mobile: reveal staggered/timeline/glow content immediately =====
    if (isMobile) {
        document.querySelectorAll('.stagger-container[data-stagger]').forEach(el => el.classList.add('revealed'));
        document.querySelectorAll('.timeline-modern[data-timeline-animate]').forEach(el => el.classList.add('timeline-animated'));
        document.querySelectorAll('[data-glow-border]').forEach(el => el.classList.add('glow-visible'));
    }
});

// ============================================================
//  ESCAPE KEY / OVERLAY CLICK FOR MODALS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('imageLightbox');
        if (lightbox && lightbox.classList.contains('active')) return;
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            const modalId = modal.getAttribute('id');
            if (modalId) closeModal(modalId);
        });
    }
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
        closeModal(e.target.getAttribute('id'));
    }
});

// ============================================================
//  ENHANCED DESKTOP-ONLY MICRO-INTERACTIONS
//  (3D tilt, parallax backgrounds, shine sweep, timeline / glow
//  reveal observers, ripple). Skipped on mobile & reduced motion
//  to keep CPU/GPU usage low on phones.
// ============================================================
(function () {
    if (isMobile || prefersReducedMotion) {
        document.querySelectorAll('.timeline-modern[data-timeline-animate]').forEach(el => el.classList.add('timeline-animated'));
        document.querySelectorAll('[data-glow-border]').forEach(el => el.classList.add('glow-visible'));
        return;
    }

    const staggerContainers = document.querySelectorAll('.stagger-container[data-stagger]');
    if (staggerContainers.length > 0) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('revealed'); staggerObserver.unobserve(entry.target); }
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

    const tiltCards = document.querySelectorAll('[data-tilt-card], .card-premium:not(.achievement-card), .card-light-premium, .project-card-horizontal, .achievement-photo-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const centerX = rect.width / 2, centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        });
    });

    document.querySelectorAll('.project-card-horizontal[data-project-card]').forEach(card => {
        const bgLayer = card.querySelector('.card-bg-layer');
        if (!bgLayer) return;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const moveX = (x / rect.width - 0.5) * -8, moveY = (y / rect.height - 0.5) * -8;
            bgLayer.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
            bgLayer.style.transition = 'transform 0.15s ease-out';
        });
        card.addEventListener('mouseleave', () => {
            bgLayer.style.transform = 'scale(1) translate(0px, 0px)';
            bgLayer.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });

    document.querySelectorAll('.card-premium, .card-light-premium, .project-card-horizontal, .achievement-card, .achievement-photo-card').forEach(card => {
        let shineTimeout, idleShineInterval;
        const triggerShine = () => {
            clearTimeout(shineTimeout);
            if (card.classList.contains('achievement-card')) {
                const innerShine = card.querySelector('.achievement-shine');
                if (innerShine) { innerShine.classList.remove('shine-active'); void innerShine.offsetWidth; innerShine.classList.add('shine-active'); }
            } else if (card.classList.contains('project-card-horizontal') || card.classList.contains('achievement-photo-card')) {
                const sweep = card.querySelector('.card-shine-sweep');
                if (sweep) { sweep.classList.remove('shine-active'); void sweep.offsetWidth; sweep.classList.add('shine-active'); }
            } else {
                card.classList.remove('shine-active'); void card.offsetWidth; card.classList.add('shine-active');
            }
            shineTimeout = setTimeout(() => {
                const sweep = card.querySelector('.card-shine-sweep');
                const ach = card.querySelector('.achievement-shine');
                if (sweep) sweep.classList.remove('shine-active');
                if (ach) ach.classList.remove('shine-active');
                card.classList.remove('shine-active');
            }, 2600);
        };
        card.addEventListener('mouseenter', () => { clearInterval(idleShineInterval); triggerShine(); });
        card.addEventListener('mouseleave', () => { idleShineInterval = setInterval(triggerShine, 6000); });
        idleShineInterval = setInterval(triggerShine, 6000);
        card._shineInterval = idleShineInterval;
    });

    const timelines = document.querySelectorAll('[data-timeline-animate]');
    if (timelines.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('timeline-animated'); timelineObserver.unobserve(entry.target); } });
        }, { threshold: 0.2 });
        timelines.forEach(tl => timelineObserver.observe(tl));
        setTimeout(() => {
            timelines.forEach(tl => {
                const rect = tl.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) tl.classList.add('timeline-animated');
            });
        }, 200);
    }

    const glowBorders = document.querySelectorAll('[data-glow-border]');
    if (glowBorders.length > 0) {
        const glowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('glow-visible'); glowObserver.unobserve(entry.target); } });
        }, { threshold: 0.3 });
        glowBorders.forEach(el => glowObserver.observe(el));
        setTimeout(() => {
            glowBorders.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('glow-visible');
            });
        }, 200);
    }

    document.querySelectorAll('[data-ripple], .btn-primary[data-ripple]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
})();

// ============================================================
//  THREE.JS — AMBIENT LIGHT RAYS (desktop only — purely decorative)
// ============================================================
(function () {
    if (isMobile || prefersReducedMotion || !webglSupported || typeof THREE === 'undefined') return;
    const container = document.getElementById('canvasContainer');
    const canvas = document.getElementById('lightraysCanvas');
    if (!container || !canvas) return;

    const config = {
        raysOrigin: 'top-center', raysColor: '#67e8f9', raysSpeed: 1, lightSpread: 1, rayLength: 2,
        pulsating: false, fadeDistance: 1.0, saturation: 1.0, followMouse: true, mouseInfluence: 0.1,
        noiseAmount: 0.0, distortion: 0.0
    };
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const hexToRgb = (hex) => {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
    };
    const getAnchorAndDir = (origin, w, h) => {
        const outside = 0.2;
        switch (origin) {
            case 'top-left': return { anchor: [0, -outside * h], dir: [0, 1] };
            case 'top-right': return { anchor: [w, -outside * h], dir: [0, 1] };
            case 'left': return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
            case 'right': return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
            case 'bottom-left': return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
            case 'bottom-center': return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
            case 'bottom-right': return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
            default: return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
        }
    };
    const uniforms = {
        iTime: { value: 0 }, iResolution: { value: new THREE.Vector2() },
        rayPos: { value: new THREE.Vector2() }, rayDir: { value: new THREE.Vector2() },
        raysColor: { value: new THREE.Vector3(...hexToRgb(config.raysColor)) },
        raysSpeed: { value: config.raysSpeed }, lightSpread: { value: config.lightSpread },
        rayLength: { value: config.rayLength }, pulsating: { value: config.pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: config.fadeDistance }, saturation: { value: config.saturation },
        mousePos: { value: new THREE.Vector2(0.5, 0.5) }, mouseInfluence: { value: config.mouseInfluence },
        noiseAmount: { value: config.noiseAmount }, distortion: { value: config.distortion }
    };
    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;
    const fragmentShader = `precision highp float; varying vec2 vUv; uniform float iTime; uniform vec2 iResolution; uniform vec2 rayPos; uniform vec2 rayDir; uniform vec3 raysColor; uniform float raysSpeed; uniform float lightSpread; uniform float rayLength; uniform float pulsating; uniform float fadeDistance; uniform float saturation; uniform vec2 mousePos; uniform float mouseInfluence; uniform float noiseAmount; uniform float distortion; float noise(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); } float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) { vec2 sourceToCoord = coord - raySource; vec2 dirNorm = normalize(sourceToCoord); float cosAngle = dot(dirNorm, rayRefDirection); float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2; float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001)); float distance = length(sourceToCoord); float maxDistance = iResolution.x * rayLength; float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0); float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0); float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0; float baseStrength = clamp((0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) + (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)), 0.0, 1.0); return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse; } void main() { vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y); vec2 finalRayDir = rayDir; if (mouseInfluence > 0.0) { vec2 mouseScreenPos = mousePos * iResolution; vec2 mouseDirection = normalize(mouseScreenPos - rayPos); finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence)); } vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed); vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed); vec4 color = rays1 * 0.5 + rays2 * 0.4; if (noiseAmount > 0.0) { float n = noise(coord * 0.01 + iTime * 0.1); color.rgb *= (1.0 - noiseAmount + noiseAmount * n); } float brightness = 1.0 - (coord.y / iResolution.y); color.x *= 0.1 + brightness * 0.8; color.y *= 0.3 + brightness * 0.6; color.z *= 0.5 + brightness * 0.5; if (saturation != 1.0) { float gray = dot(color.rgb, vec3(0.299, 0.587, 0.514)); color.rgb = mix(vec3(gray), color.rgb, saturation); } color.rgb *= raysColor; gl_FragColor = color; }`;
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const mouse = { x: 0.5, y: 0.5 }, smoothMouse = { x: 0.5, y: 0.5 };
    window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) / rect.width;
        mouse.y = (e.clientY - rect.top) / rect.height;
    });

    function resize() {
        const rect = container.getBoundingClientRect();
        const w = rect.width, h = rect.height;
        renderer.setSize(w, h);
        const dpr = renderer.getPixelRatio();
        uniforms.iResolution.value.set(w * dpr, h * dpr);
        const { anchor, dir } = getAnchorAndDir(config.raysOrigin, w * dpr, h * dpr);
        uniforms.rayPos.value.set(anchor[0], anchor[1]);
        uniforms.rayDir.value.set(dir[0], dir[1]);
    }
    window.addEventListener('resize', debounce(resize, 150));
    resize();

    function animate(time) {
        requestAnimationFrame(animate);
        uniforms.iTime.value = time * 0.001;
        if (config.followMouse && config.mouseInfluence > 0) {
            const smoothing = 0.92;
            smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
            smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
            uniforms.mousePos.value.set(smoothMouse.x, smoothMouse.y);
        }
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
})();

// ============================================================
//  THREE.JS — BARONG/TOGA FLUID BLEND (desktop + mobile)
//  This is the required signature effect. It stays functional on
//  every device: full resolution + full mouse sensitivity + cursor
//  parallax on desktop, and a lighter, touch-driven version on
//  mobile (lower render-target size, reduced sensitivity, parallax
//  switched off since there is no persistent cursor to parallax
//  against on a touchscreen). If WebGL isn't supported at all, or
//  the visitor asked for reduced motion, we fall back to the
//  static portrait image instead of trying to render anything.
// ============================================================
(function () {
    const container = document.getElementById('canvasContainer');
    const webglCanvas = document.getElementById('webglCanvas');
    const fallbackImg = document.querySelector('.hero-mobile-fallback');

    if (!container || !webglCanvas) return;

    if (!webglSupported || typeof THREE === 'undefined' || prefersReducedMotion) {
        // Graceful degradation: static portrait only.
        webglCanvas.style.display = 'none';
        if (fallbackImg) fallbackImg.style.display = 'block';
        if (window.hideLoadingScreen) window.hideLoadingScreen();
        return;
    }

    webglCanvas.style.display = 'block';

    const renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, premultipliedAlpha: false, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    let fluidRT_A, fluidRT_B;
    let simScene, simCamera, simQuad;
    // Requirement: reduce internal resolution on mobile (512 -> 256 or lower).
    const BASE_RES = isMobile ? 256 : 512;
    let fluidRes = new THREE.Vector2(BASE_RES, BASE_RES);

    const mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, inside: false };
    let lastMoveTime = performance.now();
    let idleActive = false;
    const IDLE_DELAY = 2000;
    const SWEEP_PAUSE = 4000;
    let scanVirtualX = 0.0, scanVirtualY = 0.0, scanDirX = 1, scanDirY = 1, scanPauseUntil = 0, scanComplete = true;
    const SCAN_SPEED_X = 3.5, SCAN_SPEED_Y = 0.5;
    const loader = new THREE.TextureLoader();
    let imagesLoaded = 0, animationStarted = false;

    function initFluid() {
        simScene = new THREE.Scene();
        simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        simCamera.position.z = 1;
        const format = THREE.RGBAFormat, type = THREE.FloatType;
        fluidRT_A = new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, { format, type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
        fluidRT_B = new THREE.WebGLRenderTarget(fluidRes.x, fluidRes.y, { format, type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
        const simVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;
        const simFrag = `precision highp float; varying vec2 vUv; uniform sampler2D uPrevFrame; uniform vec2 uMouse; uniform vec2 uVelocity; uniform vec2 uTexelSize; uniform bool uMouseDown; void main() { vec2 uv = vUv; vec4 prev = texture2D(uPrevFrame, uv); float inkPrev = prev.r; vec2 velPrev = (prev.gb - 0.5) * 2.0; float advecScale = 1.2; vec2 advectedUV = uv - velPrev * uTexelSize * advecScale; vec4 advected = texture2D(uPrevFrame, advectedUV); vec2 velAdvected = (advected.gb - 0.5) * 2.0; float inkAdvected = advected.r; vec2 diff = uv - uMouse; float dist = length(diff); float inkRadius = 0.04; float inkInject = exp(-dist * dist / (inkRadius * inkRadius)) * (uMouseDown ? 1.0 : 0.0); float velRadius = 0.04; float velWeight = exp(-dist * dist / (velRadius * velRadius)) * (uMouseDown ? 1.0 : 0.0); vec2 injectedVel = mix(vec2(0.0), uVelocity, velWeight); float velDecay = 1.0; vec2 newVel = velAdvected * velDecay + injectedVel * 0.8; float inkDecay = 0.98; float inkNew = inkAdvected * inkDecay + inkInject * 0.9; vec4 n = texture2D(uPrevFrame, uv + vec2(uTexelSize.x, 0.0)); vec4 s = texture2D(uPrevFrame, uv - vec2(uTexelSize.x, 0.0)); vec4 e = texture2D(uPrevFrame, uv + vec2(0.0, uTexelSize.y)); vec4 w = texture2D(uPrevFrame, uv - vec2(0.0, uTexelSize.y)); float inkDiffuse = (inkAdvected + n.r + s.r + e.r + w.r) * 0.2; inkNew = mix(inkNew, inkDiffuse, 0.02); gl_FragColor = vec4(inkNew, newVel * 0.5 + 0.5, 1.0); }`;
        const simMat = new THREE.ShaderMaterial({
            uniforms: {
                uPrevFrame: { value: fluidRT_A.texture }, uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uVelocity: { value: new THREE.Vector2(0, 0) }, uTexelSize: { value: new THREE.Vector2(1 / fluidRes.x, 1 / fluidRes.y) },
                uMouseDown: { value: false }
            }, vertexShader: simVert, fragmentShader: simFrag
        });
        simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat);
        simScene.add(simQuad);
        renderer.setRenderTarget(fluidRT_A); renderer.clear();
        renderer.setRenderTarget(fluidRT_B); renderer.clear();
        renderer.setRenderTarget(null);
    }

    function resizeFluid() {
        const rect = container.getBoundingClientRect();
        const aspect = rect.width / rect.height;
        const h = BASE_RES;
        const w = Math.floor(h * aspect);
        fluidRes.set(w, h);
        fluidRT_A.setSize(w, h);
        fluidRT_B.setSize(w, h);
        simQuad.material.uniforms.uTexelSize.value.set(1 / w, 1 / h);
    }
    initFluid();
    window.addEventListener('resize', debounce(resizeFluid, 150));

    const mainVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const mainFrag = `precision highp float; varying vec2 vUv; uniform sampler2D uBarong; uniform sampler2D uToga; uniform sampler2D uFluidMask; uniform float uAspect; uniform float uBarongAspect; uniform float uTogaAspect; uniform vec2 uCursor; uniform float uParallaxStrength; vec2 coverUV(vec2 uv, float imageAspect, float canvasAspect) { vec2 newUV = uv - 0.5; if (canvasAspect > imageAspect) { newUV.x *= canvasAspect / imageAspect; } else { newUV.y *= imageAspect / canvasAspect; } newUV += 0.5; return clamp(newUV, 0.0, 1.0); } void main() { vec2 centerOffset = uCursor - 0.5; vec2 offsetBarong = -centerOffset * uParallaxStrength * 0.5; vec2 offsetToga = -centerOffset * uParallaxStrength * 0.5; vec2 uvBarong = coverUV(vUv + offsetBarong, uBarongAspect, uAspect); vec2 uvToga = coverUV(vUv + offsetToga, uTogaAspect, uAspect); float water = texture2D(uFluidMask, vUv).r; float blend = smoothstep(0.18, 0.22, water); vec4 barongColor = texture2D(uBarong, uvBarong); vec4 togaColor = texture2D(uToga, uvToga); vec3 mixedRGB = mix(barongColor.rgb, togaColor.rgb, blend); float mixedAlpha = mix(barongColor.a, togaColor.a, blend); gl_FragColor = vec4(mixedRGB, mixedAlpha); }`;
    const mainUniforms = {
        uBarong: { value: null }, uToga: { value: null }, uFluidMask: { value: fluidRT_A.texture },
        uAspect: { value: 1.0 }, uBarongAspect: { value: 1.0 }, uTogaAspect: { value: 1.0 },
        uCursor: { value: new THREE.Vector2(0.5, 0.5) },
        // Cursor parallax is a fine-pointer affordance; it's disabled on touch devices per spec.
        uParallaxStrength: { value: isTouchDevice ? 0.0 : 0.025 }
    };
    const mainMat = new THREE.ShaderMaterial({ uniforms: mainUniforms, vertexShader: mainVert, fragmentShader: mainFrag, transparent: true, depthWrite: false, depthTest: false });
    const mainQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mainMat);
    scene.add(mainQuad);

    function imageLoaded(tex, which) {
        imagesLoaded++;
        if (tex.image) {
            if (which === 'barong') {
                mainUniforms.uBarongAspect.value = tex.image.width / tex.image.height;
                container.style.aspectRatio = `${tex.image.width} / ${tex.image.height}`;
            } else {
                mainUniforms.uTogaAspect.value = tex.image.width / tex.image.height;
            }
        }
        if (imagesLoaded === 2 && !animationStarted) {
            animationStarted = true;
            resizeAll();
            animate(performance.now());
            if (window.hideLoadingScreen) window.hideLoadingScreen();
        }
    }
    loader.load('images/profile/barong.png', (tex) => { mainUniforms.uBarong.value = tex; imageLoaded(tex, 'barong'); },
        undefined, () => { if (fallbackImg) fallbackImg.style.display = 'block'; webglCanvas.style.display = 'none'; if (window.hideLoadingScreen) window.hideLoadingScreen(); });
    loader.load('images/profile/toga.png', (tex) => { mainUniforms.uToga.value = tex; imageLoaded(tex, 'toga'); });

    function updateMouse(clientX, clientY) {
        const rect = container.getBoundingClientRect();
        const newX = (clientX - rect.left) / rect.width;
        const newY = 1.0 - (clientY - rect.top) / rect.height;
        mouse.prevX = mouse.x; mouse.prevY = mouse.y;
        mouse.x = newX; mouse.y = newY;
        lastMoveTime = performance.now();
        idleActive = false;
        scanComplete = true;
    }
    if (!isTouchDevice) {
        webglCanvas.addEventListener('mousemove', (e) => { updateMouse(e.clientX, e.clientY); mouse.inside = true; });
        webglCanvas.addEventListener('mouseenter', () => { mouse.inside = true; });
        webglCanvas.addEventListener('mouseleave', () => { mouse.inside = false; });
    }
    // Touch: still lets visitors "paint" the ink with a finger, just without cursor parallax.
    webglCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        updateMouse(t.clientX, t.clientY);
        mouse.inside = true;
    }, { passive: false });
    webglCanvas.addEventListener('touchend', () => { mouse.inside = false; });

    function updateFluid(dt) {
        const now = performance.now();
        const simMat = simQuad.material;
        if (!idleActive && (now - lastMoveTime) > IDLE_DELAY) {
            idleActive = true; scanComplete = false;
            if (Math.random() < 0.5) { scanVirtualX = 0.0; scanDirX = 1; } else { scanVirtualX = 1.0; scanDirX = -1; }
            scanVirtualY = 0.0; scanDirY = 1; scanPauseUntil = 0;
        }
        if (idleActive) {
            if (scanComplete) {
                if (now > scanPauseUntil) {
                    scanComplete = false;
                    if (Math.random() < 0.5) { scanVirtualX = 0.0; scanDirX = 1; } else { scanVirtualX = 1.0; scanDirX = -1; }
                    scanVirtualY = 0.0; scanDirY = 1;
                }
            } else {
                scanVirtualX += scanDirX * SCAN_SPEED_X * dt;
                scanVirtualY += scanDirY * SCAN_SPEED_Y * dt;
                if (scanVirtualX >= 1.0) { scanVirtualX = 1.0; scanDirX = -1; } else if (scanVirtualX <= 0.0) { scanVirtualX = 0.0; scanDirX = 1; }
                if (scanVirtualY >= 1.0) { scanVirtualY = 1.0; scanVirtualX = scanVirtualX < 0.5 ? 0.0 : 1.0; scanComplete = true; scanPauseUntil = now + SWEEP_PAUSE; }
            }
            simMat.uniforms.uMouse.value.set(scanVirtualX, 1.0 - scanVirtualY);
            simMat.uniforms.uMouseDown.value = true;
            simMat.uniforms.uVelocity.value.set(0, 0);
        } else {
            simMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
            // Lower tracking sensitivity on mobile, per requirement.
            const sensitivity = isMobile ? 6.0 : 10.0;
            const velX = ((mouse.x - mouse.prevX) / Math.max(0.016, dt)) * sensitivity;
            const velY = ((mouse.y - mouse.prevY) / Math.max(0.016, dt)) * sensitivity;
            simMat.uniforms.uVelocity.value.set(velX, velY);
            const movingThreshold = 0.01;
            simMat.uniforms.uMouseDown.value = (Math.abs(velX) > movingThreshold || Math.abs(velY) > movingThreshold) && mouse.inside;
        }
        mainUniforms.uCursor.value.set(mouse.x, mouse.y);
        simMat.uniforms.uPrevFrame.value = fluidRT_A.texture;
        renderer.setRenderTarget(fluidRT_B);
        renderer.render(simScene, simCamera);
        renderer.setRenderTarget(null);
        const temp = fluidRT_A; fluidRT_A = fluidRT_B; fluidRT_B = temp;
        mainUniforms.uFluidMask.value = fluidRT_A.texture;
    }

    function resizeAll() {
        const rect = container.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        mainUniforms.uAspect.value = rect.width / rect.height;
        resizeFluid();
        mainUniforms.uFluidMask.value = fluidRT_A.texture;
    }

    let lastTime = 0;
    // Frame-rate limiting on mobile keeps the sim from pegging the GPU on lower-end phones.
    const TARGET_FPS = isMobile ? 30 : 60;
    const FRAME_BUDGET = 1000 / TARGET_FPS;
    let frameAccumulator = 0;

    function animate(time) {
        if (!animationStarted) return;
        requestAnimationFrame(animate);
        const dt = lastTime ? (time - lastTime) * 0.001 : 0.016;
        frameAccumulator += lastTime ? (time - lastTime) : 16.6;
        lastTime = time;
        if (isMobile && frameAccumulator < FRAME_BUDGET) return;
        frameAccumulator = 0;
        updateFluid(dt);
        renderer.render(scene, camera);
    }
    // Animation kicks off once both textures load (see imageLoaded above).
})();
