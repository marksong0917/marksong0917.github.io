# Mark Song — Portfolio

Short one-page portfolio for Ze (Mark) Song, programmer & web developer in Aurora, Ontario, Canada.

Showcase order: 1. Foxuma · 2. Newood Millwork · 3. York Region Web Studio · 4. Havenwest Closets · 5. Shadowrocket Servers (private infrastructure, no public link) · 6. Mir2 Game Server (private, no public link).

## Foxuma demo (`/demo/`)

Interactive demo with sample data only — dashboard, projects, invoices, and the Fox assistant. Linked from the portfolio's Foxuma section as "Try the demo".

For foxuma.com: the same demo should be linked from the Foxuma homepage and pricing as "Try the demo", so clients can play with it before they buy. Recommended placement: hero secondary button + pricing section button, pointing at the demo (this static version can be hosted as-is, or replaced by the live demo account).

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
