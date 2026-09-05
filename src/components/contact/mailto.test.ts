import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DESTINATION_FORMULAIRE } from './destination.ts';
import { composerMailto } from './mailto.ts';

test('la destination provisoire est bien celle demandée', () => {
  // Elle sera remplacée par contact@choucas.app : ce test le signalera.
  assert.equal(DESTINATION_FORMULAIRE, 'mathieudv@wehookagency.com');
  assert.ok(composerMailto(DESTINATION_FORMULAIRE, 'Sujet', []).startsWith(`mailto:${DESTINATION_FORMULAIRE}?`));
});

test('les lignes sont séparées par des CRLF, comme la RFC 6068 l’impose', () => {
  const url = composerMailto('a@b.fr', 'Sujet', ['Nom : Marie', 'Email : marie@exemple.fr']);
  assert.match(url, /body=Nom%20%3A%20Marie%0D%0AEmail/);
});

test('les espaces sortent en %20, jamais en +', () => {
  // Un « + » dans le corps s'afficherait tel quel dans le client de
  // messagerie, a la place de l'espace.
  const url = composerMailto('a@b.fr', 'Une journée sur site', ['Nom : Mathieu Bertrand']);
  assert.ok(!url.includes('+'), 'aucun + ne doit subsister');
  assert.match(url, /subject=Une%20journ%C3%A9e%20sur%20site/);
});

test('les accents et les deux-points sont encodés', () => {
  const url = composerMailto('a@b.fr', 'Sujet', ['Station ou vallée : Le Grand-Bornand']);
  assert.match(url, /vall%C3%A9e%20%3A%20Le%20Grand-Bornand/);
});

test('un corps vide reste une URL valide', () => {
  const url = composerMailto('a@b.fr', 'Sujet', []);
  assert.doesNotThrow(() => new URL(url));
  assert.match(url, /body=$/);
});

test('un message long dépasse la limite pratique des clients', () => {
  // Le cas qui sait échouer : la voie « question » a un champ libre, et
  // au-dela d'environ 2 000 caracteres certains clients tronquent sans
  // prevenir. Le test ne corrige rien — il documente la frontiere.
  const long = 'a'.repeat(2000);
  const url = composerMailto('a@b.fr', 'Poser une question', [`Message : ${long}`]);
  assert.ok(url.length > 2000, 'un message de 2 000 caractères dépasse déjà la limite');
});
