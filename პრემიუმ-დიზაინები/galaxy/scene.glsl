/* გალაქტიკა · ღრმა კოსმოსი, ნისლეული და ერთი მოციმციმე წერტილი.
   გახსნა: აფეთქება და დარტყმითი ტალღა → ხვეულის მკლავები იშლება → ორი ვარსკვლავი ერთმანეთის გარშემო ტრიალებს და ერწყმის → გალაქტიკის ბირთვი ინთება.
   ფურცვლისას გალაქტიკა ბრუნავს და ახლოვდება. */
vec3 render(vec2 fc){
  vec2 uv = (fc - .5 * uRes) / uRes.y; float t = uT;
  float form = t < 0. ? 0. : ease(seg(t, .4, 3.3));
  vec2 g = uv * (1.45 - min(uSec, 2.) * .12); g = rot(-.35 + uSec * .25) * g; g.y /= mix(.42, .62, sat(uSec * .4)); g = rot(uTime * .02) * g;
  float r = length(g), a = atan(g.y, g.x);
  vec3 col = vec3(.004, .003, .012);
  vec2 sg = uv * 110.; vec2 id = floor(sg); float s = h2(id);
  col += vec3(1., .95, .9) * step(.982, s) * smoothstep(.16, 0., length(fract(sg) - .5)) * (.4 + .6 * sin(uTime * 2. + s * 40.));
  col += uB * .09 * fbm(uv * 3. + uTime * .01) * smoothstep(.0, .5, fbm(uv * 1.5 - 3.));
  float tw = mix(0., 5.5, form), arm = cos(2. * (a + log(r + .02) * tw) - uTime * .15);
  float dens = pow(.5 + .5 * arm, 4.) * exp(-r * 3.2) * smoothstep(0., .06, r), dust = fbm(g * 9. + vec2(uTime * .02, 0.));
  col += (uA * dens * (.6 + 1.2 * dust) * 1.3 + uC * pow(dens, 2.) * 1.4) * form;
  col += uC * (exp(-r * r * 60.) * (.3 + .9 * form) + exp(-r * 9.) * .12 * form);
  vec2 s2 = g * 90.; float k2 = h2(floor(s2) + 5.); col += uC * step(.96, k2) * dens * 3. * smoothstep(.2, 0., length(fract(s2) - .5)) * form;
  if (t >= 0.){ float m = seg(t, 1., 3.), R = .3 * (1. - ease(m)), ang = t * 2.2 + 1.; vec2 p1 = vec2(cos(ang), sin(ang) * .42) * R, p2 = -p1; float alive = 1. - step(3.02, t);
    col += (uC * .0025 / (dot(uv - p1, uv - p1) + .0006) + uA * .0025 / (dot(uv - p2, uv - p2) + .0006)) * alive * .5;
    float rr = seg(t, .3, 1.8) * .9; col += uC * exp(-abs(length(uv) - rr) * 70.) * (1. - seg(t, .3, 1.8)) * 1.2;
    col += uC * exp(-pow((t - .35) * 6., 2.)) * 1.4 * exp(-dot(uv, uv) * 3.) + uC * exp(-pow((t - 3.05) * 5., 2.)) * 2. * exp(-dot(uv, uv) * 14.); }
  if (t > 0.) col *= mix(1., .62, seg(t, 3.4, 5.));
  else col += uC * .002 / (dot(uv, uv) + .0008) * (.4 + .6 * uHold);
  return col;
}
