/**
 * Modèle de CV normalisé, une langue à la fois.
 * Source : portfolioFor(locale) dans src/data/portfolio.js
 */

export function buildCvModel(data) {
  const publicPhones = (data.contact.phones || []).filter((phone) => phone.public);
  const cvPhones = data.contact.phones || [];

  return {
    locale: data.locale,
    docLang: data.docLang,
    name: data.profile.name,
    civilName: data.profile.civilName,
    title: data.profile.title,
    roles: data.profile.roles,
    photo: data.images.profile,
    email: data.contact.email,
    phones: cvPhones,
    publicPhones,
    addressLine: data.contact.addressLine,
    city: data.contact.city,
    nationality: data.profile.nationality,
    quote: data.profile.quote,
    educationNote: data.profile.educationNote,
    interests: data.profile.interests || [],
    skillGroups: data.skillGroups || [],
    experience: data.experience || [],
    education: data.education || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    signature: data.signature,
    headings: data.headings,
    ui: data.ui,
    cvFiles: data.cvFiles,
    routes: data.routes,
  };
}
