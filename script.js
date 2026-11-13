document.getElementById('year').textContent = new Date().getFullYear();

// Works filters — counts computed from the cards actually on the page
const gridCards = Array.from(document.querySelectorAll('#works .card[data-group]'));
const blocks = Array.from(document.querySelectorAll('[data-group-block]'));
const fchips = Array.from(document.querySelectorAll('.fchip'));
if (fchips.length && gridCards.length) {
  const counts = { all: gridCards.length };
  gridCards.forEach((c) => { counts[c.dataset.group] = (counts[c.dataset.group] || 0) + 1; });
  document.querySelectorAll('.fcount').forEach((s) => { s.textContent = counts[s.dataset.count] ?? ''; });
  fchips.forEach((chip) => {
    chip.addEventListener('click', () => {
      fchips.forEach((c) => { c.classList.toggle('on', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      const f = chip.dataset.filter;
      gridCards.forEach((c) => {
        const show = f === 'all' || c.dataset.group === f;
        c.classList.toggle('is-hidden', !show);
        if (show) { c.classList.add('in'); }
      });
      blocks.forEach((b) => {
        const show = f === 'all' || b.dataset.groupBlock === f;
        b.classList.toggle('is-hidden', !show);
      });
    });
  });
}

// Reveal on scroll
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.08 });
  items.forEach((el) => io.observe(el));
} else { items.forEach((el) => el.classList.add('in')); }
// Safety: content must never stay hidden if observation stalls
setTimeout(() => items.forEach((el) => el.classList.add('in')), 2500);
