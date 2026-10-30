/* ამბავი · „ქაღალდი“ — 3D ძრავი (WebGL2, ბიბლიოთეკის გარეშე).
   ყველაფერი „ფურცელია“: ბადისებრი ზედაპირი, რომელიც ნაკეცზე რბილად იღუნება (fold: ანჯამა + კუთხე + რადიუსი), შეიძლება მთლიანად მოიხაროს (curl),
   აქვს წინა/უკანა ტექსტურა, ოქროს/ვერცხლის ფოლგის ნიღაბი (ბზინავს შუქზე), ჩრდილს აგდებს და იღებს (shadow map), და ნაწილაკები (ბრწყინვალე მტვერი). */
window.Q = (function(){
"use strict";
/* ---------- მათემატიკა ---------- */
const M4 = {
  id: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  mul(a, b){ const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++){ let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; },
  persp(fov, asp, n, f){ const t = 1 / Math.tan(fov / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
  ortho(l, r, b, t, n, f){ const o = M4.id(); o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n); o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); return o; },
  look(e, c, u = [0, 1, 0]){ let z = norm(sub(e, c)), x = norm(cross(u, z)), y = cross(z, x); return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]); },
  /* T·Ry·Rx·Rz·S (გრადუსებში) */
  pose(p = [0, 0, 0], r = [0, 0, 0], s = 1){ const [a, b, c] = r.map(v => v * Math.PI / 180), ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
    const X = [1, 0, 0, 0, 0, ca, sa, 0, 0, -sa, ca, 0, 0, 0, 0, 1], Y = [cb, 0, -sb, 0, 0, 1, 0, 0, sb, 0, cb, 0, 0, 0, 0, 1], Z = [cc, sc, 0, 0, -sc, cc, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let m = M4.mul(new Float32Array(Y), M4.mul(new Float32Array(X), new Float32Array(Z))); if (s !== 1) for (let i = 0; i < 12; i++) m[i] *= s; m[12] = p[0]; m[13] = p[1]; m[14] = p[2]; return m; }
};
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/* ---------- შეიდერები ---------- */
const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aP; layout(location=1) in vec2 aUV;
uniform mat4 uM, uVP; uniform vec4 uFold, uFP; uniform vec2 uCurl, uSize;
out vec3 vW; out vec3 vN; out vec2 vUV; out vec2 vLoc;
void main(){
  vec2 u = aP / uSize; vec3 p = vec3(aP.x, uCurl.x * u.x * u.x + uCurl.y * u.y * u.y, aP.y);
  vec3 n = normalize(vec3(-2. * uCurl.x * u.x / uSize.x, 1., -2. * uCurl.y * u.y / uSize.y));
  if (uFP.w > .5){ vec2 h0 = uFold.xy, nd = uFold.zw, ad = vec2(-nd.y, nd.x); float d = dot(aP - h0, nd);
    if (d > 0.){ float b = uFP.x, r = max(uFP.y, 1e-4), arc = r * b, on, y, ph;
      if (d <= arc){ ph = d / r; on = r * sin(ph); y = r * (1. - cos(ph)); }
      else { ph = b; float e = d - arc; on = r * sin(b) + e * cos(b); y = r * (1. - cos(b)) + e * sin(b) + uFP.z * sin(3.14159 * clamp(e / max(uSize.y, .01), 0., 1.)) * sin(b); }
      vec2 q = h0 + ad * dot(aP - h0, ad) + nd * on; p = vec3(q.x, y + p.y * cos(ph), q.y);
      n = normalize(-vec3(nd.x, 0., nd.y) * sin(ph) + vec3(0., 1., 0.) * cos(ph)); } }
  vec4 w = uM * vec4(p, 1.); vW = w.xyz; vN = mat3(uM) * n; vUV = aUV; vLoc = aP; gl_Position = uVP * w;
}`;
const CLIP = `uniform vec4 uClip[4]; uniform int uNC;
bool clipped(vec2 l){ for (int i = 0; i < 4; i++){ if (i >= uNC) break; if (dot(l, uClip[i].xy) < uClip[i].z) return true; } return false; }`;
const FS = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec2 vUV; in vec2 vLoc;
uniform sampler2D uTF, uTB, uTM, uSh; uniform mat4 uLVP; uniform vec3 uLD, uLC, uSky, uGnd, uEye, uTint, uFoilC; uniform float uOp, uEmis, uShOn, uGloss;
${CLIP}
out vec4 o;
float shadow(vec3 w){ vec4 l = uLVP * vec4(w, 1.); vec3 c = l.xyz / l.w * .5 + .5; if (c.x < 0. || c.x > 1. || c.y < 0. || c.y > 1. || c.z > 1.) return 1.;
  vec2 t = 1. / vec2(textureSize(uSh, 0)); float s = 0.; for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++){ float d = texture(uSh, c.xy + vec2(i, j) * t * 1.25).r; s += c.z - .0022 > d ? 0. : 1.; } return s / 25.; }
void main(){
  if (clipped(vLoc)) discard;
  vec4 tx = gl_FrontFacing ? texture(uTF, vUV) : texture(uTB, vUV); if (tx.a < .5) discard;
  vec2 m = texture(uTM, vUV).rg; float foil = gl_FrontFacing ? m.r : m.g;
  vec3 N = normalize(vN) * (gl_FrontFacing ? 1. : -1.), L = normalize(-uLD), V = normalize(uEye - vW), H = normalize(L + V);
  float sh = uShOn > .5 ? shadow(vW + N * .002) : 1., dif = max(dot(N, L), 0.), nh = max(dot(N, H), 0.);
  vec3 base = pow(tx.rgb, vec3(2.2)) * uTint, amb = mix(uGnd, uSky, N.y * .5 + .5);
  vec3 metal = uFoilC * (.35 + .65 * pow(1. - max(dot(N, V), 0.), 2.)) ;
  vec3 col = mix(base * (amb + uLC * dif * sh) + uLC * pow(nh, 20.) * uGloss * sh,
                 metal * (amb * 1.4 + uLC * dif * sh * .6) + uLC * (pow(nh, 70.) * 2.2 + pow(nh, 9.) * .35) * sh * uFoilC, foil) + base * uEmis;
  col = col / (1. + col * .18); o = vec4(pow(col, vec3(1. / 2.2)), uOp);
}`;
const DFS = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec2 vUV; in vec2 vLoc; uniform sampler2D uTF; ${CLIP} out vec4 o;
void main(){ if (clipped(vLoc) || texture(uTF, vUV).a < .5) discard; o = vec4(1.); }`;
const PVS = `#version 300 es
precision highp float; layout(location=0) in vec4 aP; layout(location=1) in vec4 aC; uniform mat4 uVP; uniform float uPx; out vec4 vC;
void main(){ vec4 c = uVP * vec4(aP.xyz, 1.); gl_Position = c; gl_PointSize = aP.w * uPx / c.w; vC = aC; }`;
const PFS = `#version 300 es
precision highp float; in vec4 vC; out vec4 o; void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); float a = smoothstep(.5, .0, r); a = a * a + smoothstep(.12, 0., r) * .6;
  float st = max(smoothstep(.06, 0., abs(d.x)) * smoothstep(.5, 0., abs(d.y)), smoothstep(.06, 0., abs(d.y)) * smoothstep(.5, 0., abs(d.x))) * vC.a * .0; o = vec4(vC.rgb * (a + st), 1.) * vC.a; }`;

/* ---------- ძრავი ---------- */
let gl, cv, P = {}, SH = {}, blank, maskBlank, dpr = 1, W = 1, H = 1, pbuf, pcap = 0;
function prog(vs, fs){ const p = gl.createProgram(), mk = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++){ const a = gl.getActiveUniform(p, i), nm = a.name.replace("[0]", ""); u[nm] = gl.getUniformLocation(p, a.name); } return { p, u }; }
function texFrom(src, o = {}){ const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const ext = gl.getExtension("EXT_texture_filter_anisotropic"); if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  const wrap = o.repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE; gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap); return t; }
function solid(r, g, b, a){ const c = document.createElement("canvas"); c.width = c.height = 2; const x = c.getContext("2d"); x.fillStyle = `rgba(${r},${g},${b},${a})`; x.fillRect(0, 0, 2, 2); return texFrom(c); }

function init(canvas, opts = {}){
  cv = canvas; gl = cv.getContext("webgl2", { antialias: true, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: !!opts.keep });
  if (!gl) throw new Error("WebGL2 არ არის");
  P.main = prog(VS, FS); P.depth = prog(VS, DFS); P.pts = prog(PVS, PFS);
  blank = solid(255, 255, 255, 1); maskBlank = solid(0, 0, 0, 1);
  const S = opts.shadow || 2048; SH.size = S; SH.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, SH.tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, S, S, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
  [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.NEAREST)); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
  SH.fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, SH.fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, SH.tex, 0);
  SH.col = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, SH.col); gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, S, S); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, SH.col);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); pbuf = gl.createBuffer();
  resize(opts.scale || 1); return gl;
}
function resize(scale = 1){ dpr = Math.min(window.devicePixelRatio || 1, 2.5) * scale; W = Math.max(2, Math.round(cv.clientWidth * dpr)); H = Math.max(2, Math.round(cv.clientHeight * dpr)); cv.width = W; cv.height = H; }

/* ფურცელი: w×h, ცენტრით (0,0) ლოკალურ XZ სიბრტყეში (y — ზემოთ). */
function sheet(o){
  const nx = o.nx || 24, ny = o.ny || 24, w = o.w, h = o.h, pos = [], idx = [];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++){ pos.push(-w / 2 + w * i / nx, -h / 2 + h * j / ny, i / nx, j / ny); }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++){ const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao); const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW); gl.bindVertexArray(null);
  return Object.assign({ w, h, vao, n: idx.length, M: M4.id(), fold: null, beta: 0, r: .004, flex: 0, curl: [0, 0], clip: [], tint: [1, 1, 1], op: 1, emis: 0, gloss: .25, cast: true, shade: true, visible: true, order: 0,
    tf: o.front ? texFrom(o.front) : blank, tb: o.back ? texFrom(o.back) : (o.front ? null : blank), tm: o.mask ? texFrom(o.mask) : maskBlank }, o.props || {}, { tbSame: !o.back });
}
function setUni(pr, s){ const u = pr.u; gl.uniformMatrix4fv(u.uM, false, s.M); gl.uniform2f(u.uSize, s.w, s.h); gl.uniform2f(u.uCurl, s.curl[0], s.curl[1]);
  if (s.fold){ gl.uniform4f(u.uFold, s.fold[0], s.fold[1], s.fold[2], s.fold[3]); gl.uniform4f(u.uFP, s.beta, s.r, s.flex, 1); } else gl.uniform4f(u.uFP, 0, 0, 0, 0);
  const c = new Float32Array(16); s.clip.forEach((q, i) => c.set(q.concat(0), i * 4)); gl.uniform4fv(u.uClip, c); gl.uniform1i(u.uNC, s.clip.length); }

let sh = { center: [0, 0, 0], size: 2.6 };
function render(sc){
  const { cam, light, sheets, pts } = sc, asp = W / H;
  const V = M4.look(cam.pos, cam.at, cam.up || [0, 1, 0]), Pm = M4.persp(cam.fov * Math.PI / 180, asp, .05, 60), VP = M4.mul(Pm, V);
  const ld = norm(light.dir), c = light.center || [0, 0, 0], s = light.size || 2.6, le = [c[0] - ld[0] * 8, c[1] - ld[1] * 8, c[2] - ld[2] * 8];
  const LVP = M4.mul(M4.ortho(-s, s, -s, s, .5, 18), M4.look(le, c, Math.abs(ld[1]) > .95 ? [0, 0, -1] : [0, 1, 0]));
  const vis = sheets.filter(x => x.visible && x.op > .003);
  // ჩრდილი
  gl.bindFramebuffer(gl.FRAMEBUFFER, SH.fb); gl.viewport(0, 0, SH.size, SH.size); gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.clearColor(1, 1, 1, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.disable(gl.CULL_FACE); gl.disable(gl.BLEND);
  gl.useProgram(P.depth.p); gl.uniformMatrix4fv(P.depth.u.uVP, false, LVP); gl.activeTexture(gl.TEXTURE0); gl.uniform1i(P.depth.u.uTF, 0);
  for (const s2 of vis){ if (!s2.cast || s2.op < .5) continue; setUni(P.depth, s2); gl.bindTexture(gl.TEXTURE_2D, s2.tf); gl.bindVertexArray(s2.vao); gl.drawElements(gl.TRIANGLES, s2.n, gl.UNSIGNED_SHORT, 0); }
  // სცენა
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); const bg = sc.bg || [0, 0, 0]; gl.clearColor(bg[0], bg[1], bg[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const pr = P.main, u = pr.u; gl.useProgram(pr.p); gl.uniformMatrix4fv(u.uVP, false, VP); gl.uniformMatrix4fv(u.uLVP, false, LVP);
  gl.uniform3fv(u.uLD, ld); gl.uniform3fv(u.uLC, light.col); gl.uniform3fv(u.uSky, light.sky); gl.uniform3fv(u.uGnd, light.gnd); gl.uniform3fv(u.uEye, cam.pos);
  [["uTF", 0], ["uTB", 1], ["uTM", 2], ["uSh", 3]].forEach(([k, i]) => gl.uniform1i(u[k], i)); gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, SH.tex);
  const ord = vis.slice().sort((a, b) => (a.op < 1) - (b.op < 1) || a.order - b.order);
  for (const s2 of ord){ setUni(pr, s2); gl.uniform3fv(u.uTint, s2.tint); gl.uniform3fv(u.uFoilC, s2.foil || sc.foil || [1, .8, .45]); gl.uniform1f(u.uOp, s2.op); gl.uniform1f(u.uEmis, s2.emis); gl.uniform1f(u.uShOn, s2.shade ? 1 : 0); gl.uniform1f(u.uGloss, s2.gloss);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, s2.tf); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, s2.tb || s2.tf); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, s2.tm);
    gl.depthMask(s2.op >= 1); gl.bindVertexArray(s2.vao); gl.drawElements(gl.TRIANGLES, s2.n, gl.UNSIGNED_SHORT, 0); }
  gl.depthMask(true);
  // ნაწილაკები
  if (pts && pts.n){ const n = pts.n; if (n > pcap){ pcap = n * 2; gl.bindBuffer(gl.ARRAY_BUFFER, pbuf); gl.bufferData(gl.ARRAY_BUFFER, pcap * 32, gl.DYNAMIC_DRAW); }
    gl.useProgram(P.pts.p); gl.uniformMatrix4fv(P.pts.u.uVP, false, VP); gl.uniform1f(P.pts.u.uPx, H * .5 / Math.tan(cam.fov * Math.PI / 360));
    gl.bindVertexArray(null); gl.bindBuffer(gl.ARRAY_BUFFER, pbuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, pts.data.subarray(0, n * 8));
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16);
    gl.blendFunc(gl.ONE, gl.ONE); gl.depthMask(false); gl.drawArrays(gl.POINTS, 0, n); gl.depthMask(true); gl.disableVertexAttribArray(1); }
  return VP;
}
/* 3D წერტილი → ეკრანი (CSS px) */
function project(VP, p){ const x = VP[0] * p[0] + VP[4] * p[1] + VP[8] * p[2] + VP[12], y = VP[1] * p[0] + VP[5] * p[1] + VP[9] * p[2] + VP[13], w = VP[3] * p[0] + VP[7] * p[1] + VP[11] * p[2] + VP[15];
  return [(x / w * .5 + .5) * cv.clientWidth, (1 - (y / w * .5 + .5)) * cv.clientHeight]; }

/* ---------- ნაწილაკები (3D) ---------- */
function particles(max = 600){ const data = new Float32Array(max * 8), L = []; let rnd = 1;
  const R = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  return { data, n: 0, list: L, R,
    add(p){ if (L.length < max) L.push(Object.assign({ age: 0, life: 3, v: [0, 0, 0], g: 0, s: .02, c: [1, .85, .55], a: 1, tw: R() * 6.28, drag: .4 }, p)); },
    step(dt, tm){ let k = 0; for (let i = L.length - 1; i >= 0; i--){ const p = L[i]; p.age += dt; if (p.age > p.life){ L.splice(i, 1); continue; }
        p.v[1] -= p.g * dt; const dr = Math.exp(-p.drag * dt); p.v[0] *= dr; p.v[1] *= dr; p.v[2] *= dr; p.p[0] += p.v[0] * dt; p.p[1] += p.v[1] * dt; p.p[2] += p.v[2] * dt; }
      for (const p of L){ const f = Math.min(1, p.age * 3) * Math.pow(1 - p.age / p.life, 1.5) * p.a * (.55 + .45 * Math.sin(tm * 3 + p.tw)), o = k * 8;
        data[o] = p.p[0]; data[o + 1] = p.p[1]; data[o + 2] = p.p[2]; data[o + 3] = p.s; data[o + 4] = p.c[0]; data[o + 5] = p.c[1]; data[o + 6] = p.c[2]; data[o + 7] = f; k++; }
      this.n = k; },
    burst(at, n, o = {}){ for (let i = 0; i < n; i++){ const th = R() * 6.283, ph = Math.acos(2 * R() - 1), sp = (o.speed || .8) * (.3 + R() * .9), up = o.up || 0;
      this.add({ p: [at[0] + (R() - .5) * (o.w || 0), at[1] + (R() - .5) * (o.h || 0), at[2] + (R() - .5) * (o.d || 0)], v: [Math.sin(ph) * Math.cos(th) * sp, Math.abs(Math.cos(ph)) * sp * (o.flat ? .3 : 1) + up, Math.sin(ph) * Math.sin(th) * sp],
        life: (o.life || 1.6) * (.6 + R() * .7), g: o.g == null ? .6 : o.g, s: (o.s || .03) * (.5 + R()), c: o.c || [1, .85, .55], drag: o.drag == null ? 1.2 : o.drag }); } } };
}
return { M4, init, resize, sheet, texFrom, render, project, particles, get gl(){ return gl; }, get dpr(){ return dpr; } };
})();
