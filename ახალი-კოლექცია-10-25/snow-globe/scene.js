/* თოვლის გლობუსი · ზამთრის ღამე, თბილი ნათურები ბუნდოვნად, მაგიდაზე — მინის გლობუსი პატარა თოვლიანი სოფლით.
   შეხებისას: გლობუსი ირყევა → თოვლი შიგნით ტრიალებს → კამერა გლობუსს უახლოვდება → ირგვლივაც თოვს.
   ფურცვლისას: კამერა სოფლის თავზე ნელა ტრიალებს და ზემოთ იწევს. */
import { stage, skyTex, glow, points, canvasTex, envMap, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas }){
  const S = stage(THREE, canvas, { fov: 40, exposure: 1.05, fitW: 3.4, fitH: 4.2 }), { R, scene, cam } = S, r = rng(17);
  scene.background = skyTex(THREE, [[0, "#081428"], [.55, "#13284A"], [1, "#2A3E62"]]);
  scene.environment = await envMap(THREE, R, .04); scene.environmentIntensity = .8;
  scene.add(new THREE.HemisphereLight(0xbcd4ff, 0x2a2030, .7));
  const key = new THREE.DirectionalLight(0xdfe9ff, 1.1); key.position.set(-3, 6, 5); scene.add(key);
  const warm = new THREE.PointLight(0xffb45a, 4, 6, 1.6); warm.position.set(0, .2, .6); scene.add(warm);

  /* blurred fairy lights behind */
  for (let i = 0; i < 60; i++){ const s = glow(THREE, [0xffc56a, 0xffe2a0, 0xff9a5a, 0xbfe0ff][i % 4], .6 + r() * 1.4, .25 + r() * .45); s.position.set((r() - .5) * 22, -1 + r() * 12, -8 - r() * 12); scene.add(s); }
  /* table */
  const table = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, .2, 64), new THREE.MeshStandardMaterial({ color: 0x3a2618, roughness: .45, metalness: .1 })); table.position.y = -1.62; scene.add(table);

  /* the globe */
  const globe = new THREE.Group(); scene.add(globe);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.3, .55, 64), new THREE.MeshStandardMaterial({ color: 0x5a2e1c, roughness: .35, metalness: .2 })); base.position.y = -1.25; globe.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, .05, 12, 80), new THREE.MeshStandardMaterial({ color: 0xd9b060, metalness: 1, roughness: .2 })); ring.rotation.x = Math.PI / 2; ring.position.y = -.98; globe.add(ring);
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xdfeaff, roughness: 0, metalness: 0, clearcoat: 1, transparent: true, opacity: .2, envMapIntensity: 2.2, depthWrite: false });
  const glass = new THREE.Mesh(new THREE.SphereGeometry(1.3, 64, 48), glassMat); glass.position.y = .05; globe.add(glass);
  /* the village inside */
  const vil = new THREE.Group(); vil.position.y = -.85; globe.add(vil);
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xf4f8ff, roughness: .9 });
  const ground = new THREE.Mesh(new THREE.SphereGeometry(1.12, 48, 16, 0, Math.PI * 2, 0, 1.0), snowMat); ground.position.y = -1.1; vil.add(ground);
  const winTex = canvasTex(THREE, 64, 64, (g) => { g.fillStyle = "#6b3b26"; g.fillRect(0, 0, 64, 64); g.fillStyle = "#ffcf6a"; g.fillRect(10, 16, 16, 18); g.fillRect(38, 16, 16, 18); g.fillRect(24, 40, 16, 24); });
  const houseMat = new THREE.MeshStandardMaterial({ map: winTex, emissive: 0xffb050, emissiveMap: winTex, emissiveIntensity: .9, roughness: .8 }), roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9 });
  const house = (x, z, s, ry) => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.32, .26, .28), houseMat); b.position.y = .13; const roof = new THREE.Mesh(new THREE.ConeGeometry(.28, .2, 4), roofMat); roof.rotation.y = Math.PI / 4; roof.position.y = .36; g.add(b, roof); g.position.set(x, .02, z); g.scale.setScalar(s); g.rotation.y = ry; vil.add(g); };
  house(0, 0, 1.2, .2); house(-.5, -.3, .8, -.4); house(.52, -.25, .85, .6); house(-.3, .38, .6, 1.1);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x2f6a4a, roughness: .8 });
  for (let i = 0; i < 9; i++){ let a = r() * 6.28; if (Math.abs(Math.sin(a) - 1) < .35) a += 1.4; const d = .55 + r() * .32, t = new THREE.Group(); [0, .1, .2].forEach((y, k) => { const c = new THREE.Mesh(new THREE.ConeGeometry(.13 - k * .03, .18, 10), treeMat); c.position.y = .1 + y; t.add(c); const cap = new THREE.Mesh(new THREE.ConeGeometry(.07 - k * .015, .06, 10), snowMat); cap.position.y = .18 + y; t.add(cap); }); t.position.set(Math.cos(a) * d, 0, Math.sin(a) * d * .8); t.scale.setScalar(.8 + r() * .6); vil.add(t); }
  const lamp = glow(THREE, 0xffc070, .5, .9); lamp.position.set(0, .35, .25); vil.add(lamp);

  /* snow inside (globe space) and outside */
  const IN = points(THREE, 420, .045, 0xffffff, { blending: THREE.NormalBlending }); vil.add(IN.pts);
  const iv = Array.from({ length: IN.n }, () => { const a = r() * 6.28, rr = Math.sqrt(r()) * 1.05; return [Math.cos(a) * rr, Math.sin(a) * rr, r(), r() * 6, .2 + r() * .5]; });
  const OUT = points(THREE, 900, .05, 0xffffff, { blending: THREE.NormalBlending }); scene.add(OUT.pts);
  const ov = Array.from({ length: OUT.n }, () => [(r() - .5) * 9, r() * 9, (r() - .5) * 9, r() * 6, .25 + r() * .5]);

  const OPEN = 3.8;
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, shake = on ? Math.sin(seg(t, 0, .9) * Math.PI) : 0, swirl = on ? seg(t, .25, 3.4) : 0, dive = on ? ease(seg(t, 1.6, OPEN)) : 0, Q = ease(p);
    globe.rotation.z = Math.sin(t * 22) * .12 * shake; globe.position.x = Math.sin(t * 19) * .08 * shake;
    for (let i = 0; i < IN.n; i++){ const v = iv[i], storm = Math.sin(swirl * Math.PI) * (1 - dive * .4); const a = Math.atan2(v[1], v[0]) + idle * (.2 + storm * 3) * v[4];
      const rr = Math.hypot(v[0], v[1]) * (1 - storm * .3); const fall = (((v[2] - idle * .05 * v[4] - storm * 0) % 1) + 1) % 1;
      const y = lerp(.03 + v[2] * .05, .06 + v[2] * 1.9, Math.max(storm, dive * .9)), lim = Math.sqrt(Math.max(0, 1.55 - (y - .9) * (y - .9))) * .9;
      IN.pos[i * 3] = Math.cos(a) * rr * lim; IN.pos[i * 3 + 1] = y; IN.pos[i * 3 + 2] = Math.sin(a) * rr * lim; }
    IN.g.attributes.position.needsUpdate = true;
    for (let i = 0; i < OUT.n; i++){ const v = ov[i], y = ((v[1] - idle * v[4] * .8) % 9 + 9) % 9 - 3; OUT.pos[i * 3] = v[0] + Math.sin(idle + v[3]) * .2; OUT.pos[i * 3 + 1] = y; OUT.pos[i * 3 + 2] = v[2]; }
    OUT.g.attributes.position.needsUpdate = true; OUT.pts.material.opacity = .25 + dive * .2;
    
    warm.intensity = 3 + Math.sin(idle * 3) * .4;
    /* camera: in front of the globe → comes close, the globe rises to the top → circles it while scrolling */
    const d = S.dist, ang = Q * 1.6 + Math.sin(idle * .15) * .08, rad = lerp(d, d * .66, dive) + Q * .8;
    cam.position.set(Math.sin(ang) * rad, lerp(.35, .55, dive) + Q * .9, Math.cos(ang) * rad);
    cam.lookAt(0, lerp(-.05, -1.15, dive) + Q * .2, 0);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
