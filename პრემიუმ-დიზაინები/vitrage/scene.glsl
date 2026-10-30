/* ვიტრაჟი · ქვის კედელში — ვარდისებრი ვიტრაჟის ფანჯარა, ბნელ ტაძარში.
   გახსნა: ფანჯარა შუიდან გარეთ, რგოლ-რგოლ ინთება ძვირფასი ქვების ფერებით → ფერადი სინათლის სხივები ეცემა ქვემოთ, ჰაერში მტვერი ციმციმებს.
   ფურცვლისას ფანჯარა ზემოთ იწევს. */
vec3 vorV(vec2 x){ vec2 n = floor(x), f = fract(x); float d1 = 8., d2 = 8.; vec2 id = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){ vec2 g = vec2(float(i), float(j)), o = vec2(h2(n + g), h2(n + g + 17.)), r = g + o - f; float d = dot(r, r);
    if (d < d1){ d2 = d1; d1 = d; id = n + g; } else if (d < d2) d2 = d; }
  return vec3(sqrt(d2) - sqrt(d1), h2(id), h2(id + 3.1)); }
vec3 jewel(float k){ return k < .25 ? vec3(.9, .12, .14) : k < .5 ? vec3(.1, .25, .9) : k < .75 ? vec3(1., .72, .15) : vec3(.12, .62, .35); }
vec3 winV(vec2 w, float t, out float lead){
  float r = length(w), a = atan(w.y, w.x); lead = 0.; if (r > 1.) return vec3(0.);
  float sc = 6.2832 / 12., ap = abs(mod(a, sc) - sc * .5); vec2 pp = vec2(cos(ap), sin(ap)) * r; vec3 v = vorV(pp * 5.5 + 3.);
  float fr = fract(r * 4.), ring = floor(r * 4.);
  lead = smoothstep(.015, .05, v.x) * smoothstep(0., .07, min(fr, 1. - fr)) * smoothstep(0., .025, (sc * .5 - ap) * r) * smoothstep(0., .03, 1. - r);
  vec3 gl = jewel(v.y) * (.7 + .5 * v.z); gl = mix(gl, uA * 1.2, smoothstep(.27, .2, r));
  float lit = t < 0. ? .05 * uHold : seg(t, ring * .55, ring * .55 + .65);
  float dim = t < 0. ? 1. : mix(1., .32, seg(t, 3.2, 4.8));
  return gl * lead * (.05 + lit * 2.3) * dim;
}
vec3 render(vec2 fc){
  vec2 uv = (fc - .5 * uRes) / uRes.y; float t = uT;
  vec2 c = vec2(0., .17 + min(uSec, 1.5) * .06 + (t < 0. ? 0. : ease(seg(t, 3.2, 4.8)) * .2)); float R = .27;
  vec2 b = uv * vec2(9., 18.); b.x += floor(b.y) * .5; vec2 bf = fract(b);
  vec3 col = vec3(.05, .04, .035) * (.6 + .6 * fbm(uv * 14.)) * (.6 + .4 * smoothstep(0., .06, min(bf.x, 1. - bf.x)) * smoothstep(0., .08, min(bf.y, 1. - bf.y)));
  vec2 w = (uv - c) / R; float r = length(w), lead;
  vec3 e = winV(w, t, lead);
  if (r < 1.) col = e + vec3(.008) * (1. - lead);
  else if (r < 1.09) col = vec3(.1, .085, .07) * (.7 + .5 * fbm(uv * 40.)) * (1. - smoothstep(1.06, 1.09, r) * .5);
  float ls = t < 0. ? .1 * uHold : seg(t, 1., 3.);
  vec3 sh = vec3(0.); vec2 dir = c - uv;
  for (int i = 0; i < 18; i++){ float k = float(i) / 18.; vec2 sp = uv + dir * k; float ld; sh += winV((sp - c) / R, t, ld); }
  col += sh / 18. * .26 * ls * (r > 1. ? 1. : .2) * (.4 + smoothstep(.1, -.5, uv.y - c.y));
  vec2 g = uv * 30.; g.y += uTime * .08; g.x += sin(uTime * .2 + g.y * .3); float s = h2(floor(g));
  col += uA * step(.96, s) * smoothstep(.1, 0., length(fract(g) - .5)) * .5 * ls * smoothstep(.0, -.4, uv.y - c.y + .1);
  return col;
}
