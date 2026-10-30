// shared CDP helper: connect(port) → { send, ev, shot, ws }
import fs from "node:fs";
export async function connect(port = 9333){
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let p; for (let i = 0; i < 80 && !p; i++){ try { p = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page"); } catch {} if (!p) await sleep(250); }
  const ws = new WebSocket(p.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = {}, waiters = {}, errs = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]){ pend[m.id](m); delete pend[m.id]; } if (m.method && waiters[m.method]){ const w = waiters[m.method]; delete waiters[m.method]; w(m); }
    if (m.method === "Runtime.exceptionThrown") errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const once = name => new Promise(r => { waiters[name] = r; });
  const ev = async (js, aw) => { const m = await send("Runtime.evaluate", { expression: js, returnByValue: true, awaitPromise: !!aw }); return m.result && m.result.result && m.result.result.value; };
  const shot = async (file, fmt = "jpeg") => { const m = await send("Page.captureScreenshot", { format: fmt, quality: fmt === "jpeg" ? 97 : undefined }); fs.writeFileSync(file, Buffer.from(m.result.data, "base64")); };
  await send("Page.enable"); await send("Runtime.enable");
  return { send, ev, shot, once, ws, sleep, errs };
}
