/* ვინილი · 80-იანების ნეონის სამყარო: ზოლიანი მზე, ნათებადი ბადე, მთები და ფირსაკრავი სახელიანი ფირფიტით.
   შეხებისას: ნემსი ფირფიტაზე ეშვება → ფირფიტა ტრიალებს → ნეონის რგოლები და ეკვალაიზერი ბითზე ფეთქავს → კამერა ჰორიზონტისკენ.
   ფურცვლისას: კამერა ბადეზე მზისკენ მიფრინავს. */
import { stage, skyTex, glow, canvasTex, envMap, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas, C }){
  await Promise.race([Promise.all(['700 60px "Noto Sans Georgian"', '400 60px "Monoton"'].map(f => document.fonts.load(f, "ა30"))), new Promise(r => setTimeout(r, 2500))]);
  const S = stage(THREE, canvas, { fov: 44, exposure: 1.05, fitW: 3.9, fitH: 4.4 }), { R, scene, cam } = S, r = rng(30);
  scene.background = skyTex(THREE, [[0, "#07021A"], [.45, "#250A44"], [.68, "#6A1A66"], [.82, "#E2468A"], [1, "#FFA86A"]]);
  scene.environment = await envMap(THREE, R, .04); scene.environmentIntensity = .6;
  scene.add(new THREE.HemisphereLight(0xff7ad8, 0x10042a, .7));
  const pink = new THREE.PointLight(0xff3fb4, 0, 14, 1.4); pink.position.set(-2, 2.5, 1); const cyan = new THREE.PointLight(0x3ff3ff, 0, 14, 1.4); cyan.position.set(2.2, 2.2, -1); scene.add(pink, cyan);
  const key = new THREE.DirectionalLight(0xffe0f0, .9); key.position.set(1, 5, 4); scene.add(key);

  /* striped retro sun + mountains */
  const sunTex = canvasTex(THREE, 512, 512, (g, w) => { const gr = g.createLinearGradient(0, 0, 0, w); gr.addColorStop(0, "#fff36b"); gr.addColorStop(.55, "#ff8a5c"); gr.addColorStop(1, "#ff2fa0"); g.fillStyle = gr; g.beginPath(); g.arc(w / 2, w / 2, w / 2, 0, 7); g.fill();
    g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 9; i++){ const y = w * .55 + i * i * 2.4 + i * 14, hh = 4 + i * 2.2; g.fillRect(0, y, w, hh); } });
  const sunM = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), new THREE.MeshBasicMaterial({ map: sunTex, transparent: true, fog: false, depthWrite: false })); sunM.position.set(0, 7, -90); scene.add(sunM);
  const sunG = glow(THREE, 0xff4fa0, 70, .45); sunG.position.set(0, 7, -91); scene.add(sunG);
  const mg = new THREE.PlaneGeometry(160, 24, 80, 10), mp = mg.attributes.position; for (let i = 0; i < mp.count; i++){ const x = mp.getX(i), y = mp.getY(i), edge = Math.min(1, Math.abs(x) / 30); mp.setZ(i, (y + 12) / 24 * (2 + r() * 9) * edge * (1 - (y + 12) / 24 * .2)); }
  const mount = new THREE.Mesh(mg, new THREE.MeshBasicMaterial({ color: 0x3ff3ff, wireframe: true, transparent: true, opacity: .35 })); mount.rotation.x = -Math.PI / 2; mount.position.set(0, -.05, -78); scene.add(mount);

  /* neon grid */
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 }, uB: { value: 0 } }, transparent: false,
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform float uT, uB; varying vec3 vW;
      void main(){ vec2 g = abs(fract(vec2(vW.x, vW.z + uT * 3.) / 2.) - .5); float l = 1. - smoothstep(.0, .035, min(g.x, g.y)); float d = length(vW.xz);
        vec3 col = vec3(.03, .0, .07) + vec3(1., .2, .75) * l * (1.2 + uB) * smoothstep(150., 6., d) + vec3(.6, .1, .5) * smoothstep(80., 140., -vW.z) * .25;
        gl_FragColor = vec4(col, 1.);
        #include <colorspace_fragment>
      }` }));
  grid.rotation.x = -Math.PI / 2; grid.position.y = -.4; scene.add(grid);

  /* turntable */
  const black = new THREE.MeshPhysicalMaterial({ color: 0x0c0a12, roughness: .25, clearcoat: 1 }), chrome = new THREE.MeshStandardMaterial({ color: 0xe8e8f0, metalness: 1, roughness: .18 });
  const tt = new THREE.Group(); scene.add(tt);
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, .34, 2.7), black); base.position.y = -.17; tt.add(base);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(3.42, .04, 2.72), new THREE.MeshBasicMaterial({ color: 0xff3fb4 })); edge.position.y = -.33; tt.add(edge);
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, .07, 64), chrome); platter.position.set(-.35, .035, 0); tt.add(platter);
  const grooves = canvasTex(THREE, 1024, 1024, (g, w) => { g.fillStyle = "#08070c"; g.fillRect(0, 0, w, w); for (let rr = 190; rr < 505; rr += 3){ g.strokeStyle = `rgba(255,255,255,${.03 + (rr % 9 === 0 ? .05 : 0)})`; g.lineWidth = 1; g.beginPath(); g.arc(w / 2, w / 2, rr, 0, 7); g.stroke(); }
    const sh = g.createLinearGradient(0, 0, w, w); sh.addColorStop(.3, "rgba(255,255,255,0)"); sh.addColorStop(.5, "rgba(255,180,255,.10)"); sh.addColorStop(.7, "rgba(255,255,255,0)"); g.fillStyle = sh; g.beginPath(); g.arc(w / 2, w / 2, 505, 0, 7); g.fill();
    const lab = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, 180); lab.addColorStop(0, "#ff5fc0"); lab.addColorStop(1, "#7a2bff"); g.fillStyle = lab; g.beginPath(); g.arc(w / 2, w / 2, 178, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = '400 92px "Monoton"'; g.fillText(C.stageText || "30", w / 2, w / 2 - 40); g.font = '700 46px "Noto Sans Georgian"'; g.fillText(C.a || "", w / 2, w / 2 + 62);
    g.fillStyle = "#111"; g.beginPath(); g.arc(w / 2, w / 2, 9, 0, 7); g.fill(); });
  const rec = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, .02, 96), [new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: .3 }), new THREE.MeshStandardMaterial({ map: grooves, roughness: .28, metalness: .2 }), new THREE.MeshStandardMaterial({ color: 0x0a0a10 })]);
  rec.position.set(-.35, .08, 0); tt.add(rec);
  const arm = new THREE.Group(); arm.position.set(1.15, .1, -.95); tt.add(arm);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.09, .11, .28, 20), chrome); post.position.y = .1; arm.add(post);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1.55, 12), chrome); tube.rotation.x = Math.PI / 2; tube.position.set(0, .26, .78); arm.add(tube);
  const head = new THREE.Mesh(new THREE.BoxGeometry(.16, .06, .26), black); head.position.set(-.05, .23, 1.58); arm.add(head);
  const needleGlow = new THREE.PointLight(0xff3fb4, 0, 2.5, 2); needleGlow.position.set(-.05, .2, 1.6); arm.add(needleGlow);

  /* beat: neon rings from the record and an equaliser behind */
  const rings = Array.from({ length: 6 }, (_, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(1.15, .025, 8, 96), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x3ff3ff : 0xff3fb4, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.x = Math.PI / 2; m.position.set(-.35, .1, 0); tt.add(m); return m; });
  const NB = 22, bars = new THREE.InstancedMesh(new THREE.BoxGeometry(.2, 1, .2), new THREE.MeshBasicMaterial({ color: 0xffffff }), NB), M = new THREE.Matrix4(), cc = new THREE.Color();
  scene.add(bars); for (let i = 0; i < NB; i++) bars.setColorAt(i, cc.setHSL(.83 - i / NB * .35, 1, .6));

  const OPEN = 3.6, BEAT = .6;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, swing = on ? ease(seg(t, .1, .9)) : 0, drop = on ? out(seg(t, .9, 1.2)) : 0, play = on && t > 1.2;
    arm.rotation.y = lerp(.55, -.32, swing); arm.rotation.x = lerp(-.12, 0, drop);
    rec.rotation.y = play ? -(t - 1.2) * 3.4 : 0; platter.rotation.y = rec.rotation.y;
    const bt = play ? (t - 1.2) / BEAT : 0, pulse = play ? Math.pow(1 - (bt % 1), 3) : 0;
    rings.forEach((m, i) => { if (!play){ m.material.opacity = 0; return; } const k = ((t - 1.2) / BEAT - i * 1) ; const age = k - Math.floor(k / 6) * 6; const a = age / 3; if (a > 1 || k < 0){ m.material.opacity = 0; return; } m.scale.setScalar(1 + a * 3.2); m.material.opacity = (1 - a) * .9; });
    for (let i = 0; i < NB; i++){ const x = (i - (NB - 1) / 2) * .34, hh = play ? .25 + Math.abs(Math.sin(idle * (3 + (i % 5)) + i)) * (.55 + pulse * .8) * (1 - Math.abs(x) / 5) : .08;
      M.compose(new THREE.Vector3(x * 1.3, -.4 + hh / 2, -3.6), new THREE.Quaternion(), new THREE.Vector3(1, hh, 1)); bars.setMatrixAt(i, M); }
    bars.instanceMatrix.needsUpdate = true;
    pink.intensity = play ? 6 + pulse * 18 : 2; cyan.intensity = play ? 5 + pulse * 14 : 1.5; needleGlow.intensity = drop * 3;
    grid.material.uniforms.uT.value = play ? idle : idle * .3; grid.material.uniforms.uB.value = pulse * .8;
    const d = S.dist, swoop = on ? ease(seg(t, 2.0, OPEN)) : 0, Q = ease(p);
    cam.position.set(Math.sin(idle * .25) * .12, lerp(d * .78, 1.15, swoop) + Q * 1.8, lerp(d * .62, 4.6, swoop) - Q * 30);
    cam.lookAt(0, lerp(-.1, 1.6, swoop) + Q * 2, lerp(0, -20, swoop) - Q * 40);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
