# Ce que le site promet, et ce que la PWA doit tenir

Document de liaison entre `choucas.app` et le dépôt de la PWA. Écrit le
14 septembre 2026, à partir des vingt-six réponses de `/faq`.

**Le principe : une réponse de FAQ est un engagement opposable.** Une
conciergerie qui signe après l'avoir lue a le droit d'attendre que ce soit
vrai. Une réponse qui décrit une fonction inexistante n'est pas un raccourci
marketing, c'est une dette — et elle se découvre au pire moment, pendant la
journée d'implantation ou après un incident.

Ce document n'invente rien. Il relève ce que le site affirme déjà, et met en
face ce que l'application doit faire pour que ce soit exact.

---

## 1. Les promesses non tenues

Ces réponses sont publiées et décrivent des comportements que le fichier
public servi sur `choucasv2.netlify.app` ne produit pas.

### 1.1 « Les rôles et les droits se réattribuent en quelques minutes par personne »

*Réponse `saisonniers`.* C'est l'argument qui répond à la rotation
saisonnière, le sujet le plus sensible du métier.

L'application n'a **pas d'identité par personne**. Un jeton unique par
conciergerie, passé dans l'URL et gardé dans `localStorage`. Il n'y a donc ni
attribution ni retrait individuel : écarter quelqu'un oblige à changer la clé
de tout le monde.

**Exigence :** l'étape 3 de `identite-pwa.md`. Tant qu'elle n'est pas faite,
cette réponse est fausse.

### 1.2 « Une personne ne contrôle pas une mission qu'elle a elle-même exécutée »

*Réponse `qui-controle`.* C'est la règle fondatrice du produit, celle que le
site répète sur la page d'accueil et sur Produit.

Aujourd'hui, le rôle et le nom sont déclarés par le navigateur —
`?role=manager`, `?qui=Sophie`, ou une ligne modifiée dans `localStorage`. Un
appareil peut donc se déclarer contrôleur et valider son propre travail. La
règle est une convention d'interface, pas une propriété du système.

**Exigence :** la règle 4 de `identite-pwa.md` — une validation est refusée si
la personne de la session est celle qui a déclaré la mission terminée. Un
refus serveur, pas un bouton grisé.

### 1.3 « Exportées dans un format lisible »

*Réponse `sortie`.* Et son pendant, `acces-proprietaire` : « un propriétaire
peut exiger de voir ce qui a été enregistré ».

Aucun outil n'exécute ni l'export de fin de contrat, ni une demande d'accès.
La politique de confidentialité les promet également.

**Exigence :** un export par conciergerie — biens, missions, historique de
contrôle — dans un format ouvert, et une extraction par personne concernée.
Ce n'est pas une fonction de confort : c'est un droit, et le délai légal est
d'un mois.

### 1.4 « Elles ne sont pas partagées hors de votre équipe »

*Réponse `photos`.* Avec un jeton partagé, « votre équipe » n'est pas une
frontière que le système connaît — c'est la liste de ceux qui ont le lien.

**Exigence :** le cloisonnement par conciergerie de la règle 1 d'
`identite-pwa.md`, plus la visibilité par mission de la règle 2.

---

## 2. Les promesses à vérifier

Je ne peux pas les trancher depuis le fichier public. Elles sont à confirmer
dans le dépôt de la PWA avant la mise en ligne, et à corriger sur le site si
elles sont fausses.

| Réponse | Ce que le site affirme | À vérifier |
|---|---|---|
| `hebergement` | « En Europe, chez un hébergeur soumis au RGPD » | La région de données du Workspace Google. Le réglage existe et n'est pas européen par défaut |
| `sante` | Aucune donnée de santé « dans aucun champ, y compris les champs libres », avec « une mention à la saisie » | Le contrôle à la saisie et la mention existent-ils vraiment ? |
| `hors-reseau` | « Une file locale », et « les alertes urgentes tentent immédiatement les canaux disponibles » | La file existe-t-elle ? Quels canaux ? |
| `connexion-pms` | « Oui, via les rotations et les calendriers iCal » | L'import iCal existe-t-il ? |

---

## 3. Les quatre questions que le site n'a pas, et ce qu'elles exigent

Elles manquent parce que le produit ne sait pas encore y répondre. Les écrire
avant que la fonction existe reproduirait exactement l'erreur de la section 1.

### 3.1 « Qui voit les codes d'accès des chalets ? »

La question la plus prévisible d'une gérante, et le site n'en dit pas un mot.
La démonstration publique affiche pourtant « Boîte à clés côté garage,
code 447 ».

**Exigence :** la fenêtre d'accès et le journal des révélations de
`codes-acces-pwa.md`. La réponse qu'on pourra alors écrire : une équipière
voit le code d'un bien seulement si elle a une mission dessus, seulement ce
jour-là, et chaque consultation laisse une trace.

### 3.2 « Que se passe-t-il quand une équipière part ? »

**Exigence :** la révocation individuelle, et le rapport de départ de la
section 5 de `codes-acces-pwa.md`. La réponse : son accès tombe au prochain
appel, personne d'autre n'est dérangé, et vous obtenez la liste exacte des
codes qu'elle a vus.

C'est la seule des quatre qui soit un argument de vente autant qu'une
garantie. Aucun concurrent ne sait répondre à « qu'est-ce qu'elle a vu ? ».

### 3.3 « Puis-je essayer avant de m'engager ? »

Celle-ci est **répondable aujourd'hui** : la démonstration publique est
intégrée à la page d'accueil, dans un cadre de téléphone, et la réponse
`engagement` dit déjà que la semaine qui suit la journée sur site est le test.
Il manque seulement la question.

### 3.4 « Signez-vous un contrat de sous-traitance RGPD ? »

Ce qu'un acheteur professionnel demande avant de signer. Le contrat n'existe
pas — voir la section 8 de `codes-acces-pwa.md`.

**Exigence :** le rédiger. Il nomme l'objet, les catégories de données dont
les codes d'accès, les sous-traitants ultérieurs, les mesures de sécurité, le
sort des données en fin de contrat.

---

## 4. L'ordre

1. **L'étape 3 d'`identite-pwa.md`.** Elle débloque 1.1, 1.2, 1.4, et elle est
   le prérequis de tout le reste.
2. **La fenêtre d'accès et le journal** de `codes-acces-pwa.md`. Ils ouvrent
   3.1 et 3.2.
3. **L'export et l'extraction** — 1.3. Un droit, avec un délai légal.
4. **Le contrat de sous-traitance** — 3.4. Une journée, et il oblige à écrire
   les mesures de sécurité, donc à faire les trois points au-dessus.

---

## 5. Ce que le site corrige en attendant

Trois retouches qui ne coûtent rien et suppriment la dette la plus exposée.

- **`saisonniers`** : retirer la promesse d'attribution par personne, ou la
  formuler au futur explicite. Aujourd'hui elle est au présent.
- **`hebergement`** : ne pas écrire « en Europe » avant d'avoir vérifié la
  région du Workspace.
- **`engagement`** : la question pose le mot « résiliation », la réponse ne
  dit jamais comment on arrête. Ajouter la phrase manquante.

Ces trois retouches sont de la copie : elles attendent la validation du
fondateur, ce document ne les écrit pas.
