"""Pilotage de Chrome par le protocole DevTools, sans dependance.

Deux pieges documentes dans CLAUDE.md et evites ici :

  - pas de `--virtual-time-budget`. Il fige la boucle de trames :
    `requestAnimationFrame` ne se rappelle jamais et `IntersectionObserver`
    ne livre aucune entree. Tout ce qui reagit au defilement paraitrait
    casse alors que le code est bon.

  - la largeur ne vient pas de `--window-size`, qui ne descend pas sous
    ~400 px, mais de `Emulation.setDeviceMetricsOverride`, qui accepte
    n'importe quelle valeur.

Le protocole WebSocket est ecrit a la main : le projet n'accepte aucune
dependance nouvelle. La poignee de main de Chrome ne suit pas le calcul de
`Sec-WebSocket-Accept` du RFC 6455 — on se contente donc du 101.
"""
import base64, json, os, socket, subprocess, tempfile, time, urllib.request

CHROME = ('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')


class Ws:
    def __init__(self, url):
        _, reste = url.split('://', 1)
        hote, chemin = reste.split('/', 1)
        h, p = hote.split(':')
        self.s = socket.create_connection((h, int(p)), timeout=20)
        cle = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((
            f'GET /{chemin} HTTP/1.1\r\nHost: {hote}\r\nUpgrade: websocket\r\n'
            f'Connection: Upgrade\r\nSec-WebSocket-Key: {cle}\r\n'
            'Sec-WebSocket-Version: 13\r\n\r\n').encode())
        entete = b''
        while b'\r\n\r\n' not in entete:
            entete += self.s.recv(1)
        assert b'HTTP/1.1 101' in entete, entete[:120]
        self.tampon = b''

    def _lire(self, n):
        while len(self.tampon) < n:
            bloc = self.s.recv(65536)
            if not bloc:
                raise ConnectionError('connexion fermee')
            self.tampon += bloc
        out, self.tampon = self.tampon[:n], self.tampon[n:]
        return out

    def envoyer(self, obj):
        charge = json.dumps(obj).encode()
        n = len(charge)
        entete = b'\x81'
        if n < 126:
            entete += bytes([0x80 | n])
        elif n < 65536:
            entete += bytes([0x80 | 126]) + n.to_bytes(2, 'big')
        else:
            entete += bytes([0x80 | 127]) + n.to_bytes(8, 'big')
        masque = os.urandom(4)
        self.s.sendall(entete + masque +
                       bytes(b ^ masque[i % 4] for i, b in enumerate(charge)))

    def recevoir(self):
        b0, b1 = self._lire(2)
        n = b1 & 0x7F
        if n == 126:
            n = int.from_bytes(self._lire(2), 'big')
        elif n == 127:
            n = int.from_bytes(self._lire(8), 'big')
        return json.loads(self._lire(n).decode())


class Navigateur:
    _id = 0

    def __init__(self, largeur, hauteur=1000, port=None):
        Navigateur._id += 1
        port = port or (9400 + (os.getpid() + Navigateur._id) % 400)
        # Le profil va dans un dossier temporaire : lance depuis la racine,
        # Chrome deposerait sinon un `.chrome-9xxx` de plusieurs Mo dans le
        # depot a chaque appel.
        profil = os.path.join(tempfile.gettempdir(), f'choucas-chrome-{port}')
        self.proc = subprocess.Popen(
            [CHROME, '--headless=new', '--disable-gpu', '--no-first-run',
             '--no-default-browser-check', '--hide-scrollbars',
             f'--user-data-dir={profil}',
             f'--remote-debugging-port={port}',
             f'--window-size={max(largeur, 500)},{hauteur}', 'about:blank'],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(120):
            try:
                cibles = json.loads(urllib.request.urlopen(
                    f'http://127.0.0.1:{port}/json', timeout=1).read())
                page = next(c for c in cibles if c['type'] == 'page')
                break
            except Exception:
                time.sleep(0.25)
        else:
            raise RuntimeError('Chrome ne repond pas')
        self.ws = Ws(page['webSocketDebuggerUrl'])
        self.n = 0
        self.appel('Page.enable')
        self.appel('Runtime.enable')
        self.appel('Emulation.setDeviceMetricsOverride',
                   width=largeur, height=hauteur,
                   deviceScaleFactor=1, mobile=False)

    def appel(self, methode, **params):
        self.n += 1
        self.ws.envoyer({'id': self.n, 'method': methode, 'params': params})
        while True:
            m = self.ws.recevoir()
            if m.get('id') == self.n:
                if 'error' in m:
                    raise RuntimeError(f"{methode}: {m['error']}")
                return m.get('result', {})

    def ouvrir(self, url, attente=2.5):
        self.appel('Page.navigate', url=url)
        time.sleep(attente)

    def evaluer(self, expression, attente_promesse=True):
        r = self.appel('Runtime.evaluate', expression=expression,
                       awaitPromise=attente_promesse, returnByValue=True)
        if 'exceptionDetails' in r:
            return 'ERREUR ' + json.dumps(
                r['exceptionDetails'].get('exception', {}).get('description',
                r['exceptionDetails']), ensure_ascii=False)
        return r['result'].get('value')

    def capture(self, chemin):
        r = self.appel('Page.captureScreenshot', format='png')
        open(chemin, 'wb').write(base64.b64decode(r['data']))
        return chemin

    def fermer(self):
        try:
            self.ws.s.close()
        except Exception:
            pass
        self.proc.terminate()
        try:
            self.proc.wait(timeout=5)
        except Exception:
            self.proc.kill()
