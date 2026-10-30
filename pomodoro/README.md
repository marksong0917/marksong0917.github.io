# 番茄钟 · Pomodoro

一个简单好用的在线番茄钟：25 分钟专注，5 分钟休息，每 4 个番茄来一次 15 分钟长休息。中英双语界面，全部在本机浏览器运行，不上传任何数据。

A simple Pomodoro timer: 25 minutes of focus, 5 minutes of break, and a 15-minute long break after every 4 sessions. Bilingual EN/中文 UI, runs entirely in your browser — nothing is uploaded.

**Live:** https://marksong0917.github.io/pomodoro/

## 功能 · Features

- 专注 25 分钟 / 短休息 5 分钟 / 长休息 15 分钟，一键切换
  Focus 25 min / short break 5 min / long break 15 min, one-tap mode switch
- 开始、暂停、继续、重置，带进度圆环
  Start, pause, resume, reset, with a progress ring
- 番茄计数：完成的专注次数自动记录（保存在浏览器本地）
  Session counter: completed focus sessions are counted and saved locally
- 结束提示音（WebAudio 生成，无需音频文件，可关闭）
  End-of-round sound (generated with WebAudio, no audio files, can be muted)
- 中英双语切换，选择会记住
  EN/中文 language toggle, remembered between visits

## 本地运行 · Run locally

直接用浏览器打开 `index.html`，或：

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://127.0.0.1:8000/
```

纯静态页面（HTML/CSS/JS），无构建步骤，无外部依赖。
Plain static page (HTML/CSS/JS) — no build step, no external dependencies.

## 作者 · Author

Ze (Mark) Song — 更多作品 / more projects: https://marksong0917.github.io/

## 许可 · License

MIT — 见 / see [LICENSE](LICENSE). © Ze (Mark) Song.
