# Choucas — les trois mémoires

Spécification de conception. Septembre 2026.
Décisions arrêtées avec Mathieu, à ne pas rouvrir sans raison :

- **Écriture automatique avec validation.** Ce qui est signalé pendant un séjour
  remonte en proposition dans la fiche. Un humain valide avant que ça devienne
  mémoire. Même logique que le double contrôle : rien n'entre tout seul.
- **Socle imposé, plus champs configurables.** Le socle est identique chez toutes
  les conciergeries et reste comparable entre biens, saisons et clients. Les champs
  configurables portent le métier de chaque maison.
- **Trois fiches distinctes** : client, bien, propriétaire. Chacune a son écran.

---

## Principe commun aux trois fiches

### D'où vient une ligne

Une entrée de mémoire naît toujours d'un fait tracé : une mission, un signalement,
un contrôle, une intervention. Jamais d'une saisie libre sans origine.

Le cycle :

1. **Fait** — un signalement pendant une mission, un incident, une observation
   au contrôle.
2. **Proposition** — Choucas rattache le fait à la fiche concernée et le présente
   comme candidat à la mémoire.
3. **Validation** — une personne habilitée accepte, modifie ou refuse. Rien n'entre
   sans ce geste.
4. **Mémoire** — la ligne est datée, porte son origine et le nom du valideur.

### Ce qui distingue mémoire et journal

Le journal enregistre tout, il est intégral et froid. La mémoire ne retient que ce
qui servira au prochain séjour. Un ménage exécuté normalement n'entre pas en
mémoire. Un radiateur qui a lâché deux fois, oui.

Règle de tri à appliquer : une ligne entre en mémoire si elle change ce qu'on fera
la prochaine fois.

### Ce qui ne doit jamais y entrer

- Une appréciation sur une personne de l'équipe. Le refus « on ne mesure pas les
  personnes » vaut aussi ici.
- **Une donnée de santé d'un client. Décision arrêtée : Choucas n'en stocke pas.**
  Ni allergie, ni intolérance, ni traitement, ni régime médical — dans aucun champ,
  y compris les champs libres et configurables. La règle vaut pour la V1 et se
  rouvrira seulement après vérification juridique. Elle doit être portée par
  l'interface, pas seulement par ce document : voir la mention de saisie dans la
  fiche client.
- Un jugement sur un client. « Difficile », « pénible » : la fiche note des faits
  et des préférences, pas des opinions.

---

## 1. Fiche client

Le client est le voyageur ou la famille qui séjourne. Distinct de la réservation
et distinct du bien : un client revient dans des biens différents, un bien reçoit
des clients différents.

### Socle imposé

| Champ | Nature | Alimenté par |
| --- | --- | --- |
| Identité | nom, langue de contact | à la première réservation |
| Séjours | dates, bien, durée, nombre de personnes | réservation |
| Récurrence | nombre de séjours, premier séjour, dernier séjour | calculé |
| Incidents rattachés | l'incident, sa date, le bien, sa résolution | remontée automatique, validée |
| À vérifier avant le prochain séjour | point ouvert, origine, échéance | remontée automatique, validée |
| Demandes récurrentes | ce qui a été demandé au moins deux fois | proposé par récurrence, validé |

Le champ **à vérifier avant le prochain séjour** est le plus important de la fiche.
C'est lui qui répond au cas décrit par le terrain : internet ne passait pas dans les
chambres en 2024, il faut le tester avant son retour. Il doit apparaître
automatiquement dans le brief du séjour suivant.

### Configurable par la conciergerie

Les **préférences**, sous forme d'étiquettes que la conciergerie définit elle-même.
Exemples issus du terrain : pas de fleurs dans le salon, arrive systématiquement en
retard, veut les courses présentes à l'arrivée, ménage souhaité en milieu de séjour
à heure fixe.

Chaque conciergerie crée son jeu d'étiquettes à la journée d'implantation. Une
étiquette est un libellé plus une valeur libre.

**Mention obligatoire à la saisie**, visible au moment où on écrit et pas dans une
aide qu'on n'ouvre jamais : les données de santé n'ont pas leur place ici —
ni allergie, ni intolérance, ni traitement. La valeur libre rend la règle
contournable ; c'est la mention qui la tient. À rédiger courte et sans jargon.

---

## 2. Fiche bien

### Socle imposé

| Champ | Nature | Alimenté par |
| --- | --- | --- |
| Identité | nom, adresse, propriétaire rattaché | configuration |
| Appareils | type, marque, modèle, numéro de série, date d'installation | saisie initiale, complétée au fil des interventions |
| Historique d'incidents | incident, date, bien, mission d'origine, résolution | remontée automatique, validée |
| Interventions | artisan, date, objet, suite donnée | mission d'intervention |
| Points de vigilance | ce qui casse souvent, ce qui demande une attention particulière | proposé par récurrence, validé |
| Rotations | nombre de départs et d'arrivées sur la saison | calculé |
| Calendrier | occupation, y compris arrivées du propriétaire | réservation |

Le champ **appareils** est ce qui répond au cas terrain : ne plus chercher la
référence du sèche-linge sous la machine, un samedi, avec une arrivée dans trois
heures.

Les **points de vigilance** se proposent tout seuls : trois incidents sur le même
appareil en deux saisons déclenchent une proposition.

### Configurable par la conciergerie

Les **particularités d'exploitation** : accès difficile en hiver, coupure d'eau à
prévoir, voisinage sensible, place de parking. Étiquettes définies par la
conciergerie, sur le même modèle que les préférences client.

---

## 3. Fiche propriétaire

Le propriétaire n'est pas un client comme les autres : il est le client de la
conciergerie et l'occupant occasionnel de son propre bien.

### Socle imposé

| Champ | Nature | Alimenté par |
| --- | --- | --- |
| Identité | nom, langue, biens rattachés | configuration |
| Séjours propriétaire | dates d'occupation personnelle | calendrier du bien |
| Mise en place à l'arrivée | ce qu'il faut préparer avant qu'il arrive | configuration, complétée |
| Effets personnels | ce qui lui appartient et ne se remplace pas — draps, machine à café, vaisselle | saisie, complétée au fil des séjours |
| Seuil d'intervention | montant au-delà duquel son accord est requis avant d'engager un artisan | configuration |
| Rapport de saison | état d'envoi, point d'étape, rapport final | option rapport de saison |

Le **seuil d'intervention** vient du terrain brésilien. Il conditionne le parcours
« envoyer à un artisan » : sous le seuil, la conciergerie décide ; au-dessus,
l'accord du propriétaire est demandé et tracé.

### Configurable par la conciergerie

Les **exigences propres au propriétaire** : ce qu'il veut savoir, ce qu'il ne veut
pas qu'on touche, ses habitudes de communication.

---

## Ce que ces fiches produisent en aval

- La fiche client alimente le brief du séjour suivant, sans ressaisie.
- La fiche bien alimente le rapport de saison et l'historique d'entretien remis au
  propriétaire.
- La fiche propriétaire conditionne le parcours d'intervention et la mise en place
  avant ses arrivées.

---

## Points non tranchés

1. **Qui valide une entrée de mémoire.** Le responsable d'exploitation seul, ou
   toute personne habilitée au contrôle ? La règle du double contrôle ne dit rien
   ici : valider une mémoire n'est pas valider une mission.
2. **Durée de conservation.** Combien de temps une fiche client survit-elle au
   dernier séjour ? Croise la question RGPD non arbitrée.
3. **Portabilité.** Un propriétaire qui change de conciergerie emporte-t-il
   l'historique de son bien ? Argument commercial fort dans les deux sens, à
   trancher volontairement plutôt que par défaut.
