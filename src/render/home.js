import { portfolioFor } from "../data/portfolio.js";
import { icon } from "./icons.js";
import { absoluteUrl, escapeHtml, jsonScript, mailto, resolveSiteUrl, safeUrl, tel } from "./html.js";

function ticks() {
  return `<span class="tick tick--tl" aria-hidden="true"></span><span class="tick tick--tr" aria-hidden="true"></span><span class="tick tick--bl" aria-hidden="true"></span><span class="tick tick--br" aria-hidden="true"></span>`;
}

function frameImage(image, { eager = false, caption = "", wide = false } = {}) {
  if (!image) return "";
  const loading = eager ? "eager" : "lazy";
  const priority = eager ? ' fetchpriority="high"' : "";
  const captionHtml = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
  const klass = wide ? "frame frame--wide" : "frame";
  return `<figure class="${klass}">${ticks()}<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async"${priority} />${captionHtml}</figure>`;
}

function langSwitch(data, cluster) {
  const routes = cluster === "cv" ? data.routes.cv : data.routes.home;
  const links = ["fr", "en", "es"]
    .map((code) => {
      const current = code === data.locale ? ' aria-current="page"' : "";
      return `<a href="${escapeHtml(routes[code])}" hreflang="${code}" lang="${code}"${current}>${code.toUpperCase()}</a>`;
    })
    .join("");
  return `<nav class="lang" aria-label="${escapeHtml(data.ui.langLabel)}">${links}</nav>`;
}

function themeButton(data) {
  return `<button class="theme-toggle" type="button" aria-label="${escapeHtml(data.ui.themeToDark)}" data-to-dark="${escapeHtml(data.ui.themeToDark)}" data-to-light="${escapeHtml(data.ui.themeToLight)}"><span class="theme-toggle__sun">${icon("sun")}</span><span class="theme-toggle__moon">${icon("moon")}</span></button>`;
}

function renderHead(data) {
  const siteUrl = resolveSiteUrl(data.site);
  const path = data.routes.home[data.locale];
  const canonical = absoluteUrl(siteUrl, path === "/" ? "/" : path);
  const image = absoluteUrl(siteUrl, data.images.og.src);
  const alternates = ["fr", "en", "es"]
    .map((code) => {
      const href = absoluteUrl(siteUrl, data.routes.home[code] === "/" ? "/" : data.routes.home[code]);
      if (!href) return "";
      return `<link rel="alternate" hreflang="${code}" href="${escapeHtml(href)}" />`;
    })
    .filter(Boolean)
    .join("");
  const xDefault = absoluteUrl(siteUrl, "/");
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.name,
    givenName: data.profile.firstName,
    familyName: data.profile.lastName,
    jobTitle: data.profile.title,
    description: data.profile.heroLead,
    email: `mailto:${data.contact.email}`,
    telephone: data.contact.phones.find((phone) => phone.public)?.href,
    nationality: data.profile.nationality,
    address: { "@type": "PostalAddress", addressLocality: data.contact.city, addressCountry: "CD" },
    knowsAbout: data.expertise.map((item) => item.title),
    knowsLanguage: data.languages.map((item) => item.name),
  };
  if (canonical) person.url = canonical;

  return `
    <title>${escapeHtml(data.site.title)}</title>
    <meta name="description" content="${escapeHtml(data.site.description)}" />
    <meta name="author" content="${escapeHtml(data.profile.name)}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="profile" />
    <meta property="og:locale" content="${escapeHtml(data.ogLocale)}" />
    <meta property="og:locale:alternate" content="fr_FR" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:locale:alternate" content="es_ES" />
    <meta property="og:title" content="${escapeHtml(data.site.title)}" />
    <meta property="og:description" content="${escapeHtml(data.site.description)}" />
    <meta property="og:image:alt" content="${escapeHtml(data.images.og.alt)}" />
    <meta property="profile:first_name" content="${escapeHtml(data.profile.firstName)}" />
    <meta property="profile:last_name" content="${escapeHtml(data.profile.lastName)}" />
    ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ""}
    ${canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}" />` : ""}
    ${alternates}
    ${xDefault ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(xDefault)}" />` : ""}
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" /><meta property="og:image:width" content="${data.images.og.width}" /><meta property="og:image:height" content="${data.images.og.height}" />` : `<meta property="og:image" content="${escapeHtml(data.images.og.src)}" />`}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(data.site.title)}" />
    <meta name="twitter:description" content="${escapeHtml(data.site.description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : `<meta name="twitter:image" content="${escapeHtml(data.images.og.src)}" />`}
    <script type="application/ld+json">${jsonScript(person)}</script>
  `;
}

function renderHeader(data) {
  const links = data.navigation
    .map((item) => `<li><a class="nav-link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join("");
  const pdf = data.cvFiles[data.locale];
  return `
    <a class="skip-link" href="#contenu">${escapeHtml(data.ui.skip)}</a>
    <header class="site-header">
      <div class="container site-header__bar">
        <a class="logo" href="#accueil">
          <span class="logo__mark" aria-hidden="true">${escapeHtml(data.profile.initials)}</span>
          <span class="logo__text">
            <span class="logo__name">${escapeHtml(data.profile.name)}</span>
            <span class="logo__role">${escapeHtml(data.ui.logoRole)}</span>
          </span>
        </a>
        <div class="header__tools">
          ${langSwitch(data, "home")}
          ${themeButton(data)}
          <a class="btn btn--primary header__cta" href="${escapeHtml(pdf.pdf)}" download="${escapeHtml(pdf.pdfFilename)}">${escapeHtml(data.ui.downloadCv)}</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" data-open="${escapeHtml(data.ui.menuOpen)}" data-close="${escapeHtml(data.ui.menuClose)}">
            <span class="sr-only">${escapeHtml(data.ui.menuOpen)}</span>
            <span class="icon-open">${icon("menu")}</span>
            <span class="icon-close">${icon("close")}</span>
          </button>
        </div>
        <nav id="navigation" class="nav-panel" aria-label="${escapeHtml(data.ui.navLabel)}">
          <ul class="nav-list">${links}</ul>
          <a class="btn btn--primary nav-panel__cta" href="${escapeHtml(pdf.pdf)}" download="${escapeHtml(pdf.pdfFilename)}">${icon("download")}${escapeHtml(data.ui.downloadCv)}</a>
        </nav>
      </div>
    </header>
  `;
}

function renderHero(data) {
  const indicators = data.indicators
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.strong)}</strong>${item.text ? `<span>${escapeHtml(item.text)}</span>` : ""}</li>`,
    )
    .join("");
  const pdf = data.cvFiles[data.locale];
  return `
    <section class="hero" id="accueil" aria-labelledby="hero-title">
      <div class="container hero__grid">
        <div data-reveal>
          <p class="eyebrow">${escapeHtml(data.profile.roles.join(" · "))}</p>
          <h1 id="hero-title" class="hero__name">${escapeHtml(data.profile.name)}</h1>
          <p class="hero__lead">${escapeHtml(data.profile.heroLead)}</p>
          <ul class="indicators">${indicators}</ul>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${escapeHtml(pdf.pdf)}" download="${escapeHtml(pdf.pdfFilename)}">${icon("download")}${escapeHtml(data.ui.downloadCv)}</a>
            <a class="btn btn--secondary" href="#experience">${escapeHtml(data.ui.seeCareer)}</a>
            <a class="btn btn--secondary" href="#contact">${escapeHtml(data.ui.contactMe)}</a>
          </div>
        </div>
        ${frameImage(data.images.profile, { eager: true, caption: data.ui.photoCaption })}
      </div>
    </section>
  `;
}

function renderAbout(data) {
  const interests = data.profile.interests.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <section class="section" id="a-propos" aria-labelledby="about-title">
      <div class="container about">
        <div data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.aboutKicker)}</p>
          <h2 id="about-title">${escapeHtml(data.ui.aboutTitle)}</h2>
          <blockquote class="quote">${escapeHtml(data.profile.quote)}</blockquote>
          <p>${escapeHtml(data.profile.educationNote)}</p>
          <p class="meta-line">${escapeHtml(data.contact.city)} · ${escapeHtml(data.ui.nationalityLabel)}</p>
        </div>
        <div data-reveal>
          <h3>${escapeHtml(data.ui.interestsTitle)}</h3>
          <ul class="interest-list">${interests}</ul>
          ${frameImage(data.images.telecom, { wide: true })}
        </div>
      </div>
    </section>
  `;
}

function renderExpertise(data) {
  const cards = data.expertise
    .map((item) => {
      const points = item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
      const note = item.note ? `<p class="card__note">${escapeHtml(item.note)}</p>` : "";
      return `
        <article class="card" data-reveal>
          ${item.image ? frameImage(item.image, { wide: true }) : ""}
          <p class="card__index">${icon(item.icon)}<span>${escapeHtml(item.index)}</span></p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          <ul class="chips">${points}</ul>
          ${note}
        </article>
      `;
    })
    .join("");
  return `
    <section class="section section--tint" id="expertise" aria-labelledby="expertise-title">
      <div class="container">
        <div class="section__head" data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.expertiseKicker)}</p>
          <h2 id="expertise-title">${escapeHtml(data.ui.expertiseTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.expertiseIntro)}</p>
        </div>
        <div class="cards">${cards}</div>
      </div>
    </section>
  `;
}

function renderExperience(data) {
  const jobs = data.experience
    .map((job) => {
      const duties = job.duties.map((duty) => `<li>${escapeHtml(duty)}</li>`).join("");
      const used = job.used.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      const place = [job.company, job.location].filter(Boolean).join(" · ");
      return `
        <article class="job" data-reveal>
          <div class="job__rail" aria-hidden="true"><span class="job__dot"></span></div>
          <div>
            <p class="job__period">${escapeHtml(job.period)}</p>
            <h3>${escapeHtml(job.role)}</h3>
            <p class="job__place">${escapeHtml(place)}</p>
            <p>${escapeHtml(job.summary)}</p>
            <ul>${duties}</ul>
            <p class="job__used">${escapeHtml(data.ui.skillsUsed)}</p>
            <ul class="chips">${used}</ul>
          </div>
        </article>
      `;
    })
    .join("");
  return `
    <section class="section" id="experience" aria-labelledby="experience-title">
      <div class="container">
        <div class="section__head" data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.experienceKicker)}</p>
          <h2 id="experience-title">${escapeHtml(data.ui.experienceTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.experienceIntro)}</p>
        </div>
        <div class="timeline">${jobs}</div>
      </div>
    </section>
  `;
}

function renderEducation(data) {
  const items = data.education
    .map((item) => {
      const where = [item.school, item.location].filter(Boolean).join(" · ");
      const badge = item.featured ? `<p class="flag">${escapeHtml(data.ui.educationFeatured)}</p>` : "";
      const detail = item.detail ? `<p>${escapeHtml(item.detail)}</p>` : "";
      return `
        <article class="study${item.featured ? " study--main" : ""}" data-reveal>
          ${badge}
          <h3>${escapeHtml(item.program)}</h3>
          <p class="job__place">${escapeHtml(where)}</p>
          <p class="job__period">${escapeHtml(item.period)}</p>
          ${detail}
        </article>
      `;
    })
    .join("");
  return `
    <section class="section section--tint" id="formation" aria-labelledby="education-title">
      <div class="container">
        <div class="section__head" data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.educationKicker)}</p>
          <h2 id="education-title">${escapeHtml(data.ui.educationTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.educationIntro)}</p>
        </div>
        <div class="studies">${items}</div>
      </div>
    </section>
  `;
}

function renderCertifications(data) {
  const cards = data.certifications
    .map((item) => {
      const file = safeUrl(item.file);
      const issuer = item.issuer || data.ui.issuerUnknown;
      const date = item.date || data.ui.dateUnknown;
      const hours = item.hours ? `<p class="cert__hours">${escapeHtml(String(item.hours))} ${escapeHtml(data.ui.hoursUnit)}</p>` : "";
      const note = item.note ? `<p class="card__note">${escapeHtml(item.note)}</p>` : "";
      const action = file
        ? `<button class="btn btn--secondary" type="button" data-cert-open data-cert-src="${escapeHtml(file)}" data-cert-title="${escapeHtml(item.name)}">${escapeHtml(data.ui.viewDocument)}</button>`
        : `<p class="cert__pending">${escapeHtml(data.ui.documentPending)}</p>`;
      const plate = file
        ? ""
        : `<div class="cert__plate" aria-hidden="true"><span>${escapeHtml(item.domain)}</span></div>`;
      return `
        <article class="cert" data-reveal>
          ${plate}
          <p class="eyebrow">${escapeHtml(item.domain)}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(issuer)}</p>
          <p class="cert__date">${escapeHtml(date)}</p>
          ${hours}
          ${note}
          ${action}
        </article>
      `;
    })
    .join("");
  return `
    <section class="section" id="certifications" aria-labelledby="certs-title">
      <div class="container">
        <div class="section__head" data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.certsKicker)}</p>
          <h2 id="certs-title">${escapeHtml(data.ui.certsTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.certsIntro)}</p>
        </div>
        <div class="certs">${cards}</div>
      </div>
      <dialog class="cert-dialog" id="cert-dialog" aria-labelledby="cert-dialog-title">
        <div class="cert-dialog__bar">
          <h2 id="cert-dialog-title"></h2>
          <div class="cert-dialog__actions">
            <button class="btn btn--secondary" type="button" data-cert-zoom>${escapeHtml(data.ui.zoomDocument)}</button>
            <button class="btn btn--primary" type="button" data-cert-close>${escapeHtml(data.ui.closeDocument)}</button>
          </div>
        </div>
        <div class="cert-dialog__stage" data-cert-stage></div>
      </dialog>
    </section>
  `;
}

function renderSkills(data) {
  const groups = data.skillGroups
    .map((group) => {
      const rows = group.skills
        .map((skill) => {
          const pips = [1, 2, 3, 4, 5]
            .map((step) => `<i class="${step <= skill.rank ? "is-on" : ""}"></i>`)
            .join("");
          return `
            <li class="skill">
              <span class="skill__name">${escapeHtml(skill.name)}</span>
              <span class="pips" aria-hidden="true">${pips}</span>
              <span class="skill__level">${escapeHtml(skill.levelLabel)}</span>
            </li>
          `;
        })
        .join("");
      return `
        <section class="skill-group" data-reveal aria-labelledby="skill-${escapeHtml(group.id)}">
          <h3 id="skill-${escapeHtml(group.id)}">${escapeHtml(group.label)}</h3>
          <ul>${rows}</ul>
        </section>
      `;
    })
    .join("");
  const extra = data.projectTechnologies.map((name) => `<li>${escapeHtml(name)}</li>`).join("");
  return `
    <section class="section section--tint" id="competences" aria-labelledby="skills-title">
      <div class="container">
        <div class="section__head" data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.skillsKicker)}</p>
          <h2 id="skills-title">${escapeHtml(data.ui.skillsTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.skillsIntro)}</p>
        </div>
        <div class="skill-groups">${groups}</div>
        <aside class="aside" data-reveal>
          <h3>${escapeHtml(data.ui.projectTechTitle)}</h3>
          <ul class="chips">${extra}</ul>
          <p>${escapeHtml(data.ui.projectTechNote)}</p>
        </aside>
      </div>
    </section>
  `;
}

function renderVenture(data) {
  const points = data.venture.points
    .map((item, index) => `<li><span>0${index + 1}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></li>`)
    .join("");
  return `
    <section class="band" id="entrepreneur" aria-labelledby="venture-title">
      <div class="container" data-reveal>
        <p class="eyebrow">${escapeHtml(data.ui.ventureKicker)}</p>
        <h2 id="venture-title">${escapeHtml(data.venture.title)}</h2>
        <p class="lede">${escapeHtml(data.venture.text)}</p>
        <ol class="venture">${points}</ol>
      </div>
    </section>
  `;
}

function renderCvBand(data) {
  const blocks = ["fr", "en", "es"]
    .map((code) => {
      const file = data.cvFiles[code];
      const name = data.ui.localeName[code];
      return `
        <article class="cv-card" data-reveal>
          <h3 lang="${code}">${escapeHtml(name)}</h3>
          <a class="btn btn--secondary" href="${escapeHtml(data.routes.cv[code])}">${escapeHtml(data.ui.cvView)}</a>
          <a class="btn btn--primary" href="${escapeHtml(file.pdf)}" download="${escapeHtml(file.pdfFilename)}">${escapeHtml(data.ui.downloadPdf)}</a>
          <a class="btn btn--secondary" href="${escapeHtml(file.docx)}" download="${escapeHtml(file.docxFilename)}">${escapeHtml(data.ui.downloadWord)}</a>
        </article>
      `;
    })
    .join("");
  return `
    <section class="section" id="cv" aria-labelledby="cv-title">
      <div class="container">
        <div class="section__head" data-reveal>
          <p class="eyebrow">${escapeHtml(data.ui.cvKicker)}</p>
          <h2 id="cv-title">${escapeHtml(data.ui.cvTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.cvIntro)}</p>
        </div>
        <div class="cv-grid">${blocks}</div>
      </div>
    </section>
  `;
}

function renderContact(data) {
  const primary = data.contact.phones.find((phone) => phone.public);
  const email = mailto(data.contact.email);
  const phone = tel(primary.href);
  return `
    <section class="section section--tint" id="contact" aria-labelledby="contact-title">
      <div class="container contact" data-reveal>
        <div>
          <p class="eyebrow">${escapeHtml(data.ui.contactKicker)}</p>
          <h2 id="contact-title">${escapeHtml(data.ui.contactTitle)}</h2>
          <p class="lede">${escapeHtml(data.ui.contactText)}</p>
        </div>
        <div class="contact__cards">
          <a class="contact__card" href="${escapeHtml(email)}">
            ${icon("mail")}
            <span>${escapeHtml(data.ui.emailCta)}</span>
            <strong>${escapeHtml(data.contact.email)}</strong>
          </a>
          <a class="contact__card" href="${escapeHtml(phone)}">
            ${icon("phone")}
            <span>${escapeHtml(data.ui.phonePrimary)}</span>
            <strong>${escapeHtml(primary.display)}</strong>
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderFooter(data) {
  const links = data.navigation
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join("");
  const primary = data.contact.phones.find((phone) => phone.public);
  const year = data.site.copyrightYear;
  return `
    <footer class="site-footer">
      <div class="container footer__grid">
        <div>
          <p class="footer__name">${escapeHtml(data.profile.name)}</p>
          <p>${escapeHtml(data.profile.title)}</p>
          <p><a href="${escapeHtml(mailto(data.contact.email))}">${escapeHtml(data.contact.email)}</a></p>
          <p><a href="${escapeHtml(tel(primary.href))}">${escapeHtml(primary.display)}</a></p>
        </div>
        <nav aria-label="${escapeHtml(data.ui.footerNav)}">
          <ul class="footer__links">${links}</ul>
        </nav>
        <div class="footer__tools">
          ${langSwitch(data, "home")}
          ${themeButton(data)}
        </div>
      </div>
      <div class="container footer__base">
        <p>© ${year} ${escapeHtml(data.profile.name)}</p>
        <p>${escapeHtml(data.site.imageCredit)}</p>
      </div>
    </footer>
  `;
}

export function renderHome(data = portfolioFor("fr")) {
  return {
    lang: data.htmlLang,
    head: renderHead(data),
    body: `
      ${renderHeader(data)}
      <main id="contenu">
        ${renderHero(data)}
        ${renderAbout(data)}
        ${renderExpertise(data)}
        ${renderExperience(data)}
        ${renderEducation(data)}
        ${renderCertifications(data)}
        ${renderSkills(data)}
        ${renderVenture(data)}
        ${renderCvBand(data)}
        ${renderContact(data)}
      </main>
      ${renderFooter(data)}
    `,
  };
}
