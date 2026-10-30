/* ამბავი 2 · ძრავი. გვერდს ქმნის config.js-დან (window.AMB), 3D სცენას ტვირთავს scene.js-დან.
   სცენის ინტერფეისი: export default async function(THREE, { canvas, C }) → { open: წამები, update(s) }
     s = { t: გახსნიდან გასული დრო (-1 = ჯერ არ გახსნილა), p: გვერდის ფურცვლა 0..1, idle: საერთო დრო, w, h }
   ჩაწერისთვის: ?auto (თავისით იხსნება 1.5 წმ-ზე), დრო — window.__G. */
(function(){
"use strict";
const C = window.AMB || {}, Q = new URLSearchParams(location.search), AUTO = Q.has("auto"), root = document.documentElement;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
for (const [k, v] of Object.entries(C.theme || {})) root.style.setProperty("--" + k, v);
if (AUTO) root.classList.add("auto");

/* ---------- dates ---------- */
const MON = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const WD = ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"];
const when = new Date((C.date || "2027-06-12") + "T" + (C.time || "18:00") + ":00");
const dd = String(when.getDate()).padStart(2, "0"), mm = String(when.getMonth() + 1).padStart(2, "0"), dots = dd + " · " + mm + " · " + when.getFullYear();
const namesTxt = C.b ? C.a + " & " + C.b : C.a;
const namesHTML = `<span>${esc(C.a)}</span>${C.b ? `<i>&amp;</i><span>${esc(C.b)}</span>` : ""}`;

/* ---------- page ---------- */
const P = C.program || [], V = C.venue || {};
document.title = (C.title || namesTxt) + " · ამბავი";
document.body.insertAdjacentHTML("afterbegin", `
<canvas id="scene" aria-hidden="true"></canvas><div class="veil"></div><div class="flash" id="flash"></div>
<div class="intro" id="intro" role="button" tabindex="0" aria-label="მოსაწვევის გახსნა">
  <div class="i-top"><p class="i-k">${esc(C.introKick || "თქვენ მიიღეთ მოსაწვევი")}</p><p class="i-n">${esc(namesTxt)}</p>${C.introScript ? `<p class="i-s">${esc(C.introScript)}</p>` : ""}</div>
  <p class="i-hint"><span>✨ ${esc(C.hint || "შეეხეთ და გახსენით")}</span></p>
</div>
<main class="page" id="page">
  <section class="ch hero"><div class="wrap">
    <p class="k rv">${esc(C.kicker)}</p>
    <h1 class="names rv d1${C.b ? "" : " one"}">${namesHTML}</h1>
    ${C.script ? `<p class="scr rv d2">${esc(C.script)}</p>` : ""}
    <div class="dateline rv d3"><span>${WD[when.getDay()]}</span><b>${when.getDate()}</b><span>${MON[when.getMonth()]}<br>${when.getFullYear()}</span></div>
    <p class="city rv d4">${esc(C.city)}</p>
  </div><div class="cue" aria-hidden="true"></div></section>

  ${C.lead ? `<section class="ch"><div class="wrap"><div class="glass lead rv"><div class="orn"><i></i>${C.ornament || "✦"}<i></i></div><p class="quote">${esc(C.lead)}</p>${C.sign ? `<p class="sign">${esc(C.sign)}</p>` : ""}</div></div></section>` : ""}

  <section class="ch"><div class="wrap">
    <h2 class="t rv">${esc(C.cdTitle || "დიდ დღემდე დარჩა")}</h2>
    <div class="flip rv d1" id="flip">${["დღე", "საათი", "წუთი", "წამი"].map(l => `<div class="u"><div class="card"><b>00</b></div><small>${l}</small></div>`).join("")}</div>
    <div class="btns rv d2"><a class="btn line" id="ics" href="#">📅 კალენდარში დამატება</a></div>
  </div></section>

  ${P.length ? `<section class="ch"><div class="wrap">
    <h2 class="t rv">${esc(C.progTitle || "დღის პროგრამა")}<small>${dots}</small></h2>
    <div class="path" id="path"><span class="fill"></span>${P.map((e, i) => `<div class="st rv d${Math.min(i, 3)}"><span class="dot">${e.icon || "✦"}</span><div class="glass"><b>${esc(e.time)}</b><h3>${esc(e.title)}</h3>${e.place ? `<p>${esc(e.place)}</p>` : ""}</div></div>`).join("")}</div>
  </div></section>` : ""}

  ${V.name ? `<section class="ch"><div class="wrap"><div class="glass venue rv"><div class="ic">${V.icon || "📍"}</div><p class="k" style="margin-top:12px">სად?</p><h2>${esc(V.name)}</h2>${V.addr ? `<p>${esc(V.addr)}</p>` : ""}
    <div class="btns"><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(V.map || V.name)}">📍 რუკაზე ნახვა</a></div></div></div></section>` : ""}

  ${(C.palette || []).length ? `<section class="ch short"><div class="wrap">
    <h2 class="t rv">${esc(C.dressTitle || "სამოსის ფერები")}</h2>
    <div class="pal rv d1">${C.palette.map(c => `<i style="background:${esc(c)}"></i>`).join("")}</div>
    ${C.dressNote ? `<p class="note rv d2">${esc(C.dressNote)}</p>` : ""}
  </div></section>` : ""}

  <section class="ch"><div class="wrap">
    <h2 class="t rv">${esc(C.rsvpTitle || "შეძლებთ მობრძანებას?")}</h2>
    <div class="ticket rv d1"><div class="tk-l">
      <p class="k" style="text-align:left;text-indent:0">მოსაწვევი</p><p class="tk-n">${esc(namesTxt)}</p><p class="tk-d">${dots}</p>
      <label class="fld">თქვენი სახელი<input id="rv-name" autocomplete="name" placeholder="მაგ. ნინო ბერიძე"></label>
      <div class="seg" id="seg"><button type="button" data-v="yes" class="on">🥂 მოვალ</button><button type="button" data-v="no">ვერ მოვალ</button></div>
      <div class="cnt"><span>სტუმრების რაოდენობა</span><button type="button" id="cm">−</button><b id="cn">1</b><button type="button" id="cp">+</button></div>
      <a class="btn wide" id="rv-send" href="#" target="_blank" rel="noopener">გაგზავნა ✓</a>
    </div><div class="tk-r"><span>${dd} · ${mm}</span></div></div>
    ${C.rsvpBy ? `<p class="note rv d2">გთხოვთ, დაგვიდასტუროთ ${esc(C.rsvpBy)}</p>` : ""}
  </div></section>

  <section class="ch short"><div class="wrap">
    <h2 class="t rv">${esc(C.wishTitle || "დაგვიტოვეთ სურვილი")}</h2>
    <div class="glass wish rv d1"><textarea id="w-t" placeholder="დაწერეთ თბილი სიტყვები…"></textarea><input id="w-n" placeholder="თქვენი სახელი" autocomplete="name"><a class="btn" id="w-send" href="#" target="_blank" rel="noopener">💌 გაგზავნა</a></div>
  </div></section>

  <footer class="ch foot"><div class="wrap">
    <p class="k rv">${esc(C.footKick || "გელოდებით")}</p>
    <p class="names rv d1${C.b ? "" : " one"}">${namesHTML}</p>
    <p class="tk-d rv d2" style="margin-top:14px">${dots}</p>
    <p class="brand rv d3">ამბავი</p>
  </div></footer>
</main>
<button class="mus" id="mus" type="button" aria-label="მუსიკა">♫</button><div class="toast" id="toast"></div>`);

const $ = id => document.getElementById(id);
function toast(s){ const el = $("toast"); el.textContent = s; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2400); }
function send(text, a){ const ph = String(C.phone || "").replace(/\D/g, ""); if (ph){ a.href = "https://wa.me/" + ph + "?text=" + encodeURIComponent(text); return true; }
  try { navigator.clipboard.writeText(text); toast("დაკოპირდა — გაუგზავნეთ მასპინძლებს 🤍"); } catch (_) { toast(text); } return false; }

/* rsvp */
let going = "yes", guests = 1;
$("seg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; going = b.dataset.v; [...$("seg").children].forEach(x => x.classList.toggle("on", x === b)); $("page").classList.toggle("no-guests", going === "no"); });
$("cm").onclick = () => { guests = Math.max(1, guests - 1); $("cn").textContent = guests; };
$("cp").onclick = () => { guests = Math.min(12, guests + 1); $("cn").textContent = guests; };
$("rv-send").addEventListener("click", function(e){ const n = $("rv-name").value.trim(); if (!n){ e.preventDefault(); $("rv-name").focus(); toast("ჯერ სახელი ჩაწერეთ ✍️"); return; }
  const msg = going === "yes" ? `🥂 ${n} — სიამოვნებით მოვალ! სტუმრები: ${guests}\n${namesTxt} · ${dots}` : `${n} — სამწუხაროდ, ვერ მოვალ 🤍\n${namesTxt} · ${dots}`;
  if (!send(msg, this)) e.preventDefault(); });
$("w-send").addEventListener("click", function(e){ const t = $("w-t").value.trim(); if (!t){ e.preventDefault(); $("w-t").focus(); return; } const n = $("w-n").value.trim();
  if (!send(`💌 სურვილი${n ? " · " + n : ""}:\n${t}`, this)) e.preventDefault(); });
/* calendar (.ics) */
$("ics").addEventListener("click", e => { e.preventDefault(); const z = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""), end = new Date(when.getTime() + 5 * 3600e3);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ambavi//ka", "BEGIN:VEVENT", "UID:" + Date.now() + "@ambavi", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(when), "DTEND:" + z(end), "SUMMARY:" + (C.calTitle || namesTxt), "LOCATION:" + (V.addr || V.name || C.city || ""), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "ambavi.ics"; a.click(); });

/* countdown */
const flipB = [...document.querySelectorAll("#flip b")];
function tick(){ const s = Math.max(0, Math.floor((when - Date.now()) / 1000)), v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
  v.forEach((x, i) => { const t = String(x).padStart(2, "0"); if (flipB[i].textContent !== t){ flipB[i].textContent = t; flipB[i].classList.remove("tick"); void flipB[i].offsetWidth; flipB[i].classList.add("tick"); } }); }
tick(); setInterval(tick, 1000);

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });

/* ---------- opening + world ---------- */
let api = null, openAt = -1, opened = false, OPEN = 3.4;
const G0 = performance.now(), G = () => typeof window.__G === "number" ? window.__G : Q.has("rec") ? 0 : (performance.now() - G0) / 1000;
const tOpen = () => AUTO ? (G() >= 1.5 ? G() - 1.5 : -1) : (openAt < 0 ? -1 : G() - openAt);
function open(){ if (openAt >= 0 || AUTO) return; openAt = G(); root.classList.add("opening"); try { if (window.Music){ Music.start(C.music); $("mus").classList.add("on"); } } catch (_) {} if (!api) finishOpen(); }
function finishOpen(){ if (opened) return; opened = true; root.classList.add("open", "opening"); scrollTo(0, 0); document.querySelectorAll(".rv").forEach(el => io.observe(el)); }
$("intro").addEventListener("click", open); $("intro").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") open(); });
$("mus").addEventListener("click", () => { if (!window.Music) return; if (Music.playing){ Music.pause(); $("mus").classList.replace("on", "off"); } else { Music.start(C.music); $("mus").classList.remove("off"); $("mus").classList.add("on"); } });

const path = $("path");
function frame(){
  requestAnimationFrame(frame);
  const t = tOpen(), idle = G(), max = Math.max(1, document.documentElement.scrollHeight - innerHeight), p = opened ? Math.min(1, scrollY / max) : 0;
  if (t >= 0 && !root.classList.contains("opening")) root.classList.add("opening");
  if (t >= OPEN && !opened) finishOpen();
  root.style.setProperty("--vo", String(Math.min(.85, .15 + p * 1.6)));
  if (path){ const r = path.getBoundingClientRect(), f = Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height)); path.style.setProperty("--f", f.toFixed(3)); }
  if (api) api.update({ t, p, idle, w: innerWidth, h: innerHeight });
}
/* the scene is inlined into index.html as a module (works even when the file is opened directly, without a server) */
const canvas = $("scene");
let booted = false;
function boot(){ const S = window.AMB_SCENE; if (!S || booted) return; booted = true;
  S.create(S.THREE, { canvas, C }).then(a => { api = a; OPEN = a.open || OPEN; })
    .catch(e => { console.warn("scene:", e); root.classList.add("no3d"); })
    .finally(() => { window.__ready = true; requestAnimationFrame(frame); }); }
window.addEventListener("amb-scene", boot); boot();
setTimeout(() => { if (!booted){ booted = true; root.classList.add("no3d"); window.__ready = true; requestAnimationFrame(frame); } }, 12000);
})();
