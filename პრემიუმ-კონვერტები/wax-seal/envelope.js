/* კონვერტი I · ცვილის ბეჭედი — სპილოსძვლისფერი კონვერტი ბორდოს ცვილის ბეჭდით, კაკლის მაგიდაზე ევკალიპტის ტოტებით.
   გახსნა: ბეჭედი შუაზე ტყდება (ცვილის ნამსხვრევები) → სამკუთხა სარქველი 3D-ში იხსნება და ოქროს დამასკის სარჩულს აჩენს →
   ბარათი კონვერტიდან ამოსრიალდება, ცენტრში მოდის და კამერისკენ მოფრინავს. */
window.ENVELOPE = (function(){
"use strict";
const { seg, mix, ease: E, f1 } = K;
const S = (w, h, body) => `<svg width="${f1(w)}" height="${f1(h)}" viewBox="0 0 ${f1(w)} ${f1(h)}">${body}</svg>`;
let P = {}, W, H, Hf, Rs, cx, cy, fired = {};

function build(env, x){
  W = x.W; H = x.H; Hf = H * .6; Rs = W * .1; cx = W / 2; cy = Hf - Rs * .3; fired = {};
  const R = K.rng(8), cr = []; for (let i = 0; i <= 8; i++) cr.push([cx - Rs * 1.25 + i * Rs * 2.5 / 8, cy + Rs * .04 + (i % 2 ? -1 : 1) * Rs * (.05 + R() * .08)]);
  const pts = a => a.map(p => "L" + p.map(f1).join(",")).join(""), crack = "M" + cr.map(p => p.map(f1).join(",")).join("L"), rev = cr.slice().reverse();
  const clip = s => `M${f1(cx - Rs * 2)},${f1(cy + s * Rs * 2)}L${f1(cx + Rs * 2)},${f1(cy + s * Rs * 2)}L${f1(cx + Rs * 2)},${f1(cr[8][1])}${pts(rev)}L${f1(cx - Rs * 2)},${f1(cr[0][1])}Z`;
  const txt = (fill, d) => `<text x="${f1(cx + d)}" y="${f1(cy + Rs * .22 + d)}" text-anchor="middle" font-family="${x.TH.script}" font-size="${f1(Rs * .66)}" fill="${fill}">${x.esc(x.C.mono)}</text>`;
  K.defs(`${K.pat("w1p", K.paper("#EEE3CF", { grain: 8, mottle: .05, fiber: 60, seed: 4 }))}${K.liner("w1l", "damask", { bg: "#571120", fg: "#D7B46A", scale: .75 })}
    ${K.rg("w1wax", .5, .5, .56, .36, .3, [[0, "#DA5A6A"], [.38, "#A8293B"], [.74, "#741426"], [1, "#41060F"]])}${K.lg("w1in", 0, 0, 1, 1, [[0, "#590C18"], [.55, "#8C1D2D"], [1, "#B43C4C"]])}
    ${K.lg("w1fl", 0, 0, 0, 1, [[0, "#fff", .16], [.7, "#fff", 0], [1, "#000", .06]])}${K.lg("w1l1", 0, 0, 1, 0, [[0, "#fff", .12], [1, "#fff", .02]])}${K.lg("w1r1", 0, 0, 1, 0, [[0, "#000", .02], [1, "#000", .11]])}
    ${K.lg("w1b1", 0, 0, 0, 1, [[0, "#fff", .07], [1, "#000", .13]])}${K.lg("w1fs", 0, 0, 0, 1, [[0, "#000", .6], [.55, "#000", .14], [1, "#000", 0]])}${K.lg("w1inS", 0, 0, 0, 1, [[0, "#000", .45], [.22, "#000", .06], [.8, "#000", .12], [1, "#000", .45]])}
    <clipPath id="w1ct"><path d="${clip(-1)}"/></clipPath><clipPath id="w1cb"><path d="${clip(1)}"/></clipPath>
    <g id="w1seal"><path d="${K.blob(cx, cy, Rs, 3, .075)}" fill="url(#w1wax)"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(Rs * .7)}" fill="url(#w1in)"/>
      <circle cx="${f1(cx + .8)}" cy="${f1(cy + .8)}" r="${f1(Rs * .7)}" fill="none" stroke="rgba(255,175,175,.45)" stroke-width="1.1"/><circle cx="${f1(cx - .6)}" cy="${f1(cy - .6)}" r="${f1(Rs * .7)}" fill="none" stroke="rgba(40,0,6,.55)"/>
      <g transform="translate(-.6,-.6)">${K.wreath(cx, cy + Rs * .03, Rs * .58, "rgba(40,0,6,.5)", 8, .6)}</g><g transform="translate(.5,.5)">${K.wreath(cx, cy + Rs * .03, Rs * .58, "rgba(255,165,170,.32)", 8, .6)}</g>
      ${txt("rgba(40,0,6,.6)", -.8)}${txt("rgba(255,175,180,.5)", .8)}${txt("#8E1F30", 0)}
      <ellipse cx="${f1(cx - Rs * .38)}" cy="${f1(cy - Rs * .52)}" rx="${f1(Rs * .34)}" ry="${f1(Rs * .12)}" fill="#fff" opacity=".3" filter="url(#kb3)" transform="rotate(-32 ${f1(cx - Rs * .38)} ${f1(cy - Rs * .52)})"/></g>`, "env");
  const L = `M0,0L${f1(W * .47)},${f1(H * .5)}Q${f1(W * .5)},${f1(H * .53)} ${f1(W * .47)},${f1(H * .56)}L0,${H}Z`, Rr = `M${W},0L${f1(W * .53)},${f1(H * .5)}Q${f1(W * .5)},${f1(H * .53)} ${f1(W * .53)},${f1(H * .56)}L${W},${H}Z`;
  const Bo = `M0,${H}L${f1(W * .43)},${f1(H * .47)}Q${f1(W * .5)},${f1(H * .39)} ${f1(W * .57)},${f1(H * .47)}L${W},${H}`, Bt = Bo + "Z";
  const F = `M0,0L${W},0L${f1(W * .5 + 16)},${f1(Hf - 10)}Q${f1(W * .5)},${f1(Hf + 3)} ${f1(W * .5 - 16)},${f1(Hf - 10)}Z`;
  const Fb = `M0,${f1(Hf)}L${W},${f1(Hf)}L${f1(W * .5 + 16)},10Q${f1(W * .5)},-3 ${f1(W * .5 - 16)},10Z`, FbL = `M${f1(W * .05)},${f1(Hf)}L${f1(W * .95)},${f1(Hf)}L${f1(W * .5 + 9)},${f1(Hf * .14)}Q${f1(W * .5)},${f1(Hf * .08)} ${f1(W * .5 - 9)},${f1(Hf * .14)}Z`;
  const sh = (d, dy, o = .28) => `<path d="${d}" fill="#000" opacity="${o}" filter="url(#kb3)" transform="translate(0,${dy})"/>`;
  env.innerHTML = `<div class="pt w-in">${S(W, H, `<rect width="${W}" height="${H}" fill="url(#w1p)"/><rect x="${f1(W * .045)}" width="${f1(W * .91)}" height="${f1(H * .8)}" fill="url(#w1l)"/><rect width="${W}" height="${H}" fill="url(#w1inS)"/>`)}</div>
  <div class="pt w-card" style="width:${f1(W * .9)}px;height:${f1(H * .86)}px;left:${f1(W * .05)}px;top:${f1(H * .07)}px">${x.cardFace()}</div>
  <div class="pt w-pk">${S(W, H, `${sh(L, 3)}${sh(Rr, 3)}<path d="${L}" fill="url(#w1p)"/><path d="${L}" fill="url(#w1l1)"/><path d="${Rr}" fill="url(#w1p)"/><path d="${Rr}" fill="url(#w1r1)"/>
    ${sh(Bt, -2, .3)}<path d="${Bt}" fill="url(#w1p)"/><path d="${Bt}" fill="url(#w1b1)"/><path d="${Bo}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".8"/>
    <path class="fsh" d="${F}" fill="#000" opacity=".32" filter="url(#kb3)" transform="translate(0,3)"/><rect class="fcs" width="${W}" height="${f1(H * .75)}" fill="url(#w1fs)" opacity="0"/>`)}</div>
  <div class="pt w-fl" style="width:${W}px;height:${f1(Hf)}px;transform-origin:50% 0">
    <div class="face ff" style="width:${W}px;height:${f1(Hf)}px">${S(W, Hf, `<path d="${F}" fill="url(#w1p)"/><path d="${F}" fill="url(#w1fl)"/><path d="M0,.6H${W}" stroke="rgba(255,255,255,.45)"/><path class="fsd" d="${F}" fill="#000" opacity="0"/><use href="#w1seal" class="sT" clip-path="url(#w1ct)" filter="url(#ksh)"/>`)}</div>
    <div class="face fb" style="width:${W}px;height:${f1(Hf)}px;transform:rotateX(180deg)">${S(W, Hf, `<path d="${Fb}" fill="url(#w1p)"/><path d="${FbL}" fill="url(#w1l)"/><path d="${FbL}" fill="none" stroke="rgba(215,180,106,.55)" stroke-width=".8"/><path class="fbd" d="${Fb}" fill="#000" opacity=".5"/>`)}</div></div>
  <div class="pt w-sb">${S(W, H, `<use href="#w1seal" class="sB" clip-path="url(#w1cb)" filter="url(#ksh)"/><path class="crk" d="${crack}" fill="none" stroke="#2A0408" stroke-width="1.3" stroke-linejoin="round" opacity="0"/>`)}</div>`;
  const q = s => env.querySelector(s);
  P = { env, inn: q(".w-in"), card: q(".w-card"), pk: q(".w-pk"), fl: q(".w-fl"), ff: q(".ff"), fb: q(".fb"), sb: q(".w-sb"), sT: q(".sT"), sB: q(".sB"), crk: q(".crk"), fsd: q(".fsd"), fbd: q(".fbd"), fsh: q(".fsh"), fcs: q(".fcs") };
  P.inn.style.transform = "translateZ(0px)"; P.pk.style.transform = "translateZ(4px)"; P.sb.style.transform = "translateZ(7px)";
  frame(-1, 0, x);
}

function frame(T, g, x){
  const t = Math.max(T, 0), idle = T < 0, settle = idle ? 0 : E.io(seg(t, 0, 1.5)), bob = Math.sin(g * 1.2);
  const rx = mix(16, 5, settle), rz = mix(-3.5 + bob * .5, 0, settle), press = idle ? 0 : Math.sin(Math.PI * seg(t, 0, .32));
  const down = E.io(seg(t, .9, 2.1)) * H * .32, fall = E.in(seg(t, 3.6, 4.8)) * H * 2.4, ty = bob * 4 * (1 - settle) + down + fall;
  P.env.style.transform = `translate3d(0,${f1(ty)}px,${f1(-press * 14)}px) rotateX(${f1(rx)}deg) rotateZ(${f1(rz)}deg)`;
  const sep = E.out(seg(t, .24, .7)), rot = (a, dy) => `rotate(${f1(a * sep)} ${f1(cx)} ${f1(cy)}) translate(0 ${f1(dy * sep)})`;
  P.crk.setAttribute("opacity", seg(t, .2, .3)); P.sT.setAttribute("transform", rot(-5, -2)); P.sB.setAttribute("transform", rot(3.5, 1.5)); P.crk.setAttribute("transform", rot(3.5, 1.5));
  if (!idle && !fired.c && t > .24){ fired.c = 1; const r = P.crk.getBoundingClientRect(), X = r.left + r.width / 2, Y = r.top + r.height / 2;
    x.fx.burst(X, Y, 18, { t: "shard", cols: ["#7A1424", "#A42739", "#5C0D18", "#C2414F"], speed: 190, grav: 520, life: 1.2, s: 3.2 }); x.fx.burst(X, Y, 22, { t: "spark", col: "#FFE3A6", speed: 230, grav: 160, life: .8, s: 2.6 }); x.fx.burst(X, Y, 3, { t: "glint", speed: 30, grav: 0, life: .7, s: 4 }); }
  const fa = E.io(seg(t, .45, 1.95)), ang = 180 * fa;
  P.fl.style.transform = `translateZ(${f1(mix(6, .6, fa))}px) rotateX(${f1(ang)}deg)`;
  P.fsd.setAttribute("opacity", f1(.42 * Math.min(1, ang / 90))); P.fbd.setAttribute("opacity", f1(.55 * (1 - seg(ang, 95, 180)) + .04));
  P.fsh.setAttribute("opacity", f1(.32 * (1 - seg(ang, 0, 40)))); P.fcs.setAttribute("opacity", f1(Math.sin(fa * Math.PI) * .75 * (1 - seg(ang, 130, 180))));
  if (!idle && !fired.f && t > 1.9){ fired.f = 1; const r = P.inn.getBoundingClientRect(); x.fx.burst(r.left + r.width / 2, r.top + r.height * .1, 26, { t: "mote", col: "rgba(255,224,160,1)", speed: 60, grav: -20, life: 2.2, s: 3, w: r.width * .8 }); }
  const up = E.io(seg(t, 1.85, 3.25)), fw = E.io(seg(t, 3.15, 4.4)), fly = E.in(seg(t, 4.4, 5.65));
  const cTy = mix(-up * H * .96, -(down + fall), fw), cz = 2 + fw * 130 + fly * 620, sc = 1 + fw * .22 + fly * .2;
  P.card.style.transform = `translate3d(0,${f1(cTy)}px,${f1(cz)}px) rotateX(${f1(-rx * fw)}deg) scale(${sc.toFixed(3)})`;
  P.card.style.setProperty("--shx", f1(mix(-150, 260, seg(t, 2.4, 4.2))) + "%");
  if (!idle && !fired.g && t > 2.9){ fired.g = 1; const r = P.card.getBoundingClientRect(); x.fx.burst(r.left + r.width * .5, r.top + 6, 4, { t: "glint", speed: 40, grav: 0, life: .9, s: 4.5, w: r.width * .8 }); }
  const fade = String(1 - seg(t, 3.75, 4.55)); [P.inn, P.pk, P.ff, P.fb, P.sb].forEach(e => e.style.opacity = fade);
}

function props(x){
  const { vw, vh } = x, L = Math.min(vh * .3, vw * .66), R = K.rng(5);
  const sp = (X, Y, rot, len, seed, bend) => `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px" width="1" height="1"><g transform="rotate(${rot})">${K.sprig(len, { seed, bend, n: 12 })}</g></svg>`;
  let s = sp(vw * 1.02, vh * .17, -140, L, 3, 1) + sp(vw * .93, vh * .1, -118, L * .78, 5, -1) + sp(vw * -.03, vh * .93, 44, L * .95, 7, 1) + sp(vw * .1, vh * 1.01, 18, L * .7, 9, -1);
  for (let i = 0; i < 9; i++){ const a = R() * 6.28, rr = .42 + R() * .12, X = vw / 2 + Math.cos(a) * vw * rr * 1.05, Y = vh * .54 + Math.sin(a) * vh * rr * .62, r = 2 + R() * 3;
    s += `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px;filter:drop-shadow(1px 2px 1.5px rgba(0,0,0,.5))" width="1" height="1"><circle r="${f1(r)}" fill="url(#kgold)"/><circle cx="${f1(-r * .3)}" cy="${f1(-r * .3)}" r="${f1(r * .35)}" fill="#fff" opacity=".6"/></svg>`; }
  return s;
}
return { hint: "შეეხეთ ბეჭედს", aspect: .7, maxW: .88, maxH: .4, sy: "53%", dur: 5.65, build, frame, props };
})();
