/* 3D კონვერტი V · ბარათების მარაო — ატმისფერი კონვერტი შამპანურისფერი ბეჭდით, სელის სუფრაზე.
   გახსნა: სარქველი იხსნება → სამი ბარათი ერთად ამოსრიალდება → ჰაერში აიწევენ და მარაოსავით გაიშლებიან
   (მოსაწვევი, პროგრამა, ადგილი) → გვერდითები დაიკეცება და მთავარი ბარათი კამერისკენ მოფრინავს. */
window.OPENING = (function(){
"use strict";
let S, E, cards = [], cam0, pts, fired = {};
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, mix = (a, b, k) => a + (b - a) * k;
const back = t => { const c = 1.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const { M4 } = Q, EL = 56, CW = .86, CHh = .58;

function infoCard(x, title, rows){ const { TH } = x, w = 1000, h = 674, F = Ink.face(w, h), tone = TH.foilTone, cx = w / 2;
  Ink.paper(F, TH.card, { seed: 33, grain: 8 }); Ink.frame(F, 30, 4, tone); Ink.frame(F, 44, 1.5, tone);
  Ink.foil(F, c => Ink.text(c, title, cx, 108, `500 30px ${TH.sans}`, { ls: 10 }), tone); Ink.divider(F, cx, 140, 240, tone);
  rows.forEach((r, i) => { const y = 220 + i * (rows.length > 3 ? 104 : 132); if (r.time) Ink.foil(F, c => Ink.text(c, r.time, 250, y, `400 44px ${TH.num}`, { align: "right" }), tone);
    F.x.fillStyle = TH.cardInk; Ink.text(F.x, r.title, r.time ? 290 : cx, y - (r.sub ? 8 : 0), `500 ${r.big ? 54 : 36}px ${TH.serif}`, { align: r.time ? "left" : "center" });
    if (r.sub){ F.x.fillStyle = TH.cardSoft; Ink.text(F.x, r.sub, r.time ? 290 : cx, y + 34, `400 24px ${TH.serif}`, { align: r.time ? "left" : "center" }); } });
  return F; }

function build(x){
  const { C, TH } = x; pts = Q.particles(700);
  E = Env3.make(x, { W: 1, H: .7, paper: "#EBC3AA", paperIn: "#FFF6EE", notch: .5,
    liner: F => Ink.pattern(F, "dots", { bg: "#F3D6C6", fg: "#D6AE7E", scale: 1.3 }),
    flapDeco: (F, cx, cy) => Ink.seal(F, cx, cy - 60, 92, { c1: "#F3E3C4", c2: "#D6B47E", c3: "#9C7A44", mono: C.mono, font: TH.script, seed: 9 }),
    pocketDeco: F => { F.x.fillStyle = "rgba(78,58,51,.6)"; Ink.text(F.x, x.TOLINE, F.w / 2, F.h * .8, `400 46px ${TH.serif}`); } });
  E.card.visible = false;
  const faces = [Env3.card(x, 1000, 674), infoCard(x, "დღის პროგრამა", C.program.slice(0, 4).map(p => ({ time: p.time, title: p.title, sub: p.place }))),
    infoCard(x, "ადგილი", [{ title: C.venue.name, sub: C.venue.addr, big: 1 }, { title: `${C.time} · ${x.DOTS}`, sub: `გთხოვთ, გვაცნობოთ ${C.rsvpBy}` }])];
  const backF = Env3.plain(TH.card, 512, 346, 51, F => { Ink.foil(F, c => Ink.text(c, C.mono, 256, 200, `120px ${TH.script}`), TH.foilTone); });
  cards = faces.map(f => { const s = Q.sheet({ w: CW, h: CHh, front: f.c, back: backF.c, mask: Ink.masks(f, backF), nx: 12, ny: 12 }); s.gloss = .3; return s; });
  const props = Env3.scatter([{ tex: Env3.petalTex("#FFFFFF", "#F6D8C8"), n: 10, size: .09, ring: [.8, 1.4], curl: .3 }, { tex: Env3.leafTex("#CBD3B8", "#8E9C7A"), n: 5, size: .14, ring: [.85, 1.3], curl: .2 }], 17, .7);
  cam0 = Env3.fit(1.25, EL, 32);
  S = { cam: { fov: 32, pos: cam0.pos.slice(), at: [0, 0, 0] }, light: { dir: [-.45, -1, -.45], col: [1.1, 1, .92], sky: [.66, .6, .56], gnd: [.46, .4, .36], size: 1.8 },
    sheets: [Env3.table(x, "linen", { c1: "#E8D3C4", seed: 5 }), ...props, ...E.sheets, ...cards.slice().reverse()], pts, bg: [.92, .85, .8], foil: [1, .86, .6] };
  Env3.ambient(pts, 30, [2.4, .9, 2.4], [1, .9, .75], .011); return S;
}

function frame(T, g, k, dt){
  const t = Math.max(T, 0), idle = T < 0, bob = idle ? Math.sin(g * 1.1) * .01 : 0;
  if (pts.R() < dt * 5) Env3.ambient(pts, 1, [2.4, .9, 2.4], [1, .9, .75], .011);
  const G = M4.pose([0, .006 + bob, 0], [0, idle ? Math.sin(g * .5) * 5 - 4 : mix(Math.sin(g * .5) * 5 - 4, 0, seg(t, 0, 1.4)), 0]);
  E.set(G, seg(t, .3, 1.4));
  const out = io(seg(t, 1.4, 2.5)), rise = io(seg(t, 2.4, 3.6)), fan = back(seg(t, 2.9, 3.9)), fold = io(seg(t, 4.5, 5.2)), fly = Math.pow(seg(t, 4.8, 5.8), 2.2), e = EL * Math.PI / 180;
  cards.forEach((s, i) => { const side = [0, 1, -1][i], ang = side * 24 * fan * (1 - fold), dz = .2;
    const px = side * .03 * fan * (1 - fold), py = .0045 + i * .0012 + rise * (.48 - i * .012) + (i ? 0 : Math.sin(e) * fly * cam0.d * .78), pz = mix(.214, -.46, out) * (1 - rise) + rise * (.12 + dz) + (i ? 0 : Math.cos(e) * fly * cam0.d * .78);
    s.M = M4.mul(G, M4.mul(M4.pose([px, py, pz], [rise * (90 - EL) - i * .4 * rise, 0, 0]), M4.mul(M4.pose([0, 0, 0], [0, ang, 0]), M4.pose([0, -i * .004 * rise, -dz]))));
    s.op = i ? 1 - seg(t, 5, 5.5) : 1; s.visible = t < 6 && s.op > 0; });
  if (!idle && !fired.f && t > 3.5){ fired.f = 1; pts.burst([0, .5, .2], 60, { speed: .45, w: .9, h: .3, g: .06, life: 2.2, s: .018, c: [1, .9, .7] }); }
  const c = S.cam, lift = io(seg(t, 2.4, 3.8)), after = seg(t, 5.5, 7), yawC = after * (Math.sin(g * .12) * 10 + k * 70), elC = mix(EL, 40, after * k), dist = cam0.d * mix(1, .88, after * k);
  const ee = elC * Math.PI / 180, yv = yawC * Math.PI / 180, at = [0, lift * .32 * (1 - after), lift * .1 * (1 - after)]; c.at = at;
  c.pos = [at[0] + Math.sin(yv) * Math.cos(ee) * dist, at[1] + Math.sin(ee) * dist, at[2] + Math.cos(yv) * Math.cos(ee) * dist];
}
return { hint: "შეეხეთ ბეჭედს", dur: 5.8, build, frame };
})();
