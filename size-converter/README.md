# 尺寸换算 · Size Converter

木工、装修、看图纸用的单位换算工具，核心是**带分数的英寸 ↔ 毫米**：输入 `3 1/2`、`3-1/2`、`5' 3 1/2"` 都能读懂，给出毫米、厘米、米、小数英寸、分数英寸（精度 1/2–1/64 可选，还标出取整误差）和英尺+英寸。另有重量（含市斤）、面积、温度换算，以及一张可打印的 1/16 英寸分数对照表。

A trades-grade unit converter whose hero is **fractional inches ↔ millimetres**. It reads `3 1/2`, `3-1/2`, `5' 3 1/2"` and `88.9` alike, and answers in mm, cm, m, decimal inches, fractional inches (step 1/2–1/64, with the rounding error shown) and feet+inches. Weight (including the Chinese 市斤 jin), area and temperature tabs, plus a printable 1/16″ fraction chart, round it out.

## 功能 / Features

- **分数输入** — 混合分数、连字符写法、英尺+英寸，一种输入框全搞定；输错只提示，不出 NaN
- **分数精度可选** — 1/2 到 1/64，默认 1/16；每次取整都标出误差（mm）
- **一行一复制** — 每个结果旁边都有复制按钮
- **对照表** — 1/16″ 到 1″ 的分数 / 小数 / 毫米，打印友好
- **双语界面** — 中文 / English 一键切换，公制单位排在前面
- **纯静态** — 原生 HTML/CSS/JS，无框架、无 CDN、无后端

- **Tolerant fraction parser** — mixed fractions, hyphen form, feet+inches; bad input gets a gentle inline error, never NaN
- **Selectable fraction step** — 1/2 down to 1/64 (default 1/16), rounding error always shown in mm
- **Copy per row** — every result has its own copy button
- **Reference chart** — 1/16″ to 1″ in fraction / decimal / mm, print-friendly
- **Bilingual UI** — 中文 / English toggle, metric results first
- **Zero dependencies** — vanilla HTML/CSS/JS, no build step

## 换算基准 / Conversion basis

- 1 英寸 = **25.4 毫米**（精确值）/ 1 inch = **25.4 mm** exactly
- 1 市斤 = **500 克** / 1 jin = **500 g** exactly
- 1 磅 = 453.59237 克 / 1 lb = 453.59237 g
- 温度用公式换算（°C 基准）/ Temperature converts by formula through °C

## 本地运行 / Run locally

```bash
python3 -m http.server 8944
# 打开 http://127.0.0.1:8944/
```

直接双击 `index.html` 也能用。Opening `index.html` directly also works.

## 更多作品 / More projects

By Ze (Mark) Song — [作品集 Dashboard](https://marksong0917.github.io/) · [打字读经典 Type the Classics](https://marksong0917.github.io/typebook-zh/) · [自助量尺 Measure Kit](https://marksong0917.github.io/measure-kit/) · [GitHub](https://github.com/marksong0917)

## License

MIT © Ze (Mark) Song
