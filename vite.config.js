import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

function resolvePage(ctx) {
  const raw = `${ctx.filename || ""} ${ctx.path || ""}`;
  const base = raw.split(/[/\\\s]/).filter(Boolean).pop() || "index.html";
  const isCv = base.startsWith("cv");
  let locale = "fr";
  if (base === "en.html" || base === "cv-en.html") locale = "en";
  if (base === "es.html" || base === "cv-es.html") locale = "es";
  return { isCv, locale };
}

async function loadModules(server) {
  if (server) {
    const data = await server.ssrLoadModule("/src/data/portfolio.js");
    const home = await server.ssrLoadModule("/src/render/home.js");
    const cv = await server.ssrLoadModule("/src/render/cv.js");
    return { portfolioFor: data.portfolioFor, renderHome: home.renderHome, renderCv: cv.renderCv };
  }

  const data = await import("./src/data/portfolio.js");
  const home = await import("./src/render/home.js");
  const cv = await import("./src/render/cv.js");
  return { portfolioFor: data.portfolioFor, renderHome: home.renderHome, renderCv: cv.renderCv };
}

function portfolioPlugin() {
  return {
    name: "portfolio-render",
    handleHotUpdate({ file, server }) {
      if (/\/src\/(data|render|cv)\//.test(file)) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
      return undefined;
    },
    async transformIndexHtml(html, ctx) {
      const loaded = await loadModules(ctx.server);
      const request = resolvePage(ctx);
      const data = loaded.portfolioFor(request.locale);
      const page = request.isCv ? loaded.renderCv(data) : loaded.renderHome(data);
      return html.replace("___HEAD___", page.head).replace("___CONTENT___", page.body);
    },
  };
}

export default defineConfig({
  plugins: [portfolioPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        en: fileURLToPath(new URL("./en.html", import.meta.url)),
        es: fileURLToPath(new URL("./es.html", import.meta.url)),
        cv: fileURLToPath(new URL("./cv.html", import.meta.url)),
        cvEn: fileURLToPath(new URL("./cv-en.html", import.meta.url)),
        cvEs: fileURLToPath(new URL("./cv-es.html", import.meta.url)),
      },
    },
  },
  server: {
    host: "127.0.0.1",
  },
  preview: {
    host: "127.0.0.1",
  },
});
