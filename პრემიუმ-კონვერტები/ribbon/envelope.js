/* კონვერტი II · აბრეშუმის ლენტი — ზურმუხტისფერი ორკარიანი კონვერტი ოქროს არ-დეკოთი, შამპანურისფერი ატლასის ლენტითა და ფიონით, შავ მარმარილოზე მარგალიტებით.
   გახსნა: ფიონი იხსნება და ლენტი ქვემოთ ჩამოსრიალდება → ორი კარი 3D-ში გარეთ იღება, შიგნიდან თბილი შუქი გამოდის →
   ოქროსნაპირიანი ბარათი წინ ამოიწევს და კამერისკენ მოფრინავს. */
window.ENVELOPE = (function(){
"use strict";
const { seg, mix, ease: E, f1 } = K;
const S = (w, h, body, st = "") => `<svg width="${f1(w)}" height="${f1(h)}" viewBox="0 0 ${f1(w)} ${f1(h)}" style="${st}">${body}</svg>`;
let P = {}, W, H, w2, by, bh, s, fired = {};

function build(env, x){
  W = x.W; H = x.H; w2 = W / 2; by = H * .6; bh = H * .075; s = W * .16; fired = {};
  const my = H * .3, mr = W * .17, C = x.C;
  K.defs(`${K.pat("r2p", K.paper("#103E31", { grain: 10, mottle: .08, fiber: 40, fleck: 34, seed: 6 }))}${K.liner("r2l", "deco", { bg: "#0A2A21", fg: "#C9A55E", scale: .72 })}
    ${K.lg("r2sl", 0, 0, 1, 0, [[0, "#fff", .07], [.8, "#000", .05], [1, "#000", .28]])}${K.lg("r2sr", 0, 0, 1, 0, [[0, "#000", .3], [.2, "#000", .06], [1, "#fff", .04]])}
    ${K.lg("r2band", 0, 0, 0, 1, [[0, "#9C845A"], [.22, "#F2E4C6"], [.4, "#FFF9EC"], [.62, "#D9C49A"], [.85, "#B59C6C"], [1, "#8E7550"]])}${K.lg("r2end", 0, 0, 1, 0, [[0, "#000", .35], [.06, "#000", 0], [.94, "#000", 0], [1, "#000", .35]])}
    ${K.lg("r2sat", 0, 0, 1, 1, [[0, "#C8B183"], [.3, "#FFF7E6"], [.5, "#E9D7B0"], [.75, "#FFF3DA"], [1, "#A88E5E"]])}${K.lg("r2satD", 0, 0, 1, 1, [[0, "#8E7550"], [.5, "#C7AE7E"], [1, "#7B6342"]])}
    ${K.rg("r2glow", .5, .5, .55, .5, .5, [[0, "#FFE7AE", .95], [.35, "#E8C47A", .45], [1, "#E8C47A", 0]])}${K.rg("r2inS", .5, .5, .72, .5, .5, [[.55, "#000", 0], [1, "#000", .6]])}`, "env");
  const medal = cx0 => `<g fill="none" stroke="url(#kgold)"><circle cx="${f1(cx0)}" cy="${f1(my)}" r="${f1(mr)}" stroke-width="1.5"/><circle cx="${f1(cx0)}" cy="${f1(my)}" r="${f1(mr * .84)}" stroke-width=".6"/>
      ${Array.from({ length: 24 }, (_, i) => { const a = i / 24 * 6.283; return `<path d="M${f1(cx0 + Math.cos(a) * mr * .88)},${f1(my + Math.sin(a) * mr * .88)}L${f1(cx0 + Math.cos(a) * mr * (i % 2 ? .95 : 1.12))},${f1(my + Math.sin(a) * mr * (i % 2 ? .95 : 1.12))}" stroke-width=".7"/>`; }).join("")}</g>
    <text x="${f1(cx0)}" y="${f1(my + mr * .26)}" text-anchor="middle" font-family="${x.TH.script}" font-size="${f1(mr * .78)}" fill="url(#kgold)">${x.esc(C.mono)}</text>`;
  const fan = (X, Y, sx, sy) => `<g transform="translate(${f1(X)},${f1(Y)}) scale(${sx},${sy})" fill="none" stroke="url(#kgold)" stroke-width=".8">${[16, 11, 6].map(r => `<path d="M0,${r}A${r},${r} 0 0 0 ${r},0"/>`).join("")}${[20, 45, 70].map(a => `<path d="M0,0L${f1(16 * Math.sin(a * Math.PI / 180))},${f1(16 * Math.cos(a * Math.PI / 180))}" stroke-width=".4"/>`).join("")}</g>`;
  const doorF = side => { const L = side < 0, gx = L ? 0 : w2, frame = L ? `M${f1(w2)},10H10V${f1(H - 10)}H${f1(w2)}M${f1(w2)},15H15V${f1(H - 15)}H${f1(w2)}` : `M0,10H${f1(w2 - 10)}V${f1(H - 10)}H0M0,15H${f1(w2 - 15)}V${f1(H - 15)}H0`;
    return S(w2, H, `<rect width="${f1(w2)}" height="${H}" fill="url(#r2p)"/><rect width="${f1(w2)}" height="${H}" fill="url(#${L ? "r2sl" : "r2sr"})"/>
      <path d="${frame}" fill="none" stroke="url(#kgold)" stroke-width="1.1"/>${L ? fan(15, 15, 1, 1) + fan(15, H - 15, 1, -1) : fan(w2 - 15, 15, -1, 1) + fan(w2 - 15, H - 15, -1, -1)}
      ${medal(L ? w2 : 0)}<path d="M${L ? f1(w2 - .5) : .5},0V${H}" stroke="${L ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.4)"}"/><rect class="dsh" width="${f1(w2)}" height="${H}" fill="#000" opacity="0"/>`, "overflow:hidden"); };
  const doorB = side => { const L = side < 0, x0 = L ? 8 : 0, lw = w2 - 8;
    return S(w2, H, `<rect width="${f1(w2)}" height="${H}" fill="url(#r2p)"/><rect x="${x0}" y="8" width="${f1(lw)}" height="${f1(H - 16)}" fill="url(#r2l)"/><rect x="${x0}" y="8" width="${f1(lw)}" height="${f1(H - 16)}" fill="none" stroke="url(#kgold)" stroke-width=".8"/>
      <rect class="bsh" width="${f1(w2)}" height="${H}" fill="#000" opacity=".5"/>`, "overflow:hidden"); };
  const loop = `M0,0C${f1(-.3 * s)},${f1(-.75 * s)} ${f1(-1.15 * s)},${f1(-.78 * s)} ${f1(-1.12 * s)},${f1(-.12 * s)}C${f1(-1.1 * s)},${f1(.42 * s)} ${f1(-.4 * s)},${f1(.34 * s)} 0,0Z`;
  const loopIn = `M${f1(-.2 * s)},${f1(-.04 * s)}C${f1(-.44 * s)},${f1(-.46 * s)} ${f1(-.95 * s)},${f1(-.5 * s)} ${f1(-.93 * s)},${f1(-.13 * s)}C${f1(-.9 * s)},${f1(.15 * s)} ${f1(-.44 * s)},${f1(.13 * s)} ${f1(-.2 * s)},${f1(-.04 * s)}Z`;
  const tail = `M${f1(-.06 * s)},${f1(.08 * s)}C${f1(-.22 * s)},${f1(.5 * s)} ${f1(-.42 * s)},${f1(.95 * s)} ${f1(-.62 * s)},${f1(1.36 * s)}L${f1(-.42 * s)},${f1(1.26 * s)}L${f1(-.34 * s)},${f1(1.46 * s)}C${f1(-.16 * s)},${f1(1.02 * s)} ${f1(-.02 * s)},${f1(.52 * s)} ${f1(.08 * s)},${f1(.1 * s)}Z`;
  const bcx = w2, bcy = by + bh / 2;
  env.innerHTML = `<div class="pt r-base">${S(W, H, `<rect width="${W}" height="${H}" fill="url(#r2l)"/><rect width="${W}" height="${H}" fill="url(#r2inS)"/><rect class="glw" width="${W}" height="${H}" fill="url(#r2glow)" opacity="0"/>`)}</div>
  <div class="pt r-card" style="width:${f1(W * .84)}px;height:${f1(H * .86)}px;left:${f1(W * .08)}px;top:${f1(H * .07)}px">${x.cardFace()}</div>
  <div class="pt r-dl" style="width:${f1(w2)}px;height:${H}px;transform-origin:0 50%"><div class="face df" style="width:${f1(w2)}px;height:${H}px">${doorF(-1)}</div><div class="face db" style="width:${f1(w2)}px;height:${H}px;transform:rotateY(180deg)">${doorB(-1)}</div></div>
  <div class="pt r-dr" style="left:${f1(w2)}px;width:${f1(w2)}px;height:${H}px;transform-origin:100% 50%"><div class="face df" style="width:${f1(w2)}px;height:${H}px">${doorF(1)}</div><div class="face db" style="width:${f1(w2)}px;height:${H}px;transform:rotateY(180deg)">${doorB(1)}</div></div>
  <div class="pt r-band" style="top:${f1(by)}px;width:${W}px;height:${f1(bh)}px;transform-origin:50% 50%">${S(W, bh, `<rect y="${f1(bh * .5 + 2)}" width="${W}" height="${f1(bh * .6)}" fill="#000" opacity=".35" filter="url(#kb3)"/><rect width="${W}" height="${f1(bh)}" fill="url(#r2band)"/><rect width="${W}" height="${f1(bh)}" fill="url(#r2end)"/>
     <path d="M0,2.2H${W}M0,${f1(bh - 2.2)}H${W}" stroke="rgba(255,255,255,.45)" stroke-width=".6" stroke-dasharray="3 2"/>`)}</div>
  <div class="pt r-bow" style="width:${W}px;height:${H}px">${S(W, H, `<g class="bw" filter="url(#ksh2)" transform="translate(${f1(bcx)},${f1(bcy)})">
     <g class="ta"><path d="${tail}" fill="url(#r2sat)"/></g><g class="tb"><path d="${tail}" fill="url(#r2sat)" transform="scale(-1,1) rotate(-8)"/></g>
     <g class="ll"><path d="${loop}" fill="url(#r2sat)"/><path d="${loopIn}" fill="url(#r2satD)" opacity=".85"/></g><g class="lr"><g transform="scale(-1,1)"><path d="${loop}" fill="url(#r2sat)"/><path d="${loopIn}" fill="url(#r2satD)" opacity=".85"/></g></g>
     <g class="kn"><rect x="${f1(-.17 * s)}" y="${f1(-.22 * s)}" width="${f1(.34 * s)}" height="${f1(.44 * s)}" rx="${f1(.12 * s)}" fill="url(#r2sat)"/><path d="M${f1(-.08 * s)},${f1(-.18 * s)}Q0,0 ${f1(-.06 * s)},${f1(.18 * s)}" stroke="rgba(120,95,55,.5)" fill="none" stroke-width=".8"/></g></g>`)}</div>`;
  const q = sel => env.querySelector(sel), qa = sel => [...env.querySelectorAll(sel)];
  P = { env, base: q(".r-base"), glw: q(".glw"), card: q(".r-card"), dl: q(".r-dl"), dr: q(".r-dr"), band: q(".r-band"), bow: q(".r-bow"), ll: q(".ll"), lr: q(".lr"), tl: q(".ta"), tr: q(".tb"), kn: q(".kn"),
    dsh: qa(".dsh"), bsh: qa(".bsh"), faces: qa(".face") };
  P.band.style.transform = "translateZ(6px)"; P.bow.style.transform = "translateZ(8px)";
  frame(-1, 0, x);
}

function frame(T, g, x){
  const t = Math.max(T, 0), idle = T < 0, settle = idle ? 0 : E.io(seg(t, 0, 1.5)), bob = Math.sin(g * 1.1);
  const rx = mix(13, 4, settle), rz = mix(-2.5 + bob * .5, 0, settle), press = idle ? 0 : Math.sin(Math.PI * seg(t, 0, .3)), back = E.io(seg(t, 1.45, 2.6)) * 240;
  P.env.style.transform = `translate3d(0,${f1(bob * 4 * (1 - settle))}px,${f1(-press * 12 - back)}px) rotateX(${f1(rx)}deg) rotateZ(${f1(rz)}deg)`;
  const u = E.io(seg(t, .25, 1.05)), uo = String(1 - seg(t, .8, 1.05));
  P.ll.setAttribute("transform", `rotate(${f1(-55 * u)}) scale(${(1 - .85 * u).toFixed(3)})`); P.lr.setAttribute("transform", `rotate(${f1(55 * u)}) scale(${(1 - .85 * u).toFixed(3)})`);
  P.tl.setAttribute("transform", `translate(0,${f1(u * s * .5)}) scale(1,${(1 - .7 * u).toFixed(3)})`); P.tr.setAttribute("transform", `translate(0,${f1(u * s * .5)}) scale(1,${(1 - .7 * u).toFixed(3)})`);
  [P.ll, P.lr, P.tl, P.tr].forEach(e => e.setAttribute("opacity", uo)); P.kn.setAttribute("transform", `scale(${(1 - .45 * u).toFixed(3)})`);
  if (!idle && !fired.u && t > .35){ fired.u = 1; const r = P.band.getBoundingClientRect(); x.fx.burst(r.left + r.width / 2, r.top + r.height / 2, 5, { t: "glint", speed: 50, grav: 0, life: .8, s: 4, w: 40 }); }
  const f = seg(t, .85, 1.85), fy = E.in(f) * H * 1.15, fr = 9 * E.io(f), fo = String(1 - seg(t, 1.5, 1.85));
  const bandT = `translate3d(0,${f1(fy)}px,${f1(6 + 50 * f)}px) rotateZ(${f1(fr)}deg) rotateX(${f1(25 * f)}deg)`;
  P.band.style.transform = bandT; P.bow.style.transform = `translate3d(0,${f1(fy)}px,${f1(8 + 50 * f)}px) rotateZ(${f1(fr)}deg)`; P.band.style.opacity = fo; P.bow.style.opacity = fo;
  const dl = E.out(seg(t, 1.5, 2.9)), dr = E.out(seg(t, 1.62, 3)), aL = 158 * dl, aR = 158 * dr;
  P.dl.style.transform = `translateZ(3px) rotateY(${f1(-aL)}deg)`; P.dr.style.transform = `translateZ(3.2px) rotateY(${f1(aR)}deg)`;
  P.dsh[0].setAttribute("opacity", f1(.5 * seg(aL, 0, 90))); P.dsh[1].setAttribute("opacity", f1(.5 * seg(aR, 0, 90)));
  P.bsh[0].setAttribute("opacity", f1(.55 * (1 - seg(aL, 90, 158)) + .05)); P.bsh[1].setAttribute("opacity", f1(.55 * (1 - seg(aR, 90, 158)) + .05));
  P.glw.setAttribute("opacity", f1(seg(t, 1.6, 2.5) * (1 - .4 * seg(t, 3.2, 4))));
  if (!idle && !fired.d && t > 1.75){ fired.d = 1; const r = P.card.getBoundingClientRect(), X = r.left + r.width / 2, Y = r.top + r.height / 2;
    x.fx.burst(X, Y, 34, { t: "fleck", speed: 210, grav: 70, life: 2.6, s: 4.2, h: r.height * .6 }); x.fx.burst(X, Y, 26, { t: "mote", speed: 90, grav: -10, life: 2.4, s: 3, h: r.height * .8 }); x.fx.burst(X, r.top + r.height * .3, 4, { t: "glint", speed: 30, grav: 0, life: 1, s: 5, w: r.width * .6 }); }
  const rise = E.io(seg(t, 2.65, 3.9)), fly = E.in(seg(t, 3.9, 5.05));
  P.card.style.transform = `translate3d(0,${f1(-H * .03 * rise)}px,${f1(2 + rise * 300 + fly * 620)}px) rotateX(${f1(-rx * rise)}deg) scale(${(1 + .02 * rise + .2 * fly).toFixed(3)})`;
  P.card.style.setProperty("--shx", f1(mix(-150, 260, seg(t, 2.3, 4))) + "%");
  const fade = String(1 - seg(t, 3.3, 4.15)); P.base.style.opacity = fade; P.faces.forEach(e => e.style.opacity = fade);
}

function props(x){
  const { vw, vh } = x, R = K.rng(12), L = Math.min(vh * .26, vw * .58);
  K.defs(K.rg("r2pearl", .5, .5, .55, .34, .3, [[0, "#FFFFFF"], [.35, "#F3EEE5"], [.75, "#D3CBBE"], [1, "#9C9589"]]), "props");
  const pearl = (X, Y, r) => `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px;filter:none" width="1" height="1"><ellipse cx="${f1(r * .35)}" cy="${f1(r * .85)}" rx="${f1(r * .95)}" ry="${f1(r * .38)}" fill="#000" opacity=".45" filter="url(#kb3)"/>
    <circle r="${f1(r)}" fill="url(#r2pearl)"/><circle cx="${f1(-r * .34)}" cy="${f1(-r * .38)}" r="${f1(r * .2)}" fill="#fff" opacity=".9"/><circle r="${f1(r)}" fill="none" stroke="rgba(255,236,200,.25)"/></svg>`;
  const sp = (X, Y, rot, len, seed, bend) => `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px" width="1" height="1"><g transform="rotate(${rot})">${K.sprig(len, { seed, bend, n: 9, leaf: .085, c1: "#FFF0C4", c2: "#D4AF62", c3: "#7A5A22", stem: "#A8843E", vein: "rgba(255,250,230,.5)" })}</g></svg>`;
  let o = sp(vw * 1.03, vh * .2, -128, L, 21, 1) + sp(vw * -.04, vh * .92, 50, L * .9, 23, -1);
  const pos = [[.12, .2, 7], [.2, .24, 4.5], [.86, .83, 8], [.78, .88, 5], [.93, .74, 4], [.07, .7, 5.5], [.16, .66, 3.5], [.9, .32, 3.5]];
  pos.forEach(([a, b, r]) => o += pearl(vw * a + (R() - .5) * 8, vh * b + (R() - .5) * 8, r * Math.min(1.25, vw / 360)));
  return o;
}
return { hint: "შეეხეთ ფიონს", aspect: 1.36, maxW: .8, maxH: .58, sy: "53%", dur: 5.05, build, frame, props };
})();
