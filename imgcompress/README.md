# 图片压缩 · Image Compressor

免费在线图片压缩工具。图片不上传，只在你的浏览器里处理。

A free image compressor that runs entirely in your browser. Your images never leave your device.

**Live:** https://marksong0917.github.io/imgcompress/

## 功能 / Features

- 拖放或点击选择，多张图片一次处理（JPG、PNG、WebP、GIF）
  Drag & drop or click to pick — many images at once (JPG, PNG, WebP, GIF)
- 质量滑杆（10–100）、最大尺寸限制（2048 / 1600 / 1280 / 800 px，只缩小不放大）
  Quality slider (10–100) and a max-dimension cap (2048 / 1600 / 1280 / 800 px, shrink only)
- 输出格式：保持原格式 / JPEG / WebP / PNG
  Output format: keep original / JPEG / WebP / PNG
- 每张图显示原大小 → 新大小、尺寸变化和节省百分比，可单独下载或全部下载
  Per-image before/after sizes, dimensions and savings %, single or download-all
- GIF 输入会转成静态首帧；输出文件名自动加 `-min` 后缀
  GIF input becomes a static first frame; output files get a `-min` suffix
- 中英文界面切换，选择会记住
  Bilingual EN / 中文 UI, remembered across visits

## 隐私 / Privacy

纯静态页面，没有服务器、没有上传、没有统计。所有压缩都用浏览器自带的
Canvas 在本地完成，关掉页面什么都不留。

A static page: no server, no uploads, no analytics. All compression happens
locally with the browser's Canvas API. Close the tab and nothing remains.

## 技术 / Tech

原生 HTML / CSS / JavaScript，无框架、无构建步骤。解码优先用
`createImageBitmap`（带 EXIF 方向校正），失败时回退到 `Image` 元素。

Vanilla HTML / CSS / JavaScript — no frameworks, no build step. Decoding
prefers `createImageBitmap` with EXIF orientation, falling back to an
`Image` element.

## 本地运行 / Run locally

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000
```

## License

MIT © Ze (Mark) Song
