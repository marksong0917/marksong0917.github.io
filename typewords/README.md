# 打字背单词 · TypeWords

把英语单词一个字母一个字母敲出来 —— 敲完听发音、看中文意思和例句，打错的词自动进入复习轮，直到记住为止。

Type English words letter by letter. Finish a word and you hear it spoken, see its Chinese meaning and an example sentence. Words you miss come back in a review round until they stick.

**Live / 在线使用：** https://marksong0917.github.io/typewords/

## 功能 / Features

- **四个词库 / Four levels** — 小学 Primary · 初中 Middle School · 高中 High School · 大学四级 CET-4，每个词库 30 个词，共 120 个精选课内词汇（30 words each, 120 total）
- **逐字母打字 / Letter-by-letter typing** — 单词以空字母槽呈现，配音标；「提示」开关可显示中文意思。Type into empty letter slots with the phonetic shown; a hint toggle reveals the meaning.
- **真人感语音 / Neural voice** — 每个词的发音由本地 Piper 神经网络语音预先生成，敲完立即播放，同设备同声音；缺失时才回退到浏览器语音。Pre-generated Piper neural clips, one per word, played the moment you finish typing.
- **错词复习 / Mistake review** — 本轮打错的词在主轮结束后自动再来一轮，完成后才记为掌握。Missed words return in a review round; a word counts as mastered once completed cleanly or in review.
- **进度保存 / Saved progress** — 每个词库的掌握进度保存在浏览器本地，书架卡上随时可见，可一键重置。Per-level progress in localStorage, shown on the shelf cards, resettable per level.
- **顺序 / 随机 / Order modes** — 顺序练习或随机抽词。Sequential or shuffled order.
- **双语界面 / Bilingual UI** — 中文（默认）/ English 一键切换，设置自动保存。Full Chinese / English UI toggle, persisted.
- **手机可用 / Mobile friendly** — 390px 小屏排版 + 隐藏输入框唤起系统键盘。Works at 390px with the hidden-input pattern for on-screen keyboards.

## 怎么用 / How it works

1. 在书架上选一个词库，点「开始练习」/ Pick a level on the shelf and press Start.
2. 看音标（需要时打开「提示」看中文意思），把单词逐字母敲出来 / Type the word letter by letter using the phonetic (open the hint for the meaning).
3. 敲完后听发音，读例句，点「下一个」或等它自动前进 / Hear the word, read the example, tap Next or let it auto-advance.
4. 打错的词最后进入「错词复习」，全部完成显示本轮成绩 / Missed words join the review round; the completion panel shows your stats.

## 技术 / Tech

纯静态页面：原生 HTML/CSS/JS，无框架、无 CDN、无构建步骤。语音片段由 `tools/gen-audio.py` 用 Piper（en_US-lessac-medium）在本地离线生成，32 kbps 单声道 MP3，领先静音已裁剪。

Plain static site: vanilla HTML/CSS/JS, no frameworks, no CDNs, no build step. Voice clips are generated offline with Piper (en_US-lessac-medium) via `tools/gen-audio.py` — 32 kbps mono MP3s with leading silence trimmed.

## 许可 / License

MIT © Ze (Mark) Song

By Ze (Mark) Song — more projects: https://marksong0917.github.io/
