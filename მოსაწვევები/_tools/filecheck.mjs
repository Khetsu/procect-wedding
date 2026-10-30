// node filecheck.mjs <port> <dir1,dir2,...> — opens each design's index.html straight from disk, taps, reports
import { connect } from "./cdp.mjs";
const [port, list] = process.argv.slice(2); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
for (const d of list.split(",")){
  const url = "file:///C:/Users/User/Desktop/Procect%20wedding/" + encodeURIComponent(process.env.COLL || "ახალი-კოლექცია-10-25") + "/" + d + "/index.html";
  c.errs.length = 0; await c.send("Page.navigate", { url }); await c.sleep(6000);
  const s = await c.ev("!!window.AMB_SCENE"), n = await c.ev("document.documentElement.classList.contains('no3d')");
  await c.ev(`document.getElementById("intro").click();1`); await c.sleep(5000);
  const o = await c.ev("document.documentElement.classList.contains('open')");
  await c.shot(`out/fc-${d}.jpg`);
  console.log(d.padEnd(12), "scene:", s, "no3d:", n, "opened:", o, "errors:", c.errs.length ? c.errs[0].slice(0, 120) : 0);
}
c.ws.close();
