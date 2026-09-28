import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = import.meta.dir;
const port = Number(process.env.PORT ?? 4173);
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const path = normalize(join(root, requested));
    if (!path.startsWith(root) || !existsSync(path))
      return new Response("Not found", { status: 404 });
    return new Response(Bun.file(path), {
      headers: {
        "content-type": types[extname(path)] ?? "application/octet-stream",
      },
    });
  },
});

console.log(`Solard docs: http://127.0.0.1:${port}`);
