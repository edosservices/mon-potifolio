import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = 4179;
const chrome = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";
const jobs = [
  { page: "/cv.html", file: "cv-edouard-bengehya-fr.pdf" },
  { page: "/cv-en.html", file: "cv-edouard-bengehya-en.pdf" },
  { page: "/cv-es.html", file: "cv-edouard-bengehya-es.pdf" },
];

function waitFor(url, timeoutMs = 30000) {
  const started = Date.now();
  return new Promise((resolvePromise, reject) => {
    const tick = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolvePromise();
          return;
        }
      } catch {
        // Le serveur n'est pas encore prêt.
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Le serveur de prévisualisation n'a pas démarré : ${url}`));
        return;
      }
      setTimeout(tick, 300);
    };
    tick();
  });
}

function printPdf(pageUrl, output) {
  if (existsSync(output)) unlinkSync(output);
  const printer = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-sync",
      "--no-first-run",
      `--user-data-dir=/tmp/chrome-pdf-${Date.now()}`,
      "--no-pdf-header-footer",
      `--print-to-pdf=${output}`,
      pageUrl,
    ],
    { stdio: "ignore" },
  );

  return new Promise((resolvePromise, reject) => {
    const started = Date.now();
    const timer = setInterval(() => {
      const ready = existsSync(output) && statSync(output).size > 1000;
      if (ready || Date.now() - started > 25000) {
        clearInterval(timer);
        printer.kill("SIGKILL");
        if (ready) resolvePromise();
        else reject(new Error(`Le PDF n'a pas été créé : ${output}`));
      }
    }, 300);
    printer.on("exit", () => {
      if (existsSync(output) && statSync(output).size > 1000) {
        clearInterval(timer);
        resolvePromise();
      }
    });
  });
}

const preview = spawn(
  resolve(root, "node_modules/vite/bin/vite.js"),
  ["preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);

let logs = "";
preview.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
preview.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

try {
  await waitFor(`http://127.0.0.1:${port}/cv.html`);
  mkdirSync(resolve(root, "dist/cv"), { recursive: true });
  for (const job of jobs) {
    const output = resolve(root, "public/cv", job.file);
    await printPdf(`http://127.0.0.1:${port}${job.page}`, output);
    copyFileSync(output, resolve(root, "dist/cv", job.file));
    console.log(`PDF écrit : ${output}`);
  }
  for (const legacy of [
    resolve(root, "public/cv/cv-edouard-bengehya.pdf"),
    resolve(root, "dist/cv/cv-edouard-bengehya.pdf"),
  ]) {
    if (existsSync(legacy)) unlinkSync(legacy);
  }
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  preview.kill("SIGTERM");
}
