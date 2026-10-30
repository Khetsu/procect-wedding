// tiny static server: node serve.mjs <root> <port>
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const root = path.resolve(process.argv[2]), port = +process.argv[3] || 5510;
const T = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".webp": "image/webp", ".woff2": "font/woff2" };
http.createServer((q, s) => { let p = decodeURIComponent(new URL(q.url, "http://x").pathname); let f = path.join(root, p); if (!f.startsWith(root)){ s.writeHead(403); return s.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  fs.readFile(f, (e, d) => { if (e){ s.writeHead(404); return s.end("404"); } s.writeHead(200, { "Content-Type": T[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" }); s.end(d); }); }).listen(port, () => console.log("serving", root, "on", port));
