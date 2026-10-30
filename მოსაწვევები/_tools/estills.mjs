// node estills.mjs <port> <url> <outdir> [w h] — envelope designs: opening stills at __G times + chapter stills
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [port, url, out, w, h] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: +(w || 360), height: +(h || 640), deviceScaleFactor: 1.5, mobile: true });
await c.send("Page.navigate", { url }); await c.sleep(5000);
const T = (process.env.TT || "0.5,2.05,2.4,2.8,3.3,3.9,4.6,5.3,6.0,6.6,7.3,8.2").split(",").map(Number);
for (const t of T){ await c.ev(`window.__G=${t};1`); await c.sleep(380); await c.shot(`${out}/a${t}.jpg`); }
await c.ev(`window.__G=10;1`); await c.sleep(900);
const n = await c.ev("document.querySelectorAll('.sc').length");
for (let i = 1; i < n; i++){ await c.ev(`scrollTo(0, document.querySelectorAll('.sc')[${i}].offsetTop);window.__G=${10 + i};1`); await c.sleep(1500); await c.shot(`${out}/b${i}.jpg`); }
console.log("sections", n, "errors:", JSON.stringify(c.errs).slice(0, 600)); c.ws.close();
