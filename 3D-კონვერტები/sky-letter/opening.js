/* 3D კონვერტი I · ცის წერილი — ცისფერი კონვერტი ჰაერში ფარფატებს თეთრი მარმარილოს მაგიდის თავზე.
   გახსნა: შეხებისას ფოთოლივით, რხევით ეშვება და მაგიდაზე რბილად დაჯდება (მტვრის ბრწყინვა) → სარქველი ნაკეცზე მოღუნვით იხსნება →
   ბარათი ამოსრიალდება, ჰაერში აიწევს, კამერისკენ შემობრუნდება და მოფრინავს. */
window.OPENING = (function(){
"use strict";
let S, E, cam0, pts, props = [], fired = {};
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out = t => 1 - Math.pow(1 - t, 3), mix = (a, b, k) => a + (b - a) * k;
const { M4 } = Q, EL = 58;

function build(x){
  const { TH } = x;
  E = Env3.make(x, { W: 1, H: .7, paper: "#C4D6E8", paperIn: "#F3F6F9", notch: .5,
    liner: F => Ink.pattern(F, "waves", { bg: "#3C5F88", fg: "#D7DDE6", scale: 1.3 }),
    flapDeco: (F, cx, cy) => Ink.seal(F, cx, cy - 60, 92, { c1: "#9DB4D2", c2: "#5D7DA6", c3: "#2E4A70", mono: x.C.mono, font: TH.script, seed: 4 }),
    pocketDeco: F => { F.x.fillStyle = "rgba(47,62,87,.55)"; Ink.text(F.x, x.TOLINE, F.w / 2, F.h * .8, `400 46px ${TH.serif}`); } });
  pts = Q.particles(700);
  props = Env3.scatter([{ tex: Env3.petalTex("#FFFFFF", "#E9EEF4"), n: 9, size: .1, ring: [.75, 1.3], curl: .25 }, { tex: Env3.leafTex("#C3D1C8", "#7E978A"), n: 5, size: .16, ring: [.8, 1.25], curl: .15 }], 7);
  const tbl = Env3.table(x, "marble", { c1: "#F1F1EE", c3: "#AFBAC6", seed: 3, gloss: .25 });
  cam0 = Env3.fit(1.2, EL, 32);
  S = { cam: { fov: cam0.fov, pos: cam0.pos.slice(), at: [0, 0, 0] }, light: { dir: [-.45, -1, -.5], col: [1.05, 1, .95], sky: [.62, .66, .74], gnd: [.42, .42, .44], center: [0, 0, 0], size: 1.6 },
    sheets: [tbl, ...props, ...E.sheets], pts, bg: [.85, .87, .9], foil: [.82, .86, .93] };
  Env3.ambient(pts, 40, [2.4, 1, 2.4], [.9, .95, 1], .01);
  return S;
}

function frame(T, g, k, dt){
  const t = Math.max(T, 0), idle = T < 0;
  if (!idle && pts.R() < dt * 6) Env3.ambient(pts, 1, [2.4, .8, 2.4], [.9, .95, 1], .01);
  // ჰაერში ფარფატი → ფოთოლივით დაშვება
  const f = idle ? 0 : seg(t, 0, 2.2), land = out(f), sw = (1 - f) * (1 - f);
  const y = mix(.42 + Math.sin(g * 1.3) * .03, .012, io(f)), xo = Math.sin(t * 2.9 + .5) * .38 * sw * (idle ? 0 : 1) + (idle ? Math.sin(g * .7) * .05 : 0);
  const roll = idle ? Math.sin(g * 1.1) * 9 : Math.sin(t * 2.9) * 24 * sw, pitch = idle ? 8 + Math.sin(g * .9) * 5 : mix(10, 0, land), yaw = idle ? Math.sin(g * .5) * 12 : mix(Math.sin(g * .5) * 12, -4, land);
  const bounce = !idle && t > 2.2 ? Math.sin(Math.min(1, (t - 2.2) / .35) * Math.PI) * .018 : 0, z = mix(-.05, 0, land);
  const G = M4.pose([xo, y + bounce, z], [pitch, yaw, roll]);
  if (!idle && !fired.l && t > 2.15){ fired.l = 1; pts.burst([0, .02, 0], 70, { speed: .5, w: 1, d: .7, g: .2, life: 1.8, s: .018, c: [1, 1, 1], flat: 1 }); }
  const op = seg(t, 2.35, 3.6), up = io(seg(t, 3.6, 4.7)), rise = io(seg(t, 4.6, 5.9)), fly = Math.pow(seg(t, 5.9, 6.9), 2.2);
  // ბარათი (კონვერტის ლოკალურ სივრცეში)
  const cp = [0, mix(.0045, .03, up) + rise * .55, mix(.014, -.62, up) + rise * .5], cr = [rise * (90 - EL) + fly * 6, 0, 0];
  const camDir = [0, Math.sin(EL * Math.PI / 180), Math.cos(EL * Math.PI / 180)];
  cp[1] += camDir[1] * fly * cam0.d * .78; cp[2] += camDir[2] * fly * cam0.d * .78;
  E.set(G, op, { p: cp, r: cr, s: 1 + rise * .08 });
  if (!idle && !fired.c && t > 4.7){ fired.c = 1; pts.burst([0, .2, -.2], 40, { speed: .35, w: .8, h: .1, g: -.05, life: 2.2, s: .02, c: [1, .95, .85] }); }
  E.card.visible = T < 7.2;
  // კამერა: გახსნისას ოდნავ ახლოს; შემდეგ — ნელი ბრუნვა და გადახვევით მოძრაობა
  const c = S.cam, near = io(seg(t, 2, 4.4)), after = seg(t, 6.6, 8.2);
  const yawC = after * (Math.sin(g * .12) * 10 + k * 70), elC = mix(EL, 40, after * k) - near * 4, dist = cam0.d * mix(1, .9, near) * mix(1, .85, after * k);
  const e = elC * Math.PI / 180, yv = yawC * Math.PI / 180; c.at = [0, mix(.3, 0, io(f)) + mix(0, .02, near), mix(0, -.05, near)];
  c.pos = [Math.sin(yv) * Math.cos(e) * dist, Math.sin(e) * dist, Math.cos(yv) * Math.cos(e) * dist];
}
return { hint: "შეეხეთ ეკრანს", dur: 6.9, build, frame };
})();
