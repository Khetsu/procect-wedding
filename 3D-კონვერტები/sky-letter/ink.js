/* ამბავი · „მელანი“ — ტექსტურების მხატვარი 3D ძრავისთვის: ქაღალდი, სარჩულის ნიმუშები, ფოლგის ნიღბები, ბარათის ტექსტი (canvas 2D). */
window.Ink = (function(){
"use strict";
const rng = s => { let a = (s * 2654435761) >>> 0 || 7; return () => { a ^= a << 13; a >>>= 0; a ^= a >> 17; a ^= a << 5; a >>>= 0; return a / 4294967296; }; };
const cnv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/* ზედაპირი: ფერი + ფოლგის ნიღაბი (თეთრი = ფოლგა) */
function face(w, h){ const c = cnv(w, h), m = cnv(w, h); return { c, m, x: c.getContext("2d"), mx: m.getContext("2d"), w, h }; }
function paper(F, col, o = {}){ const { x, w, h } = F, R = rng(o.seed || 3); x.fillStyle = col; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++){ const X = R() * w, Y = R() * h, r = (.08 + R() * .25) * Math.max(w, h), g = x.createRadialGradient(X, Y, 0, X, Y, r), a = (o.mottle == null ? .045 : o.mottle) * R();
    g.addColorStop(0, R() < .5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(X - r, Y - r, 2 * r, 2 * r); }
  const id = x.getImageData(0, 0, w, h), d = id.data, gn = o.grain == null ? 10 : o.grain; for (let i = 0; i < d.length; i += 4){ const k = (R() - .5) * gn; d[i] += k; d[i + 1] += k; d[i + 2] += k; } x.putImageData(id, 0, 0);
  x.lineCap = "round"; const nf = (o.fiber == null ? 1 : o.fiber) * w * h / 2500; for (let i = 0; i < nf; i++){ const X = R() * w, Y = R() * h, a = R() * 6.28, l = 4 + R() * 16; x.lineWidth = .5 + R() * .7;
    x.strokeStyle = R() < .5 ? `rgba(255,255,255,${.04 + R() * .07})` : `rgba(0,0,0,${.025 + R() * .04})`; x.beginPath(); x.moveTo(X, Y); x.quadraticCurveTo(X + Math.cos(a + .7) * l * .6, Y + Math.sin(a + .7) * l * .6, X + Math.cos(a) * l, Y + Math.sin(a) * l); x.stroke(); }
  return F; }
/* ფოლგით დახატვა: ფერად ტექსტურაზე ოქროს ტონი, ნიღაბზე თეთრი */
function foil(F, draw, tone = "#C9A35A"){ F.x.save(); F.x.fillStyle = F.x.strokeStyle = tone; draw(F.x); F.x.restore(); F.mx.save(); F.mx.fillStyle = F.mx.strokeStyle = "#fff"; draw(F.mx); F.mx.restore(); }
function both(F, fn){ fn(F.x); fn(F.mx); }
function text(x, s, X, Y, font, o = {}){ x.font = font; x.textAlign = o.align || "center"; x.textBaseline = o.base || "alphabetic"; if ("letterSpacing" in x) x.letterSpacing = (o.ls || 0) + "px"; x.fillText(s, X, Y); if ("letterSpacing" in x) x.letterSpacing = "0px"; }
function wrap(x, s, X, Y, maxW, lh, font, o = {}){ x.font = font; const words = s.split(" "), lines = []; let cur = "";
  for (const wd of words){ const t = cur ? cur + " " + wd : wd; if (x.measureText(t).width > maxW && cur){ lines.push(cur); cur = wd; } else cur = t; } if (cur) lines.push(cur);
  lines.forEach((l, i) => text(x, l, X, Y + i * lh, font, o)); return lines.length; }
/* ფორმა: alpha-ს ჭრა მოცემული path-ით */
function shape(F, path){ const x = F.x; x.save(); x.globalCompositeOperation = "destination-in"; x.fillStyle = "#000"; x.globalAlpha = 1; x.beginPath(); path(x); x.fill(); x.restore(); }
/* ორი ნიღბის გაერთიანება ერთ ტექსტურად: R = წინა მხარის ფოლგა, G = უკანასი */
function masks(front, back){ const w = front ? front.w : back.w, h = front ? front.h : back.h, c = cnv(w, h), x = c.getContext("2d"); x.fillStyle = "#000"; x.fillRect(0, 0, w, h); x.globalCompositeOperation = "lighter";
  const tint = (F, col) => { const t = cnv(w, h), tx = t.getContext("2d"); tx.drawImage(F.m, 0, 0, w, h); tx.globalCompositeOperation = "source-in"; tx.fillStyle = col; tx.fillRect(0, 0, w, h); x.drawImage(t, 0, 0); };
  if (front) tint(front, "#f00"); if (back) tint(back, "#0f0"); return c; }

/* ---------- ნიმუშები ---------- */
function pattern(F, kind, o){ const { x, w, h } = F, R = rng(o.seed || 9), s = o.scale || 1; x.save(); x.fillStyle = o.bg; x.fillRect(0, 0, w, h);
  const fg = (cb) => foil(F, cb, o.fg);
  if (kind === "waves"){ fg(c => { c.lineWidth = 1.6 * s; for (let y = -20; y < h + 40; y += 26 * s) for (let X = -40; X < w + 40; X += 52 * s){ c.beginPath(); c.arc(X + ((y / (26 * s)) % 2 ? 26 * s : 0), y, 22 * s, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(X + ((y / (26 * s)) % 2 ? 26 * s : 0), y, 13 * s, Math.PI, 0); c.stroke(); } }); }
  else if (kind === "leaves"){ for (let i = 0; i < w * h / (2600 * s * s); i++){ const X = R() * w, Y = R() * h, a = R() * 6.28, L = (16 + R() * 14) * s; x.save(); x.translate(X, Y); x.rotate(a); x.fillStyle = R() < .5 ? o.c1 : o.c2; x.globalAlpha = .9;
      x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(L * .5, -L * .32, L, 0); x.quadraticCurveTo(L * .5, L * .32, 0, 0); x.fill(); x.restore(); }
    fg(c => { for (let i = 0; i < w * h / (9000 * s * s); i++){ c.beginPath(); c.arc(R() * w, R() * h, (1.4 + R() * 2) * s, 0, 6.28); c.fill(); } }); }
  else if (kind === "terrazzo"){ for (let i = 0; i < w * h / (700 * s * s); i++){ const X = R() * w, Y = R() * h, r = (2 + R() * 7) * s; x.fillStyle = o.cs[(R() * o.cs.length) | 0]; x.beginPath();
      for (let k = 0; k < 6; k++){ const a = k / 6 * 6.28 + R() * .5, rr = r * (.6 + R() * .5); k ? x.lineTo(X + Math.cos(a) * rr, Y + Math.sin(a) * rr) : x.moveTo(X + Math.cos(a) * rr, Y + Math.sin(a) * rr); } x.fill(); }
    fg(c => { for (let i = 0; i < w * h / (5000 * s * s); i++){ c.beginPath(); c.arc(R() * w, R() * h, (1 + R() * 2.4) * s, 0, 6.28); c.fill(); } }); }
  else if (kind === "rays"){ fg(c => { c.lineWidth = 1.2 * s; const cx = w / 2, cy = h * 1.05; for (let i = 0; i < 64; i++){ const a = Math.PI + i / 63 * Math.PI; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * w * 1.5, cy + Math.sin(a) * w * 1.5); c.stroke(); }
      for (let r = 40 * s; r < w * 1.4; r += 46 * s){ c.beginPath(); c.arc(cx, cy, r, Math.PI, 0); c.stroke(); } }); }
  else if (kind === "dots"){ fg(c => { for (let y = 10 * s; y < h; y += 22 * s) for (let X = ((y / (22 * s)) % 2) * 11 * s + 10 * s; X < w; X += 22 * s){ c.beginPath(); c.arc(X, y, 2.2 * s, 0, 6.28); c.fill(); } }); }
  x.restore(); return F; }

/* ---------- ორნამენტები ---------- */
function frame(F, inset, lw, tone, r = 0){ foil(F, c => { c.lineWidth = lw; c.beginPath(); if (c.roundRect) c.roundRect(inset, inset, F.w - 2 * inset, F.h - 2 * inset, r); else c.rect(inset, inset, F.w - 2 * inset, F.h - 2 * inset); c.stroke(); }, tone); }
function divider(F, X, Y, w, tone){ foil(F, c => { c.lineWidth = 2; c.beginPath(); c.moveTo(X - w / 2, Y); c.lineTo(X - 14, Y); c.moveTo(X + 14, Y); c.lineTo(X + w / 2, Y); c.stroke(); c.beginPath(); c.moveTo(X, Y - 8); c.lineTo(X + 8, Y); c.lineTo(X, Y + 8); c.lineTo(X - 8, Y); c.closePath(); c.fill(); }, tone); }
function wreath(F, X, Y, r, tone){ foil(F, c => { c.lineWidth = 2; for (const sd of [-1, 1]){ c.beginPath(); c.arc(X, Y, r, sd < 0 ? Math.PI * .58 : Math.PI * .42, sd < 0 ? Math.PI * 1.35 : -Math.PI * .35, sd > 0); c.stroke();
    for (let i = 0; i < 9; i++){ const a = (sd < 0 ? Math.PI * .6 + i * .085 * Math.PI : Math.PI * .4 - i * .085 * Math.PI), px = X + Math.cos(a) * r, py = Y + Math.sin(a) * r, L = r * .22 * (1 - i * .04);
      for (const out of [-1, 1]){ c.save(); c.translate(px, py); c.rotate(a + Math.PI / 2 * sd + out * .6 * sd); c.beginPath(); c.ellipse(L * .5, 0, L * .5, L * .2, 0, 0, 6.28); c.fill(); c.restore(); } } } }, tone); }
function seal(F, X, Y, r, o){ const x = F.x, R = rng(o.seed || 5); x.save(); x.beginPath(); for (let i = 0; i <= 48; i++){ const a = i / 48 * 6.283, k = 1 + .06 * Math.sin(a * 5 + 1) + .04 * Math.sin(a * 11) + (R() - .5) * .05; i ? x.lineTo(X + Math.cos(a) * r * k, Y + Math.sin(a) * r * k) : x.moveTo(X + Math.cos(a) * r * k, Y + Math.sin(a) * r * k); }
  x.closePath(); x.shadowColor = "rgba(0,0,0,.35)"; x.shadowBlur = r * .18; x.shadowOffsetY = r * .06; const g = x.createRadialGradient(X - r * .3, Y - r * .35, r * .1, X, Y, r * 1.05); g.addColorStop(0, o.c1); g.addColorStop(.55, o.c2); g.addColorStop(1, o.c3); x.fillStyle = g; x.fill(); x.shadowColor = "transparent";
  const g2 = x.createLinearGradient(X - r, Y - r, X + r, Y + r); g2.addColorStop(0, o.c3); g2.addColorStop(1, o.c1); x.fillStyle = g2; x.beginPath(); x.arc(X, Y, r * .7, 0, 6.28); x.fill();
  x.strokeStyle = "rgba(255,255,255,.3)"; x.lineWidth = r * .03; x.beginPath(); x.arc(X + r * .02, Y + r * .02, r * .7, 0, 6.28); x.stroke(); x.restore();
  if (o.mono){ x.save(); x.fillStyle = "rgba(0,0,0,.35)"; text(x, o.mono, X - 1.5, Y + r * .22 - 1.5, `${r * .62}px ${o.font}`); x.fillStyle = "rgba(255,255,255,.35)"; text(x, o.mono, X + 1.5, Y + r * .22 + 1.5, `${r * .62}px ${o.font}`); x.fillStyle = o.c2; text(x, o.mono, X, Y + r * .22, `${r * .62}px ${o.font}`); x.restore(); }
  if (o.foil) both(F, c => {}); }

/* ---------- სუფრის ზედაპირი (დიდი, უნაკერო) ---------- */
function table(kind, o){ const w = 1024, h = 1024, F = face(w, h), x = F.x, R = rng(o.seed || 4); x.fillStyle = o.c1; x.fillRect(0, 0, w, h);
  if (kind === "linen"){ for (let i = 0; i < 9000; i++){ x.strokeStyle = R() < .5 ? `rgba(255,255,255,${.05 + R() * .07})` : `rgba(0,0,0,${.03 + R() * .05})`; x.lineWidth = 1 + R(); const y = R() * h, X = R() * w; x.beginPath(); if (R() < .5){ x.moveTo(X, y); x.lineTo(X + 20 + R() * 60, y); } else { x.moveTo(X, y); x.lineTo(X, y + 20 + R() * 60); } x.stroke(); } }
  else if (kind === "marble"){ for (let k = 0; k < 14; k++){ x.strokeStyle = o.c3; x.globalAlpha = .08 + R() * .25; x.lineWidth = .8 + R() * 2.5; x.beginPath(); let X = R() * w, Y = -20, a = R() * .8 + .3; x.moveTo(X, Y);
      while (Y < h + 20){ a += (R() - .5) * .6; X += Math.cos(a) * 14; Y += Math.abs(Math.sin(a)) * 14 + 4; x.lineTo(X, Y); } x.stroke(); } x.globalAlpha = 1; }
  else if (kind === "wood"){ for (let y = 0; y < h; y += 2){ const k = .5 + .5 * Math.sin(y * .045 + Math.sin(y * .011) * 3); x.fillStyle = `rgba(${o.grain || "0,0,0"},${.05 + k * .12})`; x.fillRect(0, y, w, 2); }
    for (let i = 0; i < 3; i++){ const y = (i + 1) * h / 4; x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(0, y, w, 2); } }
  else if (kind === "velvet"){ for (let i = 0; i < 30; i++){ const X = R() * w, Y = R() * h, r = 80 + R() * 260, g = x.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, `rgba(255,255,255,${.04 + R() * .06})`); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(X - r, Y - r, 2 * r, 2 * r); } }
  paper(F, "rgba(0,0,0,0)", { grain: o.grainN || 8, fiber: 0, mottle: .05, seed: 12 }); return F.c; }

return { rng, cnv, face, paper, foil, both, text, wrap, shape, masks, pattern, frame, divider, wreath, seal, table, clamp };
})();
