/* ამბავი · პრემიუმ დიზაინები — გვერდის ძრავი.
   window.P (config.js) → თავები; ფონი — WebGL2 შეიდერი (#frag, ჩაშენებულია index.html-ში).
   გახსნა: „დააჭირე და გააჩერე“ (რგოლი ივსება ~1 წმ-ში). ჩაწერა: ?auto (თავისით: 0.8–1.8 წმ დაჭერა), დრო — window.__G. */
(function(){
"use strict";
const C = window.P || {}, Q = new URLSearchParams(location.search), AUTO = Q.has("auto"), REC = Q.has("rec"), H = document.documentElement;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
Object.entries(C.theme || {}).forEach(([k, v]) => H.style.setProperty("--" + k, v));
if (AUTO) H.classList.add("auto"); if (REC) H.classList.add("rec");
const MON = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const when = new Date((C.date || "2027-06-12") + "T" + (C.time || "18:00") + ":00"), two = n => String(n).padStart(2, "0");
const dots = `${two(when.getDate())} · ${two(when.getMonth() + 1)} · ${when.getFullYear()}`, both = C.b ? `${C.a} & ${C.b}` : C.a;
const nameBlock = cls => `<p class="${cls}">${esc(C.a)}${C.b ? `<span class="amp">&amp;</span>${esc(C.b)}` : ""}</p>`;
const prog = C.program || [], V = C.venue || {};
document.title = (C.title || both) + " · ამბავი";

/* ---------- page ---------- */
document.body.insertAdjacentHTML("afterbegin", `
<canvas id="gl" aria-hidden="true"></canvas><div class="shade"></div>
<section class="intro" id="intro"><div class="who"><p class="k">${esc(C.introKick || "თქვენ მიიღეთ მოსაწვევი")}</p><h1>${esc(both)}</h1>${C.introScript ? `<p class="s">${esc(C.introScript)}</p>` : ""}</div>
  <div><button class="hold" id="hold" type="button" aria-label="დააჭირეთ და გააჩერეთ"><svg viewBox="0 0 132 132"><circle class="tr" cx="66" cy="66" r="60"/><circle class="fl" id="fill" cx="66" cy="66" r="60"/></svg><span class="core">${C.holdIcon || "✦"}</span></button>
  <p class="hold-l">${esc(C.holdText || "დააჭირეთ და გააჩერეთ")}</p></div></section>
<main class="deck" id="deck">
  <section class="sc hero"><p class="cap rv">${esc(C.kicker)}</p>${nameBlock("nm rv d1")}<p class="date rv d2"><i></i>${dots}<i></i></p><p class="city rv d3">${esc(C.city)}</p><span class="scroll rv d4">ქვემოთ</span></section>
  ${C.story ? `<section class="sc story"><p class="cap rv">${esc(C.storyCap || "ჩვენი ამბავი")}</p><q class="rv d1">${esc(C.story)}</q>${C.sign ? `<p class="sig rv d2">${esc(C.sign)}</p>` : ""}</section>` : ""}
  <section class="sc"><p class="cap rv">${esc(C.cdCap || "დიდ დღემდე")}</p><div class="cd rv d1" id="cd">${["დღე", "სთ", "წთ", "წმ"].map(l => `<div><b>00</b><small>${l}</small></div>`).join("")}</div>
    <p class="hair rv d2"></p><p class="h rv d2" style="font-size:20px">${when.getDate()} ${MON[when.getMonth()]} · ${two(when.getHours())}:${two(when.getMinutes())}</p><a class="ghost rv d3" id="ics" href="#">კალენდარში დამატება</a></section>
  ${prog.length ? `<section class="sc"><p class="cap rv">${esc(C.progCap || "დღის პროგრამა")}</p><div class="prog rv d1">${prog.map((e, i) => `<article class="pc"><span class="n">${two(i + 1)} / ${two(prog.length)}</span><b>${esc(e.time)}</b><h3>${esc(e.title)}</h3>${e.place ? `<p>${esc(e.place)}</p>` : ""}</article>`).join("")}</div><p class="swipe rv d2">← გადაფურცლეთ →</p></section>` : ""}
  ${V.name ? `<section class="sc venue"><p class="cap rv">${esc(C.venueCap || "ადგილი")}</p><p class="vn rv d1">${esc(V.name)}</p>${V.addr ? `<p class="va rv d2">${esc(V.addr)}</p>` : ""}
    <div class="btns rv d3"><a class="solid" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(V.map || V.name)}">რუკაზე ნახვა</a></div></section>` : ""}
  ${(C.palette || []).length ? `<section class="sc"><p class="cap rv">${esc(C.dressCap || "სამოსის ფერები")}</p><div class="sw rv d1">${C.palette.map(c => `<i style="background:${esc(c)}"></i>`).join("")}</div>${C.dressNote ? `<p class="note rv d2">${esc(C.dressNote)}</p>` : ""}</section>` : ""}
  <section class="sc"><p class="cap rv">${esc(C.rsvpCap || "დაგვიდასტურეთ")}</p><form class="form rv d1" id="form" onsubmit="return false">
    <label for="f-n">სახელი და გვარი</label><input id="f-n" autocomplete="name" placeholder="თქვენი სახელი">
    <div class="yn" id="yn"><button type="button" class="on" data-v="1">მოვალ</button><button type="button" data-v="0">ვერ მოვალ</button></div>
    <div class="gs"><span>სტუმრების რაოდენობა</span><button type="button" id="g-">−</button><b id="gn">1</b><button type="button" id="g+">+</button></div>
    <label for="f-w">სურვილი (არასავალდებულო)</label><textarea id="f-w" placeholder="თბილი სიტყვები…"></textarea>
    <a class="solid" id="send" href="#" target="_blank" rel="noopener">გაგზავნა</a></form>${C.rsvpBy ? `<p class="note rv d2">გთხოვთ, დაგვიდასტუროთ ${esc(C.rsvpBy)}</p>` : ""}</section>
  <section class="sc fin"><p class="cap rv">${esc(C.finCap || "გელოდებით")}</p>${nameBlock("nm rv d1")}<p class="date rv d2" style="margin-top:24px;font:500 18px/1 var(--num);letter-spacing:.3em">${dots}</p><p class="brand rv d3">ამბავი</p></section>
</main>
<nav class="rail" id="rail"></nav><button class="mu" id="mu" type="button" aria-label="მუსიკა"><i></i><i></i><i></i></button><div class="toast" id="toast"></div>`);
const $ = id => document.getElementById(id);
const secs = [...document.querySelectorAll(".sc")]; $("rail").innerHTML = secs.map(() => "<i></i>").join(""); const railI = [...$("rail").children];
function toast(s){ const t = $("toast"); t.textContent = s; t.classList.add("on"); clearTimeout(toast.k); toast.k = setTimeout(() => t.classList.remove("on"), 2400); }

/* rsvp */
let yes = true, guests = 1;
$("yn").onclick = e => { const b = e.target.closest("button"); if (!b) return; yes = b.dataset.v === "1"; [...$("yn").children].forEach(x => x.classList.toggle("on", x === b)); $("form").classList.toggle("no", !yes); };
$("g-").onclick = () => { guests = Math.max(1, guests - 1); $("gn").textContent = guests; }; $("g+").onclick = () => { guests = Math.min(12, guests + 1); $("gn").textContent = guests; };
$("send").addEventListener("click", function(e){ const n = $("f-n").value.trim(); if (!n){ e.preventDefault(); $("f-n").focus(); toast("ჯერ სახელი ჩაწერეთ ✍️"); return; }
  const w = $("f-w").value.trim(), msg = (yes ? `✨ ${n} — სიამოვნებით მოვალ! სტუმრები: ${guests}` : `${n} — სამწუხაროდ, ვერ მოვალ 🤍`) + (w ? `\n💌 ${w}` : "") + `\n${both} · ${dots}`, ph = String(C.phone || "").replace(/\D/g, "");
  if (ph) this.href = "https://wa.me/" + ph + "?text=" + encodeURIComponent(msg); else { e.preventDefault(); try { navigator.clipboard.writeText(msg); toast("დაკოპირდა — გაუგზავნეთ მასპინძლებს 🤍"); } catch (_) { toast(msg); } } });
$("ics").addEventListener("click", e => { e.preventDefault(); const z = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""), end = new Date(when.getTime() + 5 * 36e5);
  const t = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ambavi//premium", "BEGIN:VEVENT", "UID:" + Date.now() + "@ambavi", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(when), "DTEND:" + z(end), "SUMMARY:" + both, "LOCATION:" + (V.addr || V.name || C.city || ""), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/calendar" })); a.download = "ambavi.ics"; a.click(); });
const cdB = [...document.querySelectorAll("#cd b")];
function tick(){ const s = Math.max(0, (when - Date.now()) / 1000 | 0); [s / 86400 | 0, (s / 3600 | 0) % 24, (s / 60 | 0) % 60, s % 60].forEach((v, i) => cdB[i].textContent = two(v)); }
tick(); setInterval(tick, 1000);
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .3 });

/* ---------- hold to open ---------- */
const G0 = performance.now(), G = () => typeof window.__G === "number" ? window.__G : REC ? 0 : (performance.now() - G0) / 1000;
let hold = 0, holding = false, openAt = -1, last = 0, on = false; const OPEN = C.openSec || 4.2, fill = $("fill");
const down = e => { e.preventDefault(); holding = true; try { Aria.unlock(); navigator.vibrate && navigator.vibrate(15); } catch (_) {} }, up = () => { holding = false; };
$("hold").addEventListener("pointerdown", down); ["pointerup", "pointerleave", "pointercancel"].forEach(k => $("hold").addEventListener(k, up));
$("hold").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { hold = 1; } });
function open(){ if (openAt >= 0) return; openAt = G(); H.classList.add("opening"); try { navigator.vibrate && navigator.vibrate([30, 60, 40]); if (!AUTO){ Aria.play(C.music); $("mu").classList.remove("off"); } } catch (_) {} }
function finish(){ if (on) return; on = true; H.classList.add("on"); scrollTo(0, 0); secs.forEach(s => io.observe(s)); }
$("mu").onclick = () => { if (Aria.playing){ Aria.pause(); $("mu").classList.add("off"); } else { Aria.play(C.music); $("mu").classList.remove("off"); } };

/* ---------- WebGL2 scene ---------- */
const cv = $("gl"), gl = cv.getContext("webgl2", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
const HEAD = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime, uT, uHold, uScroll, uSec; uniform vec3 uA, uB, uC;
out vec4 O;
float h1(float n){ return fract(sin(n) * 43758.5453); }
float h2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + 1.), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++){ s += a * n2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; } return s; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sat(float x){ return clamp(x, 0., 1.); }
float seg(float t, float a, float b){ return sat((t - a) / (b - a)); }
float ease(float t){ return t * t * (3. - 2. * t); }
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
vec3 render(vec2 fc);
void main(){ vec3 c = render(gl_FragCoord.xy); vec2 q = gl_FragCoord.xy / uRes; c *= mix(1., smoothstep(1.2, .3, length((q - .5) * vec2(1., .8))), .6);
  c = pow(aces(c), vec3(1. / 2.2)); c += (h2(gl_FragCoord.xy + fract(uTime * 7.) * 91.) - .5) * .03; O = vec4(c, 1.); }
`;
let prog_ = null, U = {};
function compile(){
  const src = ($("frag") || {}).textContent || "", sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, "#version 300 es\nin vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }")); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, HEAD + src)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  gl.useProgram(p); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  ["uRes", "uTime", "uT", "uHold", "uScroll", "uSec", "uA", "uB", "uC"].forEach(n => U[n] = gl.getUniformLocation(p, n)); prog_ = p;
  const hex = h => { const v = parseInt(String(h).replace("#", ""), 16); return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255].map(x => Math.pow(x, 2.2)); };
  const pal = C.scene || {}; gl.uniform3fv(U.uA, hex(pal.a || "#E7C68A")); gl.uniform3fv(U.uB, hex(pal.b || "#B07A3A")); gl.uniform3fv(U.uC, hex(pal.c || "#FFF2D8"));
}
const QUAL = +(Q.get("q") || C.quality || (REC ? 1 : .62));
function size(){ const w = Math.round(innerWidth * Math.min(2, devicePixelRatio || 1) * QUAL), h = Math.round(innerHeight * Math.min(2, devicePixelRatio || 1) * QUAL); if (cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; gl && gl.viewport(0, 0, w, h); } }
try { if (!gl) throw new Error("no webgl2"); compile(); } catch (e){ console.warn("scene:", e.message); window.__err = String(e.message); H.classList.add("nogl"); }

function frame(){
  requestAnimationFrame(frame);
  const g = G(), dt = Math.min(.05, Math.max(0, g - last)); last = g;
  if (openAt < 0){ if (AUTO) hold = Math.min(1, Math.max(0, (g - .8) / 1)); else hold = Math.min(1, Math.max(0, hold + (holding ? dt / 1.05 : -dt / .5))); if (hold >= 1) open(); }
  fill.style.strokeDashoffset = String(377 * (1 - (openAt >= 0 ? 1 : hold)));
  const t = openAt >= 0 ? g - openAt : -1; if (t >= OPEN * .78) finish();
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), sc = on ? scrollY / max : 0, sec = on ? scrollY / innerHeight : 0;
  const ri = Math.round(sec); railI.forEach((x, i) => x.classList.toggle("on", i === ri));
  if (prog_){ size(); gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uTime, g); gl.uniform1f(U.uT, t); gl.uniform1f(U.uHold, openAt >= 0 ? 1 : hold); gl.uniform1f(U.uScroll, sc); gl.uniform1f(U.uSec, sec); gl.drawArrays(gl.TRIANGLES, 0, 3); }
}
addEventListener("resize", size);
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 3000))]).then(() => { window.__ready = true; requestAnimationFrame(frame); });
})();
