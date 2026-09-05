import { useTranslations } from 'next-intl';

import { FiletAccent } from '../ui/FiletAccent';
import { Reserve } from '../ui/Reserve';
import { Section } from '../ui/Section';

/**
 * Les metiers qui ouvrent l'application.
 *
 * La maquette en presentait trois, dont le dirigeant. Sa carte est retiree :
 * elle decrivait un usage — « Regarde le parc une fois le matin » — et le
 * dirigeant n'ouvre pas Choucas. Le titre ne parle donc plus d'ecrans.
 *
 * Les deux photographies n'existent pas : leur place est reservee au format
 * 4/5 de la maquette, sans rien dessiner dedans.
 */
const METIERS = ['exploitation', 'terrain'] as const;

export function TroisMetiers() {
  const t = useTranslations('solutions.metiers');

  return (
    <Section fond="fond" aria-labelledby="metiers-titre">
      <FiletAccent />
      <h2 id="metiers-titre" className="font-serif text-h3 mt-6 max-w-[20ch] text-balance">
        {t('titre')}
      </h2>

      <ul className="mt-titre grid gap-8 tablette:grid-cols-2 desktop:max-w-[840px]">
        {METIERS.map((cle) => (
          <li key={cle} className="flex flex-col gap-5">
            <Reserve ratio="4 / 5" largeurMax={400} />
            <div>
              <h3 className="font-serif text-h3">{t(`${cle}.role`)}</h3>
              <p className="text-corps mt-2 text-encre-douce">{t(`${cle}.phrase`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
