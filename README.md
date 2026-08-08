# Lorence B. Ojales — Portfolio (Next.js 14)

A production-grade migration of the original static HTML/CSS/JS portfolio to
Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion +
React Three Fiber.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.local` and fill in a real [Resend](https://resend.com) API key to
enable the contact form:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=lorence.ojales@gmail.com
```

Without a key, `/api/contact` returns a 500 and the form shows a "Failed"
state — everything else in the site works normally.

## Assets you still need to add

This repo ships with the full code, but binary assets (images, resume PDF)
are **not included**. Drop your real files into these paths — the
filenames must match exactly, since they're referenced throughout
`app/(sections)/_lib/constants.ts`:

```
public/
├── resume.pdf
├── favicon.ico
└── images/
    ├── profile/
    │   ├── barong.png      # portrait A (fluid effect)
    │   └── toga.png        # portrait B (fluid effect)
    ├── projects/
    │   ├── tugonlipa/tugon-bg.jpg, tugon1.jpg … tugon8.jpg
    │   ├── ecoflow/ecoflow-bg.jpg, ecoflow1.jpg … ecoflow10.jpg
    │   ├── mazebot/mazebot-bg.jpg
    │   ├── genbacheck/genbacheck-bg.jpg, genbacheck1.jpg … genbacheck5.jpg
    │   └── nyc/nyc-bg.jpg, nyc1.jpg … nyc9.jpg
    ├── achievements/
    │   ├── hackathon.jpg
    │   ├── breadboarding.jpg
    │   └── programming.jpg
    └── certifications/
        └── (14 certificate images — see CERTIFICATIONS in constants.ts)
```

## Architecture notes

- **Data** lives in `app/(sections)/_lib/constants.ts` — one source of truth
  for projects, achievements, certifications, experience, and skills.
- **State**: Zustand (`store/useUIStore.ts`) drives which modal is open,
  the gallery lightbox, the certifications filter, and the mobile nav —
  no prop drilling.
- **3D hero portrait**: `components/three/Scene.tsx` composes an animated
  light-ray shader (`LightRays.tsx`) behind an interactive fluid-blend
  effect (`FluidCanvas.tsx`) that cross-fades between `barong.png` and
  `toga.png` based on cursor movement. It's lazy-loaded with
  `next/dynamic({ ssr: false })` and swapped for a static `<Image>` on
  mobile / `prefers-reduced-motion` via `useIsMobile` /
  `usePrefersReducedMotion`.
- **Contact form**: `react-hook-form` + `zod` validate client-side; the
  same Zod schema re-validates server-side in `app/api/contact/route.ts`
  before calling Resend.
- **Accessibility**: modals trap focus, restore focus on close, close on
  `Escape`, and use `role="dialog"` / `aria-modal`. All interactive
  elements are real `<button>`/`<a>` tags.
- **Reduced motion**: every scroll-reveal and hero animation is driven by
  Framer Motion `whileInView`, which respects `prefers-reduced-motion`
  when combined with the `usePrefersReducedMotion` checks used for the 3D
  scene and typewriter effect.

## Scripts

| Command         | Description                     |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start the dev server             |
| `npm run build`  | Production build                 |
| `npm run start`  | Serve the production build       |
| `npm run lint`   | Run ESLint                       |
