/**
 * Verrou du site avant ouverture : authentification HTTP basique.
 *
 * Le site n'est pas public. Cette fonction s'exécute en amont de tout — pages,
 * images, sitemap — et renvoie 401 tant que le visiteur n'a pas donné le
 * couple identifiant / mot de passe. Un robot d'indexation reçoit ce 401 et
 * repart sans rien lire.
 *
 * La protection par mot de passe intégrée de Netlify est réservée aux offres
 * payantes ; une fonction de périphérie fait le même travail sur toutes les
 * offres, et le mot de passe reste une variable d'environnement, jamais une
 * ligne de ce dépôt.
 *
 * Elle s'applique aussi aux aperçus de déploiement et aux branches : c'est
 * voulu, ce sont les URL les plus faciles à trouver par accident.
 *
 * ⚠️ À supprimer le jour de l'ouverture — ce fichier, sa déclaration dans
 * netlify.toml, et l'en-tête X-Robots-Tag qui l'accompagne.
 */

const IDENTIFIANT = 'SITE_IDENTIFIANT';
const MOT_DE_PASSE = 'SITE_MOT_DE_PASSE';

/** Comparaison à temps constant : une comparaison naïve fuit la longueur. */
function memeSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let ecart = 0;
  for (let i = 0; i < a.length; i++) ecart |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ecart === 0;
}

function refuser(message: string, statut: number): Response {
  return new Response(message, {
    status: statut,
    headers: {
      'WWW-Authenticate': 'Basic realm="Choucas", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      // Ni cache ni indexation d'une reponse de refus.
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

const protection = async (request: Request): Promise<Response | void> => {
  const identifiantAttendu = Deno.env.get(IDENTIFIANT) ?? 'choucas';
  const motDePasseAttendu = Deno.env.get(MOT_DE_PASSE);

  // Sans mot de passe configure, on ferme : une variable oubliee ne doit
  // jamais ouvrir le site par defaut.
  if (!motDePasseAttendu) {
    return refuser(
      `Le site est verrouille et la variable ${MOT_DE_PASSE} n'est pas definie sur Netlify.`,
      503,
    );
  }

  const entete = request.headers.get('Authorization') ?? '';
  const [schema, valeur] = entete.split(' ');
  if (schema?.toLowerCase() !== 'basic' || !valeur) {
    return refuser('Authentification requise.', 401);
  }

  // `atob` rend des octets, pas du texte : un mot de passe accentue se
  // comparerait alors a une suite d'octets et ne correspondrait jamais. Le
  // realm annonce UTF-8, on decode en UTF-8.
  let decode: string;
  try {
    const octets = Uint8Array.from(atob(valeur), (c) => c.charCodeAt(0));
    decode = new TextDecoder('utf-8', { fatal: true }).decode(octets);
  } catch {
    return refuser('Authentification requise.', 401);
  }

  if (!decode.includes(':')) return refuser('Authentification requise.', 401);

  const separateur = decode.indexOf(':');
  const identifiant = decode.slice(0, separateur);
  const motDePasse = decode.slice(separateur + 1);

  if (!memeSecret(identifiant, identifiantAttendu) || !memeSecret(motDePasse, motDePasseAttendu)) {
    return refuser('Identifiants incorrects.', 401);
  }

  // Laisse passer vers le rendu Next.
};

export default protection;
