#!/usr/bin/env python3
"""Fetch stroke data for the curated 96 characters from hanzi-writer-data
(MIT — derived from the Make Me a Hanzi project) and build ../data.js.

Source per character: https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/<char>.json
Raw JSONs are cached in tools/cache/ so re-runs are offline.

data.js defines:
  window.STROKE_SETS = [{id, zh, en, chars:[...]}]
  window.CHAR_INFO   = {char: {pinyin, zh, en}}
  window.STROKE_DATA = {char: {strokes:[path,...], medians:[[[x,y],...],...]}}
"""
import json, sys, urllib.request, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(__file__).resolve().parent / "cache"
CACHE.mkdir(exist_ok=True)
CDN = "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/"

# char, pinyin, Chinese meaning, English gloss
SETS = [
    {"id": "numbers", "zh": "数字与量", "en": "Numbers & Counting", "chars": [
        ("一", "yī", "一；第一个", "one"),
        ("二", "èr", "二；第二个", "two"),
        ("三", "sān", "三；第三个", "three"),
        ("四", "sì", "四；第四个", "four"),
        ("五", "wǔ", "五；第五个", "five"),
        ("六", "liù", "六；第六个", "six"),
        ("七", "qī", "七；第七个", "seven"),
        ("八", "bā", "八；第八个", "eight"),
        ("九", "jiǔ", "九；第九个", "nine"),
        ("十", "shí", "十；第十个", "ten"),
        ("百", "bǎi", "一百；许多", "hundred"),
        ("千", "qiān", "一千；许多", "thousand"),
        ("万", "wàn", "一万；很多", "ten thousand"),
        ("半", "bàn", "一半；半个", "half"),
        ("里", "lǐ", "里面；公里", "inside; kilometre"),
        ("个", "gè", "一个；量词", "general measure word"),
        ("多", "duō", "很多；不少", "many; much"),
        ("少", "shǎo", "很少；不多", "few; little"),
        ("只", "zhī", "一只；量词", "measure word (animals, one of a pair)"),
        ("双", "shuāng", "一双；一对", "a pair"),
        ("两", "liǎng", "两个；二", "two (of something)"),
        ("条", "tiáo", "一条；量词", "measure word (long, thin things)"),
        ("件", "jiàn", "一件；量词", "measure word (items, clothes)"),
        ("岁", "suì", "几岁；年龄", "years of age"),
    ]},
    {"id": "nature", "zh": "自然", "en": "Nature", "chars": [
        ("日", "rì", "太阳；日子", "sun; day"),
        ("月", "yuè", "月亮；月份", "moon; month"),
        ("山", "shān", "大山；山上", "mountain"),
        ("川", "chuān", "河流；山川", "river"),
        ("水", "shuǐ", "喝水；河水", "water"),
        ("火", "huǒ", "火焰；着火", "fire"),
        ("木", "mù", "木头；树木", "wood; tree"),
        ("土", "tǔ", "土地；泥土", "earth; soil"),
        ("天", "tiān", "天空；一天", "sky; day"),
        ("气", "qì", "空气；天气", "air; breath"),
        ("风", "fēng", "刮风；风力", "wind"),
        ("雨", "yǔ", "下雨；雨水", "rain"),
        ("电", "diàn", "电灯；用电", "electricity"),
        ("云", "yún", "白云；云彩", "cloud"),
        ("石", "shí", "石头；石子", "stone"),
        ("田", "tián", "田地；种田", "field"),
        ("星", "xīng", "星星；星空", "star"),
        ("雪", "xuě", "下雪；雪花", "snow"),
        ("花", "huā", "开花；花朵", "flower"),
        ("草", "cǎo", "小草；草地", "grass"),
        ("海", "hǎi", "大海；海边", "sea"),
        ("河", "hé", "小河；河水", "river"),
        ("光", "guāng", "阳光；亮光", "light"),
        ("春", "chūn", "春天；春季", "spring"),
    ]},
    {"id": "body", "zh": "人与身体", "en": "People & Body", "chars": [
        ("人", "rén", "人们；一个人", "person; people"),
        ("口", "kǒu", "嘴巴；张口", "mouth"),
        ("手", "shǒu", "双手；洗手", "hand"),
        ("目", "mù", "眼睛（书面语）", "eye (formal)"),
        ("耳", "ěr", "耳朵；听见", "ear"),
        ("心", "xīn", "心里；开心", "heart"),
        ("大", "dà", "大小；很大", "big"),
        ("小", "xiǎo", "大小；很小", "small"),
        ("女", "nǚ", "女人；女生", "woman; female"),
        ("子", "zǐ", "孩子；儿子", "child"),
        ("男", "nán", "男人；男生", "man; male"),
        ("父", "fù", "父亲；爸爸", "father"),
        ("母", "mǔ", "母亲；妈妈", "mother"),
        ("王", "wáng", "国王；大王", "king"),
        ("头", "tóu", "头部；头发", "head"),
        ("发", "fà", "头发；长发", "hair"),
        ("身", "shēn", "身体；身上", "body"),
        ("脚", "jiǎo", "双脚；脚步", "foot"),
        ("眼", "yǎn", "眼睛；眼泪", "eye"),
        ("鼻", "bí", "鼻子；闻味", "nose"),
        ("牙", "yá", "牙齿；刷牙", "tooth"),
        ("舌", "shé", "舌头；味觉", "tongue"),
        ("友", "yǒu", "朋友；友好", "friend"),
        ("力", "lì", "力气；用力", "strength; power"),
    ]},
    {"id": "daily", "zh": "日常", "en": "Every Day", "chars": [
        ("门", "mén", "大门；开门", "door; gate"),
        ("开", "kāi", "开门；打开", "to open"),
        ("关", "guān", "关门；关上", "to close"),
        ("上", "shàng", "上面；上去", "up; on"),
        ("下", "xià", "下面；下去", "down; under"),
        ("左", "zuǒ", "左边；左手", "left"),
        ("右", "yòu", "右边；右手", "right"),
        ("中", "zhōng", "中间；中心", "middle; centre"),
        ("书", "shū", "看书；书本", "book"),
        ("本", "běn", "书本；本子", "book; notebook"),
        ("纸", "zhǐ", "白纸；一张纸", "paper"),
        ("笔", "bǐ", "铅笔；毛笔", "pen; pencil; brush"),
        ("学", "xué", "学习；学问", "to learn; to study"),
        ("校", "xiào", "学校；校园", "school"),
        ("家", "jiā", "回家；家人", "home; family"),
        ("车", "chē", "汽车；开车", "car; vehicle"),
        ("马", "mǎ", "一匹马；马上", "horse"),
        ("鱼", "yú", "一条鱼；吃鱼", "fish"),
        ("鸟", "niǎo", "小鸟；飞鸟", "bird"),
        ("生", "shēng", "生活；生长", "life; to grow"),
        ("读", "dú", "读书；朗读", "to read"),
        ("写", "xiě", "写字；写信", "to write"),
        ("字", "zì", "汉字；写字", "character; word"),
        ("文", "wén", "文字；语文", "language; script"),
    ]},
]

def fetch(ch):
    f = CACHE / f"{ch}.json"
    if f.exists():
        return json.loads(f.read_text(encoding="utf-8"))
    url = CDN + urllib.parse.quote(ch) + ".json"
    req = urllib.request.Request(url, headers={"User-Agent": "stroke-order-data-fetch"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    f.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data

def main():
    sets_out, info, stroke_data, missing = [], {}, {}, []
    seen = set()
    for s in SETS:
        chars = []
        for ch, py, zh, en in s["chars"]:
            if ch in seen:
                print(f"DUPLICATE in sets: {ch}", file=sys.stderr); return 1
            seen.add(ch)
            try:
                d = fetch(ch)
            except Exception as e:
                missing.append((ch, str(e))); continue
            if not d.get("strokes"):
                missing.append((ch, "no strokes")); continue
            chars.append(ch)
            info[ch] = {"pinyin": py, "zh": zh, "en": en}
            stroke_data[ch] = {"strokes": d["strokes"], "medians": d["medians"]}
        sets_out.append({"id": s["id"], "zh": s["zh"], "en": s["en"], "chars": chars})
    if missing:
        print("MISSING from dataset:", missing, file=sys.stderr); return 1
    total = sum(len(s["chars"]) for s in sets_out)
    js = ("/* Stroke data: hanzi-writer-data (MIT), derived from Make Me a Hanzi.\n"
          "   Generated by tools/fetch-data.py — do not edit by hand. */\n"
          "window.STROKE_SETS = " + json.dumps(sets_out, ensure_ascii=False) + ";\n"
          "window.CHAR_INFO = " + json.dumps(info, ensure_ascii=False) + ";\n"
          "window.STROKE_DATA = " + json.dumps(stroke_data, ensure_ascii=False) + ";\n")
    out = ROOT / "data.js"
    out.write_text(js, encoding="utf-8")
    print(f"wrote {out} — {total} characters, {out.stat().st_size/1024:.0f} KB")
    return 0

if __name__ == "__main__":
    sys.exit(main())
