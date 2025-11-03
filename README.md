<div align="center">
  <a href="https://moonshot.hackclub.com" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/35ad2be8c916670f3e1ac63c1df04d76a4b337d1_moonshot.png" 
         alt="This project is part of Moonshot, a 4-day hackathon in Florida visiting Kennedy Space Center and Universal Studios!" 
         style="width: 100%;">
  </a>
</div>

# Robijn Fotografie Portfolio

Beau Robijn’s photography portfolio and booking site, built with SvelteKit. The app highlights editorial work, supports simple lead capture, and ships with an admin console for managing copy and assets without redeploying.

## Features
- Home, About, Portfolio, and Contact pages driven by structured defaults (`app/defaults.json`) merged with runtime overrides (`overrides.json`).
- Protected admin dashboard (`/admin`) with live editing, drag-and-drop ordering, and image uploads stored under `CONTENT_DIR/uploads`.
- Responsive navigation with a collapsible mobile menu and softened typography/grids for smaller breakpoints.
- Case study cards, multi-voice testimonials, and optional video embeds on the About page.
- Nodemailer-powered contact form with configurable transports and Playwright/Vitest coverage.
- XML sitemap (`/sitemap.xml`), tuned `robots.txt`, and canonical meta tags for basic SEO.
- Docker multi-stage build for production and `docker-compose.yml` for local container runs.

## Tech Stack
- SvelteKit 2 + Vite 7, Svelte 5 runes API, Tailwind CSS 4 utilities.
- Node 20 runtime (both dev and Docker image).
- Playwright (e2e) and Vitest (unit) included but optional.
- Nodemailer for transactional email delivery.

## Getting Started
```bash
npm install          # installs root and app dependencies
npm run dev          # launches the SvelteKit dev server on http://localhost:5173
```
Use `npm run build` for a production build and `npm run preview` to inspect the output locally.

### Environment Variables
Copy `app/.env.example` (if present) or create `app/.env` with:

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password for `/admin` login (default: `robijnstudio`). |
| `CONTENT_DIR` / `CONTENT_FILE` | Optional custom storage path/file for `overrides.json` and uploads. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` | Nodemailer transport configuration. |
| `EMAIL_TRANSPORT` | Optional (`json`) to emit messages to stdout for tests or staging. |
| `EMAIL_FROM`, `EMAIL_TO` | Override mail sender and recipient addresses. |
| `PUBLIC_SITE_URL` (preferred) or `SITE_URL` / `BASE_URL` | Sets canonical URLs and sitemap origin. |

After configuring SMTP values, submit the contact form to verify mail delivery.

## Admin Console
1. Visit `/admin`.
2. Log in with the configured password.
3. Adjust copy, add portfolio entries, or upload media. Changes persist to `overrides.json` (stored wherever `CONTENT_DIR`/`CONTENT_FILE` point).

Uploads are saved under `<CONTENT_DIR>/uploads` and exposed publicly via `/uploads/<filename>`, so avoid storing sensitive files there.

## SEO & Meta
- `app/static/robots.txt` blocks `/admin` and lists the sitemap.
- `/sitemap.xml` is generated server-side and cached for one hour.
- The root layout inserts canonical links, Open Graph defaults, a Twitter card, and theme color metadata.

## Testing
- `npm run check` for TypeScript + Svelte diagnostics.
- `npm run test:unit` for Vitest suites.
- `npm run test:e2e` to execute Playwright tests (set `EMAIL_TRANSPORT=json` and install browsers with `npx playwright install`).

## Deployment
- Production image `Dockerfile` builds SvelteKit, installs production dependencies, and runs `node build`.
- `docker-compose.yml` maps port `3013 -> 3000` locally and mounts a volume (`content-data`) so content and uploads survive container restarts.
- Ensure environment variables (especially SMTP and `PUBLIC_SITE_URL`) are provided in your hosting platform or Docker compose file.

## Production Considerations
- **Image optimisation**: The site currently serves images from their configured URLs as-is; SvelteKit does not optimise them automatically. For better performance, front the assets with an image CDN (Imgix, Cloudinary, Vercel’s Image Optimization API) or add a resize/compress step to your upload pipeline before storing files in `/uploads`.
- **SSR & admin auth**: The admin area relies on SSR-only cookies (`robijnstudio_admin`). When customising authentication, keep the logic inside server routes/actions to avoid exposing secrets in the client bundle and confirm that endpoints are protected during SSR navigation.
- **Dynamic SEO**: The sitemap and canonical tags use environment-provided hostnames and statically defined routes. If you later move portfolio data into a database or CMS, extend `app/src/routes/sitemap.xml/+server.ts` and per-page `load` functions to enumerate dynamic slugs so search engines discover them.
- **Safe uploads**: Upload handlers already whitelist MIME types and cap files at 5 MB. For additional hardening, consider scanning uploads (e.g., via ClamAV), generating responsive derivatives, and serving files from an isolated CDN bucket to avoid executing user content on the app server.
- **Automation & future-proofing**: Combine `npm run check`, Vitest, and Playwright in CI to guard against regressions. Containerise deployments (via the existing Dockerfile) so upgrades to Node or SvelteKit are explicit, and source control `.env.example` with any new settings you introduce to keep environments aligned.

## Contributing
Pull requests are welcome. Please run `npm run check` before submitting changes and keep the content schema (`app/src/lib/types/content.ts`) in sync with any new fields exposed in the UI.
