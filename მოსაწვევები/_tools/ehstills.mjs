// node ehstills.mjs <port> <design> <openG> <outdir> — envelope designs: hi-res stills for posts (closed · opening moment · hero page)
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [port, d, og, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1080 / 390, mobile: true });
await c.send("Page.navigate", { url: `http://localhost:5516/${d}/?auto&rec` }); await c.sleep(6000);
await c.ev(`window.__G=.6;1`); await c.sleep(600); await c.shot(`${out}/${d}-c.jpg`);
for (let g = 1.8; g <= +og; g += 1 / 30){ await c.ev(`window.__G=${g.toFixed(4)};1`); await c.sleep(25); }
await c.sleep(500); await c.shot(`${out}/${d}-o.jpg`);
for (let g = +og; g <= 10.5; g += 1 / 15){ await c.ev(`window.__G=${g.toFixed(4)};1`); await c.sleep(20); }
await c.sleep(2200); await c.shot(`${out}/${d}-h.jpg`); c.ws.close(); console.log(d);
