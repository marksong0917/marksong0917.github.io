#!/usr/bin/env python3
"""Generate one pronunciation clip per character for 汉字笔顺.

LOCAL neural TTS (Piper) — no network, no API keys, identical voice on every
device because the clips ship with the site:
  Chinese -> zh_CN-huayan-medium   (audio/<char>.mp3)

Reads the character list out of ../data.js (via node, since the data is a JS
literal) and synthesizes only the clips that are missing.

Voice model lookup order:
  1. tools/voices/zh_CN-huayan-medium.onnx (this project)
  2. ~/workspace/typebook-zh/tools/voices/ (shared with 打字读经典)

Requires: node, ffmpeg, piper-tts (pip install piper-tts).
"""
import json, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
MODEL_CANDIDATES = [
    Path(__file__).resolve().parent / "voices" / "zh_CN-huayan-medium.onnx",
    Path.home() / "workspace" / "typebook-zh" / "tools" / "voices" / "zh_CN-huayan-medium.onnx",
]

def extract_chars():
    js = subprocess.run(
        ["node", "-e",
         "const fs=require('fs');const window={};"
         "eval(fs.readFileSync(process.argv[1],'utf8'));"
         "console.log(JSON.stringify(Object.keys(window.CHAR_INFO)))",
         str(ROOT / "data.js")],
        capture_output=True, text=True, check=True)
    return json.loads(js.stdout)

def synth_mp3(voice, text, out):
    chunks = list(voice.synthesize(text))
    if not chunks:
        raise RuntimeError(f"no audio for {text!r}")
    tmp = out.with_suffix(".wav")
    with wave.open(str(tmp), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(chunks[0].sample_rate)
        for c in chunks:
            wf.writeframes(c.audio_int16_bytes)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp),
                    "-af", "silenceremove=start_periods=1:start_silence=0.03:start_threshold=-50dB",
                    "-codec:a", "libmp3lame", "-b:a", "32k", "-ac", "1", str(out)],
                   check=True)
    tmp.unlink(missing_ok=True)

def main():
    from piper.voice import PiperVoice
    model = next((m for m in MODEL_CANDIDATES if m.exists()), None)
    if model is None:
        print("missing zh voice model (looked in tools/voices and typebook-zh)", file=sys.stderr)
        return 1
    chars = extract_chars()
    AUDIO.mkdir(exist_ok=True)
    todo = [c for c in chars
            if not ((AUDIO / f"{c}.mp3").exists() and (AUDIO / f"{c}.mp3").stat().st_size >= 1000)]
    if todo:
        voice = PiperVoice.load(str(model))
        for ch in todo:
            synth_mp3(voice, ch, AUDIO / f"{ch}.mp3")
        print(f"generated {len(todo)} clips ({len(chars)} characters total)")
    else:
        print(f"all {len(chars)} clips present")
    clips = list(AUDIO.glob("*.mp3"))
    total = sum(f.stat().st_size for f in clips)
    print(f"audio total: {total/1024:.0f} KB across {len(clips)} clips")
    return 0

if __name__ == "__main__":
    sys.exit(main())
