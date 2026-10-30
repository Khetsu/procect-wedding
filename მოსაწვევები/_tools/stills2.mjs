// node stills2.mjs <port> <url> <outdir> — opening stills at __G times + scroll stills (new collection pages)
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [port, url, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1.5, mobile: true });
await c.send("Page.navigate", { url }); await c.sleep(6500);
for (const t of [0.5, 2.2, 3.0, 3.8, 4.8]){ await c.ev(`window.__G=${t};1`); await c.sleep(500); await c.shot(`${out}/a${t}.jpg`); }
await c.ev(`window.__G=8;1`); await c.sleep(1500); await c.shot(`${out}/b0.jpg`);
for (const p of [0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1]){ await c.ev(`scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*${p});1`); await c.sleep(1400); await c.shot(`${out}/b${p}.jpg`); }
console.log("errors:", JSON.stringify(c.errs)); c.ws.close();
