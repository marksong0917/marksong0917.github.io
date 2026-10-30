"use strict";

/* ---------------- i18n ---------------- */
const STR = {
  zh: {
    title: "图片压缩",
    tagline: "在线压缩图片，不上传服务器",
    privacy: "图片不上传，只在你的浏览器里处理。",
    intro: "把照片拖进来，调好质量和尺寸，一张一张下载走。发微信、传网站、塞邮件，图片小一点总是好的。",
    dropTitle: "把图片拖到这里",
    dropOr: "或者",
    pickBtn: "选择图片",
    dropHint: "支持 JPG、PNG、WebP、GIF，可以多选",
    quality: "质量",
    maxDim: "最大尺寸",
    dimOrig: "不限制",
    format: "输出格式",
    fmtKeep: "保持原格式",
    pngNote: "提示：PNG 输出不使用质量参数，文件可能比 JPEG 大。",
    download: "下载",
    downloadAll: "全部下载",
    clear: "清空",
    empty: "还没有图片。把图片拖进来，或者点上面的按钮选择。",
    working: "处理中…",
    errorText: "无法读取这张图片。",
    gifNote: "GIF 已转为静态首帧",
    images: "张图片",
    saved: "节省",
    more: "更多作品",
    credit: "免费开源（MIT）· Ze (Mark) Song 出品"
  },
  en: {
    title: "Image Compressor",
    tagline: "Shrink images online — nothing uploads",
    privacy: "Your images never leave your browser.",
    intro: " Drop photos in, set the quality and size, and download them one by one. Smaller images are easier to message, upload and email.",
    dropTitle: "Drag & drop images here",
    dropOr: "or",
    pickBtn: "Choose images",
    dropHint: "JPG, PNG, WebP, GIF — multiple files welcome",
    quality: "Quality",
    maxDim: "Max size",
    dimOrig: "Original",
    format: "Output format",
    fmtKeep: "Keep original",
    pngNote: "Note: PNG output ignores the quality setting and can be larger than JPEG.",
    download: "Download",
    downloadAll: "Download all",
    clear: "Clear",
    empty: "No images yet. Drop some above, or click to choose.",
    working: "Working…",
    errorText: "Couldn't read this image.",
    gifNote: "GIF converted to a static first frame",
    images: "images",
    saved: "saved",
    more: "More projects",
    credit: "Free & open source (MIT) · by Ze (Mark) Song"
  }
};

let lang = localStorage.getItem("imgcompress_lang") || "zh";
if (lang !== "zh" && lang !== "en") lang = "zh";
const t = (k) => STR[lang][k] || k;

const $ = (id) => document.getElementById(id);
const dropZone = $("dropZone"), fileInput = $("fileInput");
const qualityEl = $("quality"), qualityVal = $("qualityVal");
const maxDimSel = $("maxDim"), formatSel = $("format");
const resultsEl = $("results"), summaryBar = $("summaryBar"),
      summaryText = $("summaryText"), emptyState = $("emptyState");

/* ---------------- helpers ---------------- */
function fmtBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1048576).toFixed(2) + " MB";
}
const tick = () => new Promise((r) => setTimeout(r, 10));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- state ---------------- */
let items = [];          // one entry per accepted file
let uid = 0;

const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const OK_EXT = /\.(jpe?g|png|webp|gif)$/i;
function isAccepted(file) {
  return OK_TYPES.includes(file.type) || OK_EXT.test(file.name || "");
}

function outTypeFor(item) {
  const f = formatSel.value;
  if (f === "jpeg") return "image/jpeg";
  if (f === "webp") return "image/webp";
  if (f === "png") return "image/png";
  // keep: PNG stays PNG, everything else becomes JPEG
  return item.file.type === "image/png" ? "image/png" : "image/jpeg";
}
const EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
function outNameFor(item, type) {
  const base = (item.file.name || "image").replace(/\.[^.]*$/, "");
  return base + "-min" + (EXT[type] || ".jpg");
}

/* ---------------- decode + compress ---------------- */
async function decode(file) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bmp, w: bmp.width, h: bmp.height, close: () => bmp.close() };
  } catch (e) {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { source: img, w: img.naturalWidth, h: img.naturalHeight,
               close: () => URL.revokeObjectURL(url) };
    } catch (e2) {
      URL.revokeObjectURL(url);
      throw e2;
    }
  }
}

async function compressItem(item) {
  const d = await decode(item.file);
  item.origW = d.w; item.origH = d.h;
  let w = d.w, h = d.h;
  const maxDim = parseInt(maxDimSel.value, 10);
  if (maxDim > 0 && Math.max(w, h) > maxDim) {
    const s = maxDim / Math.max(w, h);
    w = Math.max(1, Math.round(w * s));
    h = Math.max(1, Math.round(h * s));
  }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d").drawImage(d.source, 0, 0, w, h);
  d.close();
  const type = outTypeFor(item);
  const q = parseInt(qualityEl.value, 10) / 100; // ignored for PNG by the browser
  const blob = await new Promise((res) => canvas.toBlob(res, type, q));
  if (!blob) throw new Error("encode failed");
  if (item.outUrl) URL.revokeObjectURL(item.outUrl);
  item.outBlob = blob;
  item.outSize = blob.size;
  item.outW = w; item.outH = h;
  item.outUrl = URL.createObjectURL(blob);
  item.outName = outNameFor(item, type);
  item.status = "done";
}

/* ---------------- processing loop (sequential, coalesced) ---------------- */
let processing = false, dirty = false;
async function scheduleProcess() {
  if (processing) { dirty = true; return; }
  processing = true;
  do {
    dirty = false;
    for (const item of items) {
      if (dirty) break;
      if (item.status === "error") continue;
      item.status = "working";
      renderCard(item);
      try { await compressItem(item); }
      catch (e) { item.status = "error"; }
      renderCard(item);
      renderSummary();
      await tick(); // breathe between files so the page stays responsive
    }
  } while (dirty);
  processing = false;
  renderSummary();
}

/* ---------------- cards ---------------- */
function createCard(item) {
  const root = document.createElement("article");
  root.className = "result-card";
  const thumb = document.createElement("img");
  thumb.className = "thumb";
  thumb.alt = item.file.name;
  thumb.src = item.thumbUrl;
  const fname = document.createElement("div");
  fname.className = "fname";
  fname.textContent = item.file.name;
  fname.title = item.file.name;
  const badge = document.createElement("span");
  badge.className = "badge working";
  const sizes = document.createElement("p");
  sizes.className = "sizes";
  const note = document.createElement("p");
  note.className = "card-note";
  note.hidden = true;
  const err = document.createElement("p");
  err.className = "card-error";
  err.hidden = true;
  const dl = document.createElement("button");
  dl.className = "primary-btn dl-btn";
  dl.type = "button";
  dl.addEventListener("click", () => downloadItem(item));
  root.append(thumb, fname, badge, sizes, note, err, dl);
  item.el = { root, badge, sizes, note, err, dl };
  return root;
}

function renderCard(item) {
  const el = item.el;
  if (!el) return;
  el.dl.textContent = t("download");
  el.note.hidden = !(item.isGif && item.status === "done");
  el.note.textContent = item.isGif ? t("gifNote") : "";
  el.err.hidden = item.status !== "error";
  el.err.textContent = item.status === "error" ? t("errorText") : "";

  if (item.status === "working") {
    el.badge.className = "badge working";
    el.badge.textContent = t("working");
    el.badge.hidden = false;
    el.dl.disabled = true;
  } else if (item.status === "error") {
    el.badge.hidden = true;
    el.dl.disabled = true;
  } else if (item.status === "done") {
    const pct = Math.round((1 - item.outSize / item.origSize) * 100);
    el.badge.hidden = false;
    el.badge.className = "badge" + (pct < 0 ? " bigger" : "");
    el.badge.textContent = (pct >= 0 ? "−" : "+") + Math.abs(pct) + "%";
    el.dl.disabled = false;
  }
  if (item.origW) {
    let s = fmtBytes(item.origSize) + " · " + item.origW + "×" + item.origH;
    if (item.status === "done") {
      s += " → <span class=\"after\">" + fmtBytes(item.outSize) + " · " +
           item.outW + "×" + item.outH + "</span>";
    }
    el.sizes.innerHTML = s;
  } else {
    el.sizes.textContent = fmtBytes(item.origSize);
  }
}

function renderSummary() {
  const done = items.filter((i) => i.status === "done");
  summaryBar.hidden = items.length === 0;
  emptyState.hidden = items.length !== 0;
  if (!done.length) { summaryText.textContent = ""; return; }
  const o = done.reduce((a, i) => a + i.origSize, 0);
  const u = done.reduce((a, i) => a + i.outSize, 0);
  const pct = o ? Math.round((1 - u / o) * 100) : 0;
  summaryText.innerHTML =
    done.length + " " + t("images") + " · " + fmtBytes(o) + " → <strong>" +
    fmtBytes(u) + "</strong> · <span class=\"save-pct\">" + t("saved") + " " + pct + "%</span>";
}

/* ---------------- downloads ---------------- */
function downloadItem(item) {
  if (item.status !== "done" || !item.outUrl) return;
  const a = document.createElement("a");
  a.href = item.outUrl;
  a.download = item.outName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
$("downloadAllBtn").addEventListener("click", async () => {
  for (const item of items) {
    if (item.status === "done") { downloadItem(item); await sleep(400); }
  }
});
$("clearBtn").addEventListener("click", () => {
  for (const item of items) {
    URL.revokeObjectURL(item.thumbUrl);
    if (item.outUrl) URL.revokeObjectURL(item.outUrl);
  }
  items = [];
  resultsEl.innerHTML = "";
  fileInput.value = "";
  renderSummary();
});

/* ---------------- adding files ---------------- */
function addFiles(fileList) {
  let added = false;
  for (const file of fileList) {
    if (!isAccepted(file)) continue;
    const item = {
      id: ++uid, file,
      origSize: file.size, origW: 0, origH: 0,
      outBlob: null, outSize: 0, outW: 0, outH: 0, outUrl: null, outName: "",
      status: "working", isGif: file.type === "image/gif",
      thumbUrl: URL.createObjectURL(file), el: null
    };
    items.push(item);
    resultsEl.appendChild(createCard(item));
    renderCard(item);
    added = true;
  }
  if (added) { renderSummary(); scheduleProcess(); }
}

$("pickBtn").addEventListener("click", (e) => { e.stopPropagation(); fileInput.click(); });
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
});
fileInput.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
["dragenter", "dragover"].forEach((ev) =>
  dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add("dragging"); }));
["dragleave", "drop"].forEach((ev) =>
  dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove("dragging"); }));
dropZone.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

/* ---------------- controls ---------------- */
let debounce = null;
qualityEl.addEventListener("input", () => {
  qualityVal.textContent = qualityEl.value;
  clearTimeout(debounce);
  debounce = setTimeout(scheduleProcess, 150);
});
maxDimSel.addEventListener("change", scheduleProcess);
formatSel.addEventListener("change", scheduleProcess);

/* ---------------- language ---------------- */
function applyLang() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $("langBtn").textContent = lang === "zh" ? "EN" : "中文";
  for (const item of items) renderCard(item);
  renderSummary();
}
$("langBtn").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("imgcompress_lang", lang);
  applyLang();
});
applyLang();
renderSummary();
