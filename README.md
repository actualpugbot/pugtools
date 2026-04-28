# pugtools

Static landing page for the `pugtools` hub: a lightweight homepage that points players to practical Minecraft utilities like Circle Generator, Curve Generator, Enchant Optimizer, Mob Dub, Mob Voice Over, and Potions Plus.

This repo is being prepared to become the host repo for those tools, but the individual tool pages are not imported here yet.

## What this repo contains

- A simple static homepage in [index.html](/home/actualpug/dev/pugtools/index.html)
- Styling for the landing page in [home.css](/home/actualpug/dev/pugtools/home.css)
- Shared client-side behavior and metadata loading in [site.js](/home/actualpug/dev/pugtools/site.js)
- Tool metadata and future import targets in [shared/tools.json](/home/actualpug/dev/pugtools/shared/tools.json)
- Analytics helpers in [shared/analytics.js](/home/actualpug/dev/pugtools/shared/analytics.js)
- Preview images and social assets in `images/` and `social-card.svg`

The `tools/` folder is not a tool directory yet. Its current index file redirects back to the homepage until tools are imported individually.

## Current tools tracked for import

- `Mob Dub` from `../mob-dub` (`vite-react`)
- `Mob Voice Over` from `../mob-voice-over` (`static`)
- `Potions Plus` from `../potions-plus` (`static`)
- `Circle Generator` from `../circle-generator` (`static`)
- `Enchant Optimizer` from `../enchant-optimizer` (`static`)
- `Curve Generator` from `../curve-generator` (`static`)

Also tracked for later decisions:

- `Conversion Studio`
- `Palette Builder`

## Local preview

There is no build step or package manager setup for this repo. Open it with any static file server from the project root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Future import shape

`shared/tools.json` now records each tool's current public `path`, source repo, local sibling path, runtime type, and future `importTarget`. Do not create an import target folder until that specific tool is being moved into this repo.

Static tools can be imported as plain files under their target folder. Vite or React tools, such as `mob-dub`, should keep their package boundary when imported. Add a root workspace only when the first package-based tool actually moves in.

## Editing notes

- Update homepage copy and layout in `index.html` and `home.css`
- Update shared tool metadata in `shared/tools.json`
- Keep homepage cards and manifest entries aligned when tools are added, renamed, imported, or removed
- `site.js` includes a fallback manifest so the site can still render if `shared/tools.json` fails to load

## Deployment

This repo is intended to be published as a static site, typically through GitHub Pages. Pushing `main` updates the source for the landing page repo.
