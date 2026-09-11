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
const VERSIONE = '4.14';
const CREDENZA = 'mcparrot-' + VERSIONE;
// ⚠️ RETE DI SICUREZZA (10/09). Il numero qui sopra lo scrive la procedura di pubblicazione, che
// sostituisce il segnaposto. Se per un errore venisse pubblicato il MODELLO com'è, il nome della
// credenza sarebbe identico a ogni versione: le copie vecchie non verrebbero mai buttate e l'app
// resterebbe congelata su una versione passata, per sempre, senza nessun errore visibile. È il
// guasto peggiore che questo file possa causare, quindi si riconosce da solo: se il segnaposto è
// ancora lì, il gestore non tiene NIENTE da parte e lascia passare tutto alla rete. Si perde la
// modalità aereo — che è grave — ma non si congela l'app, che è peggio, e la prossima pubblicazione
// rimette tutto a posto invece di dover chiedere a ognuno di cancellare i dati del sito.
const TARATO = VERSIONE.indexOf('SW_VERSION') < 0;
const FILE = ['./', './index.html', './bundle.js', './analysis-worker.js', './manifest.webmanifest', './parrot.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  // si prende tutto subito, e non si aspetta che le schede aperte vengano chiuse
  // Se il segnaposto non e' stato sostituito non si tiene niente da parte: vedi TARATO.
  e.waitUntil((TARATO ? caches.open(CREDENZA).then((c) => c.addAll(FILE)) : Promise.resolve()).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  // si buttano le credenze delle versioni precedenti, poi si prende il controllo delle schede aperte
  e.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(nomi.filter((n) => n !== CREDENZA).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

// ⭐⭐ PRIMA LA RETE, POI LA CREDENZA — corretto il 10/09/2026, e il difetto l'ha trovato l'utente:
// «si è aperto il browser con le 3.96» il giorno in cui era pubblicata la 4.00.
// La prima stesura serviva SEMPRE la copia salvata quando c'era. Ma un gestore offline si aggiorna
// così: la pagina si apre con i file VECCHI, e solo MENTRE si apre il browser scarica il gestore
// nuovo. Il risultato è che a ogni pubblicazione la prima apertura mostra la versione PRECEDENTE, e
// quella giusta arriva solo alla seconda. Per chi prova le versioni è una trappola perfetta: si
// guarda il numero in alto a destra e si conclude che la pubblicazione non è andata.
//
// Ora: si prova la RETE, con un tetto di attesa; se risponde si serve quella e si aggiorna la copia
// salvata. Se la rete manca, è lenta o risponde male, si serve la copia salvata. Senza rete il
// tentativo fallisce subito e la credenza risponde all'istante: la modalità aereo resta intatta —
// è la promessa dell'app e non si tocca. L'attesa serve solo a non restare appesi a una rete che
// c'è ma non va (l'aeroporto, il treno): dopo il tetto si serve comunque ciò che si ha.
const ATTESA_RETE_MS = 3000;

const dallaRete = (req) =>
  new Promise((risolvi, rifiuta) => {
    const orologio = setTimeout(() => rifiuta(new Error('rete lenta')), ATTESA_RETE_MS);
    fetch(req).then(
      (r) => { clearTimeout(orologio); risolvi(r); },
      (err) => { clearTimeout(orologio); rifiuta(err); },
    );
  });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // roba di altri: non ci si mette in mezzo
  if (!TARATO) return; // modello non sostituito: ci si toglie di mezzo del tutto
  e.respondWith(
    dallaRete(req)
      .then((risposta) => {
        // ⚠️ Una risposta SBAGLIATA non deve scalzare una copia buona: un 500 o un 404 di passaggio
        // (la rete del treno, un intoppo del servizio) manderebbe altrimenti l'app in errore pur
        // avendo tutto su disco. Si accetta solo ciò che è nostro e andato a buon fine.
        if (!risposta || !risposta.ok || risposta.type !== 'basic') throw new Error('risposta non buona');
        const copia = risposta.clone();
        caches.open(CREDENZA).then((c) => c.put(req, copia));
        return risposta;
      })
      .catch(() =>
        caches.match(req).then((salvata) => salvata
          || caches.match('./index.html') // senza rete e senza copia: si torna alla pagina dell'app
          || fetch(req)),                  // ultima spiaggia: si lascia decidere al browser
      ),
  );
});
