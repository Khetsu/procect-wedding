// node pstills.mjs <port> <url> <outdir> — premium designs: opening stills at __G times + chapter stills
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [port, url, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1.5, mobile: true });
await c.send("Page.navigate", { url }); await c.sleep(5000);
const err = await c.ev("window.__err||''"); if (err) console.log("SHADER:", err.slice(0, 600));
const T = [0.5, 1.4, 2.3, 3.2, 4.0, 5.0, 6.6];
for (const t of T){ await c.ev(`window.__G=${t};1`); await c.sleep(450); await c.shot(`${out}/a${t}.jpg`); }
await c.ev(`window.__G=9;1`); await c.sleep(800);
const n = await c.ev("document.querySelectorAll('.sc').length");
for (let i = 1; i < n; i++){ await c.ev(`scrollTo(0, innerHeight*${i});window.__G=${9 + i};1`); await c.sleep(1300); await c.shot(`${out}/b${i}.jpg`); }
console.log("sections", n, "errors:", JSON.stringify(c.errs).slice(0, 300)); c.ws.close();
