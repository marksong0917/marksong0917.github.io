# Mark Song — Portfolio (dashboard style)

Ze (Mark) Song's portfolio as a live dashboard: sidebar identity card, KPI strip, Foxuma featured, all projects with live status + progress, tech stack, about, contact. One page — portfolio and personal dashboard in one. Sub-pages: /measure-kit/ (Self-Measure Kit demo), /estimator/, /case-study/, the 13 mini-apps, and the guides.

Showcase order: 1. Foxuma · 2. Shadowrocket Servers (private infrastructure, no public details) · 3. Mir2 Game Server (private, no public link) · 4. Newood Millwork · 5. York Region Web Studio · 6. Havenwest Closets.

## Foxuma

The public demo page (`/demo/`) was removed on 2026-11-01 — Foxuma's only try path is the 7-day free trial at [foxuma.com](https://foxuma.com). Nothing public links to a demo anymore.

## Run locally

```bash
cd personal-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish on GitHub Pages

Option A — user site (recommended, cleanest link):
1. Create a public repo named `marksong0917.github.io` on github.com/marksong0917.
2. Push these files to its `main` branch.
3. The site goes live at https://marksong0917.github.io

Option B — project site:
1. Push these files to any public repo, e.g. `portfolio`.
2. Repo Settings → Pages → Deploy from branch `main` / root.
3. The site goes live at https://marksong0917.github.io/portfolio/

No build step. Plain HTML/CSS/JS.

© 2026 Ze (Mark) Song — source-available under the PolyForm Noncommercial License 1.0.0; see LICENSE.
