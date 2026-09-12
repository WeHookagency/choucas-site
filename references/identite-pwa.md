# Identité et autorisation dans la PWA Choucas

Spécification d'implémentation. Cible : l'application servie aujourd'hui sur
`choucasv2.netlify.app`, adossée à Google Apps Script et à une feuille Google
Sheets. Écrite le 12 septembre 2026.

Ce document ne vit pas dans le dépôt du site — il y est déposé parce que
`references/` sert de maison commune aux spécifications. Le code décrit ici
appartient au dépôt de la PWA.

---

## 1. Ce qui est vrai aujourd'hui

Trois constats, relevés dans le fichier public le 12 septembre 2026.

**Le rôle est décidé par le navigateur, et vaut `manager` par défaut.**

```js
role: safeGet('concierge_role', 'manager')
if (urlParams.get('role')) { CONFIG.role = urlParams.get('role'); … }
function estEquipier() { return CONFIG.role === 'equipier'; }
function estManager()  { return !estEquipier(); }
```

`?role=manager` dans l'adresse, ou une ligne changée dans `localStorage`,
suffit. L'absence de rôle donne le rôle le plus privilégié.

**Le nom de la personne est un paramètre d'adresse.** `?qui=Sophie`. C'est
précisément ce que le produit met au centre : « la ligne porte le nom de celui
qui l'a acceptée », « personne ne valide son propre travail ». Un appareil peut
aujourd'hui se déclarer Sophie, manager, et valider son propre travail.

**Le filtrage est cosmétique.** `missionsVisibles()` trie dans le navigateur.
Si l'API répond tout et que le client cache, une équipière qui détient le jeton
reçoit déjà l'ensemble des données de la conciergerie sur le fil. À confirmer
dans l'Apps Script.

**Le cadre.** Un jeton unique par conciergerie, passé dans la query string,
gardé en clair dans `localStorage`, devant un point d'entrée publiquement
appelable. Pas d'identité, donc pas de révocation : une gouvernante qui part
garde l'accès jusqu'à ce que la clé change pour tout le monde.

> La conséquence n'est pas seulement technique. Tant que n'importe qui peut
> signer à la place de Sophie, la règle du double contrôle est une convention
> d'interface. Le jour où l'identité est réelle, elle devient une propriété du
> système — et elle se démontre.

---

## 2. Le principe

**Le serveur décide, le client affiche.**

Le navigateur ne transporte plus aucune affirmation sur qui il est. Il présente
une session ; le serveur en déduit la personne, sa conciergerie, son rôle et ce
qu'elle a le droit de voir. Toute règle métier qui protège quelque chose vit
dans l'Apps Script, jamais dans le fichier HTML — qui est lisible et modifiable
par quiconque l'ouvre.

Corollaire à tenir pendant toute l'implémentation : **si une règle peut être
contournée en éditant `localStorage`, elle n'existe pas.**

---

## 3. Le modèle de données

Trois feuilles nouvelles. Aucune ne contient de code en clair.

### `Personnes`

| Colonne | Type | Note |
|---|---|---|
| `id` | texte | identifiant stable, jamais réutilisé |
| `conciergerie` | texte | clé de cloisonnement |
| `prenom`, `nom` | texte | ce qui s'affiche sur une ligne validée |
| `role` | `manager` \| `terrain` | **seule source du rôle** |
| `empreinte` | texte | `HMAC-SHA256(code, poivre)`, en base64 |
| `actif` | booléen | `FAUX` coupe l'accès au prochain appel |
| `creeLe`, `revoqueLe` | date | traçabilité des accès |

Le code n'est **jamais** écrit dans la feuille. Il est montré une seule fois, à
la création, puis il n'existe plus que dans la tête de la personne.

Le poivre vit dans `PropertiesService.getScriptProperties()`, pas dans la
feuille. Une feuille partagée par erreur, ou un dossier Drive mal réglé, ne
livre alors aucun code : l'empreinte seule ne se renverse pas.

### `Sessions`

| Colonne | Type | Note |
|---|---|---|
| `jeton` | texte | 32 octets aléatoires, base64url |
| `personneId` | texte | |
| `expire` | date-heure | |
| `dernierAppel` | date-heure | pour couper les sessions dormantes |

`CacheService` sert de cache de premier niveau ; la feuille garde la trace, ce
que le cache ne sait pas faire — il s'évapore sans prévenir.

### `Journal`

Append-only. On n'y modifie ni n'y supprime jamais une ligne.

| Colonne | Note |
|---|---|
| `horodatage` | serveur, jamais le client |
| `personneId` | résolu depuis la session |
| `action` | `connexion`, `refus`, `mission.terminee`, `mission.validee`, … |
| `cible` | identifiant de la ligne touchée |
| `detail` | facultatif, jamais de donnée personnelle de client |

---

## 4. Le cycle de vie d'un code

1. **Création.** Le manager ajoute une personne. Le serveur tire un code de
   dix caractères dans un alphabet sans ambiguïté — pas de `0`/`O`, pas de
   `1`/`l`/`I`. Il calcule l'empreinte, écrit la ligne, et **renvoie le code une
   seule fois** pour affichage. Il ne le stocke nulle part.
2. **Remise.** Le manager transmet le code de vive voix ou par un canal qu'il
   choisit. Le produit ne l'envoie pas : envoyer suppose un sous-traitant de
   messagerie, donc une déclaration de plus dans la politique de
   confidentialité.
3. **Connexion.** La personne saisit son code **dans un champ de
   l'application**. Jamais dans l'adresse.
4. **Échange.** Le serveur vérifie l'empreinte et répond un jeton de session.
   Le navigateur garde le jeton, pas le code. Une session qui fuit expire ; un
   code qui fuit, non.
5. **Renouvellement.** Session de douze heures, prolongée à chaque appel. Une
   équipière ne se reconnecte pas au milieu d'une tournée.
6. **Révocation.** `actif` à `FAUX`. Les sessions de cette personne sont
   effacées du cache et de la feuille. L'accès tombe au prochain appel, et
   personne d'autre n'est dérangé — ce que le jeton partagé ne permettait pas.
7. **Rotation.** Le manager régénère un code sans supprimer la personne : son
   historique dans le journal reste attaché au même `id`.

---

## 5. Le contrat d'API

Toutes les requêtes sont des `POST` vers l'Apps Script. Le jeton de session va
dans le corps, pas dans l'adresse : une query string se retrouve dans
l'historique du navigateur, dans l'en-tête `Referer` des liens sortants, dans
les journaux serveur et sur les captures d'écran partagées.

```
POST /exec
{ "action": "connexion", "code": "K7M2P9RT4X" }
→ { "ok": true, "session": "…", "personne": { "prenom": "Sophie", "role": "manager" } }
→ { "ok": false, "erreur": "identifiants" }      // même message que code inconnu
```

```
POST /exec
{ "action": "…", "session": "…", "payload": { … } }
```

Trois règles sur les réponses :

- **Un seul message d'erreur d'authentification.** Code inconnu et code
  inactif répondent la même chose. Distinguer les deux dit à qui cherche
  quels codes existent.
- **Le rôle n'est jamais lu depuis le corps.** S'il y est, il est ignoré.
- **Rien n'est renvoyé « pour filtrer plus tard ».** Le serveur ne répond que
  ce que cette personne a le droit de voir.

---

## 6. Les cinq règles serveur

Elles ne sont pas des vérifications d'interface. Une requête qui les viole
reçoit un refus et laisse une ligne dans le journal.

1. **Cloisonnement.** Toute lecture et toute écriture sont filtrées par la
   conciergerie de la session. Aucune requête ne peut nommer une autre
   conciergerie.
2. **Visibilité.** `terrain` ne reçoit que ses propres missions. Le filtrage
   quitte `missionsVisibles()` pour la requête de la feuille.
3. **Attribution.** Le serveur estampille chaque écriture avec la personne de
   la session. Le client n'envoie jamais de nom. C'est cette règle, et elle
   seule, qui rend vraie la phrase « la ligne porte le nom de celui qui l'a
   acceptée ».
4. **Double contrôle.** Une validation est refusée si la personne de la session
   est celle qui a déclaré la mission terminée. Aujourd'hui convention
   d'interface ; ici, un refus.
5. **Rôle.** Seul `manager` arbitre un brief, valide un état PRÊT, crée une
   personne ou révoque un code.

---

## 7. Freinage

Le point d'entrée Apps Script est publiquement appelable : le code est la seule
barrière, il faut donc qu'on ne puisse pas le deviner.

- Cinq tentatives de connexion échouées par code, par quart d'heure, comptées
  dans `CacheService`. Au-delà, refus sans vérification.
- Un compteur global par quart d'heure coupe une attaque distribuée.
  `getUserIp()` n'existe pas dans Apps Script : on ne peut pas freiner par
  origine, seulement par identifiant présenté et en volume.
- Comparaison à temps constant sur l'empreinte. Le gain est théorique sur cette
  pile, le coût est nul.
- Chaque refus va au journal. Une rafale devient visible.

`LockService.getScriptLock()` autour de toute écriture : deux équipières qui
cochent la même mission au même instant ne doivent pas se marcher dessus.

---

## 8. Migration depuis le jeton partagé

Ordre à tenir, chaque étape livrable seule.

1. Créer les trois feuilles et poser le poivre dans les propriétés du script.
2. Ajouter `action: "connexion"` et la validation de session, **sans retirer
   l'ancien jeton**. Les deux cohabitent.
3. Déplacer le rôle et la visibilité côté serveur. Retirer `?role=` et `?qui=`
   du client, ainsi que `missionsVisibles()`.
4. Créer les personnes réelles, distribuer les codes.
5. Couper l'ancien jeton, et retirer `?api=` et `?token=` de la lecture des
   paramètres.
6. Poser `Referrer-Policy: no-referrer` dans les en-têtes Netlify, pour que les
   liens sortants — les itinéraires Google Maps, notamment — n'emportent pas
   l'adresse courante.

L'étape 3 est celle qui ferme la faille. Les étapes 1 et 2 ne protègent rien
tant qu'elle n'est pas faite.

---

## 9. Ce que ça permet de dire

Aucune de ces phrases n'est publiable avant l'étape 5. Après, elles sont
vérifiables.

- Chaque personne a son propre accès. Le retrait d'une personne ne dérange
  personne d'autre.
- Une équipière ne voit que ses missions. Ce n'est pas un affichage, c'est ce
  que le serveur répond.
- Le nom porté par une ligne validée est celui que le serveur a résolu, pas
  celui que l'appareil a déclaré.
- Personne ne valide son propre travail : la tentative est refusée.
- Aucun accès n'est stocké en clair, ni chez nous, ni dans la feuille.

À garder distinct de ce qui est **déjà vrai du site vitrine**, mesuré le
12 septembre 2026 sur l'accueil, le formulaire et la page de confidentialité :
aucune origine tierce, aucun cookie, aucun stockage local, aucun script
externe. Et de ce qui est déjà tranché : aucune donnée de santé, conservation à
trois ans après le dernier séjour, deux sous-traitants nommés.

---

## 10. Ce que cette spécification ne couvre pas

- Le chiffrement au repos : les données restent dans Google Workspace, déjà
  déclaré comme sous-traitant. Apps Script ne donne pas de levier utile
  au-dessus.
- L'export et l'effacement sur demande d'une personne concernée. La politique
  de confidentialité les promet ; il n'existe aujourd'hui aucun outil pour les
  exécuter. À traiter, séparément.
- Le second facteur. Hors de portée d'un usage terrain avec des gants et du
  réseau incertain.
