#!/usr/bin/env python3
"""Select a chain-friendly idiom subset from chinese-xinhua (MIT) and emit data.js."""
import json, re, random, collections, pathlib

SRC = pathlib.Path(__file__).with_name("idiom.json")
OUT = pathlib.Path(__file__).parent.parent / "data.js"
CJK4 = re.compile(r"^[\u4e00-\u9fff]{4}$")

COMMON = """一心一意 意气风发 发扬光大 大显身手 手到擒来 来日方长 长治久安 安居乐业 乐在其中
中流砥柱 柱石之坚 一鸣惊人 人山人海 海阔天空 空前绝后 后来居上 上善若水 水到渠成
成千上万 万众一心 心想事成 心花怒放 放虎归山 山清水秀 秀外慧中 光明正大 大快人心
心旷神怡 怡然自得 得心应手 手忙脚乱 乱七八糟 糟糠之妻 妻离子散 散兵游勇 勇往直前
前程万里 里应外合 合情合理 理所当然 然荻读书 书香门第 第一百货 货真价实 实事求是
是非分明 明察秋毫 毫不犹豫 豫章故郡 一帆风顺 顺理成章 章句之徒 徒劳无功 功成名就
就事论事 事半功倍 倍道兼行 行云流水 水落石出 出人意料 料事如神 神通广大 大功告成
成竹在胸 胸有成竹 竹报平安 安然无恙 恙虫为灾 灾梨祸枣 一丝不苟 苟且偷生 生龙活虎
虎头蛇尾 尾大不掉 掉以轻心 心直口快 快人快语 语重心长 长篇大论 论功行赏 赏心悦目
目不转睛 睛目传情 情投意合 意在言外 外强中干 干干净净 净几明窗 窗明几净 一举两得
得寸进尺 尺有所短 短兵相接 接二连三 三心二意 意气用事 事与愿违 违天逆理 理直气壮
壮志凌云 云开见日 日新月异 异口同声 声名鹊起 起死回生 生机勃勃 勃然大怒 怒发冲冠
冠冕堂皇 皇天后土 土生土长 长驱直入 入木三分 分秒必争 争先恐后 后顾之忧 忧心忡忡
忡忡不安 安安稳稳 稳操胜券 券中有券 一诺千金 金玉良言 言而有信 信誓旦旦 旦旦而伐
一见钟情 情同手足 足智多谋 谋事在人 人定胜天 天经地义 义无反顾 顾全大局 局促不安
安分守己 己饥己溺 溺爱不明 明明白白 白手起家 家喻户晓 晓以大义 义正词严 严阵以待
待人接物 物是人非 非同小可 可歌可泣 泣不成声 声泪俱下 下笔千言 言简意赅 赅通经传""".split()

def trim_meaning(s, limit=42):
    s = s.strip()
    if len(s) <= limit:
        return s
    cut = s[:limit]
    for sep in "。；，、":
        i = cut.rfind(sep)
        if i >= 12:
            return cut[:i + (1 if sep in "。；" else 0)]
    return cut

def main():
    raw = json.loads(SRC.read_text(encoding="utf-8"))
    pool = {}
    for e in raw:
        w = e.get("word", "").strip()
        p = e.get("pinyin", "").strip()
        m = (e.get("explanation") or "").strip()
        if CJK4.match(w) and p and m:
            pool[w] = {"w": w, "p": p, "m": trim_meaning(m)}
    print("4-char usable idioms:", len(pool))

    by_first = collections.defaultdict(list)
    for w in pool:
        by_first[w[0]].append(w)

    selected = {}
    for w in COMMON:
        if w in pool:
            selected[w] = pool[w]
    print("seeded common:", len(selected))

    random.seed(42)
    words = list(pool)
    # popularity of a char as a chain joint across the whole pool
    first_freq = collections.Counter(w[0] for w in words)
    last_freq = collections.Counter(w[3] for w in words)

    def score(w):
        s = 0
        # adjacency to already-selected set
        for sw in selected:
            if sw[3] == w[0]:
                s += 3
            if sw[0] == w[3]:
                s += 3
        # general chain potential in the full pool
        s += min(first_freq[w[3]], 30) * 0.15   # many idioms can follow this one
        s += min(last_freq[w[0]], 30) * 0.15    # many idioms can precede this one
        s += random.random() * 0.5
        return s

    target = 420
    while len(selected) < target:
        cands = [w for w in words if w not in selected]
        cands.sort(key=score, reverse=True)
        progressed = False
        for w in cands[:40]:
            selected[w] = pool[w]
            progressed = True
            if len(selected) >= target:
                break
        if not progressed:
            break
    print("selected:", len(selected))

    sel = list(selected.values())
    out_edges = sum(1 for e in sel if any(o["w"][0] == e["w"][3] and o["w"] != e["w"] for o in sel))
    print(f"idioms with >=1 onward chain in set: {out_edges}/{len(sel)} = {out_edges/len(sel):.0%}")

    header = ("// Idiom data for Idiom Solitaire. Source: chinese-xinhua open dataset\n"
              "// (https://github.com/pwxcoo/chinese-xinhua, data/idiom.json), MIT License,\n"
              "// Copyright (c) 2018 PWXCOO. Subset selected for chain play: 4-character\n"
              "// idioms with pinyin + definition, meanings trimmed.\n")
    body = json.dumps(sel, ensure_ascii=False, separators=(",", ":"))
    OUT.write_text(header + "const IDIOMS = " + body + ";\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")

if __name__ == "__main__":
    main()
