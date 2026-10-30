// node prev.mjs <outdir> name1 name2 ... — 16 s WAV previews of melodies
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [out, ...names] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(9333);
for (const n of names){ await c.send("Page.navigate", { url: `http://localhost:5511/prev.html?s=${n}&sec=16` });
  let b64 = null; for (let i = 0; i < 120 && !b64; i++){ await c.sleep(250); const e = await c.ev("window.__err||''"); if (e){ console.log(n, "ERROR", e); break; } b64 = await c.ev("window.__wav||null"); }
  if (b64){ fs.writeFileSync(`${out}/${n}.wav`, Buffer.from(b64, "base64")); console.log(n, "peak", (await c.ev("window.__peak")).toFixed(2)); } }
c.ws.close();
