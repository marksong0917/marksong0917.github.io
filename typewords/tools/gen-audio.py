#!/usr/bin/env python3
"""Generate one voice clip per word for 打字背单词 · TypeWords.

LOCAL neural TTS (Piper) — no network, no API keys, identical voice on
every device because the clips ship with the site:
  English -> en_US-lessac-medium  (audio/<sanitized-word>.mp3)

Reads LEVELS out of ../script.js (via node, since the data is a JS
literal) and synthesizes only the clips that are missing.

The voice model is shared with the typebook-zh project:
  ~/workspace/typebook-zh/tools/voices/en_US-lessac-medium.onnx (+ .onnx.json)
Override the voices directory with the TW_VOICES env var if needed.
Model download (if missing): https://huggingface.co/rhasspy/piper-voices
  en/en_US/lessac/medium/en_US-lessac-medium.onnx (+ .onnx.json)

Requires: node, ffmpeg, piper-tts (pip install piper-tts).
"""
import json, os, re, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
VOICES = Path(os.environ.get(
    "TW_VOICES",
    Path.home() / "workspace" / "typebook-zh" / "tools" / "voices"))
MODEL = VOICES / "en_US-lessac-medium.onnx"

def sanitize(w):
    return re.sub(r"[^a-z]", "", w.lower())

def extract_levels():
    js = subprocess.run(
        ["node", "-e",
         "const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');"
         "const a=s.indexOf('const LEVELS =');const b=s.indexOf('];',a);"
         "const LEVELS=eval(s.slice(a+'const LEVELS ='.length,b+1));"
         "console.log(JSON.stringify(LEVELS))",
         str(ROOT / "script.js")],
        capture_output=True, text=True, check=True)
    return json.loads(js.stdout)

def collect(levels):
    words = {}
    for lv in levels:
        for wd in lv["words"]:
            words[sanitize(wd["w"])] = wd["w"]
    return words

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
    if not MODEL.exists():
        print(f"missing voice model: {MODEL}", file=sys.stderr)
        return 1
    words = collect(extract_levels())
    AUDIO.mkdir(parents=True, exist_ok=True)
    todo = [(k, s) for k, s in sorted(words.items())
            if not ((AUDIO / f"{k}.mp3").exists() and (AUDIO / f"{k}.mp3").stat().st_size >= 1000)]
    made = 0
    if todo:
        from piper.voice import PiperVoice
        voice = PiperVoice.load(str(MODEL))
        for key, speak in todo:
            synth_mp3(voice, speak, AUDIO / f"{key}.mp3")
            made += 1
        print(f"generated {made} clips ({len(words)} unique words total)", flush=True)
    else:
        print(f"{len(words)} unique words, all clips present")
    small = [f.name for f in AUDIO.glob("*.mp3") if f.stat().st_size < 1000]
    if small:
        print(f"WARNING: {len(small)} clip(s) under 1000 bytes: {small[:5]}", file=sys.stderr)
        return 1
    clips = list(AUDIO.glob("*.mp3"))
    total = sum(f.stat().st_size for f in clips)
    print(f"audio total: {total/1024:.0f} KB across {len(clips)} clips — all >= 1000 bytes")
    return 0

if __name__ == "__main__":
    sys.exit(main())
