# CHOUCAS — Home commerciale V8
## Brief exact pour Claude Code
Date : 3 septembre 2026

## 0. Mission

Adapter la Home actuelle de Choucas au nouveau positionnement commercial validé, SANS refaire la direction artistique ni le socle technique.

Le site doit désormais faire comprendre très vite cette chaîne :

**Brief → Double contrôle → PRÊT → Rapport propriétaire**

La proposition de valeur n'est plus une collection de modules.
Choucas sécurise la chaîne entre ce que demande le client, ce que le terrain exécute, ce qu'une autre personne contrôle, l'état PRÊT avant check-in, puis la preuve rendue visible au propriétaire.

---

# 1. Avant de coder

Lire obligatoirement :

- `AGENTS.md`
- les docs Next.js locales demandées par `AGENTS.md`
- `references/CHOUCAS-WEB-DESIGN-SPECS.md`
- `references/Choucas - Specifications.md`
- `references/CHOUCAS-CONTENUS-FR-EN-V3.md`
- `src/styles/tokens.css`
- `src/styles/globals.css`

Inspecter aussi les composants existants avant de les modifier.

Ne pas extrapoler à partir d'anciennes habitudes Next.js : ce repo est en Next.js 16.3.3 et `AGENTS.md` impose de lire les docs locales correspondantes.

---

# 2. Ce qui NE doit PAS changer

## Direction artistique

Conserver :

- Newsreader pour les titres.
- Manrope pour interface / contenu.
- palette actuelle issue des tokens.
- Papier / Schiste / Sapin / Lichen / Cuivre.
- Cuivre uniquement comme accent.
- ombres solides actuelles.
- rayons actuels.
- grille responsive actuelle.
- système `Section`, `SectionHeader`, `Card`, `Cta`, `Reveal`, `CaptureProduit`.
- rythme vertical actuel.
- principes WCAG.
- `prefers-reduced-motion`.
- animations sobres déjà retenues : fade + translation, pas de parallaxe.

Ne pas ajouter :

- gradient SaaS.
- glassmorphism.
- nouvelles couleurs.
- nouvelle librairie UI.
- nouvelles dépendances d'animation.
- emojis décoratifs.
- dashboards KPI inventés.
- gros compteurs marketing.
- cartes arrondies génériques supplémentaires.

## Technique

Conserver :

- App Router.
- TypeScript.
- Tailwind v4.
- next-intl.
- structure de tokens.
- composants serveur par défaut.
- composants client uniquement lorsqu'une interaction l'exige.
- Calendly centralisé via `LIEN_DEMO`.

Ne pas ajouter Motion/Framer Motion : le système `Reveal` existant suffit à cette passe.

---

# 3. Règles produit à respecter

Ces règles sont non négociables.

### Double contrôle
La personne qui contrôle une mission n'est jamais celle qui l'a exécutée.

Ne pas écrire seulement « contrôle qualité » si cela masque cette règle.

### PRÊT
Une mission terminée ne rend pas automatiquement le bien PRÊT.

`PRÊT` est un état validé après contrôle.

### Rapports propriétaires
Le rapport peut être préparé par Choucas, mais l'envoi externe reste un geste humain après relecture.

Ne jamais écrire :
- « Choucas envoie automatiquement le rapport propriétaire ».
- « rapport automatique envoyé au propriétaire ».

Formulation correcte :
- « rapport préparé dans Choucas ».
- « relu avant envoi ».
- « le manager décide de l'envoyer ».

### Mesure
Choucas mesure les biens et les missions, jamais les personnes.

### Claims interdits
Supprimer de la Home :
- `0 information perdue`
- `100 % du contexte terrain`
- toute promesse absolue équivalente.
- toute donnée chiffrée marketing non prouvée.

### Linge / stocks
Ne pas en faire un axe de Home pour cette version.

Le produit peut les conserver ailleurs, mais le message commercial principal doit rester les quatre piliers validés.

---

# 4. Architecture finale de la Home

Modifier `src/app/[locale]/page.tsx`.

Ordre cible :

1. `Hero`
2. `ManagerDemo`
3. `BriefToProof` — REPENSÉ autour des 4 piliers
4. `FieldDemo`
5. `ReadyState`
6. `OwnerReport` — NOUVEAU
7. `Philosophy` — NOUVEAU
8. `Implementation` — NOUVEAU
9. `Profiles`
10. `FinalCta`

Puis footer global existant.

Retirer de la Home :

- `OperationalTension`
- `Hospitality`
- `WhyChoucas`
- `DayInChoucas`

Ne pas supprimer physiquement leurs fichiers lors de la première passe.
Seulement les dé-référencer de `page.tsx`.
Ils pourront être supprimés après validation visuelle.

---

# 5. HERO

Fichier :
`src/components/home/Hero.tsx`

La structure visuelle actuelle fonctionne.
Ne pas refaire le layout.

Modifier principalement le contenu via `src/messages/fr.json`.

## FR

```json
"hero": {
  "label": "CHOUCAS · OPÉRATIONS DE CONCIERGERIE",
  "titre": "Votre conciergerie, <accent>parfaitement orchestrée.</accent>",
  "intro": "Choucas transforme les briefs clients en actions terrain, organise le double contrôle jusqu’à l’état PRÊT et prépare les rapports propriétaires."
}
```

Actions :

Primaire :
`Demander une démo`

Secondaire :
`Voir le parcours`

Le CTA secondaire doit descendre vers la section des quatre piliers.

## EN — garder le fichier à jour mais NE PAS réactiver la route anglaise dans cette passe

```json
"hero": {
  "label": "CHOUCAS · CONCIERGE OPERATIONS",
  "titre": "Your concierge operations, <accent>perfectly orchestrated.</accent>",
  "intro": "Choucas turns guest briefs into field actions, structures independent control through READY status, and prepares owner reports."
}
```

---

# 6. MANAGER DEMO

Fichier :
`src/components/home/ManagerDemo.tsx`

CONSERVER :
- `public/demo/bloc-exceptions.png`
- surface Lichen / mousse.
- `CaptureProduit`.
- preuve produit très tôt dans la Home.

Cette capture est intéressante car elle montre déjà :
- exception critique ;
- missions `À contrôler` ;
- lien propriétaire.

Ajouter un vrai bloc éditorial au-dessus ou autour de la capture.

## FR

Label :
`CHOUCAS MANAGER`

Titre :
`Tout va bien ? Choucas se tait.`

Intro :
`Le manager suit ce qui change l’état d’un bien : une exception, un contrôle à faire ou une décision à prendre. Le reste continue d’avancer.`

Ne pas prétendre que la capture montre tout le produit.

## EN

Label :
`CHOUCAS MANAGER`

Titre :
`When everything is running normally, Choucas stays quiet.`

Intro :
`The manager sees what changes the state of a property: an exception, a control to complete or a decision to make. Everything else keeps moving.`

---

# 7. `BriefToProof` devient le cœur commercial de la Home

Fichier :
`src/components/home/BriefToProof.tsx`

Garder le composant, le fond sombre et la mécanique d'onglets.

Remplacer les onglets actuels :

- Brief
- Rotations
- Missions
- Linge & stocks

par :

- Brief
- Double contrôle
- PRÊT
- Rapport propriétaire

Clés recommandées :

```ts
const ONGLETS = ['brief', 'controle', 'pret', 'rapport'] as const;
```

Tous les quatre doivent être actifs.

## Titre section FR

Label :
`LE PARCOURS CHOUCAS`

Titre :
`Du brief <accent>au PRÊT. Du PRÊT à la preuve.</accent>`

## Panneau 01 — Brief

Titre :
`Le brief devient opérationnel.`

Texte :
`Une demande reçue par message, appel, email ou note est structurée en actions. Le terrain reçoit ce qu’il doit faire, quand le faire et le contexte utile pour comprendre pourquoi.`

Résultat :
`Ce qui est demandé devient ce qui doit être fait.`

## Panneau 02 — Double contrôle

Titre :
`Terminé ne veut pas dire contrôlé.`

Texte :
`Une mission terminée passe à une autre personne pour validation. La personne qui contrôle n’est jamais celle qui a exécuté la mission.`

Résultat :
`Un second regard avant de déclarer le bien prêt.`

## Panneau 03 — PRÊT

Titre :
`Le check-in repose sur un état clair.`

Texte :
`Une fois les missions nécessaires terminées et contrôlées, le bien peut passer en PRÊT. Le manager sait quels logements peuvent réellement accueillir leurs clients.`

Résultat :
`PRÊT est un état validé, pas un pourcentage d’avancement.`

## Panneau 04 — Rapport propriétaire

Titre :
`Le travail accompli devient visible.`

Texte :
`Photos, actions, contrôles et points d’attention peuvent alimenter un rapport propriétaire préparé dans Choucas puis relu avant envoi.`

Résultat :
`Une preuve claire du travail réalisé sur le bien.`

## EN

Label :
`THE CHOUCAS FLOW`

Title :
`From the brief <accent>to READY. From READY to proof.</accent>`

Brief:
- title: `The brief becomes operational.`
- text: `A request received by message, call, email or note is structured into actions. The field team receives what needs to be done, when, and the context needed to understand why.`
- result: `What was requested becomes what needs to be done.`

Control:
- title: `Completed does not mean controlled.`
- text: `A completed mission is reviewed by someone other than the person who carried it out.`
- result: `A second pair of eyes before the property is declared ready.`

READY:
- title: `Check-in relies on one clear state.`
- text: `Once the required missions are completed and controlled, the property can move to READY. The manager knows which homes can actually welcome their guests.`
- result: `READY is a validated state, not a progress percentage.`

Owner report:
- title: `Completed work becomes visible.`
- text: `Photos, actions, controls and attention points can feed an owner report prepared in Choucas and reviewed before it is sent.`
- result: `Clear proof of the work completed on the property.`

---

# 8. FIELD DEMO = LE BRIEF ARRIVE SUR LE TERRAIN

Fichier :
`src/components/home/FieldDemo.tsx`

Conserver :
- mise en page.
- `carte-maintenant.png`.
- `CaptureProduit`.
- composition responsive actuelle.

Changer le discours.

## FR

Label :
`LE BRIEF DEVIENT TERRAIN`

Titre :
`Le terrain sait quoi faire. <accent>Et pourquoi.</accent>`

Intro :
`Chaque mission garde le contexte utile du brief. L’équipe ne reçoit pas seulement une tâche : elle comprend ce qui est attendu avant d’agir.`

Points :

1. `Une consigne issue du brief validé`
2. `Le contexte client reste accessible à l’équipe`
3. `Photos et signalements remontent vers le contrôle`

Ne pas écrire que l'écran actuel montre nécessairement chaque élément de cette liste si ce n'est pas visible dans la capture.

## EN

Label :
`THE BRIEF REACHES THE FIELD`

Title :
`The field team knows what to do. <accent>And why.</accent>`

Intro :
`Every mission keeps the useful context from the brief. The team receives more than a task: they understand what is expected before they act.`

Points:
1. `A clear instruction from the validated brief`
2. `Guest context remains available to the team`
3. `Photos and issues feed back into control`

---

# 9. READY STATE = DOUBLE CONTRÔLE + CHECK-IN

Fichier :
`src/components/home/ReadyState.tsx`

La section existe déjà et le concept est bon.
La renforcer.

## FR

Label :
`DOUBLE CONTRÔLE · PRÊT`

Titre :
`Terminé ne veut pas dire <accent>PRÊT.</accent>`

Corps :
`La personne qui contrôle n’est pas celle qui a exécuté la mission. Le bien passe en PRÊT seulement après validation — avant le check-in.`

Ajouter sous le texte une petite démonstration VISUELLE en trois états, construite avec les composants/tokens existants :

`Mission terminée`
→
`À CONTRÔLER`
→
`PRÊT`

Pas de pourcentage.

Pas de compteurs de personnes.

Pas de grosse animation.
Seulement Reveal et éventuellement un changement d'état léger conforme aux specs.

## EN

Label :
`INDEPENDENT CONTROL · READY`

Title :
`Completed does not mean <accent>READY.</accent>`

Body :
`The person controlling the mission is not the person who carried it out. The property moves to READY only after validation — before check-in.`

States:
`Mission completed`
→
`TO CONTROL`
→
`READY`

---

# 10. NOUVEAU — OwnerReport

Créer :
`src/components/home/OwnerReport.tsx`

But :
faire du rapport propriétaire un vrai quatrième pilier commercial.

Le composant doit rester sobre et produit-first.

Composition desktop recommandée :
- texte ~5 colonnes ;
- aperçu rapport ~7 colonnes.
Mobile :
- texte puis aperçu.

Ne pas utiliser de faux dashboard.

## FR

Label :
`RAPPORT PROPRIÉTAIRE`

Titre :
`Le travail invisible <accent>devient visible.</accent>`

Intro :
`Une conciergerie réalise chaque jour des contrôles, interventions et vérifications que le propriétaire ne voit pas. Choucas transforme ces preuves opérationnelles en un rapport prêt à relire.`

Points visibles :
- `Ce qui a été fait`
- `Points d’attention`
- `Photos`
- `Prochain passage`

Microcopy :
`Le manager relit avant envoi.`

### Aperçu produit

Si aucun asset de rapport final n'est encore exporté dans `public/`, construire une représentation marketing fidèle aux spécifications, clairement traitée comme un aperçu.

Ne pas inventer :
- rendement ;
- économies ;
- scores ;
- statistiques propriétaire.

Le contenu valide d'un rapport d'intervention peut montrer :
- ce qui a été fait ;
- un point d'attention ;
- photos ;
- prochain passage.

## EN

Label :
`OWNER REPORT`

Title :
`Make invisible work <accent>visible.</accent>`

Intro :
`Concierge teams perform controls, interventions and checks every day that owners rarely see. Choucas turns those operational proofs into a report ready for review.`

Points:
- `Work completed`
- `Attention points`
- `Photos`
- `Next visit`

Microcopy:
`The manager reviews it before sending.`

---

# 11. NOUVEAU — Philosophy

Créer :
`src/components/home/Philosophy.tsx`

Cette section remplace `WhyChoucas`.

Elle doit être très éditoriale et courte.

Aucun tableau avant/après.
Aucun KPI.

## FR

Label :
`UNE AUTRE FAÇON DE PILOTER`

Titre :
`On mesure les biens et les missions. <accent>Jamais les personnes.</accent>`

Intro :
`Choucas suit l’état opérationnel et fait remonter ce qui demande une décision, un contrôle ou une intervention. Il n’a pas vocation à transformer le terrain en tableau de productivité.`

Optionnel, trois lignes courtes :
- `Le terrain exécute.`
- `Choucas suit l’opération.`
- `Le manager intervient quand il apporte quelque chose.`

## EN

Label :
`A DIFFERENT WAY TO OPERATE`

Title :
`We measure properties and missions. <accent>Never people.</accent>`

Intro :
`Choucas follows operational state and surfaces what requires a decision, control or intervention. It is not designed to turn field teams into productivity dashboards.`

Lines:
- `The field team executes.`
- `Choucas follows the operation.`
- `The manager steps in when they add value.`

---

# 12. NOUVEAU — Implementation

Créer :
`src/components/home/Implementation.tsx`

Ajouter l'ancre :
`implantation`

dans `src/components/anchors.ts`.

Cette section est commerciale : elle explique pourquoi Choucas ne ressemble pas à un outil vide à paramétrer soi-même.

## FR

Label :
`L’IMPLANTATION CHOUCAS`

Titre :
`Vos opérations. <accent>Configurées avec vous, sur le terrain.</accent>`

Intro :
`Nous passons une journée avec vos équipes pour comprendre votre exploitation et configurer Choucas autour de vos biens, vos rôles, vos standards et vos règles.`

Étapes :
1. `Observer`
   `Comprendre votre journée réelle et vos points de passage critiques.`

2. `Structurer`
   `Traduire vos briefs, contrôles, rôles et standards en logique opérationnelle.`

3. `Configurer`
   `Activer ce dont votre équipe a besoin et masquer le reste.`

4. `Tester`
   `Faire tourner Choucas sur vos cas réels et ajuster avec l’équipe.`

Phrase de clôture :
`Un produit commun. Une configuration adaptée à votre exploitation.`

Ne jamais employer :
- développement sur mesure ;
- code personnalisé par client ;
- white-label si non validé ;
- hypercustomisation.

## EN

Label :
`CHOUCAS IMPLEMENTATION`

Title :
`Your operations. <accent>Configured with you, on site.</accent>`

Intro :
`We spend a day with your team to understand how your operation actually runs and configure Choucas around your properties, roles, standards and rules.`

Steps:
1. `Observe`
   `Understand the real operating day and critical handoffs.`

2. `Structure`
   `Translate your briefs, controls, roles and standards into operational logic.`

3. `Configure`
   `Enable what your team needs and hide what it does not.`

4. `Test`
   `Run Choucas against real cases and adjust it with the team.`

Closing:
`One product. A configuration adapted to your operation.`

---

# 13. PROFILES

Fichier :
`src/components/home/Profiles.tsx`

Conserver la structure trois cartes.

Mettre à jour uniquement les bénéfices afin qu'ils prolongent les quatre piliers.

## FR

Dirigeant :
- phrase : `Une vision nette de la qualité rendue sur chaque bien.`
- bénéfice : `Le service devient visible et prouvable`

Responsable d'exploitation :
- phrase : `Du brief au contrôle, il voit ce qui demande réellement son attention.`
- bénéfice : `Savoir quels biens sont réellement PRÊTS`

Équipe terrain :
- phrase : `La prochaine action et son contexte sont disponibles là où le travail se fait.`
- bénéfice : `Savoir quoi faire, et pourquoi`

## EN

Owner / Director:
- phrase: `A clear view of the quality delivered across every property.`
- benefit: `Service becomes visible and provable`

Operations manager:
- phrase: `From brief to control, they see what actually requires attention.`
- benefit: `Know which properties are truly READY`

Field team:
- phrase: `The next action and its context are available where the work happens.`
- benefit: `Know what to do, and why`

---

# 14. FINAL CTA

Fichier :
`src/components/home/FinalCta.tsx`

Garder le design sombre.

## FR

Label :
`MONTREZ-NOUS UNE DE VOS ROTATIONS`

Titre :
`Le terrain change. <accent>Le niveau d’exigence, non.</accent>`

Intro :
`En 30 minutes, partons d’un de vos briefs, de votre façon de contrôler les biens et de vos check-ins. Nous vous montrons comment Choucas s’intègre à cette chaîne.`

Micro :
`30 minutes · Avec vos cas opérationnels`

CTA :
`Demander une démo`

## EN

Label :
`SHOW US ONE OF YOUR TURNOVERS`

Title :
`The field changes. <accent>Your standard does not.</accent>`

Intro :
`In 30 minutes, we start from one of your briefs, the way you control properties and your check-ins, then show how Choucas fits into that chain.`

Micro :
`30 minutes · Built around your operation`

CTA :
`Request a demo`

---

# 15. NAVIGATION

Fichiers :
- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/anchors.ts`
- messages nav FR/EN

Tant que les pages secondaires n'existent pas, rester sur des ancres réelles.

Navigation recommandée :

- `Le produit` → scène / parcours Choucas
- `Fonctionnement` → BriefToProof
- `Implantation` → Implementation
- `À propos` → Philosophy

FR :
```json
"nav": {
  "pourquoi": "À propos",
  "produit": "Le produit",
  "fonctionnement": "Fonctionnement",
  "implantation": "Implantation",
  "aPropos": "À propos"
}
```

Éviter deux liens « À propos ».
Adapter le tableau `liens` pour n'avoir que quatre entrées distinctes.

Suggestion finale :
- Produit
- Fonctionnement
- Implantation
- À propos

Ne créer aucun lien vers une page qui n'existe pas encore.

---

# 16. MÉTADONNÉES

`src/messages/fr.json`

Remplacer la description actuelle qui liste briefs, rotations, équipes, stocks et linge.

## FR

Title :
`Choucas — Le logiciel opérationnel des conciergeries`

Description :
`Choucas transforme les briefs clients en actions terrain, organise le double contrôle jusqu’à l’état PRÊT et prépare les rapports propriétaires.`

## EN

Title :
`Choucas — Operations software for concierge teams`

Description :
`Choucas turns guest briefs into field actions, structures independent control through READY status and prepares owner reports.`

Ne pas réactiver l'anglais pendant cette passe.
Seulement maintenir `src/messages/en.json` à parité afin que sa réactivation ultérieure ne reconstruise pas le contenu depuis zéro.

---

# 17. Ancres recommandées

Dans `src/components/anchors.ts` :

```ts
export const ancres = {
  produit: 'produit',
  fonctionnement: 'fonctionnement',
  implantation: 'implantation',
  aPropos: 'a-propos',
  demo: 'demander-une-demo',
} as const;
```

`ManagerDemo` peut porter `produit`.

`BriefToProof` porte `fonctionnement`.

`Implementation` porte `implantation`.

`Philosophy` porte `a-propos`.

---

# 18. Ce qu'on retire du message Home

Ne plus utiliser comme proposition centrale :

- planning ;
- rotations ;
- stocks ;
- linge ;
- « tout centraliser » ;
- « 1 vue commune » ;
- « 0 information perdue » ;
- « 100 % du contexte » ;
- « luxe = absence de friction » ;
- longue démonstration d'une journée entière.

Ces sujets ne sont pas forcément supprimés du produit.
Ils ne sont simplement plus la façon principale de vendre Choucas.

---

# 19. Ce qu'on doit comprendre sans lire tous les paragraphes

Un prospect qui scrolle rapidement doit comprendre :

```text
Un client demande quelque chose
        ↓
BRIEF
        ↓
le terrain exécute avec le contexte
        ↓
DOUBLE CONTRÔLE
        ↓
PRÊT
        ↓
CHECK-IN
        ↓
RAPPORT PROPRIÉTAIRE
```

Puis :

```text
Choucas mesure le bien et la mission,
pas la productivité individuelle.
```

Puis :

```text
Choucas est configuré avec la conciergerie sur le terrain.
```

---

# 20. Critères d'acceptation

Avant de considérer la passe terminée :

## Build
- `npm run build`
- `npm run lint`

Doivent passer.

## Responsive
Inspecter au minimum :
- 390 × 844
- 768 × 1024
- 1440 × 900

Pas de débordement horizontal.

## Accessibilité
- un seul H1.
- titres dans l'ordre.
- focus visible.
- onglets de `BriefToProof` accessibles au clavier.
- aucune information portée uniquement par la couleur.
- état PRÊT nommé textuellement.
- `prefers-reduced-motion` préservé.

## Performance
- ne pas ajouter de dépendance lourde.
- pas de vidéo autoplay.
- images via les mécanismes actuels.
- réserver les dimensions d'assets.

## Produit
La Home doit montrer ou expliquer clairement les 4 piliers :
1. Brief
2. Double contrôle
3. PRÊT
4. Rapport propriétaire

## Commercial
La Home ne doit pas ressembler à un catalogue de fonctionnalités.

---

# 21. Processus de travail demandé à Claude Code

1. Lire les fichiers de référence.
2. Faire un plan des modifications fichier par fichier.
3. Ne pas coder immédiatement avant d'avoir listé les impacts.
4. Implémenter d'abord FR.
5. Mettre EN à parité dans les messages, sans réactiver la locale.
6. Lancer build + lint.
7. Vérifier les trois tailles responsive.
8. Fournir un résumé :
   - fichiers modifiés ;
   - composants ajoutés ;
   - composants retirés de la Home ;
   - éventuelles divergences nécessaires par rapport à ce brief.

Ne pas modifier les règles produit pour résoudre un problème de design.
En cas de conflit, conserver la règle produit et adapter la présentation.
