/* ამბავი · გახსნა „ქუდები ჰაერში“ (Three.js): ტივტივებს გამოსაშვები ქუდი ოქროს თასმით, ცაზე ვარსკვლავები.
   შეხებისას: ქუდი იხრება → ქვემოდან ბევრი ქუდი ტრიალით ისვრის ზევით → კამერა მათ მიჰყვება → ოქროს კონფეტი წვიმს → გვერდი იხსნება */
(function(){
  const gate = document.getElementById("gate"); if (!gate || gate.hidden) return;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  Promise.all([import("three"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js")]).then(([T, E]) => build(T, E.RoomEnvironment)).catch(e => console.warn("caps:", e));
  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas"); canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let R; try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.firstChild); R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, .1, 200); cam.position.set(0, 0, 11);
    scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture;
    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x1a2040, .8)); const key = new THREE.DirectionalLight(0xfff2dc, 2.4); key.position.set(-3, 6, 6); scene.add(key);
    const rim = new THREE.PointLight(0x8fb4ff, 40, 20); rim.position.set(3, 2, -3); scene.add(rim);
    const black = new THREE.MeshPhysicalMaterial({ color: "#171A24", roughness: .5, sheen: .6, sheenColor: new THREE.Color("#5A6690"), side: THREE.DoubleSide });
    const gold = new THREE.MeshPhysicalMaterial({ color: "#E3BD6A", metalness: 1, roughness: .2 });
    function cap(){ const G = new THREE.Group();
      const skull = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, .85, 40, 1, true), black); skull.position.y = -.43; G.add(skull);
      G.add(new THREE.Mesh(new THREE.BoxGeometry(2.8, .08, 2.8), black)); G.children[1].rotation.y = Math.PI / 4;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .07, 16), gold); b.position.y = .07; G.add(b);
      G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, .09, 0), new THREE.Vector3(1.1, .05, 0), new THREE.Vector3(1.95, .02, 0), new THREE.Vector3(2.0, -.6, 0), new THREE.Vector3(2.02, -1.0, 0)]), 50, .028, 8), gold));
      const ts = new THREE.Mesh(new THREE.CylinderGeometry(.05, .13, .5, 16), gold); ts.position.set(2.02, -1.25, 0); G.add(ts);
      return G; }
    const hero = cap(); hero.rotation.set(.45, -.6, .1); scene.add(hero);
    const flyers = []; for (let i = 0; i < 9; i++){ const c = cap(); c.scale.setScalar(.55 + Math.random() * .35); c.visible = false; scene.add(c); flyers.push({ c, x: (Math.random() - .5) * 8, d: Math.random() * .5, h: 9 + Math.random() * 9, z: -2 + Math.random() * 4, r: [Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4] }); }
    const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.35, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const NS = 500, sg = new THREE.BufferGeometry(), sp = new Float32Array(NS * 3); for (let i = 0; i < NS; i++){ sp[i * 3] = (Math.random() - .5) * 30; sp[i * 3 + 1] = Math.random() * 40 - 10; sp[i * 3 + 2] = -15 + Math.random() * 10; }
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: .08, map: dot, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
    const conf = []; for (let i = 0; i < 170; i++){ const m = new THREE.Mesh(new THREE.PlaneGeometry(.09, .18), gold); m.visible = false; scene.add(m); conf.push({ m, x: (Math.random() - .5) * 10, y: 10 + Math.random() * 12, z: -2 + Math.random() * 5, v: 2.5 + Math.random() * 3, r: [Math.random() * 6, Math.random() * 6] }); }
    function size(){ const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    size(); addEventListener("resize", size);
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let t0 = 0, alive = true; const K = REDUCED ? .25 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
    function frame(now){
      if (!alive){ R.dispose(); return; } requestAnimationFrame(frame);
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      const dip = Math.sin(seg(t, 0, .35) * Math.PI) * .6, up = seg(t, .3, 2.6);
      hero.position.set(0, .3 + Math.sin(idle * 1.2) * .12 - dip + up * up * 15, -up * up * 9);
      hero.rotation.set(.45 + up * 9, -.6 + idle * .25 * (1 - up) + up * 5, .1 + up * 4);
      for (const f of flyers){ const k = seg(t, .35 + f.d, 2.9 + f.d); f.c.visible = k > 0; if (!k) continue; const y = -7 + f.h * Math.sin(k * Math.PI * .62) * 1.4; f.c.position.set(f.x * (.4 + k * .8), y, f.z); f.c.rotation.set(f.r[0] * k, f.r[1] * k, f.r[2] * k); }
      const cu = ease(seg(t, .5, 2.8)); cam.position.set(0, cu * 6, 11 - cu * 2); cam.lookAt(0, cu * 9, 0);
      for (const c of conf){ const k = Math.max(0, t - 1.0); c.m.visible = k > 0 && k < 3; if (!c.m.visible) continue; c.m.position.set(c.x + Math.sin(k * 2 + c.r[0]) * .4, c.y - k * c.v, c.z); c.m.rotation.set(c.r[0] + k * 5, c.r[1] + k * 4, 0); }
      R.render(scene, cam);
    }
    requestAnimationFrame(frame); gate.classList.add("has3d");
  }
})();
