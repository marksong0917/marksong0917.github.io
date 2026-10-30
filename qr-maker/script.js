'use strict';

// Encode all content as UTF-8 bytes so Chinese text survives the round trip.
qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

const STRINGS = {
  zh: {
    title: '二维码生成器',
    tagline: '输入链接或文字，立刻生成二维码',
    intro: '把链接、文字或任何内容变成二维码。可以选下载尺寸、纠错等级和颜色。所有生成都在你的浏览器里完成。',
    privacy: '🔒 内容不上传，全部在本机生成',
    labelContent: '内容（链接或文字）',
    phContent: '例如 https://example.com 或任何文字…',
    labelSize: '下载尺寸',
    labelEc: '纠错等级',
    labelFg: '前景色',
    labelBg: '背景色',
    ecHint: '纠错等级越高，二维码被遮挡或磨损时越容易扫出来，但图案也会更密。',
    contrastWarn: '⚠ 两个颜色太接近了，对比度太低，可能扫不出来。',
    tooLong: '内容太长了，二维码装不下。缩短一点再试。',
    emptyHint: '输入内容后，二维码会出现在这里',
    download: '下载 PNG',
    copy: '复制图片',
    copied: '已复制，去粘贴吧',
    copyFail: '复制失败，请用下载',
    chars: '字',
    modules: '模块',
    more: '更多作品',
    credit: '开源（MIT）',
  },
  en: {
    title: 'QR Maker',
    tagline: 'Type a link or text, get a QR code instantly',
    intro: 'Turn a link, text, or anything into a QR code. Choose the download size, error-correction level, and colours. Everything is generated right in your browser.',
    privacy: '🔒 Nothing uploads — generated locally',
    labelContent: 'Content (link or text)',
    phContent: 'e.g. https://example.com or any text…',
    labelSize: 'Download size',
    labelEc: 'Error correction',
    labelFg: 'Foreground',
    labelBg: 'Background',
    ecHint: 'Higher error correction keeps the code scannable when partly covered or worn, but makes the pattern denser.',
    contrastWarn: '⚠ The two colours are too close — low contrast may not scan.',
    tooLong: 'That content is too long for a QR code. Shorten it and try again.',
    emptyHint: 'Your QR code will appear here',
    download: 'Download PNG',
    copy: 'Copy image',
    copied: 'Copied — paste it anywhere',
    copyFail: 'Copy failed — use Download instead',
    chars: 'chars',
    modules: 'modules',
    more: 'More projects',
    credit: 'Open source (MIT)',
  },
};

const $ = (id) => document.getElementById(id);
let lang = localStorage.getItem('qrmaker_lang') || 'zh';
let currentQR = null; // { count, isDark(r,c) } for the current content, or null

function t(key) { return STRINGS[lang][key]; }

function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    if (STRINGS[lang][k]) el.textContent = STRINGS[lang][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const k = el.getAttribute('data-i18n-ph');
    if (STRINGS[lang][k]) el.placeholder = STRINGS[lang][k];
  });
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
  updateMeta();
}

function makeQR(text, ec) {
  for (let typeNumber = 1; typeNumber <= 40; typeNumber++) {
    try {
      const qr = qrcode(typeNumber, ec);
      qr.addData(text);
      qr.make();
      return qr;
    } catch (e) {
      // Only "code length overflow" is worth retrying at a bigger type number.
      // (The library throws a plain string, not an Error.)
      if (!/overflow/i.test(String((e && e.message) || e))) throw e;
    }
  }
  return null;
}

function drawQR(canvas, qr, targetPx, fg, bg) {
  const n = qr.getModuleCount();
  const quiet = 4;
  const total = n + quiet * 2;
  const cell = Math.max(1, Math.floor(targetPx / total));
  canvas.width = cell * total;
  canvas.height = cell * total;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
    }
  }
}

function luminance(hex) {
  const v = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(v.substr(i, 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function checkContrast() {
  const l1 = luminance($('fgColor').value);
  const l2 = luminance($('bgColor').value);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  $('contrastWarn').hidden = ratio >= 3;
}

function updateMeta() {
  const text = $('content').value;
  $('charCount').textContent = text.length ? text.length + ' ' + t('chars') : '';
  $('qrInfo').textContent = currentQR
    ? currentQR.getModuleCount() + ' × ' + currentQR.getModuleCount() + ' ' + t('modules')
    : '';
}

function regenerate() {
  const text = $('content').value;
  const ec = $('ecLevel').value;
  const fg = $('fgColor').value;
  const bg = $('bgColor').value;
  $('tooLong').hidden = true;
  if (!text) {
    currentQR = null;
    const canvas = $('qrCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $('emptyHint').hidden = false;
    $('qrWrap').classList.remove('dim');
    $('downloadBtn').disabled = true;
    $('copyBtn').disabled = true;
    updateMeta();
    return;
  }
  $('emptyHint').hidden = true;
  let qr = null;
  try { qr = makeQR(text, ec); } catch (e) { qr = null; }
  currentQR = qr;
  if (!qr) {
    $('tooLong').hidden = false;
    $('qrWrap').classList.add('dim');
    $('downloadBtn').disabled = true;
    $('copyBtn').disabled = true;
    updateMeta();
    return;
  }
  $('qrWrap').classList.remove('dim');
  $('downloadBtn').disabled = false;
  $('copyBtn').disabled = false;
  drawQR($('qrCanvas'), qr, 264, fg, bg);
  updateMeta();
}

let debounce = null;
function scheduleRegen() {
  clearTimeout(debounce);
  debounce = setTimeout(regenerate, 180);
}

function showToast(key) {
  const el = $('toast');
  el.textContent = t(key);
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { el.hidden = true; }, 2200);
}

function downloadPNG() {
  if (!currentQR) return;
  const size = parseInt($('dlSize').value, 10);
  const off = document.createElement('canvas');
  drawQR(off, currentQR, size, $('fgColor').value, $('bgColor').value);
  off.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qrcode.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}

async function copyPNG() {
  if (!currentQR) return;
  const size = parseInt($('dlSize').value, 10);
  const off = document.createElement('canvas');
  drawQR(off, currentQR, size, $('fgColor').value, $('bgColor').value);
  try {
    const blob = await new Promise((res) => off.toBlob(res, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showToast('copied');
  } catch (e) {
    showToast('copyFail');
  }
}

// Copy-image support varies; hide the button when the API is absent.
if (!('ClipboardItem' in window) || !(navigator.clipboard && navigator.clipboard.write)) {
  $('copyBtn').hidden = true;
}

$('content').addEventListener('input', scheduleRegen);
$('ecLevel').addEventListener('change', regenerate);
$('dlSize').addEventListener('change', () => {});
$('fgColor').addEventListener('input', () => { checkContrast(); regenerate(); });
$('bgColor').addEventListener('input', () => { checkContrast(); regenerate(); });
$('downloadBtn').addEventListener('click', downloadPNG);
$('copyBtn').addEventListener('click', copyPNG);
$('langBtn').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('qrmaker_lang', lang);
  applyLang();
  regenerate();
});

applyLang();
checkContrast();
regenerate();
