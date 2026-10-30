// node hstills.mjs <port> <design> <outdir> — premium designs: hi-res stills for posts (1080 wide): opening moments + hero + countdown
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [port, d, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1080 / 390, mobile: true });
await c.send("Page.navigate", { url: `http://localhost:5515/${d}/?auto&rec&q=1` }); await c.sleep(6000);
await c.ev(`window.__G=.4;1`); await c.sleep(700); await c.shot(`${out}/${d}-wait.jpg`);
for (const t of [3.2, 4.0, 5.0]){ await c.ev(`window.__G=${t};1`); await c.sleep(700); await c.shot(`${out}/${d}-o${t}.jpg`); }
await c.ev(`window.__G=9;1`); await c.sleep(1500); await c.shot(`${out}/${d}-hero.jpg`);
await c.ev(`scrollTo(0, innerHeight*2);window.__G=11;1`); await c.sleep(1500); await c.shot(`${out}/${d}-cd.jpg`);
c.ws.close(); console.log(d);
