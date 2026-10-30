/* ამბავი · არია — ახალი აუდიოძრავი პრემიუმ დიზაინებისთვის.
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
  velvet: { bpm: 70, bar: 4, wet: .42, gain: 1.15, lead: "keys", pad: "strings", bass: "bass",
    chords: "Dmaj7 Bm7 Em7 A7 Dmaj7 F#m7 Gmaj7 A",
    mel: "F#5:1.5 E5:.5 D5:2 | C#5:1 D5:1 F#5:2 | B5:1.5 A5:.5 G5:1 F#5:1 | E5:4 | F#5:1 A5:1 D6:2 | C#6:1.5 B5:.5 A5:2 | B5:1 G5:1 E5:1 F#5:1 | E5:2 r:2" },
  borealis: { bpm: 96, bar: 3, wet: .55, gain: 1.2, lead: "bell", pad: "glass", arp: "harp", arpP: [0, 1, 2, 3, 2, 1], bass: "bass",
    chords: "Em Cmaj7 G D Em Cmaj7 Am7 B",
    mel: "B5:1 E6:1 D6:1 | B5:2 G5:1 | D6:1.5 B5:.5 A5:1 | F#5:3 | B5:1 E6:1 F#6:1 | G6:2 E6:1 | C6:1 B5:1 A5:1 | D#6:3" },
  stardust: { bpm: 64, bar: 4, wet: .6, gain: 1.25, lead: "strings", leadV: 1.5, pad: "choir", bass: "bass", boom: true,
    chords: "Am F C G Am F Dm E",
    mel: "E5:2 A5:2 | C6:3 A5:1 | G5:2 E5:2 | D5:4 | E5:2 A5:2 | C6:2 D6:2 | F6:2 E6:1 D6:1 | B5:2 G#5:2" },
  celebration: { bpm: 120, bar: 4, wet: .25, gain: 1.0, lead: "pluck", leadV: 1.2, pad: "glass", bass: "bass", beat: "pop",
    chords: "C G Am F C G F G",
    mel: "E5:.5 G5:.5 C6:1 B5:.5 A5:.5 G5:1 | G5:.5 B5:.5 D6:1 C6:.5 B5:.5 G5:1 | A5:.5 C6:.5 E6:1 D6:.5 C6:.5 A5:1 | F5:.5 A5:.5 C6:1 B5:1 A5:1 | E5:.5 G5:.5 C6:1 B5:.5 A5:.5 G5:1 | G5:.5 B5:.5 D6:1 C6:.5 B5:.5 G5:1 | A5:.5 C6:.5 F6:1 E6:.5 D6:.5 C6:1 | D6:1 B5:1 G5:2" },
  satin: { bpm: 76, bar: 4, wet: .45, gain: 1.25, lead: "flute", pad: "strings", arp: "keys", arpP: [0, 1, 2, 3, 4, 3, 2, 1], arpV: .45, bass: "bass",
    chords: "Fmaj7 Em7 Dm7 Cmaj7 Bbmaj7 Am7 Gm7 C",
    mel: "A5:2 C6:1 E6:1 | D6:3 B5:1 | C6:2 A5:1 F5:1 | G5:4 | F5:1 A5:1 D6:2 | C6:2 E6:2 | D6:1 C6:1 Bb5:1 A5:1 | G5:3 r:1" },
  cathedral: { bpm: 58, bar: 4, wet: .7, gain: 1.3, lead: "bell", leadV: 1.1, pad: "organ", bass: "bass",
    chords: "D Bm G A D F#m G A",
    mel: "F#5:2 A5:2 | D6:4 | B5:2 D6:1 B5:1 | A5:4 | F#5:2 A5:2 | C#6:2 A5:2 | B5:1 A5:1 G5:2 | E5:2 C#5:2" }
};

/* ---------- instruments: (c, out, wet, midi, time, seconds, velocity) ---------- */
let noiseB = null;
function noise(c){ if (!noiseB || noiseB.sampleRate !== c.sampleRate){ noiseB = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } const s = c.createBufferSource(); s.buffer = noiseB; return s; }
function vca(c, out, wet, w){ const g = c.createGain(); g.connect(out); if (wet && w){ const s = c.createGain(); s.gain.value = w; g.connect(s); s.connect(wet); } return g; }
function osc(c, type, f, t, end, dest, gain = 1, det = 0){ const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; o.detune.value = det; g.gain.value = gain; o.connect(g); g.connect(dest); o.start(t); o.stop(end); return o; }
function adsr(p, t, a, d, s, r, dur, peak){ p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + a); p.setTargetAtTime(peak * s, t + a, d); p.setValueAtTime(peak * s, t + Math.max(a, dur)); p.setTargetAtTime(0, t + Math.max(a, dur), r); }
const INS = {
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
  const ev = [], ch = S.chords.split(/\s+/).map(chord), B = S.bar;
  let beat = 0; S.mel.replace(/\|/g, " ").split(/\s+/).filter(Boolean).forEach(tok => { const [n, l] = tok.split(":"), len = +l; if (n !== "r") ev.push({ b: beat, i: S.lead, m: midi(n), d: len, v: S.leadV || 1 }); beat += len; });
  ch.forEach((c, k) => { const b0 = k * B;
    if (S.pad) c.notes.forEach(m => ev.push({ b: b0, i: S.pad, m, d: B, v: .8 }));
    if (S.bass){ ev.push({ b: b0, i: S.bass, m: c.bass, d: B === 3 ? 1 : 2, v: 1 }); if (B === 4) ev.push({ b: b0 + 2, i: S.bass, m: c.bass + (S.beat ? 12 : 7), d: 2, v: .8 }); }
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
  const S = SONGS[id] || SONGS.velvet;
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
  const S = SONGS[id] || SONGS.velvet, sr = 48000, c = new OfflineAudioContext(2, Math.ceil(sr * sec), sr), b = bus(c, S), E = events(S);
  b.out.gain.setValueAtTime(0, 0); b.out.gain.setValueAtTime(0, delay); b.out.gain.linearRampToValueAtTime(S.gain, delay + 2.2); b.out.gain.setValueAtTime(S.gain, Math.max(delay + 2.3, sec - 2)); b.out.gain.linearRampToValueAtTime(0, sec - .05);
  for (let L = delay + .05; L < sec; L += E.len * E.spb) for (const e of E.ev){ const at = L + e.b * E.spb; if (at >= sec) break; try { INS[e.i](c, b.dry, b.wet, e.m, at, e.d * E.spb, e.v); } catch (_) {} }
  return c.startRendering();
}
return { play, pause, unlock, render, get playing(){ return playing; }, songs: Object.keys(SONGS) };
})();
