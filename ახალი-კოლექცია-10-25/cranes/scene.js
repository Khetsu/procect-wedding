/* წეროები · პასტელის ცა, ღრუბლები და ქაღალდის წეროების გუნდი.
   შეხებისას: წეროები გულად ეწყობიან → გული ფეთქავს → ცაში იფანტებიან, ოქროს ნაპერწკლებით.
   ფურცვლისას: კამერა ღრუბლებში ზემოთ მიფრინავს, წეროები გარშემო დაფრინავენ. */
import { stage, skyTex, points, canvasTex, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 44, exposure: 1.0, fitW: 4.4, fitH: 6 }), { R, scene, cam } = S, r = rng(21);
  scene.background = skyTex(THREE, [[0, "#B9D3F0"], [.45, "#E8DDF2"], [.75, "#F9DCE6"], [1, "#FFF0DA"]]);
  scene.fog = new THREE.Fog(0xf3e2ec, 30, 95);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9b8c8, .85));
  const sun = new THREE.DirectionalLight(0xfff2e0, 1.4); sun.position.set(4, 8, 6); scene.add(sun);

  /* soft clouds */
  const cloudTex = canvasTex(THREE, 256, 128, (g, w, h) => { const rr = rng(9); for (let i = 0; i < 26; i++){ const x = 30 + rr() * (w - 60), y = 50 + rr() * 45 - Math.abs(x - w / 2) * .12, s = 18 + rr() * 34; const gr = g.createRadialGradient(x, y, 0, x, y, s); gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2); } }, false);
  const clouds = []; for (let i = 0; i < 34; i++){ const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: .4 + r() * .35, depthWrite: false, color: i % 3 ? 0xffffff : 0xffeef4 })); const s = 4 + r() * 7; m.scale.set(s * 2, s, 1); m.position.set((r() - .5) * 34, -3 + r() * 26, -6 - r() * 26); scene.add(m); clouds.push({ m, v: .1 + r() * .25 }); }

  /* origami crane: body pyramid, neck, tail and two hinged wings */
  const tri = (...v) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(v.flat(), 3)); g.computeVertexNormals(); return g; };
  const bodyG = tri([0, .02, .5], [.22, .04, 0], [0, .3, 0], [0, .3, 0], [.22, .04, 0], [0, .02, -.5], [0, .02, .5], [0, .3, 0], [-.22, .04, 0], [-.22, .04, 0], [0, .3, 0], [0, .02, -.5],
    [0, .12, .3], [0, .62, .82], [0, .16, .2], [0, .62, .82], [0, .55, .9], [0, .66, .98], [0, .12, -.3], [0, .56, -.86], [0, .16, -.2]);
  const wingG = tri([0, 0, .32], [0, 0, -.3], [1.05, .16, -.05]);
  const pal = [0xe98aa6, 0x7fcfae, 0xf5c95a, 0x7fa8ea, 0xb293e6, 0xffffff, 0xf3a07a];
  const cranes = [], N = 46;
  for (let i = 0; i < N; i++){ const mat = new THREE.MeshStandardMaterial({ color: pal[i % pal.length], emissive: pal[i % pal.length], emissiveIntensity: .14, roughness: .75, flatShading: true, side: THREE.DoubleSide });
    const g = new THREE.Group(), body = new THREE.Mesh(bodyG, mat), wl = new THREE.Mesh(wingG, mat), wr = new THREE.Mesh(wingG, mat); wr.scale.x = -1; wl.position.y = wr.position.y = .2; g.add(body, wl, wr);
    const s = .55 + r() * .35; g.scale.setScalar(s); scene.add(g);
    cranes.push({ g, wl, wr, s, rad: 2.6 + r() * 4.5, h: .2 + r() * 4.6, sp: (.16 + r() * .14) * (r() < .5 ? 1 : -1), a0: r() * 6.28, ph: r() * 6, hi: i }); }
  /* heart targets */
  const heart = Array.from({ length: N }, (_, i) => { const u = i / N * Math.PI * 2; return new THREE.Vector3(Math.pow(Math.sin(u), 3) * 2.05, (13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) / 16 * 2.05 + 2.3, 0); });
  const spark = points(THREE, 160, .1, 0xd99a2b); spark.pts.material.fog = false; spark.pts.material.blending = THREE.NormalBlending; scene.add(spark.pts); const sv = Array.from({ length: spark.n }, () => [r() * 6.28, r(), r()]);

  const free = (c, tt) => { const a = c.a0 + tt * c.sp; return new THREE.Vector3(Math.cos(a) * c.rad, c.h + Math.sin(tt * .6 + c.ph) * .5, Math.sin(a) * c.rad - 1.5); };
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), OPEN = 3.6;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, form = on ? ease(seg(t, .2, 2.0)) : 0, burst = on ? ease(seg(t, 2.65, OPEN)) : 0, beat = on ? 1 + Math.sin(seg(t, 2.0, 2.65) * Math.PI * 2) * .07 : 1;
    for (const c of cranes){ const a = free(c, idle), b = free(c, idle + .05), hp = heart[c.hi].clone().multiplyScalar(1).setY((heart[c.hi].y - 2.3) * beat + 2.3);
      hp.x *= beat; const out2 = hp.clone().add(tmp.set(hp.x * 2.4, (hp.y - 2.3) * 2.2 + 5, 3 + (c.hi % 5)));
      const target = form < 1 || burst <= 0 ? a.clone().lerp(hp, form) : hp.clone().lerp(out2, burst);
      const pos = burst > 0 ? hp.clone().lerp(out2, burst) : target;
      const settle = on ? ease(seg(t, OPEN - .2, OPEN + 4)) : 0, hiY = c.h * 3.6 + 2.5;
      if (settle > 0){ const fh = a.clone(); fh.y = hiY + Math.sin(idle * .6 + c.ph) * .5; pos.lerp(fh, settle); }
      c.g.position.copy(pos); c.g.scale.setScalar(c.s * lerp(1, .4, form * (1 - burst)));
      if (form > .85 && burst <= 0){ const u = c.hi / N * Math.PI * 2; tmp2.set(Math.cos(u) * .3, 1, .4).add(pos); c.g.lookAt(tmp2.x, tmp2.y, tmp2.z + 2); }
      else { const nxt = settle > .3 ? b.clone().setY(hiY) : burst > 0 ? out2 : b.clone().lerp(hp, form); c.g.lookAt(nxt); }
      const fl = Math.sin(idle * (7 + c.s * 3) + c.ph) * .7; c.wl.rotation.z = fl; c.wr.rotation.z = -fl; }
    for (let i = 0; i < spark.n; i++){ const v = sv[i], hp = heart[Math.floor(v[2] * N)], k = on ? ((t * .5 + v[1]) % 1) : 0; spark.pos[i * 3] = hp.x * beat + Math.cos(v[0]) * k * 1.2; spark.pos[i * 3 + 1] = hp.y + Math.sin(v[0]) * k * 1.2 + k * .6; spark.pos[i * 3 + 2] = .2; }
    spark.g.attributes.position.needsUpdate = true; spark.pts.material.opacity = on ? seg(t, 1.6, 2.2) * (1 - burst * .6) : 0;
    clouds.forEach(o => { o.m.position.x += o.v * .01; if (o.m.position.x > 18) o.m.position.x = -18; });
    const d = S.dist, Q = ease(p), rise = burst;
    cam.position.set(Math.sin(idle * .2) * .3, 2.3 + rise * .8 + Q * 14, d + rise * 1.5 - Q * 3);
    cam.lookAt(0, 2.3 + rise * 1.6 + Q * 15, -2 - Q * 4);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
