/* ამბავი · გახსნა „საჩუქრის ყუთი“ (Three.js): 3D ყუთი ოქროს ლენტით და ბაფთით, თოვს.
   შეხებისას: ხუფი კანკალებს → ცაში ტრიალით მიფრინავს → ყუთიდან ოქროს სინათლის სვეტი ამოდის და ვარსკვლავები იფანტება →
   კამერა ყუთის სინათლეში შედის → გვერდი იხსნება. config.js → gift: { box, ribbon } */
(function(){
  const gate = document.getElementById("gate"); if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, G = Object.assign({ box: "#9E1B2E", ribbon: "#E2BE6E" }, C.gift || {}), REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  Promise.all([import("three"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js")]).then(([T, E]) => build(T, E.RoomEnvironment)).catch(e => console.warn("gift:", e));
  function build(THREE, RoomEnvironment){
    const canvas = document.createElement("canvas"); canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let R; try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.firstChild); R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping;
    R.shadowMap.enabled = true;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, .1, 100);
    scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x223355, .6));
    const key = new THREE.DirectionalLight(0xfff0d8, 2.2); key.position.set(-3, 5, 5); key.castShadow = true; scene.add(key);
    const glowL = new THREE.PointLight(0xffd88a, 0, 12); glowL.position.set(0, .6, 0); scene.add(glowL);
    const boxM = new THREE.MeshPhysicalMaterial({ color: G.box, roughness: .25, clearcoat: 1, clearcoatRoughness: .1 });
    const ribM = new THREE.MeshPhysicalMaterial({ color: G.ribbon, metalness: 1, roughness: .2 });
    const add = (g, m, p) => { const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
    const B = new THREE.Group(); scene.add(B);
    add(new THREE.BoxGeometry(2, 1.5, 2), boxM, B).position.y = -.75;
    add(new THREE.BoxGeometry(2.03, 1.5, .3), ribM, B).position.y = -.75; add(new THREE.BoxGeometry(.3, 1.5, 2.03), ribM, B).position.y = -.75;
    const inside = add(new THREE.PlaneGeometry(1.94, 1.94), new THREE.MeshBasicMaterial({ color: 0xfff1c8 }), B); inside.rotation.x = -Math.PI / 2; inside.position.y = -.02; inside.material.transparent = true; inside.material.opacity = 0;
    const lid = new THREE.Group(); lid.position.y = .18; B.add(lid);
    add(new THREE.BoxGeometry(2.16, .36, 2.16), boxM, lid); add(new THREE.BoxGeometry(2.19, .37, .3), ribM, lid); add(new THREE.BoxGeometry(.3, .37, 2.19), ribM, lid);
    for (const s of [-1, 1]){ const loop = add(new THREE.TorusGeometry(.36, .1, 16, 40), ribM, lid); loop.scale.set(1.35, 1, .6); loop.position.set(s * .42, .48, 0); loop.rotation.z = s * .55; }
    add(new THREE.SphereGeometry(.15, 20, 14), ribM, lid).position.y = .3;
    for (const s of [-1, 1]){ const tail = add(new THREE.BoxGeometry(.18, .02, .7), ribM, lid); tail.position.set(s * .25, .2, .45); tail.rotation.set(.3, s * .5, 0); }
    /* light beam */
    const beamT = (() => { const c = document.createElement("canvas"); c.width = 4; c.height = 256; const g = c.getContext("2d"); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(.6, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,1)"); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); return new THREE.CanvasTexture(c); })();
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.4, .95, 9, 48, 1, true), new THREE.MeshBasicMaterial({ color: 0xffdc8f, alphaMap: beamT, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    beam.position.y = 4.5; B.add(beam);
    /* particles */
    const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.35, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const pts = (n, color, size) => { const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color, size, map: dot, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(m); return { g, p, m }; };
    const snow = pts(700, 0xffffff, .06), sv = []; for (let i = 0; i < 700; i++){ sv.push([(Math.random() - .5) * 12, Math.random() * 14 - 6, (Math.random() - .5) * 8, .3 + Math.random() * .6]); }
    const stars = pts(320, 0xffd98a, .12), st = []; for (let i = 0; i < 320; i++){ const a = Math.random() * 6.28, sp = 1 + Math.random() * 4; st.push([Math.cos(a) * sp * .6, 3 + Math.random() * 6, Math.sin(a) * sp * .6, Math.random() * .6]); }
    const flash = gate.querySelector(".g-flash");
    let base = 9;
    function size(){ const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); base = Math.max(7.5, 3.6 / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * cam.aspect)); }
    size(); addEventListener("resize", size);
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out = t => 1 - Math.pow(1 - t, 3);
    let t0 = 0, alive = true, last = performance.now(); const K = REDUCED ? .25 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
    function frame(now){
      if (!alive){ R.dispose(); return; } requestAnimationFrame(frame);
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      B.rotation.y = .6 + Math.sin(idle * .5) * .25 * (1 - seg(t, 0, .5)); B.position.y = Math.sin(idle * 1.2) * .06 - .2;
      /* lid: shake, then fly */
      const sh = seg(t, 0, .5) * (1 - seg(t, .45, .5)); lid.rotation.z = Math.sin(t * 70) * .07 * sh; lid.rotation.x = Math.cos(t * 55) * .05 * sh;
      const fl = out(seg(t, .5, 1.6)); lid.position.set(fl * 2.2, .18 + fl * 5.5, fl * 1.5); if (fl > 0){ lid.rotation.set(fl * 2.4, fl * 1.2, fl * 3.1); }
      inside.material.opacity = seg(t, .55, .9);
      const bm = seg(t, .65, 1.4) * (1 - seg(t, 2.8, 3.3)); beam.material.opacity = bm * .55; beam.scale.set(.6 + bm * .4, .3 + bm * .7, .6 + bm * .4); glowL.intensity = bm * 30;
      /* snow always; stars burst from the box */
      for (let i = 0; i < 700; i++){ const s = sv[i]; s[1] -= s[3] * dt; if (s[1] < -6) s[1] = 8; snow.p[i * 3] = s[0] + Math.sin(idle * .7 + i) * .2; snow.p[i * 3 + 1] = s[1]; snow.p[i * 3 + 2] = s[2]; } snow.g.attributes.position.needsUpdate = true;
      for (let i = 0; i < 320; i++){ const s = st[i], k = Math.max(0, seg(t, .8 + s[3] * .5, 2.9 + s[3] * .5)), e = out(k); stars.p[i * 3] = s[0] * e * 2.4; stars.p[i * 3 + 1] = -.1 + s[1] * e - k * k * 2.5; stars.p[i * 3 + 2] = s[2] * e * 2.4; }
      stars.g.attributes.position.needsUpdate = true; stars.m.material.opacity = t > .8 ? Math.sin(seg(t, .8, 3.2) * Math.PI) : 0;
      /* camera dives into the light */
      const dv = ease(seg(t, 2.1, 3.2)); cam.position.set(0, 1.8 + dv * 3.2, base * (1 - dv * .82)); cam.lookAt(0, -.4 + dv * .2, 0);
      if (flash) flash.style.opacity = String(seg(t, 2.7, 3.15));
      R.render(scene, cam);
    }
    requestAnimationFrame(frame); gate.classList.add("has3d");
  }
})();
