# Robijn Fotografie Portfolio – Project Guide

## 1. Product Overview
- **Brand story**: Presents Beau Robijn’s photography portfolio with a calm, editorial aesthetic that highlights portraiture, documentary work and bookings.
- **Core sections**: Home (hero + positioning), About (bio, stats, projects, testimonial), Portfolio (responsive gallery with lightbox), Contact (packaged enquiry form with email hand-off), and an Admin area to edit everything without redeploying.
- **Tech stack**: SvelteKit 2 + Vite 7, Svelte 5, Tailwind CSS 4 utilities in `app/src/app.css`, Node 20 runtime, Nodemailer for transactional email, Dockerized deployment.

## 2. Content Model & Storage
- Structured content lives in `app/content.json` and is typed by `app/src/lib/types/content.ts`.
- `readContent`/`writeContent` (`app/src/lib/server/content.ts`) wrap file I/O and respect overrides:
  - `CONTENT_FILE` → absolute JSON file, e.g. for secrets mounts.
  - `CONTENT_DIR` → alternate directory; file becomes `<dir>/content.json`.
- First write ensures the target file exists by copying the repo default.
- Admin uploads use the same `CONTENT_DIR` to keep text and media together under `<content_dir>/uploads`.

## 3. Routing & Pages
- **Layout (`app/src/routes/+layout.svelte`)**: Injects global styles, favicon, header/footer on every public route; hides the header inside `/admin`.
- **Home (`/`, `app/src/routes/+page.svelte`)**:
  - Pulls `home` content and renders hero, two CTA cards, availability block and optional CTA list.
  - Primary action emphasized with pill button; secondary link flows to About.
- **About (`/about`, `app/src/routes/about/+page.svelte`)**:
  - Explains Beau’s background with paragraphs, three stat cards, project list with external links, portrait image and testimonial block.
- **Portfolio (`/portfolio`, `app/src/routes/portfolio/+page.svelte`)**:
  - Responsive grid varies by `gallery[].size`; opens `Lightbox` component for fullscreen view supporting Escape/overlay click to close.
- **Contact (`/contact`, `app/src/routes/contact/+page.svelte`)**:
  - Form collects name, email, package choice and message.
  - On submit, server action (`+page.server.ts`) validates input, sends email via Nodemailer, reports success/failure states, and reveals confirmation UI.
- **Uploads (`/uploads/[...path]`, `app/src/routes/uploads/[...path]/+server.ts`)**:
  - Streams uploaded files with cache headers, validating path traversal and MIME types.

## 4. Admin Console (`/admin`)
- **Authentication**: Password form POSTs to `?/login`; verifies against `ADMIN_PASSWORD` env (defaults to `robijnstudio`). Success sets signed cookie `robijnstudio_admin` for 8 hours (`app/src/lib/server/admin.ts`).
- **Content editing UI** (`app/src/routes/admin/+page.svelte`):
  - Preloads editable clone of `SiteContent`.
  - Provides add/remove helpers for CTA items, about paragraphs/stats/projects, gallery items, contact bullets and packages.
  - On submit, serializes the entire `content` object into hidden `payload`.
  - Form posts to `?/save`; server revalidates auth, parses JSON and calls `writeContent`.
  - Logout via `?/logout` clears the cookie.
- **Media uploads** (`app/src/routes/admin/upload/+server.ts` + `UploadDropzone.svelte`):
  - Accepts image `File`, checks ≤5 MB and MIME whitelist, names files `<timestamp>-<uuid>.<ext>`, persists under `CONTENT_DIR/uploads`, and returns `/uploads/<filename>` URL.
  - Client dropzone supports drag-and-drop, status messaging, and auto-updates bound input field.

## 5. Email Delivery
- Nodemailer transport configured in `app/src/routes/contact/+page.server.ts`.
- Environment knobs:
  - `SMTP_HOST` (required), `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`.
  - `EMAIL_FROM` overrides friendly from name; fallbacks use `SMTP_USER`.
  - `EMAIL_TO` overrides default recipient (`nick.esselman@gmail.com`).
- Emails include both plain text and HTML, and set `replyTo` to the visitor’s provided email.

## 6. Styling & UI System
- Tailwind CSS 4 plugins (`@tailwindcss/forms`, `@tailwindcss/typography`) declared in `app/src/app.css`.
- Fonts set via CSS variables (`Space Grotesk`, `Bricolage Grotesque`) to keep consistent letter spacing; `.font-lifted` utility adds wide tracking used for uppercase meta labels.
- Components (`app/src/lib/components`):
  - `Header` dynamic nav highlighting via `$page.url`.
  - `Footer` with social/email links and dynamic year.
  - `PageTagline` re-usable uppercase intro label.
  - `Lightbox` overlay handles keyboard events.
  - `UploadDropzone` used only in Admin.

## 7. Tooling & Commands
- **Root scripts** (`package.json`):
  - `npm run dev|build|preview|check|format|lint|test` proxy to the `app` package.
- **App-level scripts** (`app/package.json`):
  - Vite dev server (`npm run dev`) on default port 5173.
  - `npm run check` for TypeScript + Svelte diagnostics.
  - `npm run test:e2e` uses Playwright; `npm run test:unit` uses Vitest.
- **Docker workflow**:
  - Multi-stage build compiles SvelteKit into `/work/build`, installs prod deps, copies `content.json`.
  - Runtime sets `CONTENT_DIR=/app/storage` and exposes volume `content-data` in `docker-compose.yml`. Uploads persist across deploys because `/app/storage` is mounted.

## 8. Environment Setup Checklist
1. Install dependencies at repo root: `npm install` (installs top-level and `app` via npm workspace prefix).
2. Copy `app/.env.example` (if present) or define:
   - `ADMIN_PASSWORD`, `CONTENT_DIR`/`CONTENT_FILE` (optional),
   - `SMTP_*`, `EMAIL_FROM`, `EMAIL_TO`.
3. Start locally: `npm run dev` (or `npm --prefix app run dev`), then visit the routes.
4. Access admin: `http://localhost:5173/admin`, log in with configured password, update content, upload media.

## 9. Extending the Portfolio
- To add new sections or fields, extend `SiteContent` types, update `content.json`, adjust admin form bindings, and expose the data on the relevant page.
- For additional media types (e.g., video), update `ALLOWED_MIME_TYPES`, add player component in front-end, and amend admin upload validations.
- Consider wiring analytics or SEO by expanding `<svelte:head>` metadata per route.

## 10. Operational Notes
- Content writes happen on every save; ensure file permissions wherever `CONTENT_FILE`/`CONTENT_DIR` point.
- For CI/CD, run `npm run check` and relevant tests; SvelteKit build is output to `app/build` and run with `node build`.
- Uploaded assets are public; sensitive files should not be stored there.
- If SMTP credentials are absent, contact form will fail fast and surface an error message to visitors—validate configuration in staging before going live.

## 11. SEO & Discovery
- `app/static/robots.txt` allows global crawling while blocking `/admin` and advertises the sitemap at `https://robijnstudios.nl/sitemap.xml`.
- Optional Apache helpers live in `app/static/.htaccess` (HTTPS redirect, caching headers, security guards); ignored in pure Node setups but handy if fronted by Apache.
- `app/src/routes/sitemap.xml/+server.ts` emits a fresh XML sitemap for key pages. Set `PUBLIC_SITE_URL` (preferred) or `SITE_URL`/`BASE_URL` in the environment to control canonical origins; it falls back to the request origin otherwise.
- Global `<svelte:head>` now injects canonical links, Open Graph defaults, a Twitter card, and a theme color via `app/src/routes/+layout.svelte`.
This document should give future contributors (or AI “agents”) enough context to understand how the portfolio is structured, where to adjust content, and how to operate or extend the system end-to-end.
