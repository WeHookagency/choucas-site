#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Espaces insecables de la ponctuation double francaise.

Une insecable avant « ? ! ; : » et avant le guillemet fermant, une apres le
guillemet ouvrant. Sans elle, un « ? » se retrouve seul en debut de ligne.

LE FRANCAIS SEUL, ET C'EST VERROUILLE ICI.

L'anglais ne met pas d'espace avant « ? » ou « : ». Appliquer cette regle a
en.json produit « No line is left hanging : it is assigned », qui est faux.
C'est arrive : une reecriture de ce script a modifie seize chaines anglaises
avant qu'on s'en apercoive au diff.

Le verrou n'est donc pas dans la consigne d'appel mais dans le code — le
chemin est construit ici, jamais recu, et `garde_le_francais` refuse tout ce
qui n'est pas fr.json. Un futur appelant ne peut pas se tromper : il n'a pas
de bouton pour ca.

Les chaines francaises qui dorment encore dans en.json sont des placeholders
en attendant la traduction ; elles partiront avec elle.

    python3 scripts/insec.py

Ecrit ce qu'il a corrige, ou « rien a corriger ». Se lance depuis n'importe
quel dossier : le chemin se resout depuis ce fichier.
"""
import collections
import io
import json
import pathlib
import re
import sys

# Insecable U+00A0, ecrite en echappement. Un heredoc la perd — ca s'est
# produit trois fois avant que ce fichier existe.
NB = ' '

RACINE = pathlib.Path(__file__).resolve().parent.parent
CIBLE = RACINE / 'src' / 'messages' / 'fr.json'


def garde_le_francais(chemin: pathlib.Path) -> pathlib.Path:
    """Refuse tout fichier qui n'est pas le catalogue francais."""
    if chemin.name != 'fr.json':
        raise SystemExit(
            f"insec.py n'ecrit que dans fr.json — refus de toucher {chemin.name}. "
            "La ponctuation double est une regle francaise."
        )
    return chemin


def corriger(s):
    if not isinstance(s, str):
        return s, False
    avant = s
    s = re.sub(r'[   ]*([;:!?])', NB + r'\1', s)
    s = re.sub(r'[   ]*(»)', NB + r'\1', s)
    s = re.sub(r'(«)[   ]*', r'\1' + NB, s)
    # Une URL, un protocole ou un horaire ne prennent pas d'insecable devant
    # leurs deux-points.
    s = re.sub(r'(https?|mailto|tel)' + NB + r':', r'\1:', s)
    s = re.sub(r'(\d)' + NB + r':(\d)', r'\1:\2', s)

    # L'apostrophe francaise est courbe, U+2019. La droite est un heritage
    # de la machine a ecrire : elle se lit comme un guillemet simple, coupe
    # les ligatures et n'est pas la meme lettre pour un correcteur.
    #
    # Le catalogue en portait les deux — 154 chaines en droite, 35 en courbe,
    # les courbes presque toutes dans la FAQ. Sur une meme page on lisait
    # donc « Un brief n'arrive jamais » puis « Ce qu'on nous demande ».
    #
    # Sans garde : en francais l'apostrophe est toujours entre deux lettres,
    # verifie sur les 154 occurrences. Ce n'est pas vrai en anglais, ou le
    # possessif pluriel la pose apres un s — raison de plus pour que ce
    # script ne touche jamais en.json.
    s = s.replace("'", '\u2019')

    # Un nombre ne se separe ni de son groupe de mille ni de son unite.
    # « 2 000 € » coupe en fin de ligne donne « 2 » puis « 000 € », et
    # « 20 € » donne « 20 » puis « € ». Les deux se sont produits.
    s = re.sub(r'(\d)[ ](\d{3})(?!\d)', r'\1' + NB + r'\2', s)
    s = re.sub(r'(\d)[ ](€|%|h\b|min\b)', r'\1' + NB + r'\2', s)
    return s, s != avant


def parcourir(o, chemin, touches):
    if isinstance(o, dict):
        for k, v in o.items():
            o[k] = parcourir(v, f'{chemin}.{k}' if chemin else k, touches)
        return o
    neuf, change = corriger(o)
    if change:
        touches.append(chemin)
    return neuf


def main():
    cible = garde_le_francais(CIBLE)
    d = json.load(io.open(cible, encoding='utf-8'),
                  object_pairs_hook=collections.OrderedDict)
    touches = []
    d = parcourir(d, '', touches)
    if touches:
        io.open(cible, 'w', encoding='utf-8').write(
            json.dumps(d, ensure_ascii=False, indent=2) + '\n')
    print(f'  {cible.name} : ' + (', '.join(touches) if touches else 'rien a corriger'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
