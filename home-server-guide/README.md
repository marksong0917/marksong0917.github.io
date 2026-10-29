# Home Server Guide

**Turn Your Old PC Into a 24/7 Home Server** — a step-by-step public guide to running your own private proxy / remote-access server at home, written from a real working setup.

- Two services: **Xray** (VLESS + REALITY, TCP 443) as the daily driver and **Hysteria2** (UDP 443, obfs) as the fast lane
- Installed as real auto-start services (WinSW on Windows, systemd on Linux), restart on failure, back on their own after a power cut
- A separate account per device, clients for iOS / Android / Windows (Shadowrocket, v2rayNG, v2rayN)
- A small watchdog for upkeep, plain security rules, and honest notes on cost and limits

**Privacy:** every address, key, UUID and password in the guide is a placeholder. No real server details are published — generate your own.

## Run locally

```bash
cd home-server-guide
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish on GitHub Pages

1. Create a public repo named `home-server-guide` on github.com/marksong0917 and push these files to its `main` branch.
2. Repo Settings → Pages → Deploy from branch `main` / root.
3. The site goes live at https://marksong0917.github.io/home-server-guide/

No build step. Plain HTML/CSS/JS.
