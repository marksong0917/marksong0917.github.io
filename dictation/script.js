/* 听写助手 · Dictation — listen, then type what you heard.
   Plain HTML/CSS/JS, no libraries. Voice clips are pre-generated locally
   with Piper (see tools/gen-audio.py) and shipped as static MP3s. */

const SETS = [
  {
    id: "poems", lang: "zh", icon: "诗",
    name: { zh: "诗句听写", en: "Poem Lines" },
    sub: { zh: "中文 · 古诗名句", en: "Chinese · Classic poem lines" },
    items: [
      { id: "p1", text: "床前明月光，疑是地上霜。", pinyin: "chuáng qián míng yuè guāng, yí shì dì shàng shuāng", source: "《静夜思》· 李白" },
      { id: "p2", text: "举头望明月，低头思故乡。", pinyin: "jǔ tóu wàng míng yuè, dī tóu sī gù xiāng", source: "《静夜思》· 李白" },
      { id: "p3", text: "春眠不觉晓，处处闻啼鸟。", pinyin: "chūn mián bù jué xiǎo, chù chù wén tí niǎo", source: "《春晓》· 孟浩然" },
      { id: "p4", text: "夜来风雨声，花落知多少。", pinyin: "yè lái fēng yǔ shēng, huā luò zhī duō shǎo", source: "《春晓》· 孟浩然" },
      { id: "p5", text: "白日依山尽，黄河入海流。", pinyin: "bái rì yī shān jìn, huáng hé rù hǎi liú", source: "《登鹳雀楼》· 王之涣" },
      { id: "p6", text: "欲穷千里目，更上一层楼。", pinyin: "yù qióng qiān lǐ mù, gèng shàng yī céng lóu", source: "《登鹳雀楼》· 王之涣" },
      { id: "p7", text: "锄禾日当午，汗滴禾下土。", pinyin: "chú hé rì dāng wǔ, hàn dī hé xià tǔ", source: "《悯农》· 李绅" },
      { id: "p8", text: "谁知盘中餐，粒粒皆辛苦。", pinyin: "shéi zhī pán zhōng cān, lì lì jiē xīn kǔ", source: "《悯农》· 李绅" },
      { id: "p9", text: "鹅鹅鹅，曲项向天歌。", pinyin: "é é é, qū xiàng xiàng tiān gē", source: "《咏鹅》· 骆宾王" },
      { id: "p10", text: "白毛浮绿水，红掌拨清波。", pinyin: "bái máo fú lǜ shuǐ, hóng zhǎng bō qīng bō", source: "《咏鹅》· 骆宾王" }
    ]
  },
  {
    id: "idioms", lang: "zh", icon: "语",
    name: { zh: "成语听写", en: "Idioms" },
    sub: { zh: "中文 · 四字成语", en: "Chinese · Four-character idioms" },
    items: [
      { id: "i1", text: "守株待兔", pinyin: "shǒu zhū dài tù", meaning: "比喻死守经验、不知变通，也讽刺妄想不劳而获。" },
      { id: "i2", text: "画蛇添足", pinyin: "huà shé tiān zú", meaning: "比喻做了多余的事，反而不合适。" },
      { id: "i3", text: "亡羊补牢", pinyin: "wáng yáng bǔ láo", meaning: "出了问题以后及时补救，可以防止继续受损失。" },
      { id: "i4", text: "井底之蛙", pinyin: "jǐng dǐ zhī wā", meaning: "比喻见识狭窄的人。" },
      { id: "i5", text: "对牛弹琴", pinyin: "duì niú tán qín", meaning: "比喻对不懂道理的人讲道理，白费口舌。" },
      { id: "i6", text: "拔苗助长", pinyin: "bá miáo zhù zhǎng", meaning: "比喻违反事物发展规律，急于求成，反而坏事。" },
      { id: "i7", text: "狐假虎威", pinyin: "hú jiǎ hǔ wēi", meaning: "比喻依仗别人的势力欺压人。" },
      { id: "i8", text: "刻舟求剑", pinyin: "kè zhōu qiú jiàn", meaning: "比喻做事拘泥固执，不知根据情况变化处理问题。" },
      { id: "i9", text: "掩耳盗铃", pinyin: "yǎn ěr dào líng", meaning: "比喻自欺欺人，明明掩盖不住的事情偏要想法子掩盖。" },
      { id: "i10", text: "杯弓蛇影", pinyin: "bēi gōng shé yǐng", meaning: "比喻因疑神疑鬼而引起恐惧。" }
    ]
  },
  {
    id: "daily", lang: "en", icon: "Aa",
    name: { zh: "日常句子", en: "Daily Sentences" },
    sub: { zh: "English · Everyday sentences", en: "English · Everyday sentences" },
    items: [
      { id: "d1", text: "Good morning, did you sleep well last night?", zh: "早上好，你昨晚睡得好吗？" },
      { id: "d2", text: "Could you please pass me the salt?", zh: "请把盐递给我好吗？" },
      { id: "d3", text: "What time does the train leave today?", zh: "今天火车几点开？" },
      { id: "d4", text: "I would like a cup of coffee.", zh: "我想来一杯咖啡。" },
      { id: "d5", text: "It looks like it might rain later.", zh: "看起来等会儿可能会下雨。" },
      { id: "d6", text: "Can you help me carry this bag?", zh: "你能帮我提这个包吗？" },
      { id: "d7", text: "The kids are playing in the park.", zh: "孩子们正在公园里玩。" },
      { id: "d8", text: "Please call me when you get home.", zh: "到家后请给我打电话。" },
      { id: "d9", text: "We are having dinner at seven tonight.", zh: "我们今晚七点吃晚饭。" },
      { id: "d10", text: "How much does this shirt cost?", zh: "这件衬衫多少钱？" }
    ]
  },
  {
    id: "famous", lang: "en", icon: "✦",
    name: { zh: "名言名句", en: "Famous Lines" },
    sub: { zh: "English · Famous lines", en: "English · Famous lines" },
    items: [
      { id: "f1", text: "To be, or not to be, that is the question.", zh: "生存还是毁灭，这是个问题。", source: "Hamlet — William Shakespeare" },
      { id: "f2", text: "Knowledge is power.", zh: "知识就是力量。", source: "Francis Bacon" },
      { id: "f3", text: "I think, therefore I am.", zh: "我思故我在。", source: "René Descartes" },
      { id: "f4", text: "Time is money.", zh: "时间就是金钱。", source: "Benjamin Franklin" },
      { id: "f5", text: "Less is more.", zh: "少即是多。", source: "Popularized by Ludwig Mies van der Rohe" },
      { id: "f6", text: "Practice makes perfect.", zh: "熟能生巧。", source: "English proverb" },
      { id: "f7", text: "Actions speak louder than words.", zh: "行动胜于言语。", source: "English proverb" },
      { id: "f8", text: "Where there is a will, there is a way.", zh: "有志者，事竟成。", source: "English proverb" },
      { id: "f9", text: "No pain, no gain.", zh: "一分耕耘，一分收获。", source: "English proverb" },
      { id: "f10", text: "All the world's a stage.", zh: "整个世界都是一个舞台。", source: "As You Like It — William Shakespeare (excerpt)" }
    ]
  }
];

/* ---------------- i18n ---------------- */
const I18N = {
  zh: {
    title: "听写助手", tagline: "听一听，写下来",
    intro: "选一个题库，点播放，仔细听，然后把听到的内容写下来。检查后逐字对照：对的变绿，错的标红并给出正确写法。中文按字对，英文不分大小写、不计标点。",
    setsTitle: "选一个题库", items: "题", best: "最佳",
    back: "题库", play: "播放", slow: "慢速",
    placeholder: "把听到的写在这里……",
    check: "检查", next: "下一题", finish: "看结果", reveal: "显示答案",
    score: "得分", attempts: "已尝试", plays: "已播放", times: "次",
    perfect: "全对，太棒了！", goodTry: "对照下面看看错在哪里，再听一遍试试。",
    revealed: "这是正确答案 — 听一遍，记住它。",
    pinyin: "拼音", meaning: "释义", translation: "中文", sourceLabel: "出处",
    summaryTitle: "本轮完成", overall: "总得分", missedTitle: "需要再练的",
    noneMissed: "全部答对，没有错题！", again: "再练一轮", replay: "重听",
    correct: "正确", extra: "多写", missing: "漏写",
    itemOf: "第 {a} 题 / 共 {b} 题",
    more: "更多作品", credit: "声音由本地 Piper 语音模型离线生成 · 开源（MIT）"
  },
  en: {
    title: "Dictation", tagline: "Listen, then write it down",
    intro: "Pick a set, press play, listen carefully, and type what you hear. Checking shows a character-by-character diff: correct turns green, mistakes turn red with the right answer underneath. English is checked case-insensitively, ignoring punctuation.",
    setsTitle: "Pick a set", items: "items", best: "Best",
    back: "Sets", play: "Play", slow: "Slow",
    placeholder: "Type what you heard here…",
    check: "Check", next: "Next", finish: "See results", reveal: "Reveal answer",
    score: "Score", attempts: "Attempts", plays: "Plays", times: "",
    perfect: "Perfect — every character right!", goodTry: "Compare below, listen again, and retry.",
    revealed: "Here is the correct answer — play it once more and remember it.",
    pinyin: "Pinyin", meaning: "Meaning", translation: "Chinese", sourceLabel: "Source",
    summaryTitle: "Session complete", overall: "Overall score", missedTitle: "Needs another try",
    noneMissed: "No misses — everything correct!", again: "Practice again", replay: "Listen",
    correct: "correct", extra: "extra", missing: "missing",
    itemOf: "Item {a} of {b}",
    more: "More projects", credit: "Voices generated offline with the local Piper TTS model · Open source (MIT)"
  }
};

const $ = id => document.getElementById(id);
let lang = localStorage.getItem("dictation_lang") || "zh";
let best = {};
try { best = JSON.parse(localStorage.getItem("dictation_best") || "{}"); } catch (e) { best = {}; }

let cur = null;        // current set object
let idx = 0;           // item index in set
let attempts = 0;      // checks on current item
let plays = 0;         // plays on current item
let checked = false;   // current input has been checked at least once
let revealed = false;
let results = [];      // per item: { best: score, missed: bool }

const player = new Audio();
player.preload = "auto";

/* ---------------- language ---------------- */
function t(key) { return I18N[lang][key]; }
function applyLang() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (I18N[lang][k] !== undefined) el.textContent = I18N[lang][k];
  });
  $("langBtn").textContent = lang === "zh" ? "EN" : "中文";
  $("answer").placeholder = t("placeholder");
  renderShelf();
  if (cur) renderItemHead();
}
$("langBtn").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  localStorage.setItem("dictation_lang", lang);
  applyLang();
});

/* ---------------- shelf ---------------- */
function renderShelf() {
  const grid = $("shelfGrid");
  grid.innerHTML = "";
  SETS.forEach(s => {
    const b = document.createElement("button");
    b.className = "set-card";
    b.type = "button";
    b.setAttribute("data-open", s.id);
    const bestHtml = best[s.id] !== undefined
      ? `<span class="best-tag">${t("best")} ${best[s.id]}%</span>` : "";
    b.innerHTML = `<span class="set-icon">${s.icon}</span>
      <h3>${s.name[lang]}</h3>
      <p class="set-sub">${s.sub[lang]}</p>
      <div class="meta-row"><span>${s.items.length} ${t("items")}</span>${bestHtml}</div>`;
    b.addEventListener("click", () => openSet(s.id));
    grid.appendChild(b);
  });
}

function show(screen) {
  ["shelf", "player-screen", "summary"].forEach(id =>
    $(id).hidden = id !== screen);
}

/* ---------------- session ---------------- */
function openSet(id) {
  cur = SETS.find(s => s.id === id);
  idx = 0;
  results = cur.items.map(() => ({ best: 0, missed: true }));
  startItem();
  show("player-screen");
}

function startItem() {
  attempts = 0; plays = 0; checked = false; revealed = false;
  $("attemptCount").textContent = "0";
  $("playCount").textContent = "0";
  $("answer").value = "";
  $("diff").innerHTML = "";
  $("info").innerHTML = "";
  $("feedback").textContent = "";
  $("scoreLine").textContent = "";
  $("revealBtn").hidden = true;
  $("nextBtn").hidden = true;
  $("checkBtn").disabled = false;
  renderItemHead();
  player.src = clipURL(cur.items[idx]);
  player.load();
  $("answer").focus();
}

function renderItemHead() {
  if (!cur) return;
  $("setName").textContent = cur.name[lang];
  $("itemPos").textContent = t("itemOf")
    .replace("{a}", idx + 1).replace("{b}", cur.items.length);
  $("nextBtn").textContent = idx === cur.items.length - 1 ? t("finish") : t("next");
}

function clipURL(item) { return `audio/${cur.id}/${item.id}.mp3`; }

function fallbackTTS(item) {
  try {
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = cur.lang === "zh" ? "zh-CN" : "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) { /* no voice available */ }
}

let pendingFallback = null;
player.addEventListener("error", () => {
  if (pendingFallback) { fallbackTTS(pendingFallback); pendingFallback = null; }
});

function play(rate) {
  const item = cur.items[idx];
  plays++;
  $("playCount").textContent = plays;
  pendingFallback = item;
  player.src = clipURL(item);
  player.playbackRate = rate;
  player.currentTime = 0;
  const p = player.play();
  if (p) p.catch(() => { /* AbortError: a newer play took over — stay silent */ });
}
$("playBtn").addEventListener("click", () => play(1));
$("slowBtn").addEventListener("click", () => play(0.7));

/* ---------------- checking ---------------- */
/* ZH: exact characters, trailing 。 ignored.
   EN: word-by-word, case-insensitive, punctuation ignored. */
function normalizeZh(s) { return s.replace(/[。．.\s]+$/u, "").replace(/\s+/g, ""); }
function zhUnits(s) { return Array.from(normalizeZh(s)); }
function enWords(s) {
  return s.toLowerCase().replace(/[.,!?;:"“”‘’()—–-]/g, " ").split(/\s+/).filter(Boolean);
}

function compare(item, typed) {
  let exp, got, kind;
  if (cur.lang === "zh") { exp = zhUnits(item.text); got = zhUnits(typed); kind = "char"; }
  else { exp = enWords(item.text); got = enWords(typed); kind = "word"; }
  const n = Math.max(exp.length, got.length);
  let correct = 0;
  const cells = [];
  for (let i = 0; i < n; i++) {
    const e = exp[i], g = got[i];
    if (e !== undefined && g !== undefined && e === g) { correct++; cells.push({ st: "ok", got: g }); }
    else if (e !== undefined && g !== undefined) cells.push({ st: "wrong", got: g, exp: e });
    else if (e !== undefined) cells.push({ st: "missing", exp: e });
    else cells.push({ st: "extra", got: g });
  }
  const score = n === 0 ? 0 : Math.round(100 * correct / n);
  return { cells, score, kind };
}

function renderDiff(cells, kind) {
  const wrap = $("diff");
  wrap.innerHTML = "";
  wrap.className = "diff " + (kind === "word" ? "words" : "chars");
  cells.forEach(c => {
    const d = document.createElement("span");
    if (c.st === "ok") {
      d.className = "cell ok";
      d.innerHTML = `<span class="c-main">${c.got}</span><span class="c-sub">&nbsp;</span>`;
    } else if (c.st === "wrong") {
      d.className = "cell wrong";
      d.innerHTML = `<span class="c-main">${c.got}</span><span class="c-sub">${c.exp}</span>`;
    } else if (c.st === "missing") {
      d.className = "cell missing";
      d.innerHTML = `<span class="c-main">＿</span><span class="c-sub">${c.exp}</span>`;
    } else {
      d.className = "cell extra";
      d.innerHTML = `<span class="c-main">${c.got}</span><span class="c-sub">${t("extra")}</span>`;
    }
    wrap.appendChild(d);
  });
}

function renderInfo(item) {
  const rows = [];
  if (item.pinyin) rows.push(`<div><span class="info-label">${t("pinyin")}</span>${item.pinyin}</div>`);
  if (item.meaning) rows.push(`<div><span class="info-label">${t("meaning")}</span>${item.meaning}</div>`);
  if (item.zh) rows.push(`<div><span class="info-label">${t("translation")}</span>${item.zh}</div>`);
  if (item.source) rows.push(`<div><span class="info-label">${t("sourceLabel")}</span>${item.source}</div>`);
  $("info").innerHTML = rows.join("");
}

function doCheck() {
  const item = cur.items[idx];
  const typed = $("answer").value.trim();
  if (!typed) { $("answer").focus(); return; }
  attempts++;
  checked = true;
  $("attemptCount").textContent = attempts;
  const { cells, score, kind } = compare(item, typed);
  renderDiff(cells, kind);
  renderInfo(item);
  $("scoreLine").textContent = `${t("score")} ${score}%`;
  $("feedback").textContent = score === 100 ? t("perfect") : t("goodTry");
  if (score > results[idx].best) results[idx].best = score;
  results[idx].missed = results[idx].best < 100;
  if (attempts >= 3 && score < 100 && !revealed) $("revealBtn").hidden = false;
  $("nextBtn").hidden = false;
}
$("checkBtn").addEventListener("click", doCheck);
$("answer").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); doCheck(); }
});

$("revealBtn").addEventListener("click", () => {
  const item = cur.items[idx];
  revealed = true;
  renderDiff(compare(item, item.text).cells, cur.lang === "zh" ? "char" : "word");
  renderInfo(item);
  $("feedback").textContent = t("revealed");
  $("revealBtn").hidden = true;
  $("nextBtn").hidden = false;
});

$("nextBtn").addEventListener("click", () => {
  if (idx < cur.items.length - 1) { idx++; startItem(); }
  else finishSession();
});
$("backBtn").addEventListener("click", () => { player.pause(); show("shelf"); });

/* ---------------- summary ---------------- */
function finishSession() {
  player.pause();
  const total = results.reduce((a, r) => a + r.best, 0);
  const overall = Math.round(total / results.length);
  $("overallScore").textContent = overall + "%";
  if (best[cur.id] === undefined || overall > best[cur.id]) {
    best[cur.id] = overall;
    localStorage.setItem("dictation_best", JSON.stringify(best));
  }
  const list = $("missedList");
  list.innerHTML = "";
  const missed = cur.items.filter((it, i) => results[i].missed);
  if (!missed.length) {
    list.innerHTML = `<p class="none-missed">${t("noneMissed")}</p>`;
  } else {
    missed.forEach(it => {
      const row = document.createElement("div");
      row.className = "missed-row";
      const extra = it.pinyin || it.zh || it.meaning || "";
      row.innerHTML = `<div class="missed-text">${it.text}</div>
        <div class="missed-extra">${extra}</div>`;
      const btn = document.createElement("button");
      btn.className = "ghost-btn";
      btn.type = "button";
      btn.textContent = "▶ " + t("replay");
      btn.addEventListener("click", () => {
        pendingFallback = it;
        player.src = clipURL(it);
        player.playbackRate = 1;
        const p = player.play();
        if (p) p.catch(() => {});
      });
      row.appendChild(btn);
      list.appendChild(row);
    });
  }
  renderShelf();
  show("summary");
}
$("againBtn").addEventListener("click", () => openSet(cur.id));
$("shelfBtn").addEventListener("click", () => show("shelf"));

applyLang();
show("shelf");
