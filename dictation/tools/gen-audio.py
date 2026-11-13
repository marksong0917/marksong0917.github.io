#!/usr/bin/env python3
"""Generate per-item voice clips for 听写助手 · Dictation.

LOCAL neural TTS (Piper) — no network, no API keys, identical voice on every
device because the clips ship with the site. One full-sentence clip per item:
  Chinese sets -> zh_CN-huayan-medium   (audio/<set-id>/<item-id>.mp3)
  English sets -> en_US-lessac-medium   (audio/<set-id>/<item-id>.mp3)

Reads SETS out of ../script.js (via node, since the data is a JS literal) and
synthesizes only the clips that are missing or suspiciously small (< 1 KB).

Voice models are reused from the typebook-zh project (they are ~61 MB each
and are NOT copied into this repo):
  ~/workspace/typebook-zh/tools/voices/zh_CN-huayan-medium.onnx (+ .json)
  ~/workspace/typebook-zh/tools/voices/en_US-lessac-medium.onnx (+ .json)
Download from https://huggingface.co/rhasspy/piper-voices if missing.

Requires: node, ffmpeg, piper-tts (pip install piper-tts).
Run:  python tools/gen-audio.py
"""
import json, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
VOICES = Path.home() / "workspace" / "typebook-zh" / "tools" / "voices"
MODELS = {"zh": VOICES / "zh_CN-huayan-medium.onnx",
          "en": VOICES / "en_US-lessac-medium.onnx"}

def extract_sets():
    js = subprocess.run(
        ["node", "-e",
         "const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');"
         "const a=s.indexOf('const SETS =');const b=s.indexOf('];',a);"
         "const SETS=eval(s.slice(a+'const SETS ='.length,b+1));"
         "console.log(JSON.stringify(SETS))",
         str(ROOT / "script.js")],
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
    sets = extract_sets()
    voices = {}
    made = 0
    for s in sets:
        lang = s["lang"]
        model = MODELS[lang]
        if not model.exists():
            print(f"missing voice model: {model}", file=sys.stderr)
            return 1
        d = AUDIO / s["id"]
        d.mkdir(parents=True, exist_ok=True)
        todo = [it for it in s["items"]
                if not ((d / f"{it['id']}.mp3").exists()
                        and (d / f"{it['id']}.mp3").stat().st_size >= 1000)]
        if not todo:
            print(f"{s['id']}: {len(s['items'])} items, all clips present")
            continue
        if lang not in voices:
            voices[lang] = PiperVoice.load(str(model))
        for it in todo:
            synth_mp3(voices[lang], it["text"], d / f"{it['id']}.mp3")
            made += 1
        print(f"{s['id']}: generated {len(todo)} clips ({len(s['items'])} items total)", flush=True)
    clips = list(AUDIO.rglob("*.mp3"))
    small = [f for f in clips if f.stat().st_size < 1000]
    total = sum(f.stat().st_size for f in clips)
    print(f"audio total: {total/1024:.0f} KB across {len(clips)} clips ({made} new)")
    if small:
        print(f"WARNING: {len(small)} clips under 1000 bytes: {[str(f) for f in small]}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
