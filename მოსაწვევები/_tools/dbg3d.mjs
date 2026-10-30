import { connect } from "./cdp.mjs";
const c = await connect(9334);
await c.send("Emulation.setDeviceMetricsOverride", { width: 360, height: 640, deviceScaleFactor: 1.5, mobile: true });
await c.send("Page.navigate", { url: process.argv[2] }); await c.sleep(5000);
console.log(await c.ev(process.argv[3]));
if (process.argv[4]) { await c.sleep(600); await c.shot(process.argv[4]); }
c.ws.close();
