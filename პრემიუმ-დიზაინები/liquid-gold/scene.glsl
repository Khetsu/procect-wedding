/* თხევადი ოქრო · ბნელ, თბილ სივრცეში — ოქროს სითხის წვეთი, რომელიც სუნთქავს.
   გახსნა: წვეთი ორად იყოფა → ორი წვეთი ერთმანეთს უბრუნდება და ერწყმის (ნათება) → სითხე ბეჭდად იქცევა, სახელები ბეჭდის შუაშია.
   ფურცვლისას ბეჭედი უკან და ზემოთ იწევს. */
float smin(float a, float b, float k){ float h = sat(.5 + .5 * (b - a) / k); return mix(b, a, h) - k * h * (1. - h); }
float mapG(vec3 p){
  float t = uT, idle = uTime;
  float split = t < 0. ? 0. : sin(seg(t, 0., 2.2) * 3.14159);
  float ring = t < 0. ? 0. : ease(seg(t, 1.9, 3.7));
  float s = min(uSec, 1.6); p.y -= .2 * s; p.z += .7 * s;
  float d = 1e3;
  for (int i = 0; i < 4; i++){ float fi = float(i), a = idle * (.7 + fi * .17) + fi * 1.7;
    vec3 c = vec3(cos(a) * .12, sin(a * 1.3) * .1, sin(a) * .08); c.x += (i < 2 ? -1. : 1.) * split * .42;
    d = smin(d, length(p - c) - (.2 - fi * .015) * (1. + uHold * .12), .16); }
  vec3 q = p; q.xz = rot(sin(idle * .4) * .55) * q.xz; q.yz = rot(.22) * q.yz;
  float dr = length(vec2(length(q.xy) - .4, q.z)) - .072;
  float dd = mix(d, dr, ring);
  dd += .012 * sin(p.x * 18. + idle * 3.) * sin(p.y * 16. - idle * 2.) * (1. - ring * .75);
  return dd;
}
vec3 nrmG(vec3 p){ vec2 e = vec2(.0015, 0.); return normalize(vec3(mapG(p + e.xyy) - mapG(p - e.xyy), mapG(p + e.yxy) - mapG(p - e.yxy), mapG(p + e.yyx) - mapG(p - e.yyx))); }
vec3 envG(vec3 r){
  vec3 c = mix(vec3(.02, .014, .008), vec3(.32, .2, .09), smoothstep(-.4, .9, r.y));
  c += uC * 3.2 * exp(-pow((r.x - .55) * 5., 2.)) * smoothstep(-.2, .6, r.y);
  c += uC * 1.6 * exp(-pow((r.y - .78) * 6., 2.));
  c += uA * .9 * exp(-pow((r.x + .7) * 4., 2.));
  return c;
}
vec3 render(vec2 fc){
  vec2 uv = (fc - .5 * uRes) / uRes.y; float t = uT;
  vec3 col = mix(vec3(.012, .008, .006), vec3(.055, .032, .016), smoothstep(.6, -.5, uv.y));
  for (int i = 0; i < 14; i++){ float fi = float(i); vec2 c = vec2(h1(fi * 3.1) - .5, h1(fi * 7.7) - .5) * vec2(.75, 1.1); c.y += sin(uTime * .1 + fi) * .03;
    float r = .025 + .05 * h1(fi * 9.3), l = length(uv - c); col += uA * smoothstep(r, r * .86, l) * (.35 + .65 * smoothstep(r * .5, r, l)) * .07; }
  vec2 g = uv * 28.; g.y += uTime * .3; vec2 id = floor(g); float s = h2(id);
  col += uC * step(.93, s) * smoothstep(.09, 0., length(fract(g) - .5)) * .45 * (.5 + .5 * sin(uTime * 3. + s * 30.));
  vec3 ro = vec3(0., 0., 3.2), rd = normalize(vec3(uv, -1.75));
  float d = 0., gm = 9.; bool hit = false;
  for (int i = 0; i < 80; i++){ vec3 p = ro + rd * d; float m = mapG(p); gm = min(gm, m); if (m < .001){ hit = true; break; } d += m * .9; if (d > 7.) break; }
  if (hit){ vec3 p = ro + rd * d, n = nrmG(p), r = reflect(rd, n); float fr = pow(1. - max(dot(n, -rd), 0.), 5.);
    vec3 gold = vec3(1., .74, .33);
    col = envG(r) * gold * (.78 + .22 * fr) + uC * pow(max(dot(r, normalize(vec3(.5, .6, .6))), 0.), 60.) * 3. + uA * .06;
  } else col += uA * exp(-gm * 22.) * .22;
  if (t >= 0.) col += uC * exp(-pow((t - 2.15) * 3.2, 2.)) * .7 * exp(-dot(uv, uv) * 6.);
  col *= t < 0. ? (.55 + .45 * uHold) : 1.;
  return col;
}
