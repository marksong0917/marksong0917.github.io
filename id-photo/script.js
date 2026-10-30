"use strict";

/* ---------------- data ---------------- */
/* Print sizes at 300 DPI. Pixel values are the official/common print specs. */
const SIZES = [
  { id: "1inch",    zh: "一寸",     en: "1-inch",       mm: "25 × 35 mm", w: 295, h: 413 },
  { id: "2inch",    zh: "二寸",     en: "2-inch",       mm: "35 × 49 mm", w: 413, h: 579 },
  { id: "small1",   zh: "小一寸",   en: "Small 1-inch", mm: "22 × 32 mm", w: 260, h: 378 },
  { id: "passport", zh: "护照",     en: "Passport",     mm: "33 × 48 mm", w: 390, h: 567 },
  { id: "idcard",   zh: "身份证",   en: "ID card",      mm: "26 × 32 mm", w: 358, h: 441 },
  { id: "usvisa",   zh: "美国签证", en: "US visa",      mm: "51 × 51 mm", w: 600, h: 600 }
];
/* 6-inch print sheet: 152 × 102 mm at 300 DPI */
const SHEET_W = 1795, SHEET_H = 1205, SHEET_GAP = 30;

/* ---------------- i18n ---------------- */
const STR = {
  zh: {
    title: "证件照生成器",
    tagline: "选尺寸、拖裁剪框、下载打印",
    privacy: "照片不上传，只在你的浏览器里处理。",
    intro: "选一张照片，挑好尺寸，把裁剪框拖到脸部位置，就能下载精确像素的单张证件照，或者排好版的六寸打印图，拿去照相馆或自家打印机就能印。",
    honest: "说明：本工具只负责裁剪和尺寸，不更换照片背景。需要蓝底、白底的，请拍的时候就用对应颜色的背景。",
    dropTitle: "把照片拖到这里",
    dropOr: "或者",
    pickBtn: "选择照片",
    dropHint: "支持 JPG、PNG、WebP，建议用正面免冠近照",
    sizeLabel: "证件照尺寸（300 DPI）",
    cropHint: "拖动裁剪框移动位置，拖动四个角调整大小（比例已锁定）。头顶留一点空，肩膀适当入框。",
    previewLabel: "效果预览",
    formatLabel: "单张格式",
    fmtPng: "PNG（无损）",
    fmtJpeg: "JPEG（文件小）",
    dlSingle: "下载单张",
    dlSheet: "下载六寸排版（JPEG）",
    changePhoto: "换一张照片",
    tipsTitle: "拍照小提示",
    tip1: "站在纯色墙面前，光线均匀，别让脸上有一半阴影。",
    tip2: "手机拿正、与脸同高，拍半身照再裁，比直接怼脸拍更自然。",
    tip3: "六寸排版是 1795 × 1205 px（152 × 102 mm，300 DPI），打印时选「六寸/4×6 英寸」纸张即可。",
    more: "更多作品",
    credit: "免费开源（MIT）· Ze (Mark) Song 出品",
    sizeInfo: "当前输出：{w} × {h} px · {mm}",
    sheetInfo: "六寸相纸可排 {n} 张"
  },
  en: {
    title: "ID Photo Maker",
    tagline: "Pick a size, drag the crop box, download & print",
    privacy: "Your photo never leaves your browser.",
    intro: " Pick a photo, choose a size, drag the crop box over the face — then download a single ID photo at the exact pixel size, or a ready-to-print 6-inch sheet to take to a print shop or your own printer.",
    honest: "Please note: this tool crops and sizes only — it does not change the photo background. Need a blue or white background? Shoot against that colour to begin with.",
    dropTitle: "Drag & drop a photo here",
    dropOr: "or",
    pickBtn: "Choose a photo",
    dropHint: "JPG, PNG or WebP — a front-facing headshot works best",
    sizeLabel: "ID photo size (300 DPI)",
    cropHint: "Drag the box to move it, drag the four corners to resize (aspect locked). Leave a little space above the head and include some shoulder.",
    previewLabel: "Preview",
    formatLabel: "Single format",
    fmtPng: "PNG (lossless)",
    fmtJpeg: "JPEG (smaller file)",
    dlSingle: "Download single photo",
    dlSheet: "Download 6-inch sheet (JPEG)",
    changePhoto: "Use a different photo",
    tipsTitle: "Photo tips",
    tip1: "Stand in front of a plain wall with even light — no half-shadow across the face.",
    tip2: "Hold the phone level with the face and shoot a half-body shot, then crop — it looks more natural than a close-up.",
    tip3: "The sheet is 1795 × 1205 px (152 × 102 mm, 300 DPI). Print it on 6-inch / 4×6 paper.",
    more: "More projects",
    credit: "Free & open source (MIT) · by Ze (Mark) Song",
    sizeInfo: "Output: {w} × {h} px · {mm}",
    sheetInfo: "Fits {n} copies on a 6-inch sheet"
  }
};

/* ---------------- state ---------------- */
let lang = localStorage.getItem("idphoto_lang") || "zh";
if (lang !== "zh" && lang !== "en") lang = "zh";
let curSize = 0;               // index into SIZES
let srcCanvas = null;          // natural-size source canvas
let scale = 1;                 // display px per natural px
let dispW = 0, dispH = 0;      // displayed image size (CSS px)
let crop = null;               // {x, y, w, h} in display px

const $ = (id) => document.getElementById(id);
const dropZone = $("dropZone"), fileInput = $("fileInput"), editor = $("editor");
const sizeGrid = $("sizeGrid"), sizeInfo = $("sizeInfo"), sheetInfo = $("sheetInfo");
const stage = $("stage"), photoCanvas = $("photoCanvas"), cropBox = $("cropBox");
const preview = $("preview");

const size = () => SIZES[curSize];
const aspect = () => size().w / size().h;

/* ---------------- language ---------------- */
function applyLang() {
  const dict = STR[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  $("langBtn").textContent = lang === "zh" ? "EN" : "中文";
  buildChips();
  renderDynamic();
}
$("langBtn").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("idphoto_lang", lang);
  applyLang();
});

/* ---------------- size chips ---------------- */
function buildChips() {
  sizeGrid.innerHTML = "";
  SIZES.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "size-chip" + (i === curSize ? " active" : "");
    b.innerHTML = "";
    const name = document.createElement("span");
    name.textContent = lang === "zh" ? s.zh : s.en;
    const sub = document.createElement("small");
    sub.textContent = s.mm + " · " + s.w + " × " + s.h + " px";
    b.appendChild(name); b.appendChild(sub);
    b.addEventListener("click", () => setSize(i));
    sizeGrid.appendChild(b);
  });
}
function setSize(i) {
  curSize = i;
  buildChips();
  if (srcCanvas) { initCrop(); updateCropUI(); }
  renderDynamic();
}

/* ---------------- dynamic text ---------------- */
function renderDynamic() {
  const s = size();
  sizeInfo.textContent = STR[lang].sizeInfo
    .replace("{w}", s.w).replace("{h}", s.h).replace("{mm}", s.mm);
  if (srcCanvas) {
    sheetInfo.textContent = STR[lang].sheetInfo.replace("{n}", sheetLayout().count);
  } else {
    sheetInfo.textContent = "";
  }
}

/* ---------------- image loading ---------------- */
function openPicker() { fileInput.click(); }
$("pickBtn").addEventListener("click", (e) => { e.stopPropagation(); openPicker(); });
$("changeBtn").addEventListener("click", openPicker);
dropZone.addEventListener("click", openPicker);
dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPicker(); }
});
fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files[0]) loadFile(fileInput.files[0]);
  fileInput.value = "";
});
["dragenter", "dragover"].forEach((ev) => dropZone.addEventListener(ev, (e) => {
  e.preventDefault(); dropZone.classList.add("dragging");
}));
["dragleave", "drop"].forEach((ev) => dropZone.addEventListener(ev, (e) => {
  e.preventDefault(); dropZone.classList.remove("dragging");
}));
dropZone.addEventListener("drop", (e) => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) loadFile(f);
});
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

async function loadFile(file) {
  if (!file || !file.type || !file.type.startsWith("image/")) return;
  let bmp = null;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch (e1) {
    try { bmp = await createImageBitmap(file); } catch (e2) { bmp = null; }
  }
  if (bmp) { setSource(bmp, bmp.width, bmp.height); return; }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { setSource(img, img.naturalWidth, img.naturalHeight); URL.revokeObjectURL(url); };
  img.src = url;
}
function setSource(drawn, w, h) {
  srcCanvas = document.createElement("canvas");
  srcCanvas.width = w; srcCanvas.height = h;
  srcCanvas.getContext("2d").drawImage(drawn, 0, 0);
  editor.hidden = false;
  fitStage();
  initCrop();
  updateCropUI();
  renderDynamic();
}

/* ---------------- stage & crop ---------------- */
function fitStage() {
  if (!srcCanvas) return;
  const wrap = stage.parentElement;
  const maxW = Math.min(wrap.clientWidth - 32, 760);
  const maxH = 520;
  const oldW = dispW;
  scale = Math.min(maxW / srcCanvas.width, maxH / srcCanvas.height);
  dispW = Math.max(1, Math.round(srcCanvas.width * scale));
  dispH = Math.max(1, Math.round(srcCanvas.height * scale));
  scale = dispW / srcCanvas.width;
  photoCanvas.width = dispW; photoCanvas.height = dispH;
  photoCanvas.style.width = dispW + "px";
  photoCanvas.style.height = dispH + "px";
  photoCanvas.getContext("2d").drawImage(srcCanvas, 0, 0, dispW, dispH);
  if (crop && oldW) {
    const k = dispW / oldW;
    crop = { x: crop.x * k, y: crop.y * k, w: crop.w * k, h: crop.h * k };
    clampCropPos();
  }
}
function initCrop() {
  const a = aspect();
  let h = dispH * 0.92, w = h * a;
  if (w > dispW * 0.96) { w = dispW * 0.96; h = w / a; }
  crop = { x: (dispW - w) / 2, y: (dispH - h) / 2, w, h };
}
function clampCropPos() {
  crop.x = Math.min(Math.max(crop.x, 0), dispW - crop.w);
  crop.y = Math.min(Math.max(crop.y, 0), dispH - crop.h);
}
function updateCropUI() {
  if (!crop) return;
  cropBox.style.left = crop.x + "px";
  cropBox.style.top = crop.y + "px";
  cropBox.style.width = crop.w + "px";
  cropBox.style.height = crop.h + "px";
  renderPreview();
  renderDynamic();
}
function renderPreview() {
  const s = size();
  if (preview.width !== s.w) { preview.width = s.w; preview.height = s.h; }
  const ctx = preview.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, s.w, s.h);
  const r = cropSrc();
  ctx.drawImage(srcCanvas, r.sx, r.sy, r.sw, r.sh, 0, 0, s.w, s.h);
}
function cropSrc() {
  return { sx: crop.x / scale, sy: crop.y / scale, sw: crop.w / scale, sh: crop.h / scale };
}

/* drag: move & resize with pointer events */
let drag = null;
cropBox.addEventListener("pointerdown", (e) => {
  if (!crop) return;
  e.preventDefault();
  const corner = e.target && e.target.dataset ? e.target.dataset.corner : null;
  drag = {
    mode: corner ? "resize" : "move",
    corner,
    startX: e.clientX, startY: e.clientY,
    crop0: { ...crop }
  };
  cropBox.setPointerCapture(e.pointerId);
});
cropBox.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
  const c0 = drag.crop0;
  if (drag.mode === "move") {
    crop = { ...c0, x: c0.x + dx, y: c0.y + dy };
    clampCropPos();
  } else {
    resizeCrop(drag.corner, c0, dx);
  }
  updateCropUI();
});
["pointerup", "pointercancel"].forEach((ev) =>
  cropBox.addEventListener(ev, () => { drag = null; }));

function resizeCrop(corner, c0, dx) {
  const a = aspect(), MIN = 40;
  let ax, ay, w, maxW;
  if (corner === "se") { ax = c0.x; ay = c0.y; w = c0.w + dx; maxW = Math.min(dispW - ax, (dispH - ay) * a); }
  else if (corner === "sw") { ax = c0.x + c0.w; ay = c0.y; w = c0.w - dx; maxW = Math.min(ax, (dispH - ay) * a); }
  else if (corner === "ne") { ax = c0.x; ay = c0.y + c0.h; w = c0.w + dx; maxW = Math.min(dispW - ax, ay * a); }
  else { ax = c0.x + c0.w; ay = c0.y + c0.h; w = c0.w - dx; maxW = Math.min(ax, ay * a); }
  w = Math.max(MIN, Math.min(w, maxW));
  const h = w / a;
  let x, y;
  if (corner === "se") { x = ax; y = ay; }
  else if (corner === "sw") { x = ax - w; y = ay; }
  else if (corner === "ne") { x = ax; y = ay - h; }
  else { x = ax - w; y = ay - h; }
  crop = { x, y, w, h };
}

let resizeTimer = null;
window.addEventListener("resize", () => {
  if (!srcCanvas) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { fitStage(); updateCropUI(); }, 150);
});

/* ---------------- export ---------------- */
function makeSingleCanvas() {
  const s = size();
  const c = document.createElement("canvas");
  c.width = s.w; c.height = s.h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, s.w, s.h);
  const r = cropSrc();
  ctx.drawImage(srcCanvas, r.sx, r.sy, r.sw, r.sh, 0, 0, s.w, s.h);
  return c;
}
function sheetLayout() {
  const s = size();
  const cols = Math.floor((SHEET_W + SHEET_GAP) / (s.w + SHEET_GAP));
  const rows = Math.floor((SHEET_H + SHEET_GAP) / (s.h + SHEET_GAP));
  return { cols, rows, count: cols * rows };
}
function makeSheetCanvas() {
  const s = size();
  const { cols, rows } = sheetLayout();
  const sheet = document.createElement("canvas");
  sheet.width = SHEET_W; sheet.height = SHEET_H;
  const ctx = sheet.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, SHEET_W, SHEET_H);
  const single = makeSingleCanvas();
  const totalW = cols * s.w + (cols - 1) * SHEET_GAP;
  const totalH = rows * s.h + (rows - 1) * SHEET_GAP;
  const mx = (SHEET_W - totalW) / 2, my = (SHEET_H - totalH) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.drawImage(single, mx + c * (s.w + SHEET_GAP), my + r * (s.h + SHEET_GAP));
    }
  }
  return sheet;
}
function download(canvas, mime, quality, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }, mime, quality);
}
$("dlSingle").addEventListener("click", () => {
  if (!srcCanvas) return;
  const s = size();
  const fmt = $("singleFormat").value;
  if (fmt === "jpeg") download(makeSingleCanvas(), "image/jpeg", 0.95, "id-photo-" + s.id + "-" + s.w + "x" + s.h + ".jpg");
  else download(makeSingleCanvas(), "image/png", undefined, "id-photo-" + s.id + "-" + s.w + "x" + s.h + ".png");
});
$("dlSheet").addEventListener("click", () => {
  if (!srcCanvas) return;
  download(makeSheetCanvas(), "image/jpeg", 0.95, "id-photo-sheet-" + size().id + ".jpg");
});

/* test hooks */
window.__idphoto = {
  SIZES, SHEET_W, SHEET_H,
  makeSingleCanvas, makeSheetCanvas, sheetLayout, setSize,
  getState: () => ({ curSize, crop: crop ? { ...crop } : null, hasImage: !!srcCanvas })
};

/* ---------------- init ---------------- */
applyLang();
