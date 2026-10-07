/**
 * Assemblage du portfolio.
 *
 * Pour modifier un fait (téléphone, niveau, fichier de certificat) : src/data/facts.js
 * Pour modifier un texte : src/data/i18n.js
 *
 * Niveaux : advanced, strong, professional, good, progressing.
 * Le « 4+ » est déclaré dans facts.experienceYears. Ne pas le recalculer.
 *
 * Signature : public/images/signature.png puis facts.signature.available = true.
 * Certificat : renseigner facts.certifications[].file avec un chemin public
 * (/images/certificates/…) uniquement pour une version sans donnée sensible.
 *
 * URL du site : site.url ou la variable SITE_URL au build.
 */

import { facts } from "./facts.js";
import { dictionaries } from "./i18n.js";

const RANKS = { advanced: 5, strong: 4, professional: 3, good: 2, progressing: 1 };

export const locales = ["fr", "en", "es"];

export function portfolioFor(locale = "fr") {
  const copy = dictionaries[locale] || dictionaries.fr;
  const year = new Date().getFullYear();

  const skillGroups = facts.skillGroups.map((group) => ({
    id: group.id,
    label: copy.skills[group.id],
    skills: group.skills.map((id) => {
      const levelKey = facts.skillLevel[id] || "professional";
      return {
        id,
        name: copy.skills[id],
        level: levelKey,
        levelLabel: copy.levels[levelKey],
        rank: RANKS[levelKey] || 0,
      };
    }),
  }));

  return {
    locale: copy.code,
    htmlLang: copy.htmlLang,
    ogLocale: copy.ogLocale,
    docLang: copy.docLang,
    site: {
      url: facts.siteUrl,
      title: copy.seo.title,
      description: copy.seo.description,
      themeColorLight: "#f4f7fb",
      themeColorDark: "#070b12",
      copyrightYear: year,
      imageCredit: copy.seo.imageCredit,
    },
    profile: {
      ...facts.profile,
      name: facts.profile.publicName,
      title: copy.profile.title,
      roles: copy.profile.roles,
      heroLead: copy.profile.heroLead,
      quote: copy.profile.quote,
      educationNote: copy.profile.educationNote,
      nationality: copy.profile.nationality,
      interests: copy.profile.interests,
    },
    contact: facts.contact,
    routes: facts.routes,
    cvFiles: facts.cvFiles,
    navigation: copy.navigation,
    ui: copy.ui,
    indicators: copy.indicators.map((item) =>
      item.strong === "4+" || item.strong === "+4"
        ? { ...item, strong: item.strong === "+4" ? "+4" : facts.experienceYears }
        : item,
    ),
    experienceYears: facts.experienceYears,
    expertise: facts.expertise.map((item) => ({
      ...item,
      ...copy.expertise[item.id],
      image: facts.images[item.image]
        ? { ...facts.images[item.image], alt: copy.images[item.image], frame: item.frame || "wide" }
        : null,
    })),
    skillGroups,
    experience: facts.experience.map((item) => ({
      ...item,
      ...copy.experience[item.id],
    })),
    education: facts.education.map((item) => ({
      ...item,
      ...copy.education[item.id],
    })),
    certifications: facts.certifications.map((item) => ({
      ...item,
      ...copy.certifications[item.id],
      file: item.file,
      hours: item.hours,
    })),
    languages: facts.languages.map((item) => ({ id: item.id, ...copy.languages[item.id] })),
    venture: {
      title: copy.ui.ventureTitle,
      text: copy.ui.ventureText,
      points: copy.venturePoints.map(([title, text]) => ({ title, text })),
    },
    projectTechnologies: facts.projectTechnologies,
    signature: {
      ...facts.signature,
      alt: copy.signatureAlt,
      name: facts.profile.publicName,
    },
    images: Object.fromEntries(
      Object.entries(facts.images).map(([key, image]) => [key, { ...image, alt: copy.images[key] || "" }]),
    ),
    field: {
      items: facts.field.map((id) => ({
        ...facts.images[id],
        alt: copy.images[id],
        caption: copy.fieldCaptions[id],
      })),
    },
    seo: copy.seo,
    headings: {
      profile: copy.ui.profileHeading,
      skills: copy.ui.skillsHeading,
      experience: copy.ui.experienceHeading,
      education: copy.ui.educationHeading,
      certifications: copy.ui.certsHeading,
      languages: copy.ui.languagesHeading,
      interests: copy.ui.interestsHeading,
      signature: copy.ui.signatureHeading,
    },
  };
}

export const portfolio = portfolioFor("fr");
