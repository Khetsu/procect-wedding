// node stills.mjs <url> <outdir> <t1,t2,...> — phone stills at given window.__G times (auto pages)
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [url, out, ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(9333);
await c.send("Emulation.setDeviceMetricsOverride", { width: 360, height: 640, deviceScaleFactor: 2, mobile: true });
await c.send("Page.navigate", { url }); await c.sleep(6000);
for (const t of ts.split(",")){ await c.ev(`window.__G=${t};1`); await c.sleep(450); await c.shot(`${out}/t${t}.jpg`); }
console.log("errors:", JSON.stringify(c.errs)); c.ws.close();
