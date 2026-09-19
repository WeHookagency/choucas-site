# Les codes d'accès dans la PWA Choucas

Spécification d'implémentation. Cible : l'application adossée à Google Apps
Script et à une feuille Google Sheets. Écrite le 13 septembre 2026.

**Prérequis : `identite-pwa.md`, étape 3 de sa migration.** Tant que le rôle et
la visibilité sont décidés par le navigateur, aucune règle de ce document ne
tient : une fenêtre d'accès qui se contourne en éditant `localStorage` n'est
pas une fenêtre. Ne pas commencer ici.

Le code décrit appartient au dépôt de la PWA. `references/` sert de maison
commune aux spécifications ; il n'est ni compilé ni livré avec le site.

---

## 1. Ce qu'on protège, et contre qui

La démonstration publique affiche aujourd'hui « Boîte à clés côté garage,
code 447 ». C'est la donnée la plus dangereuse du produit — pas parce qu'elle
est personnelle, mais parce que sa fuite ouvre une porte. Le préjudice n'est
pas un dommage de réputation, c'est un cambriolage chez un propriétaire qui
n'est le client de personne ici : il est le client du client.

Les risques, par probabilité réelle et non par gravité théorique :

1. **Une équipière qui part.** De loin le premier. Saison finie, elle a eu
   l'application, elle a vu les codes, elle les a peut-être capturés en photo.
   Sans identité par personne, on ne peut pas lui retirer l'accès sans changer
   la clé de toute la conciergerie.
2. **Un téléphone perdu ou prêté**, application ouverte, session en clair dans
   `localStorage`.
3. **La feuille elle-même** — un partage de trop, un dossier Drive mal réglé,
   un export envoyé par mail.
4. **L'éditeur.** Choucas détient les codes de maisons qui n'appartiennent ni à
   lui ni à ses clientes.

⚠️ **Les risques 3 et 4 ont changé le 19 septembre 2026**, quand il a été
décidé que le script et la feuille vivraient dans le Workspace de la cliente.
Le risque 3 change de main — c'est l'administrateur de la conciergerie qui
contrôle le partage, ce qui ne le réduit pas mais le confie à celui qui subit
le préjudice. Le risque 4 diminue réellement : l'éditeur ne détient plus les
codes, il garde un accès de support révocable. Voir
`installation-chez-le-client.md` §3.

Un attaquant réseau n'est nulle part dans cette liste. C'est pourtant là que
l'attention se porte d'habitude, et c'est pourquoi ce document n'en parle pas.

---

## 2. Le modèle de données

Les codes vivent dans **leur propre feuille**, jamais dans `Biens`. Une lecture
large du parc, un export, une erreur dans un point d'entrée de liste : rien de
tout cela ne doit emporter un code au passage.

### `Acces`

| Colonne | Note |
|---|---|
| `id` | identifiant stable |
| `bienId` | |
| `conciergerie` | clé de cloisonnement, redondante avec le bien mais lue ici |
| `type` | `boite-a-cles` · `porte` · `alarme` · `portail` · `wifi` |
| `libelle` | « Boîte à clés côté garage » — jamais la valeur |
| `valeur` | le code |
| `poseLe`, `posePar` | qui l'a saisi |
| `changeLe` | date du dernier changement de valeur |
| `actif` | un accès retiré ne s'efface pas, il se desactive |

`changeLe` n'est pas décoratif : c'est lui qui alimente « code inchangé depuis
quatorze mois », et c'est cet indicateur qui fait bouger une conciergerie.

### `JournalAcces`

Append-only, distinct du journal général : le volume et la sensibilité ne sont
pas les mêmes, et on doit pouvoir le requêter seul.

| Colonne | Note |
|---|---|
| `horodatage` | serveur, jamais le client |
| `personneId` | résolu depuis la session |
| `accesId`, `bienId` | |
| `missionId` | la mission qui ouvrait la fenêtre, vide pour un manager |
| `motif` | `mission` · `manager` |

---

## 3. La fenêtre d'accès

C'est la mesure qui réduit le plus la surface, et c'est une condition dans une
requête serveur — pas un affichage.

**Une personne de rôle `terrain` peut lire un code si et seulement si :**

- il existe une mission sur ce bien,
- assignée à elle,
- dont la date tombe dans la fenêtre **J 00:00 → J+1 06:00**,
- et qui n'est ni annulée ni reportée.

La fenêtre déborde sur le lendemain matin parce qu'un check-in tardif et un
départ de 6 h existent. Elle ne déborde pas sur la veille : préparer une
mission ne demande pas d'ouvrir la porte.

Hors de cette fenêtre, le champ **n'existe pas dans la réponse**. Il n'est pas
masqué côté client — c'est la différence entre une protection et une
décoration, et c'est exactement l'erreur que `missionsVisibles()` commet
aujourd'hui pour les missions.

**Un `manager` peut lire tous les codes de sa conciergerie.** Sans quoi il ne
peut pas dépanner un samedi. Mais sa révélation est journalisée comme les
autres, avec `motif: manager`. Aucune exemption : un journal qui a des trous
n'est pas un journal.

---

## 4. Le code se demande, il ne s'affiche pas

Un code posé à l'écran toute la journée dans une liste de missions est un code
qui finit en capture d'écran.

- Les points d'entrée de liste ne renvoient **jamais** `valeur`. Ils renvoient
  `libelle`, `type`, et un booléen `revelable`.
- La valeur s'obtient par un appel dédié, un accès à la fois.

```
POST /exec
{ "action": "acces.reveler", "session": "…", "accesId": "…" }
→ { "ok": true, "valeur": "447" }
→ { "ok": false, "erreur": "hors-fenetre" }
```

Cet appel, et lui seul, écrit dans `JournalAcces`. L'écriture précède la
réponse : si le journal échoue, le code ne part pas.

Côté interface : le code est masqué, un geste explicite le révèle, il se
remasque au bout de trente secondes ou au changement d'écran. Le but n'est pas
d'empêcher la capture — c'est impossible — mais de rendre l'exposition
**délibérée et traçable** au lieu d'invisible.

---

## 5. Le rapport de départ

C'est la raison d'être du journal, et c'est un argument de vente avant d'être
une mesure de sécurité.

```
POST /exec
{ "action": "personne.rapportDepart", "session": "…", "personneId": "…" }
→ { "ok": true, "acces": [ { bien, libelle, type, premiereFois, derniereFois, nombre } ] }
```

Réservé au `manager`. Il rend la liste distincte des accès que cette personne a
révélés, avec la première et la dernière fois.

Le jour où quelqu'un quitte la conciergerie, la question « qu'est-ce qu'elle a
vu ? » a enfin une réponse : voici les vingt-trois codes, voici ceux à changer.
Aucun concurrent ne sait y répondre aujourd'hui.

L'écran qui révoque une personne propose ce rapport dans la foulée : révoquer
sans savoir quoi changer ne protège de rien.

---

## 5 bis. L'engagement de confidentialite

Decide le 14 septembre 2026. Les mesures techniques des sections 3 et 4
limitent qui peut voir un code ; celle-ci engage la personne qui le voit.

**Deux signatures, a deux niveaux.**

La **conciergerie** signe au contrat, une fois : elle se porte garante de la
confidentialite des codes de ses proprietaires et s'engage a ne les faire
manipuler que par des personnes elles-memes engagees. C'est une clause du
contrat de sous-traitance de la section 8, pas un ecran.

Chaque **personne** signe dans l'application, avant sa premiere revelation.
Pas a l'inscription, pas dans des conditions generales acceptees d'un bloc :
au moment ou elle demande son premier code, parce que c'est la qu'elle
comprend de quoi il s'agit.

### `Engagements`

| Colonne | Note |
|---|---|
| `personneId` | |
| `version` | la version du texte accepte, `2026-09-14` |
| `accepteLe` | horodatage serveur |
| `texte` | l'empreinte SHA-256 du texte affiche |

L'empreinte du texte, et non le texte : elle prouve **ce qui a ete accepte**,
sans dupliquer le contenu a chaque ligne. Un texte reecrit change de version,
et chacun re-signe — un engagement porte sur des mots precis, pas sur une
intention.

### La regle serveur

`acces.reveler` refuse si la personne n'a pas d'engagement a la version
courante. Le refus n'est pas un message d'erreur : il renvoie le texte a
signer, et l'appel se rejoue apres acceptation.

Le manager n'en est pas exempte. Il voit plus de codes que quiconque.

### Ce que ca change pour le proprietaire

C'est la seule mesure de ce document qu'un proprietaire de chalet comprend
sans explication technique. « Les personnes qui ont acces au code de votre
porte ont signe un engagement nominatif, et je peux vous dire lesquelles » est
une phrase qui se tient devant lui. Aucune des mesures precedentes ne se
raconte aussi simplement.

Le rapport de depart de la section 5 gagne au passage une colonne : la date
d'engagement de la personne, a cote des codes qu'elle a vus.

---

## 6. La rotation

Les conciergeries ne changent jamais les codes parce que c'est pénible. L'outil
doit rendre l'inaction visible.

- Un bien dont un accès a `changeLe` vieux de plus de douze mois porte un
  indicateur. Pas une alerte rouge — une mention, comme « inchangé depuis
  quatorze mois ».
- Changer une valeur met `changeLe` à jour et écrit une ligne au journal
  général. L'ancienne valeur **n'est pas conservée** : elle n'a plus d'usage et
  garder un historique de codes serait exactement le contraire du but.

---

## 7. Ce qu'il ne faut pas faire

**Chiffrer les valeurs dans la feuille.** Apps Script n'offre pas d'AES ;
`Utilities.computeHmacSha256Signature` sert à signer, pas à chiffrer. Bricoler
un chiffrement par-dessus donne une fausse assurance et un vrai risque de
perte : une clé égarée dans les propriétés du script, et le parc entier devient
illisible. La protection réaliste contre le risque n° 3 est le contrôle
d'accès au document Drive, pas de la cryptographie artisanale.

**Faire figurer un code dans un rapport propriétaire, un export, un mail ou une
notification.** Les aperçus de notification s'affichent sur un écran
verrouillé. Le rapport propriétaire, en particulier, est préparé puis relu
avant envoi : l'exclusion doit être structurelle, pas laissée à la relecture.

**Faire passer un code par une URL.** Les adresses se retrouvent dans
l'historique, dans l'en-tête `Referer` des liens sortants, dans les journaux
serveur et sur les captures partagées.

**Le second facteur, l'audit externe, la certification.** Pas maintenant. Ils
coûtent cher et ne protègent contre aucun des quatre risques de la section 1.

---

## 8. Le contrat de sous-traitance

Les conciergeries sont responsables de traitement, Choucas est sous-traitant.
L'article 28 du RGPD impose un contrat écrit, et c'est le document qu'une
conciergerie sérieuse demandera avant de signer.

Il doit nommer : l'objet et la durée, les catégories de données — dont les
codes d'accès, qui méritent d'être cités —, les sous-traitants ultérieurs
(Google, Netlify), les mesures de sécurité — les sections 3 à 6 de ce document
en sont la liste —, le sort des données en fin de contrat, et l'assistance en
cas de demande d'un propriétaire.

La politique de confidentialité du site vitrine ne le remplace pas : elle
couvre les visiteurs du site, pas les données du produit.

---

## 9. Ce que ce document ne couvre pas

- **La durée de conservation du journal.** Le rapport de départ suppose de
  garder l'historique au-delà de la présence de la personne. Proposition à
  trancher : activité de la personne plus douze mois. Le journal est lui-même
  une donnée personnelle — qui a fait quoi et quand.
- **L'export et l'effacement sur demande d'un propriétaire.** Le site le
  promet, aucun outil ne l'exécute. À traiter, séparément, et cela vaut pour
  toutes les données du produit et pas seulement les codes.
- **Le hors-ligne.** L'application fonctionne sans réseau, ce qui suppose que
  quelque chose est mis en cache sur l'appareil. Un code révélé puis conservé
  hors ligne échappe à la fenêtre de la section 3. À arbitrer : soit les codes
  ne sont jamais mis en cache et exigent du réseau, soit le cache porte la même
  expiration que la fenêtre.
