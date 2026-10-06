# Portfolio — Édouard Bengehya

Site vitrine personnel. Le contenu éditable est centralisé dans [`src/data/portfolio.js`](src/data/portfolio.js).

## Modifier les informations

Ouvrez `src/data/portfolio.js`.

- Coordonnées, textes, compétences, expériences, formation et certifications s'y trouvent.
- Tant qu'une information n'est pas confirmée, laissez le placeholder (`[POSTE]`, `[DIPLÔME]`, etc.).
- Niveaux de compétence : `advanced`, `strong`, `professional`, `good`, `progressing` ou `unset`.
- Réseaux : renseignez `url` pour LinkedIn, GitHub ou un autre lien. Un champ vide reste affiché comme « Lien à ajouter ».
- URL publique : renseignez `site.url` (sans slash final) pour activer la balise canonique et Open Graph. Vous pouvez aussi exporter `SITE_URL` au build.

## Remplacer les images

Les visuels temporaires sont dans `public/images/`. Remplacez le fichier en gardant le même nom :

- `profile-placeholder.jpg` — portrait
- `network-placeholder.jpg`
- `telecom-placeholder.jpg`
- `development-placeholder.jpg`
- `technology-placeholder.jpg`

Le composant lit le chemin déclaré dans `portfolio.js`. Aucune autre modification de structure n'est nécessaire.

## Signature manuscrite

Déposez votre signature au stylo, en PNG transparent, ici :

`public/images/signature.png`

Puis passez `signature.available` à `true` dans `src/data/portfolio.js`. Le site n'affiche pas de signature inventée.

## CV

La page consultable est `/cv.html`. Les fichiers téléchargeables sont :

- `public/cv/cv-edouard-bengehya.pdf`
- `public/cv/cv-edouard-bengehya.docx`

Ils sont produits à partir des mêmes données :

```bash
npm run generate:cv
```

`npm run build` régénère aussi ces fichiers. Le PDF est l'impression de la page CV. Le DOCX reprend le modèle décrit dans `src/cv/model.js`.

## Développement

```bash
npm install
npm run dev
npm run build
```
