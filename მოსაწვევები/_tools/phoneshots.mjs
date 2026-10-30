// node phoneshots.mjs <port> <invitation folder> <outdir> — phone screenshots: gate, hero, countdown, map, wishes, rsvp
import fs from "node:fs"; import { connect } from "./cdp.mjs";
const [port, dir, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const c = await connect(+port);
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
const base = `http://localhost:5512/${encodeURIComponent(dir)}/`;
await c.send("Page.navigate", { url: base }); await c.sleep(6500); await c.shot(`${out}/gate.jpg`);
await c.send("Page.navigate", { url: base + "?open" }); await c.sleep(5000);
await c.ev(`document.documentElement.style.scrollBehavior="auto";document.querySelectorAll("[data-anim]").forEach(e=>{e.classList.remove("pre");e.classList.add("shown")});1`);
await c.ev(`scrollTo(0,0);1`); await c.sleep(800); await c.shot(`${out}/hero.jpg`);
for (const [n, sel] of [["count", "#count"], ["map", ".js-map"], ["wishes", "#wenv"], ["rsvp", "#rsvp"]]){
  await c.ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return 0; const r=e.getBoundingClientRect(); scrollTo(0, scrollY + r.top - innerHeight*0.38); return 1})()`); await c.sleep(900); await c.shot(`${out}/${n}.jpg`); }
c.ws.close(); console.log("ok");
