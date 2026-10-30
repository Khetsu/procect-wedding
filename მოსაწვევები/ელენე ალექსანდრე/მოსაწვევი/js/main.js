/* ამბავი · საიტის ლოგიკა: ენა, განრიგი, უკუთვლა, დასწრება, კონვერტი და ეფექტები.
   მონაცემები config.js-შია, ტექსტები i18n.js-ში. */
(function(){
"use strict";
const C = window.CONFIG, I = window.I18N;
const $ = id => document.getElementById(id);
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = window.matchMedia && matchMedia("(pointer: fine)").matches;
const [Y, M, D] = C.date.split("-").map(Number);
const WD = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
const pad = n => String(n).padStart(2, "0");
const unset = s => !s || /\[.*\]/.test(s);
const store = { get(k){ try { return localStorage.getItem(k); } catch(_) { return null; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(_) {} } };

let lang = store.get("ambavi-lang") === "en" ? "en" : "ka";
const T = () => I[lang];
const en = () => lang === "en";
const groom = () => en() ? C.groomEn : C.groom;
const bride = () => en() ? C.brideEn : C.bride;
const city = () => en() ? (C.cityEn || C.city) : C.city;
const evTitle = ev => en() ? (ev.titleEn || ev.title) : ev.title;
const mainEvent = () => C.events.find(e => e.main) || C.events[0];

/* ---------- text ---------- */
function fill(){
  const t = T();
  document.documentElement.lang = lang;
  document.title = groom() + t.and + bride();
  const vals = {
    monogram: C.monogram,
    latinNames: C.groomEn + " & " + C.brideEn,
    pair: groom() + " & " + bride(),
    dots: pad(D) + " · " + pad(M) + " · " + Y,
    whereLine: t.weekdays[WD] + (unset(city()) && en() ? "" : " · " + city()),
    lead: en() ? C.leadEn : C.lead,
    toast: en() ? C.toastEn : C.toast
  };
  document.querySelectorAll("[data-t]").forEach(el => {
    if (el.classList.contains("nm")) return;
    el.textContent = vals[el.dataset.t] ?? "";
  });
  document.querySelectorAll("[data-i18n]").forEach(el => { const v = t[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t[el.dataset.i18nPh]; });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t[el.dataset.i18nAria]); });
  document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  names();
  $("date-line").innerHTML = '<span class="n foil">' + pad(D) + '</span><span class="dot"></span><span class="n foil">' + pad(M) + '</span><span class="dot"></span><span class="n foil">' + Y + '</span>';
  $("date-line").setAttribute("aria-label", t.when(D, t.months[M - 1]) + " " + Y);
  schedule();
  calendar();
  if (!$("rsvp-done").hidden) buildMessage();
}

/* names, letter by letter */
function names(){
  const h = $("names"), parts = h.querySelectorAll(".nm");
  let i = 0;
  [groom(), bride()].forEach((word, k) => {
    parts[k].textContent = "";
    [...word].forEach(ch => {
      const s = document.createElement("span");
      s.className = "ch"; s.textContent = ch; s.style.setProperty("--i", i++);
      parts[k].appendChild(s);
    });
  });
  h.setAttribute("aria-label", groom() + " & " + bride());
}

/* ---------- schedule ---------- */
function schedule(){
  const ol = $("day"), t = T();
  ol.textContent = "";
  C.events.forEach((ev, i) => {
    if (i){
      const ln = document.createElement("li");
      ln.className = "link"; ln.setAttribute("aria-hidden", "true");
      ln.innerHTML = '<i></i><svg class="spin"><use href="#borjghali"/></svg><i></i>';
      ol.appendChild(ln);
    }
    const li = document.createElement("li");
    li.className = "stop" + (i % 2 ? " flip" : "");
    const where = unset(C.city) ? ev.place : ev.place + ", " + city();
    li.innerHTML = '<div class="scene"></div><div class="info"><span class="script foil"></span><h3></h3><p></p>' +
      (unset(ev.place) ? "" : '<a class="map" target="_blank" rel="noopener"><svg><use href="#pin"/></svg><span></span></a>') + '</div>';
    const scene = li.querySelector(".scene");
    if (ev.photo){
      const img = document.createElement("img");
      img.src = ev.photo; img.alt = ev.place; img.loading = "lazy";
      scene.appendChild(img);
    } else {
      const tpl = $("scene-" + (ev.scene || "church"));
      if (tpl) scene.appendChild(tpl.content.cloneNode(true));
      else {
        scene.classList.add("art");
        scene.innerHTML = '<span class="ill" aria-hidden="true"><i class="w1"></i><i class="w2"></i><i class="w3"></i><svg><use href="#i-' + (ev.icon || "rings") + '"/></svg></span>';
      }
    }
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.innerHTML = '<span class="ic"><svg><use href="#i-' + (ev.icon || "rings") + '"/></svg></span><span></span>';
    badge.lastChild.textContent = ev.time;
    scene.appendChild(badge);
    li.querySelector(".script").textContent = ev.tag || "";
    li.querySelector("h3").textContent = evTitle(ev);
    li.querySelector("p").textContent = where;
    const a = li.querySelector(".map");
    if (a){
      a.lastChild.textContent = t.map;
      a.href = /^https?:/.test(ev.map) ? ev.map : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.map || where);
    }
    ol.appendChild(li);
  });
  tilt();
  watch(ol.querySelectorAll(".stop"));
}

/* ---------- gallery ---------- */
if (C.photos && C.photos.length){
  $("gallery-sec").hidden = false;
  C.photos.forEach((src, i) => {
    const li = document.createElement("li"), img = document.createElement("img");
    img.src = src; img.alt = C.groomEn + " & " + C.brideEn + " · " + (i + 1); img.loading = "lazy";
    li.appendChild(img); $("gallery").appendChild(li);
  });
}

/* ---------- calendar ---------- */
function calendar(){
  const d1 = Y + pad(M) + pad(D), next = new Date(Date.UTC(Y, M - 1, D + 1));
  const d2 = next.getUTCFullYear() + pad(next.getUTCMonth() + 1) + pad(next.getUTCDate());
  const details = C.events.map(e => e.time + " " + evTitle(e) + (unset(e.place) ? "" : ", " + e.place)).join("\n");
  $("cal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(T().weddingOf(groom(), bride())) +
    "&dates=" + d1 + "/" + d2 +
    (unset(C.city) ? "" : "&location=" + encodeURIComponent(city())) +
    "&details=" + encodeURIComponent(details);
}

/* ---------- countdown to the main event, Tbilisi time (UTC+4) ---------- */
(function(){
  const [hh, mm] = (mainEvent().time || "12:00").split(":").map(Number);
  const target = Date.UTC(Y, M - 1, D, hh - 4, mm || 0, 0);
  const set = (id, v) => {
    const el = $(id);
    if (el.textContent === String(v)) return;
    el.textContent = v;
    if (!REDUCED){ el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
  };
  function tick(){
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    if (s === 0){ $("count").hidden = true; $("count-done").hidden = false; return; }
    set("cd-d", Math.floor(s / 86400));
    set("cd-h", pad(Math.floor(s % 86400 / 3600)));
    set("cd-m", pad(Math.floor(s % 3600 / 60)));
    set("cd-s", pad(s % 60));
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- effects ---------- */
function dust(box, n){
  if (REDUCED || !box) return;
  for (let i = 0; i < n; i++){
    const s = document.createElement("span"), k = .5 + Math.random();
    s.style.left = (Math.random() * 100) + "%";
    s.style.width = s.style.height = (4 + Math.random() * 6) * k + "px";
    s.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    const dur = 9 + Math.random() * 10;
    s.style.animationDuration = dur + "s";
    s.style.animationDelay = (-Math.random() * dur) + "s";
    box.appendChild(s);
  }
}

function blossoms(n){
  if (REDUCED) return;
  const box = $("blossoms");
  const kind = C.particles || "blossom";
  if (kind === "none") return;
  const svg = kind === "petal"
    ? '<svg viewBox="0 0 20 26"><path d="M10 1C17 6 19 16 10 25C1 16 3 6 10 1Z" fill="' + (C.petalColor || "#F4C6CF") + '" stroke="rgba(160,90,90,.25)" stroke-width=".5"/><path d="M10 4V22" stroke="rgba(160,90,90,.18)" stroke-width=".6"/></svg>'
    : '<svg viewBox="-10 -10 20 20"><g fill="#FFFFFF" stroke="#E6D7A8" stroke-width=".5">' +
      [0,72,144,216,288].map(a => '<ellipse cx="0" cy="-4.5" rx="3" ry="4.5" transform="rotate(' + a + ')"/>').join("") +
      '</g><circle r="2" fill="#E9B949"/></svg>';
  for (let i = 0; i < n; i++){
    const b = document.createElement("span");
    b.className = "blossom"; b.innerHTML = svg;
    const dur = 13 + Math.random() * 12, k = .6 + Math.random() * .8;
    b.style.left = (Math.random() * 100) + "%";
    b.style.width = b.style.height = 16 * k + "px";
    b.style.opacity = .55 + Math.random() * .35;
    b.style.animationDuration = dur + "s, " + (3 + Math.random() * 3) + "s";
    b.style.animationDelay = (-Math.random() * dur) + "s, 0s";
    box.appendChild(b);
  }
}

function burst(host, x, y, n){
  if (REDUCED) return;
  for (let i = 0; i < n; i++){
    const s = document.createElement("span"); s.className = "spark";
    const a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 150;
    s.style.left = (x - 7) + "px"; s.style.top = (y - 7) + "px";
    s.style.setProperty("--x", Math.cos(a) * d + "px");
    s.style.setProperty("--y", Math.sin(a) * d + "px");
    s.style.setProperty("--r", (Math.random() * 360) + "deg");
    s.style.setProperty("--s", (.6 + Math.random() * 1.2).toFixed(2));
    s.style.animation = "burst " + (.9 + Math.random() * .8) + "s cubic-bezier(.2,.7,.2,1) forwards";
    host.appendChild(s);
    setTimeout(() => s.remove(), 1800);
  }
}

function confetti(){
  if (REDUCED) return;
  const box = $("confetti"), colors = C.confetti || ["#22479B", "#E9B949", "#F3DC94", "#FFFFFF", "#6E7B45", "#B8892E"];
  for (let i = 0; i < 70; i++){
    const c = document.createElement("i");
    c.style.left = (Math.random() * 100) + "%";
    c.style.background = colors[i % colors.length];
    c.style.boxShadow = colors[i % colors.length] === "#FFFFFF" ? "0 0 0 1px #C9D4EA" : "none";
    c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    c.style.setProperty("--r", (Math.random() * 900 - 450) + "deg");
    c.style.animationDuration = (2.4 + Math.random() * 2) + "s";
    c.style.animationDelay = (Math.random() * .6) + "s";
    box.appendChild(c);
    setTimeout(() => c.remove(), 5200);
  }
}

function tilt(){
  if (REDUCED || !FINE) return;
  document.querySelectorAll(".scene:not([data-tilt])").forEach(el => {
    el.dataset.tilt = "1";
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = "perspective(800px) rotateY(" + ((x - .5) * 10) + "deg) rotateX(" + ((.5 - y) * 10) + "deg)";
      el.style.setProperty("--gx", (x * 100) + "%"); el.style.setProperty("--gy", (y * 100) + "%");
      el.classList.add("tilting");
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; el.classList.remove("tilting"); });
  });
}

document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn, .submit, .copy");
  if (!b || REDUCED) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, k = document.createElement("span");
  k.className = "ripple";
  k.style.width = k.style.height = s + "px";
  k.style.left = (e.clientX - r.left - s / 2) + "px"; k.style.top = (e.clientY - r.top - s / 2) + "px";
  b.appendChild(k); setTimeout(() => k.remove(), 750);
});

(function(){
  const bar = $("progress"), arch = document.querySelector(".hero [data-parallax], .hero .arch");
  let ticking = false;
  function update(){
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    if (!REDUCED && arch) arch.style.transform = "translateY(" + Math.min(scrollY, 600) * .06 + "px)";
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive: true});
  update();
})();

/* scroll reveal: visible at rest; the animation plays when an element enters view */
const io = (!REDUCED && "IntersectionObserver" in window) ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
}), {threshold: .15}) : null;
function watch(list){
  if (!io) return;
  list.forEach(el => { el.classList.add("reveal"); if (el.getBoundingClientRect().top > innerHeight) io.observe(el); });
}

/* ---------- RSVP ---------- */
let msg = "", count = 1;
const form = $("rsvp-form"), done = $("rsvp-done"), box = $("rsvp-box");
const nameIn = $("r-name"), note = $("r-note"), out = $("r-count"), minus = $("r-minus"), plus = $("r-plus");
const attending = () => form.querySelector('input[name="attend"]:checked').value === "yes";
const setCount = n => { count = Math.min(10, Math.max(1, n)); out.textContent = count; minus.disabled = count <= 1; plus.disabled = count >= 10; };
setCount(1);
minus.onclick = () => setCount(count - 1);
plus.onclick = () => setCount(count + 1);
form.addEventListener("change", e => { if (e.target.name === "attend") $("count-field").hidden = !attending(); });
nameIn.addEventListener("input", () => { $("r-name-err").hidden = true; });

function buildMessage(){
  const t = T(), n = nameIn.value.trim(), yes = attending(), note2 = note.value.trim();
  const couple = groom() + t.and + bride(), when = t.when(D, t.monthsDat[M - 1]);
  msg = yes ? t.msgYes(couple, n, when, count) : t.msgNo(couple, n, when);
  if (note2) msg += "\n\n" + note2;
  $("msg-preview").textContent = msg;
  $("done-title").textContent = yes ? t.thanks(n.split(" ")[0]) : t.thanksNo;
  const enc = encodeURIComponent(msg);
  $("send-wa").href = "https://wa.me/" + (C.whatsapp || "") + "?text=" + enc;
  $("send-tg").href = "https://t.me/share/url?url=" + encodeURIComponent(" ") + "&text=" + enc;
  $("copy-label").textContent = t.copy;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!nameIn.value.trim()){ $("r-name-err").hidden = false; nameIn.focus(); return; }
  buildMessage();
  form.hidden = true; done.hidden = false;
  box.scrollIntoView({behavior: REDUCED ? "auto" : "smooth", block: "start"});
  if (attending()){ burst(box, box.clientWidth / 2, 70, 28); confetti(); }
});
$("send-copy").addEventListener("click", () => {
  const ok = () => { $("copy-label").textContent = T().copied; };
  const fallback = () => {
    const sel = getSelection(), rng = document.createRange();
    rng.selectNodeContents($("msg-preview")); sel.removeAllRanges(); sel.addRange(rng);
    $("copy-label").textContent = T().selected;
  };
  try { navigator.clipboard.writeText(msg).then(ok, fallback); } catch(_) { fallback(); }
});
$("rsvp-again").addEventListener("click", () => { done.hidden = true; form.hidden = false; nameIn.focus(); });

/* ---------- language switch ---------- */
document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", e => {
  e.stopPropagation();
  if (b.dataset.lang === lang) return;
  lang = b.dataset.lang; store.set("ambavi-lang", lang); fill();
}));

/* ---------- envelope: seal shakes, cracks, flap lifts, letter rises, page appears ---------- */
(function(){
  const gate = $("gate"), btn = $("music"), seal = $("seal"), M2 = window.Music;
  const sync = () => btn.classList.toggle("playing", M2.playing);
  const TM = REDUCED ? [0, 0, 100, 300, 600] : [0, 420, 800, 1600, 3000];
  function open(){
    if (gate.classList.contains("cracking")) return;
    M2.start(); sync();
    gate.classList.add("cracking");
    setTimeout(() => {
      gate.classList.add("broken");
      const g = gate.getBoundingClientRect(), r = seal.getBoundingClientRect();
      burst(gate, r.left - g.left + r.width / 2, r.top - g.top + r.height / 2, 34);
    }, TM[1]);
    setTimeout(() => gate.classList.add("flap-open"), TM[2]);
    setTimeout(() => gate.classList.add("letter-out"), TM[3]);
    setTimeout(() => {
      document.documentElement.classList.remove("gated");
      gate.classList.add("open");
      document.documentElement.style.overflow = "";
      btn.hidden = false;
      setTimeout(() => { gate.hidden = true; }, 1100);
    }, TM[4]);
  }
  gate.addEventListener("click", open);
  gate.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
  btn.addEventListener("click", () => { M2.playing ? M2.pause() : M2.start(); sync(); });
})();

/* ---------- start ---------- */
fill();
dust($("gate-dust"), innerWidth < 600 ? 22 : 36);
if (C.pageDust !== false) dust($("page-dust"), innerWidth < 600 ? 10 : 16);
blossoms(innerWidth < 600 ? 8 : 14);
watch(document.querySelectorAll(".reveal"));
})();
