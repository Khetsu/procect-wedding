/* 3D კონვერტი IV · მფრინავი შუქი — იისფერი კონვერტი ჰაერშია გამოკიდებული ნეონის რგოლების თავზე, ღამის სცენაზე.
   გახსნა: კონვერტი სტუმრის სახელიანი მხრიდან ტრიალებს ბეჭდიან მხარეზე → სარქველი ჰაერში იხსნება →
   ბარათი ზემოთ ამოდის, ვერცხლის ნაპერწკლებში 360°-ით ბრუნავს და კამერისკენ მოფრინავს. */
window.OPENING = (function(){
"use strict";
let S, E, rings = [], cam0, pts, fired = {};
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, mix = (a, b, k) => a + (b - a) * k;
const back = t => { const c = 1.3; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const { M4 } = Q, EL = 9, HY = .52;

function address(x){ return F => { const t = Ink.face(F.w, F.h); Ink.paper(t, "#6A4FB3", { seed: 9 }); Ink.frame(t, 30, 3, "#D9D2EC"); Ink.frame(t, 42, 1.2, "#D9D2EC");
  t.x.fillStyle = "#F1ECFF"; Ink.text(t.x, x.TOLINE, t.w / 2, t.h * .55, `400 58px ${x.TH.serif}`); Ink.foil(t, k => Ink.text(k, x.C.big || "", t.w - 130, 150, `400 90px ${x.TH.num}`), "#D9D2EC");
  Ink.foil(t, k => { k.lineWidth = 3; k.strokeRect(t.w - 200, 60, 140, 120); }, "#D9D2EC"); t.x.fillStyle = "rgba(241,236,255,.7)"; Ink.text(t.x, x.C.latin, t.w / 2, t.h * .55 + 80, `48px ${x.TH.script}`);
  [[F.x, t.c], [F.mx, t.m]].forEach(([d, s]) => { d.save(); d.translate(F.w, 0); d.scale(-1, 1); d.drawImage(s, 0, 0); d.restore(); }); }; }
function ringTex(){ const F = Ink.face(512, 512), c = F.x; [[240, 10, "#C9B6FF"], [200, 4, "#8F74FF"], [252, 2, "#F1ECFF"]].forEach(([r, w, col]) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(256, 256, r, 0, 6.28); c.stroke(); }); return F.c; }

function build(x){
  pts = Q.particles(900);
  E = Env3.make(x, { W: 1, H: .7, paper: "#6A4FB3", paperIn: "#2A1F4A", notch: .5, front: address(x),
    liner: F => Ink.pattern(F, "rays", { bg: "#2A1F4A", fg: "#D9D2EC", scale: 1.4 }),
    flapDeco: (F, cx, cy) => Ink.seal(F, cx, cy - 60, 92, { c1: "#E4DCF5", c2: "#A99BCB", c3: "#5E5285", mono: x.C.mono, font: x.TH.script, seed: 3 }) });
  E.sheets.forEach(s => s.gloss = .35);
  const rt = Q.texFrom(ringTex()); rings = [1.25, .8].map((sz, i) => { const s = Q.sheet({ w: sz, h: sz, nx: 2, ny: 2 }); s.tf = rt; s.tb = rt; s.emis = 2.2; s.shade = false; s.cast = false; s.tint = [1, 1, 1]; s.order = -.5; s.M = M4.pose([0, .003 + i * .001, 0]); return s; });
  cam0 = Env3.fit(1.3, EL, 34, [0, HY, 0]);
  S = { cam: { fov: 34, pos: cam0.pos.slice(), at: [0, HY, 0] }, light: { dir: [-.35, -1, -.55], col: [1.05, 1, 1.2], sky: [.32, .26, .5], gnd: [.12, .08, .2], center: [0, .3, 0], size: 1.6 },
    sheets: [Env3.table(x, "velvet", { c1: "#120E26", seed: 4, gloss: .4 }), ...rings, ...E.sheets], pts, bg: [.04, .03, .09], foil: [.9, .88, 1] };
  Env3.ambient(pts, 60, [2.6, 1.4, 1.6], [.8, .7, 1], .014); return S;
}

function frame(T, g, k, dt){
  const t = Math.max(T, 0), idle = T < 0;
  if (pts.R() < dt * 14) pts.add({ p: [(pts.R() - .5) * 1.2, .02, (pts.R() - .5) * 1.2], v: [0, .12 + pts.R() * .12, 0], life: 3 + pts.R() * 2, g: 0, s: .012 + pts.R() * .012, c: [.8, .7, 1], drag: 0 });
  rings.forEach((r, i) => { r.tint = [1, 1, 1].map(() => .75 + .25 * Math.sin(g * 2 + i * 1.7)); r.M = M4.pose([0, .003 + i * .001, 0], [0, g * (i ? -12 : 8), 0]); });
  const spin = idle ? 0 : back(seg(t, 0, 1.4)), yaw = (idle ? 180 + Math.sin(g * .7) * 16 : mix(180 + Math.sin(g * .7) * 16, 0, spin)), sway = Math.sin(g * 1.3) * .035;
  const sink = io(seg(t, 3.7, 4.9)), rest = seg(t, 5.6, 6.6), y = HY + sway - sink * .5 * (1 - rest);
  const G = M4.mul(M4.pose([0, y, 0], [0, yaw + (rest > 0 ? Math.sin(g * .4) * 20 : 0), Math.sin(g * .9) * 3]), M4.pose([0, 0, 0], [90, 0, 0]));
  if (!idle && !fired.s && t > .35){ fired.s = 1; pts.burst([0, HY, 0], 60, { speed: .55, w: 1, h: .6, g: -.02, life: 1.8, s: .016, c: [.85, .8, 1] }); }
  const up = io(seg(t, 2.5, 3.6)), out = io(seg(t, 3.6, 4.8)), fly = Math.pow(seg(t, 4.8, 5.8), 2.2), turn = io(seg(t, 3.7, 4.9)) * 360;
  // ბარათის პოზა კონვერტის ლოკალურ სივრცეში (ლოკალური -z = ზემოთ, +y = კამერისკენ)
  const lz = mix(.014, -.66, up) - out * .25, ly = .0045 + out * .4 + fly * (cam0.d - .3);
  E.set(G, seg(t, 1.3, 2.5), { p: [0, ly, lz], r: [0, 0, turn] });
  if (!idle && !fired.c && t > 3.9){ fired.c = 1; pts.burst([0, HY + .45, .3], 80, { speed: .6, w: .6, h: .4, g: .1, life: 2.2, s: .018, c: [.95, .92, 1] }); }
  E.fade(1 - seg(t, 4.1, 4.9) * (1 - rest)); E.card.visible = t < 5.9;
  const c = S.cam, after = seg(t, 5.6, 7), yawC = after * (Math.sin(g * .15) * 12 + k * 80), elC = EL + after * k * 18, dist = cam0.d * mix(1, .92, after);
  const ee = elC * Math.PI / 180, yv = yawC * Math.PI / 180, at = [0, HY, 0]; c.at = at; c.pos = [Math.sin(yv) * Math.cos(ee) * dist, at[1] + Math.sin(ee) * dist, Math.cos(yv) * Math.cos(ee) * dist];
}
return { hint: "შეეხეთ ეკრანს", dur: 5.8, build, frame };
})();
