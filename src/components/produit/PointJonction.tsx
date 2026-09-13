import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Le point de jonction : deux cartes, une liaison, une regle.
 *
 * L'exécutant declare terminé a gauche, le controleur valide PRÊT a droite,
 * et la liaison nomme qui a controlé. C'est la demonstration du double
 * controle — elle en dit plus qu'un paragraphe, et les correctifs la
 * designent comme le meilleur element des six maquettes.
 *
 * Deux privileges de page lui reviennent, et a elle seule : le titre colore
 * (§0.4) et l'ombre solide (§0.5). Sur Sapin, l'italique passe au cuivre
 * eclairci — le cuivre standard y mesure 2,79:1.
 *
 * Les deux etats ne se distinguent pas par la seule couleur : le libelle est
 * ecrit, et la pastille PRÊT est pleine quand celle de TERMINÉ est un contour.
 */
export function PointJonction() {
  const t = useTranslations('solutions.jonction');

  return (
    <Section fond="sapin" aria-labelledby="jonction-titre">
      <Reveal className="mx-auto flex max-w-[900px] flex-col items-center gap-14">
        <div className="max-w-[600px] text-center">
          <h2 id="jonction-titre" className="font-serif text-h3 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent ton="inverse">{chunks}</Accent> })}
          </h2>
          <p className="text-corps mt-4 text-encre-inverse/85">{t('intro')}</p>
        </div>

        <div className="flex w-full flex-col items-center gap-6 desktop:flex-row desktop:justify-center desktop:gap-8">
          <CarteEtat cle="termine" plein={false} />

          {/* La liaison nomme le controleur : c'est tout le propos, le
              commentaire de ce fichier le disait deja. Elle etait pourtant le
              texte le plus petit et le moins contraste de la section — 12 px
              a 75 % — et tenue dans 160 px.

              Elle prend le traitement que la Home a fixe pour les siennes :
              14 px, encre pleine, 9,81:1. La regle y est ecrite en toutes
              lettres — une phrase qui porte le mecanisme ne peut etre ni le
              texte le moins lisible du bloc ni le plus petit. */}
          <p className="flex w-[200px] shrink-0 flex-col items-center gap-3 text-center">
            <span aria-hidden className="h-px w-10 bg-encre-inverse/40" />
            <span className="text-corps text-encre-inverse">{t('liaison')}</span>
            <span aria-hidden className="h-px w-10 bg-encre-inverse/40" />
          </p>

          <CarteEtat cle="pret" plein />
        </div>
      </Reveal>
    </Section>
  );
}

function CarteEtat({ cle, plein }: { cle: 'termine' | 'pret'; plein: boolean }) {
  const t = useTranslations(`solutions.jonction.${cle}`);

  // 340 px et non 280 : c'est la largeur d'ecran du site, celle des reserves
  // de la section memoire juste en dessous et des colonnes de Produit. A 280
  // les deux cartes occupaient un cinquieme du conteneur chacune, pour porter
  // la regle fondatrice du produit.
  return (
    <div className="w-full max-w-[340px] rounded-carte border border-filet bg-surface p-6 text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
      {/* L'etat passe devant le bien, comme sur les cartes de la Home : c'est
          lui qui dit ce qu'est cette carte, et ici c'est tout le sujet — on
          lit TERMINÉ puis PRÊT en parcourant la rangee. */}
      <div className="flex items-center gap-3">
        <span
          className={
            plein
              ? 'text-label shrink-0 rounded-capsule bg-cta px-2.5 py-1 font-bold text-cta-encre'
              : 'text-label shrink-0 rounded-capsule border border-filet px-2.5 py-1 font-bold text-encre-douce'
          }
        >
          {t('etat')}
        </span>
        <span className="font-serif text-intro">{t('bien')}</span>
      </div>

      <p className="text-micro mt-3 text-encre-douce">{t('meta')}</p>

      <p className="text-corps mt-3 flex items-center gap-2 border-t border-filet pt-3">
        <Icon
          name="coche"
          size={16}
          graisse="bold"
          className={`shrink-0 ${plein ? 'text-accent' : 'text-cta'}`}
        />
        {t('fait')}
      </p>
    </div>
  );
}
