/* ამბავი · გახსნა „ვერტიკალური კონვერტი“ (Three.js): მთელ ეკრანზე ორნაწილიანი კონვერტი, შუა ნაკერზე ვერტიკალური ატლასის
   ლენტი და ცვილის ბეჭედი. შეხებისას: ბეჭედი იბზარება → ორი ნახევარი კარივით იღება გარეთ → შიგნიდან სინათლე იღვრება,
   გვერდებიდან ფურცლები და ოქროს ნაპერწკლები მოედინება → გვერდი იხსნება.
   config.js → doors: { paper: ["#FCF9F3","#EDE5D8"], ribbon: "#E9DCCB", seal: "#CDB79A", gold: "#B9A07A", top: "Save the date", bottom: "12 · 06 · 2027" } */
(function(){
  const gate = document.getElementById("gate"); if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const L = v => (v && typeof v === "object") ? (v[document.documentElement.lang] || v.ka || "") : (v || "");
  const D = Object.assign({ paper: ["#FCF9F3", "#EDE5D8"], ribbon: "#EFE4D4", seal: "#CDB79A", gold: "#B9A07A", top: "Save the date", bottom: "" }, C.doors || {});
  Promise.all([import("three"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"), document.fonts.ready]).then(([T, E]) => build(T, E.RoomEnvironment)).catch(e => console.warn("doors:", e));
  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas"); canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let R; try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.firstChild); R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = .95;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, .1, 100); cam.position.set(0, 0, 10);
    scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .6;
    scene.add(new THREE.HemisphereLight(0xfffaf0, 0xd9cbb5, 1.0));
    const key = new THREE.DirectionalLight(0xfff2de, 1.6); key.position.set(-3, 4, 7); scene.add(key);
    const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    const VH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(15)) * 1.02, VW = VH * cam.aspect * 1.02;
    /* one painting for the whole front, split into two halves */
    const PW = 900, PH = Math.round(900 * VH / VW);
    const paint = document.createElement("canvas"); paint.width = PW; paint.height = PH; const g = paint.getContext("2d");
    const gr = g.createLinearGradient(0, 0, PW * .4, PH); gr.addColorStop(0, D.paper[0]); gr.addColorStop(1, D.paper[1]); g.fillStyle = gr; g.fillRect(0, 0, PW, PH);
    const id = g.getImageData(0, 0, PW, PH), dd = id.data; for (let i = 0; i < dd.length; i += 4){ const n = (Math.random() - .5) * 10; dd[i] += n; dd[i + 1] += n; dd[i + 2] += n; } g.putImageData(id, 0, 0);
    g.strokeStyle = D.gold; g.lineWidth = 3; g.strokeRect(34, 34, PW - 68, PH - 68); g.lineWidth = 1.2; g.strokeRect(50, 50, PW - 100, PH - 100);
    const flourish = (x, y, sx, sy) => { g.save(); g.translate(x, y); g.scale(sx, sy); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(60, 0, 90, 30, 90, 80); g.moveTo(0, 0); g.bezierCurveTo(0, 60, 30, 90, 80, 90); g.moveTo(20, 20); g.bezierCurveTo(50, 22, 62, 40, 60, 60); g.stroke(); g.beginPath(); g.arc(22, 22, 5, 0, 7); g.fill(); g.restore(); };
    g.fillStyle = D.gold; g.lineWidth = 1.6; flourish(60, 60, 1, 1); flourish(PW - 60, 60, -1, 1); flourish(60, PH - 60, 1, -1); flourish(PW - 60, PH - 60, -1, -1);
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = D.gold;
    g.font = '400 ' + Math.round(PW * .13) + 'px "Great Vibes", cursive'; g.fillText(L(D.top), PW / 2, PH * .2);
    g.font = '500 ' + Math.round(PW * .052) + 'px "Cormorant Garamond", serif'; if ("letterSpacing" in g) g.letterSpacing = "10px"; g.fillText(L(D.bottom), PW / 2, PH * .8); if ("letterSpacing" in g) g.letterSpacing = "0px";
    g.lineWidth = 1.5; g.beginPath(); g.arc(PW / 2, PH / 2, PW * .2, 0, 7); g.stroke(); g.beginPath(); g.arc(PW / 2, PH / 2, PW * .215, 0, 7); g.stroke();
    const half = side => { const c = document.createElement("canvas"); c.width = PW / 2; c.height = PH; c.getContext("2d").drawImage(paint, side ? PW / 2 : 0, 0, PW / 2, PH, 0, 0, PW / 2, PH); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
    const paperM = t => new THREE.MeshStandardMaterial({ map: t, roughness: .85, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .38 });
    const edgeM = new THREE.MeshStandardMaterial({ color: D.paper[1], roughness: .9 });
    /* light behind the doors */
    const glowT = (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const q = c.getContext("2d"); const r = q.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, "rgba(255,248,232,1)"); r.addColorStop(.5, "rgba(255,236,200,.7)"); r.addColorStop(1, "rgba(255,230,190,0)"); q.fillStyle = r; q.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(VW * 2.2, VH * 1.6), new THREE.MeshBasicMaterial({ map: glowT, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); glow.position.z = -1; scene.add(glow);
    const waxT = (() => { const c = document.createElement("canvas"); c.width = c.height = 512; const q = c.getContext("2d"); q.fillStyle = "#9a9a9a"; q.fillRect(0, 0, 512, 512); q.fillStyle = "#d0d0d0"; q.beginPath(); q.arc(256, 256, 190, 0, 7); q.fill(); for (let k = 0; k < 28; k++){ const a = k / 28 * 6.283; q.fillStyle = "#ececec"; q.beginPath(); q.arc(256 + Math.cos(a) * 160, 256 + Math.sin(a) * 160, 6, 0, 7); q.fill(); } q.font = '500 120px "Noto Serif Georgian", serif'; q.fillStyle = "#f6f6f6"; q.textAlign = "center"; q.textBaseline = "middle"; q.fillText(C.monogram || "", 256, 264); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const doors = [0, 1].map(side => {
      const s = side ? 1 : -1, P = new THREE.Group(); P.position.x = s * VW / 2; scene.add(P);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(VW / 2, VH, .05), [edgeM, edgeM, edgeM, edgeM, paperM(half(side)), edgeM]); panel.position.set(-s * VW / 4, 0, 0); P.add(panel);
      const rib = new THREE.Mesh(new THREE.BoxGeometry(.2, VH, .02), new THREE.MeshPhysicalMaterial({ color: D.ribbon, roughness: .35, sheen: 1, sheenColor: new THREE.Color("#ffffff") })); rib.position.set(-s * (VW / 2 - .1), 0, .04); P.add(rib);
      const sg = new THREE.CylinderGeometry(.62, .64, .12, 48, 1, false, side ? 0 : Math.PI, Math.PI), sp = sg.attributes.position;
      for (let i = 0; i < sp.count; i++){ const x = sp.getX(i), z = sp.getZ(i), r = Math.hypot(x, z); if (r < .3) continue; const a = Math.atan2(z, x), k = 1 + .05 * Math.sin(5 * a) + .03 * Math.sin(11 * a + 1); sp.setX(i, x * k); sp.setZ(i, z * k); } sg.computeVertexNormals();
      const seal = new THREE.Mesh(sg, [new THREE.MeshStandardMaterial({ color: D.seal, roughness: .4 }), new THREE.MeshStandardMaterial({ color: D.seal, map: waxT, bumpMap: waxT, bumpScale: 2.5, roughness: .32 }), new THREE.MeshStandardMaterial({ color: D.seal })]);
      seal.rotation.x = Math.PI / 2; seal.position.set(-s * VW / 2, 0, .1); P.add(seal);
      return { P, s, seal };
    });
    /* petals and sparks that stream in from both sides */
    const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const q = c.getContext("2d"); const r = q.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.35, "rgba(255,255,255,.6)"); r.addColorStop(1, "rgba(255,255,255,0)"); q.fillStyle = r; q.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const NS = 320, sg2 = new THREE.BufferGeometry(), spos = new Float32Array(NS * 3), sv = [];
    for (let i = 0; i < NS; i++){ const s = i % 2 ? 1 : -1; sv.push([s, (Math.random() - .5) * VH, Math.random() * .8, .6 + Math.random() * 1.6, Math.random() * 6]); }
    sg2.setAttribute("position", new THREE.BufferAttribute(spos, 3)); const sparks = new THREE.Points(sg2, new THREE.PointsMaterial({ color: 0xf3d79a, size: .1, map: dot, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(sparks);
    const petG = new THREE.PlaneGeometry(.22, .3); const petals = [];
    for (let i = 0; i < 46; i++){ const m = new THREE.Mesh(petG, new THREE.MeshStandardMaterial({ color: i % 3 ? "#FBF3EE" : "#F2D9D2", roughness: .6, side: THREE.DoubleSide, transparent: true, opacity: 0 })); scene.add(m); petals.push({ m, s: i % 2 ? 1 : -1, y: (Math.random() - .5) * VH, d: Math.random() * .5, v: .7 + Math.random() * .8, r: [Math.random() * 6, Math.random() * 6] }); }
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), back = t => { const c1 = 1.3, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }, out = t => 1 - Math.pow(1 - t, 3);
    let t0 = 0, alive = true; const K = REDUCED ? .25 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
    function frame(now){
      if (!alive){ R.dispose(); return; } requestAnimationFrame(frame);
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      const press = Math.sin(seg(t, 0, .3) * Math.PI) * .08, crack = out(seg(t, .3, .9)), op = back(seg(t, .6, 2.0));
      for (const d of doors){
        d.seal.scale.setScalar(1 - press + Math.sin(idle * 2) * .01 * (1 - seg(t, 0, .2)));
        d.seal.rotation.z = d.s * crack * .25;
        d.P.rotation.y = d.s * Math.min(op, 1.05) * 1.75;
        d.P.position.z = op * .4;
      }
      glow.material.opacity = seg(t, .55, 1.4) * (1 - seg(t, 2.7, 3.1)) + Math.sin(idle * 1.5) * .0;
      const sp = seg(t, .4, 2.9);
      for (let i = 0; i < NS; i++){ const v = sv[i], k = Math.max(0, Math.min(1, sp * 1.4 - v[2])), e = out(k);
        spos[i * 3] = v[0] * (VW * .55 - e * VW * .5 * (.5 + v[3] * .3)); spos[i * 3 + 1] = v[1] + Math.sin(e * 6 + v[4]) * .5; spos[i * 3 + 2] = .3 + e * 1.5; }
      sg2.attributes.position.needsUpdate = true; sparks.material.opacity = t > .4 ? Math.sin(sp * Math.PI) : 0;
      for (const p of petals){ const k = Math.max(0, seg(t, .5 + p.d, 2.8 + p.d)), e = out(k);
        p.m.position.set(p.s * (VW * .6 - e * VW * .55 * p.v), p.y - e * 1.4 + Math.sin(e * 5 + p.r[0]) * .4, .5 + e * 2.5);
        p.m.rotation.set(p.r[0] + e * 5, p.r[1] + e * 4, e * 3); p.m.material.opacity = Math.sin(k * Math.PI) * .95; }
      R.render(scene, cam);
    }
    requestAnimationFrame(frame); gate.classList.add("has3d");
  }
})();
