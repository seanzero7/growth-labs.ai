# Growth Labs AI — Website

A single-page static website for **Growth Labs AI**, an AI-native marketing studio building organic distribution engines for consumer brands and apps.

Pure HTML/CSS/JS — no frameworks, no build step. Ready for GitHub Pages and a custom domain.

## Structure

```
GROWTH_LABS_AI/
├── index.html        # The full one-page site (all sections)
├── 404.html          # Themed "page not found" page
├── css/style.css     # Design system + all styling
├── js/main.js        # Canvas network, counters, reveals, terminal, nav
├── assets/
│   └── favicon.svg   # Gradient growth-constellation mark
├── .nojekyll         # Tells GitHub Pages to skip Jekyll processing
└── README.md
```

Sections on the page: Hero (with live "growth console") → platform marquee → stats → What We Do → Why AI-Native (with animated engine terminal) → Growth Stack → Careers (3 roles + India panel) → Client CTA → Final CTA / Contact → Footer.

## Preview locally

Just open `index.html` in a browser, or serve it:

```bash
cd GROWTH_LABS_AI
python3 -m http.server 4317
# → http://localhost:4317
```

## Deploy to GitHub Pages

The site lives at [github.com/seanzero7/growth-labs.ai](https://github.com/seanzero7/growth-labs.ai) and is served by GitHub Pages from the `main` branch, `/ (root)` folder.

Live preview URL (until the custom domain is connected):
**https://seanzero7.github.io/growth-labs.ai/**

To publish changes:

```bash
cd GROWTH_LABS_AI
git add .
git commit -m "Update site"
git push
```

All paths in the site are relative, so it works at the `/growth-labs.ai/` subpath now and at the root domain later with no changes.

## Connect the custom domain (growth-labs.ai)

1. In the repo: **Settings → Pages → Custom domain** → enter `growth-labs.ai` and save. GitHub creates a `CNAME` file in the repo automatically. (Don't add the CNAME file before DNS is ready — it redirects the github.io URL immediately.)
2. At your DNS provider (wherever growth-labs.ai is registered), add:

   | Type  | Host | Value |
   |-------|------|----------------------|
   | A     | `@`  | `185.199.108.153` |
   | A     | `@`  | `185.199.109.153` |
   | A     | `@`  | `185.199.110.153` |
   | A     | `@`  | `185.199.111.153` |
   | CNAME | `www`| `seanzero7.github.io` |

3. Wait for DNS to propagate (minutes to a few hours), then check **Enforce HTTPS** in the Pages settings.

Note: the `Back to Growth Labs AI` link on `404.html` points to `/`, which is correct once you're on a custom domain (or a `<username>.github.io` root site). While previewing at a `/repo-name/` subpath it will point to the wrong root — fine to ignore during the temporary phase.

## Before launch — placeholders to update

- **Email addresses** — all contact links point to `trilogylabsllc@gmail.com`. To switch to domain email later (e.g. `hello@growth-labs.ai`), find-and-replace in `index.html`.
- **Metrics** — the hero console numbers (12.4M views, 38.2K installs, etc.) and the stats band (10×, 1,000+, 24/7, 100%) are illustrative placeholders. Swap in real numbers as you have them.
- **Social links** — the LinkedIn / Instagram / X links in the footer are `#` placeholders.
- **OG image (optional)** — add a 1200×630 PNG and reference it with `<meta property="og:image" content="...">` in `<head>` for richer link previews.
- **Analytics (optional)** — paste your Plausible / GA4 snippet just before `</head>` in `index.html`.
