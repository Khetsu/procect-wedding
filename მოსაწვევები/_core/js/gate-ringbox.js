/* ამბავი · გახსნა „ბეჭდების ყუთი“ (Three.js): ხავერდის ყუთი ნელა ტრიალებს, ირგვლივ ვერცხლის ნაპერწკლები.
   შეხებისას: ხუფი იღება → შიგნიდან სინათლე ანათებს → ორი ვერცხლის ბეჭედი ამოდის და ტრიალებს → კამერა უახლოვდება → გვერდი იხსნება.
   config.js → ringbox: { velvet: "#4A4D55", metal: "#E4E6EA" } */
(function(){
  const gate = document.getElementById("gate"); if (!gate || gate.hidden) return;
  const C = window.CONFIG || {}, X = Object.assign({ velvet: "#4A4D55", metal: "#E4E6EA" }, C.ringbox || {}), REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  Promise.all([import("three"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"), import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js")]).then(([T, E, RB]) => build(T, E.RoomEnvironment, RB.RoundedBoxGeometry)).catch(e => console.warn("ringbox:", e));
  function build(THREE, RoomEnvironment, RoundedBoxGeometry){
    const canvas = document.createElement("canvas"); canvas.className = "g-canvas"; canvas.setAttribute("aria-hidden", "true");
    let R; try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    gate.insertBefore(canvas, gate.firstChild); R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.VSMShadowMap;
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, .1, 100);
    scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = 1.1;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8c6c2, .7));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 6, 5); key.castShadow = true; key.shadow.radius = 10; key.shadow.blurSamples = 16; scene.add(key);
    const inner = new THREE.PointLight(0xfff6e6, 0, 6); inner.position.set(0, .6, .2); scene.add(inner);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .18 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.9; floor.receiveShadow = true; scene.add(floor);
    const velvet = new THREE.MeshPhysicalMaterial({ color: X.velvet, roughness: .95, sheen: 1, sheenRoughness: .5, sheenColor: new THREE.Color("#B9BDC6") });
    const satin = new THREE.MeshPhysicalMaterial({ color: "#F6F4F0", roughness: .45, sheen: 1, sheenColor: new THREE.Color("#ffffff") });
    const metal = new THREE.MeshPhysicalMaterial({ color: X.metal, metalness: .9, roughness: .26, clearcoat: .6, envMapIntensity: 2.6 });
    const add = (g, m, p) => { const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
    const Bx = new THREE.Group(); Bx.position.y = -.2; scene.add(Bx);
    add(new RoundedBoxGeometry(2.2, 1.0, 2.0, 4, .14), velvet, Bx).position.y = -.2;
    const cushion = add(new THREE.CylinderGeometry(.42, .42, 1.8, 32, 1, false, 0, Math.PI), satin, Bx); cushion.rotation.set(0, 0, Math.PI / 2); cushion.position.set(0, .28, 0); cushion.scale.set(1, 1, .9);
    const rings = new THREE.Group(); rings.position.set(0, .45, 0); Bx.add(rings);
    const r1 = add(new THREE.TorusGeometry(.36, .07, 32, 100), metal, rings); r1.position.x = -.3; r1.rotation.y = .3;
    const r2 = add(new THREE.TorusGeometry(.3, .055, 32, 100), metal, rings); r2.position.x = .32; r2.rotation.y = -.3;
    const gem = add(new THREE.OctahedronGeometry(.11, 0), new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0, metalness: .2, clearcoat: 1, envMapIntensity: 3 }), r2); gem.position.y = .36;
    const hinge = new THREE.Group(); hinge.position.set(0, .3, -1.0); Bx.add(hinge);
    const lid = add(new RoundedBoxGeometry(2.2, .6, 2.0, 4, .14), velvet, hinge); lid.position.set(0, .3, 1.0);
    const lidIn = add(new THREE.PlaneGeometry(1.9, 1.7), satin, hinge); lidIn.rotation.x = Math.PI / 2; lidIn.position.set(0, -.005, 1.0);
    const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.3, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0xfff4e0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); glow.position.set(0, .7, 0); glow.scale.setScalar(4); Bx.add(glow);
    const NS = 260, sg = new THREE.BufferGeometry(), sp = new Float32Array(NS * 3), sv = []; for (let i = 0; i < NS; i++){ const a = Math.random() * 6.28, e = Math.random() * 1.4, s = .8 + Math.random() * 3.2; sv.push([Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s * 1.4, Math.sin(a) * Math.cos(e) * s, Math.random() * 6]); }
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: .08, map: dot, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(sparks);
    let base = 9;
    function size(){ const w = gate.clientWidth || innerWidth, h = gate.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); base = Math.max(7.5, 3.8 / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * cam.aspect)); }
    size(); addEventListener("resize", size);
    const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, out = t => 1 - Math.pow(1 - t, 3);
    let t0 = 0, alive = true; const K = REDUCED ? .25 : 1;
    new MutationObserver(() => { if (gate.classList.contains("go") && !t0) t0 = performance.now(); if (gate.hidden) alive = false; }).observe(gate, { attributes: true, attributeFilter: ["class", "hidden"] });
    function frame(now){
      if (!alive){ R.dispose(); return; } requestAnimationFrame(frame);
      const t = typeof window.__gateT === "number" ? window.__gateT : t0 ? (now - t0) / 1000 / K : 0, idle = now / 1000;
      const calm = 1 - seg(t, 0, .6); Bx.rotation.y = (.5 + Math.sin(idle * .5) * .35) * calm; Bx.position.y = -.2 + Math.sin(idle * 1.1) * .05 * calm;
      const op = out(seg(t, .2, 1.4)); hinge.rotation.x = -op * 1.95;
      const li = seg(t, .45, 1.2) * (1 - seg(t, 2.8, 3.2)); inner.intensity = li * 14; glow.material.opacity = li * .85;
      const rise = ease(seg(t, .9, 2.3)); rings.position.y = .45 + rise * 1.3; rings.rotation.y = rise * Math.PI * 2; rings.rotation.x = rise * .25; rings.scale.setScalar(1 + rise * .35);
      const sk = seg(t, .6, 3.0); for (let i = 0; i < NS; i++){ const v = sv[i], e = t > .6 ? out(sk) : 0; sp[i * 3] = (Math.cos(idle * .3 + v[3]) * 2.6) * (1 - e) + v[0] * e; sp[i * 3 + 1] = (Math.sin(idle * .5 + v[3]) * 1.2 + .8) * (1 - e) + (v[1] + .6) * e; sp[i * 3 + 2] = Math.sin(idle * .3 + v[3]) * 2.6 * (1 - e) + v[2] * e; }
      sg.attributes.position.needsUpdate = true; sparks.material.opacity = .5 + Math.sin(sk * Math.PI) * .5;
      const z = ease(seg(t, 1.6, 3.1)); cam.position.set(0, 2.4 - z * .6, base * (1 - z * .5)); cam.lookAt(0, .2 + z * .9, 0);
      R.render(scene, cam);
    }
    requestAnimationFrame(frame); gate.classList.add("has3d");
  }
})();
