document.getElementById('year').textContent = new Date().getFullYear();

// Projects — live statuses (Foxuma first, always)
const projects = [
  { rank: 'No. 2', name: 'Newood Millwork', status: 'Live', cls: 'live', pct: 100, desc: 'Website for a custom cabinetry and millwork manufacturer in Concord, Ontario — clean, premium, built to bring in project enquiries.', link: 'https://newoodmillwork.com', linkText: 'newoodmillwork.com' },
  { rank: 'No. 3', name: 'York Region Web Studio', status: 'Live', cls: 'live', pct: 100, desc: 'My own studio. Premium websites and systems for local small businesses across York Region — one service, priced by written quote.', link: 'https://yorkregionwebstudio.com', linkText: 'yorkregionwebstudio.com' },
  { rank: 'No. 4', name: 'Havenwest Closets', status: 'Live', cls: 'live', pct: 100, desc: 'Website and brand identity for a custom closets and storage company — fully custom, locally built, high-end brand.', link: 'https://havenwestclosets.com', linkText: 'havenwestclosets.com' },
  { rank: 'No. 5', name: 'Shadowrocket Servers', status: 'Running 24/7', cls: 'running', pct: 100, desc: 'Self-hosted private network servers I built on my own hardware — per-device access, encrypted connections, automatic recovery, runs unattended.', link: '', note: 'Private infrastructure — details on request' },
  { rank: 'No. 6', name: 'Mir2 Game Server', status: 'Running 24/7', cls: 'running', pct: 100, desc: 'A self-hosted Legend of Mir 2 (1.76) online game server I built and run — custom configuration, scheduled backups, steady uptime.', link: '', note: 'Private server — details on request' },
  { rank: 'Demo', name: 'Self-Measure Kit', status: 'Live', cls: 'live', pct: 100, desc: 'Homeowners measure their own kitchen or closet and the shop gets a quote-ready summary. A demo of the add-on I build for shops.', link: 'measure-kit/', linkText: 'Try the Self-Measure Kit' },
  { rank: 'Guide', name: 'Windows 11 Min-Max Guide', status: 'Published', cls: 'guide', pct: 100, desc: 'My Windows 11 optimization guide, rewritten as a public site: minimal bloat, maximum performance, step by step.', link: 'https://marksong0917.github.io/win11-optimization-guide/', linkText: 'Read the guide' },
];
const grid = document.getElementById('projectGrid');
projects.forEach((p) => {
  const el = document.createElement('article');
  el.className = 'card reveal';
  el.innerHTML = `
    <div class="card-top"><span class="rank">${p.rank}</span><span class="status ${p.cls}">● ${p.status}</span></div>
    <h4>${p.name}</h4><p>${p.desc}</p>
    <div class="bar"><i style="width:${p.pct}%"></i></div><p class="pct">${p.pct}%</p>
    ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${p.linkText}</a>` : `<p class="note-none">${p.note}</p>`}`;
  grid.appendChild(el);
});

// Build log — recent ships
const log = [
  ['Oct 28', 'Home Server Guide — turn an old PC into a 24/7 private server, published'],
  ['Oct 28', 'Foxuma demo — interactive demo with sample data, shipped'],
  ['Oct 28', 'Windows 11 Min-Max Guide — published on GitHub Pages'],
  ['Oct 28', 'This portfolio — rebuilt as a live dashboard, launched'],
  ['Oct 28', 'Foxuma — new homepage and public registration live at foxuma.com'],
];
const ul = document.getElementById('buildLog');
log.forEach(([t, s]) => {
  const li = document.createElement('li');
  li.innerHTML = `<time>${t}</time><span>${s}</span>`;
  ul.appendChild(li);
});

// Reveal on scroll
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.1 });
  items.forEach((el) => io.observe(el));
} else { items.forEach((el) => el.classList.add('in')); }
