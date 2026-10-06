/**
 * Données du portfolio — seul fichier à modifier pour le contenu.
 *
 * Images : remplacez les fichiers dans public/images/ en gardant le même nom,
 * ou changez le chemin `src` ci-dessous. Le reste du site n'a pas à changer.
 *
 * Niveaux de compétence (`level`) :
 *   "advanced"      → Expertise avancée
 *   "strong"        → Très bonne maîtrise
 *   "professional"  → Maîtrise professionnelle
 *   "good"          → Bonne maîtrise
 *   "progressing"   → En progression
 *   "unset"         → À préciser
 *
 * Signature : déposez le PNG transparent dans public/images/signature.png
 * puis passez signature.available à true. Ne jamais inventer une signature.
 *
 * URL du site : renseignez site.url (https://… sans slash final)
 * ou la variable d'environnement SITE_URL au moment du build.
 *
 * Après une modification, régénérez le CV :
 *   npm run generate:cv
 */

export const portfolio = {
  site: {
    url: "",
    title: "Édouard Bengehya — Ingénieur Réseaux & Télécoms | Développeur Full-Stack",
    description:
      "Édouard Bengehya, ingénieur Réseaux & Télécoms, développeur Full-Stack et entrepreneur digital spécialisé dans les infrastructures réseau, le développement logiciel et les solutions numériques.",
    locale: "fr_FR",
    themeColor: "#101418",
    copyrightYear: 2026,
    imageCredit:
      "Photographies temporaires sous licence Unsplash — à remplacer par vos propres visuels.",
  },

  profile: {
    firstName: "Édouard",
    lastName: "Bengehya",
    name: "Édouard Bengehya",
    initials: "ÉB",
    badge: "Ingénieur • Full-Stack • Digital",
    title: "Ingénieur Réseaux & Télécoms | Développeur Full-Stack | Entrepreneur Digital",
    roles: [
      "Ingénieur Réseaux & Télécoms",
      "Développeur Full-Stack",
      "Entrepreneur Digital",
    ],
    positioning:
      "Professionnel des technologies numériques spécialisé dans les réseaux, les télécommunications, le développement Full-Stack et la conception de solutions digitales.",
    heroLead:
      "Je transforme les besoins technologiques en solutions numériques modernes, connectées et performantes.",
    heroSecondary:
      "À la croisée des réseaux & télécommunications, du développement logiciel et de l'innovation digitale.",
    heroDescription:
      "Passionné par les technologies, les infrastructures réseau et le développement logiciel, je conçois des solutions numériques modernes capables de répondre à des besoins techniques et métiers concrets.",
    aboutTitle: "À propos de moi",
    about: [
      "Je suis Édouard Bengehya, ingénieur spécialisé dans les réseaux et télécommunications, développeur Full-Stack et jeune entrepreneur digital.",
      "Mon parcours combine les infrastructures réseau, les technologies informatiques et le développement de solutions numériques.",
      "Je m'intéresse particulièrement à la conception de solutions fiables, modernes et adaptées aux besoins réels des entreprises et des utilisateurs.",
    ],
    approachTitle: "Mon approche",
    approach: [
      "Comprendre le problème",
      "Analyser les besoins",
      "Concevoir une solution",
      "Développer et intégrer",
      "Tester",
      "Déployer",
      "Améliorer continuellement",
    ],
  },

  contact: {
    email: "edouardbengehya@gmail.com",
    phoneDisplay: "+243 992 749 668",
    phoneHref: "+243992749668",
  },

  socialLinks: [
    { id: "linkedin", label: "LinkedIn", url: "" },
    { id: "github", label: "GitHub", url: "" },
  ],

  navigation: [
    { href: "#accueil", label: "Accueil" },
    { href: "#a-propos", label: "À propos" },
    { href: "#expertise", label: "Expertise" },
    { href: "#competences", label: "Compétences" },
    { href: "#experience", label: "Expérience" },
    { href: "#formation", label: "Formation" },
    { href: "#cv", label: "CV" },
    { href: "#contact", label: "Contact" },
  ],

  highlights: [
    { kicker: "01", label: "Domaines d'expertise" },
    { kicker: "Full-Stack", label: "Développement" },
    { kicker: "Network", label: "Infrastructure" },
    { kicker: "Digital", label: "Entrepreneuriat" },
  ],

  expertiseIntro:
    "Quatre domaines complémentaires, au service de solutions numériques concrètes.",

  expertise: [
    {
      index: "01",
      title: "Réseaux & Télécommunications",
      description:
        "Conception, configuration et compréhension des infrastructures réseau et des solutions de connectivité.",
      image: "network",
      skills: [
        "Réseaux informatiques",
        "TCP/IP",
        "Routage",
        "Switching",
        "Wi-Fi",
        "MikroTik",
        "Infrastructure réseau",
        "Connectivité",
        "Télécommunications",
      ],
    },
    {
      index: "02",
      title: "Développement Full-Stack",
      description:
        "Conception et développement d'applications web modernes, du frontend au backend.",
      image: "development",
      skills: [
        "PHP",
        "Laravel",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Bootstrap",
        "MySQL",
        "API REST",
        "Git",
        "GitHub",
        "Composer",
        "Vite",
      ],
    },
    {
      index: "03",
      title: "Infrastructure & Systèmes",
      description:
        "Déploiement et gestion d'environnements techniques nécessaires au fonctionnement des solutions numériques.",
      image: "technology",
      skills: [
        "Serveurs",
        "Hébergement",
        "DNS",
        "Déploiement",
        "Configuration",
        "Infrastructure",
        "Maintenance",
        "Sécurité de base",
      ],
    },
    {
      index: "04",
      title: "Entrepreneuriat digital",
      description: "Conception et développement de solutions numériques répondant à des besoins concrets.",
      image: null,
      skills: [
        "Innovation",
        "Gestion de projet",
        "Conception produit",
        "Analyse des besoins",
        "Transformation digitale",
        "Stratégie numérique",
        "Vision produit",
      ],
    },
  ],

  skillsIntro:
    "Un aperçu des technologies et des domaines sur lesquels j'interviens. Le niveau de chaque compétence se règle dans les données du site.",

  skillsScale:
    "Échelle disponible : Expertise avancée, Très bonne maîtrise, Maîtrise professionnelle, Bonne maîtrise, En progression.",

  skillLevels: {
    advanced: { label: "Expertise avancée", rank: 5 },
    strong: { label: "Très bonne maîtrise", rank: 4 },
    professional: { label: "Maîtrise professionnelle", rank: 3 },
    good: { label: "Bonne maîtrise", rank: 2 },
    progressing: { label: "En progression", rank: 1 },
    unset: { label: "À préciser", rank: 0 },
  },

  skillGroups: [
    {
      id: "network",
      label: "Network & Telecom",
      skills: [
        { name: "MikroTik", icon: "antenna", level: "unset" },
        { name: "TCP/IP", icon: "network", level: "unset" },
        { name: "Wi-Fi", icon: "wifi", level: "unset" },
        { name: "Routing", icon: "route", level: "unset" },
        { name: "Switching", icon: "switch", level: "unset" },
        { name: "Infrastructure réseau", icon: "server", level: "unset" },
        { name: "Télécommunications", icon: "antenna", level: "unset" },
      ],
    },
    {
      id: "development",
      label: "Development",
      skills: [
        { name: "PHP", icon: "code", level: "unset" },
        { name: "Laravel", icon: "layers", level: "unset" },
        { name: "JavaScript", icon: "code", level: "unset" },
        { name: "HTML5", icon: "layout", level: "unset" },
        { name: "CSS3", icon: "layout", level: "unset" },
        { name: "Bootstrap", icon: "layout", level: "unset" },
        { name: "MySQL", icon: "database", level: "unset" },
        { name: "REST API", icon: "api", level: "unset" },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      skills: [
        { name: "Git", icon: "git", level: "unset" },
        { name: "GitHub", icon: "git", level: "unset" },
        { name: "Composer", icon: "package", level: "unset" },
        { name: "Vite", icon: "bolt", level: "unset" },
        { name: "VS Code", icon: "terminal", level: "unset" },
        { name: "XAMPP", icon: "server", level: "unset" },
      ],
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      skills: [
        { name: "Servers", icon: "server", level: "unset" },
        { name: "Hosting", icon: "cloud", level: "unset" },
        { name: "DNS", icon: "globe", level: "unset" },
        { name: "Deployment", icon: "rocket", level: "unset" },
        { name: "Network Infrastructure", icon: "network", level: "unset" },
      ],
    },
  ],

  experienceIntro:
    "Les expériences confirmées seront ajoutées ici. Les cartes suivantes sont des emplacements prêts à être complétés.",

  experience: [
    {
      placeholder: true,
      role: "[POSTE]",
      company: "[ENTREPRISE]",
      location: "[LOCALISATION]",
      period: "[PÉRIODE]",
      description: "[DESCRIPTION]",
      responsibilities: ["[RESPONSABILITÉ]"],
      technologies: ["[TECHNOLOGIE]"],
    },
  ],

  educationIntro:
    "Le parcours académique confirmé sera ajouté ici. Aucun diplôme n'est affiché tant qu'il n'est pas renseigné.",

  education: [
    {
      placeholder: true,
      degree: "[DIPLÔME]",
      school: "[ÉTABLISSEMENT]",
      specialty: "[SPÉCIALITÉ]",
      year: "[ANNÉE]",
    },
  ],

  certificationsIntro:
    "Les certifications et formations professionnelles confirmées seront ajoutées ici, avec leur lien de vérification lorsqu'il existe.",

  certifications: [
    {
      placeholder: true,
      name: "[NOM]",
      issuer: "[ORGANISME]",
      date: "[DATE]",
      credentialId: "[NUMÉRO]",
      url: "",
    },
  ],

  entrepreneur: {
    title: "Entrepreneur Digital",
    text: "En complément de mon parcours technique, je développe une vision entrepreneuriale orientée vers l'innovation et la création de solutions numériques capables de répondre à des problématiques concrètes.",
    cards: [
      {
        index: "01",
        title: "Innovation",
        text: "Imaginer et développer de nouvelles solutions numériques.",
      },
      {
        index: "02",
        title: "Technologie",
        text: "Utiliser les technologies modernes pour résoudre des problèmes réels.",
      },
      {
        index: "03",
        title: "Vision",
        text: "Identifier les opportunités et construire des solutions évolutives.",
      },
    ],
  },

  cv: {
    title: "Mon CV professionnel",
    intro: "Consultez mon parcours professionnel, mes compétences et mon expérience.",
    viewLabel: "Voir mon CV",
    pdfLabel: "Télécharger en PDF",
    docxLabel: "Télécharger en Word",
    viewPath: "/cv.html",
    pdfPath: "/cv/cv-edouard-bengehya.pdf",
    docxPath: "/cv/cv-edouard-bengehya.docx",
    pdfFilename: "cv-edouard-bengehya.pdf",
    docxFilename: "cv-edouard-bengehya.docx",
  },

  languages: [
    { placeholder: true, name: "[LANGUE]", level: "[NIVEAU]" },
  ],

  signature: {
    src: "/images/signature.png",
    available: false,
    alt: "Signature manuscrite d'Édouard Bengehya",
    name: "Édouard Bengehya",
  },

  images: {
    profile: {
      src: "/images/profile-placeholder.jpg",
      alt: "Visuel temporaire du profil d'Édouard Bengehya, à remplacer par une photo personnelle.",
    },
    network: {
      src: "/images/network-placeholder.jpg",
      alt: "Baie de serveurs et câblage, visuel temporaire d'infrastructure réseau.",
    },
    telecom: {
      src: "/images/telecom-placeholder.jpg",
      alt: "Pylône de télécommunications et antennes, visuel temporaire.",
    },
    development: {
      src: "/images/development-placeholder.jpg",
      alt: "Écran montrant du code web, visuel temporaire de développement logiciel.",
    },
    technology: {
      src: "/images/technology-placeholder.jpg",
      alt: "Carte électronique, visuel temporaire de technologie et d'infrastructure.",
    },
    og: {
      src: "/images/og-cover.jpg",
      alt: "Édouard Bengehya, ingénieur réseaux et télécoms, développeur full-stack et entrepreneur digital.",
      width: 1200,
      height: 630,
    },
  },

  contactSection: {
    title: "Discutons de votre prochain projet",
    text: "Vous recherchez un profil technique capable d'intervenir sur les réseaux, le développement logiciel ou les solutions digitales ? N'hésitez pas à me contacter.",
    emailButton: "Envoyer un email",
    callButton: "Appeler",
    cvButton: "Télécharger mon CV",
  },

  cta: {
    title: "Construisons quelque chose de performant.",
    text: "Une expertise technique combinant réseaux, développement et innovation digitale.",
    cvButton: "Télécharger mon CV",
    contactButton: "Me contacter",
  },

  heroActions: {
    profile: "Voir mon profil",
    cv: "Télécharger mon CV",
    contact: "Me contacter",
  },
};
