// node filetest.mjs <port> <file url> <out prefix> — open a page from disk (file://), check errors, tap to open, screenshot before/after
import { connect } from "./cdp.mjs";
const [port, url, out] = process.argv.slice(2); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
const logs = []; c.ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.method === "Runtime.consoleAPICalled") logs.push(m.params.type + ": " + m.params.args.map(a => a.value || a.description).join(" ")); if (m.method === "Log.entryAdded") logs.push("log: " + m.params.entry.text); });
await c.send("Log.enable");
await c.send("Page.navigate", { url }); await c.sleep(7000);
console.log("scene:", await c.ev("!!window.AMB_SCENE"), "no3d:", await c.ev("document.documentElement.classList.contains('no3d')"));
await c.shot(out + "-1.jpg");
await c.ev(`document.getElementById("intro").click();1`); await c.sleep(2000); await c.shot(out + "-2.jpg"); await c.sleep(4000); await c.shot(out + "-3.jpg");
console.log("open:", await c.ev("document.documentElement.classList.contains('open')"));
console.log("errors:", JSON.stringify(c.errs), "\nlogs:", logs.slice(0, 8).join("\n")); c.ws.close();
