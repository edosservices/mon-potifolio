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

- `profile.jpg` — portrait principal (hero et CV)
- `profile-smile.jpg` et `profile-outdoor.jpg` — portraits de la section profil
- `field-network.jpg`, `field-camera.jpg` et `field-site.jpg` — photos de terrain
- `certificates/` — attestations publiques

## Signature

Le CV public ne comporte pas de signature.

## Certificats

Les fichiers publics sont dans `public/images/certificates/`. L’attestation de Hope Africa University est publiée sans la date de naissance, le lieu de naissance ni le matricule.

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
