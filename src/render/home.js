import { levelMeta } from "../cv/model.js";
import { portfolio as fallback } from "../data/portfolio.js";
import { icon } from "./icons.js";
import {
  absoluteUrl,
  escapeHtml,
  jsonScript,
  mailto,
  resolveSiteUrl,
  safeUrl,
  tel,
} from "./html.js";

function imageOf(data, key) {
  return data.images[key];
}

function token(value, placeholder) {
  const text = escapeHtml(value);
  return placeholder ? `<span class="token">${text}</span>` : text;
}

function ticks() {
  return `<span class="tick tick--tl" aria-hidden="true"></span><span class="tick tick--tr" aria-hidden="true"></span><span class="tick tick--bl" aria-hidden="true"></span><span class="tick tick--br" aria-hidden="true"></span>`;
}

function frameImage(image, { eager = false, caption = "" } = {}) {
  const loading = eager ? "eager" : "lazy";
  const priority = eager ? ' fetchpriority="high"' : "";
  const captionHtml = caption
    ? `<figcaption>${escapeHtml(caption)}</figcaption>`
    : "";
  return `<div class="frame">${ticks()}<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="${loading}" decoding="async"${priority} />${captionHtml}</div>`;
}

function actionLink({ href, label, className, download, iconName }) {
  const url = safeUrl(href);
  if (!url) return "";
  const downloadAttr = download ? ` download="${escapeHtml(download)}"` : "";
  const glyph = iconName ? icon(iconName) : "";
  return `<a class="${className}" href="${escapeHtml(url)}"${downloadAttr}>${escapeHtml(label)}${glyph}</a>`;
}

function socialItems(data) {
  return (data.socialLinks || [])
    .map((item) => {
      const url = safeUrl(item.url);
      if (!url) {
        return `<li><span class="social social--pending"><span class="social__label">${escapeHtml(item.label)}</span><span class="social__state">Lien à ajouter</span></span></li>`;
      }
      const external = url.startsWith("http")
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<li><a class="social" href="${escapeHtml(url)}"${external}><span class="social__label">${escapeHtml(item.label)}</span></a></li>`;
    })
    .join("");
}

function renderHead(data, { path }) {
  const siteUrl = resolveSiteUrl(data.site);
  const canonical = absoluteUrl(siteUrl, path);
  const image = absoluteUrl(siteUrl, data.images.og.src);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.name,
    givenName: data.profile.firstName,
    familyName: data.profile.lastName,
    jobTitle: data.profile.title,
    description: data.profile.positioning,
    email: `mailto:${data.contact.email}`,
    telephone: data.contact.phoneHref,
    knowsAbout: [
      "Réseaux informatiques",
      "Télécommunications",
      "Développement Full-Stack",
      "Infrastructure informatique",
      "Entrepreneuriat digital",
    ],
  };
  if (canonical) person.url = canonical;
  const sameAs = (data.socialLinks || []).map((item) => safeUrl(item.url)).filter((url) => url.startsWith("http"));
  if (sameAs.length) person.sameAs = sameAs;

  return `
    <title>${escapeHtml(data.site.title)}</title>
    <meta name="description" content="${escapeHtml(data.site.description)}" />
    <meta name="author" content="${escapeHtml(data.profile.name)}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="${escapeHtml(data.site.themeColor)}" />
    <meta property="og:type" content="profile" />
    <meta property="og:locale" content="${escapeHtml(data.site.locale)}" />
    <meta property="og:title" content="${escapeHtml(data.site.title)}" />
    <meta property="og:description" content="${escapeHtml(data.site.description)}" />
    <meta property="og:image:alt" content="${escapeHtml(data.images.og.alt)}" />
    <meta property="profile:first_name" content="${escapeHtml(data.profile.firstName)}" />
    <meta property="profile:last_name" content="${escapeHtml(data.profile.lastName)}" />
    ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ""}
    ${canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}" />` : ""}
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : `<meta property="og:image" content="${escapeHtml(data.images.og.src)}" />`}
    ${image ? `<meta property="og:image:width" content="${data.images.og.width}" /><meta property="og:image:height" content="${data.images.og.height}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(data.site.title)}" />
    <meta name="twitter:description" content="${escapeHtml(data.site.description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : `<meta name="twitter:image" content="${escapeHtml(data.images.og.src)}" />`}
    <script type="application/ld+json">${jsonScript(person)}</script>
  `;
}

function renderHeader(data) {
  const links = data.navigation
    .map(
      (item) =>
        `<li><a class="nav-link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
    )
    .join("");

  return `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <header class="site-header">
      <div class="container site-header__bar">
        <a class="logo" href="#accueil">
          <span class="logo__mark" aria-hidden="true">${escapeHtml(data.profile.initials)}</span>
          <span class="logo__text">
            <span class="logo__name">${escapeHtml(data.profile.name)}</span>
            <span class="logo__role">Réseaux · Full-Stack · Digital</span>
          </span>
        </a>
        <nav id="navigation" class="nav-panel" aria-label="Navigation principale">
          <ul class="nav-list">${links}</ul>
        </nav>
        <a class="btn btn--primary header__cta" href="#contact">Me contacter</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation">
          <span class="sr-only">Ouvrir le menu</span>
          <span class="icon-open">${icon("menu")}</span>
          <span class="icon-close">${icon("close")}</span>
        </button>
      </div>
    </header>
  `;
}

function renderHero(data) {
  const roles = data.profile.roles.map((role) => `<span>${escapeHtml(role)}</span>`).join("");
  const highlights = data.highlights
    .map(
      (item) =>
        `<li><span class="highlights__kicker">${escapeHtml(item.kicker)}</span><span class="highlights__label">${escapeHtml(item.label)}</span></li>`,
    )
    .join("");

  return `
    <section id="accueil" class="hero" aria-labelledby="hero-title">
      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="badge">${escapeHtml(data.profile.badge)}</p>
          <h1 id="hero-title">
            <span class="hero__name">${escapeHtml(data.profile.name)}</span>
            <span class="hero__roles">${roles}</span>
          </h1>
          <p class="hero__lead">${escapeHtml(data.profile.heroLead)}</p>
          <p class="hero__secondary">${escapeHtml(data.profile.heroSecondary)}</p>
          <p class="hero__text">${escapeHtml(data.profile.heroDescription)}</p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="#a-propos">${escapeHtml(data.heroActions.profile)}${icon("arrow")}</a>
            ${actionLink({
              href: data.cv.pdfPath,
              label: data.heroActions.cv,
              className: "btn btn--secondary",
              download: data.cv.pdfFilename,
              iconName: "download",
            })}
            <a class="btn btn--ghost" href="#contact">${escapeHtml(data.heroActions.contact)}</a>
          </div>
        </div>
        <figure class="hero__visual">
          ${frameImage(imageOf(data, "telecom"), {
            eager: true,
            caption: "Visuel temporaire — Télécommunications",
          })}
        </figure>
      </div>
      <div class="container">
        <ul class="highlights" aria-label="Repères professionnels">${highlights}</ul>
      </div>
    </section>
  `;
}

function renderAbout(data) {
  const paragraphs = [
    `<p class="lead">${escapeHtml(data.profile.positioning)}</p>`,
    ...data.profile.about.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
  ].join("");
  const steps = data.profile.approach
    .map(
      (step, index) =>
        `<li><span class="approach__index">${String(index + 1).padStart(2, "0")}</span><span class="approach__label">${escapeHtml(step)}</span></li>`,
    )
    .join("");

  return `
    <section id="a-propos" class="section section--white" aria-labelledby="about-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">01 — Profil</p>
          <h2 id="about-title">${escapeHtml(data.profile.aboutTitle)}</h2>
        </header>
        <div class="about__grid">
          <div class="prose">${paragraphs}</div>
          <figure class="portrait">
            <div class="frame frame--portrait">
              ${ticks()}
              <img src="${escapeHtml(data.images.profile.src)}" alt="${escapeHtml(data.images.profile.alt)}" width="1000" height="1250" loading="lazy" decoding="async" />
            </div>
            <figcaption>Portrait temporaire, à remplacer</figcaption>
          </figure>
        </div>
        <div class="approach-block">
          <h3>${escapeHtml(data.profile.approachTitle)}</h3>
          <ol class="approach">${steps}</ol>
        </div>
      </div>
    </section>
  `;
}

function renderExpertise(data) {
  const cards = data.expertise
    .map((item) => {
      const chips = item.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
      const media = item.image
        ? `<div class="card__media">${frameImage(imageOf(data, item.image))}</div>`
        : `<div class="card__media card__media--type"><span>${escapeHtml(item.index)}</span></div>`;
      return `
        <article class="card">
          ${media}
          <div class="card__body">
            <p class="card__index">${escapeHtml(item.index)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <ul class="chips">${chips}</ul>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section id="expertise" class="section" aria-labelledby="expertise-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">02 — Domaines</p>
          <h2 id="expertise-title">Domaines d'expertise</h2>
          <p>${escapeHtml(data.expertiseIntro)}</p>
        </header>
        <div class="card-grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderLevel(level) {
  if (!level || !level.rank) {
    return `<span class="level"><span class="level__label">${escapeHtml(level?.label || "À préciser")}</span></span>`;
  }
  const dots = [1, 2, 3, 4, 5]
    .map((step) => `<i class="${step <= level.rank ? "is-on" : ""}"></i>`)
    .join("");
  return `<span class="level"><span class="level__meter" aria-hidden="true">${dots}</span><span class="level__label">${escapeHtml(level.label)}</span></span>`;
}

function renderSkills(data) {
  const groups = data.skillGroups
    .map((group) => {
      const items = group.skills
        .map((skill) => {
          const level = levelMeta(data.skillLevels, skill.level);
          return `
            <li class="skill">
              <span class="skill__icon">${icon(skill.icon)}</span>
              <span class="skill__name">${escapeHtml(skill.name)}</span>
              <span class="skill__meta"><span>${escapeHtml(group.label)}</span>${renderLevel(level)}</span>
            </li>
          `;
        })
        .join("");
      return `
        <section class="skill-group" aria-labelledby="group-${escapeHtml(group.id)}">
          <h3 id="group-${escapeHtml(group.id)}">${escapeHtml(group.label)}</h3>
          <ul class="skill-list">${items}</ul>
        </section>
      `;
    })
    .join("");

  return `
    <section id="competences" class="section section--white" aria-labelledby="skills-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">03 — Savoir-faire</p>
          <h2 id="skills-title">Expertise technique</h2>
          <p>${escapeHtml(data.skillsIntro)}</p>
          <p class="note">${escapeHtml(data.skillsScale)}</p>
        </header>
        <div class="skill-grid">${groups}</div>
      </div>
    </section>
  `;
}

function renderExperience(data) {
  const items = data.experience
    .map((item) => {
      const pending = Boolean(item.placeholder);
      const duties = (item.responsibilities || [])
        .map((duty) => `<li>${token(duty, pending)}</li>`)
        .join("");
      const tech = (item.technologies || [])
        .map((name) => `<li>${token(name, pending)}</li>`)
        .join("");
      return `
        <article class="entry${pending ? " is-placeholder" : ""}" ${pending ? 'aria-label="Expérience professionnelle à compléter"' : ""}>
          ${pending ? '<p class="entry__badge">À compléter</p>' : ""}
          <p class="entry__period">${token(item.period, pending)}</p>
          <h3>${token(item.role, pending)}</h3>
          <p class="entry__org">${token(item.company, pending)} <span aria-hidden="true">·</span> ${token(item.location, pending)}</p>
          <p>${token(item.description, pending)}</p>
          ${duties ? `<h4>Responsabilités</h4><ul>${duties}</ul>` : ""}
          ${tech ? `<h4>Technologies</h4><ul class="chips">${tech}</ul>` : ""}
        </article>
      `;
    })
    .join("");

  return `
    <section id="experience" class="section" aria-labelledby="experience-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">04 — Parcours</p>
          <h2 id="experience-title">Expérience professionnelle</h2>
          <p>${escapeHtml(data.experienceIntro)}</p>
        </header>
        <div class="timeline">${items}</div>
      </div>
    </section>
  `;
}

function renderEducation(data) {
  const items = data.education
    .map((item) => {
      const pending = Boolean(item.placeholder);
      return `
        <article class="entry${pending ? " is-placeholder" : ""}" ${pending ? 'aria-label="Formation à compléter"' : ""}>
          ${pending ? '<p class="entry__badge">À compléter</p>' : ""}
          <p class="entry__period">${token(item.year, pending)}</p>
          <h3>${token(item.degree, pending)}</h3>
          <p class="entry__org">${token(item.school, pending)}</p>
          <p>${token(item.specialty, pending)}</p>
        </article>
      `;
    })
    .join("");

  return `
    <section id="formation" class="section section--white" aria-labelledby="education-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">05 — Académique</p>
          <h2 id="education-title">Formation &amp; parcours académique</h2>
          <p>${escapeHtml(data.educationIntro)}</p>
        </header>
        <div class="timeline">${items}</div>
      </div>
    </section>
  `;
}

function renderCertifications(data) {
  const cards = data.certifications
    .map((item) => {
      const pending = Boolean(item.placeholder);
      const url = safeUrl(item.url);
      const verify = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Vérifier la certification</a>`
        : `<span class="token">Lien de vérification à ajouter</span>`;
      return `
        <article class="entry${pending ? " is-placeholder" : ""}" ${pending ? 'aria-label="Certification à compléter"' : ""}>
          ${pending ? '<p class="entry__badge">À compléter</p>' : ""}
          <p class="entry__period">${token(item.date, pending)}</p>
          <h3>${token(item.name, pending)}</h3>
          <p class="entry__org">${token(item.issuer, pending)}</p>
          <p>Numéro : ${token(item.credentialId, pending)}</p>
          <p>${verify}</p>
        </article>
      `;
    })
    .join("");

  return `
    <section id="certifications" class="section" aria-labelledby="certifications-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">06 — Reconnaissances</p>
          <h2 id="certifications-title">Certifications &amp; formations professionnelles</h2>
          <p>${escapeHtml(data.certificationsIntro)}</p>
        </header>
        <div class="timeline">${cards}</div>
      </div>
    </section>
  `;
}

function renderVenture(data) {
  const cards = data.entrepreneur.cards
    .map(
      (card) => `
        <article class="venture-card">
          <p class="card__index">${escapeHtml(card.index)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `,
    )
    .join("");

  return `
    <section id="entrepreneur" class="section section--dark" aria-labelledby="venture-title" data-reveal>
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">07 — Initiative</p>
          <h2 id="venture-title">${escapeHtml(data.entrepreneur.title)}</h2>
          <p>${escapeHtml(data.entrepreneur.text)}</p>
        </header>
        <div class="venture-grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderCvBand(data) {
  return `
    <section id="cv" class="section section--white" aria-labelledby="cv-title" data-reveal>
      <div class="container cv-band">
        <div>
          <header class="section-head">
            <p class="eyebrow">08 — Candidature</p>
            <h2 id="cv-title">${escapeHtml(data.cv.title)}</h2>
            <p>${escapeHtml(data.cv.intro)}</p>
          </header>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${escapeHtml(safeUrl(data.cv.viewPath))}">${escapeHtml(data.cv.viewLabel)}${icon("arrow")}</a>
            ${actionLink({
              href: data.cv.pdfPath,
              label: data.cv.pdfLabel,
              className: "btn btn--secondary",
              download: data.cv.pdfFilename,
              iconName: "download",
            })}
            ${actionLink({
              href: data.cv.docxPath,
              label: data.cv.docxLabel,
              className: "btn btn--secondary",
              download: data.cv.docxFilename,
              iconName: "download",
            })}
          </div>
        </div>
        <a class="cv-preview" href="${escapeHtml(safeUrl(data.cv.viewPath))}">
          <span class="cv-preview__sheet" aria-hidden="true">
            <span class="cv-preview__name">${escapeHtml(data.profile.name)}</span>
            <span class="cv-preview__role">${escapeHtml(data.profile.roles[0])}</span>
            <span class="cv-preview__line"></span>
            <span class="cv-preview__line"></span>
            <span class="cv-preview__line cv-preview__line--short"></span>
          </span>
          <span class="cv-preview__label">Ouvrir la version consultable</span>
        </a>
      </div>
    </section>
  `;
}

function renderContact(data) {
  const email = mailto(data.contact.email);
  const phone = tel(data.contact.phoneHref);
  return `
    <section id="contact" class="section" aria-labelledby="contact-title" data-reveal>
      <div class="container contact">
        <div>
          <header class="section-head">
            <p class="eyebrow">09 — Contact</p>
            <h2 id="contact-title">${escapeHtml(data.contactSection.title)}</h2>
            <p>${escapeHtml(data.contactSection.text)}</p>
          </header>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${escapeHtml(email)}">${icon("mail")}${escapeHtml(data.contactSection.emailButton)}</a>
            <a class="btn btn--secondary" href="${escapeHtml(phone)}">${icon("phone")}${escapeHtml(data.contactSection.callButton)}</a>
            ${actionLink({
              href: data.cv.pdfPath,
              label: data.contactSection.cvButton,
              className: "btn btn--secondary",
              download: data.cv.pdfFilename,
              iconName: "download",
            })}
          </div>
        </div>
        <div class="contact__panel">
          <a class="info-card" href="${escapeHtml(email)}">
            <span>Email</span>
            <strong>${escapeHtml(data.contact.email)}</strong>
          </a>
          <a class="info-card" href="${escapeHtml(phone)}">
            <span>Téléphone</span>
            <strong>${escapeHtml(data.contact.phoneDisplay)}</strong>
          </a>
          <ul class="social-list" aria-label="Réseaux professionnels">${socialItems(data)}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderCta(data) {
  return `
    <section class="cta" aria-labelledby="cta-title" data-reveal>
      <div class="container">
        <h2 id="cta-title">${escapeHtml(data.cta.title)}</h2>
        <p>${escapeHtml(data.cta.text)}</p>
        <div class="hero__actions">
          ${actionLink({
            href: data.cv.pdfPath,
            label: data.cta.cvButton,
            className: "btn btn--primary",
            download: data.cv.pdfFilename,
            iconName: "download",
          })}
          <a class="btn btn--secondary" href="#contact">${escapeHtml(data.cta.contactButton)}</a>
        </div>
      </div>
    </section>
  `;
}

function renderFooter(data) {
  const links = data.navigation
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`,
    )
    .join("");
  const email = mailto(data.contact.email);
  const phone = tel(data.contact.phoneHref);

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <p class="footer__name">${escapeHtml(data.profile.name)}</p>
            <p class="footer__title">${escapeHtml(data.profile.title)}</p>
          </div>
          <div>
            <p class="footer__label">Contact</p>
            <ul class="footer__links">
              <li><a href="${escapeHtml(email)}">${escapeHtml(data.contact.email)}</a></li>
              <li><a href="${escapeHtml(phone)}">${escapeHtml(data.contact.phoneDisplay)}</a></li>
            </ul>
            <ul class="social-list social-list--footer" aria-label="Réseaux professionnels">${socialItems(data)}</ul>
          </div>
          <nav aria-label="Navigation du pied de page">
            <p class="footer__label">Navigation</p>
            <ul class="footer__links footer__links--grid">${links}</ul>
          </nav>
        </div>
        <div class="footer__base">
          <p>© ${escapeHtml(data.site.copyrightYear)} ${escapeHtml(data.profile.name)}. Tous droits réservés.</p>
          <p>${escapeHtml(data.site.imageCredit)}</p>
        </div>
      </div>
    </footer>
  `;
}

export function renderHome(data = fallback) {
  return {
    head: renderHead(data, { path: "/" }),
    body: `
      ${renderHeader(data)}
      <main id="contenu" tabindex="-1">
        ${renderHero(data)}
        ${renderAbout(data)}
        ${renderExpertise(data)}
        ${renderSkills(data)}
        ${renderExperience(data)}
        ${renderEducation(data)}
        ${renderCertifications(data)}
        ${renderVenture(data)}
        ${renderCvBand(data)}
        ${renderContact(data)}
        ${renderCta(data)}
      </main>
      ${renderFooter(data)}
    `,
  };
}
