# Trade Estimator — Demo

An interactive kitchen / closet cost estimator a shop puts on its website.
The visitor plays, gets an instant price **range**, then leaves contact details.
Result first, contact after.

This is a **demo for shop owners**: sample brand "Maple Works Studio",
sample prices only, clearly labelled. Nothing is sent anywhere — the lead
form just shows what the live version does.

**The pitch:** "Your customers get a price in about a minute, you get the lead."
Sold as a York Region Web Studio add-on for Foxuma shops.

## Run it locally

```bash
cd ~/workspace/trade-estimator
python3 -m http.server 8942
# open http://127.0.0.1:8942/
```

## Publish

Intended home: the `estimator/` folder inside the personal-portfolio repo
(the marksong0917.github.io user site), live at:

https://marksong0917.github.io/estimator/

All links and paths in the site are relative, so it works under any subpath.
Only external request is Google Fonts.

## Sample rate table (demo only — a real shop loads its own prices)

Base rates, CAD per metre:

| Type    | Base range / m | Standard | Premium | Luxury |
|---------|---------------:|---------:|--------:|-------:|
| Kitchen | $1,800 – $2,600 | × 1.0 | × 1.5 | × 2.2 |
| Closet  |   $900 – $1,400 | × 1.0 | × 1.4 | × 1.9 |

Size: kitchen 2–10 m of cabinet run; closet 1–6 m wide (0.5 m steps).

Extras (flat sample amounts, CAD):

| Extra | Kitchen | Closet |
|-------|--------:|-------:|
| Stone countertop | $2,400 – $3,600 | — |
| Island | $3,500 – $5,500 | — |
| Organizers & dividers | — | $500 – $800 |
| Bank of drawers | — | $900 – $1,400 |
| Soft-close everything | $600 – $900 | $400 – $650 |
| Lighting (under-cabinet / built-in) | $450 – $750 | $400 – $700 |

Total = (size × base × level multiplier) + selected extras, shown as a range.

## Worked example (used in verification)

Kitchen, 5 m, Premium, stone countertop + island:

- Base: 5 × $1,800–$2,600 = $9,000 – $13,000; × 1.5 → **$13,500 – $19,500**
- Stone: + $2,400 – $3,600 → $15,900 – $23,100
- Island: + $3,500 – $5,500 → **$19,400 – $28,600** ✅ shown on the page

## Files

- `index.html` — the one-page estimator
- `styles.css` — family look (white, navy #0d1526, orange #e85d1f, Sora + Inter)
- `script.js` — live price calculation + demo lead form
- `.nojekyll` — serve files as-is on GitHub Pages
