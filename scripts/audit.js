(() => {
  // Les couleurs calculees sortent en oklab avec un canal alpha : les lire a
  // la main donne des ratios faux. On les compose dans un canvas, qui fait
  // exactement ce que fait le navigateur.
  const cv = document.createElement('canvas'); cv.width = cv.height = 4;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const comp = (c, f) => { ctx.clearRect(0,0,4,4); ctx.fillStyle = f; ctx.fillRect(0,0,4,4);
    ctx.fillStyle = c; ctx.fillRect(0,0,4,4);
    const d = ctx.getImageData(2,2,1,1).data; return [d[0],d[1],d[2]]; };
  const lin = (v) => (v <= 0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4);
  const lum = ([r,g,b]) => 0.2126*lin(r/255)+0.7152*lin(g/255)+0.0722*lin(b/255);
  const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

  // Le premier fond reellement opaque en remontant : une couleur porteuse
  // d'alpha est translucide, le vrai fond est plus haut.
  const fondOpaque = (el) => {
    let n = el;
    while (n) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'transparent' && !/,\s*0\)$/.test(c) && !/\/\s*[\d.]+\s*\)/.test(c)) return c;
      n = n.parentElement;
    }
    return 'rgb(255,255,255)';
  };
  const chemin = (el) => {
    const s = el.closest('section');
    const t = s && (s.querySelector('h1,h2') || {}).textContent;
    return (t ? t.trim().replace(/\s+/g,' ').slice(0, 26) : (s ? s.id : 'hors section')) + ' › ' + el.tagName.toLowerCase();
  };

  const res = { debordent: [], contrastes: [], cibles: [], typo: {} };
  const largeur = document.documentElement.clientWidth;

  // 1 — Debordements horizontaux. Un ancetre qui coupe ou fait defiler n'en
  //     est pas un.
  document.querySelectorAll('body *').forEach((el) => {
    const b = el.getBoundingClientRect();
    if (b.width === 0) return;
    if (b.right <= largeur + 1 && b.left >= -1) return;
    let n = el.parentElement;
    while (n) { const o = getComputedStyle(n).overflowX;
      if (o === 'hidden' || o === 'auto' || o === 'scroll') return;
      n = n.parentElement; }
    res.debordent.push(chemin(el) + ' [' + Math.round(b.left) + '…' + Math.round(b.right) + ']');
  });

  // 2 — Contraste de chaque noeud de texte visible.
  const vus = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!direct) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) return;
    if (el.closest('[aria-hidden="true"]')) return;
    if (el.closest('.sr-only') || cs.clipPath === 'inset(50%)') return;
    const px = parseFloat(cs.fontSize), gras = parseInt(cs.fontWeight, 10) || 400;
    const grand = px >= 24 || (px >= 18.66 && gras >= 700);
    const seuil = grand ? 3 : 4.5;
    const fond = fondOpaque(el);
    const r = ratio(comp(cs.color, fond), comp(fond, fond));
    const cle = chemin(el) + '|' + cs.color + '|' + fond;
    if (vus.has(cle)) return;
    vus.add(cle);
    if (r < seuil) res.contrastes.push(
      `${chemin(el)} · ${px.toFixed(0)}px/${gras} · ${r.toFixed(2)}:1 < ${seuil} · « ${el.textContent.trim().slice(0, 34)} »`);
  });

  // 3 — Cibles tactiles. Regle du projet : 44 px.
  document.querySelectorAll('a, button, input, textarea, [role=radio]').forEach((el) => {
    if (!el.offsetParent) return;
    const b = el.getBoundingClientRect();
    if (b.height > 0 && (b.height < 44 || b.width < 24))
      res.cibles.push(chemin(el) + ' ' + Math.round(b.width) + '×' + Math.round(b.height)
        + ' « ' + el.textContent.trim().slice(0, 22) + ' »');
  });

  // 4 — Inventaire typographique : quelle taille pour quel role.
  const roles = { h1: 'h1', h2: 'h2', h3: 'h3', p: 'p', li: 'li' };
  Object.entries(roles).forEach(([k, sel]) => {
    const vals = new Map();
    document.querySelectorAll('main ' + sel).forEach((el) => {
      const cs = getComputedStyle(el);
      if (!el.textContent.trim()) return;
      const c = `${parseFloat(cs.fontSize).toFixed(1)}px/${cs.fontWeight}/${(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)).toFixed(2)}`;
      vals.set(c, (vals.get(c) || 0) + 1);
    });
    res.typo[k] = [...vals.entries()].map(([v, n]) => `${v} ×${n}`);
  });

  return JSON.stringify(res);
})()
