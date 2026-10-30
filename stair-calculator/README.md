# 楼梯计算 · Stair Calculator

输入层高、目标步高和步宽，算出楼梯的步数、实际步高、踏面数、总进深、楼梯梁斜长和角度，附三项舒适度检查和按比例的侧面示意图。全用毫米，另附英寸参考值。给木工、橱柜和装修现场用的小工具 — 改任意数字，结果立刻更新。

A stair calculator for carpenters and millwork: enter total rise, target riser height and tread going (all in mm) and get riser count, actual riser height, tread count, total run, stringer length and stair angle — with comfort-rule checks (riser 150–180 mm, going ≥ 250 mm, 2×riser + going = 600–650 mm) and a to-scale SVG side-view diagram. Inch equivalents shown as secondary values.

在线使用 / Live: https://marksong0917.github.io/stair-calculator/

本地运行 / Run locally: `python3 -m http.server` in this folder, then open http://localhost:8000 — or just open `index.html`. No build step, no dependencies.

计算口径 / Math: risers = ceil(total rise ÷ target riser); actual riser = total rise ÷ risers; treads = risers − 1; total run = treads × going; stringer = √(rise² + run²); angle = atan(rise ÷ run).

MIT © Ze (Mark) Song
