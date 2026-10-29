# York Region Web Studio — Template Pack

Three premium starting designs for client websites. Each template is a complete one-page site, proven in structure (hero, services, work, about, testimonials, contact) and styled for one kind of business. A client site is never shipped as a raw template — the template is the starting point; the studio customizes it by hand until it reads as a custom build.

| Template | Folder | For | Look |
|---|---|---|---|
| Millwork | `t1-millwork/` | Cabinetry, kitchens, custom millwork shops | Warm wood + charcoal, serif display (Fraunces) |
| Closets | `t2-closets/` | Closets, wardrobes, storage companies | Light and airy, soft neutrals, elegant serif (Cormorant Garamond) + Jost |
| Trades | `t3-trades/` | General contractors, renovators | Bold dark + amber accent, heavy sans (Archivo) |

The gallery (`index.html`) shows all three and links to each live template.

## How a client site is produced from a template

1. **Pick** the template closest to the client's business.
2. **Brand** — swap the sample business name, logo/wordmark, and contact email. Emails in the templates are `.example` placeholders on purpose; replace before launch.
3. **Colours** — adjust the palette variables at the top of that template's `styles.css` (`:root`) to the client's brand colours. Type pairing stays unless the client has their own.
4. **Copy** — replace headlines and section text with the client's services, areas, and story. Keep it short: Mark's standard is modern, simple, clean, minimal text.
5. **Photos** — replace the CSS visual panels (`.work` tiles and any hero panel) with the client's real project photos as background images.
6. **Contact rule** — email only. No phone numbers anywhere on the site.
7. **Review** — the client sees and approves the finished site before it goes live.

Sample businesses used in the templates: Ashford Millwork Co. (T1), The Closet Atelier (T2), Northgate Contracting (T3). All copy and numbers are sample content.

## Run locally

```bash
cd yrws-template-pack
python3 -m http.server 8000
# gallery: http://localhost:8000  ·  templates: /t1-millwork/ /t2-closets/ /t3-trades/
```

## Publish on GitHub Pages

1. Create a public repo named `yrws-template-pack` under github.com/marksong0917.
2. Push these files to its `main` branch.
3. Repo Settings → Pages → Deploy from branch `main` / root.
4. Live at https://marksong0917.github.io/yrws-template-pack/

No build step. Plain HTML/CSS.
