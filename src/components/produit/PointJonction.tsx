import { useTranslations } from 'next-intl';

import blocExceptions from '../../../public/demo/bloc-exceptions.png';

import { Accent } from '../ui/Accent';
import { CaptureProduit } from '../ui/CaptureProduit';
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
 *
 * ---------------------------------------------------------------------------
 * L'ECRAN REEL REJOINT LA DEMONSTRATION. 15 septembre 2026, a la demande du
 * fondateur : « je mettrais les ecrans de l'app pour valider et montrer la
 * mise en situation ».
 *
 * La section enoncait la regle avec deux cartes dessinees pour elle. Elles
 * disent bien la regle, mais rien ne prouvait qu'un ecran la demande vraiment.
 *
 * `bloc-exceptions.png` la prouve, et il n'a pas ete fabrique pour ca : il
 * etait deja dans le depot, inutilise. On y lit « Chalet L'Aiguille — Menage
 * depart terminee 10:25, en attente de controle », avec sa pastille A
 * controler. MEME CHALET, MEME HEURE que la carte TERMINÉ posee a cote. Rien
 * n'a ete accorde apres coup : les deux racontent le meme moment.
 *
 * C'est donc la situation a gauche et ce qu'elle produit a droite. Les deux
 * cartes passent de la rangee a la pile pour laisser la colonne d'ecran :
 * empilees, TERMINÉ puis PRÊT se lisent comme une suite, ce qu'elles sont, et
 * la liaison qui nomme le controleur tombe entre les deux au lieu d'etre a
 * cote.
 *
 * ⚠️ CE FICHIER A D'ABORD PRIS `accueil-responsable.png`, L'ECRAN ENTIER.
 * Il disait la meme chose, mais il le disait au milieu de huit lignes de
 * journee sans rapport, et il fallait le couper a 560 px sur 985 pour tenir.
 * Le bloc EXCEPTIONS seul est le meme moment sans le reste : aucune coupe,
 * aucun fondu, et l'ecran entier repart au hero de la page — ou il porte
 * « une journee de conciergerie », ce qu'il est vraiment.
 *
 * Une capture ne sert bien qu'a un seul endroit d'une page. Les deux y
 * seraient, a deux ecrans de distance, et le lecteur aurait cru voir deux fois
 * la meme illustration.
 * ---------------------------------------------------------------------------
 */
export function PointJonction() {
  const t = useTranslations('solutions.jonction');
  const manager = useTranslations('manager');

  return (
    <Section fond="sapin" aria-labelledby="jonction-titre">
      <Reveal className="mx-auto flex max-w-[1160px] flex-col items-center gap-14">
        <div className="max-w-[600px] text-center">
          <h2 id="jonction-titre" className="font-serif text-h3 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent ton="inverse">{chunks}</Accent> })}
          </h2>
          <p className="text-corps mt-4 text-encre-inverse/85">{t('intro')}</p>
        </div>

        {/* Deux pistes FIXES, 440 et 440, centrees — 944 px dans un conteneur
            de 1 160. Une seconde piste en `1fr` donnerait tout le reste a des
            cartes plafonnees, et le vide d'un seul cote reviendrait.

            Elargies de 340 a 440 le 19 septembre 2026 : la section porte la
            demonstration de la regle fondatrice du produit, elle ne peut pas
            etre le bloc le plus etroit de la page.

            Sous 1 000 px tout s'empile et l'ecran passe devant — on voit la
            demande de controle avant de lire ce qu'elle produit. */}
        <div className="grid w-full items-center gap-10 desktop:grid-cols-[440px_440px] desktop:justify-center desktop:gap-16">
          <figure className="m-0 flex flex-col items-center gap-2">
            {/* Ni `hauteurMax` ni `rayon="haut"` : 1036 x 1158 donne 380 px
                de haut a 340 de large. Le bloc tient entier, il n'a rien a
                couper et rien a laisser croire qu'il continue. */}
            <CaptureProduit
              src={blocExceptions}
              alt={t('captureAlt')}
              libelleLien={manager('lienDemo')}
              largeurMax={440}
              cadre
              ombre={false}
            />
            <figcaption className="text-micro max-w-[440px] text-center text-encre-inverse/85">
              {t('captureLegende')}
            </figcaption>
          </figure>

          <div className="flex flex-col items-center gap-5 desktop:items-start">
            <CarteEtat cle="termine" plein={false} />

            {/* La liaison nomme le controleur : c'est tout le propos, le
                commentaire de ce fichier le disait deja. Elle etait pourtant le
                texte le plus petit et le moins contraste de la section — 12 px
                a 75 % — et tenue dans 160 px.

                Elle prend le traitement que la Home a fixe pour les siennes :
                14 px, encre pleine, 9,81:1. La regle y est ecrite en toutes
                lettres — une phrase qui porte le mecanisme ne peut etre ni le
                texte le moins lisible du bloc ni le plus petit.

                Les filets passent a la verticale avec la pile : un trait
                horizontal entre deux cartes empilees ne relie plus rien. */}
            <p className="flex w-full max-w-[440px] flex-col items-center gap-2 text-center">
              <span aria-hidden className="h-5 w-px bg-encre-inverse/40" />
              <span className="text-corps text-encre-inverse">{t('liaison')}</span>
              <span aria-hidden className="h-5 w-px bg-encre-inverse/40" />
            </p>

            <CarteEtat cle="pret" plein />
          </div>
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
    <div className="w-full max-w-[440px] rounded-carte border border-filet bg-surface p-6 text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
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
