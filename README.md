# pugtools

Static landing page for the `pugtools` hub: a lightweight homepage that points players to practical Minecraft utilities like Circle Generator, Curve Generator, Enchant Optimizer, Mob Dub, and Potions Plus.

## What this repo contains

- A simple static homepage in [index.html](/home/actualpug/dev/pugtools/index.html)
- Styling for the landing page in [home.css](/home/actualpug/dev/pugtools/home.css)
- Shared client-side behavior and metadata loading in [site.js](/home/actualpug/dev/pugtools/site.js)
- Tool metadata in [shared/tools.json](/home/actualpug/dev/pugtools/shared/tools.json)
- Analytics helpers in [shared/analytics.js](/home/actualpug/dev/pugtools/shared/analytics.js)
- Preview images and social assets in `images/` and `social-card.svg`

This repo is the hub site, not the individual tool implementations. Each live tool links out to its own path and source repo.

## Current tools

- `Mob Dub`
- `Potions Plus`
- `Circle Generator`
- `Enchant Optimizer`
- `Curve Generator`
- `Conversion Studio`

Coming soon:

- `Palette Builder`

## Local preview

There is no build step or package manager setup for this repo. Open it with any static file server from the project root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing notes

- Update homepage copy and layout in `index.html` and `home.css`
- Update shared tool metadata in `shared/tools.json`
- Keep homepage cards and manifest entries aligned when tools are added, renamed, or removed
- `site.js` includes a fallback manifest so the site can still render if `shared/tools.json` fails to load

## Deployment

This repo is intended to be published as a static site, typically through GitHub Pages. Pushing `main` updates the source for the landing page repo.
