# Portfolio — Édouard Bengehya

Site personnel statique. Le contenu est centralisé.

- Faits (coordonnées, dates, niveaux, fichiers) : [`src/data/facts.js`](src/data/facts.js)
- Textes français, anglais et espagnol : [`src/data/i18n.js`](src/data/i18n.js)

Le « 4+ » dans `facts.experienceYears` est le positionnement déclaré. Il ne se calcule pas en additionnant les postes, dont certains se chevauchent.

## Langues et thème

Les pages sont `/`, `/en.html`, `/es.html`, plus les CV `/cv.html`, `/cv-en.html`, `/cv-es.html`.

Le mode clair ou sombre est choisi dans l’en-tête. Il est mémorisé dans `localStorage` (`theme`). La première visite suit `prefers-color-scheme`.

## Images

Remplacez les fichiers de `public/images/` en gardant le même nom :

- `profile-placeholder.jpg` — portrait
- `network-placeholder.jpg`
- `telecom-placeholder.jpg`
- `development-placeholder.jpg`
- `technology-placeholder.jpg`

## Signature

Déposez la signature manuscrite en PNG transparent :

`public/images/signature.png`

Puis passez `signature.available` à `true` dans `src/data/facts.js`. Aucune signature n’est inventée.

## Certificats

Les cartes existent déjà. Pour afficher un document, déposez une version publique (recadrée s’il y a une donnée sensible) et renseignez `file`, par exemple `/images/certificates/reseaux.pdf`, sur l’entrée correspondante de `facts.certifications`. Tant que `file` est vide, le bouton « Voir le document » n’apparaît pas.

Le passeport ne doit pas être publié.

## CV

Une seule source produit les six fichiers :

- `public/cv/cv-edouard-bengehya-fr.pdf` et `.docx`
- `public/cv/cv-edouard-bengehya-en.pdf` et `.docx`
- `public/cv/cv-edouard-bengehya-es.pdf` et `.docx`

```bash
npm run generate:cv
```

`npm run build` fait la même chose. Le PDF est l’impression des pages CV. Le Word reprend `src/cv/model.js`.

L’adresse postale du CV source est sur le CV téléchargeable, pas dans le bandeau de contact de la page d’accueil.

## URL publique

Renseignez `siteUrl` dans `src/data/facts.js` ou exportez `SITE_URL` au build pour activer les balises canoniques.

## Développement

```bash
npm install
npm run dev
npm run build
```

Il n’y a pas de script `lint` ni `test`.
