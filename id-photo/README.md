# 证件照生成器 · ID Photo Maker

免费在线证件照制作工具。选尺寸、拖裁剪框、下载单张或六寸排版，全程在浏览器本地完成，照片不上传。

A free ID photo maker that runs entirely in your browser. Pick a size, drag the crop box, download a single photo or a 6-inch print sheet. Your photo never leaves your device.

**Live:** https://marksong0917.github.io/id-photo/

## 功能 / Features

- 六种常用尺寸（300 DPI 精确像素）：一寸 295×413、二寸 413×579、小一寸 260×378、护照 390×567、身份证 358×441、美国签证 600×600
  Six common sizes at exact 300 DPI print pixels: 1-inch, 2-inch, small 1-inch, passport, Chinese ID card, US visa
- 可拖动、可缩放的裁剪框，比例自动锁定，所选即所得的实时预览
  Draggable, resizable crop box with locked aspect ratio and a live exact-size preview
- 单张下载（PNG 或 JPEG），像素尺寸分毫不差
  Single-photo download (PNG or JPEG) at the exact pixel size
- 六寸排版：1795 × 1205 px（152 × 102 mm）相纸自动平铺多张，均匀留边，下载为 JPEG
  6-inch print sheet (1795 × 1205 px) tiled with as many copies as fit, even margins, JPEG download
- 点击或拖放上传，手机照片自动按 EXIF 方向摆正
  Click or drag & drop upload; phone photos are auto-rotated per EXIF orientation
- 中英文界面切换，选择会记住
  Bilingual EN / 中文 UI, remembered across visits

## 说明 / Note

本工具只负责裁剪和尺寸，**不更换照片背景**。需要蓝底、白底等背景色时，请在拍摄时就使用对应颜色的背景。

This tool crops and sizes only — it does **not** change photo backgrounds. If you need a blue or white background, shoot against that colour.

## 隐私 / Privacy

纯静态页面，没有服务器、没有上传、没有统计。所有处理都用浏览器自带的 Canvas 在本地完成，关掉页面什么都不留。

A static page: no server, no uploads, no analytics. Everything happens locally with the browser's Canvas API. Close the tab and nothing remains.

## 许可 / License

MIT © Ze (Mark) Song
