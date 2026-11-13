# 听写助手 · Dictation

**听一听，写下来。** 一个双语听写练习小工具：播放一句话，把听到的写下来，检查后逐字对照——对的变绿，错的标红并给出正确写法。

**Listen, then type what you heard.** A small bilingual dictation trainer: play a sentence, type what you hear, and get a character-by-character diff — correct in green, mistakes in red with the right answer underneath.

Live: https://marksong0917.github.io/dictation/

## 题库 / Sets

| 题库 Set | 内容 Content |
|---|---|
| 诗句听写 Poem Lines | 静夜思、春晓、登鹳雀楼、悯农、咏鹅 — 10 句古诗名句，附拼音和出处 |
| 成语听写 Idioms | 守株待兔、画蛇添足等 10 个四字成语，附拼音和释义 |
| Daily Sentences | 10 short everyday English sentences, with Chinese translations |
| Famous Lines | 10 short public-domain famous lines (Shakespeare, Descartes, proverbs…), with Chinese translations and sources |

## 玩法 / How it works

1. 选一个题库 Pick a set.
2. 点 ▶ 播放（或 🐢 慢速，0.7 倍速）听句子 Press Play — or Slow for 0.7× playback.
3. 在输入框写下听到的内容，点「检查」或按 Enter Type what you heard and press Check (or Enter).
4. 逐字对照：绿色 = 对；红色 = 错（下方是正确写法）；灰色 ＿ = 漏写；划线 = 多写。The diff: green = correct, red = wrong (correct form below), ＿ = missing, struck-through = extra.
5. 一题可反复尝试；错 3 次后可「显示答案」。每套题的最佳成绩会保存在浏览器里。Retry as often as you like; after 3 failed attempts you can reveal the answer. Your best score per set is saved in your browser.

计分规则：中文按字比较，忽略句末的「。」；英文按词比较，不分大小写，忽略标点。
Scoring: Chinese is compared character by character, ignoring a final 。; English is compared word by word, case-insensitively, ignoring punctuation.

## 语音 / Voices

所有语音都是**提前离线生成**的 MP3（一句一条），用的本地 Piper 神经语音模型（中文 zh_CN-huayan-medium，英文 en_US-lessac-medium），所以任何设备上听到的都是同一个声音，也不需要联网合成。

All voice clips are **pre-generated offline** MP3s (one per item) made with the local Piper neural TTS models (zh_CN-huayan-medium / en_US-lessac-medium) — the same voice on every device, no network synthesis.

重新生成 / Regenerate:

```bash
pip install piper-tts   # plus node + ffmpeg
python tools/gen-audio.py
```

语音模型从 typebook-zh 项目复用（`~/workspace/typebook-zh/tools/voices/`），脚本只合成缺失或过小的文件。
Voice models are reused from the typebook-zh project; the script only synthesizes missing or undersized clips.

## 技术 / Tech

- 纯静态：`index.html` + `style.css` + `script.js`，无框架、无 CDN、无构建步骤。Plain static files — no framework, no CDN, no build step.
- 界面中英双语切换，保存在 `localStorage`（`dictation_lang`）；最佳成绩保存在 `dictation_best`。Bilingual UI persisted in localStorage; best scores likewise.
- 输入用真实文本框，中文输入法（IME）可正常组字。A real text input, so Chinese IMEs compose normally.

## 相关作品 / More by the same author

- [打字读经典 Type the Classics](https://marksong0917.github.io/typebook-zh/) — 一边打字一边读经典
- [打字背单词 TypeWords](https://marksong0917.github.io/typewords/) — 打字背单词
- [作品集 Dashboard](https://marksong0917.github.io/)

## License

MIT © Ze (Mark) Song
