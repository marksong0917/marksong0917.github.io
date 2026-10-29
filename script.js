document.getElementById('year').textContent = new Date().getFullYear();

// Projects — live statuses (Foxuma first, always)
const projects = [
  { rank: 'No. 2', name: 'Newood Millwork', status: 'Live', cls: 'live', pct: 100, desc: 'Website for a custom cabinetry and millwork manufacturer in Concord, Ontario — clean, premium, built to bring in project enquiries.', link: 'https://newoodmillwork.com', linkText: 'newoodmillwork.com' },
  { rank: 'No. 3', name: 'York Region Web Studio', status: 'Live', cls: 'live', pct: 100, desc: 'My own studio. Premium websites and systems for local small businesses across York Region — one service, priced by written quote.', link: 'https://yorkregionwebstudio.com', linkText: 'yorkregionwebstudio.com' },
  { rank: 'No. 4', name: 'Havenwest Closets', status: 'Live', cls: 'live', pct: 100, desc: 'Website and brand identity for a custom closets and storage company — fully custom, locally built, high-end brand.', link: 'https://havenwestclosets.com', linkText: 'havenwestclosets.com' },
  { rank: 'No. 5', name: 'Shadowrocket Servers', status: 'Running 24/7', cls: 'running', pct: 100, desc: 'Self-hosted private network servers I built on my own hardware — per-device access, encrypted connections, automatic recovery, runs unattended.', link: '', note: 'Private infrastructure — details on request' },
  { rank: 'No. 6', name: 'Mir2 Game Server', status: 'Running 24/7', cls: 'running', pct: 100, desc: 'A self-hosted Legend of Mir 2 (1.76) online game server I built and run — custom configuration, scheduled backups, steady uptime.', link: '', note: 'Private server — details on request' },
  { rank: 'Demo', name: 'Self-Measure Kit', status: 'Live', cls: 'live', pct: 100, desc: 'Homeowners measure their own kitchen or closet and the shop gets a quote-ready summary. A demo of the add-on I build for shops.', link: 'measure-kit/', linkText: 'Try the Self-Measure Kit' },
  { rank: 'Demo', name: 'Trade Estimator', status: 'Live', cls: 'live', pct: 100, desc: 'An instant price-range estimator a shop puts on its own website — the customer gets a number in about a minute, the shop gets the lead.', link: 'estimator/', linkText: 'Try the Trade Estimator' },
  { rank: 'Case study', name: 'Foxuma Case Study', status: 'Live', cls: 'live', pct: 100, desc: 'How one system runs a real cabinet shop day to day — projects, orders, invoicing, payroll hours and inventory in one place.', link: 'case-study/', linkText: 'Read the case study' },
  { rank: 'Guide', name: 'Windows 11 Min-Max Guide', status: 'Published', cls: 'guide', pct: 100, desc: 'My Windows 11 optimization guide, rewritten as a public site: minimal bloat, maximum performance, step by step.', link: 'https://marksong0917.github.io/win11-optimization-guide/', linkText: 'Read the guide' },
];
const grid = document.getElementById('projectGrid');
projects.forEach((p, i) => {
  const el = document.createElement('article');
  el.className = 'card reveal';
  el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms'; // cascade the grid in; cleared after reveal so hover stays snappy
  const liveDot = (p.cls === 'live' || p.cls === 'running') ? '<span class="sdot" aria-hidden="true"></span>' : '';
  el.innerHTML = `
    <div class="card-top"><span class="rank">${p.rank}</span><span class="status ${p.cls}">${liveDot}${p.status}</span></div>
    <h4>${p.name}</h4><p>${p.desc}</p>
    <div class="bar"><i style="width:${p.pct}%"></i></div><p class="pct">${p.pct}%</p>
    ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${p.linkText}</a>` : `<p class="note-none">${p.note}</p>`}`;
  grid.appendChild(el);
});

// Build log — recent ships
const log = [
  ['Oct 28', 'Foxuma case study — one system runs this shop, published'],
  ['Oct 28', 'Trade Estimator demo — instant price range, then the lead'],
  ['Oct 28', 'Portfolio v2 — dashboard redesign'],
  ['Oct 28', 'YRWS Template Pack — 3 premium templates (millwork, closets, trades), published'],
  ['Oct 28', 'Self-Measure Kit demo — homeowners measure, shops get a quote-ready summary'],
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
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
      setTimeout(() => { e.target.style.transitionDelay = ''; }, 950);
    }
  }), { threshold: 0.1 });
  items.forEach((el) => io.observe(el));
} else { items.forEach((el) => { el.classList.add('in'); el.style.transitionDelay = ''; }); }

// Scroll progress bar
const progressFill = document.querySelector('.scroll-progress i');
if (progressFill) {
  let ticking = false;
  const paint = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progressFill.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  window.addEventListener('resize', paint);
  paint();
}

// Active nav link follows the scroll position
const navLinks = Array.from(document.querySelectorAll('.side-nav a'));
const spyTargets = [
  ['overview', document.querySelector('.hero')],
  ['projects', document.getElementById('projects')],
  ['services', document.getElementById('services')],
  ['systems', document.getElementById('systems')],
  ['stack', document.getElementById('stack')],
  ['guides', document.getElementById('guides')],
  ['log', document.getElementById('log')],
  ['about', document.getElementById('about')],
  ['contact', document.getElementById('contact')],
].filter(([, el]) => el);
if ('IntersectionObserver' in window && navLinks.length) {
  const visible = new Set();
  const spy = new IntersectionObserver((es) => {
    es.forEach((e) => {
      const id = e.target.getAttribute('data-spy');
      if (e.isIntersecting) { visible.add(id); } else { visible.delete(id); }
    });
    if (!visible.size) { return; }
    let current = null;
    spyTargets.forEach(([id]) => { if (visible.has(id)) { current = id; } });
    if (current) {
      navLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + current));
    }
  }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
  spyTargets.forEach(([id, el]) => { el.setAttribute('data-spy', id); spy.observe(el); });
  // At the very bottom the last section wins (it can sit below the spy band)
  const lastId = spyTargets[spyTargets.length - 1][0];
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      navLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + lastId));
    }
  }, { passive: true });
}
