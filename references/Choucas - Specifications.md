# Choucas — Spécifications produit v2

Application mobile de conciergerie de chalets haut de gamme (Alpes françaises).
Deux rôles : **manager** (Mathieu B.) et **intervenant** (Léa V., Karim B., Sofia M., Thomas R.).

Document de référence pour l'équipe de développement. Toutes les maquettes sont des pages HTML autonomes du projet : ouvrez-les dans un navigateur, les interactions sont réelles (arbitrage, cochage, photo caméra, signalements, clôture, calendrier, renfort, escalade urgente).

**Point d'entrée de démonstration :** `Choucas App.dc.html` — un seul téléphone, sélecteur de rôle Mathieu / Léa, tout est relié.

---

## 1. Le problème

Un samedi de rotation : 2 départs, 3 arrivées, 4 missions en parallèle, un brief client de 21 exigences. Aujourd'hui tout transite par WhatsApp, des appels et la mémoire du manager. Une exigence oubliée = un client mécontent et un propriétaire qui ne voit pas le travail fourni.

## 2. La boucle produit

| # | Étape | Acteur | Sortie |
|---|-------|--------|--------|
| 1 | Saisie du brief | Manager | Sources brutes horodatées |
| 2 | Décomposition | Système | Lignes structurées + conflits détectés |
| 3 | Validation | Manager | Brief validé |
| 4 | Relecture & envois | Manager | Messages aux prestataires |
| 5 | Missions | Intervenant | Tâches cochées, photos, signalements |
| 6 | Clôture & contrôle | Intervenant → contrôleur | Mission contrôlée |
| 7 | Rapports | Système | Emails propriétaire (jour, incident, hebdo) |

Chaque étape produit l'entrée de la suivante. Rien ne repose sur la mémoire.

Deux règles transverses :
- **Double contrôle** : personne ne contrôle une mission qu'il a lui-même exécutée. Le manager est le contrôleur par défaut ; quand il a exécuté la mission, le contrôle revient à quelqu'un d'autre. Le système ne propose jamais ce cas à l'écran. Un état décrit un logement ou une mission, jamais une relation entre deux personnes.
- **L'automatique va vers l'interne, jamais vers l'externe** : tout message sortant (propriétaire, client, prestataire) est déclenché par un humain qui a vu le contenu. Les notifications internes peuvent être automatiques.

Vocabulaire des états : `À CONTRÔLER` (file de travail du contrôleur) · `En attente de contrôle` (état de la mission côté intervenant) · `CONTRÔLÉ` (mission) · `PRÊT` (logement, après contrôle) · `BLOQUÉ` (marqueur superposé, orthogonal au statut) · `SANS NOUVELLES` (hors réseau, traitement neutre).

---

## 3. Système de design

**Typographie** : Schibsted Grotesk (400/500/600/700), famille unique.

**Charte Choucas** — la palette de marque est la source de vérité :

| Nom | Hex | Rôle |
|---|---|---|
| Neige | `#F4F2EC` | Fond principal |
| Glacier | `#FCFBF7` | Cartes et surfaces |
| Schiste | `#151816` | Fond sombre / texte |
| Graphite | `#222622` | Surfaces sombres |
| Sapin | `#244238` | Marque / CTA |
| Cuivre | `#B56F46` | Accent éditorial |
| Crépuscule | `#466170` | Information |
| Mousse | `#3D7358` | Preuve positive |
| Ambre | `#C18B38` | Attention |
| Grenat | `#A64B3F` | Erreur / alerte |

Ratio web : 60 % Neige/Glacier · 25 % Schiste/Graphite · 10 % Sapin · 5 % Cuivre et couleurs d'état. **Le Cuivre signe les CTA éditoriaux ; il ne signifie jamais « erreur ».**

**Tokens implémentés** (variables CSS, un thème par jeu de valeurs) :

| Token | Clair (défaut) | Sombre |
|---|---|---|
| `--bg` | `#F4F2EC` | `#212220` |
| `--card` / `--sheet` | `#FCFBF7` | `#2A2C29` |
| `--ink` | `#151816` | `#F4F2EC` |
| `--mut` | `#6E756F` | `#9B9D98` |
| `--line` | `#E3E0D6` | `#3A3C38` |
| `--track` | `#E8E5DB` | `#343632` |
| `--acc` | `#244238` | `#6F9789` |
| `--accInk` | `#FCFBF7` | `#151816` |
| `--accSoft` | `#E5EBE7` | `#2E3733` |
| `--iconbg` | `#244238` | `#3A4A45` |
| `--ok` | `#3D7358` | `#74A78D` |
| `--warnInk` | `#8A5E20` | `#DBAE63` |
| `--warnBg` | `#FAF2E3` | `#3A3120` |
| `--warnLine` | `#E2C692` | `#6E5527` |
| `--critInk` | `#A64B3F` | `#D9877D` |
| `--critBg` | `#FBEEEB` | `#3A2523` |
| `--critLine` | `#DFAEA6` | `#78423B` |
| `--clientBg` | `#EEF1F2` | `#2B3134` |
| `--cui` | `#A9663E` | `#C98A61` |

Notes d'implémentation :
- **Thème clair par défaut**, sélecteur clair/sombre dans les Réglages des deux rôles (pas de mode « automatique »).
- En mode sombre, les gris sont volontairement **neutres** (pas de teinte verte) ; le vert ne subsiste que là où il porte du sens (Mousse = preuve positive).
- `--clientBg` teinte les tâches issues du brief client (Crépuscule, information).
- Les transitions de couleur doivent porter sur `background-color`, jamais sur le raccourci `background` : une valeur `var()` dans un raccourci n'est pas interpolable et épingle l'ancienne couleur.

**Formes** : rayon 13 px (boutons, champs), 16 px (cartes), 22 px (feuilles), 99 px (pastilles).

**Règles d'interaction**
- Cible tactile minimum 44 px.
- Une seule action primaire par écran.
- Retour toujours en haut à gauche, libellé de la destination (« ‹ Missions »).
- Avatar profil/réglages en haut à droite, **sur tous les écrans de premier niveau des deux rôles**.
- Actions critiques (signalements) sticky flottantes, jamais dans le scroll.
- Toute action déclenche un retour visible : toast, bandeau, changement d'état.
- Codes d'accès masqués par défaut, révélés à la demande.
- Feuilles modales : glissement bas → haut, fond assombri, poignée.

**Navigation**
- Manager : 4 onglets — Aujourd'hui · Missions · Biens · Équipe. En tablette (≥ 700 px) la tab bar devient un rail latéral gauche.
- Intervenant : 3 onglets — Accueil · Biens · Équipe.

---

## 4. Écrans — rôle MANAGER

### 4.1 Saisie du brief (`Choucas Brief Saisie.dc.html`)

Quatre sources cumulables, car on ne sait jamais comment le brief arrive :
- **Dicter l'appel** — enregistrement + transcription, bouton ⏹ pour arrêter
- **Coller un texte** — WhatsApp, email
- **Email transféré** — adresse dédiée par bien
- **Photo d'une note** — OCR

Règles :
- Chaque source est horodatée, conservée intacte, retirable individuellement.
- Le texte source original n'est **jamais** écrasé (traçabilité).
- « Le client a rappelé » = ajouter une source et relancer la décomposition.
- Un seul CTA : « Décomposer en brief » → étapes visibles → résultat « 21 lignes · 1 conflit » → CTA « Ouvrir la validation du brief » qui enchaîne sur 4.2.

### 4.2 Validation du brief (`Choucas App v2.dc.html`, écran 1)

Principe CX : **le manager n'arbitre que ce que la machine ne peut pas trancher.**

- En-tête : retour « ‹ Le Belvédère », avatar, « Valider le brief », pastille du nombre de décisions, barre de progression (20/21 lignes).
- Section **À arbitrer** : une carte à la fois, uniquement les **vrais conflits** (ex. « Personne dans la maison avant 9 h » vs « Pancakes chaque matin »).
  - Trois points de progression dans l'en-tête de section (fait ✓ / en cours / à venir).
  - Options en boutons radio, chacune annonçant sa conséquence (« → tâche chez Léa, chaque soir 21 h »).
  - Séquence au tap : coche (0,5 s) → **la carte bascule en confirmation** (grand ✓, « Arbitré », conséquence en toutes lettres, 1 s) → la décision suivante glisse en place + bandeau vert.
- Les **attributions sont pré-résolues** par le système (monitrice → ESF, fleurs → prestataire) et rangées dans les lignes prêtes ; corrigeables en relecture. Il n'existe pas d'écran « à attribuer ».
- Section **Déjà prêt** : carte « 20 lignes prêtes » avec répartition par domaine (Cuisine · 6, Chambres & linge · 4, Logistique · 3, Bien-être · 2, Prestataires · 5), dépliable.
- Carte **Texte source** : extrait visible + « Tout lire ».
- CTA désactivé tant qu'il reste une décision, avec la raison affichée dessous.

### 4.3 Relecture & envois (`Choucas App v2.dc.html`, écran 2)

Traité **comme la checklist de mission** — même vocabulaire visuel :
- Carte unique, compteur « 0 / 7 envoyés », rangées séparées d'un filet.
- **Case ronde à cocher** par destinataire : cocher = envoyé (✓ Mousse, libellé barré) ; décocher pour revenir.
- Chaque rangée porte son origine : canal, échéance, et « N lignes du brief › ».
- Détail d'un message : bloc **« D'où vient ce message »** listant les lignes du brief concernées + « Voir dans le brief › » qui ramène à l'écran de validation ; message éditable ; états Prêt · Modifié · Reporté · Envoyé ; actions Envoyer · Reporter (exclu de l'envoi groupé) · Rétablir.
- CTA global « Tout envoyer · N destinataires ».
- Destinataires du scénario : Karim (chauffeur), Thomas (chef), Léa (équipière), Maison Blanche (blanchisserie), ESF Courchevel, La Folie Douce, M. Arnaud (propriétaire).

### 4.4 Aujourd'hui (`Choucas Manager.dc.html`, onglet 1)

- En-tête : **date cliquable** → calendrier mensuel (jours avec missions actifs) ; « ＋ nouveau brief » ; cloche de notifications avec badge ; avatar profil/réglages.
- Bandeau prochaine arrivée avec **compte à rebours dynamique**.
- Section Alertes : cartes actionnables (traiter / appeler).
- Raccourci « 3 missions aujourd'hui › » vers l'onglet Missions.
- Rotation du jour : frise horaire (départs, arrivées, missions).
- Sur un autre jour que celui-ci : seule la planification s'affiche (pas d'alertes ni de compte à rebours).

### 4.5 Missions (onglet 2)

Index permanent : **En cours** / **À contrôler**. Chaque carte : bien, type, intervenant, statut, avancement.

**Détail mission en cours** — Le Belvédère
- Avancement, dernières actions, photos reçues (3 emplacements d'image, légende horodatée sous chaque tuile).
- « 👁 Voir la mission en direct » : ouvre la vue exacte de l'intervenant, bandeau « ● En direct · vue de Léa V. » + ✕ Quitter ; le ‹ de l'en-tête ramène au détail.

**Détail mission en retard** — La Roseraie
- Bandeau risque : arrivée client 17 h 30, fin estimée 18 h 10.
- Avancement par zone (chambres faites, salles de bain 2/3, cuisine en cours…).
- Plan de rattrapage : « Envoyer Karim en renfort · dispo à 15 h » → fin estimée recalculée à 17 h 05.
- Actions : écrire / appeler l'intervenant, SMS de courtoisie au client.

**À CONTRÔLER** — Les Troncs
- 12/12 tâches, 4 photos, note de l'intervenant verbatim.
- CTA « Voir la mission de Karim › » : feuille listant les 12 tâches cochées, groupées par zone (Chaufferie, Extérieur, Intérieur & sécurité), tâches photographiées marquées 📷, point d'attention en Ambre.
- Deux actes séparés : « Marquer comme contrôlé » (interne — le contrôleur n'est jamais l'exécutant) puis « Relire et envoyer au propriétaire » (externe, feuille de relecture « Rapport prêt · à relire avant envoi » → « Envoyer au propriétaire »).

### 4.6 Alerte urgente reçue

Écran plein Grenat par-dessus tout, impossible à manquer :
- Badge 🚨 pulsé, heure de réception, « non prise en charge ». Bouton « Réduire » → bandeau persistant en tête de tous les écrans manager tant que l'alerte n'est pas prise en charge.
- Message verbatim de l'intervenant + photo.
- Compte à rebours d'arrivée client + ce que l'intervenant demande.
- Trois actions : « Rappeler Léa maintenant », « Appeler le plombier d'astreinte », « Appeler M. Arnaud · décision ». Chaque action s'inscrit dans un journal horodaté.
- **Aucun email au propriétaire pendant l'incident** — mention affichée. Il reçoit le rapport d'incident dès l'intervention terminée.
- « Marquer comme prise en charge » ferme l'alerte et ouvre le suivi sur la mission.

### 4.7 Biens (onglet 3)

Liste des 4 chalets avec statut (occupé / rotation / libre). Les 4 fiches sont complètes :
- Statut d'occupation, caractéristiques en chips.
- **Brief de séjour actif** (si occupé) avec lien vers le brief validé.
- Équipe de la semaine.
- **Accès** : codes portail / alarme / boîte à clés **masqués par défaut**, bouton « Afficher ».
- Équipements & entretien avec états datés.
- Consignes du propriétaire.
- **Historique récent** : la ligne de la mission en cours est cliquable et ouvre son détail ; les lignes terminées sont inertes.
- Photos, contact propriétaire.

### 4.8 Équipe (onglet 4)

Fiches personnes : avatar + pastille de statut, rôle, mission en cours, prochaine échéance, boutons message/appel.

### 4.9 Réglages (avatar MB)

- Profil : Mathieu B., responsable d'exploitation, 4 chalets · 4 personnes.
- **Astreinte** en tête (seul réglage à conséquence immédiate) : interrupteur « Je suis d'astreinte » qui indique qui reçoit les alertes quand il est off (« Camille D. reçoit les alertes à votre place ») ; deuxième responsable configurable — le même contact que la chaîne d'escalade utilise.
- **Notifications** : 5 interrupteurs (Alertes urgentes **verrouillé et grisé** — le taper explique pourquoi ; Missions à contrôler ; Manques et problèmes ; Retards détectés ; Résumé du matin).
- **Affichage** : thème Sombre / Clair.
- Aide et contact, conditions, déconnexion, version.

---

## 5. Écrans — rôle INTERVENANT

### 5.1 Ma journée (`Choucas Journee.dc.html`, onglet Accueil)

Répond en 2 secondes à : quoi maintenant, quoi ensuite, où, qu'est-ce qui est urgent.
- En-tête : salutation, date cliquable (calendrier), avatar LV.
- Résumé : 4 missions · 3 chalets · 1 action urgente.
- **Maintenant** : mission en cours, avancement, un seul CTA « Reprendre la mission ».
- **À suivre** : frise horaire, chaque mission avec heure, chalet, nombre de tâches, compte à rebours sur la mission critique.
- **Terminé** : replié par défaut.

### 5.2 Mes chalets (onglet Biens)

Ses 3 biens de la semaine, avec la prochaine intervention prévue. Par chalet : codes d'accès masqués, dépliables (portail, alarme, boîte à clés, wifi) + consigne du propriétaire. C'est ce qu'on cherche devant un portail fermé.

### 5.3 Qui est là (onglet Équipe)

Le responsable et les collègues du jour, pastille de statut, bouton d'appel. Un collègue en retard est visible — l'intervenante comprend pourquoi son responsable est occupé.

### 5.4 Mission (`Choucas Mission.dc.html`)

- En-tête : retour, chalet, adresse cliquable, type de mission, intervenant, statut.
- **Compte à rebours d'arrivée client**, mis en évidence, dynamique.
- Bandeau de rappel ferme en Ambre (ex. « Réception blanchisserie à 14 h 30 · présence obligatoire »).
- **Segmenté Tout · Client · Ménage** avec compteurs — le brief client et les tâches de ménage cohabitent dans une seule liste.
- Tâches groupées par pièce, compteur de restantes par groupe.
- **Quand toutes les tâches d'un groupe sont faites, le groupe disparaît** et bascule dans le récapitulatif en bas.
- Tâche issue du brief client : fond `--clientBg` + bouton « Pourquoi ? » qui déplie **la citation exacte du client** et la justification — c'est ainsi que le brief ne se perd pas.
- Tâches avec **photo obligatoire** : badge Ambre, capture par **appareil photo en direct** (`getUserMedia`, pas d'upload) ; **non bloquant** si la caméra est indisponible ou refusée (message explicite, la tâche reste validable).
- Boutons **Signaler un manque** / **Signaler un problème** : sticky flottants, toujours accessibles.
- **Toutes les tâches faites** → modale de fin de mission → écran de clôture (récap chiffré, note libre) → confirmation « En attente de contrôle ».

### 5.5 Signalements

**Signaler un manque** : texte + photo facultative → crée un réassort côté manager.

**Signaler un problème** : trois niveaux de gravité.
- *Mineur* — à noter pour le propriétaire, sans urgence.
- *Bloquant* — à traiter avant l'arrivée du client.
- *🚨 Urgent* — sinistre, panne, dégât d'eau, sécurité. Sélectionner ce niveau modifie le formulaire :
  - bandeau Grenat annonçant la chaîne d'escalade,
  - question supplémentaire « Que faut-il faire tout de suite ? » (artisan sur place / décision du propriétaire / renfort d'équipe),
  - CTA « 🚨 Déclencher l'alerte urgente ».
- Après envoi d'une alerte urgente, l'intervenant voit **l'état réel** : Alerte transmise → Vue par le responsable → Prise en charge. Pas de sonnerie simulée. Composition d'appel assistée (responsable, second responsable en un tap) avec journal horodaté. Il n'a plus à relancer : c'est ce qui le libère.

### 5.6 Réglages (avatar LV)

Contenu volontairement différent de celui du manager — ce qui compte pour une équipière, c'est son temps et sa joignabilité.
- Profil : Léa V., équipière, 16 missions cette semaine.
- **Mes disponibilités** en tête : 7 jours à toucher pour se retirer, avec l'avertissement « Mathieu voit vos retraits immédiatement » ; bouton « Signaler une indisponibilité ».
- **Notifications** : nouvelle mission, changement d'horaire, message du responsable, rappel 1 h avant l'arrivée client. Note : un nouveau brief est **toujours** notifié, il change ses tâches.
- **Sur le terrain** : mode hors réseau (tâches et photos partent quand le réseau revient — réalité en altitude) ; « Mon responsable » joignable en un tap.
- **Affichage** : thème Sombre / Clair.
- Aide et contact, conditions, déconnexion, version.

---

## 6. Notifications & rapports

### 6.1 Escalade standard (`Choucas Notifications.dc.html`)

Push in-app immédiate → email dans la minute → SMS de repli à +15 min si l'email n'est pas ouvert **et** que la mission précède une arrivée le jour même. Le SMS tient en 3 lignes : fait, chiffres, lien d'action court.

- **Push manager** : bandeau en tête d'écran, tap → ouvre directement l'élément concerné.
- **Email transactionnel « Clôture de mission »** : version desktop 600 px + rendu mobile 375 px. Badge d'état, chiffres clés, note de l'intervenant verbatim, photos, un seul CTA identique à celui de l'app.
- **SMS de repli** : message court + lien.

### 6.2 Escalade urgente — chaîne séparée, jamais silencieuse

**Push standard** immédiate au responsable + bandeau persistant en tête de ses écrans → deuxième responsable à +3 min → SMS à toute l'astreinte à +6 min. **Aucun email dans cette chaîne : trop lent.**

- Push standard : badge permanent tant qu'elle n'est pas ouverte. Deux actions dans la notification : « Rappeler » et « Ouvrir ».
- SMS astreinte : cinq lignes — quoi, où, ce qui est déjà fait, qui appeler, le lien.
- L'intervenant voit l'état réel (Alerte transmise → Vue → Prise en charge) et cesse de relancer.
- Pas de push critique (impossible en PWA) ni d'appel automatique : reportés en v2 — service de téléphonie tiers et minuterie fine à chiffrer.

### 6.3 Rapport d'intervention (`Choucas Rapport Proprietaire.dc.html`)

Envoyé au propriétaire le jour même, à la validation de la clôture : ce qui a été fait, point d'attention (avec CTA « Demander le devis »), photos, prochain passage.

### 6.4 Rapport d'incident (`Choucas Rapport Incident.dc.html`)

Préparé dès l'intervention terminée, **en attente d'envoi** côté manager (« Rapport prêt · à relire avant envoi ») — l'envoi est un geste explicite, jamais pendant l'incident :
- Badge « ✓ Incident résolu · chalet opérationnel ».
- Accroche qui rassure d'abord (« réparé avant l'arrivée de vos hôtes »).
- 3 chiffres : durée de résolution, impact sur le séjour, décisions à prendre.
- Chronologie horodatée de l'incident.
- Photos avant / après.
- La décision à prendre + CTA « Demander le devis » / « En reparler plus tard ».
- Coûts engagés.

### 6.5 Rapport hebdomadaire (`Choucas Rapport Hebdo.dc.html`)

Préparé chaque dimanche à 18 h et notifié au manager — l'envoi est un geste. 3 chiffres clés, fil de la semaine jour par jour, points d'attention repris, état du chalet, semaine à venir.

---

## 7. Modèle de données (indicatif)

```
Bien          id, nom, adresse, coordonnées, caractéristiques[],
              accès{portail, alarme, clés, wifi}, consignes,
              propriétaire_id, équipements[{libellé, état, date}]

Brief         id, bien_id, séjour{début, fin, occupants},
              sources[{type, contenu, horodatage}], lignes[],
              statut(brouillon|à_valider|validé), validé_par, validé_le

Ligne         id, brief_id, libellé, citation_source, justification,
              domaine, échéance, destinataire, ligne_pièce,
              statut(prête|conflit|écartée), pré_attribuée(bool)

Message       id, brief_id, destinataire_id, canal(sms|mail|mission|tel),
              corps, échéance_envoi, lignes_ids[],
              statut(prêt|modifié|reporté|envoyé), envoyé_le

Mission       id, bien_id, type(mise_en_place|ménage|maintenance|conciergerie),
              intervenant_id, date, heure_début, arrivée_client,
              tâches[], statut, avancement, renfort_id?

Tâche         id, mission_id, libellé, groupe(pièce), origine(client|ménage),
              ligne_id?, photo_requise(bool), photo_url?, faite(bool), faite_le

Signalement   id, mission_id, tâche_id?, type(manque|problème),
              gravité(mineur|bloquant|urgent), besoin_immédiat?, texte,
              photo_url?, créé_le, escalade[{cible, canal, envoyé_le, accusé_le}],
              pris_en_charge_par?, pris_en_charge_le?, actions[{libellé, détail, at}]

Clôture       id, mission_id, tâches_faites, photos_count, note, clôturé_le,
              contrôlé_par?, contrôlé_le?, rapport_envoyé_le?
              — contrainte : contrôlé_par ≠ mission.intervenant_id

Disponibilité intervenant_id, jour, disponible(bool), motif?
```

---

## 8. Contraintes techniques relevées en maquette

- **Photo en direct** via `getUserMedia` — jamais de sélecteur de fichier. La caméra peut échouer (permission, matériel) : le flux doit rester non bloquant.
- **Hors réseau** : cochage de tâches, photos et signalements doivent être mis en file locale et synchronisés au retour du réseau. Exception : une **alerte urgente** doit tenter tous les canaux disponibles immédiatement (data, puis SMS natif).
- **Comptes à rebours** : recalculés à la seconde, jamais figés côté serveur.
- **Codes d'accès** : masqués par défaut, révélation journalisée côté serveur (qui a vu quoi, quand).
- Les horodatages affichés dans un même écran doivent tous provenir du scénario/serveur — jamais de l'horloge du poste.

---

## 9. Hors périmètre v1 (backlog)

- **Données de santé / allergies** — bandeau permanent en tête des missions cuisine, rappel systématique. Écarté de la v1 : relève surtout du chef. À traiter en v2.
- **Fils de discussion internes** — écartés : l'équipe garde ses canaux existants. Les boutons message ouvrent un toast.
- **Push critique + appel automatique au responsable** — reportés, non abandonnés : la push critique est impossible en PWA (entitlement natif), l'appel automatique nécessite un service de téléphonie tiers et une minuterie fine — à chiffrer.
- **Annuler une tâche cochée par erreur** — aujourd'hui irréversible.
- **Planning hebdomadaire par personne** dans l'onglet Équipe du manager.
- **Trajets et météo entre chalets** dans Ma journée.
- **Accent Cuivre** — token `--cui` disponible, pas encore employé. Emplacement naturel : les liens « Pourquoi ? » du brief.
- Fiche bien pour l'intervenant en écran plein (aujourd'hui carte dépliable).

---

## 10. Fichiers de référence

| Fichier | Contenu |
|---------|---------|
| `Choucas App.dc.html` | **Démo assemblée** — un téléphone, sélecteur de rôle |
| `Choucas - Planche.dc.html` | Tous les écrans côte à côte, interactifs |
| `Choucas - Présentation.dc.html` | Deck de présentation (8 slides) |
| `Choucas Brief Saisie.dc.html` | Saisie multi-sources |
| `Choucas App v2.dc.html` | Validation + relecture/envois |
| `Choucas Manager.dc.html` | App manager complète (4 onglets, piles, alerte urgente, réglages) |
| `Choucas Journee.dc.html` | App intervenant (3 onglets, réglages) |
| `Choucas Mission.dc.html` | Mission + signalements + clôture |
| `Choucas Notifications.dc.html` | Emails transactionnels, SMS, push critique, règles d'escalade |
| `Choucas Rapport Proprietaire.dc.html` | Rapport d'intervention |
| `Choucas Rapport Incident.dc.html` | Rapport d'incident résolu |
| `Choucas Rapport Hebdo.dc.html` | Rapport hebdomadaire |
| `Choucas Manager.html` | Version autonome hors ligne de l'app manager |

Chaque `.dc.html` s'ouvre directement dans un navigateur, sans build.
