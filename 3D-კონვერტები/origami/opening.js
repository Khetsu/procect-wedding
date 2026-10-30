/* 3D კონვერტი II · ორიგამი — მწვანე ვაშის ქაღალდის კვადრატი, ოთხივე კუთხე ცენტრისკენ დაკეცილია და ოქროს სტიკერით დახურულია.
   გახსნა: სტიკერი ტრიალით აფრინდება → ოთხი კუთხე რიგ-რიგობით, რბილი მოღუნვით იშლება (ჯვარედინად, როგორც ნამდვილ ორიგამიში) →
   გაშლილ ფურცელზე თავად მოსაწვევია; ფურცელი ჰაერში აიწევს, კამერისკენ შემობრუნდება და მოფრინავს. */
window.OPENING = (function(){
"use strict";
let S, parts = [], st, cam0, pts, fired = {};
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, mix = (a, b, k) => a + (b - a) * k;
const back = t => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const { M4 } = Q, EL = 62, K = .7071, HC = .3536;
const FL = [{ h: [.25, -.25], n: [K, -K], r: .0045, at: .55 }, { h: [-.25, .25], n: [-K, K], r: .0034, at: .95 }, { h: [-.25, -.25], n: [-K, -K], r: .0024, at: 1.35 }, { h: [.25, .25], n: [K, K], r: .0014, at: 1.75 }];

function inner(x){ const { C, TH, DOTS } = x, F = Ink.face(1024, 1024), tone = TH.foilTone, cx = 512;
  Ink.paper(F, "#F8F5EC", { seed: 41, grain: 9, fiber: 1.4 });
  F.x.strokeStyle = "rgba(86,104,79,.18)"; F.x.lineWidth = 2; F.x.beginPath(); F.x.moveTo(512, 0); F.x.lineTo(1024, 512); F.x.lineTo(512, 1024); F.x.lineTo(0, 512); F.x.closePath(); F.x.stroke();
  const sprig = (X, Y, a) => { const x = F.x; x.save(); x.translate(X, Y); x.rotate(a); x.strokeStyle = "#7E9470"; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(20, -90, 0, -190); x.stroke();
    for (let i = 0; i < 8; i++){ const t = i / 8, py = -t * 180, sd = i % 2 ? 1 : -1; x.save(); x.translate(Math.sin(t * 3) * 10, py); x.rotate(sd * .9); x.fillStyle = i % 3 ? "#A9B79E" : "#8FA184"; x.beginPath(); x.ellipse(sd * 18, 0, 22, 8, 0, 0, 6.28); x.fill(); x.restore(); } x.restore(); };
  sprig(120, 120, -.78 + Math.PI); sprig(904, 120, .78 + Math.PI); sprig(120, 904, -.78 - Math.PI * .0 - 1.57 + .78); sprig(904, 904, .78);
  Ink.foil(F, c => { c.lineWidth = 3; [[60, 60, 1, 1], [964, 60, -1, 1], [60, 964, 1, -1], [964, 964, -1, -1]].forEach(([X, Y, a, b]) => { c.beginPath(); c.moveTo(X, Y + b * 120); c.lineTo(X, Y); c.lineTo(X + a * 120, Y); c.stroke(); }); }, tone);
  Ink.wreath(F, cx, 300, 70, tone); Ink.foil(F, c => Ink.text(c, C.mono, cx, 322, `66px ${TH.script}`), tone);
  F.x.fillStyle = TH.cardSoft; Ink.text(F.x, C.kicker, cx, 420, `500 24px ${TH.serif}`, { ls: 3 });
  F.x.fillStyle = TH.cardInk; Ink.text(F.x, C.a, cx, 520, `400 84px ${TH.serif}`); Ink.foil(F, c => Ink.text(c, "&", cx, 600, `92px ${TH.script}`), tone); F.x.fillStyle = TH.cardInk; Ink.text(F.x, C.b, cx, 700, `400 84px ${TH.serif}`);
  Ink.divider(F, cx, 760, 300, tone); F.x.fillStyle = TH.cardInk; Ink.text(F.x, DOTS, cx, 818, `400 38px ${TH.num}`, { ls: 10 }); F.x.fillStyle = TH.cardSoft; Ink.text(F.x, `${C.time} · ${C.city}`, cx, 868, `500 22px ${TH.serif}`, { ls: 3 });
  return F; }
function outer(){ const F = Ink.face(1024, 1024); Ink.pattern(F, "leaves", { bg: "#6F8565", c1: "#7E9473", c2: "#61775A", fg: "#D8BE82", scale: 1.6, seed: 5 }); Ink.paper(F, "rgba(0,0,0,0)", { grain: 10, fiber: 1.2, mottle: .06 }); return F; }
function sticker(x){ const F = Ink.face(256, 256), c = F.x; c.beginPath(); c.arc(128, 128, 124, 0, 6.28); c.fillStyle = "#C2A160"; c.fill(); F.mx.fillStyle = "#fff"; F.mx.beginPath(); F.mx.arc(128, 128, 124, 0, 6.28); F.mx.fill();
  F.mx.fillStyle = "#000"; c.fillStyle = "#6E5326"; [F.x, F.mx].forEach(k => { k.lineWidth = 3; k.strokeStyle = k === F.mx ? "#000" : "#6E5326"; k.beginPath(); k.arc(128, 128, 100, 0, 6.28); k.stroke(); Ink.text(k, x.C.mono, 128, 150, `64px ${x.TH.script}`); }); return F; }

function build(x){
  pts = Q.particles(600); const IN = inner(x), OUT = outer(), tIn = Q.texFrom(IN.c), tOut = Q.texFrom(OUT.c), tM = Q.texFrom(Ink.masks(IN, OUT));
  const mk = () => { const s = Q.sheet({ w: 1, h: 1, nx: 40, ny: 40 }); s.tf = tIn; s.tb = tOut; s.tm = tM; s.gloss = .2; return s; };
  const base = mk(); base.clip = [[-1, -1, -.5], [1, -1, -.5], [-1, 1, -.5], [1, 1, -.5]];
  parts = [base, ...FL.map(f => { const s = mk(); s.fold = [f.h[0], f.h[1], f.n[0], f.n[1]]; s.clip = [[f.n[0], f.n[1], HC - .003]]; s.beta = Math.PI; s.r = f.r; s.F = f; return s; })];
  const SF = sticker(x); st = Q.sheet({ w: .17, h: .17, front: SF.c, mask: Ink.masks(SF, null), nx: 4, ny: 4 }); st.foil = [1, .82, .5]; st.gloss = .4;
  const props = Env3.scatter([{ tex: Env3.leafTex("#B9C7A8", "#6F8565"), n: 7, size: .16, ring: [.85, 1.35], curl: .2 }, { tex: Env3.petalTex("#FFFDF6", "#EFE6CF"), n: 6, size: .08, ring: [.8, 1.3], curl: .3 }], 11, .7);
  cam0 = Env3.fit(1.3, EL, 32);
  S = { cam: { fov: 32, pos: cam0.pos.slice(), at: [0, 0, 0] }, light: { dir: [-.5, -1, -.35], col: [1.05, 1, .93], sky: [.6, .64, .58], gnd: [.42, .42, .38], size: 1.7 },
    sheets: [Env3.table(x, "linen", { c1: "#D9DCCC", seed: 6 }), ...props, ...parts, st], pts, bg: [.85, .86, .8], foil: [1, .84, .52] };
  Env3.ambient(pts, 30, [2.4, .9, 2.4], [1, .92, .7], .01); return S;
}

function frame(T, g, k, dt){
  const t = Math.max(T, 0), idle = T < 0, bob = idle ? Math.sin(g * 1.2) * .012 : 0;
  if (pts.R() < dt * 5) Env3.ambient(pts, 1, [2.4, .8, 2.4], [1, .92, .7], .01);
  const lift = io(seg(t, 3.1, 4.3)), fly = Math.pow(seg(t, 4.3, 5.4), 2.2), e = EL * Math.PI / 180;
  const G = M4.pose([0, .006 + bob + lift * .5 + Math.sin(e) * fly * cam0.d * .78, lift * .42 + Math.cos(e) * fly * cam0.d * .78], [lift * (90 - EL), idle ? Math.sin(g * .5) * 6 + 45 : mix(45 + Math.sin(g * .5) * 6, 0, io(seg(t, 0, 3.4))), 0]);
  const Gf = t > 5.5 ? M4.pose([0, .006, 0]) : G; parts.forEach(s => s.M = Gf);
  parts.slice(1).forEach((s, i) => { const f = s.F, o = idle ? 0 : seg(t, f.at, f.at + 1.05), b = back(o); s.beta = Math.PI * (1 - Math.min(1.03, b)); s.r = f.r + .07 * Math.sin(Math.PI * Math.min(1, o)); s.flex = .02 * Math.sin(Math.PI * o);
    if (!idle && !s.fired && o > .55){ s.fired = 1; const c = [f.h[0] + f.n[0] * .2, .1, f.h[1] + f.n[1] * .2]; pts.burst(c, 14, { speed: .3, g: .05, life: 1.6, s: .016, c: [1, .9, .65] }); } });
  // სტიკერი
  const sk = io(seg(t, .1, .9)); st.M = M4.mul(G, M4.pose([sk * .45, .014 + sk * .7, -sk * .2], [sk * 70, sk * 260, sk * 30], 1 + sk * .3)); st.op = 1 - seg(t, .7, 1); st.visible = st.op > 0;
  if (!idle && !fired.s && t > .2){ fired.s = 1; pts.burst([0, .05, 0], 24, { speed: .45, g: .1, life: 1.4, s: .02, c: [1, .85, .5] }); }
  const c = S.cam, after = seg(t, 5.2, 6.6), yawC = after * (Math.sin(g * .12) * 10 + k * 70), elC = mix(EL, 42, after * k), dist = cam0.d * mix(1, .85, after * k);
  const ee = elC * Math.PI / 180, yv = yawC * Math.PI / 180; c.at = [0, 0, 0]; c.pos = [Math.sin(yv) * Math.cos(ee) * dist, Math.sin(ee) * dist, Math.cos(yv) * Math.cos(ee) * dist];
}
return { hint: "შეეხეთ სტიკერს", dur: 5.4, build, frame };
})();
