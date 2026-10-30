// node achk.mjs <mp4 path under :5511> — decode audio in Chrome, print duration + loudness per 2 s
import { connect } from "./cdp.mjs";
const [f] = process.argv.slice(2); const c = await connect(9333);
await c.send("Page.navigate", { url: "http://localhost:5511/sheet.html?dir=x&f=a" }); await c.sleep(800);
console.log(await c.ev(`(async()=>{ const b = await (await fetch(${JSON.stringify("/" + f)})).arrayBuffer(); const a = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(b); const d = a.getChannelData(0), o = []; for (let s = 0; s < a.duration; s += 2){ let q = 0, n = 0; for (let i = s * 48000 | 0; i < Math.min(d.length, (s + 2) * 48000); i++){ q += d[i] * d[i]; n++; } o.push(Math.sqrt(q / n).toFixed(3)); } return a.duration.toFixed(2) + "s rms: " + o.join(" "); })()`, true)); c.ws.close();
