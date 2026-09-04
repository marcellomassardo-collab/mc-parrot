# MC Parrot 🦜

**Turn the sounds you record into a song — entirely on your own device.**

MC Parrot records ambient sounds (and your voice) from the microphone and recomposes them
into a short musical track, using **only those sounds** as raw material — basically chaos
with a tiny bit of music theory. Pick a genre, scale and tempo, generate, listen back,
and export an audio file.

## 🔒 Privacy guaranteed — please read

- **It is NOT artificial intelligence.** The engine is pure **algorithmic DSP** (frequency
  analysis, sound classification by timbre, recomposition following music theory). No neural
  network, no model, no "AI cloud".
- **Every sound in the song is yours.** The track is built **only** from the sounds in your own
  recording — nothing is added from outside, no sample pack, no library, nothing downloaded.
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
   a bit of voice, an instrument…).
   Already recorded something elsewhere? Press **📂 Open audio files** instead and bring it in —
   useful if you captured it with a proper microphone or another device. You can pick **several
   files at once**: record your snare, your piano and your voice separately and they become one
   song. Mono and stereo files can be mixed freely, and the song always comes out in stereo.
   Up to 7 minutes in total. They are decoded on your own device like any recording, and they
   never leave it either.
3. Choose **genre**, **scale** and **tempo**.
4. Press **Generate music**, listen back, and optionally **Export** the WAV file.

## How it works (in short)

The "brain" (`composer.ts` + `classify.ts`) analyzes the recording, classifies each fragment by
role (kick, snare, hi-hat, pitched instrument, voice — discarding background noise), and builds a
structured song (with a chorus, harmony and mastering) for the chosen genre. It is the **exact
same engine** as the Android version — only the "shell" differs (here it uses the browser's audio
APIs).

## Coming soon

- 📱 **Android** — native app, same engine
- 🍎 **iOS** — native app, same engine

## Next step

- 🎛️ **FL Studio plugin** — bring the engine into your music production software, so the sounds you
  record become material you can arrange and produce like any other instrument.
- 🎬 **MC Parrot Video** — the same idea, for video: record with the camera or bring in clips already
  on your phone, and the engine builds the music out of the sound that is already in them.

## Licence — in plain words

| | |
|---|---|
| 🎵 **The music you make is yours** | Every track you generate belongs to you. Publish it, release it, **sell it** — just maybe tag us in the credits and [drop a donation](https://www.paypal.com/paypalme/marcellomassardo). Nice to have, never required. |
| 🆓 **The app is free** | For anyone, forever. No account, no ads, no tracking. |
| 📴 **Everything runs on your phone** | Recording, analysis and generation all happen on your device, offline. Your audio never leaves it. |
| 🔒 **Closed source** | MC Parrot is free to use, but the code is not open source and not Creative Commons: you may not reuse, modify or redistribute it. Want a commercial licence? Ask. |
| 💬 **Feedback welcome** | Bug reports and ideas are very welcome. |

Formally: proprietary licence, all rights reserved — see [LICENSE](LICENSE.md).
Copyright © 2026 Marcello Massardo.

---

*Made for the fun of playing with sounds. 🎶*
