// node montage.mjs <spec.json (under _tools)> <out.mp4> [cover.png] — runs montage.html in headless Chrome (9333)
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [spec, out, coverOut] = process.argv.slice(2); const c = await connect(9333);
await c.send("Emulation.clearDeviceMetricsOverride");
async function run(q){ await c.send("Page.navigate", { url: `http://localhost:5511/montage.html?spec=${encodeURIComponent(spec)}${q}` });
  for (let i = 0; i < 3000; i++){ await c.sleep(400); const st = await c.ev(`JSON.stringify({d: !!window.__done, p: window.__progress || "", e: window.__err || ""})`); if (!st) continue; const s = JSON.parse(st);
    if (s.e){ console.log("ERROR", s.e); process.exit(1); } if (s.d) return; if (i % 50 === 0 && s.p) console.log("  ", s.p); } }
if (coverOut){ await run("&cover=1"); fs.writeFileSync(coverOut, Buffer.from(await c.ev("window.__png"), "base64")); console.log("cover", coverOut); }
if (out && out !== "-"){ await run(""); fs.writeFileSync(out, Buffer.from(await c.ev("window.__mp4"), "base64")); console.log(out, fs.statSync(out).size); }
c.ws.close();
