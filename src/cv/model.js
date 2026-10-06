/**
 * Modèle de CV normalisé.
 *
 * Source unique : src/data/portfolio.js
 * Consommateurs :
 * - page HTML imprimable (src/render/cv.js)
 * - générateur DOCX (scripts/generate-docx.mjs)
 * - PDF : impression de la page HTML (scripts/generate-pdf.mjs)
 *
 * Pour régénérer les fichiers après une modification des données :
 *   npm run generate:cv
 */

export function levelMeta(levels, key) {
  if (levels && levels[key]) return levels[key];
  if (levels && levels.unset) return levels.unset;
  return { label: "À préciser", rank: 0 };
}

export function buildCvModel(data) {
  const socials = (data.socialLinks || []).filter((item) => String(item.url || "").trim());

  return {
    name: data.profile.name,
    title: data.profile.title,
    photo: data.images.profile,
    contact: {
      email: data.contact.email,
      phoneDisplay: data.contact.phoneDisplay,
      phoneHref: data.contact.phoneHref,
      socials,
    },
    positioning: data.profile.positioning,
    paragraphs: data.profile.about || [],
    skillGroups: (data.skillGroups || []).map((group) => ({
      label: group.label,
      skills: (group.skills || []).map((skill) => ({
        name: skill.name,
        level: levelMeta(data.skillLevels, skill.level),
      })),
    })),
    experience: data.experience || [],
    education: data.education || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    signature: data.signature,
  };
}
