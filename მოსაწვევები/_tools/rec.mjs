// node rec.mjs <url> <outdir> <seconds> [scrollFrom] — frame-exact capture (virtual time), 1080x1920 @30fps, drives window.__G
import fs from "node:fs"; import path from "node:path"; import { connect } from "./cdp.mjs";
const [url, out, secs, sf] = process.argv.slice(2); const DUR = +secs, FPS = 30, N = Math.round(DUR * FPS), S0 = +(sf || 1e9), S1 = DUR - 1.5;
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const c = await connect(9333);
await c.send("Emulation.setDeviceMetricsOverride", { width: 360, height: 640, deviceScaleFactor: 3, mobile: true });
await c.send("Page.navigate", { url }); await c.sleep(6000);
await c.ev(`document.documentElement.style.scrollBehavior="auto";1`);
await c.send("Emulation.setVirtualTimePolicy", { policy: "pause" });
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; let H = 0;
for (let f = 0; f < N; f++){ const t = f / FPS; await c.ev(`window.__G=${t.toFixed(4)};1`);
  if (t >= S0){ if (!H) H = await c.ev(`document.documentElement.scrollHeight-innerHeight`); await c.ev(`scrollTo(0,${Math.round(ease(Math.min(1, (t - S0) / (S1 - S0))) * H)});1`); }
  const done = c.once("Emulation.virtualTimeBudgetExpired"); await c.send("Emulation.setVirtualTimePolicy", { policy: "advance", budget: 1000 / FPS }); await done;
  const m = await c.send("Page.captureScreenshot", { format: "jpeg", quality: 92 }); fs.writeFileSync(path.join(out, String(f).padStart(4, "0") + ".jpg"), Buffer.from(m.result.data, "base64"));
  if (f % 90 === 0) console.log("frame", f, "/", N); }
console.log("frames", N); c.ws.close();
