/* ამბავი 2 · სცენების საერთო ხელსაწყოები */
export const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const out = t => 1 - Math.pow(1 - t, 3);
export const inq = t => t * t;
export const back = t => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const lerp = (a, b, k) => a + (b - a) * k;
export function rng(seed = 1){ let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* renderer + camera that keeps a subject of width `fitW` inside a portrait screen */
export function stage(THREE, canvas, { fov = 40, exposure = 1, fitW = 4, fitH = 6, shadows = false } = {}){
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = exposure;
  if (shadows){ R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; }
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, .05, 600);
  const st = { R, scene, cam, dist: 10, aspect: 1 };
  st.render = () => R.render(scene, cam);
  st.size = (w, h) => { if (st._w === w && st._h === h) return; st._w = w; st._h = h; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    const tf = Math.tan(THREE.MathUtils.degToRad(fov / 2)); st.aspect = cam.aspect; st.dist = Math.max(fitH / (2 * tf), fitW / (2 * tf * cam.aspect)); };
  return st;
}
export function canvasTex(THREE, w, h, draw, srgb = true){ const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
export function skyTex(THREE, stops){ return canvasTex(THREE, 16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); }
export function dot(THREE, soft = .28){ return canvasTex(THREE, 64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(soft, "rgba(255,255,255,.75)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }, false); }
export function glow(THREE, color, size, opacity = 1){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot(THREE, .18), color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(size); return s; }
/* a cloud of soft points; returns { pts, pos, n } */
export function points(THREE, n, size, color, opts = {}){
  const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size, color, map: dot(THREE), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, ...opts });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false;
  return { pts, pos, n, g };
}
export async function envMap(THREE, R, intensity = .04){ const { RoomEnvironment } = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"); return new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), intensity).texture; }
export function flash(k){ const f = document.getElementById("flash"); if (f) f.style.opacity = String(k); }

/* ---------- wedding collection: realism helpers ---------- */
/* bloom post-processing (soft glow on bright highlights); replaces S.render */
export async function post(THREE, S, { strength = .55, radius = .6, threshold = .85 } = {}){
  const B = "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/";
  const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all(["EffectComposer.js", "RenderPass.js", "UnrealBloomPass.js", "OutputPass.js"].map(f => import(B + f)));
  const comp = new EffectComposer(S.R); comp.addPass(new RenderPass(S.scene, S.cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), strength, radius, threshold); comp.addPass(bloom); comp.addPass(new OutputPass());
  const size0 = S.size; S.size = (w, h) => { const ch = S._w !== w || S._h !== h; size0(w, h); if (ch){ comp.setPixelRatio(S.R.getPixelRatio()); comp.setSize(w, h); } };
  S.render = () => comp.render(); S.bloom = bloom; return comp;
}
/* out-of-focus lights in the background (lens bokeh) */
export function bokehTex(THREE){ return canvasTex(THREE, 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,.5)"); gr.addColorStop(.72, "rgba(255,255,255,.58)"); gr.addColorStop(.87, "rgba(255,255,255,.9)"); gr.addColorStop(.95, "rgba(255,255,255,.3)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }, false); }
export function bokeh(THREE, scene, n, o = {}){
  const r = rng(o.seed || 3), tex = bokehTex(THREE), cols = o.colors || [0xffd9a0, 0xffe9c8, 0xfff4e0], list = [];
  const L = (a, k) => lerp(a[0], a[1], k);
  for (let i = 0; i < n; i++){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: cols[i % cols.length], transparent: true, opacity: L(o.op || [.08, .3], r()), depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    s.scale.setScalar(L(o.size || [.5, 2], r())); s.position.set(L(o.x || [-12, 12], r()), L(o.y || [-1, 9], r()), L(o.z || [-8, -26], r())); s.userData.o = s.material.opacity; s.userData.ph = r() * 6; scene.add(s); list.push(s); }
  return list;
}
/* a garden rose made of curled petals in a golden-angle spiral; ~1 unit tall */
export function rose(THREE, o = {}){
  const n = o.petals || 24, base = new THREE.Color(o.base || 0xf2cfc8), tip = new THREE.Color(o.color || 0xfffaf3), r = rng(o.seed || 1);
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(.42, .12, .55, .7, .3, 1); sh.bezierCurveTo(.15, 1.12, -.15, 1.12, -.3, 1); sh.bezierCurveTo(-.55, .7, -.42, .12, 0, 0);
  const g = new THREE.Group(), mat = o.mat || new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .55, sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: .45, side: THREE.DoubleSide });
  for (let i = 0; i < n; i++){ const k = i / (n - 1), geo = new THREE.ShapeGeometry(sh, 10), p = geo.attributes.position, cols = new Float32Array(p.count * 3), c = new THREE.Color();
    const cup = lerp(1.7, .7, k), curl = lerp(0, .55, k * k * k);
    for (let j = 0; j < p.count; j++){ const x = p.getX(j), y = p.getY(j); p.setZ(j, -cup * x * x + curl * y * y * y); c.copy(base).lerp(tip, Math.min(1, y * 1.15 + k * .35)); cols[j * 3] = c.r; cols[j * 3 + 1] = c.g; cols[j * 3 + 2] = c.b; }
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3)); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat), s = lerp(.28, 1, Math.pow(k, .7)); m.scale.set(s * lerp(.75, 1.1, k), s, s); m.position.z = lerp(.02, .1, k); m.rotation.x = lerp(.05, .92, Math.pow(k, 1.6)) + (r() - .5) * .08;
    m.castShadow = !!o.shadow; const pv = new THREE.Group(); pv.rotation.y = i * 2.39996 + r() * .25; pv.add(m); g.add(pv); }
  return g;
}
/* a canvas text texture with transparent background */
export function textTex(THREE, w, h, draw){ return canvasTex(THREE, w, h, (g) => { g.clearRect(0, 0, w, h); draw(g, w, h); }); }
