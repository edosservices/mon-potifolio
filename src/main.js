const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const panel = document.querySelector(".nav-panel");
const main = document.querySelector("#contenu");
const footer = document.querySelector(".site-footer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const NAV_BREAKPOINT = 1180;

document.documentElement.classList.add("js");

function setHeaderOffset() {
  if (!header) return;
  document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
}

function setMenu(open) {
  if (!toggle || !panel) return;
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  const label = toggle.querySelector(".sr-only");
  if (label) label.textContent = open ? toggle.dataset.close : toggle.dataset.open;
  panel.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  if (main) main.inert = open;
  if (footer) footer.inert = open;
  if (open) panel.querySelector("a")?.focus();
}

function menuFocusables() {
  if (!header || !panel) return [];
  const bar = [...header.querySelectorAll(".site-header__bar a, .site-header__bar button")];
  return [...bar, ...panel.querySelectorAll("a, button")];
}

setHeaderOffset();
window.addEventListener("resize", () => {
  setHeaderOffset();
  if (window.innerWidth >= NAV_BREAKPOINT && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
  }
});

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  setMenu(open);
  if (!open) toggle.focus();
});

panel?.addEventListener("click", (event) => {
  if (!event.target.closest("a") || window.innerWidth >= NAV_BREAKPOINT) return;
  setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
  if (event.key !== "Tab" || toggle?.getAttribute("aria-expanded") !== "true" || window.innerWidth >= NAV_BREAKPOINT) {
    return;
  }
  const focusable = menuFocusables();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

function onScroll() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link, .footer__links a")];

if (sections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${id}`) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
  );
  sections.forEach((section) => observer.observe(section));
}

const revealNodes = [...document.querySelectorAll("[data-reveal]")];
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  revealNodes.forEach((node) => revealObserver.observe(node));
}

function applyTheme(theme, persist) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  if (persist) {
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Navigation privée : le choix reste valable pour cette page.
    }
  }
  const color = next === "dark" ? "#070b12" : "#f4f7fb";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.setAttribute("aria-label", next === "dark" ? button.dataset.toLight : button.dataset.toDark);
    button.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
  });
}

applyTheme(document.documentElement.getAttribute("data-theme") || "light", false);

document.querySelectorAll(".theme-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark", true);
  });
});

document.querySelectorAll(".lang a").forEach((link) => {
  link.addEventListener("click", () => {
    const code = link.getAttribute("lang");
    if (!code) return;
    try {
      localStorage.setItem("lang", code);
    } catch {
      // Le lien reste une navigation réelle.
    }
  });
});

const dialog = document.querySelector("#cert-dialog");
const stage = document.querySelector("[data-cert-stage]");
const dialogTitle = document.querySelector("#cert-dialog-title");

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.querySelectorAll("[data-cert-open]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!dialog || !stage) return;
    const src = escapeAttr(button.dataset.certSrc || "");
    const title = escapeAttr(button.dataset.certTitle || "");
    if (dialogTitle) dialogTitle.textContent = button.dataset.certTitle || "";
    const pdf = /\.pdf($|\?)/i.test(src);
    stage.classList.remove("is-zoomed");
    stage.innerHTML = pdf
      ? `<iframe src="${src}" title="${title}"></iframe>`
      : `<img src="${src}" alt="${title}" />`;
    dialog.showModal();
  });
});

document.querySelector("[data-cert-close]")?.addEventListener("click", () => dialog?.close());
document.querySelector("[data-cert-zoom]")?.addEventListener("click", () => {
  stage?.classList.toggle("is-zoomed");
});
dialog?.addEventListener("close", () => {
  if (stage) stage.innerHTML = "";
});
