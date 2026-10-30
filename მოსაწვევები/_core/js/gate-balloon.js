/* ამბავი · გახსნა „ბუშტი სკდება“ (Three.js): დიდი ვარდისფერ-ცისფერი ბუშტი ოქროს „?“-ით, ირგვლივ პატარა ბუშტები.
   შეხებისას: ბუშტი იჭიმება → სკდება ნაფლეთებად და კონფეტად → ჩნდება დიდი პასუხი (.g-reveal) → პატარა ბუშტები ცაში მიფრინავს
   → გვერდი იხსნება. config.js → balloon: { a: "#FF9CBB", b: "#8EC9F2" } */
(function(){
  const gate = document.getElementById("gate"); if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, B = Object.assign({ a: "#FF9CBB", b: "#8EC9F2" }, C.balloon || {}), REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  Promise.all([import("three"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js")]).then(([T, E]) => build(T, E.RoomEnvironment)).catch(e => console.warn("balloon:", e));
  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas"); canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let R; try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.firstChild); R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, .1, 100); cam.position.set(0, 0, 11);
    scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdcc8e6, 1.0)); const key = new THREE.DirectionalLight(0xfff6ee, 2); key.position.set(-3, 5, 6); scene.add(key);
    const shape = (s) => { const geo = new THREE.SphereGeometry(1, 64, 48), p = geo.attributes.position; for (let i = 0; i < p.count; i++){ const y = p.getY(i); p.setY(i, y * 1.18); const k = 1 - Math.max(0, -y) * .25; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } geo.computeVertexNormals(); return geo; };
    /* the big balloon: a pink→blue swirl with a gold question mark painted on the front */
    const tex = (() => { const c = document.createElement("canvas"); c.width = 1024; c.height = 512; const g = c.getContext("2d"); const gr = g.createLinearGradient(0, 0, 1024, 0); gr.addColorStop(0, B.b); gr.addColorStop(.25, B.a); gr.addColorStop(.5, B.b); gr.addColorStop(.75, B.a); gr.addColorStop(1, B.b); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
      g.font = '700 300px "Fredoka", "Noto Sans Georgian", sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#F4CF7A"; g.strokeStyle = "rgba(160,110,40,.6)"; g.lineWidth = 8; g.strokeText("?", 256, 270); g.fillText("?", 256, 270);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const big = new THREE.Mesh(shape(), new THREE.MeshPhysicalMaterial({ map: tex, roughness: .16, clearcoat: 1, clearcoatRoughness: .05 })); big.scale.setScalar(1.7); big.rotation.y = -Math.PI / 2; scene.add(big);
    const knot = new THREE.Mesh(new THREE.ConeGeometry(.16, .26, 16), new THREE.MeshPhysicalMaterial({ color: B.a })); knot.rotation.x = Math.PI; scene.add(knot);
    const str = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(.25, -1.6, 0), new THREE.Vector3(-.2, -3.4, 0), new THREE.Vector3(0, -5, 0)]), 40, .012, 6), new THREE.MeshStandardMaterial({ color: 0xffffff })); scene.add(str);
    const smalls = [[-2.6, 3.0, -1.5, .7, B.a], [2.7, 2.6, -1.2, .75, B.b], [-2.9, -1.4, -1, .6, B.b], [2.9, -1.0, -1.4, .62, B.a], [-1.3, 4.3, -2.5, .55, B.b], [1.5, 4.5, -2.6, .55, B.a]].map(([x, y, z, s, c]) => { const m = new THREE.Mesh(shape(), new THREE.MeshPhysicalMaterial({ color: c, roughness: .18, clearcoat: 1 })); m.position.set(x, y, z); m.scale.setScalar(s); scene.add(m); return { m, x, y, z, ph: Math.random() * 6 }; });
    /* shards and confetti for the pop */
    const tri = new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(.32, .05), new THREE.Vector2(.12, .3)]));
    const shards = []; for (let i = 0; i < 60; i++){ const m = new THREE.Mesh(tri, new THREE.MeshPhysicalMaterial({ color: i % 2 ? B.a : B.b, roughness: .2, clearcoat: 1, side: THREE.DoubleSide, transparent: true })); m.visible = false; scene.add(m); const a = Math.random() * 6.28, e = (Math.random() - .5) * 2; shards.push({ m, v: [Math.cos(a) * Math.cos(e) * (3 + Math.random() * 4), Math.sin(e) * 4 + 1, Math.sin(a) * Math.cos(e) * 2], r: [Math.random() * 9, Math.random() * 9, Math.random() * 9] }); }
    const confC = [B.a, B.b, "#FFFFFF", "#F4CF7A"].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .5, side: THREE.DoubleSide, transparent: true }));
    const conf = []; for (let i = 0; i < 180; i++){ const m = new THREE.Mesh(i % 3 ? new THREE.PlaneGeometry(.1, .2) : new THREE.CircleGeometry(.07, 12), confC[i % 4]); m.visible = false; scene.add(m); const a = Math.random() * 6.28, sp = 2 + Math.random() * 6; conf.push({ m, v: [Math.cos(a) * sp, Math.sin(a) * sp * .8 + 2, (Math.random() - .5) * 3], r: [Math.random() * 6, Math.random() * 6] }); }
    const reveal = gate.querySelector(".g-reveal");
    function size(){ const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.position.z = Math.max(11, 7.4 / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * cam.aspect)); cam.updateProjectionMatrix(); }
    size(); addEventListener("resize", size);
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), out = t => 1 - Math.pow(1 - t, 3), backE = t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
    let t0 = 0, alive = true; const K = REDUCED ? .25 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
    function frame(now){
      if (!alive){ R.dispose(); return; } requestAnimationFrame(frame);
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      const bob = Math.sin(idle * 1.3) * .12, stretch = seg(t, 0, .32), popped = t >= .32;
      big.visible = knot.visible = str.visible = !popped;
      big.position.set(0, .5 + bob, 0); big.rotation.z = Math.sin(idle * .8) * .05;
      big.scale.set(1.7 * (1 + stretch * .12), 1.7 * (1 + stretch * .2), 1.7 * (1 + stretch * .12));
      knot.position.set(0, .5 + bob - 2.08 * (1 + stretch * .2), 0); str.position.set(0, knot.position.y - .12, 0);
      const pt = Math.max(0, t - .32);
      for (const s of shards){ s.m.visible = popped && pt < 2.2; if (!s.m.visible) continue; s.m.position.set(s.v[0] * pt, .5 + s.v[1] * pt - 4 * pt * pt, s.v[2] * pt); s.m.rotation.set(s.r[0] * pt, s.r[1] * pt, s.r[2] * pt); s.m.material.opacity = 1 - seg(pt, 1.2, 2.2); }
      for (const c of conf){ c.m.visible = popped && pt < 3; if (!c.m.visible) continue; const d = 1 - Math.exp(-pt * 1.6); c.m.position.set(c.v[0] * d, .5 + c.v[1] * d - pt * pt * .9, c.v[2] * d); c.m.rotation.set(c.r[0] + pt * 6, c.r[1] + pt * 5, 0); c.m.material.opacity = 1 - seg(pt, 2.2, 3); }
      for (const s of smalls){ const f = out(seg(t, .4, 2.6)); s.m.position.set(s.x + Math.sin(idle + s.ph) * .1, s.y + Math.sin(idle * 1.2 + s.ph) * .15 + f * 9, s.z); }
      if (reveal){ const r = seg(t, .4, 1.1); reveal.style.opacity = String(Math.min(1, r * 1.6) * (1 - seg(t, 2.6, 3.0))); reveal.style.transform = "translate(-50%,-50%) scale(" + (t > .4 ? backE(r) : 0) + ")"; }
      R.render(scene, cam);
    }
    requestAnimationFrame(frame); gate.classList.add("has3d");
  }
})();
