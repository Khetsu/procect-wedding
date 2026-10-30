/* ფეიერვერკი · ღამის ქალაქის სილუეტი მდინარის პირას, ფანჯრებში შუქი.
   გახსნა: რაკეტა ადის და ცაში დიდ გულად სკდება → ფერადი ფეიერვერკები ერთმანეთის მიყოლებით, მდინარეში არეკლილი.
   ფურცვლისას ზეიმი გრძელდება. */
vec2 heartF(float a){ return vec2(16. * pow(sin(a), 3.), 13. * cos(a) - 5. * cos(2. * a) - 2. * cos(3. * a) - cos(4. * a)) / 17.; }
vec3 burstF(vec2 uv, vec2 c, float age, vec3 col, float seed, bool hrt){
  if (age < 0. || age > 2.6) return vec3(0.);
  if (age < .55){ vec2 rp = vec2(c.x + .015 * sin(seed * 9. + age * 12.), mix(-.42, c.y, age / .55)); return col * .0007 / (dot(uv - rp, uv - rp) + .00008); }
  float a = age - .55, fade = exp(-a * 1.5) * (1. - seg(a, 1.6, 2.05)), R = .22 * (1. - exp(-a * 3.5)) * (hrt ? 1.3 : (.8 + .4 * h1(seed)));
  vec3 acc = vec3(0.);
  for (int i = 0; i < 36; i++){ float fi = float(i), an = fi / 36. * 6.2832;
    vec2 dir = hrt ? heartF(an) : vec2(cos(an + seed), sin(an + seed)) * (.75 + .25 * h1(fi + seed)), p = c + dir * R + vec2(0., -.05 * a * a);
    acc += col * .00012 / (dot(uv - p, uv - p) + .00002) * fade * (.7 + .3 * sin(a * 30. + fi)); }
  return acc + col * .002 / (dot(uv - c, uv - c) + .002) * exp(-a * 6.);
}
vec3 fwAll(vec2 q, float t){
  vec3 fw = vec3(0.); if (t < 0.) return fw;
  fw += burstF(q, vec2(0., .15), t, uA * 1.3, 1., true);
  for (int k = 0; k < 5; k++){ float fk = float(k), per = 2.9, off = 1.6 + fk * .55; if (t < off) continue; float cyc = floor((t - off) / per), age = t - off - cyc * per;
    vec2 c = vec2((h1(cyc * 7. + fk) - .5) * .42, .05 + .3 * h1(cyc * 3. + fk * 5.));
    vec3 cc = k == 0 ? uB : k == 1 ? uC : k == 2 ? uA : k == 3 ? vec3(.55, .8, 1.) : vec3(1., .55, .8);
    fw += burstF(q, c, age, cc, cyc + fk * 3., false); }
  return fw;
}
float skyline(float x){ float bx = floor(x * 22.); return -.29 + .12 * h1(bx * 1.3) * (.5 + .5 * h1(bx * 4.1)) + .05 * step(.85, h1(bx * 2.7)); }
vec3 render(vec2 fc){
  vec2 uv = (fc - .5 * uRes) / uRes.y; float t = uT, water = -.33;
  vec3 col = mix(vec3(.01, .008, .03), vec3(.09, .035, .13), smoothstep(.5, -.35, uv.y));
  vec2 sg = uv * 120.; float s = h2(floor(sg)); col += vec3(.9) * step(.985, s) * smoothstep(.15, 0., length(fract(sg) - .5)) * .7;
  bool refl = uv.y < water; vec2 q = uv; if (refl){ q.y = 2. * water - uv.y; q.x += .006 * sin(uv.y * 140. + uTime * 3.); }
  vec3 fw = fwAll(q, t); col += fw * (refl ? .35 : 1.);
  if (refl){ col = mix(col, vec3(.01, .01, .02), .4); if (q.y < skyline(q.x)) col = vec3(.008, .007, .018) + fw * .03; }
  else if (uv.y < skyline(uv.x)){ col = vec3(.012, .01, .025) + fw * .05;
    float lit = step(.62, h2(floor(vec2(uv.x * 132., (uv.y - water) * 90.)))); vec2 w = fract(vec2(uv.x * 132., (uv.y - water) * 90.));
    col += vec3(1., .78, .45) * lit * step(.25, w.x) * step(w.x, .75) * step(.3, w.y) * step(w.y, .75) * .5; }
  if (t < 0.){ col *= .7 + .3 * uHold; vec2 rp = vec2(0., water + .03 + .02 * uHold); col += uA * (.0004 + .0012 * uHold) / (dot(uv - rp, uv - rp) + .0001); }
  return col;
}
