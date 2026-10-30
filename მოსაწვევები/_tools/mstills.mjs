// node mstills.mjs <spec> <outdir> <t1,t2,...> — preview stills of a montage
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [spec, out, ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+(process.env.CDP || 9333));
await c.send("Page.navigate", { url: `http://localhost:5511/montage.html?spec=${encodeURIComponent(spec)}&stills=${ts}` });
for (let i = 0; i < 600; i++){ await c.sleep(300); if (await c.ev("!!window.__done")) break; const e = await c.ev("window.__err||''"); if (e){ console.log(e); break; } }
const arr = await c.ev("window.__stills") || []; arr.forEach((b, i) => fs.writeFileSync(`${out}/s${i}.jpg`, Buffer.from(b, "base64"))); console.log("stills", arr.length, JSON.stringify(c.errs).slice(0, 300)); c.ws.close();
