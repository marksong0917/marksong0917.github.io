# 成语接龙 · Idiom Solitaire

与电脑对接成语的小游戏：电脑先出一个成语，你接的成语第一个字必须与上一个成语的最后一个字相同，轮流接龙，不能重复，看谁先接不上。

A head-to-tail Chinese idiom chaining game against the computer. The computer opens with an idiom; your idiom must start with the last character of the previous one. No repeats — chain as long as you can.

**Live:** https://marksong0917.github.io/idiom-chain/

## 玩法 / How to play

- 电脑先出成语，你输入四字成语接龙，电脑再接，轮流进行
- 每个成语都显示拼音和释义
- 输错会被指出原因（词库没有 / 首字不对 / 已重复）
- 「提示」告诉你还有几个可接的成语；连错 3 次会直接给出一个答案
- 可选 30 秒限时模式；最佳接龙长度保存在本地

- The computer opens; type a 4-character idiom to chain, then the computer replies
- Every idiom shows pinyin and meaning
- Mistakes are explained (unknown idiom / wrong starting character / already used)
- The Hint button counts your valid replies; after 3 failed attempts it reveals one
- Optional 30-second move timer; your best chain is saved locally

## 数据 / Data

成语数据来自开源数据集 **chinese-xinhua**（https://github.com/pwxcoo/chinese-xinhua ，`data/idiom.json`），**MIT License**，Copyright (c) 2018 PWXCOO。本项目从中筛选 420 条四字成语（带拼音与释义），优先选取首尾衔接度高的组合，保证对局不容易早早断链。筛选脚本在 `tools/gen_data.py`。

Idiom data comes from the open **chinese-xinhua** dataset (MIT License, © 2018 PWXCOO). A 420-idiom subset of 4-character idioms with pinyin and definitions was selected for chain play — see `tools/gen_data.py`.

## 技术 / Tech

纯静态页面：HTML + CSS + 原生 JavaScript，无构建、无后端、无外部请求。双语界面（中文 / EN），本地直接打开 `index.html` 即可游玩。

Plain static HTML/CSS/vanilla JS. No build step, no backend. Bilingual UI （中文 / EN). Just open `index.html`.

## License

MIT © Ze (Mark) Song. Idiom data: MIT © PWXCOO (chinese-xinhua), see above.
