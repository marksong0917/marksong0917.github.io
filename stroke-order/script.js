/* 汉字笔顺 Stroke Order — watch stroke animations, then trace them yourself.
   Stroke data: hanzi-writer-data (MIT), derived from Make Me a Hanzi. */
'use strict';
const $ = id => document.getElementById(id);
const SVGNS = 'http://www.w3.org/2000/svg';
const SETS = window.STROKE_SETS || [];
const INFO = window.CHAR_INFO || {};
const DATA = window.STROKE_DATA || {};

const STR = {
  zh: { title:'汉字笔顺', tagline:'一笔一画，学写汉字',
    intro:'96 个常用汉字，分成 4 组。先看笔顺动画一笔一画怎么走，再到田字格里自己临摹。写对笔顺，字才写得顺、写得像。',
    backSets:'全部字组', backSet:'字表', tabWatch:'演示', tabPractise:'练习',
    watch:'看演示', replay:'再看一遍', speed:'速度', speedNormal:'正常', speedSlow:'慢',
    nextStroke:'写好了 · 下一笔', redoStroke:'重写这一笔', restartChar:'从头再来',
    practiseNote:'练习是引导临摹，不打分：浅色是这一笔的标准走法，照着描，写完点「下一笔」。',
    doneText:'写完了！对照浅红色的标准字，看看像不像。', nextChar:'下一个字',
    more:'更多作品', creditData:'笔顺数据', creditData2:'（源自 Make Me a Hanzi，MIT）', credit2:'开源（MIT）',
    chars:'{n} 个字', doneN:'已完成 {d}', setMeta:'已完成 {d} / {n}',
    strokes:'共 {n} 笔', strokeOf:'第 {k} 笔 / 共 {n} 笔', finished:'完成啦 · 共 {n} 笔' },
  en: { title:'Stroke Order', tagline:'Learn to write Chinese characters, stroke by stroke',
    intro:'96 common characters in 4 sets. First watch the stroke-order animation, then trace each stroke yourself on the rice grid. Correct order makes characters flow — and look right.',
    backSets:'All sets', backSet:'Characters', tabWatch:'Watch', tabPractise:'Practise',
    watch:'Watch', replay:'Watch again', speed:'Speed', speedNormal:'Normal', speedSlow:'Slow',
    nextStroke:'Done · Next stroke', redoStroke:'Redo stroke', restartChar:'Start over',
    practiseNote:'Practise is guided tracing, not grading: the light stroke shows the standard path — trace over it, then tap Next.',
    doneText:'Finished! Compare your writing with the light-red standard character.', nextChar:'Next character',
    more:'More projects', creditData:'Stroke data', creditData2:'(from Make Me a Hanzi, MIT)', credit2:'Open source (MIT)',
    chars:'{n} characters', doneN:'{d} done', setMeta:'{d} of {n} done',
    strokes:'{n} strokes', strokeOf:'Stroke {k} of {n}', finished:'Finished · {n} strokes' }
};
let lang = localStorage.getItem('strokeorder_lang') || 'zh';
const t = (k, vars) => {
  let s = (STR[lang] && STR[lang][k]) || STR.zh[k] || k;
  if (vars) for (const key in vars) s = s.replace('{'+key+'}', vars[key]);
  return s;
};
let doneSet = new Set();
try { doneSet = new Set(JSON.parse(localStorage.getItem('strokeorder_done') || '[]')); } catch (e) {}
function saveDone() { localStorage.setItem('strokeorder_done', JSON.stringify([...doneSet])); }

/* ---------- voice ---------- */
const player = new Audio();
function playChar(ch) {
  try {
    player.src = 'audio/' + encodeURIComponent(ch) + '.mp3';
    player.currentTime = 0;
    const pr = player.play();
    if (pr && pr.catch) pr.catch(() => {}); // AbortError (interrupted) must stay silent
  } catch (e) {}
}

/* ---------- views ---------- */
let curSet = null, curChar = null, mode = 'watch';
function showView(name) {
  $('shelf').hidden = name !== 'shelf';
  $('setView').hidden = name !== 'set';
  $('practice').hidden = name !== 'practice';
  window.scrollTo(0, 0);
}

function renderShelf() {
  const grid = $('setGrid'); grid.innerHTML = '';
  SETS.forEach(s => {
    const done = s.chars.filter(c => doneSet.has(c)).length;
    const el = document.createElement('button');
    el.className = 'book'; el.type = 'button';
    el.innerHTML = '<h3></h3><p class="en-name"></p><p class="preview"></p>' +
      '<div class="meta-row"><span class="cnt"></span>' +
      (done ? '<span class="done-tag"></span>' : '<span></span>') + '</div>' +
      '<div class="bar"><i style="width:' + (done / s.chars.length * 100) + '%"></i></div>';
    el.querySelector('h3').textContent = lang === 'zh' ? s.zh : s.en;
    el.querySelector('.en-name').textContent = lang === 'zh' ? s.en : s.zh;
    el.querySelector('.preview').textContent = s.chars.slice(0, 10).join(' ');
    el.querySelector('.cnt').textContent = t('chars', { n: s.chars.length });
    if (done) el.querySelector('.done-tag').textContent = t('doneN', { d: done }) + ' ✓';
    el.addEventListener('click', () => openSet(s.id));
    grid.appendChild(el);
  });
}

function openSet(id) {
  curSet = SETS.find(s => s.id === id) || SETS[0];
  renderTiles(); showView('set');
}
function renderTiles() {
  $('setTitle').textContent = lang === 'zh' ? curSet.zh : curSet.en;
  const done = curSet.chars.filter(c => doneSet.has(c)).length;
  $('setMeta').textContent = t('setMeta', { d: done, n: curSet.chars.length });
  const grid = $('tileGrid'); grid.innerHTML = '';
  curSet.chars.forEach(ch => {
    const info = INFO[ch] || {};
    const el = document.createElement('button');
    el.className = 'tile'; el.type = 'button';
    el.innerHTML = (doneSet.has(ch) ? '<span class="done-mark">✓</span>' : '') +
      '<span class="glyph"></span><span class="py"></span>';
    el.querySelector('.glyph').textContent = ch;
    el.querySelector('.py').textContent = info.pinyin || '';
    el.addEventListener('click', () => openChar(ch));
    grid.appendChild(el);
  });
}

/* ---------- SVG helpers ---------- */
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVGNS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
function medianLength(med) {
  let len = 0;
  for (let i = 1; i < med.length; i++) {
    const dx = med[i][0] - med[i-1][0], dy = med[i][1] - med[i-1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}
function buildAnswer() {
  const g = $('answerGroup'); g.innerHTML = ''; g.setAttribute('opacity', '0');
  (DATA[curChar].strokes || []).forEach(d => {
    g.appendChild(svgEl('path', { d: d, 'class': 'answer-path' }));
  });
}
function clearStage() {
  $('charGroup').innerHTML = '';
  $('labelGroup').innerHTML = '';
  $('answerGroup').setAttribute('opacity', '0');
}
function addLabel(i, med) {
  const g = $('labelGroup');
  const x = Math.max(46, Math.min(978, med[0][0] - 54));
  const y = Math.max(46, Math.min(978, 900 - med[0][1] - 54));
  const grp = svgEl('g', { 'class': 'num-label' });
  grp.appendChild(svgEl('circle', { cx: x, cy: y, r: 30 }));
  const tx = svgEl('text', { x: x, y: y + 15 });
  tx.textContent = i + 1;
  grp.appendChild(tx);
  g.appendChild(grp);
  requestAnimationFrame(() => grp.classList.add('on'));
}

/* ---------- watch mode ---------- */
let watchToken = 0, speedSlow = false, animating = false;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function runWatch() {
  if (animating || !curChar) return;
  const data = DATA[curChar], n = data.strokes.length;
  const token = ++watchToken;
  animating = true; $('playBtn').disabled = true;
  clearStage(); buildAnswer();
  const group = $('charGroup');
  const paths = data.strokes.map(d => {
    const p = svgEl('path', { d: d, 'class': 'stroke-path', pathLength: '1' });
    p.style.strokeDasharray = '1';
    p.style.strokeDashoffset = '1';
    group.appendChild(p);
    return p;
  });
  for (let i = 0; i < n; i++) {
    if (token !== watchToken) { animating = false; $('playBtn').disabled = false; return; }
    $('strokeInfo').innerHTML = '';
    $('strokeInfo').appendChild(document.createTextNode(t('strokeOf', { k: i + 1, n: n })));
    addLabel(i, data.medians[i]);
    const len = medianLength(data.medians[i]);
    let dur = Math.max(280, Math.min(1100, len * 1.1));
    if (speedSlow) dur *= 1.9;
    const anim = paths[i].animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
    try { await anim.finished; } catch (e) {}
    $('progressBar').style.width = ((i + 1) / n * 100) + '%';
    if (i < n - 1) await sleep(speedSlow ? 220 : 130);
  }
  if (token === watchToken) {
    $('strokeInfo').textContent = t('strokes', { n: n });
    $('playBtn').querySelector('span').textContent = t('replay');
  }
  animating = false; $('playBtn').disabled = false;
}

/* ---------- practise mode ---------- */
let strokeIdx = 0, drawing = false, lastPt = null, finished = false;
function fitCanvases() {
  const wrap = $('gridWrap'), size = wrap.clientWidth;
  if (!size) return;
  const dpr = window.devicePixelRatio || 1;
  const ink = $('inkCanvas');
  let saved = null;
  if (ink.width > 0) {
    saved = document.createElement('canvas');
    saved.width = ink.width; saved.height = ink.height;
    saved.getContext('2d').drawImage(ink, 0, 0);
  }
  [ink, $('drawCanvas')].forEach(cv => {
    cv.width = size * dpr; cv.height = size * dpr;
    cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  });
  if (saved) ink.getContext('2d').drawImage(saved, 0, 0, size, size);
}
function canvasCtx(cv) {
  const ctx = cv.getContext('2d');
  const w = cv.getBoundingClientRect().width;
  ctx.strokeStyle = '#2b2620';
  ctx.lineWidth = Math.max(6, w * 0.038);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return ctx;
}
function showGhost() {
  const group = $('charGroup'); group.innerHTML = '';
  const data = DATA[curChar];
  if (strokeIdx < data.strokes.length) {
    group.appendChild(svgEl('path', { d: data.strokes[strokeIdx], 'class': 'ghost-path' }));
  }
}
function updateStrokeInfo() {
  const n = DATA[curChar].strokes.length;
  $('strokeInfo').textContent = finished
    ? t('finished', { n: n })
    : t('strokeOf', { k: Math.min(strokeIdx + 1, n), n: n });
  $('progressBar').style.width = (strokeIdx / n * 100) + '%';
}
function resetPractise() {
  finished = false;
  strokeIdx = 0;
  clearStage(); buildAnswer();
  fitCanvases();
  $('inkCanvas').getContext('2d').clearRect(0, 0, 9999, 9999);
  $('drawCanvas').getContext('2d').clearRect(0, 0, 9999, 9999);
  $('charDone').hidden = true;
  $('nextStrokeBtn').disabled = false;
  $('redoStrokeBtn').disabled = false;
  showGhost(); updateStrokeInfo();
}
function finishPractise() {
  finished = true;
  $('charGroup').innerHTML = '';
  $('answerGroup').setAttribute('opacity', '0.18');
  doneSet.add(curChar); saveDone();
  playChar(curChar);
  const idx = curSet.chars.indexOf(curChar);
  $('nextCharBtn').style.display = idx < curSet.chars.length - 1 ? '' : 'none';
  $('charDone').hidden = false;
  $('nextStrokeBtn').disabled = true;
  $('redoStrokeBtn').disabled = true;
  updateStrokeInfo();
  $('progressBar').style.width = '100%';
}

/* ---------- practice screen ---------- */
function openChar(ch) {
  curChar = ch;
  if (!curSet) curSet = SETS.find(s => s.chars.includes(ch)) || SETS[0];
  const info = INFO[ch] || {};
  $('bigChar').textContent = ch;
  $('charPinyin').textContent = info.pinyin || '';
  $('charMeaning').textContent = lang === 'zh' ? (info.zh || '') : (info.en || '');
  $('progressBar').style.width = '0%';
  showView('practice');
  setMode('watch');
}
function setMode(m) {
  mode = m;
  watchToken++;
  $('tabWatch').classList.toggle('active', m === 'watch');
  $('tabPractise').classList.toggle('active', m === 'practise');
  $('watchControls').hidden = m !== 'watch';
  $('practiseControls').hidden = m !== 'practise';
  $('practiseNote').hidden = m !== 'practise';
  $('inkCanvas').hidden = m !== 'practise';
  $('drawCanvas').hidden = m !== 'practise';
  $('charDone').hidden = true;
  clearStage(); buildAnswer();
  $('playBtn').querySelector('span').textContent = t('watch');
  if (m === 'practise') resetPractise();
  else $('strokeInfo').textContent = t('strokes', { n: DATA[curChar].strokes.length });
}

/* ---------- events ---------- */
$('setBackBtn').addEventListener('click', () => { renderShelf(); showView('shelf'); });
$('charBackBtn').addEventListener('click', () => { watchToken++; renderTiles(); showView('set'); });
$('doneBackBtn').addEventListener('click', () => { renderTiles(); showView('set'); });
$('tabWatch').addEventListener('click', () => setMode('watch'));
$('tabPractise').addEventListener('click', () => setMode('practise'));
$('playBtn').addEventListener('click', runWatch);
$('speedBtn').addEventListener('click', () => {
  speedSlow = !speedSlow;
  $('speedName').textContent = t(speedSlow ? 'speedSlow' : 'speedNormal');
});
$('voiceBtn').addEventListener('click', () => playChar(curChar));
$('nextCharBtn').addEventListener('click', () => {
  const idx = curSet.chars.indexOf(curChar);
  if (idx < curSet.chars.length - 1) openChar(curSet.chars[idx + 1]);
});
$('nextStrokeBtn').addEventListener('click', () => {
  if (finished || mode !== 'practise') return;
  const ink = $('inkCanvas'), size = ink.getBoundingClientRect().width;
  ink.getContext('2d').drawImage($('drawCanvas'), 0, 0, size, size);
  $('drawCanvas').getContext('2d').clearRect(0, 0, 9999, 9999);
  strokeIdx++;
  if (strokeIdx >= DATA[curChar].strokes.length) finishPractise();
  else { showGhost(); updateStrokeInfo(); }
});
$('redoStrokeBtn').addEventListener('click', () => {
  $('drawCanvas').getContext('2d').clearRect(0, 0, 9999, 9999);
});
$('restartCharBtn').addEventListener('click', resetPractise);

const drawCv = $('drawCanvas');
function ptOf(e) {
  const r = drawCv.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}
drawCv.addEventListener('pointerdown', e => {
  if (mode !== 'practise' || finished) return;
  e.preventDefault();
  drawing = true;
  drawCv.setPointerCapture(e.pointerId);
  lastPt = ptOf(e);
  const ctx = canvasCtx(drawCv);
  ctx.beginPath(); ctx.moveTo(lastPt[0], lastPt[1]);
  ctx.lineTo(lastPt[0] + 0.01, lastPt[1] + 0.01); ctx.stroke();
});
drawCv.addEventListener('pointermove', e => {
  if (!drawing) return;
  const p = ptOf(e);
  const ctx = canvasCtx(drawCv);
  ctx.beginPath(); ctx.moveTo(lastPt[0], lastPt[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
  lastPt = p;
});
['pointerup', 'pointercancel'].forEach(ev =>
  drawCv.addEventListener(ev, () => { drawing = false; }));
window.addEventListener('resize', () => {
  if (!$('practice').hidden && mode === 'practise') fitCanvases();
});

/* ---------- language ---------- */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
  $('speedName').textContent = t(speedSlow ? 'speedSlow' : 'speedNormal');
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('strokeorder_lang', lang);
  applyI18n(); renderShelf();
  if (!$('setView').hidden) renderTiles();
  if (!$('practice').hidden && curChar) {
    const info = INFO[curChar] || {};
    $('charMeaning').textContent = lang === 'zh' ? (info.zh || '') : (info.en || '');
    if (mode === 'practise') updateStrokeInfo();
    else $('strokeInfo').textContent = t('strokes', { n: DATA[curChar].strokes.length });
  }
});

applyI18n();
renderShelf();
