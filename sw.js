const VERSIONE = '5.18';
const CREDENZA = 'mcparrot-' + VERSIONE;

const TARATO = VERSIONE.indexOf('SW_VERSION') < 0;
const FILE = ['./', './index.html', './bundle.js', './analysis-worker.js', './lame.js', './manifest.webmanifest', './parrot.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {

  e.waitUntil((TARATO ? caches.open(CREDENZA).then((c) => c.addAll(FILE)) : Promise.resolve()).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {

  e.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(nomi.filter((n) => n !== CREDENZA).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

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
  if (url.origin !== self.location.origin) return;
  if (!TARATO) return;
  e.respondWith(
    dallaRete(req)
      .then((risposta) => {

        if (!risposta || !risposta.ok || risposta.type !== 'basic') throw new Error('risposta non buona');
        const copia = risposta.clone();
        caches.open(CREDENZA).then((c) => c.put(req, copia));
        return risposta;
      })
      .catch(() =>
        caches.match(req).then((salvata) => salvata
          || caches.match('./index.html')
          || fetch(req)),
      ),
  );
});
