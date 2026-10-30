"use strict";
/* 成语接龙 Idiom Solitaire — data in data.js (IDIOMS: {w,p,m}) */
const STR = {
  zh: {
    title: "成语接龙", subtitle: "首尾相连 · 与电脑对接成语",
    score: "接龙长度", best: "最佳纪录", need: "下一字", timeLeft: "剩余时间",
    start: "开始游戏", restart: "重新开始", hint: "提示", giveUp: "认输", timer30: "30 秒限时",
    placeholder: "输入成语…", play: "接龙",
    rule: "规则：你接的成语，第一个字必须与上一个成语的最后一个字相同，不能重复。",
    more: "更多小应用", dataNote: "成语数据：chinese-xinhua 开源数据集（MIT）",
    you: "你", pc: "电脑",
    welcome: "点「开始游戏」，电脑先出一个成语，你来接！",
    yourTurn: (c) => `请接以「${c}」开头的成语。`,
    unknown: "词库里没有这个成语，换个试试。",
    wrongStart: (c) => `要以「${c}」开头才行。`,
    repeated: "这个成语已经用过了。",
    notFour: "请输入四字成语。",
    pcStuck: (n) => `电脑接不上了，你赢了！本局接龙 ${n} 个。`,
    noMove: (n) => `没有可接的成语了，本局结束，接龙 ${n} 个。`,
    gaveUp: (n) => `已认输。本局接龙 ${n} 个。`,
    timeUp: (n) => `时间到！本局接龙 ${n} 个。`,
    newBest: "新纪录！",
    hintCount: (n) => `提示：以「${needChar}」开头的可用成语有 ${n} 个。`,
    hintReveal: (w) => `提示：可以试试「${w}」。`,
    hintNone: "没有可接的成语了。",
    startFirst: "先点「开始游戏」。",
  },
  en: {
    title: "Idiom Solitaire", subtitle: "Chain Chinese idioms head-to-tail vs the computer",
    score: "Chain length", best: "Best", need: "Next char", timeLeft: "Time left",
    start: "Start game", restart: "Restart", hint: "Hint", giveUp: "Give up", timer30: "30s timer",
    placeholder: "Type an idiom…", play: "Play",
    rule: "Rule: your idiom must start with the last character of the previous one. No repeats.",
    more: "More mini-apps", dataNote: "Idiom data: chinese-xinhua open dataset (MIT)",
    you: "You", pc: "Computer",
    welcome: "Press Start — the computer plays an idiom first, then you chain!",
    yourTurn: (c) => `Your turn: play an idiom starting with 「${c}」.`,
    unknown: "That idiom is not in the word bank. Try another.",
    wrongStart: (c) => `It must start with 「${c}」.`,
    repeated: "That idiom was already used.",
    notFour: "Please enter a 4-character idiom.",
    pcStuck: (n) => `The computer is stuck — you win! Chain of ${n}.`,
    noMove: (n) => `No idiom can follow. Game over — chain of ${n}.`,
    gaveUp: (n) => `You gave up. Chain of ${n}.`,
    timeUp: (n) => `Time's up! Chain of ${n}.`,
    newBest: "New best!",
    hintCount: (n) => `Hint: ${n} idiom(s) can start with 「${needChar}」.`,
    hintReveal: (w) => `Hint: try 「${w}」.`,
    hintNone: "No idiom can follow.",
    startFirst: "Press Start first.",
  },
};

let lang = localStorage.getItem("idiomchain_lang") || "zh";
if (!STR[lang]) lang = "zh";
const t = () => STR[lang];

const byWord = new Map(IDIOMS.map((e) => [e.w, e]));
const byFirst = new Map();
for (const e of IDIOMS) {
  if (!byFirst.has(e.w[0])) byFirst.set(e.w[0], []);
  byFirst.get(e.w[0]).push(e);
}

let chain = [];        // entries played, in order
let used = new Set();
let needChar = null;   // char the next idiom must start with
let playing = false;
let fails = 0;         // failed attempts on the current turn
let timerId = null, timeLeft = 30;

const $ = (id) => document.getElementById(id);
const els = {
  score: $("score"), best: $("best"), need: $("needChar"), msg: $("msg"),
  hint: $("hintBox"), chain: $("chain"), answer: $("answer"),
  timerStat: $("timerStat"), timer: $("timer"), timerToggle: $("timerToggle"),
};
let best = parseInt(localStorage.getItem("idiomchain_best") || "0", 10);
els.best.textContent = best;

function applyLang() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (t()[k]) el.textContent = t()[k];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const k = el.getAttribute("data-i18n-ph");
    if (t()[k]) el.placeholder = t()[k];
  });
  $("langBtn").textContent = lang === "zh" ? "EN" : "中文";
  renderChain();
}
$("langBtn").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("idiomchain_lang", lang);
  applyLang();
});

function setMsg(text, cls) {
  els.msg.textContent = text;
  els.msg.className = "msg" + (cls ? " " + cls : "");
}
function validReplies(c) {
  return (byFirst.get(c) || []).filter((e) => !used.has(e.w));
}
function renderChain() {
  els.chain.innerHTML = "";
  chain.forEach((item, i) => {
    const d = document.createElement("div");
    d.className = "entry " + (item.who === "pc" ? "pc" : "you") + (i === chain.length - 1 ? " last" : "");
    const w = item.e.w;
    const hl = w.slice(0, 3) + "<b>" + w[3] + "</b>";
    d.innerHTML = `<span class="who">${item.who === "pc" ? t().pc : t().you}</span>
      <div class="word">${hl}<span class="py">${item.e.p}</span></div>
      <div class="mean">${item.e.m}</div>`;
    els.chain.appendChild(d);
  });
  els.score.textContent = chain.length;
  els.need.textContent = needChar || "—";
}
function playEntry(e, who) {
  chain.push({ e, who });
  used.add(e.w);
  needChar = e.w[3];
  renderChain();
}
function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}
function startTimer() {
  stopTimer();
  if (!els.timerToggle.checked || !playing) { els.timerStat.hidden = true; return; }
  timeLeft = 30;
  els.timerStat.hidden = false;
  els.timer.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft -= 1;
    els.timer.textContent = timeLeft;
    if (timeLeft <= 0) { endGame(t().timeUp(chain.length)); }
  }, 1000);
}
function endGame(text) {
  playing = false;
  stopTimer();
  let suffix = "";
  if (chain.length > best) {
    best = chain.length;
    localStorage.setItem("idiomchain_best", String(best));
    els.best.textContent = best;
    suffix = " " + t().newBest;
  }
  setMsg(text + suffix, "ok");
  $("startBtn").textContent = t().restart;
}
function startGame() {
  chain = []; used = new Set(); fails = 0; playing = true;
  els.hint.hidden = true;
  // Computer opens with an idiom that has onward options, so the game can run.
  const openers = IDIOMS.filter((e) => validRepliesCount(e.w[3]) > 0);
  const first = openers[Math.floor(Math.random() * openers.length)];
  playEntry(first, "pc");
  setMsg(t().yourTurn(needChar), "");
  els.answer.value = "";
  els.answer.focus();
  startTimer();
}
function validRepliesCount(c) {
  return (byFirst.get(c) || []).filter((e) => !used.has(e.w)).length;
}
function submit() {
  if (!playing) { setMsg(t().startFirst, "err"); return; }
  const raw = els.answer.value.trim();
  const fail = (text) => {
    fails += 1;
    setMsg(text, "err");
    if (fails >= 3) showHint(true);
  };
  if (raw.length !== 4) return fail(t().notFour);
  const e = byWord.get(raw);
  if (!e) return fail(t().unknown);
  if (used.has(raw)) return fail(t().repeated);
  if (raw[0] !== needChar) return fail(t().wrongStart(needChar));
  // Valid player move.
  fails = 0;
  els.hint.hidden = true;
  playEntry(e, "you");
  els.answer.value = "";
  stopTimer();
  if (validReplies(needChar).length === 0) {
    return endGame(t().pcStuck(chain.length));
  }
  // Computer replies.
  const options = validReplies(needChar);
  const reply = options[Math.floor(Math.random() * options.length)];
  setTimeout(() => {
    if (!playing) return;
    playEntry(reply, "pc");
    if (validReplies(needChar).length === 0) {
      return endGame(t().noMove(chain.length));
    }
    setMsg(t().yourTurn(needChar), "");
    startTimer();
    els.answer.focus();
  }, 450);
}
function showHint(reveal) {
  if (!playing) { setMsg(t().startFirst, "err"); return; }
  const options = validReplies(needChar);
  els.hint.hidden = false;
  if (options.length === 0) els.hint.textContent = t().hintNone;
  else if (reveal || fails >= 3) els.hint.textContent = t().hintReveal(options[0].w);
  else els.hint.textContent = t().hintCount(options.length);
}
$("startBtn").addEventListener("click", startGame);
$("submitBtn").addEventListener("click", submit);
$("hintBtn").addEventListener("click", () => showHint(false));
$("giveUpBtn").addEventListener("click", () => { if (playing) endGame(t().gaveUp(chain.length)); });
els.answer.addEventListener("keydown", (ev) => { if (ev.key === "Enter") submit(); });
els.timerToggle.addEventListener("change", () => { if (playing) startTimer(); else els.timerStat.hidden = true; });

applyLang();
setMsg(t().welcome, "");
