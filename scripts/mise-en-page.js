(() => {
  // Ce que l'audit de contraste et de débordement ne voit pas : la mise en
  // page qui tient techniquement mais qui laisse la moitié de la colonne
  // vide. C'est le défaut du tunnel — entre les ruptures, personne ne
  // regarde, et une largeur maximale figée y devient un trou.
  const L = document.documentElement.clientWidth;
  const res = { largeur: L, hauteur: document.body.scrollHeight, vides: [], orphelines: [], contenant: null };

  const nom = (el) => {
    const s = el.closest('section');
    const t = s && (s.querySelector('h1,h2,h3') || {}).textContent;
    return (t ? t.trim().replace(/\s+/g, ' ').slice(0, 26) : (s && s.id) || 'hors section');
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().width > 0;
  };
  // Largeur utile du parent : sa boîte moins ses paddings.
  const utile = (p) => {
    const cs = getComputedStyle(p);
    return p.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  };

  // Largeur du contenant de section, pour situer les mesures.
  const s1 = document.querySelector('main section > div');
  if (s1) res.contenant = Math.round(utile(s1));

  // 1 — Blocs seuls sur leur ligne, nettement plus étroits que leur colonne.
  //     Les porteurs de texte sont exclus : une mesure de 62ch est voulue.
  const PORTE_TEXTE = /^(P|H1|H2|H3|H4|H5|H6|LI|BLOCKQUOTE|SPAN|A|BUTTON|LABEL|DT|DD|FIGCAPTION)$/;
  document.querySelectorAll('main *').forEach((el) => {
    if (PORTE_TEXTE.test(el.tagName)) return;
    // Un bloc qui porte du texte est étroit parce qu'on l'a mesuré :
    // 62ch est une décision, pas un trou. Seuls les blocs visuels comptent.
    if (el.textContent.trim().length > 40) return;
    if (!visible(el)) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'absolute' || cs.position === 'fixed') return;
    if (cs.display.startsWith('inline')) return;
    const p = el.parentElement;
    if (!p || p.tagName === 'BODY') return;
    const dispoP = utile(p);
    if (dispoP < 200) return;
    const b = el.getBoundingClientRect();
    // Une icône ou une pastille n'occupe pas une colonne : elle la ponctue.
    if (b.width < 80) return;
    // Un frère posé à côté (chevauchement vertical, décalage horizontal)
    // signifie que la colonne n'est pas vide : ce n'est pas un trou.
    const cote = [...p.children].some((f) => {
      if (f === el || !visible(f)) return false;
      const c = f.getBoundingClientRect();
      return c.bottom > b.top + 4 && c.top < b.bottom - 4 && (c.left >= b.right - 4 || c.right <= b.left + 4);
    });
    if (cote) return;
    // Un bloc centre laisse deux marges egales : cela se lit comme une
    // respiration, pas comme un oubli. Le detecteur ne mesurait que la
    // largeur et sonnait donc sur des blocs volontairement centres.
    const rp = p.getBoundingClientRect();
    const gauche = b.left - (rp.left + parseFloat(cs.paddingLeft));
    const droite = (rp.right - parseFloat(cs.paddingRight)) - b.right;
    if (Math.abs(gauche - droite) < 8) return;

    const part = b.width / dispoP;
    const trou = dispoP - b.width;
    if (part < 0.65 && trou > 140) {
      // Ne remonter que le bloc le plus haut d'une même chaîne : un enfant
      // hérite du trou de son parent, le signaler deux fois n'apprend rien.
      res.vides.push({
        section: nom(el),
        el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
        largeur: Math.round(b.width), dispo: Math.round(dispoP),
        part: +(part * 100).toFixed(0), trou: Math.round(trou),
        profondeur: (() => { let n = el, d = 0; while (n !== document.body) { n = n.parentElement; d++; } return d; })(),
      });
    }
  });
  // Élaguer : si un ancêtre du même trou est déjà listé, garder l'ancêtre.
  res.vides = res.vides.filter((v, i, a) =>
    !a.some((w, j) => j !== i && w.section === v.section && Math.abs(w.trou - v.trou) < 24 && w.profondeur < v.profondeur));

  // 2 — Dernière rangée orpheline dans une grille ou un flex qui passe.
  document.querySelectorAll('main *').forEach((el) => {
    const cs = getComputedStyle(el);
    const grille = cs.display === 'grid' || cs.display === 'inline-grid';
    const passe = cs.display.includes('flex') && cs.flexWrap === 'wrap';
    if (!grille && !passe) return;
    const enfants = [...el.children].filter(visible);
    if (enfants.length < 3) return;
    const rangs = new Map();
    enfants.forEach((f) => {
      const t = Math.round(f.getBoundingClientRect().top);
      const cle = [...rangs.keys()].find((k) => Math.abs(k - t) < 8);
      (rangs.get(cle ?? t) || rangs.set(t, []).get(t)).push(f);
    });
    const tailles = [...rangs.values()].map((r) => r.length);
    if (tailles.length < 2) return;
    const plein = Math.max(...tailles), dernier = tailles[tailles.length - 1];
    if (dernier < plein) {
      res.orphelines.push({
        section: nom(el), items: enfants.length,
        rangees: tailles.join('+'), colonnes: plein,
      });
    }
  });

  return JSON.stringify(res);
})()
