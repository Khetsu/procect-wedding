/* ამბავი · პრემიუმ კონვერტები — ხელსაწყოები: ქაღალდისა და მაგიდის ტექსტურები, სარჩულის ნიმუშები, SVG ორნამენტები, ნაწილაკები, ანიმაციის ფუნქციები. */
window.K = (function(){
"use strict";
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, seg = (t, a, b) => clamp((t - a) / (b - a)), mix = (a, b, k) => a + (b - a) * k;
const ease = {
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out: t => 1 - Math.pow(1 - t, 3), out5: t => 1 - Math.pow(1 - t, 5), in: t => t * t * t, in2: t => t * t,
  back: t => { const c = 1.5; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  sine: t => .5 - .5 * Math.cos(Math.PI * t),
  spring: t => t <= 0 ? 0 : 1 - Math.exp(-5.5 * t) * Math.cos(8.5 * t)
};
function rng(s){ let a = (s * 2654435761) >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hex = h => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
const DPR = Math.min(window.devicePixelRatio || 1, 2.5), f1 = x => +x.toFixed(1);

/* ---------- ხმაური ---------- */
function noise(seed){
  const R = rng(seed), P = new Float32Array(65536); for (let i = 0; i < 65536; i++) P[i] = R();
  const n = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), X = xi & 255, Y = yi & 255, X1 = (X + 1) & 255, Y1 = (Y + 1) & 255;
    const a = P[Y * 256 + X], b = P[Y * 256 + X1], c = P[Y1 * 256 + X], d = P[Y1 * 256 + X1]; return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
  const fbm = (x, y, o = 5) => { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++){ s += a * n(x * f, y * f); f *= 2.03; a *= .5; } return s / (1 - Math.pow(.5, o)); };
  return { n, fbm };
}

/* ---------- ქაღალდი (გამეორებადი ტექსტურა) ---------- */
const cache = {}, TS = 320, TILE = f1(TS / DPR);
function paper(base, o = {}){
  const key = "p" + base + JSON.stringify(o); if (cache[key]) return cache[key];
  const S = TS, cv = document.createElement("canvas"); cv.width = cv.height = S; const g = cv.getContext("2d"), R = rng(o.seed || 11);
  g.fillStyle = base; g.fillRect(0, 0, S, S);
  const blob = (x, y, r, col) => { for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]){ const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x + dx - r, y + dy - r, 2 * r, 2 * r); } };
  const mt = o.mottle == null ? .05 : o.mottle; for (let i = 0; i < 26; i++) blob(R() * S, R() * S, S * (.08 + R() * .22), R() < .5 ? `rgba(255,255,255,${mt * R()})` : `rgba(0,0,0,${mt * R()})`);
  const id = g.getImageData(0, 0, S, S), d = id.data, gn = o.grain == null ? 9 : o.grain; for (let i = 0; i < d.length; i += 4){ const k = (R() - .5) * gn; d[i] += k; d[i + 1] += k; d[i + 2] += k; } g.putImageData(id, 0, 0);
  g.lineCap = "round"; for (let i = 0, n = o.fiber == null ? 70 : o.fiber; i < n; i++){ const x = R() * S, y = R() * S, a = R() * 6.283, l = 3 + R() * 12; g.lineWidth = .4 + R() * .5;
    g.strokeStyle = R() < .5 ? `rgba(255,255,255,${.05 + R() * .08})` : `rgba(0,0,0,${.03 + R() * .05})`; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + .6) * l * .6, y + Math.sin(a + .6) * l * .6, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  for (let i = 0; i < (o.fleck || 0); i++){ g.fillStyle = o.fleckCol || "rgba(255,226,160,.55)"; g.beginPath(); g.arc(R() * S, R() * S, .4 + R() * 1.1, 0, 6.283); g.fill(); }
  return cache[key] = cv.toDataURL("image/jpeg", .92);
}

/* ---------- მაგიდა (ფონი, „ფოკუსს გარეთ“) ---------- */
function table(o){
  const key = "t" + JSON.stringify(o); if (cache[key]) return cache[key];
  const w = 300, h = 600, cv = document.createElement("canvas"); cv.width = w; cv.height = h; const g = cv.getContext("2d"), im = g.createImageData(w, h), d = im.data, N = noise(o.seed || 5);
  const c1 = hex(o.c1), c2 = hex(o.c2), c3 = hex(o.c3 || o.c2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){ const u = x / w, v = y / h * 2; let k = 0, k2 = 0;
    if (o.kind === "walnut"){ const q = N.fbm(u * 1.3, v * 5, 4) * 5, gr = .5 + .5 * Math.sin(v * 30 + q + N.fbm(u * 3, v * 10, 3) * 2); k = .2 + .5 * Math.pow(gr, 1.7) + .3 * N.fbm(u * 8, v * 30, 3); if (Math.abs((v * 1.35 + .2) % 1 - .5) > .496) k *= .5; }
    else if (o.kind === "marble"){ const a = Math.abs(Math.sin(u * 3 + v * 2.2 + N.fbm(u * 2.5, v * 2.5) * 6)), b = Math.abs(Math.sin(u * 7 - v * 4 + N.fbm(u * 5 + 3, v * 5) * 5)); k = .12 + .25 * N.fbm(u * 3, v * 3, 4); k2 = Math.pow(1 - a, 34) * .9 + Math.pow(1 - b, 60) * .35; }
    else if (o.kind === "linen"){ k = .2 + .25 * N.fbm(u * 50, v * 2, 3) + .25 * N.fbm(u * 2, v * 50, 3) + .3 * N.fbm(u * 3, v * 3, 4); }
    else if (o.kind === "velvet"){ const f = N.fbm(u * 1.5, v * 1.2, 5); k = .1 + .8 * Math.pow(f, 1.9) + .1 * N.fbm(u * 24, v * 24, 2); }
    else { k = .3 + .3 * N.fbm(u * 5, v * 5, 4) + .15 * N.fbm(u * 40, v * 40, 2); }
    k = clamp(k); const i = (y * w + x) * 4; for (let c = 0; c < 3; c++) d[i + c] = c1[c] + (c2[c] - c1[c]) * k + c3[c] * k2; d[i + 3] = 255; }
  g.putImageData(im, 0, 0); return cache[key] = cv.toDataURL("image/jpeg", .9);
}

/* ---------- SVG: საერთო defs ---------- */
let defsEl = null;
function defs(s, key){ if (!defsEl){ const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("width", 0); sv.setAttribute("height", 0); sv.setAttribute("aria-hidden", "true"); sv.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    sv.innerHTML = `<defs><filter id="kb1"><feGaussianBlur stdDeviation="1.2"/></filter><filter id="kb3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter><filter id="kb6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="ksh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#000" flood-opacity=".38"/></filter><filter id="ksh2" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="2" dy="7" stdDeviation="5" flood-color="#000" flood-opacity=".45"/></filter></defs>`;
    document.body.prepend(sv); defsEl = sv.firstChild; }
  if (key){ const o = defsEl.querySelector(`[data-k="${key}"]`); if (o) o.remove(); s = `<g data-k="${key}">${s}</g>`; }
  defsEl.insertAdjacentHTML("beforeend", s); }
const stops = st => st.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
const lg = (id, x1, y1, x2, y2, st) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(st)}</linearGradient>`;
const rg = (id, cx, cy, r, fx, fy, st) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${stops(st)}</radialGradient>`;
const pat = (id, url, t = TILE) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${t}" height="${t}"><image href="${url}" width="${t}" height="${t}" preserveAspectRatio="none"/></pattern>`;
const GOLD = [[0, "#8A672B"], [.28, "#E6CB89"], [.48, "#FFF3CF"], [.66, "#C59E52"], [.85, "#EED9A0"], [1, "#8A672B"]];
const ROSE = [[0, "#9C5A5E"], [.3, "#E9B7AE"], [.5, "#FFE9E3"], [.7, "#C98B86"], [1, "#9C5A5E"]];

/* ---------- სარჩულის ნიმუშები ---------- */
const star4 = (x, y, r, c, op = 1) => `<path d="M${f1(x)},${f1(y - r * 2)}Q${f1(x + r * .3)},${f1(y - r * .3)} ${f1(x + r * 2)},${f1(y)}Q${f1(x + r * .3)},${f1(y + r * .3)} ${f1(x)},${f1(y + r * 2)}Q${f1(x - r * .3)},${f1(y + r * .3)} ${f1(x - r * 2)},${f1(y)}Q${f1(x - r * .3)},${f1(y - r * .3)} ${f1(x)},${f1(y - r * 2)}Z" fill="${c}" opacity="${op}"/>`;
const LINERS = {
  damask(o){ const m = (x, y) => `<g transform="translate(${x},${y})" fill="${o.fg}"><path d="M0,-20C6,-12 7,-4 0,4C-7,-4 -6,-12 0,-20Z"/><path d="M0,6C4,10 4,15 0,20C-4,15 -4,10 0,6Z"/><circle cy="-24" r="1.6"/>
      <g fill="none" stroke="${o.fg}" stroke-width="1.2"><path d="M0,4C9,6 13,-2 9,-7C7,-10 3,-8 4,-5"/><path d="M0,4C-9,6 -13,-2 -9,-7C-7,-10 -3,-8 -4,-5"/><path d="M-13,13Q-6,10 -3,16M13,13Q6,10 3,16" stroke-width=".9"/></g></g>`;
    return { w: 56, h: 72, body: `<rect width="56" height="72" fill="${o.bg}"/><g opacity=".88">${m(28, 36)}${m(0, 0)}${m(56, 0)}${m(0, 72)}${m(56, 72)}</g>` }; },
  deco(o){ const fan = (x, y) => `<g transform="translate(${x},${y})" fill="none" stroke="${o.fg}" stroke-width=".8"><path d="M-20,0A20,20 0 0 1 20,0"/><path d="M-14,0A14,14 0 0 1 14,0"/><path d="M-8,0A8,8 0 0 1 8,0"/>${[-60, -30, 0, 30, 60].map(a => `<path d="M0,0L${f1(20 * Math.sin(a * Math.PI / 180))},${f1(-20 * Math.cos(a * Math.PI / 180))}" stroke-width=".45"/>`).join("")}</g>`;
    return { w: 40, h: 20, body: `<rect width="40" height="20" fill="${o.bg}"/>${fan(20, 20)}${fan(0, 10)}${fan(40, 10)}` }; },
  floral(o){ const R = rng(o.seed || 9); let b = `<rect width="100" height="100" fill="${o.bg}"/>`;
    const fl = (x, y, r, c) => { let s = `<g transform="translate(${x},${y}) rotate(${f1(R() * 72)})">`; for (let i = 0; i < 5; i++) s += `<ellipse cy="${f1(-r * .55)}" rx="${f1(r * .42)}" ry="${f1(r * .62)}" fill="${c}" opacity=".85" transform="rotate(${i * 72})"/>`; return s + `<circle r="${f1(r * .22)}" fill="${o.mid}"/></g>`; };
    const lf = (x, y, a) => `<path d="M0,0C4,-5 10,-5 14,0C10,5 4,5 0,0Z" fill="${o.leaf}" opacity=".75" transform="translate(${f1(x)},${f1(y)}) rotate(${f1(a)})"/>`;
    [[24, 26, 9, o.fg], [72, 60, 11, o.fg2], [36, 82, 7, o.fg2], [84, 16, 6, o.fg]].forEach(([x, y, r, c]) => { b += lf(x + r * .5, y + r * .3, R() * 360) + lf(x - r * .7, y + r * .1, R() * 360) + fl(x, y, r, c); });
    for (let i = 0; i < 7; i++) b += `<circle cx="${f1(R() * 100)}" cy="${f1(R() * 100)}" r="1.1" fill="${o.mid}" opacity=".55"/>`; return { w: 100, h: 100, body: b }; },
  stars(o){ const R = rng(o.seed || 21); let b = `<rect width="140" height="140" fill="${o.bg}"/>`; const p = [];
    for (let i = 0; i < 9; i++){ const x = 12 + R() * 116, y = 12 + R() * 116; p.push(`${f1(x)},${f1(y)}`); b += star4(x, y, 1 + R() * 2, o.fg); }
    b += `<path d="M${p[0]}L${p[1]}L${p[2]}L${p[3]}M${p[4]}L${p[5]}L${p[6]}" stroke="${o.fg}" stroke-width=".5" stroke-dasharray="2 2" opacity=".55" fill="none"/>`;
    for (let i = 0; i < 34; i++) b += `<circle cx="${f1(R() * 140)}" cy="${f1(R() * 140)}" r="${f1(.3 + R() * .5)}" fill="${o.fg}" opacity="${f1(.3 + R() * .5)}"/>`; return { w: 140, h: 140, body: b }; },
  chevron(o){ return { w: 24, h: 24, body: `<rect width="24" height="24" fill="${o.bg}"/><path d="M0,12L12,2L24,12M0,24L12,14L24,24" fill="none" stroke="${o.fg}" stroke-width=".7"/><circle cx="12" cy="20" r=".8" fill="${o.fg}"/>` }; }
};
const liner = (id, kind, o) => { const s = LINERS[kind](o); return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${s.w}" height="${s.h}" patternTransform="scale(${o.scale || 1}) rotate(${o.rot || 0})">${s.body}</pattern>`; };

/* ---------- ორნამენტები ---------- */
function blob(cx, cy, r, seed = 1, amp = .06, n = 44){ const R = rng(seed), ph = [R() * 6, R() * 6, R() * 6], P = [];
  for (let i = 0; i < n; i++){ const a = i / n * 6.2832, k = 1 + amp * (Math.sin(a * 3 + ph[0]) * .55 + Math.sin(a * 5 + ph[1]) * .35 + Math.sin(a * 11 + ph[2]) * .22 + (R() - .5) * .3); P.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]); }
  const mid = (p, q) => `${f1((p[0] + q[0]) / 2)},${f1((p[1] + q[1]) / 2)}`; let d = `M${mid(P[n - 1], P[0])}`; for (let i = 0; i < n; i++) d += `Q${f1(P[i][0])},${f1(P[i][1])} ${mid(P[i], P[(i + 1) % n])}`; return d + "Z"; }
function wreath(cx, cy, r, col, n = 9, w = 1){ let s = `<g fill="${col}" stroke="${col}">`;
  for (const side of [-1, 1]){ s += `<path d="M${f1(cx + side * r * Math.cos(1.35))},${f1(cy + r * Math.sin(1.35))}A${r},${r} 0 0 ${side > 0 ? 0 : 1} ${f1(cx + side * r * Math.cos(-1.1))},${f1(cy + r * Math.sin(-1.1))}" fill="none" stroke-width="${.8 * w}"/>`;
    for (let i = 0; i < n; i++){ const a = 1.3 - i * (2.35 / n), x = cx + side * r * Math.cos(a), y = cy + r * Math.sin(a), tang = Math.atan2(Math.cos(a), side * Math.sin(a)) * 180 / Math.PI, out = i % 2 ? 1 : -1, len = r * .2 * (1 - i / n * .35);
      s += `<ellipse cx="${f1(x + out * side * Math.cos(a) * len * .35)}" cy="${f1(y + out * Math.sin(a) * len * .35)}" rx="${f1(len * .5)}" ry="${f1(len * .19)}" stroke="none" transform="rotate(${f1(tang + out * 35 * side)} ${f1(x + out * side * Math.cos(a) * len * .35)} ${f1(y + out * Math.sin(a) * len * .35)})"/>`; } }
  return s + "</g>"; }
function crest(mono, o = {}){ const fill = o.fill || "url(#kgold)", S = 120; return `<svg viewBox="0 0 ${S} ${S}" class="crest-svg">${wreath(60, 62, 44, fill, 10)}<circle cx="60" cy="60" r="31" fill="none" stroke="${fill}" stroke-width=".9"/><circle cx="60" cy="60" r="28" fill="none" stroke="${fill}" stroke-width=".4"/>
  <text x="60" y="${o.dy || 71}" text-anchor="middle" font-family="${o.font}" font-size="${o.size || 30}" fill="${fill}">${mono}</text></svg>`; }
const corner = col => `<svg viewBox="0 0 60 60"><g fill="none" stroke="${col}" stroke-width="1"><path d="M4,56V14Q4,4 14,4H56"/><path d="M9,56V19Q9,9 19,9H56" stroke-width=".5"/><path d="M14,30Q14,14 30,14" stroke-width=".7"/><path d="M4,4Q20,8 22,22Q8,20 4,4Z" fill="${col}" stroke="none" opacity=".9"/></g><circle cx="26" cy="26" r="1.6" fill="${col}"/></svg>`;
const orn = col => `<svg viewBox="0 0 220 20" class="orn"><g fill="none" stroke="${col}" stroke-width=".9"><path d="M4,10H84"/><path d="M136,10H216"/><path d="M84,10C94,0 102,0 110,10C118,20 126,20 136,10"/><path d="M84,10C94,20 102,20 110,10C118,0 126,0 136,10"/></g><path d="M110,5L115,10L110,15L105,10Z" fill="${col}"/><circle cx="4" cy="10" r="1.6" fill="${col}"/><circle cx="216" cy="10" r="1.6" fill="${col}"/></svg>`;
const ICON = {
  ring: `<circle cx="9" cy="14.5" r="5.5"/><circle cx="15" cy="14.5" r="5.5"/><path d="M15 9l-1.6-2.4h3.2z"/>`,
  church: `<path d="M12 2v4M10 4h4M6.5 22V11.5L12 7l5.5 4.5V22M10 22v-4.5a2 2 0 0 1 4 0V22M3.5 22h17"/>`,
  glass: `<path d="M5 3h6c0 4-1.3 6.5-3 6.5S5 7 5 3zM8 9.5V19M5.5 19h5M13 3h6c0 4-1.3 6.5-3 6.5S13 7 13 3zM16 9.5V19M13.5 19h5"/>`,
  dinner: `<path d="M6 3v6.5a2 2 0 0 0 4 0V3M8 3v18M17 3c-2.2 2-2.2 7.5 0 9.5V21"/>`,
  music: `<path d="M9 18V5.5L20 3.5V16"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="17.5" cy="16" r="2.6"/>`,
  cake: `<path d="M4 21h16M5.5 21v-7.5h13V21M5.5 16.5c2.2 1.4 4.4 1.4 6.5 0s4.3-1.4 6.5 0M12 13.5V10M12 7.6c.9-.9.9-1.9 0-2.9-.9 1-.9 2 0 2.9z"/>`,
  camera: `<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.6"/><path d="M8.5 7l1.5-2.5h4L15.5 7"/>`,
  star: `<path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.5 6.6 19.4l1.2-6L3.4 9.3l6-.7z"/>`,
  heart: `<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>`
};
function map(col, seed = 3){ const R = rng(seed); let s = `<svg viewBox="0 0 300 180" class="map-svg" preserveAspectRatio="xMidYMid slice"><rect width="300" height="180" fill="${col.base}"/>`;
  s += `<path d="${blob(250, 40, 46, seed + 1, .2)}" fill="${col.park}"/><path d="${blob(40, 150, 34, seed + 2, .2)}" fill="${col.park}"/>`;
  s += `<path d="M-10,${f1(120 + R() * 20)}C80,${f1(90 + R() * 30)} 160,${f1(170 + R() * 20)} 320,${f1(120 + R() * 30)}" fill="none" stroke="${col.water}" stroke-width="12" stroke-linecap="round"/>`;
  for (let i = 0; i < 26; i++){ const x = R() * 300, y = R() * 180; s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(8 + R() * 14)}" height="${f1(6 + R() * 10)}" rx="1.5" fill="${col.block}" opacity=".7"/>`; }
  const road = (d, w) => `<path d="${d}" fill="none" stroke="${col.line}" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col.road}" stroke-width="${w}" stroke-linecap="round"/>`;
  s += road(`M-10,70C70,${f1(60 + R() * 20)} 200,${f1(80 + R() * 20)} 310,60`, 7) + road(`M${f1(100 + R() * 30)},-10C120,60 ${f1(140 + R() * 20)},120 ${f1(120 + R() * 40)},190`, 6) + road(`M190,-10C200,50 230,110 270,190`, 4) + road(`M-10,30C60,40 90,20 150,30`, 3);
  return s + `<g transform="translate(150,82)"><ellipse cy="22" rx="9" ry="3" fill="#000" opacity=".25"/><path d="M0,22C-4,12 -13,4 -13,-6A13,13 0 0 1 13,-6C13,4 4,12 0,22Z" fill="${col.pin}" stroke="${col.line}" stroke-width=".8"/><circle cy="-6" r="4.6" fill="${col.base}"/></g></svg>`; }
function sprig(L, o = {}){ const R = rng(o.seed || 2), id = "sg" + (o.seed || 2), bend = o.bend || 1, P = t => [Math.sin(t * 2.4) * L * .07 * bend, -t * L];
  let s = `<defs>${rg(id, .4, .35, .7, .35, .3, [[0, o.c1 || "#B8C9BC"], [.6, o.c2 || "#7E9A8C"], [1, o.c3 || "#56705F"]])}</defs>`, st = "M0,0";
  for (let i = 1; i <= 20; i++){ const [x, y] = P(i / 20); st += `L${f1(x)},${f1(y)}`; } s += `<path d="${st}" fill="none" stroke="${o.stem || "#6F7F64"}" stroke-width="${f1(L * .012 + .6)}" stroke-linecap="round"/>`;
  const n = o.n || 11; for (let i = 1; i <= n; i++){ const t = i / (n + .5), [x, y] = P(t), sd = i % 2 ? 1 : -1, r = L * (o.leaf || .075) * (1 - t * .45) * (.85 + R() * .3), cx = x + sd * r * .9, cy = y + r * .15;
    s += `<g transform="rotate(${f1(sd * (20 + R() * 25))} ${f1(cx)} ${f1(cy)})"><ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r)}" ry="${f1(r * .86)}" fill="url(#${id})"/><path d="M${f1(x)},${f1(y)}L${f1(cx + sd * r * .55)},${f1(cy - r * .1)}" stroke="${o.vein || "rgba(255,255,255,.35)"}" stroke-width=".6"/></g>`; }
  return s; }
const petal = (r, id) => `<path d="M0,0C${f1(r * .7)},${f1(-r * .15)} ${f1(r * .95)},${f1(-r * .95)} 0,${f1(-r * 1.25)}C${f1(-r * .95)},${f1(-r * .95)} ${f1(-r * .7)},${f1(-r * .15)} 0,0Z" fill="url(#${id})"/>`;

/* ---------- ნაწილაკები (2D canvas) ---------- */
function fx(cv, o){
  const g = cv.getContext("2d"), R = rng(o.seed || 3), P = [], dpr = Math.min(window.devicePixelRatio || 1, 2); let W = 0, H = 0, acc = 0, rate = o.rate || 0, stars = [];
  const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); stars = []; if (o.stars) for (let i = 0; i < o.stars; i++) stars.push({ x: R() * W, y: R() * H, r: .5 + R() * 1.3, p: R() * 6.28, s: .6 + R() * 1.6 }); };
  resize(); addEventListener("resize", resize);
  const sprite = (col, soft) => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, col); gr.addColorStop(soft ? .25 : .12, col); gr.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c; };
  const SP = { mote: sprite(o.mote || "rgba(255,226,160,1)", 1), hot: sprite("rgba(255,250,235,1)") }, spc = {}, spr = c => spc[c] || (spc[c] = sprite(c, 1));
  function add(p){ P.push(Object.assign({ age: 0, life: 3, vx: 0, vy: 0, rot: R() * 6.28, vr: (R() - .5) * 4, fl: R() * 6.28, vf: 2 + R() * 4, s: 4, a: 1 }, p)); }
  function ambient(){ const k = o.kind;
    if (k === "petals") add({ t: "petal", x: R() * W, y: -20, vx: (R() - .3) * 30, vy: 26 + R() * 30, life: 14, s: 7 + R() * 7, col: o.cols[(R() * o.cols.length) | 0], a: .9 });
    else if (k === "flecks") add({ t: "fleck", x: R() * W, y: -20, vx: (R() - .5) * 14, vy: 14 + R() * 18, life: 20, s: 3 + R() * 5, a: .9 });
    else add({ t: "mote", x: R() * W, y: H * (.2 + R() * .9), vx: (R() - .5) * 8, vy: -6 - R() * 12, life: 6 + R() * 5, s: 2 + R() * 5, a: .55 + R() * .4 }); }
  function burst(x, y, n, b = {}){ for (let i = 0; i < n; i++){ const a = (b.dir == null ? R() * 6.28 : b.dir + (R() - .5) * (b.spread || 1.2)), sp = (b.speed || 140) * (.35 + R() * .85);
    add({ t: b.t || "spark", x: x + (R() - .5) * (b.w || 0), y: y + (R() - .5) * (b.h || 0), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: (b.life || 1.1) * (.6 + R() * .7), s: (b.s || 3) * (.6 + R() * .8), col: b.cols ? b.cols[(R() * b.cols.length) | 0] : b.col, grav: b.grav == null ? 120 : b.grav, a: 1 }); } }
  function step(dt, tm){ g.clearRect(0, 0, W, H); acc += dt * rate; while (acc > 1){ acc -= 1; ambient(); }
    for (const s of stars){ const tw = .35 + .65 * Math.pow(.5 + .5 * Math.sin(tm * s.s + s.p), 3); g.globalAlpha = tw * (o.starA || .8); g.drawImage(SP.hot, s.x - s.r * 3, s.y - s.r * 3, s.r * 6, s.r * 6); }
    for (let i = P.length - 1; i >= 0; i--){ const p = P[i]; p.age += dt; if (p.age > p.life || p.y > H + 40){ P.splice(i, 1); continue; } const k = p.age / p.life, fade = Math.min(1, p.age * 4) * (1 - Math.pow(k, 3)) * p.a;
      p.vy += (p.grav || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.fl += p.vf * dt;
      if (p.t === "petal"){ p.x += Math.sin(p.fl * .5) * 18 * dt; g.save(); g.translate(p.x, p.y); g.rotate(p.rot * .3); g.scale(Math.cos(p.fl * .6), 1); g.globalAlpha = fade; g.fillStyle = p.col; g.beginPath(); const r = p.s;
        g.moveTo(0, r); g.bezierCurveTo(r * .9, r * .6, r * .9, -r * .6, 0, -r); g.bezierCurveTo(-r * .9, -r * .6, -r * .9, r * .6, 0, r); g.fill(); g.globalAlpha = fade * .35; g.fillStyle = "#fff"; g.beginPath(); g.ellipse(-r * .2, -r * .2, r * .2, r * .5, 0, 0, 6.28); g.fill(); g.restore(); }
      else if (p.t === "fleck" || p.t === "shard"){ g.save(); g.translate(p.x, p.y); g.rotate(p.rot); const fl = Math.cos(p.fl); g.scale(1, fl); g.globalAlpha = fade;
        g.fillStyle = p.t === "shard" ? p.col : (fl > 0 ? `hsl(43,${70 + fl * 20}%,${50 + fl * 30}%)` : "#8A6A2C"); const r = p.s; g.beginPath(); g.moveTo(-r, -r * .4); g.lineTo(r * .3, -r); g.lineTo(r, r * .2); g.lineTo(-r * .2, r * .8); g.closePath(); g.fill(); g.restore(); }
      else if (p.t === "glint"){ const r = p.s * (1 + k * 2) * Math.sin(Math.PI * k); g.globalAlpha = Math.sin(Math.PI * k); g.globalCompositeOperation = "lighter"; g.fillStyle = p.col || "#FFF6DA";
        g.beginPath(); g.moveTo(p.x, p.y - r * 3); g.quadraticCurveTo(p.x, p.y, p.x + r * 3, p.y); g.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 3); g.quadraticCurveTo(p.x, p.y, p.x - r * 3, p.y); g.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 3); g.fill();
        g.drawImage(SP.hot, p.x - r * 2, p.y - r * 2, r * 4, r * 4); g.globalCompositeOperation = "source-over"; }
      else if (p.t === "spark"){ g.globalCompositeOperation = "lighter"; g.globalAlpha = fade; g.strokeStyle = p.col || "#FFE6A8"; g.lineWidth = p.s * .45; g.lineCap = "round"; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * .035, p.y - p.vy * .035); g.stroke();
        g.drawImage(SP.mote, p.x - p.s * 2, p.y - p.s * 2, p.s * 4, p.s * 4); g.globalCompositeOperation = "source-over"; }
      else { p.x += Math.sin(p.fl * .4) * 6 * dt; g.globalAlpha = fade * (.5 + .5 * Math.sin(p.fl)); g.globalCompositeOperation = "lighter"; g.drawImage(p.col ? spr(p.col) : SP.mote, p.x - p.s * 2, p.y - p.s * 2, p.s * 4, p.s * 4); g.globalCompositeOperation = "source-over"; } }
    g.globalAlpha = 1; }
  return { step, burst, add, set(k, v){ if (k === "rate") rate = v; else o[k] = v; } };
}

return { clamp, seg, mix, ease, rng, hex, rgba, DPR, TILE, f1, noise, paper, table, defs, lg, rg, pat, GOLD, ROSE, liner, star4, blob, wreath, crest, corner, orn, ICON, map, sprig, petal, fx };
})();
