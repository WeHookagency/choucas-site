import { useTranslations } from 'next-intl';

import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Qui vend, et ou en est le produit. Deux sections, posees le 14 septembre
 * 2026.
 *
 * Le site n'avait plus personne derriere lui depuis la suppression de la page
 * A propos : un dirigeant qui s'apprete a engager 2 000 € puis 300 € par mois
 * avec un independant veut savoir a qui il parle, et rien ne le lui disait.
 *
 * La copie vient de `aPropos.qui`, validee et restee au catalogue quand la
 * page A propos est partie. Rien n'est reecrit.
 *
 * Fond Lichen, une premiere sur la Home : il tombe entre la section tarifs, en
 * Panneau, et la FAQ, en Neige, et c'est la seule teinte claire de la charte
 * qui evite une repetition aux deux bords. Sur Lichen tout le texte est en
 * encre pleine : l'encre douce y mesure 2,34:1.
 */
export function QuiEstDerriere() {
  const t = useTranslations('aPropos');

  // Section « Ou en est Choucas » retiree le 14 septembre 2026, a la demande
  // du fondateur. Elle disait honnetement ou en est le produit — « au debut,
  // et je prefere le dire » — et servait de preuve sociale tant qu'il n'y a
  // pas de clientes.
  //
  // ⚠️ Ce qui part avec elle : la seule reponse du site a « depuis quand
  // existez-vous, combien etes-vous », et la phrase « si je disparais demain,
  // votre configuration ne disparait pas avec moi ». Les chaines
  // `aPropos.etat.*` restent au catalogue.
  return (
    <Section fond="respiration" aria-labelledby="qui-titre">
      <Reveal className="desktop:flex desktop:items-start desktop:gap-12 large:gap-16">
        <div className="desktop:min-w-0 desktop:flex-1">
          <h2 id="qui-titre" className="font-serif text-h3 text-balance">
            {t('qui.titre')}
          </h2>
          <p className="font-serif text-intro mt-6 font-semibold">{t('qui.lead')}</p>
          <p className="text-corps mt-5 max-w-[62ch]">{t('qui.p1')}</p>
          <p className="text-corps mt-4 max-w-[62ch]">{t('qui.p2')}</p>
        </div>

        {/* Le portrait bascule une seule fois, au seuil desktop : empile et
            centre en dessous, colonne a droite au-dessus. Entre les deux il
            n'existe pas de largeur ou il soit cale d'un cote avec la moitie de
            la colonne vide. Reglage repris de la page A propos, ou il avait
            ete mesure. */}
        <Photo
          src="/demo/mathieu.jpg"
          alt={t('portraitAlt')}
          className="mx-auto mt-10 max-w-[420px] desktop:mx-0 desktop:mt-0 desktop:w-[34%] desktop:max-w-[380px] desktop:shrink-0"
        />
      </Reveal>
    </Section>
  );
}
