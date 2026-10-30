// node mp4.mjs <frames dir (under :5511)> <frames> <out.mp4> "<extra query>" — runs enc.html in headless Chrome
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [dir, n, out, extra] = process.argv.slice(2); const c = await connect(9333);
await c.send("Emulation.clearDeviceMetricsOverride");
await c.send("Page.navigate", { url: `http://localhost:5511/enc.html?dir=${encodeURIComponent(dir)}&n=${n}&fps=30&${extra || ""}` });
for (let i = 0; i < 1500; i++){ await c.sleep(500); const st = await c.ev(`JSON.stringify({d: !!window.__done, p: window.__progress, e: window.__err || ""})`); if (!st) continue; const s = JSON.parse(st); if (s.e){ console.log("ERROR", s.e); process.exit(1); } if (s.d) break; }
fs.writeFileSync(out, Buffer.from(await c.ev("window.__mp4"), "base64")); console.log(out, fs.statSync(out).size); c.ws.close();
