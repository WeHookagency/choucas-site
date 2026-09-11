# Outils de vérification

Quatre outils qui servent à vérifier le site, pas à le construire. Ils ne sont
ni compilés, ni livrés, ni lus par Next : `scripts/` est hors de `src/`.

Aucune dépendance. Python de macOS et Chrome installé, rien d'autre — le §12
des specs interdit toute dépendance nouvelle, et ces outils s'y tiennent comme
le reste.

Ils vivaient dans un dossier temporaire et disparaissaient à chaque nettoyage.

---

## `cdp.py` — piloter Chrome en vrai

Un navigateur commandé par le protocole DevTools, en temps réel. Sert à
vérifier le site **en cliquant et en défilant**, ce que `CLAUDE.md` exige.

```python
import sys; sys.path.insert(0, 'scripts')
from cdp import Navigateur

n = Navigateur(1440, 900)
n.ouvrir('http://localhost:3000/fr', 3)
print(n.evaluer('document.title'))
n.capture('vue.png')
n.fermer()
```

Changer de largeur sans relancer Chrome :

```python
n.appel('Emulation.setDeviceMetricsOverride',
        width=390, height=900, deviceScaleFactor=1, mobile=False)
```

**Deux pièges qu'il évite**, tous deux documentés dans `CLAUDE.md` :

- pas de `--virtual-time-budget`. Ce drapeau fige la boucle de trames :
  `requestAnimationFrame` ne se rappelle jamais, `IntersectionObserver` ne
  livre aucune entrée. Tout ce qui réagit au défilement paraîtrait cassé alors
  que le code est bon ;
- la largeur vient de `Emulation.setDeviceMetricsOverride`, pas de
  `--window-size` — une fenêtre Chrome ne descend pas sous ~400 px et produit
  un faux débordement horizontal à 390.

Le protocole WebSocket est écrit à la main. La poignée de main de Chrome ne
suit pas le calcul du RFC 6455 : on se contente du `101`.

---

## `audit.js` — les défauts durs

Une expression à évaluer dans la page. Rend du JSON : débordements
horizontaux, contrastes sous le seuil, cibles tactiles sous 44 px, et un
inventaire typographique.

```python
import json
d = json.loads(n.evaluer(open('scripts/audit.js').read()))
print(len(d['debordent']), len(d['contrastes']), len(d['cibles']))
```

Les couleurs sont **composées dans un canvas** et non lues telles quelles : les
valeurs calculées sortent en `oklab` avec un canal alpha, et les lire à la main
donne des ratios faux — 6,03:1 au lieu de 4,73:1, mesuré.

Seuils : 4,5 pour le texte courant, 3 au-delà de 24 px ou de 18,66 px en gras.
Sont ignorés les `sr-only`, les éléments masqués aux lecteurs d'écran, et les
débordements contenus par un ancêtre qui coupe ou fait défiler.

---

## `mise-en-page.js` — ce que l'audit ne voit pas

Même usage. Cherche les blocs visuels seuls sur leur ligne qui occupent moins
de 65 % de leur colonne, et les grilles à dernière rangée incomplète.

Un bloc **centré** n'est jamais signalé : deux marges égales se lisent comme
une respiration, un trou d'un seul côté comme un oubli.

Angle mort connu : les porteurs de plus de 40 caractères sont exclus, sinon
toute mesure de lecture voulue — les `max-w-[62ch]` — remonterait comme un
trou. Une carte trop étroite dans le tunnel passe donc sous le radar.

---

## `insec.py` — les espaces insécables

```
python3 scripts/insec.py
```

Pose l'insécable avant `? ! ; :` et le guillemet fermant, après le guillemet
ouvrant. À lancer après toute écriture dans `fr.json`.

**Le français seul, et c'est verrouillé dans le script.** L'anglais ne met pas
d'espace avant `?` ou `:` ; y appliquer la règle produit « No line is left
hanging : it is assigned ». Le chemin est construit dans le fichier, jamais
reçu en argument, et une garde refuse tout ce qui n'est pas `fr.json`. Un
appelant ne peut pas se tromper : il n'a pas de bouton pour ça.

---

## Les largeurs de vérification

390 · 768 · 1024 · 1280 · 1440.

Les trois premières et la dernière sont les ruptures du site ; 1024 et 1280
couvrent le tunnel entre tablette et grand écran, là où les mises en page
basculent et où personne ne regarde.
