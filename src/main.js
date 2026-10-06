const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const panel = document.querySelector(".nav-panel");
const main = document.querySelector("#contenu");
const footer = document.querySelector(".site-footer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");

function setHeaderOffset() {
  if (!header) return;
  document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
}

function setMenu(open) {
  if (!toggle || !panel) return;
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.querySelector(".sr-only").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
  panel.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  if (main) main.inert = open;
  if (footer) footer.inert = open;
  if (open) {
    const first = panel.querySelector("a");
    first?.focus();
  }
}

setHeaderOffset();
window.addEventListener("resize", () => {
  setHeaderOffset();
  if (window.innerWidth >= 1120 && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  setMenu(open);
  if (!open) toggle.focus();
});

panel?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || window.innerWidth >= 1120) return;
  setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
  if (event.key !== "Tab" || toggle?.getAttribute("aria-expanded") !== "true" || window.innerWidth >= 1120) {
    return;
  }
  const focusable = [toggle, ...panel.querySelectorAll("a")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
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
  const byId = new Map(sections.map((section) => [section.id, section]));
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${id}`;
        if (current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      byId.get(id);
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
