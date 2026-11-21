# L'alchimie du chocolat — Commande en ligne

Site de commande de **L'alchimie du chocolat** (Waterloo · Ixelles), avec retrait en boutique.
Même moteur que le site du Menzïli, habillé aux couleurs de la carte des pralines.

- **Accueil épuré** (clientèle qui veut aller droit au but) : Saint-Nicolas, Composer mon ballotin, La carte, les nouveautés (`NEWS` dans `src/app.js`), les boutiques
- **La carte** (`/carte/`) : le catalogue refait en octobre (pralines, napolitains, palets, macarons, thés). Sur la fiche d'une praline, « Ajouter à mon ballotin » ouvre l'Atelier avec la praline déjà placée ; sur les autres, « Commander » mène à la bonne section
- **Commander** : ballotins, coffrets et gourmandises prêts à commander

- **Carte** : fêtes et précommandes, ballotins, les 52 pralines (photos détourées de la carte), napolitains, palets, macarons, thés, pâtes de fruits
- **L'Atelier** : 3 formats, puis chaque praline (filtres noir / lait / blanc / sans fruits à coque, « Compléter pour moi », petit mot pour la carte)
  - Ballotins (blancs, ruban rouge) au poids, 105 €/kg : 250 g 26,25 € · 350 g 36,75 € · 500 g 52,50 € · 750 g 78,75 € · 1 kg 105 €. Rangement par couche d'après le croquis de la boutique (250 g et 350 g), extrapolé pour 500 g / 750 g / 1 kg (`LAY` dans `src/app.js`), 3 couches
  - Coffrets (bleu nuit, ruban doré), prix fixe, plateau = bande de rectangles à gauche + grille de carrés (compté sur les photos) : 10 (3 carrés + 4 rectangles au milieu + 3 carrés) → 13,80 € · 17 (5 + 3×4) → 21,30 € · 27 (7 + 4×5) → 32,70 € · 38 (8 + 5×6) → 43,40 € · 52 (10 + 6×7) → 59,30 €
  - Sachet sur mesure au poids : estimation avec 9 g par praline (`PRALINE_G`), arrondie à 5 cents
- **Retrait en boutique** : Waterloo ou Ixelles, jour (jusqu'à 45 jours à l'avance, dates de fêtes mises en avant) et heure, option « C'est pour offrir »
- **Suivi en direct** côté client, **espace personnel** (`/staff/`) côté boutique, **points fidélité** avec QR

## ⚠️ À valider avec Jean-Sébastien et Géraldine avant de montrer aux clients

Tout est dans le début du script de `src/app.js` (`CONFIG`, `SIZES`, `MENU`, `OFFERS`) :

- Les prix des ballotins et coffrets sont les vrais tarifs ; ceux des autres produits (macarons, thés, palets…) sont encore provisoires
- Le nombre de pralines par ballotin (30 / 39 / 57 / 87 / 105) et le poids moyen d'une praline (9 g)
- Horaires d'Ixelles (repris de ceux de Waterloo : mardi → samedi 10:00–18:30), jours de fermeture exceptionnelle (`closedDates`)
- Les produits de fêtes (ballotin Saint-Nicolas, ballotin des fêtes) et les récompenses de points
- Nom de la société et numéro BCE (`CONFIG.legal`), liens Instagram / Facebook / avis Google
- Le tableau des allergènes (repris de l'ancien site : seuls G = gluten et N = fruits à coque sont affichés ; le code « L » de l'ancien site a été laissé de côté car il semblait mal étiqueté)

## Modifier le site

Le site est un seul fichier `index.html`, **généré** à partir de `src/` :

```
python3 src/build.py
```

- `src/app.js` : configuration, carte, atelier, panier, retrait, suivi
- `src/acc.js` : comptes, points, profil, pied de page, pages légales
- `src/extra.css` : l'habillage chocolaterie ; `src/base.css` : la base reprise du Menzïli
- Les données des pralines, palets, macarons, thés et napolitains viennent de la carte refaite en octobre (`Alchimie-Du-Chocolat-test`), les photos sont dans `assets/`

## Mode démo

Tant que Supabase n'est pas branché, le site fonctionne en **mode démo** : on peut tout tester (atelier, panier, finaliser), la commande reste sur le téléphone et son suivi avance tout seul. Un bandeau jaune le signale. Pratique pour montrer le site en boutique.

## Brancher les vraies commandes (Supabase, gratuit)

1. Crée un projet sur supabase.com, région **Europe**.
2. **SQL Editor** : exécute dans l'ordre `supabase/schema.sql`, `supabase/points.sql`, `supabase/commandes.sql`.
3. **Authentication → Providers → Email** activé ; **Email Templates → Magic Link** : un message qui contient le code, ex. `Votre code L'alchimie : {{ .Token }}`.
4. **Authentication → URL Configuration** : Site URL `https://kohdrare.github.io/Alchimie-Du-Chocolat/` et Redirect URL `https://kohdrare.github.io/Alchimie-Du-Chocolat/**`.
5. **Project Settings → API** : copie `Project URL` et la clé **publishable** dans `CONFIG.account` (`src/app.js`) **et** dans `CFG` en haut de `staff/index.html`, puis `python3 src/build.py`.
6. Ajoute le personnel (chaque personne se connecte d'abord une fois sur le site) :
   ```sql
   insert into public.team (user_id, name)
   select id, 'Géraldine' from auth.users where email = 'adresse@exemple.be'
   on conflict (user_id) do update set name = excluded.name;
   ```

La clé publishable est publique par conception ; la sécurité vient des règles RLS des fichiers SQL. Ne jamais mettre la clé **secret** dans le site.

## Espace personnel (`/staff/`)

À ouvrir sur la tablette ou le téléphone de chaque boutique (et à ajouter à l'écran d'accueil).
Commandes en direct (son + vibration), filtres Aujourd'hui / Waterloo / Ixelles / À venir, la composition complète de chaque ballotin, l'option cadeau et le petit mot pour la carte. Onglet « Scanner un client » pour les points.

## Hébergement

GitHub Pages, branche `main`, dossier racine.
