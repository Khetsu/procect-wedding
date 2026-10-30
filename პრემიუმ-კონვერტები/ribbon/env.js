/* ამბავი · პრემიუმ კონვერტები — მთავარი ძრავი.
   მაგიდა + 3D კონვერტი (envelope.js) → შეხებით გახსნა → ბარათი ამოდის და მოსაწვევის „ბარათების ნაკრებად“ იქცევა (8 ბარათი).
   ?auto — თავისით იხსნება · ?rec — ვიდეოს ჩაწერა (window.__G მართავს დროს) · ?to=სახელი — სტუმრის სახელი კონვერტზე. */
(function(){
"use strict";
const C = window.E, EV = window.ENVELOPE, TH = C.theme, Q = new URLSearchParams(location.search), AUTO = Q.has("auto"), REC = Q.has("rec");
const D = document, R0 = D.documentElement, $ = (s, r = D) => r.querySelector(s), esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const TO = (Q.get("to") || "").trim().slice(0, 40);
Object.entries(TH).forEach(([k, v]) => R0.style.setProperty("--" + k, v));
R0.classList.add("lock", "k-" + C.type); if (REC) R0.classList.add("rec"); if (C.edge) R0.classList.add(C.edge);

/* ---------- მასალები ---------- */
const foil = C.foil === "rose" ? K.ROSE : K.GOLD;
K.defs(K.lg("kgold", 0, 0, 1, 1, foil));
R0.style.setProperty("--paperImg", `url(${K.paper(TH.paper, C.paperOpt || {})})`);
R0.style.setProperty("--tile", K.TILE + "px");
R0.style.setProperty("--foil", `linear-gradient(100deg,${foil.map(([o, c]) => `${c} ${o * 100}%`).join(",")})`);
R0.style.setProperty("--corner", `url("data:image/svg+xml,${encodeURIComponent(K.corner(TH.acc).replace("<svg", "<svg xmlns='http://www.w3.org/2000/svg'"))}")`);
if (C.edge === "deckle"){ const R = K.rng(4), P = [], j = () => 3 + R() * 7; for (let i = 0; i <= 80; i++) P.push([i * 12.5, j()]); for (let i = 1; i <= 80; i++) P.push([1000 - j(), i * 12.5]); for (let i = 1; i <= 80; i++) P.push([1000 - i * 12.5, 1000 - j()]); for (let i = 1; i < 80; i++) P.push([j(), 1000 - i * 12.5]);
  const d = "M" + P.map(p => p.map(v => v.toFixed(1)).join(",")).join("L") + "Z"; R0.style.setProperty("--deckle", `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000' preserveAspectRatio='none'><path d='${d}'/></svg>`)}")`); }

/* ---------- თარიღი ---------- */
const [Y, M, Dd] = C.date.split("-").map(Number), [hh, mm] = C.time.split(":").map(Number), TARGET = Date.UTC(Y, M - 1, Dd, hh - 4, mm);
const MON = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const WD = ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"][new Date(Date.UTC(Y, M - 1, Dd)).getUTCDay()];
const p2 = n => String(n).padStart(2, "0"), DOTS = `${p2(Dd)} · ${p2(M)} · ${Y}`, LONG = `${Dd} ${MON[M - 1]}, ${Y}`;
const TITLE = C.title || (C.b ? `${C.a} & ${C.b}` : C.a), iso = ms => new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, "");
const GCAL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITLE)}&dates=${iso(TARGET)}/${iso(TARGET + 5 * 36e5)}&location=${encodeURIComponent(C.venue.name + ", " + C.venue.addr)}`;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.venue.map || C.venue.addr)}`;

/* ---------- HTML ---------- */
const crest = (cls = "crest") => `<div class="${cls}">${K.crest(esc(C.mono), { font: TH.script, size: C.monoSize || 30, dy: C.monoDy })}</div>`;
const names = C.big ? `<p class="pre">${esc(C.a)}</p><h1 class="big foil">${esc(C.big)}</h1>`
  : C.b ? `<h1 class="names"><span class="nm">${esc(C.a)}</span><span class="amp foil">&amp;</span><span class="nm">${esc(C.b)}</span></h1>` : `<h1 class="names solo"><span class="nm">${esc(C.a)}</span></h1>`;
const mini = C.big ? `${esc(C.a)}<b class="foil">${esc(C.big)}</b>` : C.b ? `${esc(C.a)} <span class="amp">&amp;</span> ${esc(C.b)}` : esc(C.a);
const cardFace = (cls = "") => `<div class="ecard ${cls}"><div class="ein">${crest("ecr")}<p class="en">${mini}</p><p class="ed">${DOTS}</p></div><i class="esh"></i></div>`;
const card = (cls, inner) => `<section class="sc ${cls}"><div class="card"><div class="pp"></div><i class="cn a"></i><i class="cn b"></i><i class="cn c"></i><i class="cn d"></i><div class="in">${inner}</div></div></section>`;
const icon = n => `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true">${K.ICON[n] || K.ICON.star}</svg>`;
const mapCol = { base: TH.mapBase || K.rgba(TH.ink, .04), park: K.rgba(TH.acc, .16), water: K.rgba(TH.acc, .22), block: K.rgba(TH.ink, .09), road: TH.mapRoad || "rgba(255,255,255,.7)", line: K.rgba(TH.ink, .22), pin: TH.btn };
const toLine = TO ? `ძვირფასო ${esc(TO)},` : esc(C.introTo || "ძვირფასო სტუმარო,");

D.body.insertAdjacentHTML("afterbegin", `<div id="table"></div><div id="lamp"></div>
<div id="intro" role="button" tabindex="0" aria-label="${esc(EV.hint)}"><div id="props"></div>
  <header class="ih"><p class="ik">${esc(C.introKicker || "თქვენ მიიღეთ მოსაწვევი")}</p><p class="ito">${toLine}</p></header>
  <div id="stage"><div id="env"></div></div><p class="hint"><span></span>${esc(EV.hint)}</p></div>
<main id="deck">
${card("hero", `${crest()}<p class="kick">${esc(C.kicker)}</p>${names}<p class="lat">${esc(C.latin || "")}</p><div class="date"><i></i><b>${DOTS}</b><i></i></div><p class="when">${WD} · ${esc(C.time)} · ${esc(C.city)}</p><span class="more">ქვემოთ</span>`)}
${card("letter", `<p class="cap">${esc(C.storyCap || "ჩვენი ამბავი")}</p>${K.orn(TH.acc)}<p class="story">${esc(C.story)}</p><p class="sign">${esc(C.sign)}</p>`)}
${card("cd", `<p class="cap">${esc(C.cdCap || "დიდ დღემდე დარჩა")}</p><div class="cnt"><div><b id="cD">0</b><span>დღე</span></div><div><b id="cH">0</b><span>საათი</span></div><div><b id="cM">0</b><span>წუთი</span></div><div><b id="cS">0</b><span>წამი</span></div></div>
  <p class="dl">${WD}, ${LONG} · ${esc(C.time)}</p><a class="btn ghost" href="${GCAL}" target="_blank" rel="noopener">კალენდარში დამატება</a>`)}
${card("prog", `<p class="cap">დღის პროგრამა</p><ol class="tl">${C.program.map(p => `<li>${icon(p.icon)}<div><time>${esc(p.time)}</time><b>${esc(p.title)}</b><span>${esc(p.place)}</span></div></li>`).join("")}</ol>`)}
${card("venue", `<p class="cap">ადგილი</p><div class="map">${K.map(mapCol, C.mapSeed || 3)}</div><h2>${esc(C.venue.name)}</h2><p class="addr">${esc(C.venue.addr)}</p><a class="btn" href="${MAPS}" target="_blank" rel="noopener">რუკაზე ნახვა</a>`)}
${card("dress", `<p class="cap">დრეს-კოდი</p><div class="sw">${C.palette.map(c => `<i style="--c:${c}"></i>`).join("")}</div><p class="note">${esc(C.dressNote)}</p>`)}
${card("rsvp", `<p class="cap">დაგვიდასტურეთ</p><p class="by">გთხოვთ, გვაცნობოთ ${esc(C.rsvpBy)}</p><form novalidate><input name="n" autocomplete="name" placeholder="სახელი და გვარი">
  <div class="yn"><button type="button" data-v="1" class="on">მოვალ</button><button type="button" data-v="0">ვერ მოვალ</button></div>
  <div class="num"><span>სტუმრების რაოდენობა</span><div><button type="button" data-d="-1" aria-label="ნაკლები">−</button><b>1</b><button type="button" data-d="1" aria-label="მეტი">+</button></div></div>
  <textarea name="w" placeholder="სურვილი ან მილოცვა (არასავალდებულო)"></textarea><button class="btn" type="submit">გაგზავნა</button></form>`)}
${card("fin", `${crest()}<p class="wait">გელოდებით</p>${K.orn(TH.acc)}<p class="fn">${esc(C.finName || TITLE)}</p><p class="fd">${DOTS}</p><p class="credit">ამბავი · ციფრული მოსაწვევები</p>`)}
</main><canvas id="fx"></canvas><button class="mu" type="button" aria-label="მუსიკა"><i></i><i></i><i></i><i></i></button><div class="toast" role="status"></div>`);

$("#table").style.backgroundImage = `url(${K.table(C.table)})`;
D.querySelectorAll(".sc .card").forEach((c, i) => { const r = K.rng(i + 7); c.style.setProperty("--r0", ((r() - .5) * 6).toFixed(2) + "deg"); c.style.setProperty("--r1", (i ? (r() - .5) * 1.2 : 0).toFixed(2) + "deg"); });

/* ---------- ნაწილაკები ---------- */
const FX = K.fx($("#fx"), C.fx || { kind: "dust", rate: 4 });

/* ---------- კონვერტი ---------- */
const intro = $("#intro"), deck = $("#deck"), env = $("#env"), hero = $(".sc.hero");
R0.style.setProperty("--sy", EV.sy || "54%");
let ctx = null, openAt = null, done = false, fading = false, far = false, last = 0;
function layout(){ const vw = innerWidth, vh = innerHeight, W = Math.round(Math.min(vw * EV.maxW, vh * EV.maxH / EV.aspect, EV.maxPx || 560)), H = Math.round(W * EV.aspect);
  env.style.cssText = `width:${W}px;height:${H}px;left:${-W / 2}px;top:${-H / 2}px`; env.innerHTML = "";
  ctx = { W, H, vw, vh, C, TH, TO, fx: FX, cardFace, esc, DOTS, toLine }; EV.build(env, ctx); $("#props").innerHTML = EV.props ? EV.props(ctx) : ""; }
layout();
let rz = 0; addEventListener("resize", () => { if (openAt != null) return; clearTimeout(rz); rz = setTimeout(layout, 200); });

const t0 = performance.now(), clock = () => window.__G != null ? +window.__G : REC ? 0 : (performance.now() - t0) / 1000;
function open(at){ if (openAt != null) return; openAt = at == null ? clock() : at; R0.classList.add("opening"); if (!REC){ try { Aria.unlock(); Aria.play(C.music); } catch (e) {} } }
intro.addEventListener("click", () => open()); intro.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });

function finish(){ done = true; intro.style.display = "none"; deck.style.opacity = ""; R0.classList.remove("lock"); R0.classList.add("on"); scrollTo(0, 0);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .3 }); D.querySelectorAll(".sc").forEach(s => io.observe(s)); }
function loop(){ const g = clock(), dt = Math.min(.05, Math.max(0, g - last)); last = g;
  if (AUTO && openAt == null && g >= 1.8) open(1.8);
  const T = openAt == null ? -1 : g - openAt;
  if (!done) EV.frame(T, g, ctx);
  if (!far && T >= EV.dur - 2.2){ far = true; intro.classList.add("far"); }
  if (!fading && T >= EV.dur - .9){ fading = true; deck.classList.add("show"); hero.classList.add("in"); }
  if (fading && !done){ const k = K.ease.sine(K.seg(T, EV.dur - .9, EV.dur)); intro.style.opacity = 1 - k; deck.style.opacity = k; }
  if (!done && T >= EV.dur) finish();
  FX.step(dt, g); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

/* ---------- უკუთვლა ---------- */
const cd = ["cD", "cH", "cM", "cS"].map(id => $("#" + id));
const tick = () => { let s = Math.max(0, Math.floor((TARGET - Date.now()) / 1000)); const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60]; cd.forEach((e, i) => e.textContent = i ? p2(v[i]) : v[i]); };
tick(); setInterval(tick, 1000);

/* ---------- დადასტურება ---------- */
const toastEl = $(".toast"); let tt = 0; const toast = m => { toastEl.textContent = m; toastEl.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("on"), 2600); };
const form = $(".rsvp form"); let att = 1, cnt = 1;
form.querySelectorAll(".yn button").forEach(b => b.onclick = () => { att = +b.dataset.v; form.querySelectorAll(".yn button").forEach(x => x.classList.toggle("on", x === b)); form.classList.toggle("no", !att); });
form.querySelectorAll(".num button").forEach(b => b.onclick = () => { cnt = Math.max(1, Math.min(12, cnt + +b.dataset.d)); $(".num b", form).textContent = cnt; });
form.onsubmit = e => { e.preventDefault(); const n = form.n.value.trim(), w = form.w.value.trim(); if (!n){ toast("გთხოვთ, ჩაწერეთ სახელი"); form.n.focus(); return; }
  const txt = `${TITLE} — ${DOTS}\n${n}: ${att ? `მოვალ ✅ (${cnt} სტუმარი)` : "სამწუხაროდ, ვერ მოვალ 🙏"}${w ? `\n${w}` : ""}`;
  if (C.phone) window.open(`https://wa.me/${C.phone.replace(/\D/g, "")}?text=${encodeURIComponent(txt)}`, "_blank");
  else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast("ტექსტი დაკოპირდა — გაუგზავნეთ მასპინძლებს ✨"), () => toast("მადლობა! ✨")); else toast("მადლობა! ✨");
  form.classList.add("sent"); };

/* ---------- მუსიკა ---------- */
const mu = $(".mu"); mu.onclick = () => { try { if (Aria.playing){ Aria.pause(); mu.classList.add("off"); } else { Aria.play(C.music); mu.classList.remove("off"); } } catch (e) {} };
if (REC || AUTO) mu.classList.add("off");

D.fonts.ready.then(() => setTimeout(() => { window.__ready = true; }, 250));
})();
