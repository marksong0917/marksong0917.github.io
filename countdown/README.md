# 倒数日 · Countdown Days

为重要日子建倒计时卡片的小工具：生日、纪念日、考试、旅行……卡片上一个大数字，一眼看到还剩几天。一次性的日子过了会显示已经过去几天；勾选「每年重复」的日子会自动数到下一次。**所有数据只保存在你的浏览器本地，不上传。**

A small countdown tool for the days that matter — birthdays, anniversaries, exams, trips. Each card shows one big number: days remaining, or days since for a one-off date that has passed. Events marked "repeats every year" always count down to their next occurrence. **Everything is stored locally in your browser; nothing is uploaded.**

**Live:** https://marksong0917.github.io/countdown/

## 功能 / Features

- 新建 / 编辑 / 删除倒计时卡片，自动按最近优先排序 / Create, edit and delete countdown cards, sorted soonest-first
- 大数字显示：还有 X 天 · 已过 X 天 · 就是今天 / Big-number display: days to go, days since, or "it's today"
- 每年重复开关：生日、纪念日自动滚到下一次 / Annual toggle: birthdays and anniversaries roll to the next occurrence
- 快捷标题：生日 / 纪念日 / 考试 / 旅行 / 春节 / Preset title chips: Birthday, Anniversary, Exam, Trip, Spring Festival
- 六种卡片配色 / Six card accent colours
- 日期计算按日历整天算，不受时区和夏令时影响 / Calendar-exact day math, immune to time-of-day and DST
- 数据保存在浏览器 localStorage，刷新不丢失 / Cards persist in localStorage
- 中英双语界面，默认中文 / Bilingual EN / 中文 UI, Chinese by default

## 技术 / Tech

- 纯静态 HTML / CSS / JavaScript，无构建、无后端、无外部请求 / Plain static HTML/CSS/JS — no build step, no backend, no external requests
- 本地运行 / Run locally: `python3 -m http.server 8000` 然后打开 / then open http://localhost:8000

## 许可 / License

MIT © Ze (Mark) Song
