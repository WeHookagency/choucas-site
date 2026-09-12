'use client';

import { useSearchParams } from 'next/navigation';
import { useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Cta } from '../ui/Cta';
import { JEUX, PERIODES, verifier, type Champ, type Voie } from './champs';
import { DESTINATION_FORMULAIRE } from './destination';
import { composerMailto } from './mailto';

/**
 * Lit la voie demandee dans l'URL. `/contact?voie=question` ouvre le
 * formulaire court.
 *
 * Cinq pages menaient vers `/contact` et trois promettaient « Poser une
 * question » : elles livraient le formulaire d'implantation a huit champs,
 * et il fallait cliquer une seconde fois sur la voie. Un lien qui ment sur sa
 * destination n'est pas un defaut de mise en page.
 *
 * Toute autre valeur retombe sur la voie principale : une URL bricolee ne doit
 * pas casser la page.
 */
/** Ou en est la soumission. */
type Envoi = 'repos' | 'encours' | 'succes' | 'echec';

/**
 * Ou part le formulaire.
 *
 * Netlify n'accepte un envoi que sur une adresse ou il a detecte un
 * formulaire au build. C'est `public/__forms.html` qui porte cette
 * declaration : le composant poste donc vers elle, et non vers la page
 * courante. Les noms de champs doivent correspondre a ceux qui y sont
 * declares, sinon leur valeur est ignoree en silence.
 */
const POINT_ENVOI = '/__forms.html';
const NOM_FORMULAIRE = 'contact';

function voieDemandee(valeur: string | null): Voie {
  return valeur === 'question' ? 'question' : 'impl';
}

export function FormulaireContact() {
  const t = useTranslations('contact');
  // `useSearchParams` fait basculer l'arbre client jusqu'a la Suspense la plus
  // proche en rendu client ; la page monte donc ce composant dans une
  // `Suspense`, et le reste de `/contact` continue d'etre prerendu.
  const voieUrl = voieDemandee(useSearchParams().get('voie'));
  const [voie, setVoie] = useState<Voie>(voieUrl);
  const [valeurs, setValeurs] = useState<Record<string, string>>({});
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [envoi, setEnvoi] = useState<Envoi>('repos');
  // Le leurre. Un humain ne le voit pas et ne le remplit donc jamais ; un
  // robot qui remplit tout le remplit aussi.
  const [leurre, setLeurre] = useState('');
  const premierEnErreur = useRef<string | null>(null);
  const idBase = useId();

  const jeu = JEUX[voie];
  const idChamp = (cle: string) => `${idBase}-${voie}-${cle}`;

  function choisirVoie(nouvelle: Voie) {
    setVoie(nouvelle);
    // Les erreurs de l'autre jeu ne concernent plus personne.
    setErreurs({});
  }

  function poser(cle: string, valeur: string) {
    setValeurs((v) => ({ ...v, [cle]: valeur }));
    // L'erreur d'un champ disparait des qu'on le corrige.
    if (erreurs[cle]) {
      setErreurs((precedentes) => {
        const suite = { ...precedentes };
        delete suite[cle];
        return suite;
      });
    }
  }

  function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trouvees: Record<string, string> = {};
    for (const champ of jeu) {
      const probleme = verifier(champ, valeurs[champ.cle] ?? '');
      if (!probleme) continue;
      // `erreurDomaine` ne sort que d'un champ email : la cle est donc sure.
      trouvees[champ.cle] =
        probleme === 'erreurDomaine'
          ? t('champs.email.erreurDomaine')
          : t(`champs.${champ.cle}.erreur`);
    }
    setErreurs(trouvees);

    const premier = jeu.find((c) => trouvees[c.cle]);
    if (premier) {
      premierEnErreur.current = premier.cle;
      document.getElementById(idChamp(premier.cle))?.focus();
      return;
    }

    void envoyer();
  }

  async function envoyer() {
    setEnvoi('encours');
    // `URLSearchParams` produit exactement le corps qu'attend Netlify :
    // `application/x-www-form-urlencoded`, et non du JSON.
    const corps = new URLSearchParams({ 'form-name': NOM_FORMULAIRE, voie });
    for (const champ of jeu) corps.set(champ.cle, valeurs[champ.cle] ?? '');
    // Le leurre part toujours, vide. Rempli, c'est un robot : Netlify ecarte.
    corps.set('bot-field', leurre);

    try {
      const reponse = await fetch(POINT_ENVOI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: corps.toString(),
      });
      setEnvoi(reponse.ok ? 'succes' : 'echec');
    } catch {
      // Reseau coupe, requete bloquee, hors ligne : meme repli.
      setEnvoi('echec');
    }
  }

  const nombreErreurs = Object.keys(erreurs).length;
  const solo = voie === 'impl' && (valeurs.terrain ?? '').trim() === '1';

  if (envoi === 'succes') {
    return (
      // `status` et non `alert` : l'annonce est polie, elle n'interrompt pas.
      // Le focus n'est pas force non plus — le lecteur arrive ici de lui-meme
      // en quittant le bouton qui vient de disparaitre.
      <div role="status" className="rounded-carte border border-filet bg-surface p-6">
        <p className="font-serif text-h3">{t('succes.titre')}</p>
        <p className="text-corps mt-4 max-w-[62ch] text-encre-douce">{t('succes.texte')}</p>
        <p className="mt-4">
          <a
            href={`mailto:${DESTINATION_FORMULAIRE}`}
            className="text-corps py-3.5 text-lien underline underline-offset-4"
          >
            {DESTINATION_FORMULAIRE}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Bascule de voie. Deux boutons plutot que des onglets ARIA : ils ne
          revelent pas un panneau, ils changent le formulaire lui-meme. */}
      <div role="group" aria-label={t('voies.aria')} className="flex flex-wrap gap-3">
        {(['impl', 'question'] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={voie === v}
            onClick={() => choisirVoie(v)}
            className={[
              'text-nav inline-flex min-h-11 items-center rounded-capsule border px-4 font-semibold',
              'transition-colors duration-200 ease-choucas',
              voie === v
                ? 'border-cta bg-cta text-cta-encre'
                : 'border-filet text-encre-douce hover:text-encre',
            ].join(' ')}
          >
            {t(`voies.${v}.titre`)}
          </button>
        ))}
      </div>

      <form noValidate onSubmit={soumettre} className="mt-8">
        <h2 className="font-serif text-h3 text-balance">
          {voie === 'impl' ? t('formTitreImpl') : t('formTitreQuestion')}
        </h2>

        <div className="mt-titre grid gap-5 tablette:grid-cols-2">
          {jeu.map((champ) => (
            <ChampSaisi
              key={champ.cle}
              champ={champ}
              id={idChamp(champ.cle)}
              valeur={valeurs[champ.cle] ?? ''}
              erreur={erreurs[champ.cle]}
              onChange={(v) => poser(champ.cle, v)}
            />
          ))}
        </div>

        {/* L'offre solo n'existe pas, et la FAQ le dit. Le message le dit ici
            aussi, sans bloquer l'envoi : une organisation evolue. */}
        {solo ? (
          <p role="status" className="text-corps mt-6 rounded-carte border border-filet bg-fond-alt p-5">
            {t('alerteSolo')}
          </p>
        ) : null}

        {nombreErreurs > 1 ? (
          <p role="alert" className="text-corps mt-6 font-semibold text-erreur">
            {t('resumeErreurs', { nombre: nombreErreurs })}
          </p>
        ) : null}

        {/* Le leurre. `sr-only` ne suffirait pas : un lecteur d'ecran le
            lirait et son utilisateur le remplirait. `aria-hidden` le retire de
            l'arbre, `tabIndex={-1}` du parcours clavier, et `autoComplete` de
            la memoire du navigateur — trois portes, fermees ensemble. */}
        <p aria-hidden className="hidden">
          <label>
            {t('leurre')}
            <input
              type="text"
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              value={leurre}
              onChange={(e) => setLeurre(e.target.value)}
            />
          </label>
        </p>

        {envoi === 'echec' ? (
          <div
            role="alert"
            className="mt-8 rounded-carte border border-erreur bg-fond-alt p-5 text-encre"
          >
            <p className="text-intro font-semibold">{t('echec.titre')}</p>
            <p className="text-corps mt-3 max-w-[62ch]">{t('echec.texte')}</p>
            <p className="mt-4">
              {/* L'adresse en clair, et un lien qui ouvre la messagerie avec
                  la saisie deja dedans : un repli qui oblige a tout retaper
                  n'est pas un repli. */}
              <a
                href={composerMailto(
                  DESTINATION_FORMULAIRE,
                  voie === 'impl' ? t('formTitreImpl') : t('formTitreQuestion'),
                  jeu.map((c) => `${t(`champs.${c.cle}.label`)} : ${valeurs[c.cle] ?? ''}`),
                )}
                className="text-corps py-3.5 font-semibold text-lien underline underline-offset-4"
              >
                {t('echec.lien')}
              </a>{' '}
              <span className="text-corps text-encre-douce">— {DESTINATION_FORMULAIRE}</span>
            </p>
          </div>
        ) : null}

        <Cta type="submit" fleche className="mt-8" disabled={envoi === 'encours'}>
          {envoi === 'encours'
            ? t('envoiEnCours')
            : voie === 'impl'
              ? t('envoyerImpl')
              : t('envoyerQuestion')}
        </Cta>
      </form>
    </div>
  );
}

function ChampSaisi({
  champ,
  id,
  valeur,
  erreur,
  onChange,
}: {
  champ: Champ;
  id: string;
  valeur: string;
  erreur?: string;
  onChange: (v: string) => void;
}) {
  const t = useTranslations('contact');
  const idErreur = `${id}-erreur`;
  const idLibelle = `${id}-libelle`;
  const bordure = erreur ? 'border-erreur' : 'border-filet';
  const libelle = t(`champs.${champ.cle}.label`);
  const classeLibelle = 'text-label font-semibold uppercase text-encre-douce';

  /**
   * La mention « facultatif » est dans le libelle, pas a cote.
   *
   * Posee ailleurs — une legende sous le champ, une couleur, un asterisque —
   * elle n'entre pas dans le nom accessible : un lecteur d'ecran annoncerait
   * « Station ou vallee, zone de texte » sans jamais dire qu'on peut la
   * laisser vide. Ici elle est lue avec le libelle, et vue avec lui.
   *
   * C'est le facultatif qui est marque, pas l'obligatoire : sur huit champs
   * dont quatre le sont, marquer les quatre autres ferait moins de bruit —
   * mais le lecteur doit savoir ce qu'il peut sauter, pas ce qu'il doit
   * remplir.
   */
  const mention = champ.requis ? null : (
    <span className="font-normal normal-case text-encre-douce"> — {t('facultatif')}</span>
  );

  return (
    <div className={champ.large ? 'tablette:col-span-2' : undefined}>
      {/* Un groupe de boutons radio n'est pas un controle etiquetable :
          `htmlFor` n'y mene nulle part, il faut `aria-labelledby`. */}
      {champ.type === 'choix' ? (
        <span id={idLibelle} className={classeLibelle}>
          {libelle}
          {mention}
        </span>
      ) : (
        <label htmlFor={id} className={classeLibelle}>
          {libelle}
          {mention}
        </label>
      )}

      {champ.type === 'choix' ? (
        // Trois choix exclusifs, operables au clavier, et l'etat ne repose
        // pas sur la seule couleur : `aria-checked` le porte aussi.
        <div
          role="radiogroup"
          aria-labelledby={idLibelle}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? idErreur : undefined}
          className="mt-3 flex flex-wrap gap-3"
        >
          {PERIODES.map((periode) => {
            const libelle = t(`dispoOptions.${periode}`);
            const choisi = valeur === libelle;
            return (
              <button
                key={periode}
                id={periode === PERIODES[0] ? id : undefined}
                type="button"
                role="radio"
                aria-checked={choisi}
                onClick={() => onChange(libelle)}
                className={[
                  'text-nav inline-flex min-h-11 items-center rounded-capsule border px-4 font-semibold',
                  'transition-colors duration-200 ease-choucas',
                  choisi ? 'border-cta bg-cta text-cta-encre' : `${bordure} text-encre-douce`,
                ].join(' ')}
              >
                {libelle}
              </button>
            );
          })}
        </div>
      ) : champ.type === 'zone' ? (
        <textarea
          id={id}
          rows={5}
          value={valeur}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? idErreur : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`text-corps mt-3 w-full rounded-carte border bg-surface p-4 ${bordure}`}
        />
      ) : (
        <input
          id={id}
          type={champ.type === 'nombre' ? 'text' : champ.type === 'tel' ? 'tel' : champ.type}
          inputMode={champ.type === 'nombre' ? 'numeric' : undefined}
          value={valeur}
          placeholder={t(`champs.${champ.cle}.exemple`)}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? idErreur : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`text-corps mt-3 h-12 w-full rounded-carte border bg-surface px-4 ${bordure}`}
        />
      )}

      {erreur ? (
        <p id={idErreur} className="text-micro mt-2 text-erreur">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
