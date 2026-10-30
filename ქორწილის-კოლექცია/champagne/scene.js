/* შამპანურის კოშკი · ბროლის ბოკალების პირამიდა თეთრ სუფრაზე, უკან — დარბაზის თბილი შუქები (bokeh).
   შეხებისას: ბოთლი შემოდის და ასხამს → შამპანური ზედა ბოკალიდან რიგ-რიგად ქვემოთ ჩაედინება და ავსებს →
   ბუშტუკები ამოდის, კიდეებზე ნაპერწკლები ციმციმებს → კამერა ზემოთ ადის.  ფურცვლისას: კამერა კოშკს ირგვლივ უვლის. */
import { stage, skyTex, glow, points, canvasTex, envMap, post, bokeh, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas, C }){
  await Promise.race([Promise.all(['500 60px "Noto Serif Georgian"', '400 60px "Pinyon Script"'].map(f => document.fonts.load(f, "ა A"))), new Promise(r => setTimeout(r, 2500))]);
  const S = stage(THREE, canvas, { fov: 36, exposure: 1.0, fitW: 4.3, fitH: 5.4, shadows: true }), { R, scene, cam } = S, r = rng(5);
  scene.background = skyTex(THREE, [[0, "#120B07"], [.55, "#23170E"], [1, "#352315"]]);
  scene.environment = await envMap(THREE, R, .04); scene.environmentIntensity = .7;
  await post(THREE, S, { strength: .45, radius: .5, threshold: .93 });
  const bk = bokeh(THREE, scene, 80, { colors: [0xffc778, 0xffe0aa, 0xfff0d2, 0xffaa5e], x: [-10, 10], y: [-1, 9], z: [-7, -22], size: [.35, 1.5], op: [.04, .16], seed: 9 });
  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x2a1a10, .2));
  const key = new THREE.SpotLight(0xfff1dc, 16, 22, .42, .7, 1.2); key.position.set(3, 7.5, 5); key.target.position.set(0, 1.3, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004; key.shadow.radius = 6; scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xffc98a, 1.4); rim.position.set(-4, 3, -6); scene.add(rim);
  const inner = new THREE.PointLight(0xffc860, 0, 5, 1.6); inner.position.set(0, 1.4, .6); scene.add(inner);

  /* table with white linen */
  const linen = new THREE.MeshStandardMaterial({ color: 0xcfc4b2, roughness: .9 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, .06, 96), linen); top.position.y = -.03; top.receiveShadow = true; scene.add(top);
  const drapeG = new THREE.CylinderGeometry(2.92, 3.1, 2.2, 128, 6, true), dp = drapeG.attributes.position;
  for (let i = 0; i < dp.count; i++){ const x = dp.getX(i), z = dp.getZ(i), y = dp.getY(i), a = Math.atan2(z, x), k = (1.1 - y) / 2.2, f = 1 + .025 * k * Math.sin(a * 22); dp.setX(i, x * f); dp.setZ(i, z * f); }
  drapeG.computeVertexNormals(); const drape = new THREE.Mesh(drapeG, linen); drape.position.y = -1.13; drape.receiveShadow = true; scene.add(drape);

  /* crystal coupes */
  const P = (a) => a.map(([x, y]) => new THREE.Vector2(x, y));
  const coupeG = new THREE.LatheGeometry(P([[0, 0], [.21, 0], [.22, .012], [.05, .05], [.028, .1], [.026, .4], [.04, .44], [.13, .47], [.27, .52], [.36, .58], [.39, .63], [.397, .65], [.386, .652], [.35, .605], [.26, .548], [.12, .502], [0, .488]]), 56);
  const crystal = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, transmission: 1, thickness: .06, ior: 1.52, clearcoat: 1, envMapIntensity: 2.6, side: THREE.DoubleSide });
  const IN = [[0, .489], [.12, .503], [.26, .549], [.35, .606], [.386, .65]];
  const innerX = y => { for (let i = 1; i < IN.length; i++) if (y <= IN[i][1]){ const [x0, y0] = IN[i - 1], [x1, y1] = IN[i]; return lerp(x0, x1, (y - y0) / (y1 - y0)); } return IN[IN.length - 1][0]; };
  const wine = new THREE.MeshStandardMaterial({ color: 0xe9bd55, roughness: .12, metalness: .25, emissive: 0x5c3906, emissiveIntensity: .55 });
  const liquidGeo = f => { const fh = lerp(.49, .64, f), pts = IN.filter(p => p[1] < fh).map(([x, y]) => new THREE.Vector2(x * .97, y)); pts.push(new THREE.Vector2(innerX(fh) * .97, fh), new THREE.Vector2(0, fh)); return new THREE.LatheGeometry(pts, 40); };
  const glasses = [], SP = .8, LH = .655;
  for (let L = 0; L < 4; L++){ const n = 4 - L; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++){
    const g = new THREE.Mesh(coupeG, crystal); g.position.set((i - (n - 1) / 2) * SP, L * LH, (j - (n - 1) / 2) * SP); g.castShadow = true; scene.add(g);
    const liq = new THREE.Mesh(liquidGeo(.01), wine); liq.position.copy(g.position); liq.visible = false; scene.add(liq);
    const glint = glow(THREE, 0xfff6e0, .16, 0); glint.position.set(g.position.x + .3, g.position.y + .66, g.position.z + .25); scene.add(glint);
    glasses.push({ g, liq, glint, L, f: 0, ph: r() * 6 }); } }
  const topY = 3 * LH;

  /* the bottle, pivoting at its mouth */
  const bottle = new THREE.Group(); scene.add(bottle);
  const bodyG = new THREE.LatheGeometry(P([[0, 0], [.2, 0], [.22, .03], [.222, .95], [.2, 1.15], [.13, 1.35], [.078, 1.5], [.075, 1.72], [.088, 1.74], [.085, 1.8], [0, 1.8]]), 48);
  const bmesh = new THREE.Mesh(bodyG, new THREE.MeshPhysicalMaterial({ color: 0x0d2414, roughness: .1, clearcoat: 1, metalness: .15, envMapIntensity: 1.4 })); bmesh.position.y = -1.8; bmesh.castShadow = true; bottle.add(bmesh);
  const foil = new THREE.Mesh(new THREE.CylinderGeometry(.088, .105, .42, 32), new THREE.MeshStandardMaterial({ color: 0xd9b25a, metalness: 1, roughness: .32 })); foil.position.y = -.24; bottle.add(foil);
  const names = C.b ? C.a + " & " + C.b : C.a, d0 = new Date(C.date + "T12:00:00");
  const labTex = canvasTex(THREE, 1024, 300, (g, w, h) => { g.fillStyle = "#f3ead8"; g.fillRect(0, 0, w, h); g.strokeStyle = "#b8924a"; g.lineWidth = 6; g.strokeRect(300, 20, 424, h - 40); g.textAlign = "center"; g.fillStyle = "#6a4a1c";
    g.font = '400 64px "Pinyon Script"'; g.fillText(C.script || names, w / 2, 140); g.font = '500 30px "Noto Serif Georgian"'; g.fillText(String(d0.getDate()).padStart(2, "0") + " · " + String(d0.getMonth() + 1).padStart(2, "0") + " · " + d0.getFullYear(), w / 2, 220); });
  const label = new THREE.Mesh(new THREE.CylinderGeometry(.224, .224, .42, 48, 1, true), new THREE.MeshStandardMaterial({ map: labTex, roughness: .7 })); label.position.y = -1.8 + .52; label.rotation.y = -Math.PI / 2; bottle.add(label);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(.022, .03, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(stream);

  /* bubbles inside the glasses + overflow drops */
  const bub = points(THREE, 700, .025, 0xfff4d0); scene.add(bub.pts); const bv = Array.from({ length: bub.n }, (_, i) => [i % glasses.length, r() * 6.28, Math.sqrt(r()), r()]);
  const drops = points(THREE, 360, .05, 0xffd775); scene.add(drops.pts); const dv = Array.from({ length: drops.n }, () => [Math.floor(r() * 14), r() * 6.28, r()]);

  const OPEN = 3.9, mouth = new THREE.Vector3(-.12, topY + 1.05, .05), tgt = new THREE.Vector3(0, topY + .56, 0);
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, enter = on ? ease(seg(t, 0, .7)) : 0, leave = on ? ease(seg(t, 2.6, 3.3)) : 0, pour = on && t > .65 && t < 2.75, Q = ease(p);
    bottle.position.set(lerp(-2.6, mouth.x, enter) - leave * 2.4, lerp(topY + 3.2, mouth.y, enter) + leave * 1.6, mouth.z);
    bottle.rotation.z = lerp(-.4, -2.05, ease(seg(t, .1, .75))) + leave * 1.4; bottle.visible = on && leave < 1;
    stream.visible = pour; if (pour){ const a = bottle.position, d = a.distanceTo(tgt); stream.position.copy(a).add(tgt).multiplyScalar(.5); stream.scale.set(1, d, 1); stream.lookAt(tgt); stream.rotateX(Math.PI / 2); stream.material.opacity = .85 * Math.min(seg(t, .65, .8), 1 - seg(t, 2.6, 2.75)); }
    for (const G of glasses){ const st = .75 + (3 - G.L) * .5, f = on ? ease(seg(t, st, st + .75)) : 0;
      if (Math.abs(f - G.f) > .012 || (f === 1 && G.f !== 1)){ G.f = f; G.liq.visible = f > .01; if (G.liq.visible){ G.liq.geometry.dispose(); G.liq.geometry = liquidGeo(f); } }
      G.glint.material.opacity = G.f > .9 ? Math.max(0, Math.sin(idle * 2.3 + G.ph * 3)) * .9 : 0; }
    for (let i = 0; i < bub.n; i++){ const [gi, a, rr, ph] = bv[i], G = glasses[gi], fh = lerp(.49, .64, G.f), k = (ph + idle * .35) % 1, y = lerp(.495, fh - .005, k);
      bub.pos[i * 3] = G.g.position.x + Math.cos(a + k * 2) * innerX(y) * .85 * rr; bub.pos[i * 3 + 1] = G.f > .05 ? G.g.position.y + y : -50; bub.pos[i * 3 + 2] = G.g.position.z + Math.sin(a + k * 2) * innerX(y) * .85 * rr; }
    bub.g.attributes.position.needsUpdate = true;
    for (let i = 0; i < drops.n; i++){ const [gi, a, ph] = dv[i], G = glasses[gi], src = G.L >= 1, st = .75 + (3 - G.L) * .5 + .7, run = on && src && t > st && t < st + 1.4;
      const k = (ph + idle * 1.6) % 1; drops.pos[i * 3] = G.g.position.x + Math.cos(a) * (.4 + k * .06); drops.pos[i * 3 + 1] = run ? G.g.position.y + .64 - k * .62 : -50; drops.pos[i * 3 + 2] = G.g.position.z + Math.sin(a) * (.4 + k * .06); }
    drops.g.attributes.position.needsUpdate = true;
    inner.intensity = on ? seg(t, 1, 3) * 6 : 0;
    bk.forEach(b => { b.material.opacity = b.userData.o * (.75 + .25 * Math.sin(idle * .7 + b.userData.ph)); });
    const d = S.dist, rise = on ? ease(seg(t, .4, OPEN)) : 0, a = Q * 1.5 + Math.sin(idle * .12) * .06, rad = lerp(d, d * .9, rise) + Q * 1.2;
    cam.position.set(Math.sin(a) * rad, lerp(1.25, 2.05, rise) + Q * 1.4, Math.cos(a) * rad);
    cam.lookAt(0, lerp(1.45, 1.75, rise) + Q * .2, 0);
    S.render();
  }
  return { open: OPEN, update };
}
