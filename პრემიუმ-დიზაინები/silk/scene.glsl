/* აბრეშუმი · მოძრავი აბრეშუმის ნაკეცები ნაზ ფერებში, ოქროს მტვერი.
   გახსნა: სიბნელეში სინათლის სხივი დიაგონალურად გადაუვლის ეკრანს და აბრეშუმს აჩენს → ნაკეცები ცოცხლდება.
   ფურცვლისას ფერი ნელა გადადის. */
float HS(vec2 p, float T){ vec2 q = vec2(fbm(p * .8 + vec2(0., T)), fbm(p * .8 + vec2(5.2, 1.3) - T));
  return .5 + .3 * sin(p.x * 2.2 + p.y * 1.3 + 4. * q.x + T * 1.7) + .2 * sin(p.y * 2.9 - p.x * .8 + 3.5 * q.y - T * 1.2); }
vec3 render(vec2 fc){
  vec2 uv = (fc - .5 * uRes) / uRes.y; float t = uT, T = uTime * .18;
  vec2 p = uv * 2.4 + vec2(0., uSec * .4);
  float e = .004, h = HS(p, T), hx = HS(p + vec2(e, 0.), T), hy = HS(p + vec2(0., e), T);
  vec3 n = normalize(vec3((h - hx) / e * .12, (h - hy) / e * .12, 1.)), L = normalize(vec3(-.4, .6, .7)), Hh = normalize(L + vec3(0., 0., 1.));
  float dif = .35 + .65 * max(dot(n, L), 0.), nh = max(dot(n, Hh), 0.);
  vec3 base = mix(uB, uA, smoothstep(.2, .9, h)); base = mix(base, uC * .9, sat(uSec * .25) * .3);
  vec3 col = base * dif * .9 + uC * (pow(nh, 40.) * 1.2 + pow(nh, 6.) * .25);
  float rev = t < 0. ? 0. : ease(seg(t, 0., 2.6)), x = uv.x * .6 + uv.y - mix(-1.3, 1.4, rev);
  float lit = t < 0. ? (.06 + .08 * uHold) : mix(.06, .42, smoothstep(.25, -.25, x));
  col = col * lit + (t < 0. ? vec3(0.) : uC * exp(-x * x * 36.) * (1. - seg(t, 2.4, 3.4)) * .9);
  vec2 g = uv * 24.; g.y -= uTime * .25; g.x += sin(uTime * .3 + g.y * .2); float s = h2(floor(g));
  col += uC * step(.95, s) * smoothstep(.1, 0., length(fract(g) - .5)) * .6 * (t < 0. ? .3 : 1.);
  return col;
}
