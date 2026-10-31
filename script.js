document.getElementById('year').textContent = new Date().getFullYear();

// Projects — live statuses (Foxuma first, always)
const projects = [
  { rank: 'No. 2', name: 'Shadowrocket Servers', status: 'Running 24/7', cls: 'running', pct: 100, desc: 'Self-hosted private network servers I built on my own hardware — per-device access, encrypted connections, automatic recovery, runs unattended.', link: 'home-server-guide/', linkText: 'Read the Home Server Guide' },
  { rank: 'No. 3', name: 'Mir2 Game Server', status: 'Running 24/7', cls: 'running', pct: 100, desc: 'A self-hosted Legend of Mir 2 (1.76) online game server I built and run — custom configuration, scheduled backups, steady uptime.', link: 'mir2/', linkText: 'About the server' },
  { rank: 'No. 4', name: 'Newood Millwork', status: 'Live', cls: 'live', pct: 100, desc: 'Website for a custom cabinetry and millwork manufacturer in Concord, Ontario — clean, premium, built to bring in project enquiries.', link: 'https://newoodmillwork.com', linkText: 'newoodmillwork.com' },
  { rank: 'No. 5', name: 'York Region Web Studio', status: 'Live', cls: 'live', pct: 100, desc: 'My own studio. Premium websites and systems for local small businesses across York Region — one service, priced by written quote.', link: 'https://yorkregionwebstudio.com', linkText: 'yorkregionwebstudio.com' },
  { rank: 'No. 6', name: 'Havenwest Closets', status: 'Live', cls: 'live', pct: 100, desc: 'Website and brand identity for a custom closets and storage company — fully custom, locally built, high-end brand.', link: 'https://havenwestclosets.com', linkText: 'havenwestclosets.com' },
  { rank: 'No. 7', name: 'Melovations', status: 'Live', cls: 'live', pct: 100, desc: 'First paid client website — a full redesign for Melovations Enterprises, an interior remodeling company in Bradford, moved off Wix onto a fast custom-built site. The client is very happy with it.', link: 'https://melovations.ca/', linkText: 'melovations.ca' },
  { rank: 'Demo', name: 'Self-Measure Kit', status: 'Live', cls: 'live', pct: 100, desc: 'Homeowners measure their own kitchen or closet in a 6-step wizard and the shop gets a quote-ready summary — rates in one config block, so any shop can make it theirs. Open source.', link: 'measure-kit/', linkText: 'Try the Self-Measure Kit', link2: 'https://github.com/marksong0917/self-measure-kit', link2Text: 'GitHub' },
  { rank: 'Demo', name: 'Trade Estimator', status: 'Live', cls: 'live', pct: 100, desc: 'An instant price-range estimator a shop puts on its own website — the customer gets a number in about a minute, the shop gets the lead.', link: 'estimator/', linkText: 'Try the Trade Estimator' },
  { rank: 'Case study', name: 'Foxuma Case Study', status: 'Live', cls: 'live', pct: 100, desc: 'How one system runs a real cabinet shop day to day — projects, orders, invoicing, payroll hours and inventory in one place.', link: 'case-study/', linkText: 'Read the case study' },
  { rank: 'Open source', name: 'Win11 MinMax Toolkit', status: 'Published', cls: 'guide', pct: 100, desc: 'Safe, reversible Windows 11 tweaks in a PowerShell toolkit. Restore point first, full undo, and a written log of every change.', link: 'https://github.com/marksong0917/win11-minmax-toolkit', linkText: 'View on GitHub' },
  { rank: 'Guide', name: 'Windows 11, Optimized — the LTSC Way', status: 'Published', cls: 'guide', pct: 100, desc: 'My Windows 11 guide, rewritten as a public site: minimal bloat, maximum performance, step by step.', link: 'https://marksong0917.github.io/win11-optimization-guide/', linkText: 'Read the guide', link2: 'https://marksong0917.github.io/win11-optimization-guide/zh/', link2Text: '中文版' },
  { rank: 'Guide', name: 'Home Server Guide', status: 'Published', cls: 'guide', pct: 100, desc: 'Turn an old PC into a 24/7 private server — now with one-click setup, plus services, per-device accounts, clients and upkeep.', link: 'home-server-guide/', linkText: 'Read the guide', link2: 'https://marksong0917.github.io/home-server-guide/zh/', link2Text: '中文版' },
  { rank: 'New', name: '打字读经典 · Type the Classics', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Read classics by typing them — Chinese classics by pinyin, English classics letter by letter, with a voice reading each word aloud. 17 books, a new one every week. A trending idea, rebuilt bilingual.', link: 'typebook-zh/', linkText: 'Start typing', link2: 'https://github.com/marksong0917/typebook-zh', link2Text: 'GitHub' },
  { rank: 'New', name: '打字背单词 · TypeWords', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Learn English words by typing them — 120 curriculum words in 4 levels, each spoken aloud the moment you finish it, and the words you miss come back in a review round. Bilingual EN/中文.', link: 'typewords/', linkText: 'Start learning words', link2: 'https://github.com/marksong0917/typewords', link2Text: 'GitHub' },
  { rank: 'New', name: '听写助手 · Dictation', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Listen, then type what you hear — Chinese poetry and idiom dictation plus English sentences, read aloud with a slow-play option and character-by-character checking. Bilingual EN/中文.', link: 'dictation/', linkText: 'Start dictation', link2: 'https://github.com/marksong0917/dictation', link2Text: 'GitHub' },
  { rank: 'New', name: '图片压缩 · Image Compressor', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Shrink photos right in the browser — quality, size and format controls, batch processing, and nothing ever uploads to a server. Bilingual EN/中文.', link: 'imgcompress/', linkText: 'Compress an image', link2: 'https://github.com/marksong0917/imgcompress', link2Text: 'GitHub' },
  { rank: 'New', name: '尺寸换算 · Size Converter', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'The trades converter — type 3 1/2" and get millimetres, or type 100 mm and get 3 15/16", with fraction precision down to 1/64 and a printable fraction chart. Plus weight, area and temperature. Bilingual EN/中文.', link: 'size-converter/', linkText: 'Convert a size', link2: 'https://github.com/marksong0917/size-converter', link2Text: 'GitHub' },
  { rank: 'New', name: '汉字笔顺 · Stroke Order', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Learn to write Chinese characters one stroke at a time — 96 common characters with animated stroke order and guided tracing on a rice grid, each one spoken aloud. Bilingual EN/中文.', link: 'stroke-order/', linkText: 'Practise writing', link2: 'https://github.com/marksong0917/stroke-order', link2Text: 'GitHub' },
  { rank: 'New', name: '二维码生成器 · QR Maker', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Make QR codes in the browser — live preview, size and error-correction controls, custom colours, PNG download. Nothing uploads. Bilingual EN/中文.', link: 'qr-maker/', linkText: 'Make a QR code', link2: 'https://github.com/marksong0917/qr-maker', link2Text: 'GitHub' },
  { rank: 'New', name: '番茄钟 · Pomodoro', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'A 25-minute focus timer with short and long breaks and a session counter. Simple, bilingual, runs in your browser.', link: 'pomodoro/', linkText: 'Start focusing', link2: 'https://github.com/marksong0917/pomodoro', link2Text: 'GitHub' },
  { rank: 'New', name: '证件照 · ID Photo Maker', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Crop a photo to ID, passport and visa sizes at print resolution, plus a 6-inch print-sheet layout. Everything runs locally — nothing uploads.', link: 'id-photo/', linkText: 'Make an ID photo', link2: 'https://github.com/marksong0917/id-photo', link2Text: 'GitHub' },
  { rank: 'New', name: '成语接龙 · Idiom Solitaire', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Chain Chinese idioms head-to-tail against the computer — 420 idioms with pinyin and meanings, hints when you are stuck.', link: 'idiom-chain/', linkText: 'Play the chain', link2: 'https://github.com/marksong0917/idiom-chain', link2Text: 'GitHub' },
  { rank: 'New', name: '大转盘 · Lucky Wheel', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'A spin-the-wheel decision maker — classroom picks, prize draws and tough choices. Your options stay in your browser.', link: 'lucky-wheel/', linkText: 'Spin the wheel', link2: 'https://github.com/marksong0917/lucky-wheel', link2Text: 'GitHub' },
  { rank: 'New', name: '楼梯计算 · Stair Calculator', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Risers, treads, total run, stringer length and comfort-rule checks for stair building — mm with inch equivalents, plus a scale diagram.', link: 'stair-calculator/', linkText: 'Calculate stairs', link2: 'https://github.com/marksong0917/stair-calculator', link2Text: 'GitHub' },
  { rank: 'New', name: '倒数日 · Countdown Days', status: 'Live · Open source', cls: 'guide', pct: 100, desc: 'Countdown cards for anniversaries, birthdays, exams and trips — yearly events roll to their next date automatically.', link: 'countdown/', linkText: 'Count the days', link2: 'https://github.com/marksong0917/countdown', link2Text: 'GitHub' },
];
const grid = document.getElementById('projectGrid');
projects.forEach((p, i) => {
  const el = document.createElement('article');
  el.className = 'card reveal';
  el.dataset.group = p.rank === 'New' ? 'apps' : (p.rank === 'Guide' || p.rank === 'Open source') ? 'guides' : 'work';
  el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms'; // cascade the grid in; cleared after reveal so hover stays snappy
  const liveDot = (p.cls === 'live' || p.cls === 'running') ? '<span class="sdot" aria-hidden="true"></span>' : '';
  el.innerHTML = `
    <div class="card-top"><span class="rank">${p.rank}</span><span class="status ${p.cls}">${liveDot}${p.status}</span></div>
    <h4>${p.name}</h4><p>${p.desc}</p>
    <div class="bar"><i style="width:${p.pct}%"></i></div><p class="pct">${p.pct}%</p>
    ${p.link ? `<div class="card-links"><a href="${p.link}" target="_blank" rel="noopener">${p.linkText}</a>${p.link2 ? `<a href="${p.link2}" target="_blank" rel="noopener">${p.link2Text}</a>` : ''}</div>` : `<p class="note-none">${p.note}</p>`}`;
  grid.appendChild(el);
});

// Project filters — counts are computed from the rendered cards
const fchips = Array.from(document.querySelectorAll('.fchip'));
if (fchips.length && grid) {
  const cards = Array.from(grid.children);
  const counts = { all: cards.length, work: 0, apps: 0, guides: 0 };
  cards.forEach((c) => { counts[c.dataset.group] = (counts[c.dataset.group] || 0) + 1; });
  document.querySelectorAll('.fcount').forEach((s) => { s.textContent = counts[s.dataset.count] ?? ''; });
  fchips.forEach((chip) => {
    chip.addEventListener('click', () => {
      fchips.forEach((c) => { c.classList.toggle('on', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      const f = chip.dataset.filter;
      cards.forEach((c) => {
        const show = f === 'all' || c.dataset.group === f;
        c.classList.toggle('is-hidden', !show);
        if (show) { c.classList.add('in'); c.style.transitionDelay = ''; }
      });
    });
  });
}

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
  ['faq', document.getElementById('faq')],
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
