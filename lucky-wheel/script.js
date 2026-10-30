'use strict';

const STRINGS = {
  zh: {
    title: '大转盘',
    tagline: '转一转，帮你做决定',
    intro: '把纠结的事交给转盘：填好选项，点一下开始，指针停在哪个就是哪个。完全公平随机 — 每个选项机会均等。',
    privacy: '🔒 选项只保存在你的浏览器里，不上传',
    presetsLabel: '快捷预设',
    presetFood: '今天吃什么',
    presetNames: '班级点名',
    presetYesNo: '是或否',
    optionsLabel: '选项（每行一个）',
    optionsPh: '每行写一个选项…',
    rangeHint: '2–24 个选项',
    spin: '开始转动',
    spinning: '转动中…',
    statusReady: '准备好了，点开始转动',
    resultIs: '结果是',
    count: (n) => `共 ${n} 个选项`,
    needMore: '至少需要 2 个选项才能转',
    tooMany: '最多 24 个选项，多出的已忽略',
    historyTitle: '历史记录',
    historyEmpty: '还没有结果，先转一次吧',
    round: (n) => `第 ${n} 次`,
    more: '更多作品',
    credit: '开源（MIT）',
    docTitle: '大转盘 — 在线幸运大转盘 | Lucky Wheel',
  },
  en: {
    title: 'Lucky Wheel',
    tagline: 'Spin the wheel, make the call',
    intro: 'Let the wheel decide: enter your options, hit spin, and wherever the pointer stops is the answer. Perfectly fair — every option gets an equal chance.',
    privacy: '🔒 Options are saved only in your browser — nothing uploads',
    presetsLabel: 'Quick presets',
    presetFood: 'What to eat',
    presetNames: 'Classroom pick',
    presetYesNo: 'Yes or no',
    optionsLabel: 'Options (one per line)',
    optionsPh: 'One option per line…',
    rangeHint: '2–24 options',
    spin: 'SPIN',
    spinning: 'Spinning…',
    statusReady: 'Ready — hit SPIN',
    resultIs: 'The wheel says',
    count: (n) => `${n} option${n === 1 ? '' : 's'}`,
    needMore: 'Add at least 2 options to spin',
    tooMany: 'Max 24 options — extras are ignored',
    historyTitle: 'History',
    historyEmpty: 'No results yet — give it a spin',
    round: (n) => `#${n}`,
    more: 'More projects',
    credit: 'Open source (MIT)',
    docTitle: 'Lucky Wheel — Spin to Decide | 大转盘',
  },
};

const PRESETS = {
  food: {
    zh: ['火锅', '烧烤', '拉面', '寿司', '汉堡', '披萨', '炸鸡', '麻辣烫', '饺子', '牛排', '米线', '沙拉'],
    en: ['Hot Pot', 'BBQ', 'Ramen', 'Sushi', 'Burgers', 'Pizza', 'Fried Chicken', 'Tacos', 'Dumplings', 'Steak', 'Pasta', 'Salad'],
  },
  names: {
    zh: ['小明', '小红', '小刚', '小丽', '小强', '小美', '小杰', '小雪'],
    en: ['Alex', 'Bella', 'Chris', 'Dana', 'Eli', 'Fiona', 'George', 'Hana'],
  },
  yesno: {
    zh: ['是', '否'],
    en: ['Yes', 'No'],
  },
};

// Warm family palette, cycled across segments.
const PALETTE = ['#b03a2e', '#b98a2f', '#3e7d4e', '#4a6fa5', '#c96f4a', '#7d4a5e', '#5f7d3a', '#a85751'];
const MAX_OPTIONS = 24;
const TAU = Math.PI * 2;

const $ = (id) => document.getElementById(id);
const canvas = $('wheel');
const ctx = canvas.getContext('2d');

let lang = localStorage.getItem('luckywheel_lang') || 'zh';
let options = loadOptions();
let rotation = 0;          // radians, clockwise, in world space
let spinning = false;
let lastResult = null;
let drawnSegments = 0;
const history = [];        // newest first: { n, value }
let spinCount = 0;

const t = () => STRINGS[lang];

function loadOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem('luckywheel_options') || 'null');
    if (Array.isArray(saved) && saved.length) {
      return saved.filter((s) => typeof s === 'string' && s.trim()).slice(0, MAX_OPTIONS);
    }
  } catch (e) { /* fall through to default */ }
  return PRESETS.food.zh.slice();
}

function saveOptions() {
  try { localStorage.setItem('luckywheel_options', JSON.stringify(options)); } catch (e) { /* private mode */ }
}

// Parse the textarea: one option per line, trimmed, blanks dropped.
function parseOptions(text) {
  const lines = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return { options: lines.slice(0, MAX_OPTIONS), overflow: lines.length > MAX_OPTIONS };
}

function draw() {
  const dpr = window.devicePixelRatio || 1;
  const size = 520;
  if (canvas.width !== size * dpr) { canvas.width = size * dpr; canvas.height = size * dpr; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  const n = options.length;
  drawnSegments = n;

  // Outer rim
  ctx.beginPath();
  ctx.arc(cx, cy, r + 3, 0, TAU);
  ctx.fillStyle = '#b98a2f';
  ctx.fill();

  if (n === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = '#e6ddcd';
    ctx.fill();
    return;
  }

  const seg = TAU / n;
  for (let i = 0; i < n; i++) {
    // Canvas angle 0 = +x axis; wheel angle 0 = top, clockwise. Offset by -PI/2.
    const start = -Math.PI / 2 + rotation + i * seg;
    const end = start + seg;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    ctx.strokeStyle = '#faf7f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label, drawn radially and flipped on the left half so it stays readable.
    const mid = start + seg / 2;
    const norm = ((mid % TAU) + TAU) % TAU;
    const flip = norm > Math.PI / 2 && norm < (3 * Math.PI) / 2;
    const labelR = r * 0.64;
    const fontPx = Math.max(11, Math.min(20, (2 * labelR * Math.sin(seg / 2)) * 0.42 || 20));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(mid);
    ctx.translate(labelR, 0);
    if (flip) ctx.rotate(Math.PI);
    ctx.font = `600 ${fontPx}px "PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif`;
    ctx.fillStyle = '#fffdf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(43,38,34,.35)';
    ctx.shadowBlur = 3;
    let label = options[i];
    const maxW = r * 0.52;
    while (label.length > 1 && ctx.measureText(label).width > maxW) label = label.slice(0, -1);
    if (label !== options[i]) label = label.slice(0, -1) + '…';
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }
}

// Which segment sits under the top pointer for the current rotation?
function pointerIndex() {
  const n = options.length;
  if (!n) return -1;
  const seg = TAU / n;
  const theta = (((-rotation) % TAU) + TAU) % TAU;
  return Math.min(n - 1, Math.floor(theta / seg));
}

function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

function spin() {
  if (spinning || options.length < 2) return;
  spinning = true;
  lastResult = null;
  setControlsEnabled(false);
  $('resultBanner').hidden = true;
  $('statusLine').textContent = t().spinning;

  const n = options.length;
  const seg = TAU / n;
  // Fair draw: winner chosen uniformly at random first.
  const winner = Math.floor(Math.random() * n);
  // Land the winner's segment under the pointer, with a random in-segment offset
  // (kept 0.32 of a segment from centre so it never straddles a boundary).
  const jitter = (Math.random() * 2 - 1) * seg * 0.32;
  const targetMod = (((-(winner + 0.5) * seg + jitter) % TAU) + TAU) % TAU;
  const currentMod = ((rotation % TAU) + TAU) % TAU;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += TAU;
  const totalDelta = delta + TAU * 6;
  const startRotation = rotation;
  const duration = 4800;
  const startTime = performance.now();

  function frame(now) {
    const p = Math.min(1, (now - startTime) / duration);
    rotation = startRotation + totalDelta * easeOutQuart(p);
    draw();
    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      rotation = startRotation + totalDelta;
      spinning = false;
      // Announce the segment actually under the pointer — identical to the
      // pre-drawn winner by construction, so banner and wheel always agree.
      const idx = pointerIndex();
      lastResult = options[idx];
      spinCount += 1;
      history.unshift({ n: spinCount, value: lastResult });
      draw();
      showResult();
      renderHistory();
      setControlsEnabled(true);
    }
  }
  requestAnimationFrame(frame);
}

function showResult() {
  const banner = $('resultBanner');
  banner.textContent = `🎉 ${t().resultIs}：${lastResult}`;
  if (lang === 'en') banner.textContent = `🎉 ${t().resultIs}: ${lastResult}`;
  banner.hidden = false;
  $('statusLine').textContent = t().statusReady;
}

function renderHistory() {
  const list = $('historyList');
  list.innerHTML = '';
  history.slice(0, 10).forEach((h) => {
    const li = document.createElement('li');
    const idx = document.createElement('span');
    idx.className = 'h-idx';
    idx.textContent = t().round(h.n);
    const val = document.createElement('span');
    val.className = 'h-val';
    val.textContent = h.value;
    li.appendChild(val);
    li.appendChild(idx);
    list.appendChild(li);
  });
  $('historyEmpty').hidden = history.length > 0;
}

function setControlsEnabled(enabled) {
  $('spinBtn').disabled = !enabled || options.length < 2;
  $('optionsInput').disabled = !enabled;
  document.querySelectorAll('.preset-btn').forEach((b) => { b.disabled = !enabled; });
  $('spinBtn').textContent = enabled ? t().spin : t().spinning;
}

function refreshEditor() {
  const parsed = parseOptions($('optionsInput').value);
  options = parsed.options;
  saveOptions();
  $('countLine').textContent = t().count(options.length);
  const hint = $('editorHint');
  if (options.length < 2) {
    hint.textContent = t().needMore;
    hint.hidden = false;
  } else if (parsed.overflow) {
    hint.textContent = t().tooMany;
    hint.hidden = false;
  } else {
    hint.hidden = true;
  }
  if (!spinning) $('spinBtn').disabled = options.length < 2;
  draw();
}

function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t().docTitle;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (typeof t()[key] === 'string') el.textContent = t()[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.getAttribute('data-i18n-ph');
    if (typeof t()[key] === 'string') el.setAttribute('placeholder', t()[key]);
  });
  $('langToggle').textContent = lang === 'zh' ? 'EN' : '中文';
  $('spinBtn').textContent = spinning ? t().spinning : t().spin;
  if (lastResult && !spinning) showResult();
  renderHistory();
  refreshEditor();
}

function init() {
  $('optionsInput').value = options.join('\n');
  let debounce = null;
  $('optionsInput').addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(refreshEditor, 120);
  });
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (spinning) return;
      const preset = PRESETS[btn.getAttribute('data-preset')];
      options = preset[lang].slice();
      $('optionsInput').value = options.join('\n');
      $('resultBanner').hidden = true;
      lastResult = null;
      refreshEditor();
    });
  });
  $('spinBtn').addEventListener('click', spin);
  canvas.addEventListener('click', spin);
  $('langToggle').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('luckywheel_lang', lang); } catch (e) { /* private mode */ }
    applyLang();
  });
  window.addEventListener('resize', draw);
  applyLang();
}

// Test/verification handle.
window.__luckyWheel = {
  getOptions: () => options.slice(),
  getDrawnSegments: () => drawnSegments,
  isSpinning: () => spinning,
  getLastResult: () => lastResult,
  spin,
};

init();
