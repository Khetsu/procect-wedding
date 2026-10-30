/* კონვერტი III · ყვავილის კონვერტი — პუდრისფერი კვადრატული „პოშეტი“ ოთხი ფურცლისებრი სარქველით, დახურული გამჭვირვალე სტიკერით, შიგ — დაწნეხილი ყვავილი.
   გახსნა: სტიკერი აიკეცება და გაფრინდება → ოთხი ფურცელი რიგ-რიგობით, ყვავილივით იშლება (შიგნით ყვავილოვანი სარჩული) → ვარდის ფურცლები ცვივა →
   ბარათი შუიდან ამოიწევს და კამერისკენ მოფრინავს. */
window.ENVELOPE = (function(){
"use strict";
const { seg, mix, ease: E, f1 } = K;
const S = (w, h, body) => `<svg width="${f1(w)}" height="${f1(h)}" viewBox="0 0 ${f1(w)} ${f1(h)}">${body}</svg>`;
let P = {}, W, Hf, fired = {};
const OPEN = [[.9, 1.9], [1.15, 2.15], [1.4, 2.4], [1.65, 2.65]];

function build(env, x){
  W = x.W; Hf = W * .58; fired = {};
  K.defs(`${K.pat("b3p", K.paper("#ECC2C3", { grain: 11, mottle: .05, fiber: 120, seed: 14 }))}${K.liner("b3l", "floral", { bg: "#FFF8F3", fg: "#F2B3BD", fg2: "#E991A2", mid: "#D9A45F", leaf: "#A9BC9A", scale: .95 })}
    ${K.lg("b3sh", 0, 0, 0, 1, [[0, "#fff", .2], [.6, "#fff", 0], [1, "#8A4A55", .1]])}${K.rg("b3vel", .5, .5, .55, .4, .35, [[0, "#FFFFFF", .92], [.8, "#FFF6F4", .78], [1, "#F4E2E0", .7]])}
    ${K.lg("b3pt", 0, 0, 1, 1, [[0, "#F7C4CC"], [.6, "#E68A9C"], [1, "#C2566E"]])}${K.lg("b3pt2", 0, 0, 1, 1, [[0, "#FBE0E3"], [1, "#EAA0AE"]])}`, "env");
  // ფურცლის ფორმა (ზედა სარქველი): ანჯამა ზემოთ, წვერი ქვემოთ შუაში
  const top = `M0,0L${W},0C${f1(W * .97)},${f1(Hf * .5)} ${f1(W * .66)},${f1(Hf * .86)} ${f1(W * .5)},${f1(Hf)}C${f1(W * .34)},${f1(Hf * .86)} ${f1(W * .03)},${f1(Hf * .5)} 0,0Z`;
  const tfm = { t: "", b: `matrix(1,0,0,-1,0,${f1(Hf)})`, l: `matrix(0,1,1,0,0,0)`, r: `matrix(0,1,-1,0,${f1(Hf)},0)` }; // ფორმის გადატრიალება თითო მხარისთვის
  const bfm = { t: `matrix(1,0,0,-1,0,${f1(Hf)})`, b: "", l: `matrix(0,1,-1,0,${f1(Hf)},0)`, r: `matrix(0,1,1,0,0,0)` }; // უკანა მხარე (სარკისებრად)
  const hinge = { t: [W / 2, Hf], b: [W / 2, 0], l: [Hf, W / 2], r: [0, W / 2] };
  const box = { t: [W, Hf, 0, 0, "50% 0"], b: [W, Hf, 0, W - Hf, "50% 100%"], l: [Hf, W, 0, 0, "0 50%"], r: [Hf, W, W - Hf, 0, "100% 50%"] };
  const flap = k => { const [w, h, l, tp, o] = box[k], [hx, hy] = hinge[k], back = k === "t" || k === "b" ? "rotateX(180deg)" : "rotateY(180deg)";
    return `<div class="pt b-${k}" style="left:${f1(l)}px;top:${f1(tp)}px;width:${f1(w)}px;height:${f1(h)}px;transform-origin:${o}">
      <div class="face bf" style="width:${f1(w)}px;height:${f1(h)}px">${S(w, h, `<g transform="${tfm[k]}"><path d="${top}" fill="#7A3A45" opacity=".22" filter="url(#kb3)" transform="translate(0,3)"/><path d="${top}" fill="url(#b3p)"/><path d="${top}" fill="url(#b3sh)"/>
        <path d="${top}" fill="none" stroke="url(#kgold)" stroke-width="1"/><path d="${top}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1" transform="translate(${f1(W * .05)},2) scale(.9)"/><path class="dk" d="${top}" fill="#5A2A33" opacity="0"/></g>`)}</div>
      <div class="face bb" style="width:${f1(w)}px;height:${f1(h)}px;transform:${back}">${S(w, h, `<g transform="${bfm[k]}"><path d="${top}" fill="url(#b3p)"/><path d="${top}" fill="url(#b3l)" transform="translate(${f1(W * .06)},0) scale(.88)"/><path class="dk" d="${top}" fill="#5A2A33" opacity=".45"/></g>`)}</div></div>`; };
  const sr = W * .15, flower = (() => { let f = `<g transform="translate(0,${f1(-sr * .08)})"><path d="M0,${f1(sr * .15)}Q${f1(sr * .1)},${f1(sr * .5)} ${f1(-sr * .05)},${f1(sr * .78)}" stroke="#7E9470" stroke-width="1.1" fill="none"/>
      <path d="M${f1(-sr * .02)},${f1(sr * .5)}C${f1(sr * .2)},${f1(sr * .35)} ${f1(sr * .38)},${f1(sr * .42)} ${f1(sr * .42)},${f1(sr * .5)}C${f1(sr * .3)},${f1(sr * .6)} ${f1(sr * .12)},${f1(sr * .58)} ${f1(-sr * .02)},${f1(sr * .5)}Z" fill="#A3B893"/>`;
    for (let i = 0; i < 6; i++) f += `<g transform="rotate(${i * 60 + 10})">${K.petal(sr * .36, i % 2 ? "b3pt" : "b3pt2")}</g>`; return f + `<circle r="${f1(sr * .1)}" fill="#E2B566"/><circle r="${f1(sr * .05)}" fill="#B9853A"/></g>`; })();
  env.innerHTML = `<div class="pt b-base">${S(W, W, `<rect width="${W}" height="${W}" fill="url(#b3l)"/><rect width="${W}" height="${W}" fill="url(#b3p)" opacity=".25"/><rect width="${W}" height="${W}" fill="none" stroke="rgba(150,80,90,.25)" stroke-width="2"/>`)}</div>
  <div class="pt b-card" style="width:${f1(W * .86)}px;height:${f1(W * .86)}px;left:${f1(W * .07)}px;top:${f1(W * .07)}px">${x.cardFace()}</div>
  ${flap("l")}${flap("b")}${flap("r")}${flap("t")}
  <div class="pt b-st" style="left:${f1(W / 2 - sr)}px;top:${f1(W / 2 - sr)}px;width:${f1(sr * 2)}px;height:${f1(sr * 2)}px;transform-origin:50% 0">${S(sr * 2, sr * 2, `<g transform="translate(${f1(sr)},${f1(sr)})" filter="url(#ksh)"><circle r="${f1(sr)}" fill="url(#b3vel)"/>
     <circle r="${f1(sr * .9)}" fill="none" stroke="url(#kgold)" stroke-width=".8"/>${flower}</g>`)}</div>`;
  const q = s => env.querySelector(s), qa = s => [...env.querySelectorAll(s)];
  P = { env, base: q(".b-base"), card: q(".b-card"), st: q(".b-st"), f: ["t", "r", "b", "l"].map(k => q(".b-" + k)), dk: ["t", "r", "b", "l"].map(k => [...q(".b-" + k).querySelectorAll(".dk")]), faces: qa(".face") };
  P.f.forEach((e, i) => e.style.transform = `translateZ(${5 - i}px)`); P.st.style.transform = "translateZ(7px)";
  frame(-1, 0, x);
}

function frame(T, g, x){
  const t = Math.max(T, 0), idle = T < 0, settle = idle ? 0 : E.io(seg(t, 0, 2.4)), bob = Math.sin(g * 1.15);
  const rx = mix(24, 12, settle), rz = mix(7 + bob * .8, 0, settle), press = idle ? 0 : Math.sin(Math.PI * seg(t, 0, .3)), back = E.io(seg(t, .8, 2.2)) * 120;
  P.env.style.transform = `translate3d(0,${f1(bob * 4 * (1 - settle))}px,${f1(-press * 12 - back)}px) rotateX(${f1(rx)}deg) rotateZ(${f1(rz)}deg)`;
  const k = E.io(seg(t, .25, 1.25));
  P.st.style.transform = `translate3d(${f1(k * W * .55)}px,${f1(-k * W * 1.1)}px,${f1(7 + k * 260)}px) rotateX(${f1(70 * E.out(seg(t, .25, .7)))}deg) rotateZ(${f1(150 * k)}deg) scale(${(1 + .15 * k).toFixed(3)})`;
  P.st.style.opacity = String(1 - seg(t, .95, 1.25));
  const sign = [1, 1, -1, -1], axis = ["X", "Y", "X", "Y"];
  OPEN.forEach(([a, b], i) => { const o = seg(t, a, b), ang = 152 * E.back(o), z = 5 - i;
    P.f[i].style.transform = `translateZ(${z}px) rotate${axis[i]}(${f1(sign[i] * ang)}deg)`;
    P.dk[i][0].setAttribute("opacity", f1(.32 * seg(ang, 0, 90))); P.dk[i][1].setAttribute("opacity", f1(.45 * (1 - seg(ang, 90, 152)) + .03)); });
  if (!idle && !fired.p && t > 1.95){ fired.p = 1; const r = P.card.getBoundingClientRect(), X = r.left + r.width / 2, Y = r.top + r.height / 2;
    x.fx.burst(X, Y, 30, { t: "petal", cols: ["#F4B9C2", "#EFA3B1", "#F8D0D6", "#E58FA0"], speed: 260, grav: 140, life: 3.2, s: 8, w: r.width * .4, h: r.height * .4 }); x.fx.burst(X, Y, 5, { t: "glint", col: "#FFFFFF", speed: 40, grav: 0, life: 1, s: 4.5, w: r.width * .6, h: r.height * .5 }); }
  const rise = E.io(seg(t, 2.65, 3.85)), fly = E.in(seg(t, 3.9, 5.05));
  P.card.style.transform = `translate3d(0,0,${f1(2 + rise * 210 + fly * 620)}px) rotateX(${f1(-rx * rise)}deg) rotateZ(${f1(-rz * rise)}deg) scale(${(1 + .08 * rise + .2 * fly).toFixed(3)})`;
  P.card.style.setProperty("--shx", f1(mix(-150, 260, seg(t, 2.6, 4.2))) + "%");
  const fade = String(1 - seg(t, 3.3, 4.15)); P.base.style.opacity = fade; P.faces.forEach(e => e.style.opacity = fade);
}

function props(x){
  const { vw, vh } = x, R = K.rng(31);
  K.defs(`${K.lg("b3q1", 0, 0, 1, 1, [[0, "#FAD3DA"], [.6, "#EC9DAD"], [1, "#D07085"]])}${K.lg("b3q2", 0, 0, 1, 1, [[0, "#FFFFFF"], [1, "#F3C9CF"]])}`, "props");
  let o = ""; for (let i = 0; i < 16; i++){ const a = R() * 6.28, rr = .44 + R() * .16, X = vw / 2 + Math.cos(a) * vw * rr * 1.05, Y = vh * .54 + Math.sin(a) * vh * rr * .7, r = 9 + R() * 9;
    o += `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px;filter:drop-shadow(1px 4px 3px rgba(120,60,70,.3))" width="1" height="1"><g transform="rotate(${f1(R() * 360)}) scale(1,${f1(.7 + R() * .3)})">${K.petal(r, R() < .6 ? "b3q1" : "b3q2")}</g></svg>`; }
  for (let i = 0; i < 22; i++){ const X = R() * vw, Y = R() * vh; if (Math.abs(X - vw / 2) < vw * .36 && Math.abs(Y - vh * .54) < vw * .4) continue; o += `<svg class="prop" style="left:${f1(X)}px;top:${f1(Y)}px;filter:none" width="1" height="1"><circle r="${f1(1.5 + R() * 2)}" fill="#fff" opacity=".85"/></svg>`; }
  return o;
}
return { hint: "შეეხეთ ყვავილს", aspect: 1, maxW: .72, maxH: .39, sy: "54%", dur: 5.05, build, frame, props };
})();
