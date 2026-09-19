# L'application vit chez la conciergerie

Décision d'architecture prise le 19 septembre 2026 par le fondateur.

**Le script Apps Script et la feuille Google vivent dans le Workspace de la
conciergerie, posés là le jour de l'implantation.** Pas chez l'éditeur, pas
dans un espace partagé entre clientes.

Ce document existe parce que cette décision contredit `identite-pwa.md`, qui
est écrit pour l'architecture inverse. Ne pas commencer à coder avant de
l'avoir lu.

---

## 1. Ce qui l'a décidée

La page d'accueil affirme, au présent : « c'est écrit dans le contrat dès la
signature : votre configuration, vos données et l'outil qui les fait tourner
vous restent ». Elle répond à la première objection d'un dirigeant qui engage
2 000 € puis 300 € par mois auprès d'un indépendant seul.

Une clause qui dit « si je m'arrête, l'outil vous revient » suppose un
transfert. Or **le transfert doit être déclenché par quelqu'un qui, par
hypothèse, n'est plus là.** Une clause dont l'exécution dépend de la personne
dont on redoute l'absence ne vaut rien.

En posant l'application chez la cliente dès le premier jour, la clause cesse
d'être une promesse et devient **un constat** : il n'y a rien à transférer,
c'est déjà chez elle. C'est la seule version qui tient.

---

## 2. Ce que ça change dans `identite-pwa.md`

Ce document est écrit pour **une installation servant plusieurs
conciergeries** : une colonne `conciergerie` sert de clé de cloisonnement, et
sa règle 5 exige que « toute lecture et toute écriture soient filtrées par la
conciergerie de la session, aucune requête ne peut nommer une autre
conciergerie ».

**Cette règle devient sans objet.** Il n'y a plus qu'une conciergerie par
installation : une requête ne peut pas nommer une autre conciergerie, parce
qu'aucune autre n'existe dans cette feuille.

C'est le gain le plus important, et il faut mesurer sa nature : **la règle la
plus difficile à tenir dans du code devient une propriété physique.** Une
erreur de filtrage, une jointure oubliée, un point d'entrée ajouté à la hâte
un samedi — aucun de ces accidents ne peut plus faire fuiter les données d'une
cliente vers une autre. Il n'y a pas de « autre ».

**À faire dans `identite-pwa.md` :**

- La colonne `conciergerie` reste dans `Personnes` et `Acces`, mais comme
  libellé, plus comme clé de sécurité. Ne pas la supprimer — elle sert aux
  exports et aux rapports.
- La règle 5 se réécrit : elle ne décrit plus un filtre, elle constate une
  frontière.
- Les étapes 1 à 4 de la migration **ne changent pas.** L'identité par
  personne, le serveur qui décide, le double contrôle refusé côté serveur :
  tout cela reste nécessaire. Le cloisonnement entre clientes disparaît ;
  le cloisonnement **entre personnes d'une même conciergerie** reste entier,
  et c'est lui qui porte le vrai risque — l'équipière qui part en fin de
  saison.

⚠️ **Ne pas lire cette décision comme un relâchement.** Elle supprime un
risque, elle n'en résout aucun autre. Les codes d'accès d'une conciergerie
restent lisibles par ses propres équipières tant que la fenêtre d'accès de
`codes-acces-pwa.md` n'existe pas.

---

## 3. Ce que ça change dans `codes-acces-pwa.md`

**Le risque n° 3 — « la feuille elle-même », un partage de trop, un dossier
Drive mal réglé — change de main.** Le document Drive appartient désormais à
la conciergerie ; c'est son administrateur Workspace qui en contrôle le
partage, pas l'éditeur.

C'est une meilleure répartition : celui qui subit le préjudice d'une fuite est
celui qui tient la porte. Mais **ça ne le réduit pas**, et une conciergerie
qui partage sa feuille à tout son personnel reproduira exactement le problème.
La journée d'implantation doit donc couvrir le réglage de partage du document,
au même titre que les rôles.

**Le risque n° 4 — « l'éditeur » — diminue réellement.** Choucas ne détient
plus les codes de maisons qui ne lui appartiennent pas : il garde un accès de
support, révocable par la cliente, et c'est tout. Voir §6.

Le poivre de `PropertiesService` devient propre à chaque installation. Une
fuite chez une cliente n'expose rien chez les autres — ce qui n'était pas vrai
avec un poivre unique.

---

## 4. Ce que ça change pour le RGPD, et c'est important

`faq.questions.hebergement` répond aujourd'hui : « Chez Google, dans le cadre
de Google Workspace. Google est établi hors de l'Union européenne ; les
transferts sont couverts par les clauses contractuelles types. »

Sous cette décision, **les données ne quittent jamais l'espace Google de la
conciergerie.** Ce n'est plus l'éditeur qui choisit où elles vivent : c'est la
cliente, dans son propre Workspace, avec ses propres réglages de région et son
propre contrat Google.

Trois conséquences, et la troisième demande un juriste :

1. **La réponse de la FAQ devient inexacte** et doit être réécrite. Elle est
   actuellement la plus faible du site : posée à nu, « hors de l'Union
   européenne » est l'argument qu'un concurrent utilisera devant les
   propriétaires. Elle peut devenir « vos données restent dans votre propre
   espace Google Workspace » — ce qui est à la fois plus vrai et plus fort.
2. **La région des données cesse d'être une dette de l'éditeur.**
   `promesses-du-site.md` §2 listait « vérifier la région du Workspace » comme
   le seul point qui ne peut pas se promettre au futur. Il disparaît : c'est
   le réglage de la cliente.
3. ⚠️ **Le rôle de Choucas change peut-être de nature.** Si les données ne
   transitent jamais par une infrastructure de l'éditeur, est-il encore
   sous-traitant au sens de l'article 28 ? Il exécute du code sur les données
   de la cliente et y accède pour le support — donc probablement oui, mais
   **le contrat de `codes-acces-pwa.md` §8 doit être écrit en connaissance de
   cette architecture**, pas de l'ancienne. À faire trancher.

---

## 5. Ce que ça coûte, et il faut le dire

**Le déploiement devient N déploiements.** Un correctif ne se pousse plus une
fois : il se pousse chez chaque cliente. `clasp` et l'API Apps Script
l'automatisent, mais cela suppose que chaque cliente ait accordé à l'éditeur
un accès au projet — ce qui tempère le « c'est chez vous ».

**Les versions divergent.** Une cliente en v12, une autre en v9. Le support
commence alors par « vous êtes sur quelle version ? », ce qui est le début de
la dette de toute installation par client. Il faut donc, dès la première
installation :

- une version écrite quelque part dans la feuille, lisible sans ouvrir le code ;
- un journal des déploiements, par cliente.

Ce n'est pas un raffinement à ajouter plus tard. À deux clientes on s'en passe ;
à cinq on ne sait déjà plus.

**Trois clientes, c'est trois fois la même migration.** L'étape 3
d'`identite-pwa.md` doit donc être terminée **avant** la deuxième installation,
pas après. Migrer une installation vivante est un travail ; en migrer cinq est
un projet.

---

## 6. Deux prérequis à nommer avant de vendre

**La cliente a besoin d'un compte Google.** Un seul, et il porte le document.

C'est beaucoup plus léger qu'il n'y paraît, et il faut le savoir avant de
croire qu'on perd un client parce qu'il est sur Microsoft : **`identite-pwa.md`
n'utilise pas les comptes Google pour identifier les personnes.** Une personne
se connecte avec un code saisi dans l'application, échangé contre un jeton de
session de douze heures. Aucune équipière n'a besoin d'un compte Google, et le
manager non plus.

Ce qui a besoin d'un compte Google, c'est **le contenant** : la feuille et le
script. Un seul, donc, pour toute la conciergerie.

### Une conciergerie sur Microsoft

Elle garde Microsoft pour tout le reste — messagerie, bureautique, fichiers —
et ouvre **un compte Google qui ne sert qu'à porter le document**. Ses équipes
ne le voient jamais : elles travaillent dans l'application.

Deux conditions, et la première est celle qui compte :

1. **Le compte est ouvert au nom de la conciergerie, pas au nôtre.** C'est lui
   qui rend vraie la clause de continuité. Un compte créé par l'éditeur avec sa
   propre adresse de récupération annule tout ce que cette architecture devait
   garantir : l'application serait de nouveau chez lui.
2. **Workspace plutôt qu'une adresse Gmail gratuite.** Une adresse personnelle
   fonctionne techniquement, mais elle n'a ni console d'administration, ni
   journal d'audit, ni transfert de propriété, ni 2FA imposable — et elle
   appartient, de fait, à qui connaît le mot de passe. Pour un document qui
   porte les codes d'accès de maisons, c'est le mauvais contenant.

⚠️ **La région des données n'est pas disponible sur toutes les formules
Workspace.** `faq.questions.hebergement` affirme désormais que la région est le
réglage de la cliente : c'est vrai là où l'option existe. **À vérifier sur la
formule retenue avant de le répéter en rendez-vous**, et à corriger dans la
réponse si l'option manque sur les formules d'entrée de gamme.

### Le point de friction réel, et il n'est pas le compte

**Le rapport propriétaire part d'une adresse.** Si le script envoie le courriel
lui-même, il part de l'adresse Google — pas du domaine de la conciergerie. Pour
une maison sur Microsoft, un rapport qui arrive d'une adresse inconnue chez un
propriétaire abîme précisément la confiance qu'il devait construire.

Le site s'en sort déjà, et sans le savoir : `faq.questions.envois-automatiques`
promet que « les communications externes passent par une relecture et un geste
humain ». Le rapport est donc **préparé** dans Choucas puis envoyé par la
personne, depuis sa propre messagerie. La friction disparaît — à condition de
ne jamais transformer cette relecture en envoi automatique « pour gagner du
temps ». Ce serait, au passage, casser une promesse publiée.

**À vérifier à la prise de rendez-vous, pas le matin de l'implantation.**

**L'éditeur garde un accès de support, et il faut le dire.** « Les données sont
chez vous » et « Mathieu peut les voir pour vous dépanner » sont vraies toutes
les deux. Ne pas énoncer la seconde transformerait la première en mensonge le
jour où une cliente s'en aperçoit.

Cet accès doit être :

- accordé par la cliente, sur son document, dans son Workspace ;
- **révocable par elle seule, sans passer par l'éditeur** ;
- visible — le journal Drive de la cliente le montre déjà, mais le contrat
  doit le nommer.

---

## 7. Ce qui ne change pas

**La démonstration publique** reste une installation de l'éditeur, avec des
données fictives. C'est la seule qui lui appartienne.

**Le site vitrine** n'est pas concerné : il ne touche aucune donnée de
production.

**Toutes les mesures de sécurité interne.** L'identité par personne, la
fenêtre d'accès, le journal des révélations, le double contrôle refusé côté
serveur, l'engagement de confidentialité : chaque installation en a besoin
pour elle-même. Le cloisonnement physique protège une cliente d'une autre ;
il ne protège personne à l'intérieur d'une cliente.

---

## 8. L'ordre

1. **Trancher le statut RGPD** (§4.3) avant d'écrire le contrat. Une journée
   de juriste, et elle conditionne le reste.
2. **Réécrire `faq.questions.hebergement`** — c'est de la copie, elle attend le
   fondateur, et ce document ne l'écrit pas.
3. **Terminer l'étape 3 d'`identite-pwa.md`** avant la deuxième installation.
4. **Poser le versionnement et le journal de déploiement** à la première.
