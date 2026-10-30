/* ფარდა · თეატრის სცენა: წითელი ხავერდის ფარდა, პროჟექტორები, ნათურებიანი წარწერა (config: stageText).
   შეხებისას: პროჟექტორები შუაში ჩერდება → ფარდა იშლება → წარწერის ნათურები რიგ-რიგად ინთება → ოქროს კონფეტი.
   ფურცვლისას: კამერა სცენასთან მიდის და ზემოთ იწევს. */
import { stage, glow, points, canvasTex, envMap, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas, C }){
  const S = stage(THREE, canvas, { fov: 42, exposure: 1.0, fitW: 5.2, fitH: 7.4 }), { R, scene, cam } = S, r = rng(5);
  scene.background = new THREE.Color(0x050203); scene.environment = await envMap(THREE, R, .03); scene.environmentIntensity = .35;
  scene.add(new THREE.HemisphereLight(0xffd9c0, 0x100306, .35));
  const key = new THREE.SpotLight(0xffe6c4, 60, 30, .42, .5, 1.4); key.position.set(0, 9, 7); key.target.position.set(0, 2.5, 0); scene.add(key, key.target);

  /* floor and back wall */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), new THREE.MeshPhysicalMaterial({ color: 0x140708, roughness: .22, clearcoat: 1, clearcoatRoughness: .15 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshStandardMaterial({ color: 0x1c060a, roughness: .95 })); wall.position.set(0, 4.5, -2.5); scene.add(wall);

  /* the light-bulb sign behind the curtain */
  const txt = String(C.stageText || "10"), cvW = 360, cvH = 200;
  const cv = document.createElement("canvas"); cv.width = cvW; cv.height = cvH; const g = cv.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, cvW, cvH);
  g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 ${txt.length > 2 ? 120 : 175}px "Arial Black", "Segoe UI", sans-serif`; g.fillText(txt, cvW / 2, cvH / 2 + 6);
  const px = g.getImageData(0, 0, cvW, cvH).data, bulbsXY = []; for (let y = 0; y < cvH; y += 8) for (let x = 0; x < cvW; x += 8) if (px[(y * cvW + x) * 4] > 128) bulbsXY.push([x, y]);
  for (let i = 0; i <= 40; i++){ const a = i / 40; bulbsXY.push([a * cvW, -6], [a * cvW, cvH + 6]); } for (let i = 1; i < 22; i++){ const a = i / 22; bulbsXY.push([-6, a * cvH], [cvW + 6, a * cvH]); }
  const B = points(THREE, bulbsXY.length, .17, 0xffffff, { vertexColors: true }); const bc = new Float32Array(B.n * 3); B.g.setAttribute("color", new THREE.BufferAttribute(bc, 3));
  const sw = 4.6 / cvW; bulbsXY.forEach(([x, y], i) => { B.pos[i * 3] = (x - cvW / 2) * sw; B.pos[i * 3 + 1] = 3.6 - (y - cvH / 2) * sw; B.pos[i * 3 + 2] = -2.3; });
  scene.add(B.pts); const signGlow = glow(THREE, 0xffc070, 8, 0); signGlow.position.set(0, 3.6, -2.2); scene.add(signGlow);
  const signLight = new THREE.PointLight(0xffb85a, 0, 12, 1.4); signLight.position.set(0, 3.6, -1); scene.add(signLight);

  /* velvet curtains, re-shaped every frame */
  const CW = 3.5, CH = 7.6, SX = 70, SY = 24;
  const velvet = new THREE.MeshPhysicalMaterial({ color: 0x7c0c18, roughness: .62, sheen: 1, sheenColor: new THREE.Color(0xff5a6e), sheenRoughness: .35, side: THREE.DoubleSide });
  const halves = [-1, 1].map(side => { const geo = new THREE.PlaneGeometry(CW, CH, SX, SY), base = Float32Array.from(geo.attributes.position.array); const m = new THREE.Mesh(geo, velvet); m.position.set(side * CW / 2, CH / 2 - .02, -.3); scene.add(m); return { geo, base, side, m }; });
  function shapeCurtain(o, idle){
    for (const hlf of halves){ const p = hlf.geo.attributes.position.array, b = hlf.base;
      for (let i = 0; i < p.length; i += 3){ const x = b[i], y = b[i + 1], yN = (y + CH / 2) / CH;
        const u = hlf.side < 0 ? (CW / 2 - x) / CW : (x + CW / 2) / CW;           // 0 at the centre seam, 1 at the outer edge
        const gather = o * (.72 + .22 * (1 - yN));
        const nu = 1 - (1 - u) * (1 - gather);                                  // pulled towards the outer edge
        const amp = .07 + .2 * gather + .04 * (1 - yN) * o;
        p[i] = hlf.side < 0 ? CW / 2 - nu * CW : -CW / 2 + nu * CW;
        p[i + 2] = Math.sin(u * 46 + yN * .8) * amp + Math.sin(idle * 1.3 + u * 7 + yN * 2) * .035 * (1 - o * .6);
      } hlf.geo.attributes.position.needsUpdate = true; hlf.geo.computeVertexNormals(); }
  }
  const valance = new THREE.Mesh(new THREE.BoxGeometry(7.6, .9, .4), velvet); valance.position.set(0, CH - .1, -.1); scene.add(valance);
  const trim = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 7.6, 12), new THREE.MeshStandardMaterial({ color: 0xd8b060, metalness: 1, roughness: .25 })); trim.rotation.z = Math.PI / 2; trim.position.set(0, CH - .55, .12); scene.add(trim);

  /* sweeping spotlight cones */
  const coneMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: .07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const cones = [-1, 1].map(s => { const c = new THREE.Mesh(new THREE.ConeGeometry(1.1, 11, 32, 1, true), coneMat); c.geometry.translate(0, -5.5, 0); const piv = new THREE.Group(); piv.position.set(s * 4, 9.5, 2.5); piv.add(c); scene.add(piv); return piv; });

  /* gold confetti */
  const confMat = [0xe8c070, 0xfff0c0, 0xc9963c].map(c => new THREE.MeshStandardMaterial({ color: c, metalness: .9, roughness: .3, side: THREE.DoubleSide }));
  const conf = []; for (let i = 0; i < 150; i++){ const m = new THREE.Mesh(new THREE.PlaneGeometry(.07, .14), confMat[i % 3]); m.visible = false; scene.add(m); conf.push({ m, x: (r() - .5) * 7, z: -1.5 + r() * 4, y0: 8 + r() * 6, v: .9 + r() * 1.2, s: r() * 6, w: r() * 4 }); }

  const OPEN = 3.6;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, o = on ? ease(seg(t, .35, 2.5)) : 0;
    shapeCurtain(o, idle);
    cones.forEach((c, i) => { const s = i ? 1 : -1, sweep = Math.sin(idle * .7 + i * 2.1) * .45, aim = on ? out(seg(t, 0, .35)) : 0; c.rotation.z = lerp(sweep, s * .38, aim); c.rotation.x = -.18; });
    coneMat.opacity = .06 + (on ? .03 * seg(t, 0, .35) : 0);
    const lit = on ? seg(t, .9, 2.6) : 0, chase = idle * 7;
    for (let i = 0; i < B.n; i++){ const order = (B.pos[i * 3] + 2.4) / 4.8, onK = Math.min(1, Math.max(0, (lit * 1.25 - order) * 5)); const tw = .65 + .35 * Math.sin(chase - i * .55);
      const k = onK * (lit >= 1 ? tw : 1); bc[i * 3] = .08 + k; bc[i * 3 + 1] = .05 + k * .78; bc[i * 3 + 2] = .03 + k * .42; }
    B.g.attributes.color.needsUpdate = true; signGlow.material.opacity = lit * .55; signLight.intensity = lit * 18;
    for (const c of conf){ const k = on ? t - 1.3 - c.w * .2 : -1; c.m.visible = k > 0; if (k <= 0) continue; const y = c.y0 - ((k * c.v) % 9.5);
      c.m.position.set(c.x + Math.sin(k * 2 + c.s) * .25, y, c.z); c.m.rotation.set(k * 3 + c.s, k * 2.4, c.s); }
    const d = S.dist, near = on ? ease(seg(t, 1.8, OPEN)) : 0, Q = ease(p);
    cam.position.set(Math.sin(idle * .2) * .15, lerp(3.3, 3.0, near) + Q * 1.6, lerp(d, d * .78, near) - Q * d * .3);
    cam.lookAt(0, lerp(3.4, 2.3, near) + Q * .8, -1);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
