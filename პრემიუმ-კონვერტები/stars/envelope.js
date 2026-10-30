/* კონვერტი IV · ვარსკვლავების წერილი — მუქი ლურჯი კონვერტი ოქროს ვარსკვლავებითა და მთვარით, ოქროს ძაფი ორ ღილზეა დახვეული, ხავერდის მაგიდაზე.
   გახსნა: ძაფი ღილებიდან იხსნება (ზედა ღილი ტრიალებს, ძაფი ჩამოეკიდება და ირხევა) → მომრგვალებული სარქველი იხსნება და თანავარსკვლავედების სარჩულს აჩენს →
   ბარათი ამოდის, ცენტრში მოდის და კამერისკენ მოფრინავს. */
window.ENVELOPE = (function(){
"use strict";
const { seg, mix, ease: E, f1 } = K;
const S = (w, h, body) => `<svg width="${f1(w)}" height="${f1(h)}" viewBox="0 0 ${f1(w)} ${f1(h)}">${body}</svg>`;
let P = {}, W, H, Hf, B1, B2, Lw = 1, fired = {};

function build(env, x){
  W = x.W; H = x.H; Hf = H * .4; fired = {};
  const y0 = H * .06, tr = W * .09, rr = W * .14, rb = W * .062, q = rb * 1.12, q2 = rb * 1.32; B1 = [W / 2, Hf - W * .12]; B2 = [W / 2, Hf + (H - Hf) * .3];
  const R = K.rng(17), star5 = (cx, cy, r, f) => { let d = ""; for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .45 : r; d += (i ? "L" : "M") + f1(cx + Math.cos(a) * rr2) + "," + f1(cy + Math.sin(a) * rr2); } return `<path d="${d}Z" fill="${f}"/>`; };
  const scatter = (y1, y2, n, avoid) => { let s = ""; for (let i = 0; i < n; i++){ const X = 12 + R() * (W - 24), Y = y1 + 10 + R() * (y2 - y1 - 20); if (avoid && Math.hypot(X - avoid[0], Y - avoid[1]) < rb * 2.4) continue; s += R() < .55 ? K.star4(X, Y, .8 + R() * 1.4, "url(#kgold)", .9) : `<circle cx="${f1(X)}" cy="${f1(Y)}" r="${f1(.5 + R() * .9)}" fill="url(#kgold)" opacity=".8"/>`; } return s; };
  K.defs(`${K.pat("s4p", K.paper("#16234D", { grain: 9, mottle: .07, fiber: 40, fleck: 22, fleckCol: "rgba(255,225,160,.4)", seed: 19 }))}${K.liner("s4l", "stars", { bg: "#0C1636", fg: "#D9B96E", scale: .8 })}
    ${K.lg("s4sh", 0, 0, 0, 1, [[0, "#fff", .1], [.6, "#fff", 0], [1, "#000", .18]])}${K.lg("s4fs", 0, 0, 0, 1, [[0, "#000", .6], [.55, "#000", .14], [1, "#000", 0]])}${K.lg("s4in", 0, 0, 0, 1, [[0, "#000", .5], [.2, "#000", .05], [1, "#000", .4]])}
    ${K.rg("s4btn", .5, .5, .6, .35, .3, [[0, "#FFF4D0"], [.35, "#E3C27A"], [.75, "#A9832F"], [1, "#6B501A"]])}
    <g id="s4b"><circle r="${f1(rb)}" fill="url(#s4btn)"/><circle r="${f1(rb * .76)}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width=".8"/><circle r="${f1(rb * .76)}" fill="none" stroke="rgba(70,48,10,.5)" stroke-width=".7" transform="translate(.6,.6)"/>
      <circle cx="${f1(-rb * .26)}" r="${f1(rb * .12)}" fill="#4E3810"/><circle cx="${f1(rb * .26)}" r="${f1(rb * .12)}" fill="#4E3810"/><ellipse cx="${f1(-rb * .3)}" cy="${f1(-rb * .42)}" rx="${f1(rb * .35)}" ry="${f1(rb * .14)}" fill="#fff" opacity=".45" transform="rotate(-25)"/></g>`, "env");
  const pocket = `M0,${f1(y0)}L${f1(W / 2 - tr)},${f1(y0)}A${f1(tr)},${f1(tr)} 0 0 0 ${f1(W / 2 + tr)},${f1(y0)}L${W},${f1(y0)}L${W},${H}L0,${H}Z`, bottomV = `M0,${H}L${f1(W * .5)},${f1(H * .72)}L${W},${H}`;
  const F = `M0,0H${W}V${f1(Hf - rr)}Q${W},${f1(Hf)} ${f1(W - rr)},${f1(Hf)}H${f1(rr)}Q0,${f1(Hf)} 0,${f1(Hf - rr)}Z`, Fb = `M0,${f1(Hf)}H${W}V${f1(rr)}Q${W},0 ${f1(W - rr)},0H${f1(rr)}Q0,0 0,${f1(rr)}Z`;
  const inset = (d, k, h) => `<path d="${d}" fill="none" stroke="url(#kgold)" stroke-width=".9" transform="translate(${k},${h ? 0 : k}) scale(${f1((W - 2 * k) / W * 1000) / 1000},${f1((Hf - k) / Hf * 1000) / 1000})"/>`;
  const mx = W * .19, my = Hf * .34, mr = W * .065, moon = `<path d="M${f1(mx)},${f1(my - mr)}A${f1(mr)},${f1(mr)} 0 1 0 ${f1(mx)},${f1(my + mr)}A${f1(mr * .78)},${f1(mr)} 0 1 1 ${f1(mx)},${f1(my - mr)}Z" fill="url(#kgold)" transform="rotate(-25 ${f1(mx)} ${f1(my)})"/>`;
  const wound = `M${f1(B2[0])},${f1(B2[1])}L${f1(B2[0] + q)},${f1(B2[1])}L${f1(B1[0] - q)},${f1(B1[1])}A${f1(q)},${f1(q)} 0 0 1 ${f1(B1[0] + q)},${f1(B1[1])}L${f1(B2[0] - q)},${f1(B2[1])}A${f1(q)},${f1(q)} 0 0 0 ${f1(B2[0] + q)},${f1(B2[1])}` +
    `L${f1(B1[0] - q2)},${f1(B1[1])}A${f1(q2)},${f1(q2)} 0 0 1 ${f1(B1[0] + q2)},${f1(B1[1])}L${f1(B2[0] - q2)},${f1(B2[1])}A${f1(q2)},${f1(q2)} 0 0 0 ${f1(B2[0] + q2)},${f1(B2[1])}L${f1(B2[0] + q2 + 4)},${f1(B2[1] + 12)}`;
  const cord = (cls, d) => `<path class="${cls} c0" d="${d}" fill="none" stroke="#4A320C" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path class="${cls} c1" d="${d}" fill="none" stroke="#E6C77F" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  env.innerHTML = `<div class="pt s-in">${S(W, H, `<rect width="${W}" height="${H}" fill="url(#s4p)"/><rect x="${f1(W * .04)}" width="${f1(W * .92)}" height="${f1(H * .85)}" fill="url(#s4l)"/><rect width="${W}" height="${H}" fill="url(#s4in)"/>`)}</div>
  <div class="pt s-card" style="width:${f1(W * .88)}px;height:${f1(H * .84)}px;left:${f1(W * .06)}px;top:${f1(H * .09)}px">${x.cardFace()}</div>
  <div class="pt s-pk">${S(W, H, `<path d="${pocket}" fill="#000" opacity=".4" filter="url(#kb3)" transform="translate(0,-2)"/><path d="${pocket}" fill="url(#s4p)"/><path d="${pocket}" fill="url(#s4sh)"/>
    <path d="${bottomV}Z" fill="#000" opacity=".25" filter="url(#kb3)" transform="translate(0,-2)"/><path d="${bottomV}Z" fill="url(#s4p)"/><path d="${bottomV}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width=".8"/>${scatter(Hf, H, 26, B2)}
    <path d="M${f1(W / 2 - tr)},${f1(y0)}A${f1(tr)},${f1(tr)} 0 0 0 ${f1(W / 2 + tr)},${f1(y0)}" fill="none" stroke="url(#kgold)" stroke-width=".9"/>
    <path class="fsh" d="${F}" fill="#000" opacity=".4" filter="url(#kb3)" transform="translate(0,3)"/><rect class="fcs" width="${W}" height="${f1(H * .7)}" fill="url(#s4fs)" opacity="0"/>`)}</div>
  <div class="pt s-fl" style="width:${W}px;height:${f1(Hf)}px;transform-origin:50% 0">
    <div class="face ff" style="width:${W}px;height:${f1(Hf)}px">${S(W, Hf, `<path d="${F}" fill="url(#s4p)"/><path d="${F}" fill="url(#s4sh)"/>${inset(F, 7)}${moon}${scatter(0, Hf, 16, B1)}<use href="#s4b" x="${f1(B1[0])}" y="${f1(B1[1])}" filter="url(#ksh)"/><path class="fsd" d="${F}" fill="#000" opacity="0"/>`)}</div>
    <div class="face fb" style="width:${W}px;height:${f1(Hf)}px;transform:rotateX(180deg)">${S(W, Hf, `<path d="${Fb}" fill="url(#s4p)"/><path d="${Fb}" fill="url(#s4l)" transform="translate(${f1(W * .05)},${f1(Hf * .07)}) scale(.9,.93)"/><path class="fbd" d="${Fb}" fill="#000" opacity=".5"/>`)}</div></div>
  <div class="pt s-str">${S(W, H, `<g filter="url(#ksh)">${cord("w", wound)}${cord("tail", "M0,0")}</g><use class="b2" href="#s4b" x="${f1(B2[0])}" y="${f1(B2[1])}" filter="url(#ksh)"/><g class="b1c"><use href="#s4b" x="${f1(B1[0])}" y="${f1(B1[1])}" filter="url(#ksh)"/></g>`)}</div>`;
  const qq = s => env.querySelector(s), qa = s => [...env.querySelectorAll(s)];
  P = { env, inn: qq(".s-in"), card: qq(".s-card"), pk: qq(".s-pk"), fl: qq(".s-fl"), ff: qq(".ff"), fb: qq(".fb"), str: qq(".s-str"), w: qa(".w"), tail: qa(".tail"), b1c: qq(".b1c"), fsd: qq(".fsd"), fbd: qq(".fbd"), fsh: qq(".fsh"), fcs: qq(".fcs") };
  Lw = P.w[0].getTotalLength() || 1; P.anchor = q + 2;
  P.inn.style.transform = "translateZ(0px)"; P.pk.style.transform = "translateZ(4px)"; P.str.style.transform = "translateZ(9px)";
  frame(-1, 0, x);
}

function frame(T, g, x){
  const t = Math.max(T, 0), idle = T < 0, settle = idle ? 0 : E.io(seg(t, 0, 1.6)), bob = Math.sin(g * 1.1);
  const rx = mix(13, 4, settle), rz = mix(3 + bob * .5, 0, settle), press = idle ? 0 : Math.sin(Math.PI * seg(t, 0, .3));
  const down = E.io(seg(t, 1.7, 2.9)) * H * .4, fall = E.in(seg(t, 4.3, 5.4)) * H * 2.2, ty = bob * 4 * (1 - settle) + down + fall;
  P.env.style.transform = `translate3d(0,${f1(ty)}px,${f1(-press * 12)}px) rotateX(${f1(rx)}deg) rotateZ(${f1(rz)}deg)`;
  const k = E.io(seg(t, .2, 1.75)), drawn = P.anchor + (Lw - P.anchor) * (1 - k);
  P.w.forEach(e => e.setAttribute("stroke-dasharray", `${f1(drawn)} ${f1(Lw + 50)}`));
  P.b1c.setAttribute("transform", `rotate(${f1(720 * k)} ${f1(B1[0])} ${f1(B1[1])})`); P.b1c.setAttribute("opacity", t > 1.76 ? 0 : 1);
  const p = P.w[0].getPointAtLength(drawn), hl = 20 + Math.min(H * .55, (Lw - drawn) * .42), damp = 1 - .6 * seg(t, 3, 5), sw = (Math.sin(g * 2.1) * 10 + Math.sin(g * 3.4) * 4) * damp * Math.min(1, .3 + k);
  const td = `M${f1(p.x)},${f1(p.y)}C${f1(p.x + 5 + sw * .3)},${f1(p.y + hl * .35)} ${f1(p.x + 10 + sw * .8)},${f1(p.y + hl * .7)} ${f1(p.x + 14 + sw)},${f1(p.y + hl)}`;
  P.tail.forEach(e => e.setAttribute("d", td));
  if (!idle && !fired.u && t > .3){ fired.u = 1; const r = P.str.getBoundingClientRect(); x.fx.burst(r.left + r.width / 2, r.top + r.height * .45, 5, { t: "glint", speed: 40, grav: 0, life: .9, s: 3.5, w: 40, h: 60 }); }
  const fa = E.io(seg(t, 1.75, 3.05)), ang = 180 * fa;
  P.fl.style.transform = `translateZ(${f1(mix(6, .6, fa))}px) rotateX(${f1(ang)}deg)`;
  P.fsd.setAttribute("opacity", f1(.45 * Math.min(1, ang / 90))); P.fbd.setAttribute("opacity", f1(.55 * (1 - seg(ang, 95, 180)) + .04));
  P.fsh.setAttribute("opacity", f1(.4 * (1 - seg(ang, 0, 40)))); P.fcs.setAttribute("opacity", f1(Math.sin(fa * Math.PI) * .75 * (1 - seg(ang, 130, 180))));
  if (!idle && !fired.f && t > 3){ fired.f = 1; const r = P.inn.getBoundingClientRect(); x.fx.burst(r.left + r.width / 2, r.top + r.height * .05, 9, { t: "glint", col: "#FFF1CC", speed: 70, grav: -10, life: 1.3, s: 3.5, w: r.width * .9, h: 30 }); x.fx.burst(r.left + r.width / 2, r.top, 30, { t: "mote", speed: 70, grav: -18, life: 2.6, s: 3, w: r.width }); }
  const up = E.io(seg(t, 2.95, 4.25)), fw = E.io(seg(t, 4.15, 5.25)), fly = E.in(seg(t, 5.25, 6.25));
  const cTy = mix(-up * H * .94, -(down + fall), fw), cz = 2 + fw * 120 + fly * 620, sc = 1 + fw * .1 + fly * .2;
  P.card.style.transform = `translate3d(0,${f1(cTy)}px,${f1(cz)}px) rotateX(${f1(-rx * fw)}deg) scale(${sc.toFixed(3)})`;
  P.card.style.setProperty("--shx", f1(mix(-150, 260, seg(t, 3.4, 5))) + "%");
  const fade = String(1 - seg(t, 4.5, 5.25)); [P.inn, P.pk, P.ff, P.fb, P.str].forEach(e => e.style.opacity = fade);
}

function props(x){
  const { vw, vh } = x, R = K.rng(41), st = (r) => { let d = ""; for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; d += (i ? "L" : "M") + f1(Math.cos(a) * q) + "," + f1(Math.sin(a) * q); } return d + "Z"; };
  let o = ""; for (let i = 0; i < 18; i++){ const a = R() * 6.28, rr = .43 + R() * .16, X = vw / 2 + Math.cos(a) * vw * rr * 1.05, Y = vh * .54 + Math.sin(a) * vh * rr * .7, r = 3 + R() * 6;
    o += `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px;filter:drop-shadow(1px 3px 2px rgba(0,0,0,.55))" width="1" height="1"><path d="${st(r)}" fill="url(#kgold)" transform="rotate(${f1(R() * 72)})"/></svg>`; }
  const mx = vw * .86, my = vh * .2, mr = Math.min(vw, vh) * .07;
  o += `<svg class="prop" style="left:${f1(mx)}px;top:${f1(my)}px" width="1" height="1"><path d="M0,${f1(-mr)}A${f1(mr)},${f1(mr)} 0 1 0 0,${f1(mr)}A${f1(mr * .75)},${f1(mr)} 0 1 1 0,${f1(-mr)}Z" fill="url(#kgold)" transform="rotate(-20)"/></svg>`;
  return o;
}
return { hint: "შეეხეთ ძაფს", aspect: 1.3, maxW: .74, maxH: .54, sy: "54%", dur: 6.25, build, frame, props };
})();
