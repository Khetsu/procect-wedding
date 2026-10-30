/* კონვერტი V · ოქროს დანა — შავი კონვერტი ოქროს არ-დეკოს ჩარჩოთი, ოქროს მარკითა და შტამპით, ზამშის მაგიდაზე პროჟექტორის შუქში.
   გახსნა: ოქროს ქაღალდის დანა კონვერტის ზედა კიდეს ჭრის (ნაპერწკლების კვალით) → ჩამოჭრილი ზოლი ჰაერში ტრიალებს და ვარდება →
   შავ-ოქროსფერი ბარათი ჭრილიდან ამოდის და კამერისკენ მოფრინავს. */
window.ENVELOPE = (function(){
"use strict";
const { seg, mix, ease: E, f1 } = K;
const S = (w, h, body) => `<svg width="${f1(w)}" height="${f1(h)}" viewBox="0 0 ${f1(w)} ${f1(h)}">${body}</svg>`;
let P = {}, W, H, cy, fired = {}, lastT = 0;

function build(env, x){
  W = x.W; H = x.H; cy = H * .1; fired = {}; lastT = 0;
  const C = x.C, sw = W * .13, shh = sw * 1.22, sx = W - 13 - sw - 6, sy = cy + 14, R = K.rng(3);
  K.defs(`${K.pat("n5p", K.paper("#151412", { grain: 7, mottle: .04, fiber: 30, seed: 23 }))}${K.lg("n5sh", 0, 0, 0, 1, [[0, "#fff", .07], [.5, "#fff", 0], [1, "#000", .25]])}
    ${K.lg("n5bl", 0, 0, 0, 1, [[0, "#FFF8E2"], [.45, "#E2C47E"], [.55, "#9C7A34"], [1, "#5E461A"]])}${K.lg("n5hd", 0, 0, 0, 1, [[0, "#F6DC97"], [.35, "#C89F4E"], [.7, "#7E5E22"], [1, "#4A3510"]])}
    ${K.lg("n5in", 0, 0, 0, 1, [[0, "#000", .9], [.12, "#000", .3], [1, "#000", .2]])}`, "env");
  const frame = (k, o) => `<rect x="${k}" y="${f1(cy + k - 2)}" width="${f1(W - 2 * k)}" height="${f1(H - cy - 2 * k + 2)}" fill="none" stroke="url(#kgold)" stroke-width="${o}"/>`;
  const deco = (X, Y, sx2, sy2) => `<g transform="translate(${f1(X)},${f1(Y)}) scale(${sx2},${sy2})" fill="none" stroke="url(#kgold)" stroke-width=".8"><path d="M0,22V0H22"/><path d="M5,22V5H22" stroke-width=".5"/><path d="M10,18V10H18"/><path d="M0,0L12,12" stroke-width=".5"/></g>`;
  let perf = ""; const pr = 1.5; for (let i = 0; i <= 9; i++){ const px = sx + i * sw / 9; perf += `<circle cx="${f1(px)}" cy="${f1(sy)}" r="${pr}" fill="#151412"/><circle cx="${f1(px)}" cy="${f1(sy + shh)}" r="${pr}" fill="#151412"/>`; }
  for (let i = 0; i <= 11; i++){ const py = sy + i * shh / 11; perf += `<circle cx="${f1(sx)}" cy="${f1(py)}" r="${pr}" fill="#151412"/><circle cx="${f1(sx + sw)}" cy="${f1(py)}" r="${pr}" fill="#151412"/>`; }
  const scx = sx + sw / 2, scy = sy + shh / 2;
  const stamp = `<g filter="url(#ksh)"><rect x="${f1(sx)}" y="${f1(sy)}" width="${f1(sw)}" height="${f1(shh)}" fill="url(#kgold)"/>${perf}</g><rect x="${f1(sx + 3.5)}" y="${f1(sy + 3.5)}" width="${f1(sw - 7)}" height="${f1(shh - 7)}" fill="#1A1713"/>
    ${Array.from({ length: 16 }, (_, i) => { const a = Math.PI + i / 15 * Math.PI; return `<path d="M${f1(scx)},${f1(sy + shh - 7)}L${f1(scx + Math.cos(a) * sw * .5)},${f1(sy + shh - 7 + Math.sin(a) * sw * .62)}" stroke="url(#kgold)" stroke-width=".4" opacity=".7"/>`; }).join("")}
    <text x="${f1(scx)}" y="${f1(scy + sw * .2)}" text-anchor="middle" font-family="${x.TH.num}" font-size="${f1(sw * .52)}" fill="url(#kgold)">${x.esc(C.big || C.mono)}</text>
    <g fill="none" stroke="rgba(212,175,98,.45)" stroke-width=".8"><circle cx="${f1(sx - sw * .1)}" cy="${f1(sy + shh * .78)}" r="${f1(sw * .42)}"/>${[0, 1, 2].map(i => `<path d="M${f1(sx - sw * .9)},${f1(sy + shh * .64 + i * sw * .14)}q${f1(sw * .2)},-4 ${f1(sw * .4)},0t${f1(sw * .4)},0t${f1(sw * .4)},0"/>`).join("")}</g>`;
  const fs = W * .05, mid = cy + (H - cy) * .56;
  const front = `<rect y="${f1(cy)}" width="${W}" height="${f1(H - cy)}" fill="url(#n5p)"/><rect y="${f1(cy)}" width="${W}" height="${f1(H - cy)}" fill="url(#n5sh)"/>${frame(9, 1.1)}${frame(13, .5)}
    ${deco(17, cy + 15, 1, 1)}${deco(W - 17, cy + 15, -1, 1)}${deco(17, H - 17, 1, -1)}${deco(W - 17, H - 17, -1, -1)}${stamp}
    <text x="46" y="${f1(cy + 30)}" font-family="${x.TH.serif}" font-size="${f1(W * .028)}" fill="url(#kgold)" letter-spacing="1.5">${x.esc(C.a)}</text><text x="46" y="${f1(cy + 30 + W * .04)}" font-family="${x.TH.num}" font-size="${f1(W * .028)}" fill="rgba(212,175,98,.7)" letter-spacing="2">${x.DOTS}</text>
    <text x="${f1(W / 2)}" y="${f1(mid)}" text-anchor="middle" font-family="${x.TH.serif}" font-size="${f1(fs)}" fill="url(#kgold)" letter-spacing="1">${x.toLine}</text>
    <g stroke="url(#kgold)" stroke-width=".8"><path d="M${f1(W * .3)},${f1(mid + fs * .9)}H${f1(W * .46)}M${f1(W * .54)},${f1(mid + fs * .9)}H${f1(W * .7)}"/></g><path d="M${f1(W / 2)},${f1(mid + fs * .9 - 4)}l4,4l-4,4l-4,-4z" fill="url(#kgold)"/>
    <text x="${f1(W / 2)}" y="${f1(mid + fs * 2.1)}" text-anchor="middle" font-family="${x.TH.serif}" font-size="${f1(W * .03)}" fill="rgba(239,228,203,.7)" letter-spacing="2.5">${x.esc(C.title || C.kicker)}</text>`;
  const Lb = W * .34, bw = W * .022, Lh = W * .24, hw = W * .026;
  const opener = `<g filter="url(#ksh2)"><path d="M0,0C${f1(-Lb * .3)},${f1(-bw * .6)} ${f1(-Lb * .8)},${f1(-bw)} ${f1(-Lb)},${f1(-bw)}L${f1(-Lb)},${f1(bw)}C${f1(-Lb * .8)},${f1(bw)} ${f1(-Lb * .3)},${f1(bw * .6)} 0,0Z" fill="url(#n5bl)"/>
    <path d="M0,0L${f1(-Lb)},0" stroke="rgba(255,255,255,.5)" stroke-width=".5"/><rect x="${f1(-Lb - 4)}" y="${f1(-bw * 2.2)}" width="6" height="${f1(bw * 4.4)}" rx="2" fill="url(#n5hd)"/>
    <rect x="${f1(-Lb - 4 - Lh)}" y="${f1(-hw)}" width="${f1(Lh)}" height="${f1(hw * 2)}" rx="${f1(hw)}" fill="url(#n5hd)"/>
    ${[.2, .45, .7].map(k => `<rect x="${f1(-Lb - 4 - Lh * (1 - k) - 3)}" y="${f1(-hw)}" width="6" height="${f1(hw * 2)}" fill="#111"/><rect x="${f1(-Lb - 4 - Lh * (1 - k) - 4)}" y="${f1(-hw)}" width="1" height="${f1(hw * 2)}" fill="#F2D896"/>`).join("")}
    <circle cx="${f1(-Lb - 4 - Lh)}" r="${f1(hw * 1.35)}" fill="url(#n5hd)"/><circle cx="${f1(-Lb - 4 - Lh - hw * .4)}" cy="${f1(-hw * .4)}" r="${f1(hw * .4)}" fill="#fff" opacity=".6"/></g>`;
  env.innerHTML = `<div class="pt n-bk">${S(W, H, `<rect y="${f1(cy)}" width="${W}" height="${f1(H - cy)}" fill="url(#n5p)"/><rect y="${f1(cy)}" width="${W}" height="${f1(H - cy)}" fill="url(#n5in)"/><path d="M0,${f1(cy + .5)}H${W}" stroke="rgba(212,175,98,.6)"/>`)}</div>
  <div class="pt n-card" style="width:${f1(W * .92)}px;height:${f1(H * .85)}px;left:${f1(W * .04)}px;top:${f1(H * .12)}px">${x.cardFace()}</div>
  <div class="pt n-fr">${S(W, H, front)}</div>
  <div class="pt n-st" style="width:${W}px;height:${f1(cy)}px;transform-origin:50% 50%">${S(W, cy, `<rect width="${W}" height="${f1(cy)}" fill="url(#n5p)"/><rect width="${W}" height="${f1(cy)}" fill="#fff" opacity=".07"/><path d="M0,.6H${W}" stroke="url(#kgold)" stroke-width=".9"/>`)}</div>
  <div class="pt n-cut">${S(W, H, `<line class="g1" x1="0" y1="${f1(cy)}" x2="0" y2="${f1(cy)}" stroke="#F3CF7C" stroke-width="4" filter="url(#kb3)" opacity=".9"/><line class="g2" x1="0" y1="${f1(cy)}" x2="0" y2="${f1(cy)}" stroke="#FFF6DC" stroke-width="1.1"/>`)}</div>
  <div class="pt n-op">${S(1, 1, opener)}</div><div class="pt n-tip" style="width:1px;height:1px"></div>`;
  const q = s => env.querySelector(s);
  P = { env, bk: q(".n-bk"), card: q(".n-card"), fr: q(".n-fr"), st: q(".n-st"), cut: q(".n-cut"), g1: q(".g1"), g2: q(".g2"), op: q(".n-op"), tip: q(".n-tip") };
  P.bk.style.transform = "translateZ(0px)"; P.fr.style.transform = "translateZ(4px)"; P.cut.style.transform = "translateZ(5px)";
  frame(-1, 0, x);
}

function frame(T, g, x){
  const t = Math.max(T, 0), idle = T < 0, settle = idle ? 0 : E.io(seg(t, 0, 1.4)), bob = Math.sin(g * 1.1), dt = Math.max(0, t - lastT); lastT = t;
  const rx = mix(12, 4, settle), rz = mix(-2.5 + bob * .5, 0, settle);
  const down = E.io(seg(t, 2.3, 3.4)) * H * .42, fall = E.in(seg(t, 4.25, 5.3)) * H * 3.2, ty = bob * 4 * (1 - settle) + down + fall;
  P.env.style.transform = `translate3d(0,${f1(ty)}px,0) rotateX(${f1(rx)}deg) rotateZ(${f1(rz)}deg)`;
  const en = E.out(seg(t, 0, .55)), sl = E.io(seg(t, .55, 2)), ex = E.in(seg(t, 2, 2.6)), cutX = mix(-6, W + 8, sl);
  const ox = mix(-W * .55, cutX, en) + ex * W * .35, oy = mix(cy - H * .9, cy, en) - ex * H * .7, orot = mix(-40, -8, en) + ex * 25;
  P.op.style.transform = `translate3d(${f1(ox)}px,${f1(oy)}px,14px) rotateZ(${f1(orot)}deg)`; P.op.style.opacity = String(idle ? 0 : en * (1 - ex));
  P.tip.style.transform = `translate3d(${f1(cutX)}px,${f1(cy)}px,6px)`;
  const gx = f1(Math.max(0, Math.min(W, cutX))); [P.g1, P.g2].forEach(e => e.setAttribute("x2", gx)); P.cut.style.opacity = String(seg(t, .55, .7) * (1 - seg(t, 2.1, 2.8)));
  if (!idle && t > .6 && t < 2.02 && dt > 0){ const r = P.tip.getBoundingClientRect(), n = Math.max(1, Math.round(dt * 70));
    x.fx.burst(r.left, r.top, n, { t: "spark", cols: ["#FFE7A8", "#F3C66A", "#FFFFFF"], dir: -1.75, spread: 2.2, speed: 190, grav: 420, life: .7, s: 2.4 });
    if (Math.random() < dt * 4) x.fx.burst(r.left, r.top, 1, { t: "glint", speed: 10, grav: 0, life: .5, s: 3.5 }); }
  const k = seg(t, 2, 3.05), sc = H / 200;
  P.st.style.transform = `translate3d(${f1(-20 * k * sc)}px,${f1((-55 * k + 760 * k * k) * sc)}px,${f1(4 + 60 * k)}px) rotateX(${f1(55 * k)}deg) rotateZ(${f1(-16 * k)}deg)`; P.st.style.opacity = String(1 - seg(t, 2.7, 3.05));
  const up = E.io(seg(t, 2.75, 4.05)), fw = E.io(seg(t, 3.95, 5.0)), fly = E.in(seg(t, 5.0, 6.0));
  const cTy = mix(-up * H * .98, -(down + fall), fw), cz = 2 + fw * 150 + fly * 620, s2 = 1 + fw * .18 + fly * .2;
  P.card.style.transform = `translate3d(0,${f1(cTy)}px,${f1(cz)}px) rotateX(${f1(-rx * fw)}deg) scale(${s2.toFixed(3)})`;
  P.card.style.setProperty("--shx", f1(mix(-150, 260, seg(t, 3.1, 4.8))) + "%");
  if (!idle && !fired.c && t > 3.3){ fired.c = 1; const r = P.card.getBoundingClientRect(); x.fx.burst(r.left + r.width / 2, r.top + 4, 6, { t: "glint", speed: 30, grav: 0, life: 1, s: 4.5, w: r.width * .85 }); }
  const fade = String(1 - seg(t, 4.35, 5.0)); [P.bk, P.fr].forEach(e => e.style.opacity = fade);
}

function props(x){
  const { vw, vh } = x, R = K.rng(51); let o = "";
  for (let i = 0; i < 22; i++){ const a = R() * 6.28, rr = .42 + R() * .2, X = vw / 2 + Math.cos(a) * vw * rr * 1.05, Y = vh * .52 + Math.sin(a) * vh * rr * .7, r = 1.6 + R() * 3.6;
    o += `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px;filter:drop-shadow(1px 2px 1.5px rgba(0,0,0,.7))" width="1" height="1"><circle r="${f1(r)}" fill="url(#kgold)"/><circle r="${f1(r * .45)}" fill="none" stroke="rgba(90,60,15,.6)" stroke-width=".6"/><circle cx="${f1(-r * .35)}" cy="${f1(-r * .35)}" r="${f1(r * .3)}" fill="#fff" opacity=".7"/></svg>`; }
  for (let i = 0; i < 6; i++){ const X = vw * (i % 2 ? .82 + R() * .14 : .04 + R() * .14), Y = vh * (.12 + R() * .78), r = 5 + R() * 8;
    o += `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px" width="1" height="1"><path d="M${f1(-r)},${f1(-r * .3)}L${f1(r * .2)},${f1(-r)}L${f1(r)},${f1(-r * .1)}L${f1(r * .4)},${f1(r * .8)}L${f1(-r * .6)},${f1(r * .6)}Z" fill="url(#kgold)" opacity=".9" transform="rotate(${f1(R() * 360)})"/></svg>`; }
  return o;
}
return { hint: "შეეხეთ კონვერტს", aspect: .64, maxW: .88, maxH: .4, sy: "52%", dur: 6.0, build, frame, props };
})();
