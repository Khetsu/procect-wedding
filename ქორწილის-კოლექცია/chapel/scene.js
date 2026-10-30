/* სანთლების ტაძარი · ქვის ტაძარი თაღებით, ბილიკის გასწვრივ — სანთლები, ბოლოში — თაღოვანი ფანჯარა და საკურთხეველი ყვავილებით.
   შეხებისას: სანთლები ახლოდან შორისკენ რიგ-რიგად ინთება → ფანჯრიდან სინათლის სხივები ეცემა → კამერა ბილიკზე მიდის.
   ფურცვლისას: კამერა საკურთხევლისკენ მიიწევს და ფანჯარას ახედავს. */
import { stage, glow, points, canvasTex, envMap, post, rose, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 52, exposure: 1.0, fitW: 4, fitH: 6 }), { R, scene, cam } = S, r = rng(3);
  scene.background = new THREE.Color(0x0d0906); scene.fog = new THREE.Fog(0x120c07, 10, 44);
  scene.environment = await envMap(THREE, R, .03); scene.environmentIntensity = .05;
  await post(THREE, S, { strength: .7, radius: .55, threshold: .9 });
  const hemi = new THREE.HemisphereLight(0xffd9b0, 0x120a06, .04); scene.add(hemi);

  /* stone */
  const stoneTex = (rep) => { const t = canvasTex(THREE, 512, 512, (g, w) => { g.fillStyle = "#8f7d66"; g.fillRect(0, 0, w, w); const rr = rng(2); for (let y = 0; y < w; y += 64){ const off = (y / 64) % 2 ? 64 : 0; for (let x = -64; x < w; x += 128){ const c = 120 + rr() * 40; g.fillStyle = `rgb(${c + 25},${c + 10},${c - 12})`; g.fillRect(x + off + 3, y + 3, 122, 58); } }
    for (let i = 0; i < 9000; i++){ g.fillStyle = `rgba(${rr() < .5 ? 0 : 255},${rr() < .5 ? 0 : 230},200,${rr() * .05})`; g.fillRect(rr() * w, rr() * w, 2, 2); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); return t; };
  const stone = (rep) => new THREE.MeshStandardMaterial({ map: stoneTex(rep), roughness: .95, color: 0xd8c7ad });
  const L = 38;
  const floorT = canvasTex(THREE, 512, 512, (g, w) => { g.fillStyle = "#5e5145"; g.fillRect(0, 0, w, w); const rr = rng(5); for (let y = 0; y < w; y += 128) for (let x = 0; x < w; x += 128){ const c = 80 + rr() * 30; g.fillStyle = `rgb(${c + 14},${c + 6},${c - 6})`; g.fillRect(x + 2, y + 2, 124, 124); } }); floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping; floorT.repeat.set(4, 19);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, L), new THREE.MeshStandardMaterial({ map: floorT, roughness: .45, metalness: .05 })); floor.rotation.x = -Math.PI / 2; floor.position.z = -L / 2 + 3; scene.add(floor);
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.3, L - 6), new THREE.MeshStandardMaterial({ color: 0xb8ad9c, roughness: 1 })); runner.rotation.x = -Math.PI / 2; runner.position.set(0, .01, -L / 2 + 1); scene.add(runner);
  [-1, 1].forEach(s => { const wl = new THREE.Mesh(new THREE.PlaneGeometry(L, 10), stone([10, 3])); wl.rotation.y = -s * Math.PI / 2; wl.position.set(s * 4, 5, -L / 2 + 3); scene.add(wl); });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(8, L), new THREE.MeshStandardMaterial({ color: 0x1a130d, roughness: 1 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 9.4, -L / 2 + 3); scene.add(ceil);
  const pillarM = stone([1, 3]);
  for (let z = -1; z > -L + 4; z -= 5){ [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.34, .4, 6, 24), pillarM); p.position.set(s * 3.2, 3, z); scene.add(p); const cap = new THREE.Mesh(new THREE.BoxGeometry(.95, .3, .95), pillarM); cap.position.set(s * 3.2, 6.1, z); scene.add(cap); });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.2, .28, 12, 48, Math.PI), pillarM); arch.position.set(0, 6.1, z); scene.add(arch); }
  /* the arched window and its light */
  const winT = canvasTex(THREE, 512, 1024, (g, w, h) => { g.clearRect(0, 0, w, h); g.save(); g.beginPath(); g.moveTo(0, h); g.lineTo(0, w / 2); g.arc(w / 2, w / 2, w / 2, Math.PI, 0); g.lineTo(w, h); g.closePath(); g.clip();
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#fffaf0"); gr.addColorStop(1, "#ffe2b0"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(60,40,20,.85)"; g.lineWidth = 10; [w / 3, 2 * w / 3].forEach(x => { g.beginPath(); g.moveTo(x, h); g.lineTo(x, 60); g.stroke(); }); for (let y = 300; y < h; y += 170){ g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.restore(); });
  const winMat = new THREE.MeshBasicMaterial({ map: winT, transparent: true, fog: false, color: 0x3a3028 });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 4.8), winMat); win.position.set(0, 4.9, -L + 3.05); scene.add(win);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), stone([3, 3])); back.position.set(0, 5, -L + 3); scene.add(back);
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xffe6bf, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const rays = []; for (let i = 0; i < 5; i++){ const m = new THREE.Mesh(new THREE.PlaneGeometry(.5 + r() * .7, 16), rayMat); m.position.set((i - 2) * .45, 3.2, -L + 9.5); m.rotation.set(-1.15, 0, (i - 2) * .05); scene.add(m); rays.push(m); }
  const sunSpot = new THREE.SpotLight(0xffe6c0, 0, 30, .45, .8, 1); sunSpot.position.set(0, 7, -L + 3.5); sunSpot.target.position.set(0, 0, -L + 14); scene.add(sunSpot, sunSpot.target);
  /* altar with flowers and two tall candelabra */
  const altar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1, .9), new THREE.MeshStandardMaterial({ color: 0xf1e9dc, roughness: .8 })); altar.position.set(0, .5, -L + 5); scene.add(altar);
  const roseMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .55, sheen: 1, sheenColor: new THREE.Color(0xffffff), side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++){ const rs = rose(THREE, { seed: 10 + i, color: 0xfffaf3, base: i % 3 ? 0xf3dad2 : 0xf6efe3, mat: roseMat }); rs.scale.setScalar(.22 + r() * .06); rs.position.set((i - 4) * .22 + (r() - .5) * .08, 1.05 + Math.sin(i / 8 * Math.PI) * .2, -L + 5 + (r() - .5) * .3); rs.rotation.x = .5; scene.add(rs); }

  /* candles on brass stands along the aisle */
  const brass = new THREE.MeshStandardMaterial({ color: 0xb58a46, metalness: 1, roughness: .35 }), wax = new THREE.MeshStandardMaterial({ color: 0xf6eedf, roughness: .6, emissive: 0xffb860, emissiveIntensity: 0 });
  const candles = [];
  for (let z = -.5, i = 0; z > -L + 7; z -= 2.1, i++) [-1, 1].forEach(s => { const h = 1.05 + (i % 3) * .18, g = new THREE.Group(); g.position.set(s * 1.25, 0, z);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025, .03, h, 10), brass); stem.position.y = h / 2; const foot = new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .05, 20), brass); foot.position.y = .025; const cup = new THREE.Mesh(new THREE.CylinderGeometry(.09, .05, .06, 20), brass); cup.position.y = h;
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .32, 16), wax.clone()); c.position.y = h + .19;
    const fl = glow(THREE, 0xffb050, .1, 0), core = glow(THREE, 0xfff2cc, .06, 0); fl.position.y = core.position.y = h + .42; fl.material.fog = core.material.fog = false;
    g.add(stem, foot, cup, c, fl, core); scene.add(g); candles.push({ g, c, fl, core, z, ph: r() * 6 }); });
  const lights = []; for (let z = -1; z > -L + 6; z -= 4.2){ const l = new THREE.PointLight(0xffa850, 0, 7.5, 1.6); l.position.set(0, 1.7, z); scene.add(l); lights.push({ l, z }); }

  /* dust in the light */
  const dust = points(THREE, 700, .05, 0xffe2b0, { opacity: .0 }); dust.pts.material.fog = false; scene.add(dust.pts);
  const dv = Array.from({ length: dust.n }, () => [(r() - .5) * 3, r() * 7, -L + 6 + r() * 12, r() * 6]);

  const OPEN = 3.9, litAt = z => .25 + (-z / (L - 7)) * 2.2;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, Q = ease(p), win1 = on ? seg(t, 1.6, 3.4) : 0;
    for (const C of candles){ const k = on ? seg(t, litAt(C.z), litAt(C.z) + .25) : (C.z > -3 ? .55 : 0), fl = .82 + .18 * Math.sin(idle * 13 + C.ph) * Math.sin(idle * 7.3 + C.ph * 2);
      C.fl.material.opacity = k * .9 * fl; C.fl.scale.set(.32 * k * fl, .5 * k * fl, 1); C.core.material.opacity = k; C.core.scale.set(.06 * k, .13 * k, 1); C.c.material.emissiveIntensity = k * .35; }
    for (const Lg of lights){ const k = on ? seg(t, litAt(Lg.z), litAt(Lg.z) + .4) : (Lg.z > -3 ? .25 : 0); Lg.l.intensity = k * 4.6 * (.92 + .08 * Math.sin(idle * 9 + Lg.z)); }
    winMat.color.setRGB(lerp(.22, 1, win1), lerp(.18, .95, win1), lerp(.14, .86, win1)); rayMat.opacity = win1 * .045; sunSpot.intensity = win1 * 12; hemi.intensity = .04 + win1 * .06;
    rays.forEach((m, i) => { m.material.opacity; m.position.x = (i - 2) * .45 + Math.sin(idle * .2 + i) * .05; });
    for (let i = 0; i < dust.n; i++){ const v = dv[i]; dust.pos[i * 3] = v[0] + Math.sin(idle * .3 + v[3]) * .3; dust.pos[i * 3 + 1] = ((v[1] + idle * .12) % 7) + .3; dust.pos[i * 3 + 2] = v[2] + Math.cos(idle * .25 + v[3]) * .3; }
    dust.g.attributes.position.needsUpdate = true; dust.pts.material.opacity = win1 * .5;
    const walk = on ? ease(seg(t, 1.2, OPEN + .3)) : 0, z = lerp(4.2, -5, walk) - Q * 16;
    cam.position.set(Math.sin(idle * .3) * .04, 1.65 + Math.sin(idle * 1.6) * .015 * walk, z);
    cam.lookAt(0, lerp(2.0, 2.6, walk) + Q * 2.4, -L + 3);
    S.render();
  }
  return { open: OPEN, update };
}
