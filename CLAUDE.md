@AGENTS.md

# Vérifier une page dans un navigateur

Le site se vérifie en cliquant et en défilant réellement, pas en lisant le
code. Deux pièges de Chrome sans affichage faussent cette vérification en
silence — ils ne produisent aucune erreur, seulement un faux résultat.

## `--virtual-time-budget` ne livre ni `requestAnimationFrame` ni `IntersectionObserver`

Ce drapeau fige l'horloge pour que `--dump-dom` et `--screenshot` attendent la
fin du rendu. Il fige aussi la boucle de trames : `requestAnimationFrame` ne
se rappelle jamais, et `IntersectionObserver` ne livre aucune entrée.

Conséquence : **tout ce qui réagit au défilement paraît cassé alors que le
code est bon.** Un sommaire qui suit les sections, une révélation au scroll,
une barre collante active — tous rendent un état figé au premier paint. Une
promesse qui attend `requestAnimationFrame` ne se résout jamais, et le script
reste suspendu jusqu'au délai maximal.

Pour ces composants, piloter Chrome par le protocole DevTools, en temps réel.
Le drapeau reste bon pour une capture statique ou une mesure de mise en page.

## Une fenêtre Chrome ne descend pas sous ~400 px de large

`--window-size=390,900` rend une image de 390 px, mais la page est mise en
page à la largeur plancher de la fenêtre, puis rognée. Le résultat ressemble à
un débordement horizontal : du texte coupé à droite, des blocs qui dépassent.
Il n'y en a aucun.

C'est le piège le plus coûteux des deux, parce qu'il produit un faux positif
crédible : on part corriger une mise en page qui n'a rien.

Pour vérifier à 390 px, poser la page dans une `iframe` de largeur exacte,
servie depuis la même origine, à l'intérieur d'une fenêtre plus large. La
mesure de `document.documentElement.scrollWidth` dans l'iframe est alors la
bonne.

## Le réflexe qui tranche

Avant de conclure qu'une page est cassée, vérifier que le harnais ne l'est
pas. Mesurer d'abord une valeur que le rendu ne peut pas inventer —
`scrollWidth`, un `getBoundingClientRect`, une couleur calculée — et la
confronter à la capture. Quand les deux divergent, c'est presque toujours
l'outil qui ment.
