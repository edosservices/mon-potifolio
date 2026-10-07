import { buildCvModel } from "../cv/model.js";
import { portfolioFor } from "../data/portfolio.js";
import { icon } from "./icons.js";
import { absoluteUrl, escapeHtml, jsonScript, mailto, resolveSiteUrl, safeUrl, tel } from "./html.js";

function langSwitch(data) {
  const links = ["fr", "en", "es"]
    .map((code) => {
      const current = code === data.locale ? ' aria-current="page"' : "";
      return `<a href="${escapeHtml(data.routes.cv[code])}" hreflang="${code}" lang="${code}"${current}>${code.toUpperCase()}</a>`;
    })
    .join("");
  return `<nav class="lang" aria-label="${escapeHtml(data.ui.langLabel)}">${links}</nav>`;
}

export function renderCv(data = portfolioFor("fr")) {
  const model = buildCvModel(data);
  const siteUrl = resolveSiteUrl(data.site);
  const canonical = absoluteUrl(siteUrl, data.routes.cv[data.locale]);
  const alternates = ["fr", "en", "es"]
    .map((code) => {
      const href = absoluteUrl(siteUrl, data.routes.cv[code]);
      return href ? `<link rel="alternate" hreflang="${code}" href="${escapeHtml(href)}" />` : "";
    })
    .filter(Boolean)
    .join("");
  const file = data.cvFiles[data.locale];
  const phones = model.phones
    .map((phone, index) => {
      const label = index === 0 ? model.ui.phonePrimary : model.ui.phoneSecondary;
      return `<a href="${escapeHtml(tel(phone.href))}"><span class="cv-k">${escapeHtml(label)}</span> ${escapeHtml(phone.display)}</a>`;
    })
    .join("");

  const skills = model.skillGroups
    .map((group) => {
      const names = group.skills
        .map((skill) => `${escapeHtml(skill.name)} (${escapeHtml(skill.levelLabel)})`)
        .join(", ");
      return `<p><strong>${escapeHtml(group.label)}.</strong> ${names}</p>`;
    })
    .join("");

  const experience = model.experience
    .map((item) => {
      const place = [item.company, item.location].filter(Boolean).join(" · ");
      const duties = item.duties.map((duty) => `<li>${escapeHtml(duty)}</li>`).join("");
      return `
        <article class="cv-item">
          <h3>${escapeHtml(item.role)}</h3>
          <p class="cv-meta">${escapeHtml(place)} · ${escapeHtml(item.period)}</p>
          <p>${escapeHtml(item.summary)}</p>
          <ul>${duties}</ul>
        </article>
      `;
    })
    .join("");

  const education = model.education
    .map((item) => {
      const where = [item.school, item.location].filter(Boolean).join(" · ");
      const detail = item.detail ? `<p>${escapeHtml(item.detail)}</p>` : "";
      return `
        <article class="cv-item">
          <h3>${escapeHtml(item.program)}</h3>
          <p class="cv-meta">${escapeHtml(where)} · ${escapeHtml(item.period)}</p>
          ${detail}
        </article>
      `;
    })
    .join("");

  const certifications = model.certifications
    .map((item) => {
      const issuer = item.issuer || model.ui.issuerUnknown;
      const date = item.date || model.ui.dateUnknown;
      const hours = item.hours ? ` · ${item.hours} ${escapeHtml(model.ui.hoursUnit)}` : "";
      const note = item.note ? `<p>${escapeHtml(item.note)}</p>` : "";
      return `
        <article class="cv-item">
          <h3>${escapeHtml(item.name)}</h3>
          <p class="cv-meta">${escapeHtml(item.domain)} · ${escapeHtml(issuer)} · ${escapeHtml(date)}${hours}</p>
          ${note}
        </article>
      `;
    })
    .join("");

  const languages = model.languages
    .map((item) => {
      const note = item.note ? ` <span class="cv-note">${escapeHtml(item.note)}</span>` : "";
      return `<li><strong>${escapeHtml(item.name)}</strong> — ${escapeHtml(item.level)}.${note}</li>`;
    })
    .join("");

  const interests = model.interests.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const signatureImage =
    model.signature.available && safeUrl(model.signature.src)
      ? `<img src="${escapeHtml(safeUrl(model.signature.src))}" alt="${escapeHtml(model.signature.alt)}" />`
      : `<p class="signature__pending">${escapeHtml(model.ui.signaturePending)}</p>`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: model.name,
    jobTitle: model.title,
    email: `mailto:${model.email}`,
    telephone: model.phones[0]?.href,
    address: {
      "@type": "PostalAddress",
      streetAddress: model.addressLine,
      addressLocality: model.city,
      addressCountry: "CD",
    },
  };
  if (canonical) person.url = canonical;

  const head = `
    <title>${escapeHtml(data.seo.cvTitle)}</title>
    <meta name="description" content="${escapeHtml(data.seo.cvDescription)}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="profile" />
    <meta property="og:locale" content="${escapeHtml(data.ogLocale)}" />
    <meta property="og:title" content="${escapeHtml(data.seo.cvTitle)}" />
    <meta property="og:description" content="${escapeHtml(data.seo.cvDescription)}" />
    ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ""}
    ${alternates}
    <script type="application/ld+json">${jsonScript(person)}</script>
  `;

  const body = `
    <a class="skip-link" href="#cv-document">${escapeHtml(model.ui.skip)}</a>
    <header class="cv-top">
      <a class="cv-top__back" href="${escapeHtml(data.routes.home[data.locale])}">← ${escapeHtml(model.ui.backHome)}</a>
      <div class="cv-top__actions">
        ${langSwitch(data)}
        <button class="theme-toggle" type="button" aria-label="${escapeHtml(model.ui.themeToDark)}" data-to-dark="${escapeHtml(model.ui.themeToDark)}" data-to-light="${escapeHtml(model.ui.themeToLight)}">
          <span class="theme-toggle__sun">${icon("sun")}</span>
          <span class="theme-toggle__moon">${icon("moon")}</span>
        </button>
        <a class="btn btn--secondary" href="${escapeHtml(file.pdf)}" download="${escapeHtml(file.pdfFilename)}">${escapeHtml(model.ui.pdf)}</a>
        <a class="btn btn--secondary" href="${escapeHtml(file.docx)}" download="${escapeHtml(file.docxFilename)}">${escapeHtml(model.ui.word)}</a>
      </div>
    </header>
    <main id="cv-document" class="cv-sheet" lang="${escapeHtml(data.htmlLang)}" tabindex="-1">
      <header class="cv-head">
        <img class="cv-photo" src="${escapeHtml(model.photo.src)}" alt="${escapeHtml(model.photo.alt)}" width="${model.photo.width}" height="${model.photo.height}" />
        <div>
          <h1>${escapeHtml(model.name)}</h1>
          <p class="cv-civil">${escapeHtml(model.ui.civilNameLabel)} : ${escapeHtml(model.civilName)}</p>
          <p class="cv-title">${model.roles.map((role) => `<span>${escapeHtml(role)}</span>`).join("")}</p>
        </div>
        <p class="cv-contact">
          <a href="${escapeHtml(mailto(model.email))}">${escapeHtml(model.email)}</a>
          ${phones}
          <span><span class="cv-k">${escapeHtml(model.ui.addressLabel)}</span> ${escapeHtml(model.addressLine)}</span>
          <span><span class="cv-k">${escapeHtml(model.ui.nationality)}</span> ${escapeHtml(model.nationality)}</span>
        </p>
      </header>
      <section aria-labelledby="cv-profil">
        <h2 id="cv-profil">${escapeHtml(model.headings.profile)}</h2>
        <p>${escapeHtml(model.quote)}</p>
        <p>${escapeHtml(model.educationNote)}</p>
      </section>
      <section aria-labelledby="cv-competences">
        <h2 id="cv-competences">${escapeHtml(model.headings.skills)}</h2>
        ${skills}
      </section>
      <section aria-labelledby="cv-experience">
        <h2 id="cv-experience">${escapeHtml(model.headings.experience)}</h2>
        ${experience}
      </section>
      <section aria-labelledby="cv-formation">
        <h2 id="cv-formation">${escapeHtml(model.headings.education)}</h2>
        ${education}
      </section>
      <section aria-labelledby="cv-certifications">
        <h2 id="cv-certifications">${escapeHtml(model.headings.certifications)}</h2>
        ${certifications}
      </section>
      <section aria-labelledby="cv-langues">
        <h2 id="cv-langues">${escapeHtml(model.headings.languages)}</h2>
        <ul>${languages}</ul>
      </section>
      <section aria-labelledby="cv-interets">
        <h2 id="cv-interets">${escapeHtml(model.headings.interests)}</h2>
        <ul>${interests}</ul>
      </section>
      <section aria-labelledby="cv-signature">
        <h2 id="cv-signature">${escapeHtml(model.headings.signature)}</h2>
        <figure class="signature">
          <div class="signature__plate">${signatureImage}</div>
          <figcaption>${escapeHtml(model.signature.name)}</figcaption>
        </figure>
      </section>
    </main>
  `;

  return { lang: data.htmlLang, head, body };
}
