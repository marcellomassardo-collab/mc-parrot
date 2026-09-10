// GESTORE OFFLINE (10/09/2026) — serve a UNA cosa sola: far aprire l'app anche senza rete.
// ---------------------------------------------------------------------------
// Perché esiste. Nell'app Android i file stanno dentro il pacchetto, quindi funziona in modalità
// aereo per costruzione. Sul web no: la pagina si scarica ogni volta, e un'app installata dal
// negozio di Windows senza questo file, in aereo, non si aprirebbe nemmeno. È il pezzo che manca
// per poter dire — e dimostrare in cinque secondi — che l'app funziona senza rete.
//
// Come è fatto, e perché così.
// Il nome della credenza porta dentro la VERSIONE: a ogni pubblicazione cambia, quindi si crea una
// credenza nuova e quelle vecchie vengono buttate. Senza questo, chi ha già visitato il sito
// resterebbe su una versione vecchia per sempre — è il modo classico in cui un gestore offline
// fatto male fa più danni che utile.
// I quattro file dell'app si servono dalla credenza (sono quelli che devono esserci in aereo);
// tutto il resto passa dalla rete come se questo file non ci fosse.
const VERSIONE = 'beta-3-94';
const CREDENZA = 'mcparrot-' + VERSIONE;
const FILE = ['./', './index.html', './bundle.js', './analysis-worker.js', './manifest.webmanifest', './parrot.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  // si prende tutto subito, e non si aspetta che le schede aperte vengano chiuse
  e.waitUntil(caches.open(CREDENZA).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  // si buttano le credenze delle versioni precedenti, poi si prende il controllo delle schede aperte
  e.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(nomi.filter((n) => n !== CREDENZA).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // roba di altri: non ci si mette in mezzo
  e.respondWith(
    caches.match(req).then((salvata) => {
      if (salvata) return salvata;
      return fetch(req)
        .then((risposta) => {
          // si tiene da parte solo ciò che è nostro e che è andato a buon fine
          if (!risposta || risposta.status !== 200 || risposta.type !== 'basic') return risposta;
          const copia = risposta.clone();
          caches.open(CREDENZA).then((c) => c.put(req, copia));
          return risposta;
        })
        .catch(() => caches.match('./index.html')); // senza rete: si torna alla pagina dell'app
    }),
  );
});
