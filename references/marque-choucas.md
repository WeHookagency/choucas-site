# La marque Choucas

Les neuf dessins de la marque, nettoyés : plus de métadonnée C2PA, seulement
le SVG. 5 Ko au total contre 75 à l'arrivée — 93 % du poids était une
signature qui n'a rien à faire dans un dépôt de code.

**Ce dossier est une source, pas une ressource.** L'application ne le charge
jamais : le §12 lui interdit toute ressource externe, et les dessins qu'elle
utilise y sont recopiés en clair dans `index.html` et `manifest.json`. Ce
dossier existe pour qu'on retrouve les originaux le jour où il faudra en
refaire un.

## Les trois couleurs

    sapin   #263F30      arc, et tuile quand elle est sombre
    crème   #F6F5EF      disque, et tuile quand elle est claire
    cuivre  #B7683F      la coche

Ce sont celles de la charte, et elles ne suivent pas les tokens. Un logo qui
dérive avec le thème n'est plus un logo. Elles sont donc écrites en dur dans
les SVG comme dans l'application.

## Ce que l'application utilise

| Fichier | Où |
|---|---|
| `choucas-mark-inverse.svg` | loader 56 px, écran d'accueil 36 px |
| `choucas-mark-small.svg` — inversée | en-tête d'identité 16 px, favicon 48 px |
| — composée depuis l'inverse | tuile PWA 192 et 512, apple-touch-icon |

La tuile n'a pas de fichier : elle se compose d'un carré crème à `rx` 22,3 %
sur lequel on pose l'arc et la coche, sans disque — un disque crème sur une
tuile crème ne se verrait pas.

## Deux dessins pour l'épaisseur, pas un réglage

`choucas-mark` porte un trait de 14 et une coche de 7 ; `choucas-mark-small`
un trait de 17 et une coche de 6. Ce n'est pas le même dessin redimensionné :
c'est le réglage optique, fait en amont. À 16 px, un trait calibré pour 56
devient une tache ; à 56, un trait calibré pour 16 devient lourd.

Le seuil est 32 px.

## Pourquoi l'inverse partout, et pas le disque sapin

Mesuré avant de choisir, au seuil de 3,0 des objets graphiques :

    coche cuivre sur disque sapin        2,76:1   sous le seuil
    disque sapin sur --iconbg #244238    1,04:1   invisible
    disque sapin sur --bg sombre         1,40:1   presque invisible

    coche cuivre sur disque crème        3,80:1   conforme
    arc sapin    sur disque crème       10,47:1   conforme
    disque crème sur --iconbg           10,40:1   conforme

Le carré de l'écran d'accueil est en `--iconbg`, c'est-à-dire `#244238`. Un
disque `#263F30` posé dessus disparaît : on ne verrait que l'arc et la coche
flotter dans un carré vert. Et la coche est ce qui distingue Choucas d'un
logo de cercle — la perdre vide la marque de son sens.

## Les deux lockups ne sont pas utilisables en l'état

`choucas-lockup-horizontal` et `choucas-lockup-vertical` portent un `<text>`
en Newsreader italique. L'application n'embarque pas cette police et ne peut
pas le faire : le §12 lui interdit toute ressource externe, et une police
entière pour un seul mot ne se justifierait pas. Ils sortiraient en police de
repli, c'est-à-dire faux.

Vectoriser le texte, ou ne pas les utiliser.

## Les monochromes

`mono-ink` et `mono-paper` existent pour un fond contraint ou une impression.
Rien dans l'application ne s'en sert aujourd'hui.
