'use strict';

/* ---------- i18n ---------- */
const STR = {
  zh: {
    title: '倒数日',
    tagline: '重要日子，一个都别错过',
    intro: '为生日、纪念日、考试和旅行建一张倒计时卡片，大数字一眼看到还剩几天。一次性的日子过了会显示已经过去几天；每年重复的日子会自动数到下一次。',
    privacy: '🔒 数据只保存在你的浏览器里，不上传',
    formAdd: '新建倒计时',
    formEdit: '编辑倒计时',
    labelTitle: '标题',
    phTitle: '例如：妈妈的生日',
    labelDate: '日期',
    labelColor: '颜色',
    annualText: '每年重复（生日、纪念日选这个）',
    chipBirthday: '生日',
    chipAnniversary: '纪念日',
    chipExam: '考试',
    chipTrip: '旅行',
    chipSpring: '春节',
    btnAdd: '添加卡片',
    btnSave: '保存修改',
    btnCancel: '取消编辑',
    formError: '请填写标题并选择日期。',
    empty: '还没有卡片。用上面的表单添加第一个倒计时吧。',
    capFuture: '天后',
    capToday: '就是今天 🎉',
    capPast: '天前',
    badgeAnnual: '每年重复',
    btnEdit: '编辑',
    btnDelete: '删除',
    more: '更多作品',
    footNote: '倒数日 · Countdown Days — 免费小工具，数据保存在本机浏览器。'
  },
  en: {
    title: 'Countdown Days',
    tagline: 'Never miss a day that matters',
    intro: 'Create a countdown card for a birthday, anniversary, exam or trip and see the big number at a glance. A one-off date that has passed shows how many days it has been; an annual event automatically counts to its next occurrence.',
    privacy: '🔒 Your data stays in your browser — nothing is uploaded',
    formAdd: 'New countdown',
    formEdit: 'Edit countdown',
    labelTitle: 'Title',
    phTitle: 'e.g. Mum\u2019s birthday',
    labelDate: 'Date',
    labelColor: 'Colour',
    annualText: 'Repeats every year (birthdays, anniversaries)',
    chipBirthday: 'Birthday',
    chipAnniversary: 'Anniversary',
    chipExam: 'Exam',
    chipTrip: 'Trip',
    chipSpring: 'Spring Festival',
    btnAdd: 'Add card',
    btnSave: 'Save changes',
    btnCancel: 'Cancel editing',
    formError: 'Please enter a title and pick a date.',
    empty: 'No cards yet. Add your first countdown with the form above.',
    capFuture: 'days to go',
    capToday: 'It\u2019s today 🎉',
    capPast: 'days since',
    badgeAnnual: 'Every year',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    more: 'More projects',
    footNote: 'Countdown Days · 倒数日 — a free little tool; data is stored locally in your browser.'
  }
};

const COLORS = {
  red: '#b03a2e', gold: '#b98a2f', pine: '#3e7d4e',
  indigo: '#3a5a8c', plum: '#7a4a6e', slate: '#5a6b72'
};

let lang = localStorage.getItem('countdown_lang') || 'zh';
if (!STR[lang]) lang = 'zh';
const t = (k) => STR[lang][k];

/* ---------- date math (calendar-exact, local, ignores time-of-day) ---------- */
const DAY_MS = 86400000;

function parseISO(iso) { // 'YYYY-MM-DD' -> {y, m, d} without timezone surprises
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}
function dayIndex(y, m, d) { // whole days on the UTC calendar — DST-proof
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}
function todayParts() {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
}
function diffFromToday(y, m, d) {
  const tp = todayParts();
  return dayIndex(y, m, d) - dayIndex(tp.y, tp.m, tp.d);
}
/* Days until the event. Annual events always resolve to their next
   occurrence (today counts as 0). One-off events may be negative. */
function effectiveDiff(ev) {
  const { y, m, d } = parseISO(ev.date);
  if (!ev.annual) return diffFromToday(y, m, d);
  const ty = todayParts().y;
  let diff = diffFromToday(ty, m, d);
  if (diff < 0) diff = diffFromToday(ty + 1, m, d);
  return diff;
}
function occurrenceISO(ev) { // the date the card is counting to/from
  const { y, m, d } = parseISO(ev.date);
  if (!ev.annual) return ev.date;
  const ty = todayParts().y;
  const pad = (n) => String(n).padStart(2, '0');
  const yr = diffFromToday(ty, m, d) < 0 ? ty + 1 : ty;
  return yr + '-' + pad(m) + '-' + pad(d);
}

/* ---------- storage ---------- */
const STORE_KEY = 'countdown_events';
let events = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === null) { // first run: seed one deletable sample card
      const seed = [sampleEvent()];
      localStorage.setItem(STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}
function sampleEvent() {
  // Anniversary sample: next March 21 from today (rolls to next year if past)
  const tp = todayParts();
  const yr = diffFromToday(tp.y, 3, 21) < 0 ? tp.y + 1 : tp.y;
  return { id: 'sample', title: '纪念日 Anniversary', date: yr + '-03-21', annual: true, color: 'red' };
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(events));
}
function uid() {
  return 'ev' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const cardsEl = $('cards');
let editingId = null;
let chosenColor = 'red';

function fmtDate(iso) {
  const { y, m, d } = parseISO(iso);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

function sortedEvents() {
  return events.map((ev) => ({ ev, diff: effectiveDiff(ev) }))
    .sort((a, b) => {
      const ka = a.diff >= 0 ? a.diff : 1000000 - a.diff; // past: most recent first, after upcoming
      const kb = b.diff >= 0 ? b.diff : 1000000 - b.diff;
      return ka - kb;
    });
}

function render() {
  cardsEl.innerHTML = '';
  $('emptyState').hidden = events.length > 0;
  for (const { ev, diff } of sortedEvents()) {
    const card = document.createElement('article');
    card.className = 'ev-card' + (diff === 0 ? ' today' : '');
    card.dataset.id = ev.id;
    card.dataset.diff = String(diff);
    card.style.setProperty('--acc', COLORS[ev.color] || COLORS.red);

    const num = Math.abs(diff);
    const cap = diff > 0 ? t('capFuture') : (diff < 0 ? t('capPast') : t('capToday'));

    const top = document.createElement('div');
    top.className = 'ev-top';
    const h = document.createElement('h3');
    h.className = 'ev-title';
    h.textContent = ev.title;
    const tools = document.createElement('div');
    tools.className = 'ev-tools';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'tool-btn ev-edit';
    editBtn.textContent = t('btnEdit');
    editBtn.addEventListener('click', () => startEdit(ev.id));
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'tool-btn ev-del';
    delBtn.textContent = t('btnDelete');
    delBtn.addEventListener('click', () => removeEvent(ev.id));
    tools.append(editBtn, delBtn);
    top.append(h, tools);

    const dateP = document.createElement('p');
    dateP.className = 'ev-date';
    dateP.textContent = fmtDate(occurrenceISO(ev));

    card.append(top, dateP);
    if (ev.annual) {
      const badge = document.createElement('span');
      badge.className = 'ev-badge';
      badge.textContent = t('badgeAnnual');
      card.append(badge);
    }

    const big = document.createElement('div');
    big.className = 'ev-big';
    const numEl = document.createElement('span');
    numEl.className = 'ev-num';
    numEl.textContent = String(num);
    const capEl = document.createElement('span');
    capEl.className = 'ev-cap';
    capEl.textContent = cap;
    big.append(numEl, capEl);
    card.append(big);

    cardsEl.append(card);
  }
}

/* ---------- form ---------- */
function setColor(color) {
  chosenColor = COLORS[color] ? color : 'red';
  document.querySelectorAll('.swatch').forEach((s) =>
    s.classList.toggle('sel', s.dataset.color === chosenColor));
}
function resetForm() {
  editingId = null;
  $('evTitle').value = '';
  $('evDate').value = '';
  $('evAnnual').checked = false;
  setColor('red');
  $('formError').hidden = true;
  $('formHeading').textContent = t('formAdd');
  $('saveBtn').textContent = t('btnAdd');
  $('cancelBtn').hidden = true;
}
function startEdit(id) {
  const ev = events.find((e) => e.id === id);
  if (!ev) return;
  editingId = id;
  $('evTitle').value = ev.title;
  $('evDate').value = ev.date;
  $('evAnnual').checked = !!ev.annual;
  setColor(ev.color);
  $('formError').hidden = true;
  $('formHeading').textContent = t('formEdit');
  $('saveBtn').textContent = t('btnSave');
  $('cancelBtn').hidden = false;
  $('evTitle').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function removeEvent(id) {
  events = events.filter((e) => e.id !== id);
  if (editingId === id) resetForm();
  save();
  render();
}

$('saveBtn').addEventListener('click', () => {
  const title = $('evTitle').value.trim();
  const date = $('evDate').value;
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    $('formError').hidden = false;
    return;
  }
  $('formError').hidden = true;
  if (editingId) {
    const ev = events.find((e) => e.id === editingId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.annual = $('evAnnual').checked;
      ev.color = chosenColor;
    }
  } else {
    events.push({
      id: uid(), title, date,
      annual: $('evAnnual').checked, color: chosenColor
    });
  }
  save();
  resetForm();
  render();
});
$('cancelBtn').addEventListener('click', resetForm);

document.querySelectorAll('.swatch').forEach((s) =>
  s.addEventListener('click', () => setColor(s.dataset.color)));

document.querySelectorAll('.chip').forEach((chip) =>
  chip.addEventListener('click', () => {
    const key = 'chip' + chip.dataset.chip.charAt(0).toUpperCase() + chip.dataset.chip.slice(1);
    $('evTitle').value = t(key);
    $('evDate').focus();
  }));

/* ---------- language ---------- */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t(el.dataset.i18n);
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const v = t(el.dataset.i18nPh);
    if (v !== undefined) el.setAttribute('placeholder', v);
  });
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
  // refresh form state labels for the current mode
  $('formHeading').textContent = editingId ? t('formEdit') : t('formAdd');
  $('saveBtn').textContent = editingId ? t('btnSave') : t('btnAdd');
  render();
}
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('countdown_lang', lang);
  applyLang();
});

applyLang();
