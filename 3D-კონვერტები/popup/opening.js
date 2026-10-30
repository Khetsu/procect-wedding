/* 3D კონვერტი III · პოპ-აპი — ტერაკოტისფერი კონვერტი კაკლის მაგიდაზე, ზეითუნის ტოტებით.
   გახსნა: სარქველი იხსნება → დაკეცილი ბარათი ამოსრიალდება, კონვერტი უკან გადაიწევს და ქრება → ბარათი წიგნივით იშლება
   და ნაკეციდან 3D ქაღალდის სცენა დგება: კახური ბაღი, თაღი სახელებით, ყვავილების ბუჩქები; კამერა დაბლა ეშვება და სცენას ათვალიერებს. */
window.OPENING = (function(){
"use strict";
let S, E, card, arch, bush, cam0, pts, fired = {};
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, mix = (a, b, k) => a + (b - a) * k;
const { M4 } = Q, EL = 60, CW = .9, CH = 1.2;

function inside(x){ const { C, TH, DOTS } = x, w = 768, h = 1024, F = Ink.face(w, h), c = F.x, R = Ink.rng(8), tone = TH.foilTone;
  const sky = c.createLinearGradient(0, 0, 0, 512); sky.addColorStop(0, "#F4CFA8"); sky.addColorStop(1, "#FBEEDD"); c.fillStyle = sky; c.fillRect(0, 0, w, 512);
  const sun = c.createRadialGradient(384, 300, 10, 384, 300, 200); sun.addColorStop(0, "rgba(255,246,220,.95)"); sun.addColorStop(1, "rgba(255,246,220,0)"); c.fillStyle = sun; c.fillRect(0, 0, w, 512);
  const hill = (y0, amp, f, ph, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, 512); for (let X = 0; X <= w; X += 8) c.lineTo(X, y0 + Math.sin(X * f + ph) * amp + Math.sin(X * f * 2.3 + ph * 2) * amp * .35); c.lineTo(w, 512); c.closePath(); c.fill(); };
  hill(330, 22, .009, 1, "#B9B48C"); hill(370, 26, .012, 3, "#9AA078"); hill(420, 18, .015, 5, "#7E8A5C");
  c.strokeStyle = "rgba(70,80,45,.45)"; c.lineWidth = 3; for (let i = 0; i < 9; i++){ c.beginPath(); c.moveTo(i * 96 - 40, 512); c.lineTo(384 + (i - 4) * 30, 430); c.stroke(); }
  for (let i = 0; i < 7; i++){ const X = 40 + i * 115 + R() * 30, Y = 360 + R() * 40, hh = 70 + R() * 50; c.fillStyle = "#4F5E3A"; c.beginPath(); c.ellipse(X, Y, 11, hh / 2, 0, 0, 6.28); c.fill(); }
  c.strokeStyle = "rgba(90,60,40,.55)"; c.lineWidth = 2; for (let i = 0; i < 5; i++){ const X = 160 + R() * 440, Y = 110 + R() * 90; c.beginPath(); c.moveTo(X - 10, Y - 4); c.quadraticCurveTo(X - 4, Y - 9, X, Y); c.quadraticCurveTo(X + 4, Y - 9, X + 10, Y - 4); c.stroke(); }
  c.fillStyle = "#8E4E2E"; Ink.text(c, C.kicker, w / 2, 66, `500 24px ${TH.serif}`, { ls: 3 }); Ink.foil(F, k => Ink.text(k, `${DOTS}  ·  ${C.city}`, w / 2, 112, `400 30px ${TH.num}`, { ls: 6 }), tone);
  const fl = c.createLinearGradient(0, 512, 0, h); fl.addColorStop(0, "#8D9A68"); fl.addColorStop(1, "#A8B27F"); c.fillStyle = fl; c.fillRect(0, 512, w, 512);
  c.fillStyle = "#EFE3CC"; c.beginPath(); c.moveTo(330, 512); c.lineTo(438, 512); c.lineTo(560, h); c.lineTo(208, h); c.closePath(); c.fill();
  for (let i = 0; i < 160; i++){ const X = R() * w, Y = 520 + R() * 500; if (X > 200 && X < 570) continue; c.fillStyle = ["#F2C9C0", "#FFFFFF", "#E9A27F", "#D8869A"][(R() * 4) | 0]; c.beginPath(); c.arc(X, Y, 3 + R() * 5, 0, 6.28); c.fill(); }
  Ink.paper(F, "rgba(0,0,0,0)", { grain: 10, fiber: .8, mottle: .03 }); c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 512); c.lineTo(w, 512); c.stroke(); return F; }
function outside(x){ const { C, TH } = x, w = 768, h = 1024, F = Ink.face(w, h), half = Ink.face(w, 512), tone = TH.foilTone;
  Ink.paper(F, "#B9714A", { seed: 3 }); Ink.paper(half, "#B9714A", { seed: 4 }); Ink.frame(half, 26, 4, tone); Ink.frame(half, 38, 1.5, tone);
  Ink.wreath(half, w / 2, 170, 70, tone); Ink.foil(half, k => Ink.text(k, C.mono, w / 2, 192, `70px ${TH.script}`), tone);
  half.x.fillStyle = "#FBEFE4"; Ink.text(half.x, `${C.a} & ${C.b}`, w / 2, 330, `400 54px ${TH.serif}`); Ink.foil(half, k => Ink.text(k, x.DOTS, w / 2, 395, `400 30px ${TH.num}`, { ls: 8 }), tone);
  const flip = (src, dst) => { dst.save(); dst.translate(0, 512); dst.scale(1, -1); dst.drawImage(src, 0, 0); dst.restore(); }; flip(half.c, F.x); flip(half.m, F.mx); return F; }
function archTex(x){ const { C, TH } = x, w = 640, h = 520, F = Ink.face(w, h), c = F.x, tone = TH.foilTone, R = Ink.rng(12);
  const arc = (k, inset) => { k.beginPath(); k.moveTo(90 + inset, h); k.lineTo(90 + inset, 250); k.arc(320, 250, 230 - inset, Math.PI, 0); k.lineTo(550 - inset, h); k.closePath(); };
  c.save(); arc(c, 0); c.fillStyle = "#FBF5EC"; c.fill(); c.restore(); F.mx.save(); arc(F.mx, 0); F.mx.restore();
  Ink.foil(F, k => { k.lineWidth = 6; arc(k, 14); k.stroke(); k.lineWidth = 2; arc(k, 26); k.stroke(); }, tone);
  c.fillStyle = TH.cardInk; Ink.text(c, C.a, 320, 250, `400 76px ${TH.serif}`); Ink.foil(F, k => Ink.text(k, "&", 320, 330, `80px ${TH.script}`), tone); c.fillStyle = TH.cardInk; Ink.text(c, C.b, 320, 420, `400 76px ${TH.serif}`);
  c.fillStyle = TH.cardSoft; Ink.text(c, C.latin, 320, 478, `38px ${TH.script}`);
  const rose = (X, Y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(X, Y, r, 0, 6.28); c.fill(); c.strokeStyle = "rgba(120,40,30,.35)"; c.lineWidth = 2; for (let i = 0; i < 3; i++){ c.beginPath(); c.arc(X + (R() - .5) * 4, Y + (R() - .5) * 4, r * (.75 - i * .22), R() * 6, R() * 6 + 4); c.stroke(); } };
  const leaf = (X, Y, a) => { c.save(); c.translate(X, Y); c.rotate(a); c.fillStyle = R() < .5 ? "#6F7F4C" : "#8E9A62"; c.beginPath(); c.ellipse(16, 0, 18, 7, 0, 0, 6.28); c.fill(); c.restore(); };
  [[110, 120], [530, 120], [320, 22]].forEach(([X, Y]) => { for (let i = 0; i < 14; i++) leaf(X + (R() - .5) * 120, Y + (R() - .5) * 70, R() * 6.28); for (let i = 0; i < 6; i++) rose(X + (R() - .5) * 90, Y + (R() - .5) * 50, 14 + R() * 10, ["#E9A27F", "#F7E7DA", "#D8869A", "#C9704E"][i % 4]); });
  return F; }
function bushTex(){ const w = 900, h = 260, F = Ink.face(w, h), c = F.x, R = Ink.rng(31);
  for (const [cx, sp] of [[120, 150], [780, 150], [450, 60]]){ for (let i = 0; i < 60; i++){ const X = cx + (R() - .5) * sp * 1.6, Y = h - 20 - R() * (sp === 60 ? 60 : 200), a = R() * 6.28; c.save(); c.translate(X, Y); c.rotate(a); c.fillStyle = ["#5E6B42", "#7A8752", "#93A06A"][(R() * 3) | 0]; c.beginPath(); c.ellipse(14, 0, 17, 7, 0, 0, 6.28); c.fill(); c.restore(); }
    for (let i = 0; i < (sp === 60 ? 4 : 12); i++){ c.fillStyle = ["#F7E7DA", "#E9A27F", "#D8869A", "#FFFFFF"][i % 4]; c.beginPath(); c.arc(cx + (R() - .5) * sp * 1.4, h - 40 - R() * (sp === 60 ? 40 : 170), 9 + R() * 8, 0, 6.28); c.fill(); } }
  return F; }

function build(x){
  pts = Q.particles(700);
  E = Env3.make(x, { W: 1, H: .7, paper: "#C8825C", paperIn: "#F4E9DC", notch: .5,
    liner: F => Ink.pattern(F, "terrazzo", { bg: "#F1E4D2", cs: ["#C8825C", "#8E9A62", "#E9C9A9", "#8E4E2E"], fg: "#C99A5B", scale: 1.2 }),
    flapDeco: (F, cx, cy) => Ink.seal(F, cx, cy - 60, 92, { c1: "#A9B27C", c2: "#6F7F4C", c3: "#3F4A28", mono: x.C.mono, font: x.TH.script, seed: 7 }),
    pocketDeco: F => { F.x.fillStyle = "rgba(255,240,225,.75)"; Ink.text(F.x, x.TOLINE, F.w / 2, F.h * .8, `400 46px ${x.TH.serif}`); } });
  E.card.visible = false;
  const IN = inside(x), OUT = outside(x); card = Q.sheet({ w: CW, h: CH, front: IN.c, back: OUT.c, mask: Ink.masks(IN, OUT), nx: 18, ny: 40 }); card.fold = [0, 0, 0, -1]; card.beta = Math.PI; card.r = .002; card.gloss = .22;
  const A = archTex(x); arch = Q.sheet({ w: .58, h: .47, front: A.c, mask: Ink.masks(A, null), nx: 4, ny: 4 }); const B = bushTex(); bush = Q.sheet({ w: .86, h: .25, front: B.c, nx: 4, ny: 4 });
  const props = Env3.scatter([{ tex: Env3.leafTex("#A3AE7E", "#5E6B42"), n: 9, size: .15, ring: [.85, 1.45], curl: .2 }, { tex: Env3.petalTex("#F7E7DA", "#E9A27F"), n: 7, size: .07, ring: [.8, 1.4], curl: .3 }], 21, .72);
  cam0 = Env3.fit(1.25, EL, 32);
  S = { cam: { fov: 32, pos: cam0.pos.slice(), at: [0, 0, 0] }, light: { dir: [-.55, -1, -.25], col: [1.15, 1, .85], sky: [.55, .48, .42], gnd: [.32, .26, .22], size: 1.9 },
    sheets: [Env3.table(x, "wood", { c1: "#5A3A26", grain: "30,16,8", seed: 9, gloss: .2 }), ...props, ...E.sheets, card, arch, bush], pts, bg: [.2, .13, .09], foil: [1, .8, .5] };
  Env3.ambient(pts, 30, [2.4, .9, 2.4], [1, .85, .6], .012); return S;
}

function frame(T, g, k, dt){
  const t = Math.max(T, 0), idle = T < 0, bob = idle ? Math.sin(g * 1.1) * .01 : 0;
  if (pts.R() < dt * 5) Env3.ambient(pts, 1, [2.4, .9, 2.4], [1, .85, .6], .012);
  const back = io(seg(t, 2.2, 3.3)), G = M4.pose([0, .006 + bob, -back * .9], [0, idle ? Math.sin(g * .5) * 5 - 3 : -3 * (1 - back), 0]);
  E.set(G, seg(t, .3, 1.35)); E.fade(1 - seg(t, 2.6, 3.3));
  // ბარათი: კონვერტიდან ზემოთ → რკალით ცენტრში
  const out = io(seg(t, 1.35, 2.35)), arc = io(seg(t, 2.3, 3.35)), env = [0, .0095, -.3 - out * .74];
  const cardZ = mix(env[2] - back * .9 * (1 - arc), -.18, arc), cardY = mix(env[1], .0035, arc) + Math.sin(Math.PI * arc) * .28;
  const Gc = M4.pose([0, cardY + bob, cardZ], [0, idle ? Math.sin(g * .5) * 5 - 3 : -3 * (1 - arc), 0]); card.M = Gc;
  const op = seg(t, 3.4, 5.0), oe = io(op); card.beta = mix(Math.PI, 1.72, oe); card.r = .002 + .05 * Math.sin(Math.PI * op); card.flex = .015 * Math.sin(Math.PI * op);
  const la = 90 * io(seg(t, 3.6, 5.2)), lb = 90 * io(seg(t, 3.75, 5.35)), pose = (s, zb, a) => { s.M = M4.mul(Gc, M4.mul(M4.pose([0, .004, zb], [a, 0, 0]), M4.pose([0, 0, -s.h / 2]))); s.visible = a > .5; };
  pose(arch, .16, la); pose(bush, .36, lb);
  if (!idle && !fired.p && t > 5){ fired.p = 1; pts.burst([0, .3, -.1], 50, { speed: .4, w: .8, h: .3, g: .08, life: 2.4, s: .02, c: [1, .88, .62] }); }
  // კამერა: დაბლა ეშვება და სცენას შემოუვლის
  const c = S.cam, low = io(seg(t, 3.2, 5.6)), after = seg(t, 6, 7.4), yawC = mix(0, 14 * Math.sin(t * .35), low) + after * (k * 60 + Math.sin(g * .15) * 8);
  const el = mix(EL, 24, low) - after * k * 6, dist = cam0.d * mix(1, .7, low), at = [0, mix(0, .22, low), mix(0, -.12, low)];
  const ee = el * Math.PI / 180, yv = yawC * Math.PI / 180; c.at = at; c.pos = [at[0] + Math.sin(yv) * Math.cos(ee) * dist, at[1] + Math.sin(ee) * dist, at[2] + Math.cos(yv) * Math.cos(ee) * dist];
  S.light.center = [0, 0, mix(0, -.1, low)];
}
return { hint: "შეეხეთ კონვერტს", dur: 7.0, build, frame };
})();
