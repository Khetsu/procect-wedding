/* ამბავი · 3D კონვერტის ამწყობი: შიდა კედელი (სარჩულით), ბარათი, ჯიბე (V-ჭრილით), სამკუთხა სარქველი ნაკეცზე მოღუნვით.
   ლოკალური კოორდინატები: X — მარჯვნივ, Z — მაყურებლისკენ, Y — ზემოთ; ზედა კიდე (ანჯამა) z = -H/2. */
window.Env3 = (function(){
"use strict";
const { M4 } = Q;
const flipV = F => { const c = Ink.cnv(F.w, F.h), x = c.getContext("2d"); x.translate(0, F.h); x.scale(1, -1); x.drawImage(F.c, 0, 0); const m = Ink.cnv(F.w, F.h), y = m.getContext("2d"); y.translate(0, F.h); y.scale(1, -1); y.drawImage(F.m, 0, 0); return { c, m, w: F.w, h: F.h }; };
const RES = 1024;

/* ბარათის სახე (ფერადი + ფოლგის ნიღაბი) */
function card(x, w, h, o = {}){ const { C, TH } = x, dots = x.DOTS, F = Ink.face(w, h), cx = w / 2, sc = w / 1000, tone = TH.foilTone || "#C9A35A";
  Ink.paper(F, o.paper || TH.card, { seed: 21, grain: 8, fiber: .7 });
  if (o.bg) o.bg(F); Ink.frame(F, 34 * sc, 4 * sc, tone); Ink.frame(F, 50 * sc, 1.6 * sc, tone);
  const ink = o.ink || TH.cardInk, soft = o.soft || TH.cardSoft, top = h * (o.top || .2);
  if (h < w * 1.1){ /* ჰორიზონტალური ბარათი: ყველაფერი ერთ კომპაქტურ განლაგებაში */
    const fitTxt = (s, size, font, max) => { F.x.font = `${size}px ${font}`; const m = F.x.measureText(s).width; return m > max ? size * max / m : size; };
    F.x.fillStyle = soft; Ink.text(F.x, C.kicker, cx, h * .14, `500 ${fitTxt(C.kicker, 26 * sc, TH.serif, w * .76)}px ${TH.serif}`, { ls: 2 * sc });
    if (C.big){ F.x.fillStyle = ink; Ink.text(F.x, C.a, cx - 170 * sc, h * .56, `400 ${86 * sc}px ${TH.serif}`, { align: "right" }); Ink.foil(F, c => Ink.text(c, C.big, cx - 120 * sc, h * .62, `400 ${250 * sc}px ${TH.num}`, { align: "left" }), tone); }
    else { const nm = C.b ? `${C.a}  &  ${C.b}` : C.a, fs = fitTxt(nm, 92 * sc, TH.serif, w * .8); F.x.fillStyle = ink; Ink.text(F.x, nm, cx, h * .48, `400 ${fs}px ${TH.serif}`); }
    F.x.fillStyle = soft; Ink.text(F.x, C.latin || "", cx, h * (C.big ? .76 : .61), `${54 * sc}px ${TH.script}`);
    Ink.divider(F, cx, h * (C.big ? .82 : .69), 300 * sc, tone); F.x.fillStyle = ink; Ink.text(F.x, dots, cx, h * (C.big ? .9 : .79), `500 ${40 * sc}px ${TH.num}`, { ls: 10 * sc });
    if (!C.big){ F.x.fillStyle = soft; Ink.text(F.x, `${C.time} · ${C.city}`, cx, h * .88, `500 ${24 * sc}px ${TH.serif}`, { ls: 3 * sc }); }
    if (!C.big) Ink.foil(F, c => Ink.text(c, C.mono, cx, h * .3, `${56 * sc}px ${TH.script}`), tone); if (o.extra) o.extra(F, h); return F; }
  Ink.wreath(F, cx, top, 92 * sc, tone); Ink.foil(F, c => Ink.text(c, C.mono, cx, top + 30 * sc, `${88 * sc}px ${TH.script}`), tone);
  const y0 = top + 190 * sc; F.x.fillStyle = soft; Ink.wrap(F.x, C.kicker, cx, y0, w * .7, 44 * sc, `500 ${30 * sc}px ${TH.serif}`, { ls: 3 * sc });
  let y = y0 + 150 * sc; F.x.fillStyle = ink;
  if (C.big){ Ink.text(F.x, C.a, cx, y, `400 ${92 * sc}px ${TH.serif}`); Ink.foil(F, c => Ink.text(c, C.big, cx, y + 300 * sc, `400 ${330 * sc}px ${TH.num}`), tone); y += 360 * sc; }
  else if (C.b){ Ink.text(F.x, C.a, cx, y, `400 ${118 * sc}px ${TH.serif}`); Ink.foil(F, c => Ink.text(c, "&", cx, y + 118 * sc, `${120 * sc}px ${TH.script}`), tone); F.x.fillStyle = ink; Ink.text(F.x, C.b, cx, y + 250 * sc, `400 ${118 * sc}px ${TH.serif}`); y += 250 * sc; }
  else { Ink.text(F.x, C.a, cx, y + 60 * sc, `400 ${130 * sc}px ${TH.serif}`); y += 60 * sc; }
  F.x.fillStyle = soft; Ink.text(F.x, C.latin || "", cx, y + 105 * sc, `${66 * sc}px ${TH.script}`);
  Ink.divider(F, cx, y + 175 * sc, 380 * sc, tone); F.x.fillStyle = ink; Ink.text(F.x, dots, cx, y + 245 * sc, `500 ${48 * sc}px ${TH.num}`, { ls: 12 * sc });
  F.x.fillStyle = soft; Ink.text(F.x, `${C.time} · ${C.city}`, cx, y + 310 * sc, `500 ${28 * sc}px ${TH.serif}`, { ls: 4 * sc });
  if (o.extra) o.extra(F, y + 330 * sc); return F; }
/* მარტივი უკანა მხარე */
function plain(col, w, h, seed, deco){ const F = Ink.face(w, h); Ink.paper(F, col, { seed, grain: 8 }); if (deco) deco(F); return F; }

/* კონვერტი */
function make(x, o){
  const W = o.W || 1, H = o.H || .7, Hf = o.Hf || H * .62, notch = o.notch || .5, tw = RES, th = Math.round(RES * H / W), fh = Math.round(RES * Hf / W), TH = x.TH, tone = TH.foilTone || "#C9A35A";
  // შიდა კედელი: ქაღალდი + სარჩული
  const inner = Ink.face(tw, th); Ink.paper(inner, o.paperIn || o.paper, { seed: 2 }); { const L = Ink.face(tw - 70, Math.round(th * .82)); o.liner(L); inner.x.drawImage(L.c, 35, 0); inner.mx.drawImage(L.m, 35, 0);
    const g = inner.x.createLinearGradient(0, 0, 0, th); g.addColorStop(0, "rgba(0,0,0,.35)"); g.addColorStop(.25, "rgba(0,0,0,.04)"); g.addColorStop(1, "rgba(0,0,0,.18)"); inner.x.fillStyle = g; inner.x.fillRect(0, 0, tw, th); }
  const address = o.front ? (() => { const F = Ink.face(tw, th); Ink.paper(F, o.paper, { seed: 6 }); o.front(F); return F; })() : plain(o.paper, tw, th, 6);
  // ჯიბე: V-ჭრილი, ნაკეცების ჩრდილები
  const pk = Ink.face(tw, th), pin = plain(o.paperIn || o.paper, tw, th, 8); Ink.paper(pk, o.paper, { seed: 5 });
  const px = pk.x, nY = th * notch, bY = th * .42;
  const tri = (pts, col) => { px.beginPath(); pts.forEach(([a, b], i) => i ? px.lineTo(a, b) : px.moveTo(a, b)); px.closePath(); px.fillStyle = col; px.fill(); };
  tri([[0, 0], [tw * .48, nY], [tw * .48, nY + 30], [0, th]], "rgba(255,255,255,.07)"); tri([[tw, 0], [tw * .52, nY], [tw * .52, nY + 30], [tw, th]], "rgba(0,0,0,.06)");
  px.save(); px.shadowColor = "rgba(0,0,0,.28)"; px.shadowBlur = 18; px.shadowOffsetY = -5; tri([[0, th], [tw * .44, bY + 30], [tw * .5, bY], [tw * .56, bY + 30], [tw, th]], "rgba(0,0,0,0)"); px.restore();
  px.save(); px.beginPath(); px.moveTo(0, th); px.lineTo(tw * .44, bY + 30); px.quadraticCurveTo(tw * .5, bY - 6, tw * .56, bY + 30); px.lineTo(tw, th); px.closePath(); px.clip(); Ink.paper({ x: px, w: tw, h: th }, o.paper, { seed: 9 });
  const gb = px.createLinearGradient(0, bY, 0, th); gb.addColorStop(0, "rgba(255,255,255,.08)"); gb.addColorStop(1, "rgba(0,0,0,.12)"); px.fillStyle = gb; px.fillRect(0, 0, tw, th); px.restore();
  px.strokeStyle = "rgba(255,255,255,.5)"; px.lineWidth = 2; px.beginPath(); px.moveTo(0, th); px.lineTo(tw * .44, bY + 30); px.quadraticCurveTo(tw * .5, bY - 6, tw * .56, bY + 30); px.lineTo(tw, th); px.stroke();
  if (o.pocketDeco) o.pocketDeco(pk);
  const notchPath = c => { c.moveTo(0, 0); c.lineTo(tw * .5, nY); c.lineTo(tw, 0); c.lineTo(tw, th); c.lineTo(0, th); c.closePath(); };
  Ink.shape(pk, notchPath); Ink.shape(pin, notchPath);
  // სარქველი: წინა (ღია მდგომარეობაში ზემოთ) — სარჩული; უკანა — გარე ქაღალდი ბეჭდით (დახატულია დახურული ხედით, მერე ვერტიკალურად ბრუნდება)
  const triOpen = c => { c.moveTo(0, fh); c.lineTo(tw, fh); c.lineTo(tw * .5 + 40, 30); c.quadraticCurveTo(tw * .5, 0, tw * .5 - 40, 30); c.closePath(); };
  const triClosed = c => { c.moveTo(0, 0); c.lineTo(tw, 0); c.lineTo(tw * .5 + 40, fh - 30); c.quadraticCurveTo(tw * .5, fh, tw * .5 - 40, fh - 30); c.closePath(); };
  const fl = Ink.face(tw, fh); Ink.paper(fl, o.paperIn || o.paper, { seed: 11 }); { const L = Ink.face(tw - 70, fh - 30); o.liner(L); fl.x.save(); fl.x.beginPath(); fl.x.moveTo(35, fh); fl.x.lineTo(tw - 35, fh); fl.x.lineTo(tw * .5 + 26, 60); fl.x.quadraticCurveTo(tw * .5, 36, tw * .5 - 26, 60); fl.x.closePath(); fl.x.clip(); fl.x.drawImage(L.c, 35, 30); fl.x.restore();
    fl.mx.save(); fl.mx.beginPath(); fl.mx.moveTo(35, fh); fl.mx.lineTo(tw - 35, fh); fl.mx.lineTo(tw * .5 + 26, 60); fl.mx.quadraticCurveTo(tw * .5, 36, tw * .5 - 26, 60); fl.mx.closePath(); fl.mx.clip(); fl.mx.drawImage(L.m, 35, 30); fl.mx.restore(); }
  Ink.shape(fl, triOpen);
  const fo = Ink.face(tw, fh); Ink.paper(fo, o.paper, { seed: 12 }); { const g = fo.x.createLinearGradient(0, 0, 0, fh); g.addColorStop(0, "rgba(255,255,255,.12)"); g.addColorStop(1, "rgba(0,0,0,.06)"); fo.x.fillStyle = g; fo.x.fillRect(0, 0, tw, fh); }
  if (o.flapDeco) o.flapDeco(fo, tw * .5, fh - 30, tw); Ink.shape(fo, triClosed); const foF = flipV(fo);
  const cw = W * (o.cardW || .9), ch = H * (o.cardH || .86), cardF = o.cardFace || card(x, 1000, Math.round(1000 * ch / cw)), cardB = plain(TH.card, 512, Math.round(512 * ch / cw), 31);
  const S = (w, h, f, b, extra = {}) => Q.sheet(Object.assign({ w, h, front: f.c, back: b && b.c, mask: Ink.masks(f, b) }, extra));
  const back = S(W, H, inner, address, { nx: 2, ny: 2 }), cardS = S(cw, ch, cardF, cardB, { nx: 16, ny: 16 }), pocket = S(W, H, pk, pin, { nx: 2, ny: 2 }), flap = S(W, Hf, fl, foF, { nx: 8, ny: 30 });
  flap.fold = [0, Hf / 2, 0, -1]; flap.beta = Math.PI; flap.r = .0065; [back, cardS, pocket, flap].forEach(s => s.gloss = .18); cardS.gloss = .3;
  const E = { W, H, Hf, cw, ch, back, card: cardS, pocket, flap, sheets: [back, cardS, pocket, flap], G: M4.id(),
    /* G — კონვერტის მდებარეობა სამყაროში; open 0..1 — სარქვლის გაღება; card — ბარათის ლოკალური პოზა */
    set(G, open = 0, card = null){ this.G = G; back.M = M4.mul(G, M4.pose([0, 0, 0])); pocket.M = M4.mul(G, M4.pose([0, .009, 0]));
      flap.M = M4.mul(G, M4.pose([0, .0005, -H / 2 - Hf / 2])); const k = Math.max(0, Math.min(1, open)); flap.beta = Math.PI * (1 - k); flap.r = .0065 + .07 * Math.sin(Math.PI * k) * (o.curl == null ? 1 : o.curl);
      flap.flex = .03 * Math.sin(Math.PI * k); if (card) cardS.M = M4.mul(G, M4.pose(card.p, card.r || [0, 0, 0], card.s || 1)); else cardS.M = M4.mul(G, M4.pose([0, .0045, H * .02])); },
    fade(v){ [back, pocket, flap].forEach(s => s.op = v); } };
  E.set(M4.id()); return E;
}
/* კამერა: რომ სიგანე `wid` ეკრანზე ჩაეტიოს (დახრის კუთხე `el` გრადუსი) */
function fit(wid, el, fov = 32, at = [0, 0, 0], yaw = 0){ const asp = innerWidth / innerHeight, t = Math.tan(fov * Math.PI / 360), d = Math.max(wid / (2 * t * asp), wid * .9 / (2 * t)) , e = el * Math.PI / 180, y = yaw * Math.PI / 180;
  return { fov, at, pos: [at[0] + Math.sin(y) * Math.cos(e) * d, at[1] + Math.sin(e) * d, at[2] + Math.cos(y) * Math.cos(e) * d], d }; }
function table(x, kind, o, size = 7){ const s = Q.sheet({ w: size, h: size, front: Ink.table(kind, o), nx: 2, ny: 2 }); s.M = Q.M4.pose([0, -.001, 0]); s.cast = false; s.gloss = o.gloss || .12; s.order = -1; return s; }
function petalTex(c1, c2){ const F = Ink.face(256, 256), x = F.x, g = x.createRadialGradient(110, 150, 10, 128, 128, 130); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g;
  x.beginPath(); x.moveTo(128, 246); x.bezierCurveTo(250, 170, 230, 20, 128, 12); x.bezierCurveTo(26, 20, 6, 170, 128, 246); x.fill(); x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 2; x.beginPath(); x.moveTo(128, 236); x.quadraticCurveTo(120, 130, 128, 30); x.stroke(); return F.c; }
function leafTex(c1, c2){ const F = Ink.face(256, 256), x = F.x, g = x.createLinearGradient(0, 0, 256, 256); g.addColorStop(0, c1); g.addColorStop(1, c2); x.fillStyle = g;
  x.beginPath(); x.moveTo(128, 250); x.bezierCurveTo(240, 180, 220, 40, 128, 6); x.bezierCurveTo(36, 40, 16, 180, 128, 250); x.fill(); x.strokeStyle = "rgba(255,255,255,.4)"; x.lineWidth = 3; x.beginPath(); x.moveTo(128, 250); x.lineTo(128, 20); x.stroke();
  x.lineWidth = 1.5; for (let i = 0; i < 6; i++){ const y = 200 - i * 30; x.beginPath(); x.moveTo(128, y); x.lineTo(80, y - 30); x.moveTo(128, y); x.lineTo(176, y - 30); x.stroke(); } return F.c; }
/* მიმოფანტული საგნები მაგიდაზე: [{tex, n, size, ring:[r1,r2], curl}] */
function scatter(list, seed = 3, avoid = .62){ const R = Ink.rng(seed), out = [];
  for (const it of list){ const tx = Q.texFrom(it.tex); for (let i = 0; i < it.n; i++){ let px, pz, k = 0; do { const a = R() * 6.283, r = it.ring[0] + R() * (it.ring[1] - it.ring[0]); px = Math.cos(a) * r * 1.1; pz = Math.sin(a) * r * .9; k++; } while (Math.abs(px) < avoid && Math.abs(pz) < avoid * .75 && k < 20);
      const sz = it.size * (.75 + R() * .5), s = Q.sheet({ w: sz, h: sz, nx: 6, ny: 6 }); s.tf = tx; s.tb = tx; s.curl = [it.curl * sz, it.curl * sz * .4]; s.M = Q.M4.pose([px, .004 + R() * .01, pz], [R() * 8, R() * 360, R() * 8]); s.gloss = it.gloss || .2; out.push(s); } }
  return out; }
/* ნაწილაკების ფონი */
function ambient(pts, n, box, col, s = .012){ for (let i = 0; i < n; i++) pts.add({ p: [(pts.R() - .5) * box[0], .05 + pts.R() * box[1], (pts.R() - .5) * box[2]], v: [(pts.R() - .5) * .02, .01 + pts.R() * .02, 0], life: 4 + pts.R() * 5, g: 0, s: s * (.5 + pts.R()), c: col, drag: 0 }); }
return { make, card, plain, flipV, fit, table, petalTex, leafTex, scatter, ambient };
})();
