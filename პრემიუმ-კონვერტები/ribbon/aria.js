/* ამბავი · არია — აუდიოძრავი პრემიუმ კონვერტებისთვის (ხუთი ახალი მელოდია: valse, emerald, blossom, lullaby, noir).
   სიმღერა იწერება აკორდებით (ერთი ტაქტი = ერთი აკორდი) და მელოდიით ("E5:1 G5:.5 r:1"). თანხლება ავტომატურად იქმნება სტილით.
   Aria.play(id) · Aria.pause() · Aria.render(id, წამები, დაწყება) → AudioBuffer (ვიდეოებისთვის). */
window.Aria = (function(){
"use strict";
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = s => { const m = /^([A-G])([#b]?)(-?\d)$/.exec(s); if (!m) return null; return 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0); };
const QUAL = { "": [0, 4, 7], m: [0, 3, 7], "7": [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], sus2: [0, 2, 7], sus4: [0, 5, 7], add9: [0, 4, 7, 14], "6": [0, 4, 7, 9], m6: [0, 3, 7, 9], dim: [0, 3, 6] };
function chord(s){ const m = /^([A-G][#b]?)(.*)$/.exec(s), root = midi(m[1] + "2"); return { bass: root + 12 * (root < 36 ? 1 : 0), notes: (QUAL[m[2]] || QUAL[""]).map(i => root + 24 + i) }; }
const hz = m => 440 * Math.pow(2, (m - 69) / 12);

/* ---------- the songs ---------- */
const SONGS = {
  valse: { bpm: 138, bar: 3, wet: .45, gain: 1.2, lead: "keys", leadV: 1.25, pad: "strings", padV: .5, comp: "waltz", compI: "keys", compV: .28, bass: "bass",
    chords: "Bb Gm Cm7 F7 Bb Dm Eb F Bb Gm Eb F Cm7 Eb F7 Bb",
    mel: "D5:2 F5:1 | Bb5:2 A5:1 | G5:1.5 F5:.5 Eb5:1 | F5:3 | D5:2 F5:1 | Bb5:2 D6:1 | C6:1 Bb5:1 G5:1 | A5:3 | F5:2 Bb5:1 | D6:2 C6:1 | Bb5:1 A5:1 G5:1 | F5:3 | Eb5:2 G5:1 | Bb5:2 G5:1 | F5:1 D5:1 C5:1 | Bb4:3" },
  emerald: { bpm: 72, bar: 4, wet: .5, gain: 1.2, lead: "keys", leadV: 1.2, pad: "strings", padV: .55, arp: "harp", arpP: [0, 2, 1, 3, 2, 4, 3, 1], arpV: .3, bass: "bass",
    chords: "Ebmaj7 Cm7 Abmaj7 Bb Ebmaj7 Gm7 Abmaj7 Bb",
    mel: "G5:1.5 Bb5:.5 Eb6:2 | D6:1 C6:1 G5:2 | C6:1.5 Bb5:.5 Ab5:1 G5:1 | F5:4 | G5:1.5 Bb5:.5 Eb6:2 | F6:1 D6:1 Bb5:2 | C6:1 Eb6:1 D6:1 C6:1 | Bb5:3 r:1" },
  blossom: { bpm: 168, bar: 3, wet: .4, gain: 1.15, lead: "musicbox", leadV: 1.2, pad: "glass", padV: .6, arp: "pizz", arpP: [0, 1, 2, 1, 2, 1], arpV: .5, bass: "pizz", bassV: .9,
    chords: "G D Em C G Bm C D G Em Am D G C D G",
    mel: "B5:1 D6:1 G6:1 | F#6:2 D6:1 | E6:1 G6:1 B5:1 | C6:3 | B5:1 D6:1 G6:1 | F#6:1 D6:1 B5:1 | C6:1 E6:1 A5:1 | D6:3 | B5:1 G5:1 B5:1 | E6:2 B5:1 | A5:1 C6:1 E6:1 | F#6:2 D6:1 | G6:1 F#6:1 D6:1 | E6:1 C6:1 G5:1 | A5:1 B5:1 C6:1 | G5:3" },
  lullaby: { bpm: 84, bar: 3, wet: .6, gain: 1.3, lead: "bell", leadV: .85, pad: "glass", padV: .7, arp: "harp", arpP: [0, 1, 2, 3, 2, 1], arpV: .38, bass: "bass", bassV: .6,
    chords: "F Dm Bb C F Am Bb C F Dm Gm C Bb C F F",
    mel: "A5:2 C6:1 | F6:2 D6:1 | D6:1 C6:1 Bb5:1 | G5:3 | A5:2 C6:1 | E6:2 C6:1 | D6:1 Bb5:1 G5:1 | C6:3 | A5:2 F5:1 | D6:2 A5:1 | Bb5:1 D6:1 G6:1 | E6:2 C6:1 | D6:2 F6:1 | E6:1 G6:1 E6:1 | F6:3 | r:3" },
  noir: { bpm: 120, bar: 4, wet: .3, gain: 1.15, swing: true, lead: "keys", leadV: 1.15, comp: "swing", compI: "keys", compV: .26, bass: "upright", walk: true, drums: "jazz",
    chords: "Dm7 G7 Cmaj7 A7 Dm7 G7 Em7 A7 Fmaj7 Fm7 Em7 A7 Dm7 G7 C6 C6",
    mel: "F5:.5 A5:.5 C6:1 B5:.5 A5:.5 F5:1 | G5:.5 B5:.5 D6:1 F6:1 E6:1 | E6:2 D6:.5 C6:.5 B5:1 | C#6:2 A5:2 | F5:.5 A5:.5 C6:1 E6:1 D6:1 | B5:.5 D6:.5 F6:1 E6:2 | G5:.5 B5:.5 D6:1 E6:1 G5:1 | A5:3 r:1 | A5:.5 C6:.5 E6:1 G6:1 E6:1 | Ab5:.5 C6:.5 Eb6:1 F6:2 | G5:.5 B5:.5 D6:1 B5:1 G5:1 | C#6:1 E6:1 G6:1 A6:1 | F6:1 D6:1 A5:1 F5:1 | F6:1 D6:1 B5:1 G5:1 | E6:2 D6:1 C6:1 | C6:3 r:1" }
};

/* ---------- instruments: (c, out, wet, midi, time, seconds, velocity) ---------- */
let noiseB = null;
function noise(c){ if (!noiseB || noiseB.sampleRate !== c.sampleRate){ noiseB = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } const s = c.createBufferSource(); s.buffer = noiseB; return s; }
function vca(c, out, wet, w){ const g = c.createGain(); g.connect(out); if (wet && w){ const s = c.createGain(); s.gain.value = w; g.connect(s); s.connect(wet); } return g; }
function osc(c, type, f, t, end, dest, gain = 1, det = 0){ const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; o.detune.value = det; g.gain.value = gain; o.connect(g); g.connect(dest); o.start(t); o.stop(end); return o; }
function adsr(p, t, a, d, s, r, dur, peak){ p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + a); p.setTargetAtTime(peak * s, t + a, d); p.setValueAtTime(peak * s, t + Math.max(a, dur)); p.setTargetAtTime(0, t + Math.max(a, dur), r); }
const INS = {
  musicbox(c, o, w, m, t, d, v){ const g = vca(c, o, w, .55), f = hz(m), end = t + 2.4; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12 * v, t + .002); g.gain.setTargetAtTime(0, t + .004, .42); [[1, 1], [2.76, .16], [4.02, .07], [5.4, .05]].forEach(([k, a]) => osc(c, "sine", f * k, t, end, g, a)); },
  pizz(c, o, w, m, t, d, v){ const g = vca(c, o, w, .45), f = hz(m), end = t + .9; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.11 * v, t + .004); g.gain.setTargetAtTime(0, t + .006, .13);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(2600, t); lp.frequency.setTargetAtTime(520, t, .1); lp.connect(g); osc(c, "triangle", f, t, end, lp, 1); osc(c, "sawtooth", f, t, end, lp, .22, 5); },
  upright(c, o, w, m, t, d, v){ const g = vca(c, o, w, .1), f = hz(m), end = t + d + .5; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22 * v, t + .008); g.gain.setTargetAtTime(.08 * v, t + .01, .12); g.gain.setTargetAtTime(0, t + d * .9, .07);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(1500, t); lp.frequency.setTargetAtTime(400, t, .08); lp.connect(g); osc(c, "triangle", f, t, end, lp, 1); osc(c, "sine", f / 2, t, end, lp, .5); },
  brush(c, o, w, m, t, d, v){ const g = vca(c, o, w, .25), n = noise(c), bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 3200; bp.Q.value = .6; n.connect(bp); bp.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.07 * v, t + .035); g.gain.setTargetAtTime(0, t + .05, .1); n.start(t, Math.random() * .5); n.stop(t + .45); },
  ride(c, o, w, m, t, d, v){ const g = vca(c, o, w, .25), n = noise(c), hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000; n.connect(hp); hp.connect(g);
    g.gain.setValueAtTime(.045 * v, t); g.gain.setTargetAtTime(0, t + .002, .16); n.start(t, Math.random() * .5); n.stop(t + .6); [5300, 7420].forEach(fq => osc(c, "sine", fq, t, t + .5, g, .05)); },
  keys(c, o, w, m, t, d, v){ const g = vca(c, o, w, .5), f = hz(m), end = t + d + 2.5; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16 * v, t + .005); g.gain.setTargetAtTime(0, t + .01, .45 + Math.max(0, 70 - m) * .02);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(3800, t); lp.frequency.setTargetAtTime(900, t, .4); lp.connect(g);
    [[1, 1, "triangle"], [2, .35, "sine"], [3, .14, "sine"], [4.02, .06, "sine"]].forEach(([k, a, ty]) => osc(c, ty, f * k, t, end, lp, a, (Math.random() - .5) * 6)); },
  bell(c, o, w, m, t, d, v){ const g = vca(c, o, w, .7), f = hz(m), end = t + 4; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12 * v, t + .004); g.gain.setTargetAtTime(0, t + .01, 1.1);
    const car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(); car.frequency.value = f; mod.frequency.value = f * 3.5; mg.gain.setValueAtTime(f * 2.2, t); mg.gain.setTargetAtTime(f * .2, t, .5);
    mod.connect(mg); mg.connect(car.frequency); car.connect(g); car.start(t); mod.start(t); car.stop(end); mod.stop(end); osc(c, "sine", f * 2, t, end, g, .25); },
  strings(c, o, w, m, t, d, v){ const g = vca(c, o, w, .8), f = hz(m), end = t + d + 1.4; adsr(g.gain, t, .35, .3, .85, .5, d, .045 * v);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2300; lp.connect(g); const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 5.2; lg.gain.value = 6; lfo.connect(lg); lfo.start(t); lfo.stop(end);
    [-9, 0, 9].forEach(dt => { const x = osc(c, "sawtooth", f, t, end, lp, .5, dt); lg.connect(x.detune); }); },
  glass(c, o, w, m, t, d, v){ const g = vca(c, o, w, .9), f = hz(m), end = t + d + 2; adsr(g.gain, t, .8, .5, .8, .9, d, .03 * v); [1, 2.001, 3.003].forEach((k, i) => osc(c, "sine", f * k, t, end, g, [1, .35, .15][i])); },
  choir(c, o, w, m, t, d, v){ const g = vca(c, o, w, .9), f = hz(m), end = t + d + 1.6; adsr(g.gain, t, .6, .4, .9, .7, d, .05 * v);
    const bp1 = c.createBiquadFilter(), bp2 = c.createBiquadFilter(); bp1.type = bp2.type = "bandpass"; bp1.frequency.value = 650; bp2.frequency.value = 1100; bp1.Q.value = bp2.Q.value = 4; bp1.connect(g); bp2.connect(g);
    [-7, 7].forEach(dt => { const x = osc(c, "sawtooth", f, t, end, bp1, .7, dt); x.connect(bp2); }); },
  organ(c, o, w, m, t, d, v){ const g = vca(c, o, w, 1), f = hz(m), end = t + d + 1.5; adsr(g.gain, t, .25, .3, .9, .6, d, .035 * v); [[1, 1], [2, .5], [3, .25], [4, .12], [.5, .4]].forEach(([k, a]) => osc(c, "sine", f * k, t, end, g, a)); },
  pluck(c, o, w, m, t, d, v){ const g = vca(c, o, w, .35), f = hz(m), end = t + 1; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.14 * v, t + .003); g.gain.setTargetAtTime(0, t + .005, .16);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 3; lp.frequency.setValueAtTime(5000, t); lp.frequency.setTargetAtTime(800, t, .12); lp.connect(g); osc(c, "sawtooth", f, t, end, lp, .6); osc(c, "square", f * 2, t, end, lp, .2); },
  harp(c, o, w, m, t, d, v){ const g = vca(c, o, w, .6), f = hz(m), end = t + 2.5; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09 * v, t + .002); g.gain.setTargetAtTime(0, t + .005, .5); [[1, 1, "triangle"], [2, .3, "sine"], [3, .1, "sine"]].forEach(([k, a, ty]) => osc(c, ty, f * k, t, end, g, a)); },
  flute(c, o, w, m, t, d, v){ const g = vca(c, o, w, .6), f = hz(m), end = t + d + .6; adsr(g.gain, t, .07, .2, .85, .15, d, .07 * v); const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 5; lg.gain.value = 5; lfo.connect(lg); lfo.start(t + .2); lfo.stop(end);
    const a = osc(c, "sine", f, t, end, g, 1), b = osc(c, "triangle", f * 2, t, end, g, .12); lg.connect(a.detune); const n = noise(c), bp = c.createBiquadFilter(), ng = c.createGain(); bp.type = "bandpass"; bp.frequency.value = f * 2; bp.Q.value = 2; ng.gain.value = .25; n.connect(bp); bp.connect(ng); ng.connect(g); n.start(t); n.stop(end); },
  bass(c, o, w, m, t, d, v){ const g = vca(c, o, null), f = hz(m), end = t + d + .4; adsr(g.gain, t, .01, .3, .7, .15, d, .16 * v); const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600; lp.connect(g); osc(c, "triangle", f, t, end, lp, 1); osc(c, "sine", f / 2, t, end, lp, .6); },
  kick(c, o, w, m, t, d, v){ const g = vca(c, o, null), x = c.createOscillator(); x.frequency.setValueAtTime(140, t); x.frequency.exponentialRampToValueAtTime(44, t + .14); g.gain.setValueAtTime(.5 * v, t); g.gain.exponentialRampToValueAtTime(.001, t + .35); x.connect(g); x.start(t); x.stop(t + .4); },
  snap(c, o, w, m, t, d, v){ const g = vca(c, o, w, .4), n = noise(c), bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = .8; n.connect(bp); bp.connect(g); g.gain.setValueAtTime(.22 * v, t); g.gain.exponentialRampToValueAtTime(.001, t + .18); n.start(t, Math.random() * .5); n.stop(t + .2); },
  hat(c, o, w, m, t, d, v){ const g = vca(c, o, null), n = noise(c), hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 8000; n.connect(hp); hp.connect(g); g.gain.setValueAtTime(.05 * v, t); g.gain.exponentialRampToValueAtTime(.001, t + .06); n.start(t, Math.random() * .5); n.stop(t + .08); },
  boom(c, o, w, m, t, d, v){ const g = vca(c, o, w, .8), x = c.createOscillator(); x.frequency.setValueAtTime(70, t); x.frequency.exponentialRampToValueAtTime(32, t + 1.5); g.gain.setValueAtTime(.4 * v, t); g.gain.exponentialRampToValueAtTime(.001, t + 2.2); x.connect(g); x.start(t); x.stop(t + 2.3); }
};

/* ---------- song → events (in beats) ---------- */
function events(S){
  const ev = [], ch = S.chords.split(/s+/).map(chord), B = S.bar, sw = b => S.swing && Math.abs(b % 1 - .5) < .01 ? b + .17 : b;
  let beat = 0; S.mel.replace(/|/g, " ").split(/s+/).filter(Boolean).forEach(tok => { const [n, l] = tok.split(":"), len = +l; if (n !== "r") ev.push({ b: sw(beat), i: S.lead, m: midi(n), d: len, v: S.leadV || 1 }); beat += len; });
  ch.forEach((c, k) => { const b0 = k * B, nx = ch[(k + 1) % ch.length];
    if (S.pad) c.notes.forEach(m => ev.push({ b: b0, i: S.pad, m, d: B, v: S.padV || .8 }));
    if (S.walk){ const tones = [c.bass, c.bass + (c.notes[1] - c.notes[0]), c.bass + 7, nx.bass + (nx.bass > c.bass ? -1 : 1)]; tones.forEach((m, q) => ev.push({ b: b0 + q, i: S.bass, m, d: .95, v: q ? .8 : 1 })); }
    else if (S.bass){ ev.push({ b: b0, i: S.bass, m: c.bass, d: B === 3 ? 1 : 2, v: S.bassV || 1 }); if (B === 4) ev.push({ b: b0 + 2, i: S.bass, m: c.bass + (S.beat ? 12 : 7), d: 2, v: (S.bassV || 1) * .8 }); }
    if (S.comp === "waltz") [1, 2].forEach(q => c.notes.forEach(m => ev.push({ b: b0 + q, i: S.compI, m: m - 12, d: .8, v: S.compV || .3 })));
    if (S.comp === "swing") [[0, .9], [1.67, .6], [3, .5]].forEach(([q, d]) => c.notes.slice(1).forEach(m => ev.push({ b: b0 + q, i: S.compI, m: m - 12, d, v: S.compV || .3 })));
    if (S.drums === "jazz") { [0, 1, 1.67, 2, 3, 3.67].forEach(q => ev.push({ b: b0 + q, i: "ride", d: .3, v: q % 1 ? .6 : 1 })); [1, 3].forEach(q => ev.push({ b: b0 + q, i: "brush", d: .3, v: 1 })); }
    if (S.arp){ const pool = [...c.notes, ...c.notes.map(n => n + 12)], P = S.arpP; for (let s = 0; s < B * 2; s++) ev.push({ b: b0 + s * .5, i: S.arp, m: pool[P[s % P.length]], d: .5, v: S.arpV || .55 }); }
    if (S.beat === "pop") for (let s = 0; s < B * 2; s++){ const q = s / 2; if (s % 4 === 0) ev.push({ b: b0 + q, i: "kick", d: .5, v: 1 }); if (s % 4 === 2) ev.push({ b: b0 + q, i: "snap", d: .5, v: 1 }); ev.push({ b: b0 + q, i: "hat", d: .25, v: s % 2 ? .6 : 1 }); }
    if (S.boom && k % 4 === 0) ev.push({ b: b0, i: "boom", d: 2, v: 1 }); });
  return { ev: ev.sort((a, b) => a.b - b.b), len: ch.length * B, spb: 60 / S.bpm };
}
function bus(c, S){
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = .006; comp.release.value = .25;
  const out = c.createGain(), dry = c.createGain(), wet = c.createGain(), conv = c.createConvolver(); out.gain.value = 0;
  const L = c.sampleRate * 3.2 | 0, ir = c.createBuffer(2, L, c.sampleRate); for (let ch = 0; ch < 2; ch++){ const d = ir.getChannelData(ch); for (let i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / L, 2.6); }
  conv.buffer = ir; wet.gain.value = S.wet; wet.connect(conv); conv.connect(comp); dry.connect(comp); comp.connect(out); out.connect(c.destination);
  return { out, dry, wet };
}

/* ---------- live playback ---------- */
let ctx = null, B = null, cur = null, timer = null, start = 0, idx = 0, playing = false, id0 = null;
function play(id){
  const S = SONGS[id] || SONGS.valse;
  if (!ctx){ const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; ctx = new AC(); }
  if (id0 !== id){ if (timer) clearInterval(timer); if (B) B.out.disconnect(); B = bus(ctx, S); cur = events(S); id0 = id; start = ctx.currentTime + .1; idx = 0;
    const T = ctx.currentTime; B.out.gain.setValueAtTime(0, T); B.out.gain.linearRampToValueAtTime(S.gain, T + 2.5);
    timer = setInterval(() => { const ahead = ctx.currentTime + .35; for (;;){ const e = cur.ev[idx], at = start + e.b * cur.spb; if (at > ahead) break; if (at >= ctx.currentTime - .03) try { INS[e.i](ctx, B.dry, B.wet, e.m, at, e.d * cur.spb, e.v); } catch (_) {}
      if (++idx >= cur.ev.length){ idx = 0; start += cur.len * cur.spb; } } }, 40); }
  ctx.resume(); playing = true; return true;
}
function pause(){ if (ctx) ctx.suspend(); playing = false; }
function unlock(){ const AC = window.AudioContext || window.webkitAudioContext; if (!ctx && AC) ctx = new AC(); if (ctx) ctx.resume(); }
document.addEventListener("visibilitychange", () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (playing) ctx.resume(); });

/* ---------- offline render for videos ---------- */
function render(id, sec, delay = 0){
  const S = SONGS[id] || SONGS.valse, sr = 48000, c = new OfflineAudioContext(2, Math.ceil(sr * sec), sr), b = bus(c, S), E = events(S);
  b.out.gain.setValueAtTime(0, 0); b.out.gain.setValueAtTime(0, delay); b.out.gain.linearRampToValueAtTime(S.gain, delay + 2.2); b.out.gain.setValueAtTime(S.gain, Math.max(delay + 2.3, sec - 2)); b.out.gain.linearRampToValueAtTime(0, sec - .05);
  for (let L = delay + .05; L < sec; L += E.len * E.spb) for (const e of E.ev){ const at = L + e.b * E.spb; if (at >= sec) break; try { INS[e.i](c, b.dry, b.wet, e.m, at, e.d * E.spb, e.v); } catch (_) {} }
  return c.startRendering();
}
return { play, pause, unlock, render, get playing(){ return playing; }, songs: Object.keys(SONGS) };
})();
