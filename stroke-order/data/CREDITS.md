# 数据来源与许可证 · Data credits & license

本项目 `data.js` 中的汉字笔顺数据（笔画路径 strokes 与笔顺中线 medians）来自：

- **hanzi-writer-data** — https://github.com/chanind/hanzi-writer-data
  License: MIT（见该仓库 LICENSE）。
- 其上游数据源为 **Make Me a Hanzi** — https://github.com/skishore/makemeahanzi
  （字典与图形数据由该项目整理发布。）

The stroke data in `data.js` (stroke outline paths and median paths) comes from
**hanzi-writer-data** (MIT License), which is derived from the
**Make Me a Hanzi** project by Shaunak Kishore.

每个字的拼音、中文释义与英文释义由本项目作者编写。
Pinyin, Chinese meanings and English glosses for each character were written
for this project.

数据通过 `tools/fetch-data.py` 从 hanzi-writer-data 的 npm 包
（hanzi-writer-data@2.0，经 jsDelivr CDN）逐字拉取并合并为单个本地文件，
运行时不依赖任何外部网络。
Data was fetched per character from the hanzi-writer-data npm package via
jsDelivr by `tools/fetch-data.py` and merged into one local file; nothing is
loaded from the network at runtime.
