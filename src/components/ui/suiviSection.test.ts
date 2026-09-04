import assert from 'node:assert/strict';
import { test } from 'node:test';

import { creerSuiviSection } from './suiviSection.ts';

const ORDRE = ['produit', 'perimetre', 'equipe', 'donnees', 'prix'];

test('une seule section dans la bande : elle devient active', () => {
  const suivi = creerSuiviSection(ORDRE);
  assert.equal(suivi.appliquer([{ id: 'equipe', visible: true }]), 'equipe');
});

test('rien dans la bande : aucune section designee, l’appelant garde la sienne', () => {
  const suivi = creerSuiviSection(ORDRE);
  assert.equal(suivi.appliquer([]), null);
  suivi.appliquer([{ id: 'equipe', visible: true }]);
  assert.equal(suivi.appliquer([{ id: 'equipe', visible: false }]), null);
});

test('deux sections dans la bande : la plus haute gagne, quel que soit l’ordre de livraison', () => {
  const suivi = creerSuiviSection(ORDRE);
  assert.equal(
    suivi.appliquer([
      { id: 'donnees', visible: true },
      { id: 'equipe', visible: true },
    ]),
    'equipe',
  );
});

test('le defaut corrige : la livraison suivante ne contient que le changement', () => {
  // Equipe touche la bande, puis Donnees l'atteint a son tour. La seconde
  // livraison ne parle que de Donnees. Sans memoire, on designerait Donnees
  // alors qu'Equipe est toujours la, plus haut.
  const suivi = creerSuiviSection(ORDRE);
  assert.equal(suivi.appliquer([{ id: 'equipe', visible: true }]), 'equipe');
  assert.equal(suivi.appliquer([{ id: 'donnees', visible: true }]), 'equipe');
});

test('la section haute sort : l’active descend d’un cran', () => {
  const suivi = creerSuiviSection(ORDRE);
  suivi.appliquer([{ id: 'equipe', visible: true }]);
  suivi.appliquer([{ id: 'donnees', visible: true }]);
  assert.equal(suivi.appliquer([{ id: 'equipe', visible: false }]), 'donnees');
});

test('defilement rapide : plusieurs sections traversees en une livraison', () => {
  // Un saut d'ancre livre les sorties et les entrees ensemble. L'ordre du
  // document prime, jamais l'ordre du tableau livre.
  const suivi = creerSuiviSection(ORDRE);
  suivi.appliquer([{ id: 'produit', visible: true }]);
  assert.equal(
    suivi.appliquer([
      { id: 'prix', visible: true },
      { id: 'donnees', visible: true },
      { id: 'produit', visible: false },
    ]),
    'donnees',
  );
});

test('remonter le document redonne la section du haut', () => {
  const suivi = creerSuiviSection(ORDRE);
  suivi.appliquer([{ id: 'prix', visible: true }]);
  assert.equal(
    suivi.appliquer([
      { id: 'prix', visible: false },
      { id: 'produit', visible: true },
    ]),
    'produit',
  );
});

test('une cible inconnue de l’ordre n’est jamais designee', () => {
  const suivi = creerSuiviSection(ORDRE);
  assert.equal(suivi.appliquer([{ id: 'intrus', visible: true }]), null);
});

test('reinitialiser vide la memoire', () => {
  const suivi = creerSuiviSection(ORDRE);
  suivi.appliquer([{ id: 'equipe', visible: true }]);
  suivi.reinitialiser();
  assert.equal(suivi.appliquer([]), null);
});
