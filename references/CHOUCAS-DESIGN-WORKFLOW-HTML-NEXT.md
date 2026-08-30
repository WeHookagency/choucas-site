# CHOUCAS — Workflow design → Next.js

## Recommendation

Yes: keep HTML as a temporary design-validation format for pages that do not yet have an approved UX/UI direction, then implement the approved patterns in Next.js.

But do **not** design 12 totally independent HTML pages. That would recreate the same maintenance problem we are trying to remove.

The efficient approach is to validate **4 master page templates** in HTML, then reuse them in Next.js with different content.

---

## Phase 0 — Home

**Status:** V3 design direction exists and has now been translated into Next.js.

Use the Next.js Home as the development reference from now on. The HTML V3 remains a visual archive, not the production source.

---

## Phase 1 — Master template A: Product narrative

Design in HTML first:

1. `/produit` — Product overview
2. `/implantation` — Implementation

Why together: both are long-form commercial storytelling pages with product visuals, proof and conversion CTA.

Validate:

- hero rhythm
- product UI framing
- scroll storytelling
- section spacing
- CTA structure
- desktop/mobile treatment

Then create reusable Next.js primitives.

---

## Phase 2 — Master template B: Operational method

Create **one** HTML template, then test it with two contrasting pages:

- `/anticiper`
- `/controler`

Once approved, the same template can power:

- Anticiper
- Opérer
- Contrôler
- Résoudre
- Rendre compte

Shared structure:

1. Hero promise
2. Operational tension
3. Product interaction/demo
4. 3–4 principles
5. Before/after operational flow
6. Related capability
7. Demo CTA

Do not create five unrelated page designs.

---

## Phase 3 — Master template C: Role solution

Design one template and validate with:

- `/solutions/responsables-exploitation`

Then reuse for:

- Dirigeants
- Responsables d’exploitation
- Équipes terrain

Shared structure:

1. Role-specific pain
2. What Choucas hides
3. What Choucas surfaces
4. Relevant product screens
5. Typical day / scenario
6. Product principles
7. CTA

---

## Phase 4 — Master template D: Editorial / resources

Validate with:

- `/ressources/le-brief-choucas`
- `/faq`

Then reuse for guides and editorial SEO/GEO content.

Keep these pages lighter than sales pages. Their job is authority and search discoverability, not product spectacle.

---

## Phase 5 — Pricing

Pricing can reuse Home + Implementation primitives and does not need a totally new visual language.

Page should contain:

- active-property pricing table
- unlimited field users message
- Founding Circle implementation
- standard implementation
- what implementation includes
- FAQ
- demo CTA

---

## Recommended production order

1. Home V3 — Next.js now
2. Product overview — HTML → design → Next.js
3. Implementation — HTML → design → Next.js
4. Operational-method template — HTML → design → Next.js
5. Role-solution template — HTML → design → Next.js
6. Pricing — HTML light prototype → Next.js
7. Resources template — HTML → design → Next.js
8. Remaining pages become content/configuration, not new frontend inventions

---

## Definition of “design approved”

A page can move from HTML to Next.js when:

- desktop composition is approved
- mobile composition is approved
- page hierarchy is approved
- final FR copy is approved
- EN copy has a native-quality translation
- product screens shown are real/validated or clearly framed as marketing representations
- animations have a defined purpose
- no unsupported product claim remains

---

## Why this workflow is the right compromise

HTML remains useful as a **cheap disposable design prototype**. Next.js becomes the **single production source of truth**.

This prevents two bad outcomes:

1. coding unfinished UX directly in production components and repeatedly refactoring it;
2. maintaining a parallel “real website” in giant HTML files.
