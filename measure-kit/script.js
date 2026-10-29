// Self-Measure Kit demo — everything runs locally in the browser.
const TOTAL_STEPS = 6;
let current = 1;

// Sample per-metre rates by space (clearly fake, demo only)
const RATES = {
  'Kitchen':  [2200, 3200],
  'Closet':   [900, 1400],
  'Mudroom':  [1100, 1600],
  'Other':    [1000, 1500],
};

const steps = document.querySelectorAll('.step');
const fill = document.getElementById('progressFill');
const label = document.getElementById('progressLabel');

function showStep(n) {
  current = n;
  steps.forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === n));
  const shown = Math.min(n, TOTAL_STEPS);
  fill.style.width = (shown / TOTAL_STEPS * 100) + '%';
  label.textContent = n > TOTAL_STEPS ? 'Summary ready' : `Step ${n} of ${TOTAL_STEPS}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function radioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}

function validStep(n) {
  if (n === 1) {
    const ok = !!radioValue('space');
    document.getElementById('errSpace').hidden = ok;
    return ok;
  }
  if (n === 2) {
    const ok = ['lenCm', 'widCm', 'heiCm'].every((id) => {
      const v = parseFloat(document.getElementById(id).value);
      return !isNaN(v) && v > 0;
    });
    document.getElementById('errSize').hidden = ok;
    if (ok) buildWalls();
    return ok;
  }
  return true;
}

document.querySelectorAll('[data-next]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (validStep(current)) showStep(current + 1);
  });
});
document.querySelectorAll('[data-back]').forEach((btn) => {
  btn.addEventListener('click', () => showStep(Math.max(1, current - 1)));
});

// Walls (step 3) — built from the room size
const WALLS = [
  { id: 'A', lenFrom: 'lenCm' },
  { id: 'B', lenFrom: 'widCm' },
  { id: 'C', lenFrom: 'lenCm' },
  { id: 'D', lenFrom: 'widCm' },
];
const wallState = {};
WALLS.forEach((w) => { wallState[w.id] = { use: false, doors: 0, windows: 0, obstacles: 0 }; });

function stepperHTML(wallId, key, labelText) {
  return `<div class="count"><span>${labelText}</span>
    <div class="stepper">
      <button type="button" data-wall="${wallId}" data-key="${key}" data-dir="-1" aria-label="Fewer ${labelText}">−</button>
      <output id="out-${wallId}-${key}">0</output>
      <button type="button" data-wall="${wallId}" data-key="${key}" data-dir="1" aria-label="More ${labelText}">+</button>
    </div></div>`;
}

function buildWalls() {
  const list = document.getElementById('wallList');
  list.innerHTML = '';
  WALLS.forEach((w) => {
    const len = Math.round(parseFloat(document.getElementById(w.lenFrom).value) || 0);
    const div = document.createElement('div');
    div.className = 'wall' + (wallState[w.id].use ? '' : ' off');
    div.id = 'wall-' + w.id;
    div.innerHTML = `
      <div class="wall-head">
        <label><input type="checkbox" id="use-${w.id}" ${wallState[w.id].use ? 'checked' : ''}> Wall ${w.id} — cabinets / storage here</label>
        <span class="wall-len">${len} cm long</span>
      </div>
      <div class="wall-counts">
        ${stepperHTML(w.id, 'doors', 'Doors')}
        ${stepperHTML(w.id, 'windows', 'Windows')}
        ${stepperHTML(w.id, 'obstacles', 'Obstacles (rad, vent…)')}
      </div>`;
    list.appendChild(div);
    document.getElementById('use-' + w.id).addEventListener('change', (e) => {
      wallState[w.id].use = e.target.checked;
      div.classList.toggle('off', !e.target.checked);
    });
  });
  list.querySelectorAll('.stepper button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const st = wallState[btn.dataset.wall];
      const key = btn.dataset.key;
      st[key] = Math.max(0, Math.min(9, st[key] + Number(btn.dataset.dir)));
      document.getElementById(`out-${btn.dataset.wall}-${key}`).textContent = st[key];
    });
  });
}
buildWalls();

// Photos (step 4) — preview only, nothing uploads
const photoNames = [];
document.getElementById('photoInput').addEventListener('change', (e) => {
  const grid = document.getElementById('photoGrid');
  Array.from(e.target.files).forEach((file) => {
    photoNames.push(file.name);
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    const cap = document.createElement('figcaption');
    cap.textContent = file.name;
    fig.appendChild(img);
    fig.appendChild(cap);
    grid.appendChild(fig);
  });
});

// Summary (result)
function money(n) { return '$' + Math.round(n).toLocaleString('en-CA'); }

function buildSummary() {
  const space = radioValue('space') || 'Other';
  const len = Math.round(parseFloat(document.getElementById('lenCm').value) || 0);
  const wid = Math.round(parseFloat(document.getElementById('widCm').value) || 0);
  const hei = Math.round(parseFloat(document.getElementById('heiCm').value) || 0);
  const wallLen = { A: len, B: wid, C: len, D: wid };

  let runCm = 0;
  const wallLines = [];
  WALLS.forEach((w) => {
    const st = wallState[w.id];
    if (st.use) {
      runCm += wallLen[w.id];
      wallLines.push(`  Wall ${w.id}: ${wallLen[w.id]} cm run — ${st.doors} door(s), ${st.windows} window(s), ${st.obstacles} obstacle(s)`);
    }
  });
  if (!wallLines.length) wallLines.push('  (no walls selected)');

  const [lo, hi] = RATES[space] || RATES['Other'];
  const metres = runCm / 100;
  const range = runCm > 0 ? `${money(metres * lo)} – ${money(metres * hi)}` : 'add at least one cabinet wall for a range';

  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const time = document.getElementById('cTime').value;
  const notes = document.getElementById('cNotes').value.trim();

  const lines = [
    'SELF-MEASURE SUMMARY — Maple Works Studio (demo)',
    '',
    `Space: ${space}`,
    `Room: ${len} × ${wid} cm, ceiling ${hei} cm`,
    '',
    'Cabinet / storage walls:',
    ...wallLines,
    `Estimated cabinet run: ${runCm} cm (${metres.toFixed(1)} m)`,
    '',
    `Style: ${radioValue('door') || 'not chosen'} · ${radioValue('finish') || 'not chosen'} · Hardware: ${radioValue('hardware') || 'not chosen'}`,
    `Photos: ${photoNames.length ? photoNames.length + ' attached (' + photoNames.join(', ') + ')' : 'none yet'}`,
    '',
    `Rough budget range: ${range}`,
    '(Sample prices, for demo only — the shop confirms a real quote after review.)',
    '',
    `Contact: ${name} · ${email}${phone ? ' · ' + phone : ''}`,
    `Best time: ${time}`,
  ];
  if (notes) lines.push(`Notes: ${notes}`);
  return lines.join('\n');
}

let summaryText = '';
document.getElementById('btnSummary').addEventListener('click', () => {
  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const ok = name.length > 1 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  document.getElementById('errContact').hidden = ok;
  if (!ok) return;
  summaryText = buildSummary();
  document.getElementById('summaryPanel').textContent = summaryText;
  document.getElementById('copiedMsg').hidden = true;
  showStep(7);
});

document.getElementById('btnCopy').addEventListener('click', async () => {
  const msg = document.getElementById('copiedMsg');
  try {
    await navigator.clipboard.writeText(summaryText);
    msg.hidden = false;
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = summaryText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    msg.hidden = false;
  }
});

document.getElementById('btnDownload').addEventListener('click', () => {
  const blob = new Blob([summaryText], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'measure-summary.txt';
  a.click();
  URL.revokeObjectURL(a.href);
});

showStep(1);
