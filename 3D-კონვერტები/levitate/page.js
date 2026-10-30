/* ამბავი · 3D კონვერტები — გვერდის ძრავი: 3D სცენა (opening.js) → შეხებით გახსნა → მოსაწვევის პანელები 3D ფონზე (გადახვევისას კამერა მოძრაობს).
   ?auto — თავისით იხსნება · ?rec — ვიდეოს ჩაწერა (დროს window.__G მართავს) · ?to=სახელი — სტუმრის სახელი · ?q=0.7 — ხატვის ხარისხი. */
(function(){
"use strict";
const C = window.E, OP = window.OPENING, TH = C.theme, U = new URLSearchParams(location.search), AUTO = U.has("auto"), REC = U.has("rec");
const D = document, R0 = D.documentElement, $ = (s, r = D) => r.querySelector(s), esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), sine = t => .5 - .5 * Math.cos(Math.PI * t);
const TO = (U.get("to") || "").trim().slice(0, 40), TOLINE = TO ? `ძვირფასო ${TO},` : (C.introTo || "ძვირფასო სტუმარო,");
Object.entries(TH).forEach(([k, v]) => R0.style.setProperty("--" + k, v)); R0.classList.add("hold", "d-" + C.type); if (REC) R0.classList.add("rec");

/* ---------- თარიღი ---------- */
const [Y, Mo, Dd] = C.date.split("-").map(Number), [hh, mm] = C.time.split(":").map(Number), TGT = Date.UTC(Y, Mo - 1, Dd, hh - 4, mm);
const MON = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const WD = ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"][new Date(Date.UTC(Y, Mo - 1, Dd)).getUTCDay()];
const p2 = n => String(n).padStart(2, "0"), DOTS = `${p2(Dd)} · ${p2(Mo)} · ${Y}`, LONG = `${Dd} ${MON[Mo - 1]}, ${Y}`, TITLE = C.title || (C.b ? `${C.a} & ${C.b}` : C.a);
const iso = ms => new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, "");
const GCAL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITLE)}&dates=${iso(TGT)}/${iso(TGT + 5 * 36e5)}&location=${encodeURIComponent(C.venue.name + ", " + C.venue.addr)}`;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.venue.map || C.venue.addr)}`;

/* ---------- HTML ---------- */
const ring = `<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" stroke-width=".4" stroke-dasharray="1.5 2.5"/>
  <text x="50" y="${C.monoY || 61}" text-anchor="middle" font-size="${C.monoS || 30}" fill="currentColor" style="font-family:var(--script)">${esc(C.mono)}</text></svg>`;
const ICO = { church: "M12 2v4M10 4h4M6.5 22V11.5L12 7l5.5 4.5V22M10 22v-4.5a2 2 0 0 1 4 0V22M3.5 22h17", glass: "M5 3h6c0 4-1.3 6.5-3 6.5S5 7 5 3zM8 9.5V19M5.5 19h5M13 3h6c0 4-1.3 6.5-3 6.5S13 7 13 3zM16 9.5V19M13.5 19h5",
  dinner: "M6 3v6.5a2 2 0 0 0 4 0V3M8 3v18M17 3c-2.2 2-2.2 7.5 0 9.5V21", music: "M9 18V5.5L20 3.5V16M9 18a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0zM20 16a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0z",
  ring: "M14.5 14.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zM20.5 14.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zM15 9l-1.6-2.4h3.2z", cake: "M4 21h16M5.5 21v-7.5h13V21M5.5 16.5c2.2 1.4 4.4 1.4 6.5 0s4.3-1.4 6.5 0M12 13.5V10M12 7.6c.9-.9.9-1.9 0-2.9-.9 1-.9 2 0 2.9z",
  camera: "M3 9a2 2 0 0 1 2-2h2.5L9 4.5h6L16.5 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM15.6 13.5a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0z", star: "M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.5 6.6 19.4l1.2-6L3.4 9.3l6-.7z", heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" };
const ico = n => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICO[n] || ICO.star}"/></svg>`;
const pg = (cls, inner) => `<section class="pg ${cls}"><div class="pn"><div class="in">${inner}</div></div></section>`;
const who = C.big ? `<p class="pre">${esc(C.a)}</p><h1 class="big">${esc(C.big)}</h1>` : C.b ? `<h1 class="nm"><span>${esc(C.a)}</span><i>&amp;</i><span>${esc(C.b)}</span></h1>` : `<h1 class="nm one"><span>${esc(C.a)}</span></h1>`;
D.body.insertAdjacentHTML("afterbegin", `<canvas id="gl"></canvas><div id="vig"></div>
<div id="intro" role="button" tabindex="0" aria-label="${esc(OP.hint)}"><div class="top"><p class="k">${esc(C.introKicker || "თქვენ მიიღეთ მოსაწვევი")}</p><p class="to">${esc(TOLINE)}</p></div><p class="tap"><b></b>${esc(OP.hint)}</p></div>
<main id="deck">
${pg("hero", `${ring}<p class="kick">${esc(C.kicker)}</p>${who}<p class="lat">${esc(C.latin || "")}</p><p class="date">${DOTS}</p><p class="when">${WD} · ${esc(C.time)} · ${esc(C.city)}</p><span class="down">ქვემოთ</span>`)}
${pg("story", `<p class="cap">${esc(C.storyCap || "ჩვენი ამბავი")}</p><p class="txt">${esc(C.story)}</p><p class="sig">${esc(C.sign)}</p>`)}
${pg("count", `<p class="cap">${esc(C.cdCap || "დიდ დღემდე დარჩა")}</p><div class="cd"><div><b id="cD">0</b><span>დღე</span></div><div><b id="cH">00</b><span>საათი</span></div><div><b id="cM">00</b><span>წუთი</span></div><div><b id="cS">00</b><span>წამი</span></div></div><p class="long">${WD}, ${LONG} · ${esc(C.time)}</p><a class="bt line" href="${GCAL}" target="_blank" rel="noopener">კალენდარში დამატება</a>`)}
${pg("plan", `<p class="cap">დღის პროგრამა</p><ul class="steps">${C.program.map(p => `<li>${ico(p.icon)}<div><time>${esc(p.time)}</time><b>${esc(p.title)}</b><small>${esc(p.place)}</small></div></li>`).join("")}</ul>`)}
${pg("place", `<p class="cap">ადგილი</p><div class="pin">${ico("heart")}</div><h2>${esc(C.venue.name)}</h2><p class="addr">${esc(C.venue.addr)}</p><a class="bt" href="${MAPS}" target="_blank" rel="noopener">რუკაზე ნახვა</a>`)}
${pg("dress", `<p class="cap">დრეს-კოდი</p><div class="sw">${C.palette.map(c => `<i style="--c:${c}"></i>`).join("")}</div><p class="note">${esc(C.dressNote)}</p>`)}
${pg("reply", `<p class="cap">დაგვიდასტურეთ</p><p class="by">გთხოვთ, გვაცნობოთ ${esc(C.rsvpBy)}</p><form novalidate><input name="n" autocomplete="name" placeholder="სახელი და გვარი">
  <div class="yn"><button type="button" data-v="1" class="on">მოვალ</button><button type="button" data-v="0">ვერ მოვალ</button></div>
  <div class="qty"><span>სტუმრები</span><div><button type="button" data-d="-1" aria-label="ნაკლები">−</button><b>1</b><button type="button" data-d="1" aria-label="მეტი">+</button></div></div>
  <textarea name="w" placeholder="სურვილი ან მილოცვა (არასავალდებულო)"></textarea><button class="bt" type="submit">გაგზავნა</button></form>`)}
${pg("end", `${ring}<p class="wait">გელოდებით</p><p class="fn">${esc(C.finName || TITLE)}</p><p class="fd">${DOTS}</p><p class="cr">ამბავი · 3D მოსაწვევები</p>`)}
</main><button class="snd off" type="button" aria-label="მუსიკა"><i></i><i></i><i></i><i></i></button><div class="msg" role="status"></div>`);

/* ---------- უკუთვლა, დადასტურება, მუსიკა ---------- */
const cd = ["cD", "cH", "cM", "cS"].map(i => $("#" + i)); const tick = () => { const s = Math.max(0, Math.floor((TGT - Date.now()) / 1000)), v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60]; cd.forEach((e, i) => e.textContent = i ? p2(v[i]) : v[i]); }; tick(); setInterval(tick, 1000);
const msgEl = $(".msg"); let mt = 0; const msg = m => { msgEl.textContent = m; msgEl.classList.add("on"); clearTimeout(mt); mt = setTimeout(() => msgEl.classList.remove("on"), 2600); };
const form = $(".reply form"); let att = 1, cnt = 1;
form.querySelectorAll(".yn button").forEach(b => b.onclick = () => { att = +b.dataset.v; form.querySelectorAll(".yn button").forEach(x => x.classList.toggle("on", x === b)); form.classList.toggle("no", !att); });
form.querySelectorAll(".qty button").forEach(b => b.onclick = () => { cnt = Math.max(1, Math.min(12, cnt + +b.dataset.d)); $(".qty b", form).textContent = cnt; });
form.onsubmit = e => { e.preventDefault(); const n = form.n.value.trim(), w = form.w.value.trim(); if (!n){ msg("გთხოვთ, ჩაწერეთ სახელი"); form.n.focus(); return; }
  const t = `${TITLE} — ${DOTS}\n${n}: ${att ? `მოვალ ✅ (${cnt} სტუმარი)` : "სამწუხაროდ, ვერ მოვალ 🙏"}${w ? `\n${w}` : ""}`;
  if (C.phone) window.open(`https://wa.me/${C.phone.replace(/\D/g, "")}?text=${encodeURIComponent(t)}`, "_blank");
  else if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => msg("ტექსტი დაკოპირდა — გაუგზავნეთ მასპინძლებს ✨"), () => msg("მადლობა! ✨")); else msg("მადლობა! ✨"); };
const snd = $(".snd"); snd.onclick = () => { try { if (Hangi.playing){ Hangi.pause(); snd.classList.add("off"); } else { Hangi.play(C.music); snd.classList.remove("off"); } } catch (e) {} };

/* ---------- 3D ---------- */
const cv = $("#gl"), intro = $("#intro"), deck = $("#deck"), hero = $(".pg.hero"); let SC = null, openAt = null, fading = false, done = false, last = 0, VP = null;
const t0 = performance.now(), clock = () => window.__G != null ? +window.__G : REC ? 0 : (performance.now() - t0) / 1000;
function open(at){ if (openAt != null || !SC) return; openAt = at == null ? clock() : at; R0.classList.add("opening"); if (!REC) try { Hangi.unlock(); if (Hangi.play(C.music)) snd.classList.remove("off"); } catch (e) {} }
intro.addEventListener("click", () => open()); intro.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
function finish(){ done = true; intro.style.display = "none"; deck.style.opacity = ""; R0.classList.remove("hold"); R0.classList.add("on"); scrollTo(0, 0);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .3 }); D.querySelectorAll(".pg").forEach(s => io.observe(s)); }
function loop(){ const g = clock(), dt = Math.min(.05, Math.max(0, g - last)); last = g;
  if (AUTO && openAt == null && g >= 1.8) open(1.8);
  const T = openAt == null ? -1 : g - openAt, H = D.documentElement.scrollHeight - innerHeight, k = done && H > 0 ? scrollY / H : 0;
  OP.frame(T, g, k, dt, { VP, Q }); if (SC.pts) SC.pts.step(dt, g); VP = Q.render(SC);
  if (!fading && T >= OP.dur - .85){ fading = true; deck.classList.add("show"); hero.classList.add("in"); }
  if (fading && !done){ const q = sine(seg(T, OP.dur - .85, OP.dur)); intro.style.opacity = 1 - q; deck.style.opacity = q; }
  if (!done && T >= OP.dur) finish();
  requestAnimationFrame(loop); }
function fallback(err){ console.warn("3D:", err); window.__err = String(err); R0.classList.add("no3d"); intro.style.display = "none"; deck.classList.add("show"); R0.classList.remove("hold"); R0.classList.add("on"); done = true;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: .3 }); D.querySelectorAll(".pg").forEach(s => io.observe(s)); window.__ready = true; }
async function boot(){
  try { Q.init(cv, { scale: +(U.get("q") || (REC ? 1 : .9)), shadow: 2048 }); } catch (e){ return fallback(e); }
  const fams = [TH.serif, TH.script, TH.num].map(f => f.split(",")[0]);
  await Promise.race([Promise.all(fams.map(f => D.fonts.load(`400 40px ${f}`, "ქართული Aa&0123"))), new Promise(r => setTimeout(r, 4000))]).catch(() => {});
  try { SC = OP.build({ C, TH, TO, TOLINE, DOTS, TITLE, Q, Ink, Env3, vw: innerWidth, vh: innerHeight }); } catch (e){ return fallback(e); }
  addEventListener("resize", () => Q.resize(+(U.get("q") || (REC ? 1 : .9))));
  requestAnimationFrame(loop); setTimeout(() => { window.__ready = true; }, 300);
}
boot();
})();
