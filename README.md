# MC Parrot 🦜

**Trasforma i suoni che registri in una canzone — tutto sul tuo dispositivo.**

MC Parrot registra i suoni dell'ambiente (e la tua voce) dal microfono e li ricompone
in una breve traccia musicale, usando **solo quei suoni** come materia prima (musica
concreta generata automaticamente). Scegli il genere, la scala e il tempo, genera, riascolta
ed esporta un file audio.

## 🔒 Privacy garantita — leggi qui

- **Non è intelligenza artificiale.** Il motore è puro **DSP algoritmico** (analisi delle
  frequenze, riconoscimento dei suoni per timbro, ricomposizione secondo la teoria musicale).
  Nessuna rete neurale, nessun modello, nessun "cloud AI".
- **Nessun file viene inviato a nessuno.** L'audio che registri **non lascia mai il tuo
  dispositivo**: viene elaborato interamente **nel tuo browser**, in locale.
- **Nessun server esterno.** L'app è fatta di soli file statici (una pagina web): non c'è
  nessun back-end, nessun caricamento, nessun tracciamento dell'audio.
- **Solo il microfono.** L'unico permesso richiesto è il microfono, e serve soltanto a
  registrare i suoni che poi diventano musica. Niente telecamera, niente altro.

La tua privacy è garantita **per costruzione**: siccome tutto avviene sul tuo dispositivo,
non c'è proprio nessun posto dove i tuoi suoni potrebbero andare.

## Come si usa

1. Apri il link nel browser (telefono o computer).
2. Dai il permesso al **microfono** e premi **Registra**: cattura qualche suono dell'ambiente
   (oggetti, battiti, un po' di voce, uno strumento…).
3. Scegli **genere**, **scala** e **tempo**.
4. Premi **Genera musica**, riascolta, ed eventualmente **Esporta** il file WAV.

## Come funziona (in breve)

Il "cervello" (`composer.ts` + `classify.ts`) analizza la registrazione, classifica ogni
frammento per ruolo (cassa, rullante, hi-hat, strumento intonato, voce, e scarta i rumori
di fondo), e costruisce una canzone strutturata (con ritornello, armonia e mastering) per il
genere scelto. È lo **stesso identico motore** della versione Android — cambia solo il "guscio"
(qui usa le API audio del browser).

---

*Progetto personale, senza scopo di lucro. Fatto per divertirsi con i suoni. 🎶*
