# 二维码生成器 · QR Maker

免费在线二维码生成器：输入链接或文字，立刻生成二维码。可以选下载尺寸（512 / 1024 / 2048 px）、纠错等级（L / M / Q / H）和前景/背景颜色，下载 PNG。内容太长时有清楚的提示，颜色对比度太低时会警告。**内容不上传，全部在浏览器本机生成。**

A free QR code maker that runs entirely in your browser. Type a link or text and get a QR code instantly — choose the download size, error-correction level, and colours, then download a PNG. Nothing is uploaded; everything is generated locally.

**Live:** https://marksong0917.github.io/qr-maker/

## 功能 / Features

- 输入即生成（防抖实时刷新）/ Live regeneration as you type (debounced)
- 字符计数、模块数显示 / Character count and module count
- 内容过长时显示错误状态，绝不给出空白或损坏的码 / Clear error state for over-long content — never a blank or broken code
- 整数倍模块绘制，预览和下载都锐利 / Crisp integer-scaled rendering for preview and download
- 颜色对比度过低时警告 / Low-contrast colour warning
- 复制图片到剪贴板（浏览器支持时）/ Copy image to clipboard where supported
- 中英双语界面 / Bilingual EN / 中文 UI

## 技术 / Tech

纯静态站点（HTML / CSS / 原生 JS），无构建步骤，加载后可完全离线运行。

Plain static site (HTML / CSS / vanilla JS), no build step, fully offline after load.

## Credits

QR code generation uses the MIT-licensed **qrcode-generator** library by **Kazuhiko Arase** (http://www.d-project.com/), vendored at `lib/qrcode.js` with its original license header intact.

QR Code is a registered trademark of DENSO WAVE INCORPORATED.

## License

MIT © Ze (Mark) Song — the vendored library remains under its own MIT license (see above).
