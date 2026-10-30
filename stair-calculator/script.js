"use strict";

const STRINGS = {
  zh: {
    title: "楼梯计算", tag: "步高 · 步宽 · 楼梯梁 — 木工楼梯一次算清，全用毫米",
    inputs: "输入", totalRise: "层高（地面到地面，mm）", targetRiser: "目标步高（mm）",
    going: "步宽 / 踏面进深（mm）",
    hint: "改任意一个数字，结果和示意图立刻更新。步数向上取整，实际步高 = 层高 ÷ 步数。",
    results: "结果", risers: "步数（立板数）", actualRiser: "实际步高", treads: "踏面数",
    totalRun: "总进深", stringer: "楼梯梁斜长", angle: "楼梯角度",
    checks: "舒适度检查", diagram: "侧面示意图（按比例）",
    chkRiser: (v) => `实际步高 ${v} mm — 舒适范围 150–180 mm`,
    chkGoing: (v) => `步宽 ${v} mm — 至少 250 mm`,
    chkComfort: (v) => `舒适公式 2×步高＋步宽 = ${v} mm — 舒适范围 600–650 mm`,
    lblRise: "层高", lblRun: "总进深",
    more: "更多作品", footNote: "免费小工具，计算只在本机完成",
    langBtn: "EN"
  },
  en: {
    title: "Stair Calculator", tag: "Riser, tread, stringer — stairs figured in mm, the carpenter's way",
    inputs: "Inputs", totalRise: "Total rise, floor to floor (mm)", targetRiser: "Target riser height (mm)",
    going: "Tread going (mm)",
    hint: "Change any number and the results and diagram update at once. Risers round up; actual riser = total rise ÷ risers.",
    results: "Results", risers: "Risers", actualRiser: "Actual riser", treads: "Treads",
    totalRun: "Total run", stringer: "Stringer length", angle: "Stair angle",
    checks: "Comfort checks", diagram: "Side view (to scale)",
    chkRiser: (v) => `Actual riser ${v} mm — comfort range 150–180 mm`,
    chkGoing: (v) => `Going ${v} mm — minimum 250 mm`,
    chkComfort: (v) => `Comfort rule 2×riser + going = ${v} mm — comfort range 600–650 mm`,
    lblRise: "Rise", lblRun: "Run",
    more: "More projects", footNote: "Free tool — all math runs on your device",
    langBtn: "中文"
  }
};

const LANG_KEY = "staircalculator_lang";
let lang = localStorage.getItem(LANG_KEY) || "zh";
if (!STRINGS[lang]) lang = "zh";

const $ = (id) => document.getElementById(id);
const inputs = [$("inRise"), $("inTarget"), $("inGoing")];

function mmToIn(mm) { return (mm / 25.4).toFixed(2) + " in"; }
function fmt1(x) { return x.toFixed(1); }
function fmt0(x) { return String(Math.round(x)); }

function compute() {
  const rise = parseFloat($("inRise").value);
  const target = parseFloat($("inTarget").value);
  const going = parseFloat($("inGoing").value);
  const valid = [rise, target, going].every((n) => isFinite(n) && n > 0);
  if (!valid) {
    ["outRisers", "outActualRiser", "outTreads", "outRun", "outStringer", "outAngle"]
      .forEach((id) => { $(id).textContent = "–"; });
    ["inchRiser", "inchRun", "inchStringer"].forEach((id) => { $(id).textContent = ""; });
    $("diagram").innerHTML = "";
    return;
  }
  const risers = Math.ceil(rise / target);
  const actualRiser = rise / risers;
  const treads = risers - 1;
  const totalRun = treads * going;
  const stringer = Math.sqrt(rise * rise + totalRun * totalRun);
  const angle = Math.atan2(rise, totalRun) * 180 / Math.PI;

  $("outRisers").textContent = risers;
  $("outActualRiser").textContent = fmt1(actualRiser);
  $("outTreads").textContent = treads;
  $("outRun").textContent = fmt0(totalRun);
  $("outStringer").textContent = fmt0(stringer);
  $("outAngle").textContent = fmt1(angle);
  $("inchRiser").textContent = mmToIn(actualRiser);
  $("inchRun").textContent = mmToIn(totalRun);
  $("inchStringer").textContent = mmToIn(stringer);

  const s = STRINGS[lang];
  setCheck("chkRiser", actualRiser >= 150 && actualRiser <= 180, s.chkRiser(fmt1(actualRiser)));
  setCheck("chkGoing", going >= 250, s.chkGoing(fmt0(going)));
  const comfort = 2 * actualRiser + going;
  setCheck("chkComfort", comfort >= 600 && comfort <= 650, s.chkComfort(fmt1(comfort)));

  drawDiagram(rise, totalRun, risers, treads, actualRiser, going);
}

function setCheck(id, pass, text) {
  const li = $(id);
  li.className = pass ? "pass" : "warn";
  li.querySelector(".badge").textContent = pass ? "✓" : "✗";
  li.querySelector(".ck-text").textContent = text;
}

function drawDiagram(rise, run, risers, treads, actualRiser, going) {
  const s = STRINGS[lang];
  const W = 680, padL = 74, padR = 16, padT = 14, padB = 34;
  const plotW = W - padL - padR;
  const scale = plotW / Math.max(run, 1);
  const plotH = Math.max(60, rise * scale);
  const H = plotH + padT + padB;
  const x0 = padL, yBase = padT + plotH;
  const X = (mm) => x0 + mm * scale;
  const Y = (mm) => yBase - mm * scale;

  let pts = [`${x0},${yBase}`];
  for (let i = 0; i < treads; i++) {
    pts.push(`${X(i * going)},${Y((i + 1) * actualRiser)}`);
    pts.push(`${X((i + 1) * going)},${Y((i + 1) * actualRiser)}`);
  }
  pts.push(`${X(run)},${Y(rise)}`);

  $("diagram").innerHTML =
    `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" role="img" aria-label="stair side view">` +
    `<line x1="${x0}" y1="${yBase}" x2="${X(run)}" y2="${yBase}" stroke="#2b2622" stroke-width="2"/>` +
    `<line x1="${x0}" y1="${Y(rise)}" x2="${x0}" y2="${yBase}" stroke="#2b2622" stroke-width="1" stroke-dasharray="4 3"/>` +
    `<line x1="${x0}" y1="${yBase}" x2="${X(run)}" y2="${Y(rise)}" stroke="#b98a2f" stroke-width="2" stroke-dasharray="7 4"/>` +
    `<polyline points="${pts.join(" ")}" fill="none" stroke="#b03a2e" stroke-width="2.5"/>` +
    `<text x="${x0 - 8}" y="${(yBase + Y(rise)) / 2}" text-anchor="middle" font-size="13" fill="#2b2622" transform="rotate(-90 ${x0 - 8} ${(yBase + Y(rise)) / 2})">${s.lblRise} ${Math.round(rise)} mm</text>` +
    `<text x="${(x0 + X(run)) / 2}" y="${yBase + 24}" text-anchor="middle" font-size="13" fill="#2b2622">${s.lblRun} ${Math.round(run)} mm</text>` +
    `</svg>`;
}

function applyLang() {
  const s = STRINGS[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (s[k]) el.textContent = s[k];
  });
  $("langBtn").textContent = s.langBtn;
  compute();
}

$("langBtn").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem(LANG_KEY, lang);
  applyLang();
});
inputs.forEach((el) => el.addEventListener("input", compute));

applyLang();
