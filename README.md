# MC Parrot 🦜

**Turn the sounds you record into a song — entirely on your own device.**

MC Parrot records ambient sounds (and your voice) from the microphone and recomposes them
into a short musical track, using **only those sounds** as raw material (automatic musique
concrète). Pick a genre, scale and tempo, generate, listen back, and export an audio file.

## 🔒 Privacy guaranteed — please read

- **It is NOT artificial intelligence.** The engine is pure **algorithmic DSP** (frequency
  analysis, sound classification by timbre, recomposition following music theory). No neural
  network, no model, no "AI cloud".
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
3. Choose **genre**, **scale** and **tempo**.
4. Press **Generate music**, listen back, and optionally **Export** the WAV file.

## How it works (in short)

The "brain" (`composer.ts` + `classify.ts`) analyzes the recording, classifies each fragment by
role (kick, snare, hi-hat, pitched instrument, voice — discarding background noise), and builds a
structured song (with a chorus, harmony and mastering) for the chosen genre. It is the **exact
same engine** as the Android version — only the "shell" differs (here it uses the browser's audio
APIs).

---

*Personal, non-commercial project. Made for the fun of playing with sounds. 🎶*
