/**
 * Faits indépendants de la langue.
 *
 * Le « 4+ » est le positionnement déclaré par le propriétaire du site.
 * Il ne doit pas être recalculé en additionnant les postes : Assistant IT
 * (janvier 2023 – octobre 2024), opérateur de saisie (octobre 2023 – février 2024)
 * et Omega Laboratory Technology (mars 2024 – mai 2024) se chevauchent.
 *
 * Date de naissance, sexe et état civil figurent sur le CV source et ne sont
 * pas repris ici : ce ne sont pas des données utiles au portfolio public.
 */

export const facts = {
  siteUrl: "",
  experienceYears: "4+",
  profile: {
    publicName: "Édouard Bengehya",
    firstName: "Édouard",
    lastName: "Bengehya",
    initials: "ÉB",
    civilName: "Mutumishi Bengehya Édouard",
  },
  contact: {
    email: "edouardbengehya@gmail.com",
    phones: [
      { id: "primary", display: "+243 992 749 668", href: "+243992749668", public: true },
      { id: "secondary", display: "+243 860 392 283", href: "+243860392283", public: false },
    ],
    addressLine: "Kinshasa, Com. Limité Q. Kingabwa Av. Lobo N° 27",
    city: "Kinshasa",
  },
  routes: {
    home: { fr: "/", en: "/en.html", es: "/es.html" },
    cv: { fr: "/cv.html", en: "/cv-en.html", es: "/cv-es.html" },
  },
  cvFiles: {
    fr: {
      pdf: "/cv/cv-edouard-bengehya-fr.pdf",
      pdfFilename: "cv-edouard-bengehya-fr.pdf",
      docx: "/cv/cv-edouard-bengehya-fr.docx",
      docxFilename: "cv-edouard-bengehya-fr.docx",
    },
    en: {
      pdf: "/cv/cv-edouard-bengehya-en.pdf",
      pdfFilename: "cv-edouard-bengehya-en.pdf",
      docx: "/cv/cv-edouard-bengehya-en.docx",
      docxFilename: "cv-edouard-bengehya-en.docx",
    },
    es: {
      pdf: "/cv/cv-edouard-bengehya-es.pdf",
      pdfFilename: "cv-edouard-bengehya-es.pdf",
      docx: "/cv/cv-edouard-bengehya-es.docx",
      docxFilename: "cv-edouard-bengehya-es.docx",
    },
  },
  experience: [
    { id: "ict", company: "ICT Net Africa", location: "Kasindi" },
    { id: "dgdaIt", company: "DGDA Kasindi", location: "Kasindi" },
    { id: "omega", company: "Omega Laboratory Technology", location: "" },
    { id: "dgdaData", company: "DGDA, Bureau Recette", location: "Kasindi" },
  ],
  education: [
    { id: "hau", school: "Hope Africa University", location: "Burundi", featured: true },
    { id: "ccna", school: "", location: "Burundi", featured: false },
    { id: "office", school: "", location: "Burundi", featured: false },
    { id: "agri", school: "", location: "Idjwi", featured: false },
  ],
  certifications: [
    { id: "hauAttestation", category: "academic", hours: null, file: "/images/certificates/attestation-hau.jpg" },
    { id: "networks90", category: "networks", hours: 90, file: "/images/certificates/reseaux-informatiques.jpg" },
    { id: "security90", category: "security", hours: 90, file: "/images/certificates/securite-reseaux.jpg" },
    { id: "maintenance90", category: "maintenance", hours: 90, file: "/images/certificates/maintenance.jpg" },
  ],
  skillGroups: [
    { id: "networkSecurity", skills: ["networkAdmin", "itSecurity", "protocols", "troubleshooting"] },
    { id: "support", skills: ["itSupport", "maintenance", "incidents", "install"] },
    { id: "web", skills: ["webDev", "html", "css", "php"] },
    { id: "surveillance", skills: ["cameras", "cabling", "securitySystems"] },
    { id: "office", skills: ["excel", "word", "powerpoint"] },
    { id: "cisco", skills: ["ciscoConfig", "ciscoTrouble"] },
  ],
  skillLevel: {
    networkAdmin: "advanced",
    itSecurity: "advanced",
    itSupport: "advanced",
    maintenance: "advanced",
    webDev: "advanced",
    excel: "strong",
    html: "professional",
    css: "professional",
    php: "professional",
    protocols: "professional",
    troubleshooting: "professional",
    incidents: "professional",
    install: "professional",
    cameras: "professional",
    cabling: "professional",
    securitySystems: "professional",
    word: "professional",
    powerpoint: "professional",
    ciscoConfig: "professional",
    ciscoTrouble: "professional",
  },
  expertise: [
    { id: "networks", index: "01", icon: "network", image: "fieldNetwork", frame: "tall" },
    { id: "support", index: "02", icon: "server", image: "fieldSite", frame: "tall" },
    { id: "fullstack", index: "03", icon: "code", image: "", frame: "wide" },
    { id: "surveillance", index: "04", icon: "shield", image: "fieldCamera", frame: "tall" },
  ],
  field: ["fieldNetwork", "fieldCamera", "fieldSite"],
  languages: [{ id: "fr" }, { id: "en" }, { id: "sw" }],
  signature: {
    src: "/images/signature.png",
    available: false,
  },
  images: {
    profile: { src: "/images/profile.jpg", webp: "/images/profile.webp", width: 536, height: 670 },
    profileSmile: { src: "/images/profile-smile.jpg", webp: "/images/profile-smile.webp", width: 864, height: 1080 },
    profileOutdoor: { src: "/images/profile-outdoor.jpg", webp: "/images/profile-outdoor.webp", width: 380, height: 475 },
    fieldNetwork: { src: "/images/field-network.jpg", webp: "/images/field-network.webp", width: 810, height: 1080 },
    fieldCamera: { src: "/images/field-camera.jpg", webp: "/images/field-camera.webp", width: 810, height: 1080 },
    fieldSite: { src: "/images/field-site.jpg", webp: "/images/field-site.webp", width: 810, height: 1080 },
    network: { src: "/images/network-placeholder.jpg", width: 1600, height: 1100 },
    telecom: { src: "/images/telecom-placeholder.jpg", width: 997, height: 1500 },
    development: { src: "/images/development-placeholder.jpg", width: 1600, height: 1060 },
    technology: { src: "/images/technology-placeholder.jpg", width: 1600, height: 1060 },
    og: { src: "/images/og-cover.jpg", width: 1200, height: 630 },
  },
  projectTechnologies: ["JavaScript"],
};
