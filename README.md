# MC Parrot 🦜

**Turn the sounds you record into a finished song. On your own device, in seconds.**

> **Bring your sounds → get a song that is in time, in key, mixed and mastered → change whatever
> you want → export it, or finish it in another app.**

MC Parrot is a tool for making music fast. You bring the sounds — tap the table, hum a line,
whistle, sing a phrase, or drop in a folder of samples you already have — and the engine builds
a real song out of them: key, chord progression, rhythm, arrangement, **mix and master**. Pick a
genre, press generate, listen.

**No hours lost on levels, mixing and mastering.** That is a job in itself, and it is the part
that stops most people from ever finishing anything. Here the algorithms do it with you, every
time, for every genre — and they do it on **your** material, so nothing about the result is
generic.

Every sound in the song came out of your own recording, which makes it original by construction.
And it is not a dead end: you can edit the song right here, or take it into another app and
finish it your way.

## 🔒 Privacy guaranteed: please read

- **It is NOT artificial intelligence.** The engine is pure **algorithmic DSP** (frequency
  analysis, sound classification by timbre, recomposition following music theory). No neural
  network, no model, no "AI cloud".
- **Every sound in the song is yours.** The track is built **only** from the sounds in your own
  recording: nothing is added from outside, no sample pack, no library, nothing downloaded.
  If you hear a drum, it is something you recorded.
- **No file is ever sent to anyone.** The audio you record **never leaves your device**: it is
  processed entirely **in your browser**, locally.
- **No external server.** The app is just static files (a single web page): there is no
  back-end, no upload, no audio tracking whatsoever.
- **Microphone only.** The only permission requested is the microphone, and it is used solely to
  record the sounds that then become music. No camera, nothing else.

Your privacy is guaranteed **by design**: since everything happens on your device, there is
simply nowhere your sounds could go.

## How to use it

1. Open the link in your browser (phone or computer).
2. Allow the **microphone** and press **Record**: capture some ambient sounds (objects, taps,
   a bit of voice, an instrument…). Or press **📂 Open audio files** and bring in material you
   already have — see *bring your own material*, below. Up to 7 minutes in total (30 with Full
   song); whatever you open is decoded on your own device and never leaves it either.
3. Choose **genre**, **scale** and **tempo**.
4. Press **Generate music**, listen back, and optionally **Export** the WAV file.
5. Want a whole song instead of a minute? See **Full song** below.

## Bring your own material (this part is for producers)

If you already record properly — a real mic, an interface, a folder of one-shots, stems from a
session, a sample library you bought — open those files instead of the microphone, or alongside
it. Several at once, mono and stereo mixed freely.

MC Parrot decodes them on your device, works out what each fragment is (kick, snare, hat, a
pitched note, a voice, an effect), **tunes everything that has a pitch to the scale you picked**
and **lays it all on a grid that is in time**. Name a file `kick`, `vocals`, `stab` and it is
taken at its word; name it nothing and the engine decides by listening.

That is the part a producer cares about: what comes back is not a loop pack and not a random
collage — it is **your own material, already in time and in key**, arranged, mixed and mastered.
A starting point, not a novelty: keep working on it in the editor here, or take it into your DAW.

## What you can open

Measured, not guessed: every format below was tried through the app's own loading path.

| | |
|---|---|
| **Microphone (Android app)** | native recording, **unprocessed**: no noise suppression, no echo cancelling, no automatic gain — 48 kHz, 16 bit. The phone's clean-up would eat exactly the ambient detail this app is made of. |
| **Microphone (browser / Windows)** | same idea: AGC, noise suppression and echo cancelling switched off explicitly. |
| **Audio files** | WAV (8, 16, 24, 32-bit and float) · MP3 · M4A · AAC · OGG Vorbis · **Opus** · FLAC |
| **Voice notes** | the WhatsApp ones open directly: Opus-in-Ogg from Android, M4A from iPhone |
| **Video files** | MP4 · MOV · WEBM · MKV · 3GP — the picture is ignored, the **soundtrack** is taken. Pull the audio out of your old clips and make a song with it. |
| **Odd WAVs** | some sample libraries ship WAVs that are only a shell, with compressed Ogg Vorbis, FLAC or MP3 inside. Browsers refuse those. MC Parrot opens the shell and reads what is in it. |
| **Mixing them** | mono and stereo together, any sample rate, any bit depth, any loudness: everything is brought to the same footing on your device, and the song always comes out in stereo. |
| **Not supported** | AIFF and WMA — no browser decodes them. Convert to WAV first. |

Up to 7 minutes in total, 30 with Full song. Nothing is uploaded: files are decoded on your own
device like any recording.

## Free, and Full song

MC Parrot is **free**, and it stays free: record, generate, listen, export, share. That is the
whole app for most people, and nothing about it is crippled or time-limited.

**Full song** is a one-off in-app purchase for anyone who wants to actually work with it:

| | free | Full song |
|---|---|---|
| **Recording** | up to 7 minutes | up to **30 minutes** (record over several takes, or bring in a folder of samples) |
| **Song length** | 1 minute | **2:30 - 3:30**, with the real structure of the genre you picked (intro, verse, chorus, bridge, drops) |
| **Editor** | — | a **timeline of your song**: mute, solo, move clips in time, set volume, pan and density per layer, tweak the track EQ, swap the sample under a clip, and A/B your change against the previous version |
| **Metadata in the WAV** | — | the full **track sheet** written inside the file, so the song can be reopened as a **project in FL Studio** once the plugin lands (see below) |
| **Everything else** | the same engine, the same genres, the same privacy | the same |

Bought once, kept forever, and it keeps working with **no connection**: the unlock lives on your
device, not on a server. Airplane mode is not a limitation here, it is the normal case.

## What the editor actually does (and why that matters)

It does not chop up the audio. It changes the **parameters** and asks the engine to build the song
again. So whatever you touch, what you hear is exactly what the engine would have produced with
those settings: there is no second effects chain that could drift out of sync, and no "sounds
different once exported". It also means you can always go back.

## How it works (in short)

The "brain" (`composer.ts` + `classify.ts`) analyzes the recording, classifies each fragment by
role (kick, snare, hi-hat, pitched instrument, voice: discarding background noise), and builds a
structured song (with a chorus, harmony and mastering) for the chosen genre. It is the **exact
same engine** as the Android version: only the "shell" differs (here it uses the browser's audio
APIs).

## Coming soon

- 📱 **Android**: native app, same engine: [download the .apk](MC-Parrot.apk) (signed build; Android still asks you to allow installing from outside the Play Store)
- 🍎 **iOS**: native app, same engine

## Next step

- 🎛️ **FL Studio plugin**: bring the engine into your music production software, so the sounds you
  record become material you can arrange and produce like any other instrument.
  **Full song WAVs are already getting ready for it**: every one of them carries a track sheet
  inside the file (in iXML, a standard field that field recorders and editing software have used
  for years, so the file stays an ordinary WAV everywhere else). The sheet lists the source files,
  where each one was cut, and every clip with its layer, position, length and pitch — plus the
  settings of our own effects. When the plugin lands, a song you exported today can be reopened
  as a session: clips on separate tracks, named, with the effects already in place, instead of
  one flat stereo mix.
- 🎬 **MC Parrot Video**: the same idea, for video: record with the camera or bring in clips already
  on your phone, and the engine builds the music out of the sound that is already in them.

## Licence: in plain words

| | |
|---|---|
| 🎵 **The music you make is yours** | Every track you generate belongs to you. Publish it, release it, **sell it**: just maybe tag us in the credits and [drop a donation](https://www.paypal.com/paypalme/marcellomassardo). Nice to have, never required. |
| 🆓 **The app is free** | For anyone, forever. No account, no ads, no tracking. |
| 📴 **Everything runs on your phone** | Recording, analysis and generation all happen on your device, offline. Your audio never leaves it. |
| 🔒 **The code is mine, and it is closed** | MC Parrot is **not open source** and **not Creative Commons**. It is proprietary software, all rights reserved: you may run the official app, and that is all — no reuse of the code, no copying, no modifying, no redistributing, no building a product or a service on top of it. A website has to send your browser its compiled code in order to run at all: being able to download that code grants you none of those rights. Want a commercial licence? Ask, one can be granted. |
| 💬 **Feedback welcome** | Bug reports and ideas are very welcome. Code contributions are not accepted: one author, on purpose. |

Formally: proprietary licence, **all rights reserved** — see [LICENSE](LICENSE.md).
Copyright © 2026 Marcello Massardo. The app is mine; the music you make with it is yours.

---

*Bring your sounds. Let the algorithms work with you. 🎶*
