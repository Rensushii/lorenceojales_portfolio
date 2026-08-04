# Lorence B. Ojales — Portfolio (v2)

A restructured, redesigned rebuild of the original single-page portfolio. Same
features, same data, modular files, cleaner UI.

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production / deployment:

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally to sanity-check it
```

## 1. Add your assets (required before anything renders correctly)

Only `index.html` was provided as source — no image or PDF assets came with
it, so the folders below are currently empty (each has a `.gitkeep` so Git
tracks them). Drop your files in using **exactly** these paths — every path
in the code already points here unchanged from the original:

```
public/
  resume.pdf                              ← delete resume.placeholder.txt, add the real file
  images/
    profile/
      barong.png                          ← used by the fluid hero effect (start state)
      toga.png                            ← used by the fluid hero effect (end state)
    projects/
      tugonlipa/   tugon1.jpg … tugon8.jpg
      ecoflow/     ecoflow1.jpg … ecoflow10.jpg
      mazebot/     (referenced via the embedded 3D viewer only — no gallery images needed)
      genbacheck/  genbacheck1.jpg … genbacheck5.jpg
      nyc/         nyc1.jpg … nyc9.jpg
    achievements/
      hackathon.jpg
      breadboarding.jpg
      programming.jpg
    certifications/
      ieee-tinytapeout.jpg, network-support-security.jpg, digital-safety.jpg,
      intro-modern-ai.jpg, ethical-hacker.jpg, cybersecurity-framework.jpg,
      tugon-lipa-hackathon.jpg, batangas-ai-cybersecurity.jpg, cyber-101.jpg,
      ai-prompt-engineering.jpg, hybrid-drone.jpg, medical-imaging-ai.jpg,
      ccna-intro-networks.jpg, tech-nexus-2024.jpg
```

Everything under `public/` is served from the site root, so
`public/images/profile/barong.png` becomes `/images/profile/barong.png` —
identical to the original file's paths.

## 2. Where things live

```
portfolio/
├── index.html                  Shell: <head> + empty #app mount point
├── vite.config.js
├── package.json
├── public/                     Static assets served as-is (images, resume.pdf, favicon)
└── src/
    ├── main.js                 Composes every section + boots every feature, in order
    ├── styles/                 One file per concern, imported by styles/main.css
    │   ├── variables.css       Design tokens (colors, spacing, radii, motion) — edit palette here
    │   ├── base.css            Reset, typography, .reveal/.stagger animation classes
    │   ├── loading.css / nav.css / hero.css / sections.css / cards.css /
    │   │   timeline.css / modals.css / misc.css (lightbox, contact form, footer)
    ├── sections/                One HTML partial per section (plain markup, no framework)
    │   ├── loading.html, nav.html, hero.html, about.html, experience.html,
    │   │   projects.html, achievements.html, skills.html, certifications.html,
    │   │   contact.html, footer.html, project-modals.html, misc-modals.html
    ├── data/
    │   ├── achievements.js      Achievement modal content (title, venue, date, body HTML)
    │   └── certifications.js    Certification grid entries + category filter labels
    └── js/                      One module per feature, each exports an init function
        ├── state.js             Shared helpers: modal open/close, scroll lock, device checks
        ├── loading.js            Loading screen timing/fade-out
        ├── nav.js                Sticky header, mobile slide-in menu, smooth scroll, active link
        ├── spotlight.js          Cursor spotlight glow + magnetic hover buttons (desktop only)
        ├── typewriter.js         Role-switcher typing animation in the hero
        ├── reveal.js             Scroll-triggered fade-ins (IntersectionObserver)
        ├── tilt.js               3D tilt on cards + project image parallax + shine sweep
        ├── lightbox.js           Fullscreen image viewer for gallery/certification images
        ├── certifications.js     Renders + filters the certifications grid
        ├── achievements.js       Populates the achievement detail modal from data/achievements.js
        ├── modals.js             Escape/click-outside-to-close, resume button, footer year
        ├── contactForm.js        EmailJS submission handling
        ├── lightRays.js          Three.js shader: light rays behind the hero portrait
        └── fluidHero.js          Three.js shader: the barong→toga cursor-fluid reveal effect
```

Partials are plain HTML strings pulled in via Vite's `?raw` import and
concatenated into `#app` in `main.js` — no build-time templating engine, so
what you see in each `.html` file is exactly what ends up on the page.

## 3. What still works exactly as before

- Barong → toga fluid cursor-reveal effect in the hero (with the same idle
  auto-sweep behavior after 2s of no mouse movement).
- Cursor spotlight glow, light-rays shader behind the portrait, magnetic
  buttons, 3D tilt on cards, idle "shine sweep" on cards.
- Full modal system (5 project modals, achievement modal, resume viewer),
  the image lightbox with keyboard navigation, and the certification filter
  bar.
- Contact form via EmailJS (same service/template/public IDs as the
  original — update the three constants at the top of `src/js/contactForm.js`
  if you rotate keys).
- Loading screen with the same minimum-duration logic.

Three.js and EmailJS are loaded from CDN at runtime (same as the original
inline `<script>` tags) rather than bundled as npm dependencies, to keep the
diff from your original approach minimal. If you'd rather bundle them via
`npm install three @emailjs/browser` and `import` them directly, that's a
drop-in swap in `main.js` / `lightRays.js` / `fluidHero.js` / `contactForm.js`.

## 4. UI/UX changes made in the redesign

- **Visual language**: replaced the busier gradient/glow-heavy original with
  a restrained dark navy/charcoal palette (`variables.css`), a single cyan→
  blue accent gradient, and softer shadows — noise reduced, contrast kept
  high (WCAG-friendlier text colors, 44–48px touch targets on mobile).
- **Typography**: Inter for UI text, JetBrains Mono for labels/eyebrows/tags,
  consistent type scale via `clamp()` for fluid sizing.
- **Navigation**: sticky bar that gains a blurred background only after
  scrolling past 20px (instead of always-on chrome), animated underline on
  the active/hovered link, and a full-height slide-in panel with backdrop on
  mobile instead of a dropdown.
- **Hero**: full-height on desktop with the portrait on the right and copy
  on the left; on mobile it collapses to a shorter, stacked, portrait-first
  layout so the fold isn't dominated by empty space.
- **Projects**: converted from a vertical stack to a responsive
  `auto-fit` grid of cards with a dark gradient overlay that reveals a short
  description, tech tags, and a "view details" affordance on hover/focus.
- **Timeline**: horizontal dot-per-entry layout on desktop (space
  permitting), collapsing to a clean left-bordered vertical list on mobile.
- **Motion**: kept every original effect but tuned durations/easings to feel
  calmer, added `prefers-reduced-motion` handling throughout, and added a
  progressive-enhancement cross-fade via the View Transitions API on
  in-page navigation (falls back silently to normal smooth-scroll where
  unsupported).
- **Accessibility**: visible focus rings, larger form/button hit areas,
  `aria-expanded`/`aria-label`s on the menu and modal close buttons, and all
  color combinations re-checked for contrast against the darker palette.

## 5. Data you may want to move further

`data/achievements.js` and `data/certifications.js` are already separated
out of the markup and JS logic (per the original request, they're kept as
JS modules — trivial to rename to `.json` and `import ... assert { type:
'json' }` if you prefer, no other code changes needed).
