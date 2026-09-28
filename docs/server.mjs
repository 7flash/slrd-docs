import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { readFile } from "node:fs/promises";

const root = new URL("./public/", import.meta.url).pathname;
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".ico", "image/x-icon"],
]);

function resolveRequestPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const normalized = normalize(relative).replace(/^(\.\.[/\\])+/, "");
  return join(root, normalized);
}

async function readAsset(pathname) {
  const requested = resolveRequestPath(pathname);
  try {
    return { body: await readFile(requested), path: requested };
  } catch {
    return { body: await readFile(join(root, "index.html")), path: join(root, "index.html") };
  }
}

function headersFor(path) {
  return {
    "content-type": mime.get(extname(path)) ?? "application/octet-stream",
    "cache-control": path.endsWith("index.html") ? "no-cache" : "public, max-age=300",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
  };
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const asset = await readAsset(url.pathname);
  response.writeHead(200, headersFor(asset.path));
  response.end(asset.body);
});

server.listen(port, host, () => {
  process.stdout.write(`Solard docs: http://${host}:${port}\n`);
});
