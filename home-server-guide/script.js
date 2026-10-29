// Copy buttons on code blocks
document.querySelectorAll('.code').forEach((block) => {
  const btn = block.querySelector('.copy');
  const code = block.querySelector('code');
  if (!btn || !code) return;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.innerText.trim());
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Select + Ctrl+C';
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  });
});

// Sidebar: highlight the section in view
const links = Array.from(document.querySelectorAll('.side-nav a'));
const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.remove('active'));
        const link = byId.get(e.target.id);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
}

// Scroll progress bar + back-to-top button
const scrollBar = document.querySelector('.scroll-progress');
const toTopBtn = document.getElementById('toTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY || 0;
  if (scrollBar) scrollBar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
  if (toTopBtn) toTopBtn.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
