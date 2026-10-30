// node page.mjs <port> <url> <out.jpg> [w h dpr] — screenshot once window.__ready (or after 6 s)
import { connect } from "./cdp.mjs";
const [port, url, out, W, H, DPR] = process.argv.slice(2); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: +(W || 1080), height: +(H || 1350), deviceScaleFactor: +(DPR || 1), mobile: false });
await c.send("Page.navigate", { url }); for (let i = 0; i < 40; i++){ await c.sleep(250); if (await c.ev("!!window.__ready")) break; } await c.sleep(600);
await c.shot(out, out.endsWith(".png") ? "png" : "jpeg"); c.ws.close();
