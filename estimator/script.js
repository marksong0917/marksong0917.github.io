// Trade Estimator demo — Maple Works Studio (sample prices, demo only)
// Everything runs locally in the browser. Nothing is sent anywhere.

const RATES = {
  kitchen: {
    label: 'Kitchen',
    baseLow: 1800, baseHigh: 2600,          // CAD per metre of cabinet run
    mult: { standard: 1, premium: 1.5, luxury: 2.2 },
    min: 2, max: 10, def: 4,
    sizeLabel: 'How many metres of cabinets?',
    sizeHint: 'Measure along the wall where the cabinets will run. A tape measure and two minutes is all it takes.'
  },
  closet: {
    label: 'Closet',
    baseLow: 900, baseHigh: 1400,           // CAD per metre of closet width
    mult: { standard: 1, premium: 1.4, luxury: 1.9 },
    min: 1, max: 6, def: 3,
    sizeLabel: 'How wide is the closet wall?',
    sizeHint: 'Measure the full width of the wall the closet will cover, in metres.'
  }
};

const EXTRAS = {
  // Kitchen
  stone:        { name: 'Stone countertop',      low: 2400, high: 3600 },
  island:       { name: 'Island',                low: 3500, high: 5500 },
  'softclose-k':{ name: 'Soft-close everything', low: 600,  high: 900 },
  'lighting-k': { name: 'Under-cabinet lighting', low: 450, high: 750 },
  // Closet
  organizers:   { name: 'Organizers & dividers', low: 500,  high: 800 },
  drawers:      { name: 'Bank of drawers',       low: 900,  high: 1400 },
  'softclose-c':{ name: 'Soft-close everything', low: 400,  high: 650 },
  'lighting-c': { name: 'Built-in lighting',     low: 400,  high: 700 }
};

const LEVEL_NAMES = { standard: 'Standard', premium: 'Premium', luxury: 'Luxury' };

const $ = (id) => document.getElementById(id);
const fmt = (n) => '$' + Math.round(n).toLocaleString('en-CA');

let lastEstimate = null;

function currentType() {
  return document.querySelector('input[name="type"]:checked').value;
}
function currentLevel() {
  return document.querySelector('input[name="level"]:checked').value;
}

function checkedExtras() {
  const group = $('extras-' + currentType());
  return Array.from(group.querySelectorAll('input[type="checkbox"]:checked'))
    .map((box) => ({ key: box.dataset.extra, ...EXTRAS[box.dataset.extra] }));
}

function calculate() {
  const type = currentType();
  const level = currentLevel();
  const rate = RATES[type];
  const size = parseFloat($('size').value);
  const mult = rate.mult[level];

  let low = size * rate.baseLow * mult;
  let high = size * rate.baseHigh * mult;

  const lines = [{
    label: `${rate.label} — ${size.toFixed(1)} m, ${LEVEL_NAMES[level]} level`,
    low, high
  }];

  for (const extra of checkedExtras()) {
    low += extra.low;
    high += extra.high;
    lines.push({ label: extra.name, low: extra.low, high: extra.high });
  }

  lastEstimate = { type, level, size, low: Math.round(low), high: Math.round(high), extras: checkedExtras() };

  $('size-value').textContent = size.toFixed(1);
  $('result-range').innerHTML =
    `<span class="cur">$</span>${Math.round(low).toLocaleString('en-CA')} – <span class="cur">$</span>${Math.round(high).toLocaleString('en-CA')}`;
  $('breakdown').innerHTML = lines
    .map((l) => `<li><span>${l.label}</span><span>${fmt(l.low)} – ${fmt(l.high)}</span></li>`)
    .join('');
}

function applyType() {
  const type = currentType();
  const rate = RATES[type];
  const slider = $('size');
  slider.min = rate.min;
  slider.max = rate.max;
  slider.value = rate.def;
  $('size-min').textContent = rate.min + ' m';
  $('size-max').textContent = rate.max + ' m';
  $('size-label').textContent = rate.sizeLabel;
  $('size-hint').textContent = rate.sizeHint;
  $('extras-kitchen').hidden = type !== 'kitchen';
  $('extras-closet').hidden = type !== 'closet';
  // Extras are per-type; clear them on switch so the price never mixes types.
  document.querySelectorAll('#extras-kitchen input, #extras-closet input')
    .forEach((box) => { box.checked = false; });
  calculate();
}

function stepSize(delta) {
  const slider = $('size');
  const next = Math.min(parseFloat(slider.max), Math.max(parseFloat(slider.min), parseFloat(slider.value) + delta));
  slider.value = next;
  calculate();
}

document.querySelectorAll('input[name="type"]').forEach((r) => r.addEventListener('change', applyType));
document.querySelectorAll('input[name="level"]').forEach((r) => r.addEventListener('change', calculate));
document.querySelectorAll('.extras input[type="checkbox"]').forEach((b) => b.addEventListener('change', calculate));
$('size').addEventListener('input', calculate);
$('size-minus').addEventListener('click', () => stepSize(-0.5));
$('size-plus').addEventListener('click', () => stepSize(0.5));

// Lead form — demo only: validates, then shows the success panel. Nothing sends.
$('estimator').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('lead-name').value.trim();
  const contact = $('lead-contact').value.trim();
  if (!name || !contact) {
    $('lead-error').hidden = false;
    return;
  }
  $('lead-error').hidden = true;
  const est = lastEstimate;
  const extrasText = est.extras.length
    ? ' · ' + est.extras.map((x) => x.name).join(', ')
    : '';
  $('success-summary').textContent =
    `${name}, your ${RATES[est.type].label.toLowerCase()} estimate: ${est.size.toFixed(1)} m, ${LEVEL_NAMES[est.level]} level${extrasText} — ${fmt(est.low)} – ${fmt(est.high)} CAD. We will send it to ${contact}.`;
  const success = $('success');
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

applyType();
