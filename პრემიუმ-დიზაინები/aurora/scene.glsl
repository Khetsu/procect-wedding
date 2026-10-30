/* ჩრდილოეთის ციალი · ვარსკვლავიანი ღამე, თოვლიანი მთები და გაყინული ტბა.
   გახსნა: ავრორა მარცხნიდან მარჯვნივ ინთება და ცას ავსებს → მთების თოვლი ფერად ანათებს → ვარდნილი ვარსკვლავი.
   ფურცვლისას ფერები ნელა იცვლება. */
float ridgeA(float x){ return -.2 + .1 * fbm(vec2(x * 2.2, 3.1)) + .025 * n2(vec2(x * 14., 1.)); }
vec3 skyA(vec2 uv, float t, out float ign){
  vec3 col = mix(vec3(.004, .008, .025), vec3(.02, .045, .09), smoothstep(.5, -.3, uv.y));
  for (int k = 0; k < 2; k++){ float sc = k == 0 ? 90. : 170.; vec2 g = uv * sc; vec2 id = floor(g), f = fract(g) - .5; float s = h2(id + float(k) * 13.);
    col += vec3(.9, .95, 1.) * step(.975, s) * smoothstep(.15, 0., length(f)) * (.5 + .5 * sin(uTime * 2. + s * 50.)) * (k == 0 ? 1. : .55); }
  ign = t < 0. ? 0. : seg(t, .1, 3.);
  float front = mix(-.55, .7, ease(ign));
  vec3 au = vec3(0.);
  for (int i = 0; i < 3; i++){ float fi = float(i), x = uv.x * (1.2 + fi * .3) + fi * 2.3 + uSec * .15;
    float base = .02 + fi * .06 + .15 * (fbm(vec2(x * .9 + uTime * .03, fi * 4.)) - .5), hgt = uv.y - base;
    float body = smoothstep(-.006, .02, hgt) * exp(-max(hgt, 0.) * (6. - fi));
    float rays = .4 + .6 * n2(vec2(x * 30. + uTime * .4, fi * 7.)), wave = .6 + .4 * sin(x * 3. + uTime * .5 + fi);
    vec3 c = mix(uA, uB, sat(hgt * 4.)); c = mix(c, uC, sat(hgt * 2.2 - .3));
    au += c * body * rays * wave * (1. - fi * .25); }
  col += au * smoothstep(front + .12, front - .12, uv.x * .9 - uv.y * .2) * ign * 1.7;
  float st = mod(uTime + 4., 9.); vec2 sp = vec2(.35 - st * .5, .46 - st * .18), dl = uv - sp; float along = dot(dl, vec2(-.94, -.34));
  col += vec3(1.) * exp(-abs(dl.x * .34 - dl.y * .94) * 900.) * smoothstep(.0, -.03, along) * smoothstep(-.2, -.0, along) * step(st, 1.2) * .9;
  return col;
}
vec3 render(vec2 fc){
  vec2 uv = (fc - .5 * uRes) / uRes.y; float t = uT, lake = -.3, ign;
  vec3 col;
  if (uv.y > lake){ col = skyA(uv, t, ign); float r = ridgeA(uv.x);
    if (uv.y < r){ float snow = smoothstep(r - .06, r - .004, uv.y) * smoothstep(.3, .7, fbm(uv * 18.));
      col = mix(vec3(.008, .012, .026), vec3(.045, .06, .09), smoothstep(lake, r, uv.y)) + snow * (vec3(.18, .22, .3) + uA * .5 * ign); } }
  else { vec2 m = vec2(uv.x + .004 * sin(uv.y * 160. + uTime * 2.), 2. * lake - uv.y); col = skyA(m, t, ign) * .42; if (m.y < ridgeA(m.x)) col = vec3(.008, .012, .024);
    col += vec3(.05, .07, .1) * exp(-(lake - uv.y) * 60.); }
  col *= t < 0. ? (.6 + .4 * uHold) : 1.;
  return col;
}
