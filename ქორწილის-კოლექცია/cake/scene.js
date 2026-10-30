/* საქორწილო ტორტი · სამსართულიანი თეთრი ტორტი მარგალიტებით და შაქრის ვარდების კასკადით, ოქროს სადგამზე; თავზე — ოქროს ინიციალები.
   შეხებისას: დარბაზის შუქი ქრება → ორი ბენგალური ცეცხლი ინთება და ოქროს ნაპერწკლებს ისვრის → ტორტი ნელა ტრიალებს → კამერა ზემოთ ადის.
   ფურცვლისას: კამერა ტორტს ირგვლივ უვლის. */
import { stage, skyTex, glow, points, canvasTex, envMap, post, bokeh, rose, textTex, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas, C }){
  await Promise.race([Promise.all(['400 80px "Great Vibes"', '500 80px "Noto Serif Georgian"'].map(f => document.fonts.load(f, "A&ა"))), new Promise(r => setTimeout(r, 2500))]);
  const S = stage(THREE, canvas, { fov: 36, exposure: .9, fitW: 2.9, fitH: 3.6, shadows: true }), { R, scene, cam } = S, r = rng(14);
  scene.background = skyTex(THREE, [[0, "#140E0A"], [.55, "#2A1D14"], [1, "#3E2B1E"]]);
  scene.environment = await envMap(THREE, R, .04); scene.environmentIntensity = .35;
  await post(THREE, S, { strength: .8, radius: .45, threshold: 1.0 });
  const bk = bokeh(THREE, scene, 70, { colors: [0xffcf8a, 0xffe6bc, 0xfff3dc, 0xffb070], x: [-8, 8], y: [-1, 7], z: [-6, -18], size: [.4, 1.5], op: [.05, .18], seed: 41 });
  const hemi = new THREE.HemisphereLight(0xfff0dc, 0x2a1a10, .2); scene.add(hemi);
  const key = new THREE.SpotLight(0xfff2e0, 9, 16, .45, .7, 1.2); key.position.set(2.5, 6, 4); key.target.position.set(0, 1.1, 0); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -.0004; scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xffc88a, .9); rim.position.set(-3, 3, -4); scene.add(rim);
  const sparkL = new THREE.PointLight(0xffc060, 0, 5, 1.5); scene.add(sparkL);

  /* table with linen */
  const linen = new THREE.MeshStandardMaterial({ color: 0xc8bba8, roughness: .92 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, .05, 96), linen); top.position.y = -.025; top.receiveShadow = true; scene.add(top);
  const drape = new THREE.Mesh(new THREE.CylinderGeometry(2.42, 2.6, 1.8, 96, 1, true), linen); drape.position.y = -.92; scene.add(drape);
  /* gold cake stand */
  const goldM = new THREE.MeshStandardMaterial({ color: 0xd4ae5e, metalness: 1, roughness: .28 });
  const stand = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [.42, 0], [.44, .03], [.12, .08], [.08, .2], [.1, .24], [1.12, .26], [1.14, .3], [0, .3]].map(([x, y]) => new THREE.Vector2(x, y)), 72), goldM); stand.castShadow = stand.receiveShadow = true; scene.add(stand);

  /* the cake */
  const cake = new THREE.Group(); cake.position.y = .3; scene.add(cake);
  const fondant = new THREE.MeshPhysicalMaterial({ color: 0xd9d0c2, roughness: .6, sheen: .3, sheenColor: new THREE.Color(0xfff6ea), clearcoat: .05, envMapIntensity: .6 });
  const pearlM = new THREE.MeshPhysicalMaterial({ color: 0xe6dfd2, roughness: .22, iridescence: .7, iridescenceIOR: 1.4, clearcoat: 1, envMapIntensity: .9 });
  const tiers = [[.95, .55], [.72, .5], [.5, .45]]; let y = 0; const tierTop = [];
  tiers.forEach(([rad, h], i) => { const prof = [[0, 0], [rad, 0], [rad, h - .045], [rad - .012, h - .015], [rad - .045, h], [0, h]].map(([x, yy]) => new THREE.Vector2(x, yy));
    const m = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), fondant); m.position.y = y; m.castShadow = m.receiveShadow = true; cake.add(m);
    const n = Math.floor(Math.PI * 2 * rad / .055), pearls = new THREE.InstancedMesh(new THREE.SphereGeometry(.026, 14, 10), pearlM, n), M = new THREE.Matrix4();
    for (let k = 0; k < n; k++){ const a = k / n * Math.PI * 2; M.makeTranslation(Math.cos(a) * (rad + .012), y + .026, Math.sin(a) * (rad + .012)); pearls.setMatrixAt(k, M); } pearls.castShadow = true; cake.add(pearls);
    if (i === 1){ const band = new THREE.Mesh(new THREE.CylinderGeometry(rad + .004, rad + .004, .07, 96, 1, true), new THREE.MeshStandardMaterial({ color: 0xd8b56a, metalness: 1, roughness: .35 })); band.position.y = y + h * .55; cake.add(band); }
    y += h; tierTop.push(y); });
  /* a cascade of sugar roses */
  const roseMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .75, sheen: .4, sheenColor: new THREE.Color(0xffffff), side: THREE.DoubleSide });
  const leafM = new THREE.MeshStandardMaterial({ color: 0x9fb39a, roughness: .7, side: THREE.DoubleSide }), leafG = new THREE.CircleGeometry(.04, 12);
  for (let i = 0; i < 14; i++){ const k = i / 13, a = -.6 + k * 2.4, ti = k < .3 ? 2 : k < .62 ? 1 : 0, rad = tiers[ti][0], yy = ti === 0 ? lerp(.15, .5, (1 - (k - .62) / .38)) : tiers.slice(0, ti).reduce((s, t) => s + t[1], 0) + tiers[ti][1] * (.25 + r() * .6);
    const rs = rose(THREE, { seed: 70 + i, color: i % 3 ? 0xd9d0c4 : 0xdcc4bb, base: i % 2 ? 0xc0968c : 0xc8b09a, mat: roseMat, shadow: true }); rs.scale.setScalar(.11 + r() * .04);
    const px = Math.cos(a) * (rad + .02), pz = Math.sin(a) * (rad + .02); rs.position.set(px, yy, pz); rs.lookAt(px * 3, yy + .6, pz * 3); rs.rotateX(Math.PI / 2); cake.add(rs);
    for (let j = 0; j < 2; j++){ const lf = new THREE.Mesh(leafG, leafM); lf.position.set(Math.cos(a + (j ? .14 : -.14)) * (rad + .03), yy - .04, Math.sin(a + (j ? .14 : -.14)) * (rad + .03)); lf.rotation.set(r() * 2, a, r()); lf.scale.set(1, 1.6, 1); cake.add(lf); } }
  /* gold initials topper */
  const ini = (C.a || "ა")[0] + " & " + ((C.b || "")[0] || "");
  const tTex = textTex(THREE, 512, 256, (g, w, h) => { g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.font = '500 150px "Noto Serif Georgian"'; g.fillText((C.a || "ა")[0], w / 2 - 120, h / 2 + 10); g.fillText(((C.b || "")[0] || ""), w / 2 + 120, h / 2 + 10); g.font = '400 140px "Great Vibes"'; g.fillText("&", w / 2, h / 2 + 18); });
  const topper = new THREE.Mesh(new THREE.PlaneGeometry(.9, .45), new THREE.MeshStandardMaterial({ color: 0xe0bc6c, metalness: 1, roughness: .25, alphaMap: tTex, transparent: true, alphaTest: .4, side: THREE.DoubleSide, emissive: 0x3a2808, emissiveIntensity: .3 }));
  topper.position.y = y + .38; cake.add(topper);
  [-.18, .18].forEach(x => { const st = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .2, 6), goldM); st.position.set(x * 1.3, y + .1, 0); cake.add(st); });
  /* sparklers */
  const sticks = [[-.32, .1], [.3, -.12]].map(([x, z]) => { const s = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .5, 6), new THREE.MeshStandardMaterial({ color: 0x777777, metalness: .8, roughness: .5 })); s.position.set(x, y + .25, z); cake.add(s); return new THREE.Vector3(x, y + .5, z); });
  const SP = points(THREE, 1100, .07, 0xffe0a0); scene.add(SP.pts); const spv = Array.from({ length: SP.n }, (_, i) => { const a = r() * 6.28, e = r() * 1.5 - .2, s = .6 + r() * 1.4; return [i % 2, Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s, Math.sin(a) * Math.cos(e) * s, r()]; });
  const heads = sticks.map(() => { const g = glow(THREE, 0xfff0c0, .1, 0); scene.add(g); return g; });

  const OPEN = 3.8, tmp = new THREE.Vector3();
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, dim = on ? seg(t, 0, .6) * (1 - .5 * seg(t, 2.8, 3.8)) : 0, fire = on ? seg(t, .6, .9) : 0, Q = ease(p);
    key.intensity = 9 * (1 - dim * .7); hemi.intensity = .2 * (1 - dim * .7); bk.forEach(b => { b.material.opacity = b.userData.o * (1 - dim * .5) * (.75 + .25 * Math.sin(idle * .7 + b.userData.ph)); });
    cake.rotation.y = on ? (t - .2) * .22 + idle * 0 : Math.sin(idle * .2) * .05;
    cake.updateMatrixWorld(); const wp = sticks.map(s => s.clone().applyMatrix4(cake.matrixWorld));
    for (let i = 0; i < SP.n; i++){ const v = spv[i], src = wp[v[0]], k = ((idle * 1.3 + v[4]) % 1), e = k * .55;
      SP.pos[i * 3] = src.x + v[1] * e; SP.pos[i * 3 + 1] = fire > 0 ? src.y + v[2] * e - k * k * .35 : -50; SP.pos[i * 3 + 2] = src.z + v[3] * e; }
    SP.g.attributes.position.needsUpdate = true; SP.pts.material.opacity = fire;
    heads.forEach((g, i) => { g.position.copy(wp[i]); g.material.opacity = fire; g.scale.setScalar((.18 + Math.abs(Math.sin(idle * 37 + i * 3)) * .06) * fire); });
    sparkL.position.copy(wp[0]).add(wp[1]).multiplyScalar(.5); sparkL.intensity = fire * (5 + Math.abs(Math.sin(idle * 29)) * 1.5);
    const d = S.dist, rise = on ? ease(seg(t, .8, OPEN)) : 0, a = Q * 1.6 + Math.sin(idle * .12) * .05, rad = lerp(d, d * .78, rise) + Q * .5;
    cam.position.set(Math.sin(a) * rad, lerp(1.05, 2.15, rise) + Q * .4, Math.cos(a) * rad);
    cam.lookAt(0, lerp(1.0, 1.75, rise) - Q * .2, 0);
    S.render();
  }
  return { open: OPEN, update };
}
