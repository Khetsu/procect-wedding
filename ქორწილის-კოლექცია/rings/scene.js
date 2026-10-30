/* ბეჭდები აბრეშუმზე · მაკრო კადრი: შამპანურისფერი აბრეშუმი ნაკეცებით, ვარდის ფურცლები, ორი ბეჭედი — ოქრო და თეთრი ოქრო ბრილიანტით.
   შეხებისას: ბეჭდები ჰაერში ადის და ტრიალებს → ერთმანეთს უახლოვდება და ერთმანეთში ეჭიდება → ნათება, ნაპერწკლები → ერთად ნელა ტრიალებს.
   ფურცვლისას: კამერა ბეჭდებს ირგვლივ უვლის. */
import { stage, skyTex, glow, points, envMap, post, bokeh, seg, ease, out, back, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 34, exposure: 1.0, fitW: 2.7, fitH: 3.3, shadows: true }), { R, scene, cam } = S, r = rng(4);
  scene.background = skyTex(THREE, [[0, "#3B2E25"], [.5, "#6E5A48"], [1, "#B39A80"]]);
  scene.environment = await envMap(THREE, R, .04); scene.environmentIntensity = .45;
  await post(THREE, S, { strength: .55, radius: .4, threshold: .95 });
  const bk = bokeh(THREE, scene, 50, { colors: [0xffe2b8, 0xfff2dc, 0xffd29a], x: [-7, 7], y: [1, 7], z: [-6, -14], size: [.5, 1.5], op: [.03, .11], seed: 21 });
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x6a5444, .15));
  const key = new THREE.DirectionalLight(0xfff0dc, 1.5); key.position.set(3, 6, 3); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 8; key.shadow.bias = -.0003;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 15 }); scene.add(key);
  const rimL = new THREE.PointLight(0xffd9a8, 3, 6, 1.5); rimL.position.set(-1.5, 2, -1.5); scene.add(rimL);
  const flare = new THREE.PointLight(0xfff0d0, 0, 4, 1.6); flare.position.set(0, 1.2, .3); scene.add(flare);

  /* silk with soft folds */
  const H = (x, z) => .16 * Math.sin(x * 1.2 + z * .5) + .1 * Math.sin(z * 2.0 - x * .7) + .04 * Math.sin((x + z) * 4.1) - .06 * Math.exp(-(x * x + z * z) * .6);
  const sg = new THREE.PlaneGeometry(16, 16, 200, 200); sg.rotateX(-Math.PI / 2); const sp = sg.attributes.position;
  for (let i = 0; i < sp.count; i++) sp.setY(i, H(sp.getX(i), sp.getZ(i))); sg.computeVertexNormals();
  const silk = new THREE.Mesh(sg, new THREE.MeshPhysicalMaterial({ color: 0xb39c80, roughness: .42, sheen: .8, sheenColor: new THREE.Color(0xf2dcc0), sheenRoughness: .35, clearcoat: .1, envMapIntensity: .5 })); silk.receiveShadow = true; scene.add(silk);

  /* rose petals lying on the silk */
  const ps = new THREE.Shape(); ps.moveTo(0, 0); ps.bezierCurveTo(.5, .1, .55, .75, 0, 1); ps.bezierCurveTo(-.55, .75, -.5, .1, 0, 0);
  const pg = new THREE.ShapeGeometry(ps, 12), pp = pg.attributes.position; for (let i = 0; i < pp.count; i++){ const x = pp.getX(i), y = pp.getY(i); pp.setZ(i, .18 * x * x + .1 * y * y); } pg.computeVertexNormals();
  const petalMats = [0xf3c7cc, 0xfaf3ea, 0xe7a9b2].map(c => new THREE.MeshPhysicalMaterial({ color: c, roughness: .5, sheen: 1, sheenColor: new THREE.Color(0xffffff), side: THREE.DoubleSide }));
  for (let i = 0; i < 16; i++){ const a = r() * 6.28, d = 1.3 + r() * 1.8, x = Math.cos(a) * d, z = Math.sin(a) * d * .8 - .3, m = new THREE.Mesh(pg, petalMats[i % 3]); m.scale.setScalar(.22 + r() * .12); m.position.set(x, H(x, z) + .02, z); m.rotation.set(-Math.PI / 2 + (r() - .5) * .4, 0, r() * 6.28); m.castShadow = m.receiveShadow = true; scene.add(m); }

  /* the rings */
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xf0c56a, metalness: 1, roughness: .1, clearcoat: .6, envMapIntensity: 1.8 });
  const plat = new THREE.MeshPhysicalMaterial({ color: 0xeceef3, metalness: 1, roughness: .08, clearcoat: .6, envMapIntensity: 1.9 });
  const bandG = (R0, w, th) => { const sh = new THREE.Shape(); sh.absarc(0, 0, th, 0, Math.PI * 2, false); const pts = []; for (let i = 0; i <= 40; i++){ const a = i / 40 * Math.PI * 2; pts.push(new THREE.Vector2(R0 + Math.cos(a) * th, Math.sin(a) * w)); } return new THREE.LatheGeometry(pts, 160).rotateX(Math.PI / 2); };
  const ringA = new THREE.Group(), ringB = new THREE.Group(); scene.add(ringA, ringB);
  const bandA = new THREE.Mesh(bandG(.5, .1, .06), gold); bandA.castShadow = true; ringA.add(bandA);
  const bandB = new THREE.Mesh(bandG(.44, .07, .045), plat); bandB.castShadow = true; ringB.add(bandB);
  /* brilliant-cut diamond in a four-prong setting */
  const crown = new THREE.CylinderGeometry(.075, .13, .06, 16, 1), pav = new THREE.ConeGeometry(.13, .13, 16, 1);
  const diamond = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0, transmission: 1, ior: 2.42, thickness: .4, envMapIntensity: 3.2, specularIntensity: 1, iridescence: .35, flatShading: true });
  const gem = new THREE.Group(); const c1 = new THREE.Mesh(crown, diamond), c2 = new THREE.Mesh(pav, diamond); c2.rotation.x = Math.PI; c2.position.y = -.095; gem.add(c1, c2); gem.position.set(0, .5 + .13, 0); ringB.add(gem);
  for (let i = 0; i < 4; i++){ const a = i / 4 * Math.PI * 2 + Math.PI / 4, pr = new THREE.Mesh(new THREE.CylinderGeometry(.012, .016, .17, 8), plat); pr.position.set(Math.cos(a) * .1, .5 + .08, Math.sin(a) * .1); pr.rotation.set(Math.sin(a) * .25, 0, -Math.cos(a) * .25); ringB.add(pr); }
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(.09, .05, .08, 16), plat); basket.position.y = .5 + .02; ringB.add(basket);
  const glints = [0, 1, 2].map(() => { const s = glow(THREE, 0xffffff, .2, 0); gem.add(s); return s; });
  const burst = points(THREE, 160, .05, 0xffe9b8); scene.add(burst.pts); const bv = Array.from({ length: burst.n }, () => { const a = r() * 6.28, e = (r() - .5) * 2.4, s = .6 + r() * 1.6; return [Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s, Math.sin(a) * Math.cos(e) * s]; });

  /* start: lying on the silk · end: interlocked in the air (A in the xy-plane, B in the yz-plane) */
  const Y0 = .9, A0 = { p: new THREE.Vector3(-.62, H(-.62, .3) + .17, .3), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, .3)) };
  const B0 = { p: new THREE.Vector3(.6, H(.6, -.2) + .2, -.2), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2 - .35, 0, -.5)) };
  const A1 = { p: new THREE.Vector3(-.2, Y0, 0), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, .0, 0)) }, B1 = { p: new THREE.Vector3(.2, Y0 + .3, 0), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)) };
  const pair = new THREE.Group(); pair.position.set(0, 0, 0); scene.add(pair);
  const tq = new THREE.Quaternion(), spinQ = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), tp = new THREE.Vector3(), pivot = new THREE.Vector3(0, Y0, 0);
  const OPEN = 3.8;
  function place(ring, P0, P1, k, lift, spin, rot){ tp.copy(P0.p).lerp(P1.p, k); tp.y += Math.sin(Math.min(1, lift) * Math.PI / 2) * (1 - k) * .55; tq.copy(P0.q).slerp(P1.q, k); spinQ.setFromAxisAngle(up, spin); ring.quaternion.copy(spinQ).multiply(tq);
    tp.sub(pivot).applyAxisAngle(up, rot).add(pivot); ring.position.copy(tp); spinQ.setFromAxisAngle(up, rot); ring.quaternion.premultiply(spinQ); }
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, lift = on ? out(seg(t, 0, 1.0)) : 0, meet = on ? ease(seg(t, .7, 2.3)) : 0, Q = ease(p);
    const spin = (1 - meet) * lift * Math.PI * 2.2, rot = on ? Math.max(0, t - 2.3) * .35 : 0, hov = on ? Math.sin(idle * 1.1) * .03 * meet : 0;
    place(ringA, A0, A1, meet, lift, spin, rot); place(ringB, B0, B1, meet, lift, -spin, rot);
    if (lift > 0 && meet < 1){ ringA.position.y += lift * (1 - meet) * .25; ringB.position.y += lift * (1 - meet) * .25; }
    ringA.position.y += hov; ringB.position.y += hov;
    const lk = on ? seg(t, 2.15, 2.4) * (1 - seg(t, 2.5, 3.6)) : 0; flare.intensity = lk * 18;
    for (let i = 0; i < burst.n; i++){ const k = on ? Math.max(0, t - 2.25) : 0, e = 1 - Math.exp(-k * 2.5); burst.pos[i * 3] = bv[i][0] * e; burst.pos[i * 3 + 1] = Y0 + bv[i][1] * e - k * k * .05; burst.pos[i * 3 + 2] = bv[i][2] * e; }
    burst.g.attributes.position.needsUpdate = true; burst.pts.material.opacity = on && t > 2.25 ? 1 - seg(t, 2.6, 4.2) : 0;
    glints.forEach((g, i) => { const s = Math.max(0, Math.sin(idle * (2.6 + i) + i * 2)); g.material.opacity = Math.pow(s, 8) * .9; g.scale.setScalar(.12 + Math.pow(s, 8) * .25); g.position.set((i - 1) * .05, .02 + i * .01, .06); });
    bk.forEach(b => { b.material.opacity = b.userData.o * (.7 + .3 * Math.sin(idle * .6 + b.userData.ph)); });
    const d = S.dist, near = on ? ease(seg(t, 1.2, OPEN)) : 0, a = Q * 1.8 + Math.sin(idle * .15) * .05, rad = lerp(d, d * .82, near) + Q * .4;
    cam.position.set(Math.sin(a) * rad, lerp(1.35, 1.3, near) + Q * .5, Math.cos(a) * rad);
    cam.lookAt(0, lerp(.15, .82, near), 0);
    S.render();
  }
  return { open: OPEN, update };
}
