# 汉字笔顺 · Stroke Order

一笔一画学写字：96 个常用汉字，看笔顺动画，再自己临摹。
Learn to write Chinese characters in the correct stroke order — watch the animation, then trace it yourself.

**Live:** https://marksong0917.github.io/stroke-order/

## 这是什么 · What it is

- **4 组字表，96 个常用汉字** — 数字与量、自然、人与身体、日常，从一、二、三到山、水、火、人、手、口。
- **演示模式** — 在田字格里一笔一画播放标准笔顺，每一笔带序号，可慢速重播。
- **练习模式** — 浅色笔顺作引导，在格子里用鼠标或手指临摹；写好一笔点「下一笔」锁定。这是引导临摹，不打分——对照标准字自己判断。
- **带发音** — 每个字都有本地神经网络语音朗读（Piper 离线生成，随站发布）。
- **双语界面** — 中文 / English 一键切换；进度保存在浏览器本地。

- **4 sets, 96 common characters** — numbers, nature, people & body, everyday life.
- **Watch mode** — animated stroke-by-stroke demonstration on a rice grid （田字格）, each stroke numbered, with a slow-speed replay.
- **Practise mode** — trace over a light guide stroke with mouse or touch; tap "Next stroke" to lock it in. Guided tracing, honestly not grading.
- **Voice** — every character has a locally generated neural pronunciation clip (Piper, offline, shipped with the site).
- **Bilingual UI** — 中文 / English toggle; progress is saved in your browser.

## 数据与致谢 · Data & credits

- 笔顺数据来自 [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data)（MIT），其源头为 [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) 项目。详见 [data/CREDITS.md](data/CREDITS.md)。
- Stroke data: hanzi-writer-data (MIT), derived from the Make Me a Hanzi project. See [data/CREDITS.md](data/CREDITS.md).
- 语音模型：Piper `zh_CN-huayan-medium`。Pronunciation: Piper `zh_CN-huayan-medium`.

## 本地运行 · Run locally

纯静态站点，任意静态服务器即可：

```bash
python3 -m http.server 8945
# open http://127.0.0.1:8945/
```

重新生成数据与语音（可选）：

```bash
python3 tools/fetch-data.py   # 拉取 hanzi-writer-data，生成 data.js
python3 tools/gen-audio.py    # 用 Piper 生成缺失的字音（需要 tools/voices 或 typebook-zh 的模型）
```

## 更多作品 · More projects

作品集 Dashboard — https://marksong0917.github.io/
打字读经典 Type the Classics — https://marksong0917.github.io/typebook-zh/
打字背单词 TypeWords — https://marksong0917.github.io/typewords/
听写助手 Dictation — https://marksong0917.github.io/dictation/

## License

MIT © Ze (Mark) Song — 代码部分；笔顺数据遵循其原许可证（见上）。
MIT © Ze (Mark) Song for the code; stroke data under its original license (above).
