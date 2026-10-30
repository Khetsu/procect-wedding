/* ყვავილების თაღი · მზიანი ბაღი, თეთრი თაღი მწვანეში, უკან — ცერემონიის სკამების რიგები.
   შეხებისას: თაღზე ყვავილები ქვემოდან ზემოთ იშლება → ფურცლები ცვივა → პეპლები → კამერა თაღში გადის.
   ფურცვლისას: კამერა ჩაივლის ბილიკზე სკამებს შორის, საკურთხევლისკენ. */
import { stage, skyTex, glow, canvasTex, seg, ease, out, back, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 42, exposure: 1.0, fitW: 3.4, fitH: 4.2 }), { R, scene, cam } = S, r = rng(8);
  scene.background = skyTex(THREE, [[0, "#A9CBEA"], [.5, "#E7E6E2"], [1, "#F6ECDD"]]);
  scene.fog = new THREE.Fog(0xeee6da, 18, 60);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8aa06a, .8));
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.8); sun.position.set(-5, 9, 6); scene.add(sun);
  const sunG = glow(THREE, 0xfff4d8, 30, .55); sunG.material.fog = false; sunG.position.set(-14, 16, -40); scene.add(sunG);

  /* lawn, hedges and trees */
  const lg = new THREE.PlaneGeometry(120, 120, 60, 60); lg.rotateX(-Math.PI / 2); const lc = new Float32Array(lg.attributes.position.count * 3);
  for (let i = 0; i < lc.length / 3; i++){ const n = r() * .06; lc[i * 3] = .42 + n; lc[i * 3 + 1] = .6 + n; lc[i * 3 + 2] = .3 + n * .5; } lg.setAttribute("color", new THREE.BufferAttribute(lc, 3));
  scene.add(new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })));
  const leafy = new THREE.IcosahedronGeometry(1, 1), treeM = new THREE.InstancedMesh(leafy, new THREE.MeshStandardMaterial({ color: 0x5d8a4a, roughness: .9, flatShading: true }), 70), M = new THREE.Matrix4(), q = new THREE.Quaternion(), v3 = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();
  for (let i = 0; i < 70; i++){ const side = i % 2 ? 1 : -1, z = -2 - r() * 34, x = side * (5 + r() * 9), s = 1.4 + r() * 2.4; M.compose(v3.set(x, s * .8, z), q.setFromEuler(new THREE.Euler(r(), r(), r())), sc.set(s, s * 1.2, s)); treeM.setMatrixAt(i, M); treeM.setColorAt(i, col.setHSL(.27 + r() * .06, .38, .32 + r() * .12)); }
  scene.add(treeM);

  /* the arch */
  const white = new THREE.MeshStandardMaterial({ color: 0xfbf8f2, roughness: .6 });
  const AR = 1.15, AH = 2.5; [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, AH, 16), white); p.position.set(s * AR, AH / 2, 0); scene.add(p); });
  const top = new THREE.Mesh(new THREE.TorusGeometry(AR, .06, 12, 64, Math.PI), white); top.position.y = AH; scene.add(top);
  const archPt = u => { const L1 = AH, L2 = Math.PI * AR, tot = 2 * L1 + L2, s = u * tot; if (s < L1) return v3.set(-AR, s, 0).clone(); if (s < L1 + L2){ const a = Math.PI - (s - L1) / AR; return v3.set(Math.cos(a) * AR, AH + Math.sin(a) * AR, 0).clone(); } return v3.set(AR, AH - (s - L1 - L2), 0).clone(); };
  const NG = 300, green = new THREE.InstancedMesh(new THREE.SphereGeometry(.09, 8, 6), new THREE.MeshStandardMaterial({ color: 0x4f7d3c, roughness: .8 }), NG);
  for (let i = 0; i < NG; i++){ const p = archPt(r()); p.x += (r() - .5) * .22; p.y += (r() - .5) * .22; p.z += (r() - .5) * .2; M.compose(p, q.setFromEuler(new THREE.Euler(r() * 3, r() * 3, 0)), sc.set(1.3, .55, .9)); green.setMatrixAt(i, M); green.setColorAt(i, col.setHSL(.25 + r() * .08, .45, .36 + r() * .16)); } scene.add(green);
  const roseG = new THREE.LatheGeometry([[0, -.01], [.07, .0], [.12, .04], [.15, .085], [.13, .12], [.08, .1], [.05, .13], [.02, .11]].map(([x, y]) => new THREE.Vector2(x, y)), 40); { const rp = roseG.attributes.position; for (let i = 0; i < rp.count; i++){ const x = rp.getX(i), z = rp.getZ(i), a = Math.atan2(z, x), k = 1 + .18 * Math.sin(a * 5 + rp.getY(i) * 30); rp.setX(i, x * k); rp.setZ(i, z * k); } roseG.computeVertexNormals(); roseG.rotateX(Math.PI / 2); }
  const NF = 130, petalsG = roseG, flowers = new THREE.InstancedMesh(petalsG, new THREE.MeshStandardMaterial({ roughness: .55, emissive: 0x402020, emissiveIntensity: .3, side: THREE.DoubleSide }), NF);
  const fpal = [0xf7c9d2, 0xffffff, 0xf9d7b8, 0xe9a3b4, 0xfbeee4], fd = [];
  for (let i = 0; i < NF; i++){ const u = (i + r() * .6) / NF, p = archPt(u); p.x += (r() - .5) * .2; p.y += (r() - .5) * .2; p.z += (r() - .5) * .22 + .04; fd.push({ p, u, s: .75 + r() * .7, ro: new THREE.Euler((r() - .5) * .9, (r() - .5) * .9, r() * 6) }); flowers.setColorAt(i, col.set(fpal[i % 5])); }
  scene.add(flowers);
  /* ceremony chairs and the aisle */
  const chairG = new THREE.Group(); const seat = new THREE.BoxGeometry(.5, .06, .45), backG = new THREE.BoxGeometry(.5, .55, .05), leg = new THREE.BoxGeometry(.04, .45, .04);
  for (let row = 0; row < 8; row++) for (const side of [-1, 1]) for (let k = 0; k < 3; k++){ const c = new THREE.Group(); const s1 = new THREE.Mesh(seat, white); s1.position.y = .45; const b1 = new THREE.Mesh(backG, white); b1.position.set(0, .74, -.2); c.add(s1, b1);
    [[-.22, -.18], [.22, -.18], [-.22, .18], [.22, .18]].forEach(([x, z]) => { const l = new THREE.Mesh(leg, white); l.position.set(x, .22, z); c.add(l); }); c.position.set(side * (1.0 + k * .62), 0, -2.2 - row * 1.15); c.rotation.y = Math.PI; chairG.add(c); }
  scene.add(chairG);
  const aisle = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 11), new THREE.MeshStandardMaterial({ color: 0xf6efe6, roughness: 1 })); aisle.rotation.x = -Math.PI / 2; aisle.position.set(0, .01, -7); scene.add(aisle);
  const altar = new THREE.Mesh(new THREE.TorusGeometry(1.2, .07, 12, 64, Math.PI), white); altar.position.set(0, 2.2, -13.5); scene.add(altar);
  const altarFl = glow(THREE, 0xffd6e0, 3.5, .5); altarFl.position.set(0, 2.6, -13.4); scene.add(altarFl);

  /* falling petals and butterflies */
  const petalMat = [0xf4b6c4, 0xffffff, 0xf9cfae].map(c => new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: .7 }));
  const petals = Array.from({ length: 120 }, (_, i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(.05, 6), petalMat[i % 3]); m.scale.y = 1.6; m.visible = false; scene.add(m); return { m, x: (r() - .5) * 4, z: -1 + r() * 3, y0: 3.4 + r() * 2, v: .3 + r() * .4, s: r() * 6 }; });
  const wingG = new THREE.CircleGeometry(.12, 12, 0, Math.PI); const bfly = Array.from({ length: 7 }, (_, i) => { const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: [0xf7d26a, 0xffffff, 0xf2a7c3][i % 3], side: THREE.DoubleSide, emissive: 0x332211, emissiveIntensity: .3 });
    const wl = new THREE.Mesh(wingG, m), wr = new THREE.Mesh(wingG, m); wl.rotation.z = Math.PI / 2; wr.rotation.z = -Math.PI / 2; const pl = new THREE.Group(), pr = new THREE.Group(); pl.add(wl); pr.add(wr); g.add(pl, pr); g.visible = false; scene.add(g); return { g, pl, pr, a: r() * 6, rad: .8 + r() * 1.6, h: 1 + r() * 2, sp: .4 + r() * .4 }; });

  const OPEN = 3.6, tmpE = new THREE.Euler();
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, bloom = on ? seg(t, .15, 2.3) : 0, Q = ease(p);
    for (let i = 0; i < NF; i++){ const f = fd[i], k = on ? back(Math.min(1, Math.max(0, (bloom * 1.25 - f.u) * 4))) : .0001; M.compose(f.p, q.setFromEuler(tmpE.set(f.ro.x, f.ro.y, f.ro.z)), sc.setScalar(Math.max(.0001, k * f.s))); flowers.setMatrixAt(i, M); }
    flowers.instanceMatrix.needsUpdate = true;
    for (const pt of petals){ const k = on ? t - 1 - pt.s * .1 : -1; pt.m.visible = k > 0; if (k <= 0) continue; const y = pt.y0 - ((k * pt.v) % 4); pt.m.position.set(pt.x + Math.sin(k * 1.4 + pt.s) * .4, y, pt.z + Math.cos(k + pt.s) * .2); pt.m.rotation.set(k * 2 + pt.s, k * 1.5, pt.s); }
    for (const b of bfly){ b.g.visible = on && t > .8; const a = b.a + idle * b.sp; b.g.position.set(Math.cos(a) * b.rad, b.h + Math.sin(idle * 1.3 + b.a) * .3, Math.sin(a) * b.rad * .6 + .3); b.g.rotation.y = -a; const fl = Math.sin(idle * 18 + b.a) * .9; b.pl.rotation.y = fl; b.pr.rotation.y = -fl; }
    const d = S.dist, walk = on ? ease(seg(t, 2.0, OPEN)) : 0;
    cam.position.set(Math.sin(idle * .2) * .12, lerp(1.35, 1.5, walk) + Q * .3, lerp(d, -.8, walk) - Q * 9.5);
    cam.lookAt(0, lerp(1.45, 1.3, walk), lerp(0, -14, walk) - Q * 4);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
