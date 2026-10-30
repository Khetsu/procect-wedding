/* ამბავი 2 · სცენების საერთო ხელსაწყოები */
export const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const out = t => 1 - Math.pow(1 - t, 3);
export const inq = t => t * t;
export const back = t => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const lerp = (a, b, k) => a + (b - a) * k;
export function rng(seed = 1){ let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* renderer + camera that keeps a subject of width `fitW` inside a portrait screen */
export function stage(THREE, canvas, { fov = 40, exposure = 1, fitW = 4, fitH = 6 } = {}){
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = exposure;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, .05, 600);
  const st = { R, scene, cam, dist: 10, aspect: 1 };
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
  return { pts: new THREE.Points(g, m), pos, n, g };
}
export async function envMap(THREE, R, intensity = .04){ const { RoomEnvironment } = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"); return new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), intensity).texture; }
export function flash(k){ const f = document.getElementById("flash"); if (f) f.style.opacity = String(k); }
