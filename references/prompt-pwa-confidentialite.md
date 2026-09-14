# Prompt à donner à la session PWA

À copier tel quel dans la session Claude Code qui travaille sur le dépôt de la
PWA. Il est auto-portant : il ne suppose pas l'accès aux spécifications du
dépôt du site.

---

Tu travailles sur la PWA Choucas — Google Apps Script devant une feuille
Google Sheets, application servie en statique. Elle sert des conciergeries de
montagne : un manager arbitre la journée, des équipières exécutent des
missions dans des chalets qui ne leur appartiennent pas.

**L'application détient les codes d'accès de ces chalets** — boîtes à clés,
portes, alarmes. C'est sa donnée la plus dangereuse : une fuite n'abîme pas
une réputation, elle ouvre une porte chez un propriétaire qui n'est le client
de personne dans cette chaîne. Il est le client du client.

Le site vitrine promet publiquement des choses que l'application ne tient pas
encore. Ta tâche est de les rendre vraies.

## Commence par vérifier ce que je décris

Ne me crois pas sur parole : ouvre le code et confirme. Dans la version que
j'ai lue, le fichier servi publiquement contenait ceci.

```js
role: safeGet('concierge_role', 'manager')
if (urlParams.get('role')) { CONFIG.role = urlParams.get('role'); … }
if (urlParams.get('qui'))  { CONFIG.userName = urlParams.get('qui'); … }
function estEquipier() { return CONFIG.role === 'equipier'; }
function missionsVisibles() { /* filtre côté client */ }
```

Trois faits en découlent, à confirmer :

1. **Le rôle est décidé par le navigateur, et vaut `manager` par défaut.**
   `?role=manager` dans l'adresse, ou une ligne changée dans `localStorage`.
2. **Le nom de la personne est un paramètre d'adresse**, `?qui=Sophie`. Or le
   produit repose sur « personne ne valide son propre travail » : un appareil
   peut aujourd'hui se déclarer Sophie et valider son propre travail.
3. **Le filtrage des missions est cosmétique.** Si l'API répond tout et que le
   navigateur cache, une équipière reçoit déjà l'ensemble des données de la
   conciergerie sur le fil.

L'authentification se fait par un jeton unique par conciergerie, passé dans la
query string et gardé en clair dans `localStorage`.

## L'ordre, et il n'est pas négociable

### Étape 1 — une identité par personne

Sans elle, rien de ce qui suit ne tient : une fenêtre d'accès qui se contourne
en éditant `localStorage` n'est pas une fenêtre.

- Une feuille `Personnes` : `id`, `conciergerie`, `prenom`, `nom`, `role`
  (`manager` ou `terrain`), `empreinte`, `actif`.
- **Le code d'accès n'est jamais stocké.** On stocke
  `HMAC-SHA256(code, poivre)`, le poivre vivant dans
  `PropertiesService.getScriptProperties()` et **jamais dans la feuille** :
  une feuille partagée par erreur ne doit livrer aucun code.
- Le code se saisit **dans un champ de l'application**, jamais dans l'adresse.
  Il s'échange une fois contre un jeton de session de douze heures. Le
  navigateur garde la session, pas le code : une session qui fuit expire.
- Code inconnu et code désactivé renvoient **le même message**. Les
  distinguer dit à qui cherche quels codes existent.
- Cinq tentatives par code et par quart d'heure, comptées dans
  `CacheService`, puis refus sans vérification.

### Étape 2 — le serveur décide, le client affiche

C'est l'étape qui ferme la faille. Les deux précédentes ne protègent rien tant
qu'elle n'est pas faite.

- `?role=` et `?qui=` disparaissent du client. Le rôle est résolu depuis la
  session, côté serveur, et un rôle présent dans le corps d'une requête est
  ignoré.
- `missionsVisibles()` quitte le navigateur : la requête ne renvoie que ce que
  cette personne a le droit de voir.
- **Attribution :** le serveur estampille chaque écriture avec la personne de
  la session. Le client n'envoie jamais de nom. C'est cette règle, et elle
  seule, qui rend vraie la phrase « la ligne porte le nom de celui qui l'a
  acceptée ».
- **Double contrôle :** une validation est refusée si la personne de la
  session est celle qui a déclaré la mission terminée. Un refus serveur, pas
  un bouton grisé.
- **Cloisonnement :** toute lecture et toute écriture sont filtrées par la
  conciergerie de la session. Aucune requête ne peut en nommer une autre.

### Étape 3 — les codes d'accès

- Les codes vivent dans **leur propre feuille**, jamais dans `Biens` : aucun
  export ni aucune erreur de point d'entrée ne doit les emporter au passage.
- **Fenêtre d'accès.** Une personne `terrain` voit le code d'un bien si et
  seulement si elle a une mission dessus, non annulée, dans la fenêtre
  **J 00:00 → J+1 06:00**. Elle déborde sur le lendemain matin parce qu'un
  départ de 6 h existe ; elle ne déborde pas sur la veille, préparer une
  mission ne demande pas d'ouvrir la porte.
- **Hors fenêtre, le champ n'existe pas dans la réponse.** Pas masqué côté
  client : c'est la différence entre une protection et une décoration, et
  c'est exactement l'erreur que `missionsVisibles()` commet aujourd'hui.
- **Le code se demande, il ne s'affiche pas.** Les listes ne renvoient jamais
  la valeur, seulement le libellé et un booléen. Un appel dédié,
  `acces.reveler`, rend la valeur pour un accès à la fois, **et écrit au
  journal avant de répondre** : si le journal échoue, le code ne part pas.
- Un `manager` voit tous les codes de sa conciergerie — sans quoi il ne peut
  pas dépanner un samedi — mais sa révélation est journalisée comme les
  autres. Aucune exemption : un journal qui a des trous n'est pas un journal.

### Étape 4 — l'engagement de confidentialité

Les étapes précédentes limitent qui peut voir un code. Celle-ci engage la
personne qui le voit.

- Une feuille `Engagements` : `personneId`, `version`, `accepteLe`, et
  **l'empreinte SHA-256 du texte affiché**. L'empreinte et non le texte : elle
  prouve ce qui a été accepté sans dupliquer le contenu à chaque ligne.
- `acces.reveler` **refuse** si la personne n'a pas d'engagement à la version
  courante. Le refus n'est pas une erreur : il renvoie le texte à signer, et
  l'appel se rejoue après acceptation.
- La signature se demande **au moment de la première révélation**, pas à
  l'inscription et pas dans des conditions générales acceptées d'un bloc :
  c'est là que la personne comprend de quoi il s'agit.
- Un texte réécrit change de version, et chacun re-signe. Un engagement porte
  sur des mots précis, pas sur une intention.
- Le manager n'en est pas exempté. Il voit plus de codes que quiconque.

### Étape 5 — le rapport de départ

C'est la raison d'être du journal, et c'est un argument de vente avant d'être
une mesure de sécurité.

`personne.rapportDepart` rend, pour une personne, la liste distincte des accès
qu'elle a révélés, avec la première et la dernière fois, et sa date
d'engagement. Réservé au manager.

Le jour où quelqu'un quitte la conciergerie, « qu'est-ce qu'elle a vu ? » a
enfin une réponse : voici les vingt-trois codes, voici ceux à changer. L'écran
qui révoque quelqu'un propose ce rapport dans la foulée — révoquer sans savoir
quoi changer ne protège de rien.

## Contraintes de forme

- Toutes les requêtes en `POST`, **le jeton de session dans le corps, jamais
  dans l'adresse**. Une query string se retrouve dans l'historique, dans
  l'en-tête `Referer` des liens sortants, dans les journaux serveur et sur les
  captures d'écran partagées.
- `LockService.getScriptLock()` autour de toute écriture.
- `Referrer-Policy: no-referrer` dans les en-têtes, pour que les liens
  sortants — les itinéraires Google Maps, notamment — n'emportent pas
  l'adresse courante.
- Comparaison à temps constant sur les empreintes. Le gain est théorique sur
  cette pile, le coût est nul.

## Ce qu'il ne faut pas faire

- **Chiffrer les valeurs dans la feuille.** Apps Script n'offre pas d'AES ;
  `computeHmacSha256Signature` signe, il ne chiffre pas. Bricoler un
  chiffrement par-dessus donne une fausse assurance et un vrai risque : une
  clé égarée dans les propriétés du script rend le parc entier illisible.
- **Faire figurer un code** dans un rapport propriétaire, un export, un mail
  ou une notification. Les aperçus de notification s'affichent sur un écran
  verrouillé.
- **Le second facteur, l'audit externe, la certification.** Pas maintenant.
  Ils coûtent cher et ne protègent contre aucun des risques réels, qui sont :
  une équipière qui part en fin de saison, un téléphone perdu, une feuille
  partagée de trop. Un attaquant réseau n'est pas dans cette liste.

## Comment savoir que c'est fait

Chacune de ces phrases doit être vérifiable en manipulant l'application, pas
en lisant le code :

1. `?role=manager` dans l'adresse ne change rien.
2. Modifier `localStorage` à la main ne change ni le rôle ni le nom.
3. Une équipière connectée ne reçoit, dans la réponse réseau, que ses propres
   missions — vérifier dans l'onglet réseau, pas à l'écran.
4. Une personne ne peut pas valider une mission qu'elle a déclarée terminée :
   la requête est refusée.
5. Un code demandé hors de la fenêtre n'est pas dans la réponse.
6. Une première demande de code renvoie le texte d'engagement et non la
   valeur.
7. Retirer une personne coupe son accès au prochain appel, et personne d'autre
   n'est dérangé.
8. Le rapport de départ liste les codes qu'elle a vus.

## Une dernière chose

Le site vitrine publie déjà, en toutes lettres, que « les rôles et les droits
se réattribuent en quelques minutes par personne » et qu'« une personne ne
contrôle pas une mission qu'elle a elle-même exécutée ». Ces phrases sont
aujourd'hui fausses. Tant qu'elles le restent, le site porte une dette que la
première conciergerie découvrira pendant sa journée d'implantation.
