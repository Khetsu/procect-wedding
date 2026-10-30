/* ვენახი · ოქროს საათი კახეთში: ბორცვებზე ვაზის რიგები, წინ — თიხის ქვევრი.
   შეხებისას: ქვევრს თავსახური ეხდება → შიგნიდან ოქროს შუქი → ვაზის ფოთლები სპირალად ამოდის → კამერა ზემოთ.
   ფურცვლისას: კამერა ვენახის თავზე მზისკენ მიფრინავს. */
import { stage, skyTex, glow, points, canvasTex, seg, ease, out, back, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 40, exposure: 1.02, fitW: 3.8, fitH: 4.8 }), { R, scene, cam } = S, r = rng(7);
  scene.background = skyTex(THREE, [[0, "#3A2850"], [.3, "#9A4F5C"], [.55, "#E38E5C"], [.78, "#F7C27A"], [1, "#FFE6B0"]]);
  scene.fog = new THREE.Fog(0xe9a46c, 14, 80);
  scene.add(new THREE.HemisphereLight(0xffe0b8, 0x3a2416, .75));
  const sun = new THREE.DirectionalLight(0xffb070, 1.7); sun.position.set(-6, 5, -30); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffe4c8, .65); fill.position.set(3, 4, 9); scene.add(fill);
  const sunG1 = glow(THREE, 0xfff1c0, 16, .9), sunG2 = glow(THREE, 0xffb36a, 46, .45); [sunG1, sunG2].forEach(s => { s.material.fog = false; s.position.set(-4, 3.2, -70); scene.add(s); });

  /* rolling hills, flat around the qvevri */
  const H = (x, z) => { const k = Math.min(1, Math.max(0, (Math.hypot(x, z * 1.3) - 5) / 12)) * Math.min(1, Math.max(0, (-z - 3) / 8)); return (Math.sin(x * .11) * 1.4 + Math.cos(z * .085 + x * .05) * 1.8 + Math.sin((x + z) * .05) * 1.2) * k - .05; };
  const gg = new THREE.PlaneGeometry(220, 220, 160, 160); gg.rotateX(-Math.PI / 2); const gp = gg.attributes.position, gc = new Float32Array(gp.count * 3);
  for (let i = 0; i < gp.count; i++){ const x = gp.getX(i), z = gp.getZ(i), y = H(x, z); gp.setY(i, y); const n = r() * .06; gc[i * 3] = .36 + n + y * .02; gc[i * 3 + 1] = .34 + n + y * .015; gc[i * 3 + 2] = .16 + n * .5; }
  gg.setAttribute("color", new THREE.BufferAttribute(gc, 3)); gg.computeVertexNormals();
  scene.add(new THREE.Mesh(gg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, side: THREE.DoubleSide })));

  /* vine rows */
  const bush = new THREE.IcosahedronGeometry(.48, 1), bp = bush.attributes.position; for (let i = 0; i < bp.count; i++) bp.setY(i, bp.getY(i) * .8);
  const spots = []; for (let x = -34; x <= 34; x += 1.7) for (let z = -6; z >= -90; z -= 1.05){ if (Math.abs(x) < 3 && z > -9) continue; spots.push([x + (r() - .5) * .2, z + (r() - .5) * .3]); }
  const vines = new THREE.InstancedMesh(bush, new THREE.MeshStandardMaterial({ color: 0x4f6b2a, roughness: .9 }), spots.length), M = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), col = new THREE.Color();
  spots.forEach(([x, z], i) => { const s = .75 + r() * .5; ps.set(x, H(x, z) + .38 * s, z); q.setFromEuler(new THREE.Euler(0, r() * 6, 0)); sc.set(s, s, s * 1.15); M.compose(ps, q, sc); vines.setMatrixAt(i, M); vines.setColorAt(i, col.setHSL(.2 + r() * .06, .45, .26 + r() * .1)); });
  scene.add(vines);

  /* the qvevri: a hand-made clay vessel half in the earth */
  const clay = canvasTex(THREE, 256, 256, (g, w) => { g.fillStyle = "#b8653a"; g.fillRect(0, 0, w, w); const rr = rng(3); for (let i = 0; i < 2600; i++){ g.fillStyle = `rgba(${90 + rr() * 80},${40 + rr() * 30},${20 + rr() * 20},${rr() * .25})`; g.fillRect(rr() * w, rr() * w, 2 + rr() * 3, 1 + rr() * 2); } for (let y = 0; y < w; y += 18){ g.fillStyle = "rgba(60,25,10,.12)"; g.fillRect(0, y, w, 2); } });
  const prof = [[.0, -.46], [.7, -.43], [.95, -.2], [1.02, 0], [.98, .45], [.78, .78], [.42, .98], [.36, 1.08], [.42, 1.14], [.34, 1.16]].map(([x, y]) => new THREE.Vector2(x, y));
  const qv = new THREE.Mesh(new THREE.LatheGeometry(prof, 64), new THREE.MeshStandardMaterial({ map: clay, roughness: .82, side: THREE.DoubleSide })); qv.position.set(0, .4, 0); scene.add(qv);
  const mound = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 1 })); mound.rotation.x = -Math.PI / 2; mound.position.y = .02; scene.add(mound);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.44, .46, .1, 40), new THREE.MeshStandardMaterial({ color: 0x8a7562, roughness: .9 })); scene.add(lid);
  const neck = new THREE.Vector3(0, 1.5, 0);
  const inner = new THREE.PointLight(0xffc463, 0, 9, 1.5); inner.position.set(0, 2, .3); scene.add(inner);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, .3, 7, 40, 1, true), beamMat); beam.position.set(0, neck.y + 3.5, 0); scene.add(beam);
  const mouth = glow(THREE, 0xffd88a, .1, 0); mouth.position.copy(neck); scene.add(mouth);

  /* grape leaves rising in a spiral */
  const ls = new THREE.Shape(); ls.moveTo(0, 0);
  [[.18, .1, .42, .12], [.36, .38, .3, .5], [.46, .66, .16, .62], [.2, .86, 0, 1.0]].forEach(([a, b, c, d]) => ls.quadraticCurveTo(a, b, c, d));
  [[-.16, .62, -.46, .66], [-.3, .5, -.36, .38], [-.42, .12, -.18, .1]].forEach(([a, b, c, d]) => ls.quadraticCurveTo(a, b, c, d)); ls.lineTo(0, 0);
  const lg = new THREE.ShapeGeometry(ls, 6); lg.translate(0, -.4, 0);
  const leafMats = [0x6f8f2e, 0x88a83a, 0xa7b43e, 0xc9a646].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .6, side: THREE.DoubleSide, emissive: 0x2a2a06, emissiveIntensity: .4 }));
  const leaves = []; for (let i = 0; i < 64; i++){ const m = new THREE.Mesh(lg, leafMats[i % 4]); m.scale.setScalar(.35 + r() * .45); m.visible = false; scene.add(m); leaves.push({ m, a: r() * 6.28, d: i / 64 * 1.1, h: 3 + r() * 4.5, rad: .8 + r() * 1.8, sp: r() * 6 }); }
  const gold = points(THREE, 220, .09, 0xffe2a0); gold.pts.material.fog = false; scene.add(gold.pts);
  const gv = []; for (let i = 0; i < gold.n; i++) gv.push([r() * 6.28, .3 + r() * 2.2, 2 + r() * 6, r()]);

  const OPEN = 3.7;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, lift = on ? out(seg(t, .15, 1.2)) : 0, glowK = on ? seg(t, .5, 1.6) * (1 - .4 * seg(t, 3.2, OPEN)) : 0;
    lid.position.set(lift * 1.2, 1.57 + Math.sin(lift * Math.PI) * .9 - lift * .05, lift * .6 + (on ? 0 : Math.sin(idle * 2) * .002));
    lid.rotation.set(lift * .9, 0, -lift * 1.2);
    inner.intensity = glowK * 9; beamMat.opacity = glowK * .16; mouth.material.opacity = glowK; mouth.scale.setScalar(.1 + glowK * 3.2 + Math.sin(idle * 3) * .15 * glowK);
    for (const L of leaves){ const k = on ? seg(t, .7 + L.d, 3.3 + L.d * .6) : 0; L.m.visible = k > 0;
      if (k > 0){ const e = out(k), a = L.a + e * 5.5 + idle * .3; L.m.position.set(Math.cos(a) * L.rad * e, neck.y + e * L.h + Math.sin(idle + L.sp) * .1, Math.sin(a) * L.rad * e * .7);
        L.m.rotation.set(Math.sin(idle * 1.3 + L.sp) * .6 + e * 2, a + Math.PI / 2, Math.cos(idle + L.sp) * .5); L.m.scale.setScalar((.35 + (L.sp % 1) * .4) * Math.min(1, e * 3)); } }
    for (let i = 0; i < gold.n; i++){ const v = gv[i], k = on ? (((t - .6) * .35 + v[3]) % 1 + 1) % 1 : v[3], a = v[0] + k * 4;
      gold.pos[i * 3] = Math.cos(a) * v[1] * k * 1.5; gold.pos[i * 3 + 1] = neck.y + k * v[2]; gold.pos[i * 3 + 2] = Math.sin(a) * v[1] * k; }
    gold.g.attributes.position.needsUpdate = true; gold.pts.material.opacity = on ? glowK : 0;
    /* camera */
    const d = S.dist, rise = on ? ease(seg(t, 1.6, OPEN)) : 0, Q = ease(p);
    cam.position.set(Math.sin(idle * .15) * .2 + Q * 1.5, lerp(1.7, 3.0, rise) + Q * 5, lerp(d, d + 1.2, rise) - Q * 26);
    cam.lookAt(0, lerp(1.05, -.1, rise) + (on ? Math.sin(seg(t, .8, 2.4) * Math.PI) * 1.4 : 0) + Q * 2.5, -Q * 60);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
