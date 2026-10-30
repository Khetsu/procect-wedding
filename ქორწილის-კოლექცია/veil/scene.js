/* ფატა · თბილი, ოქროსფერი საღამოს შუქი; მთელ ეკრანს ფარავს თულის ფატა მაქმანის კიდით, მის მიღმა — თეთრი ვარდების თაიგული მინის ლარნაკში.
   შეხებისას: ფატა ქვემოდან ზემოთ ნაზად აიწევა და გადაიკეცება → ვარდის ფურცლები ცვივა → კამერა თაიგულს უახლოვდება.
   ფურცვლისას: კამერა თაიგულს ირგვლივ უვლის. */
import { stage, skyTex, glow, canvasTex, envMap, post, bokeh, rose, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 36, exposure: .82, fitW: 2.5, fitH: 3.2, shadows: true }), { R, scene, cam } = S, r = rng(6);
  scene.background = skyTex(THREE, [[0, "#5A4A3E"], [.5, "#9C826A"], [1, "#D8BE9E"]]);
  scene.environment = await envMap(THREE, R, .04); scene.environmentIntensity = .22;
  await post(THREE, S, { strength: .4, radius: .5, threshold: 1.0 });
  const bk = bokeh(THREE, scene, 46, { colors: [0xffe6c2, 0xfff3e0, 0xffd7a0], x: [-6, 6], y: [0, 6], z: [-5, -12], size: [.5, 1.4], op: [.03, .1], seed: 31 });
  scene.add(new THREE.HemisphereLight(0xfff2e2, 0x5a4636, .1));
  const sun = new THREE.DirectionalLight(0xffd9a8, 1.25); sun.position.set(-4, 5, -2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 8; sun.shadow.bias = -.0004; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xfff4ea, .3); fill.position.set(2, 2.5, 5); scene.add(fill);
  const winGlow = glow(THREE, 0xfff1d8, 9, .3); winGlow.material.fog = false; winGlow.position.set(-5, 3.5, -7); scene.add(winGlow);

  /* linen-covered table */
  const linenT = canvasTex(THREE, 256, 256, (g, w) => { g.fillStyle = "#a89a88"; g.fillRect(0, 0, w, w); const rr = rng(4); for (let i = 0; i < w; i += 2){ g.fillStyle = `rgba(120,100,80,${.03 + rr() * .03})`; g.fillRect(0, i, w, 1); g.fillRect(i, 0, 1, w); } }); linenT.wrapS = linenT.wrapT = THREE.RepeatWrapping; linenT.repeat.set(8, 8);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshStandardMaterial({ map: linenT, roughness: .95 })); table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);

  /* glass vase */
  const vase = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [.2, 0], [.24, .05], [.26, .3], [.22, .55], [.2, .62], [.23, .66], [.21, .66], [.18, .6], [.2, .55], [.23, .3], [.21, .06], [0, .04]].map(([x, y]) => new THREE.Vector2(x, y)), 48),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, transmission: 1, thickness: .1, ior: 1.5, envMapIntensity: 1.8, side: THREE.DoubleSide }));
  vase.castShadow = true; scene.add(vase);
  /* the bouquet: roses in a dome, eucalyptus sprigs, a satin ribbon */
  const bq = new THREE.Group(); bq.position.y = .62; scene.add(bq);
  const roseMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .8, sheen: .3, sheenColor: new THREE.Color(0xfff6ee), sheenRoughness: .6, side: THREE.DoubleSide });
  const spots = [[0, .55, 0], [.3, .45, .1], [-.3, .45, .08], [.12, .43, .32], [-.15, .44, -.28], [.2, .4, -.25], [-.28, .38, .3], [.42, .3, -.05], [-.42, .3, -.1], [0, .36, .42], [.05, .38, -.42]];
  spots.forEach(([x, y, z], i) => { const rs = rose(THREE, { seed: 40 + i, color: i % 4 === 1 ? 0xe9d2c9 : 0xe8e0d4, base: i % 3 === 0 ? 0xc8968c : 0xd2b8a0, mat: roseMat, shadow: true });
    rs.scale.setScalar(.2 + r() * .04); rs.position.set(x, y, z); rs.lookAt(x * 3, y + 1.4, z * 3); rs.rotateX(Math.PI / 2); bq.add(rs);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .7, 6), new THREE.MeshStandardMaterial({ color: 0x5f7a4a })); st.position.set(x * .5, y - .38, z * .5); st.rotation.set(z * .6, 0, -x * .6); bq.add(st); });
  const leafG = new THREE.CircleGeometry(.05, 14), sage = [0x8fa58a, 0xa3b59c, 0x7d9479].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .7, side: THREE.DoubleSide }));
  for (let s = 0; s < 9; s++){ const a = s / 9 * Math.PI * 2 + r() * .3, len = .45 + r() * .25; for (let j = 0; j < 9; j++){ const k = j / 8, m = new THREE.Mesh(leafG, sage[(s + j) % 3]); const rad = .3 + k * len * .9;
      m.position.set(Math.cos(a) * rad, .25 + k * .2 - k * k * .25, Math.sin(a) * rad); m.rotation.set(r() * 3, a, r() * 3); m.scale.setScalar(1.3 - k * .5); m.castShadow = true; bq.add(m); } }
  const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .1, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xf6efe4, roughness: .3, sheen: 1, side: THREE.DoubleSide })); ribbon.position.y = .04; bq.add(ribbon);

  /* the veil: tulle with a scalloped lace border */
  const VW = 3.6, VH = 4.6, TOPY = 3.5, VZ = 1.5;
  const tulle = canvasTex(THREE, 1024, 1300, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.07)"; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(255,255,255,.3)"; for (let y = 0; y < h; y += 6) for (let x = (y / 6) % 2 ? 3 : 0; x < w; x += 6) g.fillRect(x, y, 1.6, 1.6);
    const rr = rng(8); for (let i = 0; i < 260; i++){ const x = rr() * w, y = rr() * (h - 200); g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.arc(x, y, 1.6 + rr() * 1.4, 0, 7); g.fill(); }
    const by = h - 150; g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 3; for (let x = 0; x < w; x += 64){ g.beginPath(); g.arc(x + 32, by + 70, 32, 0, Math.PI); g.stroke(); g.beginPath(); g.arc(x + 32, by + 70, 22, 0, Math.PI); g.stroke();
      for (let k = 0; k < 5; k++){ const a = Math.PI * (k + .5) / 5; g.beginPath(); g.ellipse(x + 32 + Math.cos(a) * 16, by + 30 + Math.sin(a) * 18, 6, 10, a, 0, 7); g.stroke(); } }
    g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(0, by - 10, w, 6); });
  const veilG = new THREE.PlaneGeometry(VW, VH, 44, 56); veilG.translate(0, -VH / 2, 0); const vp = veilG.attributes.position, vb = Float32Array.from(vp.array);
  const veilM = new THREE.MeshStandardMaterial({ map: tulle, transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: .9, emissive: 0xffffff, emissiveIntensity: .05 });
  const veil = new THREE.Mesh(veilG, veilM); veil.position.set(0, TOPY, VZ); scene.add(veil);
  /* falling petals */
  const ps = new THREE.Shape(); ps.moveTo(0, 0); ps.bezierCurveTo(.5, .1, .55, .75, 0, 1); ps.bezierCurveTo(-.55, .75, -.5, .1, 0, 0);
  const petMats = [0xfff8f2, 0xf6dcd6].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .6, side: THREE.DoubleSide }));
  const petals = Array.from({ length: 50 }, (_, i) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(ps, 6), petMats[i % 2]); m.scale.setScalar(.05 + r() * .03); m.visible = false; scene.add(m); return { m, x: (r() - .5) * 3, z: (r() - .5) * 2 + .3, y0: 3 + r() * 1.5, v: .25 + r() * .25, s: r() * 6 }; });

  const OPEN = 3.6;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, Q = ease(p);
    for (let i = 0; i < vp.count; i++){ const x0 = vb[i * 3], y0 = vb[i * 3 + 1], d = -y0, vN = d / VH;   // 0 at the top bar, 1 at the hem
      const k = on ? ease(seg(t, .15 + (1 - vN) * .55, 1.5 + (1 - vN) * .9)) : 0, a = k * Math.PI * .97;
      const sway = (1 - k) * (.06 * Math.sin(idle * 1.1 + y0 * 1.3 + x0 * .4) * vN), flut = Math.sin(idle * 3 + y0 * 2 + x0) * .12 * Math.sin(a) * vN;
      vp.setXYZ(i, x0 * (1 - .08 * Math.sin(a)) + flut, -d * Math.cos(a), sway - d * Math.sin(a) - Math.sin(a) * .35 * Math.sin(Math.PI * vN)); }
    vp.needsUpdate = true; veilG.computeVertexNormals();
    veil.position.y = TOPY + (on ? ease(seg(t, 2.4, 3.6)) * 2.5 : 0); veilM.opacity = 1 - (on ? seg(t, 2.8, 3.6) : 0); veil.visible = veilM.opacity > .01;
    for (const P of petals){ const k = on ? t - .9 - P.s * .08 : -1; P.m.visible = k > 0; if (k <= 0) continue; const y = P.y0 - ((k * P.v) % 4.5); P.m.position.set(P.x + Math.sin(k * 1.3 + P.s) * .35, y, P.z + Math.cos(k + P.s) * .2); P.m.rotation.set(k * 1.8 + P.s, k * 1.2, P.s); }
    bk.forEach(b => { b.material.opacity = b.userData.o * (.7 + .3 * Math.sin(idle * .6 + b.userData.ph)); });
    const d = S.dist, near = on ? ease(seg(t, 1.6, OPEN)) : 0, a = Q * 1.7 + Math.sin(idle * .12) * .05, rad = lerp(d + .6, d * .8, near) + Q * .3;
    cam.position.set(Math.sin(a) * rad, lerp(1.55, 2.35, near) + Q * .4, Math.cos(a) * rad);
    cam.lookAt(0, lerp(1.25, 1.0, near) + Q * .05, 0);
    S.render();
  }
  return { open: OPEN, update };
}
