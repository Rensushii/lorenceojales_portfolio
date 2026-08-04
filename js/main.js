import { initHomeCanvas } from './homeCanvas.js';

// ============================================================
//  GLOBALS & CONFIG
// ============================================================
const sections = ['home', 'about', 'experience', 'projects', 'achievements', 'skills', 'certifications', 'contact'];
let currentSection = 'home';
let isLoading = false;

const container = document.getElementById('section-container');
const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav a');

// ============================================================
//  NAVIGATION
// ============================================================
function navigateTo(section) {
    if (section === currentSection || isLoading) return;
    isLoading = true;
    currentSection = section;
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === section));
    document.getElementById('mobileNav').classList.remove('open');
    loadSection(section);
}

async function loadSection(section) {
    try {
        const response = await fetch(`sections/${section}.html`);
        if (!response.ok) throw new Error('Section not found');
        const html = await response.text();
        container.style.opacity = 0;
        container.style.transform = 'translateY(16px)';
        setTimeout(() => {
            container.innerHTML = html;
            executeSectionScripts(section);
            container.style.opacity = 1;
            container.style.transform = 'translateY(0)';
            isLoading = false;
            history.pushState(null, '', `#${section}`);
            if (section === 'home') {
                initHomeCanvas();
                // Re-run typewriter and other home-specific scripts (they are in the home.html inline script)
            } else {
                cleanupHomeCanvas();
            }
            triggerReveal();
        }, 300);
    } catch (err) {
        console.error('Error loading section:', err);
        container.innerHTML = `<div class="error">Failed to load section.</div>`;
        isLoading = false;
    }
}

function executeSectionScripts(section) {
    if (section === 'certifications') {
        const activeFilter = document.querySelector('#certFilterBar .filter-btn.active')?.dataset.filter || 'all';
        renderCertifications(activeFilter);
        // Re-attach filter events
        document.querySelectorAll('#certFilterBar .filter-btn').forEach(btn => {
            btn.removeEventListener('click', certFilterHandler);
            btn.addEventListener('click', certFilterHandler);
        });
    }
    if (section === 'about' || section === 'experience') {
        const timeline = document.querySelector('[data-timeline-animate]');
        if (timeline) setTimeout(() => timeline.classList.add('timeline-animated'), 100);
    }
    triggerReveal();
    // Re-attach gallery clicks for lightbox
    document.querySelectorAll('.project-gallery img, .cert-img').forEach(img => {
        img.removeEventListener('click', galleryClickHandler);
        img.addEventListener('click', galleryClickHandler);
    });
    // Re-attach achievement card clicks
    document.querySelectorAll('.achievement-photo-card[data-achievement-photo]').forEach((card, index) => {
        card.removeEventListener('click', () => openAchievementModal(index));
        card.addEventListener('click', () => openAchievementModal(index));
    });
    // Re-attach project card clicks
    document.querySelectorAll('.project-card-horizontal[onclick]').forEach(card => {
        const modalId = card.getAttribute('onclick').match(/openModal\('([^']+)'\)/)?.[1];
        if (modalId) {
            card.removeEventListener('click', () => openModal(modalId));
            card.addEventListener('click', () => openModal(modalId));
            card.removeAttribute('onclick'); // clean up
        }
    });
}

function triggerReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('revealed');
        }
    });
}

function cleanupHomeCanvas() {
    const canvases = document.querySelectorAll('#lightraysCanvas, #webglCanvas');
    canvases.forEach(c => c.remove());
}

// ============================================================
//  CERTIFICATIONS DATA & RENDER
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

function renderCertifications(filter = 'all') {
    const container = document.getElementById('certsGrid');
    if (!container) return;
    let filtered = certificationsData;
    if (filter !== 'all') {
        filtered = certificationsData.filter(cert => cert.categories.includes(filter));
    }
    container.innerHTML = '';
    filtered.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        const img = document.createElement('img');
        img.src = cert.imgUrl;
        img.alt = cert.title;
        img.loading = 'lazy';
        img.className = 'cert-img';
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cert-info';
        const categoryLabels = { webinar: 'Online Webinar', icpep: 'ICpEP', training: 'Course/Training', seminar: 'Seminar', hackathon: 'Hackathon' };
        const tagsHtml = cert.categories.map(cat => `<span class="cert-tag">${categoryLabels[cat] || cat}</span>`).join('');
        infoDiv.innerHTML = `
            <div class="cert-title">${cert.title}</div>
            <div class="cert-date"><i class="far fa-calendar-alt"></i> ${cert.date}</div>
            <div class="cert-tags">${tagsHtml}</div>
        `;
        card.appendChild(img);
        card.appendChild(infoDiv);
        container.appendChild(card);
    });
}

function certFilterHandler(e) {
    document.querySelectorAll('#certFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderCertifications(this.getAttribute('data-filter'));
}

// ============================================================
//  ACHIEVEMENTS DATA & MODAL
// ============================================================
const achievementData = [
    {
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
    },
    {
        id: 'breadboarding',
        img: 'images/achievements/breadboarding.jpg',
        title: 'Breadboarding Competition',
        subtitle: 'Participant · ICpEp.se Region 4A CPE Challenge 2025',
        venue: 'Colegio de San Juan de Letran, Calamba, Laguna',
        date: 'November 15, 2025',
        body: `<p>Participated in the Breadboarding Competition at the ICpEp.se Region 4A CPE Challenge 2025, demonstrating hands‑on circuit design and prototyping skills.</p>
              <p>The competition tested our ability to quickly assemble and debug electronic circuits under time pressure, reinforcing my practical knowledge of analog and digital electronics.</p>`
    },
    {
        id: 'programming',
        img: 'images/achievements/programming.jpg',
        title: 'C++ Programming Competition',
        subtitle: 'Participant · ICpEp.se Region 4A CPE Challenge 2024',
        venue: 'De La Salle Lipa, Lipa City, Batangas',
        date: 'December 3, 2024',
        body: `<p>Competed in the C++ Programming Competition at the ICpEp.se Region 4A CPE Challenge 2024, solving algorithmic problems under a timed setting.</p>
              <p>The experience sharpened my problem‑solving skills, algorithmic thinking, and ability to write efficient, clean C++ code under pressure.</p>`
    }
];

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
window.openAchievementModal = openAchievementModal;

// ============================================================
//  MODALS
// ============================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && !modal.classList.contains('active')) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.scrollTop = 0;
    }
}
window.openModal = openModal;

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
window.closeModal = closeModal;

// Close modal on overlay click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
        closeModal(e.target.id);
    }
});

// ============================================================
//  LIGHTBOX
// ============================================================
let currentLightboxImages = [];
let currentLightboxIndex = 0;
const lightboxEl = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

function openLightbox(imagesArray, startIndex) {
    if (!imagesArray || imagesArray.length === 0) return;
    currentLightboxImages = imagesArray;
    currentLightboxIndex = Math.min(startIndex, imagesArray.length - 1);
    updateLightboxImage();
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
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
    document.body.style.overflow = '';
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

// Gallery click handler
function galleryClickHandler(e) {
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
}

// ============================================================
//  CONTACT FORM (EmailJS)
// ============================================================
emailjs.init("jJ0ZadOUacvrkPfPT");

document.addEventListener('submit', function(e) {
    if (e.target.id === 'contactForm') {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        emailjs.sendForm('service_76iix6u', 'template_zdd5ea4', e.target)
            .then(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                e.target.reset();
                setTimeout(() => { submitBtn.innerHTML = originalHTML; submitBtn.style.background = ''; submitBtn.disabled = false; }, 3000);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed';
                submitBtn.style.background = 'linear-gradient(135deg, #f43f5e, #e11d48)';
                setTimeout(() => { submitBtn.innerHTML = originalHTML; submitBtn.style.background = ''; submitBtn.disabled = false; }, 3000);
            });
    }
});

// ============================================================
//  EVENT LISTENERS & INIT
// ============================================================
// Nav clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.section);
    });
});

// Hash routing
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'home';
    if (sections.includes(hash)) navigateTo(hash);
});

// Hamburger
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.toggle('open');
        const icon = hamburgerBtn.querySelector('i');
        icon.className = mobileNav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { mobileNav.classList.remove('open'); hamburgerBtn.querySelector('i').className = 'fas fa-bars'; });
    });
    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('open');
            hamburgerBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Resume button (delegated)
document.addEventListener('click', function(e) {
    if (e.target.id === 'resumeViewBtn' || e.target.closest('#resumeViewBtn')) {
        e.preventDefault();
        openModal('modal-resume');
    }
});

// Load initial section
const initial = window.location.hash.slice(1) || 'home';
if (sections.includes(initial)) {
    navigateTo(initial);
} else {
    navigateTo('home');
}

// Expose renderCertifications globally (for re-render on navigation)
window.renderCertifications = renderCertifications;

// Hide loading screen
window.hideLoadingScreen && window.hideLoadingScreen();