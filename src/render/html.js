export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const escapeAttr = escapeHtml;

export function safeUrl(url) {
  const value = String(url ?? "").trim();
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^mailto:[^\s<>]+$/i.test(value)) return value;
  if (/^tel:\+[0-9]+$/i.test(value)) return value;
  return "";
}

export function resolveSiteUrl(site) {
  const fromEnv = typeof process !== "undefined" && process.env ? process.env.SITE_URL || "" : "";
  return String(fromEnv || site?.url || "").trim().replace(/\/$/, "");
}

export function absoluteUrl(siteUrl, path) {
  if (!siteUrl || !path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function jsonScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function mailto(email) {
  return safeUrl(`mailto:${String(email ?? "").trim()}`);
}

export function tel(phoneHref) {
  return safeUrl(`tel:${String(phoneHref ?? "").trim()}`);
}
