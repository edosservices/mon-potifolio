import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

async function loadModules(server) {
  if (server) {
    const data = await server.ssrLoadModule("/src/data/portfolio.js");
    const home = await server.ssrLoadModule("/src/render/home.js");
    const cv = await server.ssrLoadModule("/src/render/cv.js");
    return { portfolio: data.portfolio, renderHome: home.renderHome, renderCv: cv.renderCv };
  }

  const data = await import("./src/data/portfolio.js");
  const home = await import("./src/render/home.js");
  const cv = await import("./src/render/cv.js");
  return { portfolio: data.portfolio, renderHome: home.renderHome, renderCv: cv.renderCv };
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
      const file = `${ctx.path || ""} ${ctx.filename || ""}`;
      const page = file.includes("cv.html")
        ? loaded.renderCv(loaded.portfolio)
        : loaded.renderHome(loaded.portfolio);
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
        cv: fileURLToPath(new URL("./cv.html", import.meta.url)),
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
