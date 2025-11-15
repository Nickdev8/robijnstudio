# Robijn Fotografie

Ok so this repo is you Robijn’s photo portfolio + booking thing. I put it together with SvelteKit because it was fast and the colors looked decent out of the box. The site is mostly static but there’s a tiny admin room so you can shuffle copy, upload new sets, and not ping me every sunday night. Live/Production version’s hanging out on https://robijnfotografie.nl

## What's actually in here
- Home / About / Portfolio / Contact pulled from `app/defaults.json`, then patched at runtime with whatever lives in `overrides.json`.
- `/admin` dashboard that lets you edit text blocks, drag cards around, and push photos straight into `CONTENT_DIR/uploads`. Needs a plain password (default is `robijnstudio` unless you change it).
- Contact form pipes through Nodemailer. For tests you can just set `EMAIL_TRANSPORT=json` and it spits emails to stdout.
- Simple SEO bits: robots, sitemap, canonical tags so Google doesn’t freak out.
- Docker stuff already wired (multi-stage build + `docker-compose.yml`) if you like shipping containers more than `npm run dev`.

## Stack / tooling
- SvelteKit 2, Vite 7, Svelte 5 runes, Tailwind 4 classes.
- Node 20 everywhere so there’s no weird mismatch.
- Vitest + Playwright are there. Optional but handy when you don’t want regressions.

## Running it (local)
```bashs
npm install   # grabs deps for root + app
npm run dev   # usually shows up at http://localhost:5173
```
Need a prod-ish build? `npm run build` then `npm run preview`. That’s it, nothing wild.

### Env vars
Copy `app/.env.example` to `app/.env` or roll your own. Things you probably care about:
- `ADMIN_PASSWORD` – password for `/admin`.
- `CONTENT_DIR` / `CONTENT_FILE` – where overrides + uploads live.
- `SMTP_*`, `EMAIL_FROM`, `EMAIL_TO`, `EMAIL_TRANSPORT` – controls mail. Set `json` while testing unless you enjoy spaming clients.
- `PUBLIC_SITE_URL` (or `SITE_URL`/`BASE_URL`) – used for canonical + sitemap. Set it or the links look goofy.
- `NTFY_TOPIC_URL` (or `NTFY_TOPIC` + optional `NTFY_BASE_URL`) – optional. When set, admin saves + uploads ping that ntfy topic with a short summary. Add `NTFY_AUTH_TOKEN` if your topic needs auth. The notifications automatically use `/ruby.png` as their icon; override with `NTFY_ICON_URL` if needed.
- `PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` – optional. When both are set the contact form enforces Google reCAPTCHA in addition to a honeypot + stricter validation, which cuts down on spam bots.

After you drop SMTP creds, hit the contact form once to be sure the mail actually exists.

## Admin bits
Go to `/admin`, log in, edit whatever. It writes to `overrides.json` under the dir you told it to use. Uploads land in `<CONTENT_DIR>/uploads` and get served publicly via `/uploads/foo.jpg`, so please don’t throw secret stuff in there. There’s a 5mb cap and a mime whitelist, but still.

If `NTFY_TOPIC_URL` (or `NTFY_TOPIC`) is configured, every successful save of the admin content + every finished upload sends a push to that ntfy topic. The payload lists which sections changed and, for uploads, the stored filename + total count so you can keep an eye on what moved without logging in.

## SEO / meta
- `app/static/robots.txt` blocks `/admin` and points at the sitemap.
- `/sitemap.xml` gets generated on the server and cached for about an hour.
- Layout injects OG + Twitter tags plus canonical. Nothing fancy, but does the job.

## Tests
- `npm run check` – type + Svelte diagnostics.
- `npm run test:unit` – Vitest.
- `npm run test:e2e` – Playwright (run `npx playwright install` once, and yeah set `EMAIL_TRANSPORT=json` first).

## Deploying
- The `Dockerfile` builds the SvelteKit app, installs prod deps, then runs `node build`.
- `docker-compose.yml` maps 3013→3000 locally and mounts `content-data` so uploaded files don’t vanish when the container restarts.
- Whatever host you use still needs the env vars mentioned earlier. Especially the SMTP + PUBLIC_SITE_URL ones or you’ll chase phantom bugs.

## Stuff to keep in mind
- Images aren’t auto-optimized. Use Cloudinary / Imgix / whatever, or pre-resize before shoving them into `/uploads`.
- Admin auth is cookie-based (`robijnstudio_admin`). Keep secret logic server-side so you’re not leaking anything in the client bundle.
- If you ever move the portfolio into a CMS with slugs, extend `app/src/routes/sitemap.xml/+server.ts` so search engines learn about them.
- Upload handler already sanity-checks mime + size, but feel free to add scanning/compression if you’re paranoid.
- CI idea: run `npm run check`, Vitest, Playwright. Keeps me from hotfixing on a saturday.

## Contributing
Sure, PRs welcome. Please run `npm run check` before sending anything and keep `app/src/lib/types/content.ts` in sync if you add new fields, otherwise the admin UI cries.
