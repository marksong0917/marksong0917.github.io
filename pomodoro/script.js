"use strict";

/* ---------- Safe storage (localStorage can throw, e.g. blocked cookies) ---------- */
function storeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storeSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* non-fatal */ }
}

/* ---------- Bilingual UI ---------- */
const STRINGS = {
  zh: {
    appName: "番茄钟",
    tagline: "25 分钟专注，5 分钟休息",
    modeFocus: "专注",
    modeShort: "短休息",
    modeLong: "长休息",
    start: "开始",
    pause: "暂停",
    resume: "继续",
    reset: "重置",
    sessionsDone: "已完成番茄",
    sound: "结束提示音",
    howNote: "专注 25 分钟算一个番茄。每 4 个番茄，休息 15 分钟。计时在本机运行，不上传任何数据。",
    more: "更多作品",
    credit: "免费开源（MIT）",
    statusReady: "准备好了吗？",
    statusFocusing: "专注中…",
    statusPaused: "已暂停",
    statusBreak: "休息一下",
    statusFocusDone: "一个番茄完成！休息一下吧",
    statusBreakDone: "休息结束，继续专注",
    titleSuffix: "番茄钟"
  },
  en: {
    appName: "Pomodoro",
    tagline: "25 minutes of focus, 5 minutes of break",
    modeFocus: "Focus",
    modeShort: "Short Break",
    modeLong: "Long Break",
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    sessionsDone: "Sessions done",
    sound: "Sound when finished",
    howNote: "25 minutes of focus counts as one Pomodoro. After every 4, take a 15-minute break. The timer runs locally — nothing is uploaded.",
    more: "More projects",
    credit: "Free & open source (MIT)",
    statusReady: "Ready when you are",
    statusFocusing: "Focusing…",
    statusPaused: "Paused",
    statusBreak: "Take a break",
    statusFocusDone: "Pomodoro done! Take a break",
    statusBreakDone: "Break over — back to focus",
    titleSuffix: "Pomodoro"
  }
};

let lang = storeGet("pomodoro_lang") || "zh";
if (!STRINGS[lang]) lang = "zh";

function t(key) { return STRINGS[lang][key]; }

function applyLang() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (STRINGS[lang][key]) el.textContent = STRINGS[lang][key];
  });
  document.getElementById("langToggle").textContent = lang === "zh" ? "EN" : "中文";
  render();
}

document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  storeSet("pomodoro_lang", lang);
  applyLang();
});

/* ---------- Timer ---------- */
const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const CYCLE = 4; // focus sessions before a long break

const state = {
  mode: "focus",
  remaining: DURATIONS.focus, // seconds (float)
  running: false,
  started: false,              // true once the current round has been started
  endAt: 0,
  sessions: parseInt(storeGet("pomodoro_sessions") || "0", 10) || 0,
  statusKey: "statusReady"
};

const clockEl = document.getElementById("clock");
const statusEl = document.getElementById("statusText");
const ringEl = document.getElementById("ringFg");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const countEl = document.getElementById("sessionCount");
const dotsEl = document.getElementById("cycleDots");
const soundToggle = document.getElementById("soundToggle");
const RING_C = 2 * Math.PI * 88;
ringEl.style.strokeDasharray = String(RING_C);
ringEl.style.strokeDashoffset = "0";

function fmt(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

function render() {
  const total = DURATIONS[state.mode];
  clockEl.textContent = fmt(state.remaining);
  const frac = total > 0 ? state.remaining / total : 0;
  ringEl.style.strokeDashoffset = String(RING_C * (1 - frac));
  document.body.dataset.mode = state.mode;
  statusEl.textContent = t(state.statusKey);
  countEl.textContent = String(state.sessions);
  const inCycle = state.sessions % CYCLE;
  dotsEl.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("filled", i < inCycle || (inCycle === 0 && state.sessions > 0 && state.mode !== "focus"));
  });
  document.querySelectorAll(".mode-tab").forEach(tab => {
    const isActive = tab.dataset.mode === state.mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  startBtn.disabled = state.running;
  pauseBtn.disabled = !state.running;
  startBtn.textContent = state.started && !state.running ? t("resume") : t("start");
  document.title = (state.running || state.started)
    ? fmt(state.remaining) + " · " + t("titleSuffix")
    : STRINGS[lang].appName + " — " + STRINGS[lang].tagline;
}

let ticker = null;
function tick() {
  state.remaining = Math.max(0, (state.endAt - Date.now()) / 1000);
  if (state.remaining <= 0) { finish(); return; }
  render();
}

function start() {
  if (state.running) return;
  state.endAt = Date.now() + state.remaining * 1000;
  state.running = true;
  state.started = true;
  state.statusKey = state.mode === "focus" ? "statusFocusing" : "statusBreak";
  ticker = setInterval(tick, 200);
  render();
}

function pause() {
  if (!state.running) return;
  state.remaining = Math.max(0, (state.endAt - Date.now()) / 1000);
  state.running = false;
  clearInterval(ticker);
  state.statusKey = "statusPaused";
  render();
}

function setMode(mode, statusKey) {
  state.running = false;
  clearInterval(ticker);
  state.mode = mode;
  state.remaining = DURATIONS[mode];
  state.started = false;
  state.statusKey = statusKey || "statusReady";
  render();
}

function reset() { setMode(state.mode, "statusReady"); }

function finish() {
  clearInterval(ticker);
  state.running = false;
  state.remaining = 0;
  beep();
  if (state.mode === "focus") {
    state.sessions += 1;
    storeSet("pomodoro_sessions", String(state.sessions));
    setMode(state.sessions % CYCLE === 0 ? "long" : "short", "statusFocusDone");
  } else {
    setMode("focus", "statusBreakDone");
  }
}

/* ---------- Sound (WebAudio, no files) ---------- */
let audioCtx = null;
function beep() {
  if (!soundToggle.checked) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [880, 660, 880].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, now + i * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.22 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.22 + 0.2);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + i * 0.22);
      osc.stop(now + i * 0.22 + 0.22);
    });
  } catch (e) { /* sound is a nicety, never break the timer */ }
}

/* ---------- Wiring ---------- */
startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);
document.querySelectorAll(".mode-tab").forEach(tab => {
  tab.addEventListener("click", () => setMode(tab.dataset.mode, "statusReady"));
});

/* Exposed for testing and debugging */
window.Pomodoro = { state, start, pause, reset, finish, setMode, DURATIONS };

applyLang();
render();
