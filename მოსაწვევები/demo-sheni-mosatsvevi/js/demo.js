/* ამბავი · „შექმენი შენი მოსაწვევი“: 3D წიგნი ოქროს ფოლგით. სახელები აკრეფისთანავე იხატება ყდაზე და შიგნით გვერდზე.
   შეხებისას: წიგნი სწორდება → ყდა იღება → სამი ფურცელი იშლება → გვერდიდან ოქროს შუქი და ნაპერწკლები → კამერა გვერდთან მიდის → პერსონალური გვერდი.
   ჩაწერისთვის: window.__gateT (წიგნის დრო გახსნის შემდეგ), ?auto რეჟიმში window.__G (მთელი სცენარის დრო). */
import * as THREE from "three";
import { RoomEnvironment } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js";

const $ = id => document.getElementById(id), root = document.documentElement, Q = new URLSearchParams(location.search), AUTO = Q.has("auto");
const TYPES = {
  wedding:     { two: true,  song: "romance", cover: ["#F5EFE4", "#E3D8C5"], gold: ["#F6E3AE", "#E2C27A", "#A9823A", "#7E5F26"], ink: "#5A4A3A", page: "#FCF8F0", top: "სიყვარულით გიწვევთ", line: "ჩვენს ქორწილში",
    prog: [["16:00", "ჯვრისწერა", "ტაძარში"], ["18:30", "ფოტოსესია", "ბაღში, მეგობრებთან ერთად"], ["19:30", "ბანკეტი", "მუსიკა, ცეკვა და სიყვარული"]] },
  engagement:  { two: true,  song: "waltz",   cover: ["#EDD3CC", "#D5A99F"], gold: ["#FBE3D6", "#E6B49C", "#A8664F", "#7A4433"], ink: "#5B3A36", page: "#FFF7F4", top: "სიხარულით გიწვევთ", line: "ჩვენს ნიშნობაზე",
    prog: [["19:00", "შეხვედრა", "welcome drink"], ["19:40", "ნიშნობა", "ბეჭდების მომენტი 💍"], ["20:15", "ვახშამი", "ცოცხალი მუსიკით"]] },
  birthday:    { two: false, song: "party",   cover: ["#22305A", "#121A34"], gold: ["#FFF0BE", "#F0CF78", "#B8892F", "#7E5C1C"], ink: "#2A2F45", page: "#FBF7EE", top: "გიწვევთ", line: "ჩემს დაბადების დღეზე",
    prog: [["19:00", "შეხვედრა", "კოქტეილები"], ["19:45", "ვახშამი", "საუკეთესო ადამიანებთან"], ["21:30", "ტორტი 🎂", "და დიდი ცეკვა"]] },
  christening: { two: false, song: "lullaby", cover: ["#E3ECF5", "#C3D3E3"], gold: ["#FFFFFF", "#DCE4EC", "#8FA0B4", "#5F6F82"], ink: "#3A4656", page: "#FBFCFE", top: "სიყვარულით გიწვევთ", line: "ნათლობაზე",
    prog: [["13:00", "ნათლობა", "ტაძარში"], ["15:00", "საზეიმო სადილი", "ოჯახთან და ახლობლებთან ერთად"]] }
};
const MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const later = () => { const d = new Date(Date.now() + 150 * 864e5); return d.toISOString().slice(0, 10); };
const clean = (s, n) => String(s || "").replace(/[<>]/g, "").trim().slice(0, n);
const S = { t: TYPES[Q.get("t")] ? Q.get("t") : "wedding", a: clean(Q.get("a"), 16), b: clean(Q.get("b"), 16), d: /^\d{4}-\d{2}-\d{2}$/.test(Q.get("d") || "") ? Q.get("d") : "", c: clean(Q.get("c"), 18) };
const T = () => TYPES[S.t], A = () => S.a || (T().two ? "ნინო" : "ელენე"), B = () => S.b || "გიორგი", D = () => S.d || later(), C = () => S.c || "თბილისი";
const shown = () => T().two ? A() + " & " + B() : A();
const dparts = () => { const [y, m, d] = D().split("-").map(Number); return { y, m, d }; };
const dots = () => { const p = dparts(); return String(p.d).padStart(2, "0") + " · " + String(p.m).padStart(2, "0") + " · " + p.y; };

/* ---------- canvas paintings: the cover (colour + foil masks), the inside page, the liner ---------- */
const CW = 1024, CH = 1366, mk = () => { const c = document.createElement("canvas"); c.width = CW; c.height = CH; return c; };
const cvCol = mk(), cvMet = mk(), cvRough = mk(), cvPage = mk(), cvLiner = mk();
function fit(g, txt, max, size, font){ let s = size; do { g.font = font.replace("#", s); s -= 4; } while (g.measureText(txt).width > max && s > 20); }
function goldFill(g){ const G = T().gold, gr = g.createLinearGradient(0, 0, CW, CH); gr.addColorStop(0, G[2]); gr.addColorStop(.28, G[1]); gr.addColorStop(.45, G[0]); gr.addColorStop(.62, G[1]); gr.addColorStop(.85, G[2]); gr.addColorStop(1, G[3]); return gr; }
function ornament(g, x, y, w, s){ g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - 22 * s, y); g.moveTo(x + 22 * s, y); g.lineTo(x + w, y); g.stroke(); g.beginPath(); g.moveTo(x, y - 12 * s); g.lineTo(x + 12 * s, y); g.lineTo(x, y + 12 * s); g.lineTo(x - 12 * s, y); g.closePath(); g.fill(); }
function corner(g, x, y, sx, sy){ g.save(); g.translate(x, y); g.scale(sx, sy); g.beginPath(); g.moveTo(0, 90); g.quadraticCurveTo(0, 0, 90, 0); g.moveTo(18, 110); g.quadraticCurveTo(18, 18, 110, 18); g.stroke(); g.beginPath(); g.arc(34, 34, 7, 0, 7); g.fill(); g.restore(); }
/* the foil artwork, drawn three times: in gold, as a metal mask (white) and as a roughness mask (dark = glossy) */
function foil(g, ink){
  g.fillStyle = g.strokeStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
  g.lineWidth = 7; g.strokeRect(58, 58, CW - 116, CH - 116); g.lineWidth = 2.5; g.strokeRect(84, 84, CW - 168, CH - 168);
  g.lineWidth = 3; corner(g, 110, 110, 1, 1); corner(g, CW - 110, 110, -1, 1); corner(g, 110, CH - 110, 1, -1); corner(g, CW - 110, CH - 110, -1, -1);
  g.font = '500 30px "Noto Serif Georgian"'; if ("letterSpacing" in g) g.letterSpacing = "10px"; g.fillText("თქვენ მიიღეთ მოსაწვევი", CW / 2, 250); if ("letterSpacing" in g) g.letterSpacing = "0px";
  g.lineWidth = 6; g.beginPath(); g.arc(CW / 2, 590, 220, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(CW / 2, 590, 196, 0, 7); g.stroke();
  for (let i = 0; i < 24; i++){ const a = i / 24 * Math.PI * 2; g.beginPath(); g.arc(CW / 2 + Math.cos(a) * 208, 590 + Math.sin(a) * 208, 3.2, 0, 7); g.fill(); }
  if (T().two){ g.font = '500 150px "Noto Serif Georgian"'; g.fillText(A()[0], CW / 2 - 92, 600); g.fillText(B()[0], CW / 2 + 92, 600); g.font = '400 120px "Great Vibes"'; g.fillText("&", CW / 2, 610); }
  else { g.font = '500 210px "Noto Serif Georgian"'; g.fillText(A()[0], CW / 2, 605); }
  fit(g, shown(), CW - 260, 82, '500 #px "Noto Serif Georgian"'); g.fillText(shown(), CW / 2, 925);
  g.lineWidth = 2.5; ornament(g, CW / 2, 1010, 170, 1);
  g.font = '600 64px "Cormorant Garamond"'; if ("letterSpacing" in g) g.letterSpacing = "6px"; g.fillText(dots(), CW / 2, 1100); if ("letterSpacing" in g) g.letterSpacing = "0px";
  g.font = '400 30px "Noto Serif Georgian"'; if ("letterSpacing" in g) g.letterSpacing = "8px"; g.fillText(C(), CW / 2, 1180); if ("letterSpacing" in g) g.letterSpacing = "0px";
}
function paintCover(){
  const t = T(), g = cvCol.getContext("2d"), gr = g.createLinearGradient(0, 0, CW, CH); gr.addColorStop(0, t.cover[0]); gr.addColorStop(1, t.cover[1]); g.fillStyle = gr; g.fillRect(0, 0, CW, CH);
  /* linen weave */
  g.globalAlpha = .05; for (let i = 0; i < CH; i += 4){ g.fillStyle = i % 8 ? "#000" : "#fff"; g.fillRect(0, i, CW, 1.4); } for (let i = 0; i < CW; i += 4){ g.fillStyle = i % 8 ? "#fff" : "#000"; g.fillRect(i, 0, 1.4, CH); } g.globalAlpha = 1;
  /* debossed foil: a soft shadow first, then the foil */
  g.save(); g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 5; g.shadowOffsetY = 3; foil(g, goldFill(g)); g.restore(); foil(g, goldFill(g));
  const m = cvMet.getContext("2d"); m.fillStyle = "#000"; m.fillRect(0, 0, CW, CH); foil(m, "#fff");
  const r = cvRough.getContext("2d"); r.fillStyle = "#b4b4b4"; r.fillRect(0, 0, CW, CH); foil(r, "#3a3a3a");
}
function inkGold(g){ const G = T().gold, gr = g.createLinearGradient(0, 300, CW, 1100); gr.addColorStop(0, G[3]); gr.addColorStop(.45, G[2]); gr.addColorStop(.55, G[1]); gr.addColorStop(1, G[3]); return gr; }
function paintPage(){
  const t = T(), g = cvPage.getContext("2d"); g.fillStyle = t.page; g.fillRect(0, 0, CW, CH);
  const v = g.createRadialGradient(CW / 2, CH / 2, 200, CW / 2, CH / 2, 900); v.addColorStop(0, "rgba(255,255,255,.6)"); v.addColorStop(1, "rgba(160,130,90,.14)"); g.fillStyle = v; g.fillRect(0, 0, CW, CH);
  const gold = inkGold(g); g.strokeStyle = g.fillStyle = gold; g.lineWidth = 2.5; g.strokeRect(64, 64, CW - 128, CH - 128);
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 2.5; ornament(g, CW / 2, 200, 150, 1);
  g.fillStyle = t.ink; g.globalAlpha = .7; g.font = '400 34px "Noto Serif Georgian"'; if ("letterSpacing" in g) g.letterSpacing = "8px"; g.fillText(t.top, CW / 2, 300); if ("letterSpacing" in g) g.letterSpacing = "0px"; g.globalAlpha = 1;
  g.fillStyle = gold;
  if (t.two){ fit(g, A(), CW - 220, 128, '500 #px "Noto Serif Georgian"'); g.fillText(A(), CW / 2, 470); g.font = '400 170px "Great Vibes"'; g.fillText("&", CW / 2, 610); fit(g, B(), CW - 220, 128, '500 #px "Noto Serif Georgian"'); g.fillText(B(), CW / 2, 760); }
  else { fit(g, A(), CW - 220, 160, '500 #px "Noto Serif Georgian"'); g.fillText(A(), CW / 2, 560); }
  g.fillStyle = t.ink; g.font = '400 46px "Noto Serif Georgian"'; g.fillText(t.line, CW / 2, 890);
  const p = dparts(); g.font = '600 96px "Cormorant Garamond"'; g.fillText(String(p.d), CW / 2 - 170, 1040); g.font = '400 40px "Noto Serif Georgian"'; g.fillText(MONTHS[p.m - 1] || "", CW / 2 + 40, 1020); g.font = '600 44px "Cormorant Garamond"'; g.fillStyle = gold; g.fillText(String(p.y), CW / 2 + 40, 1072);
  g.fillStyle = t.ink; g.globalAlpha = .65; g.font = '400 30px "Noto Serif Georgian"'; if ("letterSpacing" in g) g.letterSpacing = "8px"; g.fillText(C(), CW / 2, 1170); if ("letterSpacing" in g) g.letterSpacing = "0px"; g.globalAlpha = 1;
  g.fillStyle = gold; ornament(g, CW / 2, 1240, 110, .8);
}
function paintLiner(){
  const t = T(), g = cvLiner.getContext("2d"); g.fillStyle = t.cover[1]; g.fillRect(0, 0, CW, CH); g.fillStyle = goldFill(g); g.globalAlpha = .45;
  for (let y = 40, r = 0; y < CH; y += 76, r++) for (let x = (r % 2) * 38 + 20; x < CW; x += 76){ g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-5, -5, 10, 10); g.restore(); }
  g.globalAlpha = 1;
}

/* ---------- the scene ---------- */
const canvas = $("bk"); let R;
try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { R = null; }
const tex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const lin = c => { const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t; };
const tCol = tex(cvCol), tMet = lin(cvMet), tRough = lin(cvRough), tPage = tex(cvPage), tLiner = tex(cvLiner);
let scene, cam, book, hinge, leaves = [], glow, inner, sparks, sg, sp, sv, dust, dg, dp, coverSide, edgeMat, NS = 220, ND = 160;
const W = 3, H = 4;
function build(){
  R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  scene = new THREE.Scene(); cam = new THREE.PerspectiveCamera(32, 1, .1, 200);
  scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = 1.0;
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x2a2018, .7));
  const key = new THREE.DirectionalLight(0xfff0dc, 1.9); key.position.set(-4, 5, 7); scene.add(key);
  const rim = new THREE.PointLight(0xffd9a0, 30, 20); rim.position.set(3.5, 2.5, -3); scene.add(rim);
  inner = new THREE.PointLight(0xfff1d6, 0, 9); inner.position.set(0, 0, 2); scene.add(inner);
  book = new THREE.Group(); scene.add(book);
  coverSide = new THREE.MeshPhysicalMaterial({ color: T().cover[1], roughness: .7, sheen: .5, sheenColor: new THREE.Color("#ffffff") });
  const coverFront = new THREE.MeshPhysicalMaterial({ map: tCol, metalnessMap: tMet, metalness: 1, roughnessMap: tRough, roughness: 1, clearcoat: .15, envMapIntensity: 1.4 });
  const liner = new THREE.MeshStandardMaterial({ map: tLiner, roughness: .8 });
  const ec = document.createElement("canvas"); ec.width = 16; ec.height = 256; const eg = ec.getContext("2d"); eg.fillStyle = "#F7F1E6"; eg.fillRect(0, 0, 16, 256); eg.fillStyle = "rgba(150,120,80,.18)"; for (let i = 0; i < 256; i += 3) eg.fillRect(0, i, 16, 1);
  const et = new THREE.CanvasTexture(ec); et.wrapS = et.wrapT = THREE.RepeatWrapping; edgeMat = new THREE.MeshStandardMaterial({ map: et, roughness: .9 });
  const pageMat = new THREE.MeshBasicMaterial({ map: tPage, color: 0xfbf8f3 }), paper = new THREE.MeshStandardMaterial({ color: "#FBF6EC", roughness: .9 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, .08), coverSide); back.position.z = -.29; book.add(back);
  const block = new THREE.Mesh(new THREE.BoxGeometry(W - .14, H - .18, .46), [edgeMat, edgeMat, edgeMat, edgeMat, pageMat, paper]); block.position.set(.04, 0, -.0); book.add(block);
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(.33, .33, H, 24, 1, false, Math.PI, Math.PI), coverSide); spine.position.set(-W / 2, 0, 0); spine.scale.x = .5; book.add(spine);
  hinge = new THREE.Group(); hinge.position.set(-W / 2, 0, .29); book.add(hinge);
  const cover = new THREE.Mesh(new THREE.BoxGeometry(W, H, .08), [coverSide, coverSide, coverSide, coverSide, coverFront, liner]); cover.position.x = W / 2; hinge.add(cover);
  for (let i = 0; i < 3; i++){ const h = new THREE.Group(); h.position.set(-W / 2 + .1, 0, .236 + i * .002); book.add(h);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W - .2, H - .24, 12, 1), new THREE.MeshStandardMaterial({ color: ["#FBF6EC", "#F8F1E4", "#FCF8F0"][i], roughness: .9, side: THREE.DoubleSide })); m.position.x = (W - .2) / 2; h.add(m); leaves.push(h); }
  const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.3, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0xfff0d0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); glow.position.set(.04, 0, .6); glow.scale.set(7, 8, 1); book.add(glow);
  sg = new THREE.BufferGeometry(); sp = new Float32Array(NS * 3); sv = []; for (let i = 0; i < NS; i++) sv.push([(Math.random() - .5) * 2.6, (Math.random() - .5) * 3.6, (Math.random() - .5) * 3, (Math.random() - .5) * 3, 1.5 + Math.random() * 4, Math.random()]);
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffe6a8, size: .09, map: dot, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); book.add(sparks);
  dg = new THREE.BufferGeometry(); dp = new Float32Array(ND * 3); for (let i = 0; i < ND; i++){ dp[i * 3] = (Math.random() - .5) * 14; dp[i * 3 + 1] = (Math.random() - .5) * 18; dp[i * 3 + 2] = -6 + Math.random() * 8; }
  dg.setAttribute("position", new THREE.BufferAttribute(dp, 3)); dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffdca0, size: .07, map: dot, transparent: true, opacity: .7, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(dust);
  size(); addEventListener("resize", size);
}
let base = 13;
function size(){ const w = innerWidth, h = innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); base = Math.max(11.5, 4.5 / (2 * Math.tan(THREE.MathUtils.degToRad(16)) * cam.aspect)); }
function repaint(){ paintCover(); paintPage(); paintLiner(); tCol.needsUpdate = tMet.needsUpdate = tRough.needsUpdate = tPage.needsUpdate = tLiner.needsUpdate = true; if (coverSide) coverSide.color.set(T().cover[1]); }
let dirty = true; const queue = () => { dirty = true; };

/* ---------- timeline ---------- */
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out = t => 1 - Math.pow(1 - t, 3);
const OPEN = 3.25, AUTO_TAP = 6.6;
let t0 = 0, viewFrom = 0, viewAt = 0, viewTo = 0, revealed = false, alive = true, autoStart = performance.now();
const G = now => typeof window.__G === "number" ? window.__G : Q.has("rec") ? 0 : (now - autoStart) / 1000;
function bookT(now){ if (typeof window.__gateT === "number") return window.__gateT; if (AUTO){ const g = G(now); return g >= AUTO_TAP ? g - AUTO_TAP : -1; } return t0 ? (now - t0) / 1000 : -1; }
function view(now){ if (AUTO) return ease(seg(G(now), 5.2, 6.3)); const k = ease(seg((now - viewAt) / 1000, 0, 1.1)); return viewFrom + (viewTo - viewFrom) * k; }
function frame(now){
  if (!alive) return; requestAnimationFrame(frame);
  if (AUTO) autoStep(G(now));
  if (dirty){ dirty = false; repaint(); }
  const t = bookT(now), idle = now / 1000, v = view(now), go = t >= 0;
  const calm = go ? 1 - ease(seg(t, 0, .7)) : 1;
  book.rotation.y = (-.42 + Math.sin(idle * .6) * .16) * calm; book.rotation.x = -.05 * calm; book.position.y = Math.sin(idle * 1.1) * .07 * calm;
  book.scale.setScalar(go ? 1 - .035 * Math.sin(seg(t, 0, .3) * Math.PI) : 1);
  hinge.rotation.y = go ? -ease(seg(t, .25, 1.6)) * 2.95 : 0;
  leaves.forEach((h, i) => { h.rotation.y = go ? -ease(seg(t, .7 + i * .14, 1.55 + i * .14)) * (2.9 - i * .07) : 0; });
  const li = go ? seg(t, 1.2, 2.1) * (1 - seg(t, 3.1, 3.6)) : 0; glow.material.opacity = li * .14; inner.intensity = li * 2.5;
  const sk = go ? seg(t, 1.3, 3.4) : 0; sparks.material.opacity = Math.sin(sk * Math.PI) * .95;
  for (let i = 0; i < NS; i++){ const s = sv[i], k = Math.max(0, (go ? t : 0) - 1.3 - s[5] * .5); sp[i * 3] = s[0] + s[3] * k * .6; sp[i * 3 + 1] = s[1] + k * (.4 + s[5] * .6) + Math.sin(idle * 2 + i) * .03; sp[i * 3 + 2] = .3 + s[4] * k * .55; }
  sg.attributes.position.needsUpdate = true;
  for (let i = 0; i < ND; i++){ dp[i * 3 + 1] += .004 + (i % 5) * .0012; if (dp[i * 3 + 1] > 9) dp[i * 3 + 1] = -9; } dg.attributes.position.needsUpdate = true;
  /* camera: in the form the book sits high and small; on the gate it is centred; on opening the camera flies to the page */
  const formM = 2.15, M = formM + (1 - formM) * v, dist = base * M, Hv = 2 * Math.tan(THREE.MathUtils.degToRad(16)) * dist, lift = .25 * Hv * (1 - v);
  const dive = go ? ease(seg(t, 1.7, 3.3)) : 0, dz = dist + (Math.min(dist, 8.6) - dist) * dive;
  cam.position.set(0, -lift + .25 * (1 - dive), dz); cam.lookAt(0, -lift, 0);
  if (go){ const f = seg(t, 2.75, 3.2) * (1 - seg(t, 3.35, 4.1)); $("flash").style.opacity = String(f); if (t >= OPEN && !revealed) reveal(); if (t > 4.3) { alive = false; R.dispose(); } }
  R.render(scene, cam);
}

/* ---------- the flow: form → book → page ---------- */
const form = $("mk"), inA = $("inA"), inB = $("inB"), inD = $("inD"), inC = $("inC");
function setType(k){ S.t = k; root.dataset.type = k; if (TYPES[k].two) delete root.dataset.single; else root.dataset.single = ""; document.querySelectorAll("#types button").forEach(b => b.classList.toggle("on", b.dataset.t === k)); inA.placeholder = TYPES[k].two ? "მაგ. ნინო" : "მაგ. ელენე"; queue(); }
document.querySelectorAll("#types button").forEach(b => b.addEventListener("click", () => setType(b.dataset.t)));
inA.value = S.a; inB.value = S.b; inD.value = S.d; inC.value = S.c; inD.min = new Date().toISOString().slice(0, 10);
[["a", inA, 16], ["b", inB, 16], ["c", inC, 18]].forEach(([k, el, n]) => el.addEventListener("input", () => { S[k] = clean(el.value, n); queue(); }));
inD.addEventListener("input", () => { S.d = /^\d{4}-\d{2}-\d{2}$/.test(inD.value) ? inD.value : ""; queue(); });
function link(){ const p = new URLSearchParams({ t: S.t, a: A() }); if (T().two) p.set("b", B()); p.set("d", D()); p.set("c", C()); return location.origin + location.pathname + "?" + p.toString(); }
function toGate(){ $("gNames").textContent = shown(); root.dataset.s = "gate"; viewFrom = view(performance.now()); viewAt = performance.now(); viewTo = 1; }
form.addEventListener("submit", e => { e.preventDefault(); if (!S.a){ inA.focus(); inA.placeholder = "ჯერ სახელი ჩაწერე ✍️"; return; } try { history.replaceState(null, "", link().replace(location.origin, "")); sessionStorage.setItem("ambavi-mine", "1"); } catch (_) {} document.activeElement && document.activeElement.blur(); toGate(); });
function open(){ if (root.dataset.s !== "gate" || t0) return; t0 = performance.now(); root.classList.add("go"); try { if (window.Music && !AUTO) Music.start(T().song); } catch (_) {} }
document.addEventListener("click", e => { if (root.dataset.s === "gate" && !e.target.closest(".form")) open(); });
document.addEventListener("keydown", e => { if (root.dataset.s === "gate" && (e.key === "Enter" || e.key === " ")) open(); });
window.Ambavi = { open };

function reveal(){
  revealed = true; const t = T(), p = dparts(), page = $("page");
  $("pTop").textContent = t.top; $("pA").textContent = A(); $("pB").textContent = t.two ? B() : ""; $("pLine").textContent = t.line;
  $("pDay").textContent = p.d; $("pMonth").textContent = MONTHS[p.m - 1] || ""; $("pYear").textContent = p.y; $("pCity").textContent = C();
  $("prog").innerHTML = ""; t.prog.forEach(([tm, a, b]) => { const li = document.createElement("li"); li.innerHTML = "<b></b><span></span><em></em>"; li.children[0].textContent = tm; li.children[1].textContent = a; li.children[2].textContent = b; $("prog").appendChild(li); });
  let mine = false; try { mine = !!sessionStorage.getItem("ambavi-mine"); } catch (_) {}
  const tag = $("tag"); tag.textContent = ""; if (mine || AUTO) tag.textContent = "✨ ეს შენი დემო მოსაწვევია — გაუზიარე მეგობრებს!";
  else { tag.append("✨ შენც გინდა ასეთი? "); const a = document.createElement("a"); a.href = location.pathname; a.textContent = "შექმენი უფასოდ →"; tag.append(a); $("again").textContent = "შექმენი შენი მოსაწვევი"; }
  page.hidden = false; requestAnimationFrame(() => { root.dataset.s = "page"; scrollTo(0, 0); });
  const url = link(), msg = (t.two ? A() + " და " + B() : A()) + " — ნახე მოსაწვევი ✨ ";
  $("shWa").href = "https://wa.me/?text=" + encodeURIComponent(msg + url); $("shFb").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
  $("share").onclick = async () => { if (navigator.share){ try { await navigator.share({ title: "მოსაწვევი", text: msg, url }); } catch (_) {} } else copy(url); };
  $("copy").onclick = () => copy(url);
  $("again").onclick = () => { try { sessionStorage.removeItem("ambavi-mine"); } catch (_) {} location.href = location.pathname; };
  tick(); setInterval(tick, 1000);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach(el => io.observe(el)); if (AUTO) document.querySelectorAll(".rv").forEach(el => el.classList.add("in"));
}
function tick(){ const ms = Math.max(0, new Date(D() + "T17:00:00") - Date.now()), s = Math.floor(ms / 1000); $("cD").textContent = Math.floor(s / 86400); $("cH").textContent = Math.floor(s / 3600) % 24; $("cM").textContent = Math.floor(s / 60) % 60; $("cS").textContent = s % 60; }
function copy(u){ const done = () => toast("ბმული დაკოპირდა ✓"); try { navigator.clipboard.writeText(u).then(done, () => toast(u)); } catch (_) { toast(u); } }
function toast(s){ const el = $("toast"); el.textContent = s; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2200); }
$("mus").addEventListener("click", () => { if (!window.Music) return; if (Music.playing){ Music.pause(); $("mus").classList.add("off"); } else { Music.start(T().song); $("mus").classList.remove("off"); } });

/* ?auto — types the names, presses the button and opens the book by itself (for promo videos) */
const AU = { a: Q.get("a") || "ნინო", b: Q.get("b") || "გიორგი" };
function autoStep(g){
  if (root.dataset.s === "form"){
    const ta = Math.floor(seg(g, 1.0, 2.6) * AU.a.length + .001), tb = Math.floor(seg(g, 2.9, 4.5) * AU.b.length + .001);
    const a = AU.a.slice(0, ta), b = AU.b.slice(0, tb); if (a !== S.a || b !== S.b){ S.a = inA.value = a; S.b = inB.value = b; queue(); }
    $("make").classList.toggle("press", g > 4.85 && g < 5.1);
    if (g >= 5.2){ $("gNames").textContent = shown(); root.dataset.s = "gate"; }
  } else if (root.dataset.s === "gate" && g >= AUTO_TAP && !root.classList.contains("go")) root.classList.add("go");
}

/* ---------- start ---------- */
setType(S.t);
if (AUTO){ S.a = S.b = ""; inA.value = inB.value = ""; S.d = Q.get("d") || S.d; inD.value = S.d; }
else if (S.a) toGate();
Promise.race([Promise.all(['500 80px "Noto Serif Georgian"', '400 80px "Great Vibes"', '600 60px "Cormorant Garamond"'].map(f => document.fonts.load(f, "ნინო & 2027"))), new Promise(r => setTimeout(r, 3500))]).then(() => {
  if (!R){ document.querySelector(".stage").style.background = "radial-gradient(120% 80% at 50% 30%,var(--bg1),var(--bg2))"; window.Ambavi.open = () => { root.classList.add("go"); reveal(); }; return; }
  build(); repaint(); autoStart = performance.now(); requestAnimationFrame(frame);
});
