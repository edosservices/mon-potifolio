import { buildCvModel } from "../cv/model.js";
import { portfolio as fallback } from "../data/portfolio.js";
import {
  absoluteUrl,
  escapeHtml,
  jsonScript,
  mailto,
  resolveSiteUrl,
  safeUrl,
  tel,
} from "./html.js";

function token(value, placeholder) {
  const text = escapeHtml(value || "");
  return placeholder ? `<span class="token">${text}</span>` : text;
}

function renderHead(data) {
  const siteUrl = resolveSiteUrl(data.site);
  const canonical = absoluteUrl(siteUrl, data.cv.viewPath);
  const title = `CV — ${data.profile.name}`;
  const description = `Curriculum vitae de ${data.profile.name}, ${data.profile.title}.`;
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="${escapeHtml(data.site.themeColor)}" />
    ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ""}
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <script type="application/ld+json">${jsonScript({
      "@context": "https://schema.org",
      "@type": "Person",
      name: data.profile.name,
      jobTitle: data.profile.title,
      email: `mailto:${data.contact.email}`,
      telephone: data.contact.phoneHref,
    })}</script>
  `;
}

function renderSignature(signature) {
  const image = signature.available
    ? `<img src="${escapeHtml(safeUrl(signature.src))}" alt="${escapeHtml(signature.alt)}" />`
    : `<p class="signature__pending">Emplacement réservé à la signature manuscrite</p>`;
  return `
    <figure class="signature">
      <div class="signature__plate">${image}</div>
      <figcaption>${escapeHtml(signature.name)}</figcaption>
    </figure>
  `;
}

export function renderCv(data = fallback) {
  const model = buildCvModel(data);
  const email = mailto(model.contact.email);
  const phone = tel(model.contact.phoneHref);
  const socials = model.contact.socials
    .map((item) => {
      const url = safeUrl(item.url);
      if (!url) return "";
      return `<a href="${escapeHtml(url)}">${escapeHtml(item.label)}</a>`;
    })
    .filter(Boolean)
    .join('<span aria-hidden="true"> · </span>');

  const skills = model.skillGroups
    .map((group) => {
      const names = group.skills
        .map((skill) => {
          const level = skill.level.rank > 0 ? ` (${escapeHtml(skill.level.label)})` : "";
          return `${escapeHtml(skill.name)}${level}`;
        })
        .join(", ");
      return `<p><strong>${escapeHtml(group.label)}.</strong> ${names}</p>`;
    })
    .join("");

  const experience = model.experience
    .map((item) => {
      const pending = Boolean(item.placeholder);
      const duties = (item.responsibilities || [])
        .map((duty) => `<li>${token(duty, pending)}</li>`)
        .join("");
      const tech = (item.technologies || []).map((name) => token(name, pending)).join(", ");
      return `
        <article class="cv-item">
          ${pending ? "<p class=\"cv-note\">À compléter</p>" : ""}
          <h3>${token(item.role, pending)}</h3>
          <p class="cv-meta">${token(item.company, pending)} · ${token(item.location, pending)} · ${token(item.period, pending)}</p>
          <p>${token(item.description, pending)}</p>
          ${duties ? `<ul>${duties}</ul>` : ""}
          ${tech ? `<p><strong>Technologies :</strong> ${tech}</p>` : ""}
        </article>
      `;
    })
    .join("");

  const education = model.education
    .map((item) => {
      const pending = Boolean(item.placeholder);
      return `
        <article class="cv-item">
          ${pending ? "<p class=\"cv-note\">À compléter</p>" : ""}
          <h3>${token(item.degree, pending)}</h3>
          <p class="cv-meta">${token(item.school, pending)} · ${token(item.specialty, pending)} · ${token(item.year, pending)}</p>
        </article>
      `;
    })
    .join("");

  const certifications = model.certifications
    .map((item) => {
      const pending = Boolean(item.placeholder);
      const url = safeUrl(item.url);
      const verify = url
        ? ` · <a href="${escapeHtml(url)}">Vérification</a>`
        : pending
          ? " · <span class=\"token\">Lien de vérification à ajouter</span>"
          : "";
      return `
        <article class="cv-item">
          ${pending ? "<p class=\"cv-note\">À compléter</p>" : ""}
          <h3>${token(item.name, pending)}</h3>
          <p class="cv-meta">${token(item.issuer, pending)} · ${token(item.date, pending)} · N° ${token(item.credentialId, pending)}${verify}</p>
        </article>
      `;
    })
    .join("");

  const languages = model.languages
    .map((item) => {
      const pending = Boolean(item.placeholder);
      return `<li>${token(item.name, pending)} — ${token(item.level, pending)}</li>`;
    })
    .join("");

  return {
    head: renderHead(data),
    body: `
      <a class="skip-link" href="#cv-document">Aller au CV</a>
      <header class="cv-top">
        <a class="cv-top__back" href="/">← ${escapeHtml(data.profile.name)}</a>
        <div class="cv-top__actions">
          <a class="btn btn--secondary" href="${escapeHtml(safeUrl(data.cv.pdfPath))}" download="${escapeHtml(data.cv.pdfFilename)}">PDF</a>
          <a class="btn btn--secondary" href="${escapeHtml(safeUrl(data.cv.docxPath))}" download="${escapeHtml(data.cv.docxFilename)}">Word</a>
        </div>
      </header>
      <main id="cv-document" class="cv-sheet" tabindex="-1">
        <header class="cv-head">
          <img class="cv-photo" src="${escapeHtml(model.photo.src)}" alt="${escapeHtml(model.photo.alt)}" width="1000" height="1250" />
          <div>
            <h1>${escapeHtml(model.name)}</h1>
            <p class="cv-title">${data.profile.roles.map((role) => `<span>${escapeHtml(role)}</span>`).join("")}</p>
          </div>
          <p class="cv-contact">
            <a href="${escapeHtml(email)}">${escapeHtml(model.contact.email)}</a>
            <a href="${escapeHtml(phone)}">${escapeHtml(model.contact.phoneDisplay)}</a>
            ${socials}
          </p>
        </header>

        <section aria-labelledby="cv-profil">
          <h2 id="cv-profil">Profil</h2>
          <p>${escapeHtml(model.positioning)}</p>
          ${model.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>

        <section aria-labelledby="cv-competences">
          <h2 id="cv-competences">Compétences</h2>
          ${skills}
        </section>

        <section aria-labelledby="cv-experience">
          <h2 id="cv-experience">Expérience professionnelle</h2>
          ${experience}
        </section>

        <section aria-labelledby="cv-formation">
          <h2 id="cv-formation">Formation</h2>
          ${education}
        </section>

        <section aria-labelledby="cv-certifications">
          <h2 id="cv-certifications">Certifications</h2>
          ${certifications}
        </section>

        <section aria-labelledby="cv-langues">
          <h2 id="cv-langues">Langues</h2>
          <ul>${languages}</ul>
        </section>

        ${renderSignature(model.signature)}
      </main>
    `,
  };
}
