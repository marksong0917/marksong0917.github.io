'use strict';
/* Size Converter — one shared conversion engine, bilingual EN/中文 UI.
   1 inch = 25.4 mm exactly. 1 市斤 (jin) = 500 g exactly. */

const STR = {
  zh: {
    title: '尺寸换算', tagline: '英寸分数 ↔ 毫米，木工装修都用得上',
    intro: '量柜子、买家具、看图纸最常卡住的一步：带分数的英寸怎么换成毫米？这里一次算清，还附重量、面积、温度换算。',
    tabLength: '长度', tabWeight: '重量', tabArea: '面积', tabTemp: '温度',
    inputPh: '输入数值',
    u_mm: '毫米 mm', u_cm: '厘米 cm', u_m: '米 m', u_inch: '英寸 in（可带分数）', u_ftin: '英尺 + 英寸 ft+in',
    lenHelp: '可以输入：3 1/2 · 3-1/2 · 5\' 3 1/2" · 88.9 —— 选「英尺+英寸」时，只输数字按总英寸算。',
    lenError: '看不懂这个输入，试试 3 1/2 或 88.9。',
    numError: '请输入一个数字。',
    precLabel: '分数精度',
    labMm: '毫米', labCm: '厘米', labM: '米', labInDec: '英寸（小数）', labInFrac: '英寸（分数）', labFtIn: '英尺 + 英寸',
    fracErrPre: '分数取整误差：',
    tableTitle: '英寸分数对照表（1/16 步进）', print: '打印',
    thFrac: '分数（英寸）', thDec: '小数（英寸）', thMm: '毫米 mm',
    copy: '复制', copied: '已复制 ✓',
    un_kg: '千克', un_g: '克', un_jin: '市斤', un_lb: '磅', un_oz: '盎司', un_t: '吨',
    un_m2: '平方米', un_cm2: '平方厘米', un_ha: '公顷', un_ft2: '平方英尺', un_in2: '平方英寸', un_acre: '英亩',
    un_C: '摄氏度', un_F: '华氏度', un_K: '开尔文',
    jinNote: '500 克', more: '更多作品',
    credit: 'Ze (Mark) Song 出品 · 我们自己的实现，开源（MIT）'
  },
  en: {
    title: 'Size Converter', tagline: 'Inch fractions ↔ millimetres, built for the trades',
    intro: 'The conversion that stalls every cabinet, furniture and drawing job: fractional inches to millimetres, worked out in one go — plus weight, area and temperature.',
    tabLength: 'Length', tabWeight: 'Weight', tabArea: 'Area', tabTemp: 'Temperature',
    inputPh: 'Enter a value',
    u_mm: 'Millimetres mm', u_cm: 'Centimetres cm', u_m: 'Metres m', u_inch: 'Inches in (fractions OK)', u_ftin: 'Feet + inches ft+in',
    lenHelp: 'Try: 3 1/2 · 3-1/2 · 5\' 3 1/2" · 88.9 — with the ft+in unit, a bare number means total inches.',
    lenError: 'Can\'t read that — try 3 1/2 or 88.9.',
    numError: 'Please enter a number.',
    precLabel: 'Fraction step',
    labMm: 'Millimetres', labCm: 'Centimetres', labM: 'Metres', labInDec: 'Inches (decimal)', labInFrac: 'Inches (fraction)', labFtIn: 'Feet + inches',
    fracErrPre: 'Fraction rounding: off by ',
    tableTitle: 'Inch fraction chart (1/16 steps)', print: 'Print',
    thFrac: 'Fraction (in)', thDec: 'Decimal (in)', thMm: 'Millimetres mm',
    copy: 'Copy', copied: 'Copied ✓',
    un_kg: 'Kilograms', un_g: 'Grams', un_jin: 'Jin (市斤)', un_lb: 'Pounds', un_oz: 'Ounces', un_t: 'Tonnes',
    un_m2: 'Square metres', un_cm2: 'Square centimetres', un_ha: 'Hectares', un_ft2: 'Square feet', un_in2: 'Square inches', un_acre: 'Acres',
    un_C: 'Celsius', un_F: 'Fahrenheit', un_K: 'Kelvin',
    jinNote: '500 g', more: 'More projects',
    credit: 'By Ze (Mark) Song · An original implementation, open source (MIT)'
  }
};

let lang = localStorage.getItem('sizeconverter_lang') || 'zh';
if (!STR[lang]) lang = 'zh';
const t = k => STR[lang][k] || k;
const $ = id => document.getElementById(id);

/* ---------- number helpers ---------- */
function trimNum(s) {
  if (s.indexOf('.') !== -1 && s.indexOf('e') === -1 && s.indexOf('E') === -1) {
    s = s.replace(/0+$/, '').replace(/\.$/, '');
  }
  return s;
}
function fmt(v, dec) {
  if (!isFinite(v)) return '—';
  if (v !== 0 && Math.abs(v) < Math.pow(10, -dec)) return trimNum(v.toPrecision(3));
  return trimNum(v.toFixed(dec));
}
function gcd(a, b) { return b ? gcd(b, a % b) : a; }

/* ---------- parsers ---------- */
/* "3 1/2", "3-1/2", "1/2", "88.9", ".5" → number; anything else → null */
function parseNumFrac(s) {
  s = (s || '').trim();
  if (!s) return null;
  let m = s.match(/^(\d+(?:\.\d+)?)[\s-]+(\d+)\s*\/\s*(\d+)$/);
  if (m) { const d = parseFloat(m[3]); return d ? parseFloat(m[1]) + parseFloat(m[2]) / d : null; }
  m = s.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (m) { const d = parseFloat(m[2]); return d ? parseFloat(m[1]) / d : null; }
  if (/^\d+(?:\.\d+)?$/.test(s) || /^\.\d+$/.test(s)) return parseFloat(s);
  return null;
}
function parseGeneric(s) {
  s = (s || '').trim().replace(',', '.');
  let neg = false;
  if (s.charAt(0) === '-') { neg = true; s = s.slice(1); }
  const v = parseNumFrac(s);
  return v === null ? null : (neg ? -v : v);
}
function parseFeetInches(raw) {
  const s = (raw || '').trim().toLowerCase().replace(/[″”]/g, '"').replace(/[′’]/g, "'").replace(/,/g, '');
  const fm = s.match(/^(\d+(?:\.\d+)?)\s*(?:'|ft|feet|foot)\s*(.*)$/);
  if (fm) {
    const feet = parseFloat(fm[1]);
    const rest = (fm[2] || '').trim().replace(/"$/, '').replace(/\b(inch|inches|in)$/, '').trim();
    let inches = 0;
    if (rest) { inches = parseNumFrac(rest); if (inches === null) return null; }
    return (feet * 12 + inches) * 25.4;
  }
  const v = parseNumFrac(s.replace(/"$/, '').replace(/\b(inch|inches|in)$/, '').trim());
  return v === null ? null : v * 25.4;
}
function parseLength(raw, unit) {
  if (unit === 'ftin') return parseFeetInches(raw);
  let s = (raw || '').trim().toLowerCase().replace(/[″”]/g, '"');
  s = s.replace(/"$/, '').replace(/\b(inch|inches|in|mm|cm|m)$/, '').trim();
  const v = parseNumFrac(s);
  if (v === null) return null;
  return v * { mm: 1, cm: 10, m: 1000, inch: 25.4 }[unit];
}

/* ---------- fractions ---------- */
function fracString(inches, D) {
  const n = Math.round(inches * D);
  const whole = Math.floor(n / D);
  const rem = n - whole * D;
  if (rem === 0) return { text: whole + '"', value: whole };
  const g = gcd(rem, D);
  const text = (whole > 0 ? whole + ' ' : '') + (rem / g) + '/' + (D / g) + '"';
  return { text: text, value: n / D };
}

/* ---------- copy buttons ---------- */
const COPYMAP = {};
async function copyText(txt, btn) {
  try { await navigator.clipboard.writeText(txt); }
  catch (e) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    ta.remove();
  }
  if (btn) { const old = btn.textContent; btn.textContent = t('copied'); setTimeout(() => { btn.textContent = old; }, 1200); }
}
document.addEventListener('click', e => {
  const b = e.target.closest('.copy-btn');
  if (b && COPYMAP[b.dataset.copykey] !== undefined) copyText(COPYMAP[b.dataset.copykey], b);
});
function rowHtml(label, value, unit, copykey, idAttr) {
  return '<li class="result-row"><span class="r-label">' + label + '</span>' +
    '<span class="r-value"' + (idAttr ? ' id="' + idAttr + '"' : '') + '>' + value + '</span>' +
    (unit ? '<span class="r-unit">' + unit + '</span>' : '') +
    '<button type="button" class="copy-btn" data-copykey="' + copykey + '">' + t('copy') + '</button></li>';
}

/* ---------- length (hero) ---------- */
const lenInput = $('lenInput'), lenUnit = $('lenUnit'), precSel = $('precSel'),
      lenResults = $('lenResults'), lenError = $('lenError'), fracErr = $('fracErr');

function renderLength() {
  const raw = lenInput.value;
  if (!raw.trim()) { lenResults.innerHTML = ''; fracErr.textContent = ''; lenError.hidden = true; return; }
  const mm = parseLength(raw, lenUnit.value);
  if (mm === null || mm < 0 || !isFinite(mm)) {
    lenError.textContent = t('lenError'); lenError.hidden = false;
    lenResults.innerHTML = ''; fracErr.textContent = ''; return;
  }
  lenError.hidden = true;
  const D = parseInt(precSel.value, 10);
  const inches = mm / 25.4;
  const f = fracString(inches, D);
  let feet = Math.floor(inches / 12);
  let n = Math.round((inches - feet * 12) * D);
  if (n >= 12 * D) { feet += 1; n -= 12 * D; }
  const fi = fracString(n / D, D);
  const ftinText = feet + "' " + fi.text;

  COPYMAP.l_mm = fmt(mm, 1); COPYMAP.l_cm = fmt(mm / 10, 2); COPYMAP.l_m = fmt(mm / 1000, 4);
  COPYMAP.l_indec = fmt(inches, 3); COPYMAP.l_infrac = f.text; COPYMAP.l_ftin = ftinText;
  lenResults.innerHTML =
    rowHtml(t('labMm'), COPYMAP.l_mm, 'mm', 'l_mm', 'res-mm') +
    rowHtml(t('labCm'), COPYMAP.l_cm, 'cm', 'l_cm', 'res-cm') +
    rowHtml(t('labM'), COPYMAP.l_m, 'm', 'l_m', 'res-m') +
    rowHtml(t('labInDec'), COPYMAP.l_indec, 'in', 'l_indec', 'res-indec') +
    rowHtml(t('labInFrac'), COPYMAP.l_infrac, '', 'l_infrac', 'res-infrac') +
    rowHtml(t('labFtIn'), ftinText, '', 'l_ftin', 'res-ftin');
  const err = f.value * 25.4 - mm;
  fracErr.innerHTML = t('fracErrPre') + '<strong>' + (err > 0 ? '+' : '') + err.toFixed(2) + ' mm</strong>';
}

/* ---------- shared engine for weight / area / temperature ---------- */
/* Every unit converts through the category base unit (g, m², °C). */
const ENGINE = {
  weight: {
    input: 'wInput', unit: 'wUnit', list: 'wResults',
    order: ['kg', 'g', 'jin', 'lb', 'oz', 't'],
    units: {
      kg:  { sym: 'kg', dec: 4, toBase: v => v * 1000,        fromBase: v => v / 1000 },
      g:   { sym: 'g',  dec: 2, toBase: v => v,               fromBase: v => v },
      jin: { sym: '斤', dec: 4, toBase: v => v * 500,         fromBase: v => v / 500 },
      lb:  { sym: 'lb', dec: 4, toBase: v => v * 453.59237,   fromBase: v => v / 453.59237 },
      oz:  { sym: 'oz', dec: 3, toBase: v => v * 28.349523125, fromBase: v => v / 28.349523125 },
      t:   { sym: 't',  dec: 6, toBase: v => v * 1e6,         fromBase: v => v / 1e6 }
    }
  },
  area: {
    input: 'aInput', unit: 'aUnit', list: 'aResults',
    order: ['m2', 'cm2', 'ha', 'ft2', 'in2', 'acre'],
    units: {
      m2:   { sym: 'm²', dec: 4, toBase: v => v,                fromBase: v => v },
      cm2:  { sym: 'cm²', dec: 2, toBase: v => v * 1e-4,        fromBase: v => v / 1e-4 },
      ha:   { sym: 'ha', dec: 6, toBase: v => v * 10000,        fromBase: v => v / 10000 },
      ft2:  { sym: 'ft²', dec: 4, toBase: v => v * 0.09290304,  fromBase: v => v / 0.09290304 },
      in2:  { sym: 'in²', dec: 3, toBase: v => v * 0.00064516,  fromBase: v => v / 0.00064516 },
      acre: { sym: 'acre', dec: 6, toBase: v => v * 4046.8564224, fromBase: v => v / 4046.8564224 }
    }
  },
  temp: {
    input: 'tInput', unit: 'tUnit', list: 'tResults',
    order: ['C', 'F', 'K'],
    units: {
      C: { sym: '°C', dec: 2, toBase: v => v,                fromBase: v => v },
      F: { sym: '°F', dec: 2, toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      K: { sym: 'K',  dec: 2, toBase: v => v - 273.15,       fromBase: v => v + 273.15 }
    }
  }
};
function renderGeneric(name) {
  const def = ENGINE[name];
  const inputEl = $(def.input), unitEl = $(def.unit), listEl = $(def.list);
  const panel = inputEl.closest('.panel');
  const errEl = panel.querySelector('[data-err]');
  const raw = inputEl.value;
  if (!raw.trim()) { listEl.innerHTML = ''; errEl.hidden = true; return; }
  const v = parseGeneric(raw);
  if (v === null || !isFinite(v)) { errEl.textContent = t('numError'); errEl.hidden = false; listEl.innerHTML = ''; return; }
  errEl.hidden = true;
  const base = def.units[unitEl.value].toBase(v);
  listEl.innerHTML = def.order.map(u => {
    const d = def.units[u];
    const val = fmt(d.fromBase(base), d.dec);
    const key = name + '_' + u;
    COPYMAP[key] = val;
    const label = t('un_' + u) + (u === 'jin' ? '（' + t('jinNote') + '）' : '');
    return rowHtml(label, val, d.sym, key);
  }).join('');
}

/* ---------- fraction reference table ---------- */
function buildTable() {
  let html = '';
  for (let n = 1; n <= 16; n++) {
    const g = gcd(n, 16);
    const fr = n === 16 ? '1' : (n / g) + '/' + (16 / g);
    COPYMAP['tbl_' + n] = fmt(n / 16 * 25.4, 4);
    html += '<tr><td>' + fr + '&quot;</td><td>' + fmt(n / 16, 4) + '</td><td>' + COPYMAP['tbl_' + n] + '</td></tr>';
  }
  $('fracBody').innerHTML = html;
}

/* ---------- tabs ---------- */
document.querySelectorAll('.mode-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-tab').forEach(b => b.classList.toggle('active', b === btn));
    ['length', 'weight', 'area', 'temp'].forEach(name => {
      $('panel-' + name).hidden = name !== btn.dataset.tab;
    });
  });
});

/* ---------- i18n ---------- */
function applyI18n() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
}
function renderAll() { renderLength(); renderGeneric('weight'); renderGeneric('area'); renderGeneric('temp'); }
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('sizeconverter_lang', lang);
  applyI18n(); renderAll();
});

/* ---------- events ---------- */
[lenInput, lenUnit, precSel].forEach(el => { el.addEventListener('input', renderLength); el.addEventListener('change', renderLength); });
Object.keys(ENGINE).forEach(name => {
  const def = ENGINE[name];
  [$(def.input), $(def.unit)].forEach(el => {
    el.addEventListener('input', () => renderGeneric(name));
    el.addEventListener('change', () => renderGeneric(name));
  });
});
$('printBtn').addEventListener('click', () => window.print());

applyI18n();
buildTable();
renderAll();
