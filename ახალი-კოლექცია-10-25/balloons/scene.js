/* საჰაერო ბუშტები · განთიადი, ბორცვების ფენები და ზოლიანი საჰაერო ბუშტები.
   შეხებისას: სანთურა ინთება → დიდი ბუშტი სახელებიანი დროშით აფრინდება → სხვა ბუშტებიც ადის → კამერა მათთან ერთად.
   ფურცვლისას: კამერა ბუშტებს შორის ზემოთ მიდის, მზე ამოდის. */
import { stage, skyTex, glow, canvasTex, seg, ease, out, lerp, rng } from "./kit.js";

export default async function(THREE, { canvas, C }){
  await Promise.race([document.fonts.load('500 60px "Noto Serif Georgian"', "ა"), new Promise(r => setTimeout(r, 2500))]);
  const S = stage(THREE, canvas, { fov: 42, exposure: 1.0, fitW: 3.2, fitH: 4.4 }), { R, scene, cam } = S, r = rng(12);
  scene.background = skyTex(THREE, [[0, "#4E64A8"], [.38, "#B79CC6"], [.66, "#F3B39C"], [.86, "#FFD3A6"], [1, "#FFE9C6"]]);
  scene.fog = new THREE.Fog(0xf1c3b0, 18, 120);
  scene.add(new THREE.HemisphereLight(0xffe4d0, 0x5a4a6a, .95));
  const sunL = new THREE.DirectionalLight(0xffc49a, 1.6); sunL.position.set(8, 5, -20); scene.add(sunL);
  const sun = glow(THREE, 0xfff0c8, 26, .9), sunH = glow(THREE, 0xffb487, 70, .4); [sun, sunH].forEach(s => { s.material.fog = false; scene.add(s); });

  /* layered hills */
  [[-14, 0x9a7aa6, 3.2], [-28, 0x7d6596, 5], [-48, 0x6a5688, 7.5], [-75, 0x5a4a7c, 10]].forEach(([z, c, hh], k) => {
    const sh = new THREE.Shape(); sh.moveTo(-120, -2); for (let x = -120; x <= 120; x += 4) sh.lineTo(x, hh * (.5 + .5 * Math.sin(x * .05 + k * 2) * Math.cos(x * .021 + k)) + r() * .3); sh.lineTo(120, -2);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: c })); m.position.z = z; scene.add(m); });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 60), new THREE.MeshStandardMaterial({ color: 0xb79a74, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.z = -10; scene.add(ground);

  /* a balloon */
  const prof = [[.18, 0], [.32, .18], [.72, .7], [.98, 1.3], [1.0, 1.6], [.9, 1.92], [.66, 2.16], [.34, 2.3], [0, 2.34]].map(([x, y]) => new THREE.Vector2(x, y));
  const env = new THREE.LatheGeometry(prof, 48);
  const palettes = [["#E8505B", "#F9D56E", "#F3ECC2", "#14B1AB"], ["#F4A261", "#E76F51", "#FFE8D6", "#2A9D8F"], ["#8E7DBE", "#F1C6D9", "#FFFFFF", "#F2B880"], ["#3D5A80", "#EE6C4D", "#E0FBFC", "#98C1D9"], ["#B5838D", "#FFCDB2", "#E5989B", "#6D6875"]];
  const stripes = pal => canvasTex(THREE, 512, 64, (g, w, h) => { const n = 16; for (let i = 0; i < n; i++){ g.fillStyle = pal[i % pal.length]; g.fillRect(i * w / n, 0, w / n + 1, h); } g.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < n; i++) g.fillRect(i * w / n, 0, 2, h); });
  const wicker = new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: .9 }), rope = new THREE.LineBasicMaterial({ color: 0x3a2a20 });
  function balloon(pal, s){ const g = new THREE.Group(); const e = new THREE.Mesh(env, new THREE.MeshStandardMaterial({ map: stripes(pal), roughness: .7, side: THREE.DoubleSide })); e.position.y = .75; g.add(e);
    const b = new THREE.Mesh(new THREE.BoxGeometry(.42, .32, .42), wicker); b.position.y = .16; g.add(b);
    const pts = []; [[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]].forEach(([x, z]) => { pts.push(new THREE.Vector3(x, .32, z), new THREE.Vector3(x * .9, .76, z * .9)); }); g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), rope));
    const flame = new THREE.Mesh(new THREE.ConeGeometry(.09, .35, 12), new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: .0, blending: THREE.AdditiveBlending, depthWrite: false })); flame.position.y = .62; g.add(flame);
    g.scale.setScalar(s); scene.add(g); return { g, flame }; }
  const hero = balloon(palettes[0], 1);
  const burner = new THREE.PointLight(0xff9a40, 0, 5, 1.6); burner.position.y = .7; hero.g.add(burner);
  const fireG = glow(THREE, 0xffb050, .1, 0); fireG.position.y = .65; hero.g.add(fireG);
  /* the banner with names, hanging under the basket */
  const names = C.b ? C.a + " & " + C.b : C.a;
  const banTex = canvasTex(THREE, 768, 220, (g, w, h) => { g.fillStyle = "#fbf3e4"; g.fillRect(0, 0, w, h); g.strokeStyle = "#c98a4a"; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = "#6b3a2a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `500 ${names.length > 16 ? 70 : 86}px "Noto Serif Georgian"`; g.fillText(names, w / 2, h / 2 + 4); });
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .43, 16, 1), new THREE.MeshStandardMaterial({ map: banTex, side: THREE.DoubleSide, roughness: .8 })); banner.position.set(0, -.32, .0); hero.g.add(banner);
  const banLines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.2, 0, 0), new THREE.Vector3(-.7, -.1, 0), new THREE.Vector3(.2, 0, 0), new THREE.Vector3(.7, -.1, 0)]), rope); hero.g.add(banLines);
  const others = []; for (let i = 0; i < 12; i++){ const s = .5 + r() * .7, b = balloon(palettes[1 + i % 4], s); const side = i % 2 ? 1 : -1; b.g.position.set(side * (2 + r() * 8), r() < .35 ? 0 : 1 + r() * 7, -4 - r() * 30); others.push({ ...b, y0: b.g.position.y, v: .25 + r() * .5, ph: r() * 6 }); }

  const OPEN = 3.7, bp = banner.geometry.attributes.position, bb = Float32Array.from(bp.array);
  function update({ t, p, idle, w, h }){
    S.size(w, h);
    const on = t >= 0, fire = on ? Math.min(1, seg(t, 0, .3) + .35) * (.8 + .2 * Math.sin(idle * 40)) : (Math.sin(idle * 1.3) > .85 ? .5 : 0), lift = on ? ease(seg(t, .5, OPEN + .6)) : 0, Q = ease(p);
    hero.flame.material.opacity = fire * .9; hero.flame.scale.set(1, .6 + fire * 1.4, 1); burner.intensity = fire * 6; fireG.material.opacity = fire * .8; fireG.scale.setScalar(.2 + fire * .9);
    hero.g.position.set(0, .25 + lift * 3.1 + Q * 9 + Math.sin(idle * .9) * .05 * lift, 0); hero.g.rotation.y = Math.sin(idle * .3) * .2;
    banner.visible = banLines.visible = lift > .05; banner.scale.y = Math.min(1, lift * 6);
    for (let i = 0; i < bp.count; i++) bp.setZ(i, bb[i * 3 + 2] + Math.sin(idle * 3 + bb[i * 3] * 3) * .05); bp.needsUpdate = true;
    others.forEach(o => { const k = on ? Math.max(0, t - .3) : 0; o.g.position.y = o.y0 + k * o.v * .55 + Q * 6 * o.v + Math.sin(idle * .7 + o.ph) * .08; o.flame.material.opacity = Math.sin(idle * 2 + o.ph) > .8 ? .7 : 0; });
    sun.position.set(9, 2 + Q * 8, -110); sunH.position.copy(sun.position);
    const d = S.dist, follow = on ? ease(seg(t, 1.1, OPEN)) : 0;
    cam.position.set(Math.sin(idle * .15) * .2, lerp(1.45, 2.6, follow) + Q * 9.5, lerp(d, d + 1.6, follow));
    cam.lookAt(0, lerp(1.4, 3.0, follow) + Q * 9.6, 0);
    R.render(scene, cam);
  }
  return { open: OPEN, update };
}
