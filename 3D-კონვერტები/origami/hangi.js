/* ამბავი · „ჰანგი“ — ხმის ძრავი 3D კონვერტებისთვის.
   ინსტრუმენტები: Karplus-Strong სიმები (გიტარა, ქნარი, კოტო), FM ელექტრო-პიანო, ჩელესტა, ჩელო, რბილი ფონი, ბასი, მსუბუქი რიტმი.
   Hangi.play(id) · Hangi.pause() · Hangi.unlock() · Hangi.render(id, წამები, დაწყება) → AudioBuffer (ვიდეოსთვის). */
window.Hangi = (function(){
"use strict";
const NN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, midi = s => { const m = /^([A-G])([#b]?)(-?\d)$/.exec(s); return m ? 12 * (+m[3] + 1) + NN[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) : null; };
const hz = m => 440 * Math.pow(2, (m - 69) / 12), CH = { "": [0, 4, 7], m: [0, 3, 7], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], "7": [0, 4, 7, 10], sus2: [0, 2, 7], sus4: [0, 5, 7], add9: [0, 4, 7, 14], "6": [0, 4, 7, 9] };
const chord = s => { const m = /^([A-G][#b]?)(.*)$/.exec(s), r = midi(m[1] + "3"); return { root: r, tones: (CH[m[2]] || CH[""]).map(i => r + i) }; };

/* ---------- სიმღერები: prog — აკორდები (თითო ტაქტი), mel — „ნოტი/დარტყმა“, layers — თანხლება ---------- */
const SONGS = {
  brise: { bpm: 132, beats: 3, rev: .5, vol: 1.1, prog: "D A Bm G D Em G A D A Bm F#m G D A D",
    mel: "F#5/2 A5/1 | E5/3 | F#5/1 D5/1 B4/1 | D5/3 | A5/2 F#5/1 | G5/1 E5/2 | D5/1 E5/1 G5/1 | F#5/2 E5/1 | F#5/2 A5/1 | C#6/2 A5/1 | B5/1 F#5/1 D5/1 | C#5/3 | B4/1 D5/1 G5/1 | F#5/1 A5/1 D6/1 | E5/1 G5/1 C#6/1 | D6/3",
    lead: "celesta", layers: [{ i: "guitar", arp: [0, 1, 2, 3, 2, 1], step: .5, v: .5 }, { i: "pad", hold: 1, v: .35 }, { i: "bass", root: [0], v: .7 }] },
  washi: { bpm: 76, beats: 4, rev: .6, vol: 1.2, prog: "Am Fmaj7 C G Am Fmaj7 C Em",
    mel: "E5/1 G5/1 A5/2 | C6/1 A5/1 G5/2 | E5/1 D5/1 C5/1 D5/1 | E5/4 | A5/1 C6/1 D6/2 | E6/1 D6/1 C6/1 A5/1 | G5/1 A5/1 C6/1 D6/1 | E6/3 -/1",
    lead: "koto", layers: [{ i: "koto", arp: [0, 2, 1, 3, 2, 1, 0, 2], step: .5, v: .28, oct: -12 }, { i: "pad", hold: 1, v: .4 }, { i: "bell", root: [0, 2], v: .25, oct: 24 }, { i: "bass", root: [0, 2], v: .6 }] },
  terra: { bpm: 92, beats: 4, rev: .42, vol: 1.1, prog: "F C Dm Bb F C Bb C",
    mel: "A5/1 C6/1 F6/2 | E6/1 D6/1 C6/2 | D6/1 F6/1 A5/1 C6/1 | Bb5/3 -/1 | A5/1 C6/1 F6/2 | G6/1 E6/1 C6/2 | D6/1 C6/1 Bb5/1 A5/1 | G5/3 -/1",
    lead: "epiano", layers: [{ i: "epiano", comp: [0, 1.5, 2.5], v: .3, oct: 12 }, { i: "cello", hold: 1, v: .45, only: [0, 1] }, { i: "bass", root: [0, 2], v: .75 }, { i: "shaker", beat: [.5, 1.5, 2.5, 3.5], v: .5 }] },
  lumiere: { bpm: 100, beats: 4, rev: .3, vol: 1.05, prog: "Gm7 Ebmaj7 Bb F Gm7 Ebmaj7 Cm7 F",
    mel: "D5/.5 F5/.5 G5/1 Bb5/1 A5/1 | G5/2 -/1 F5/1 | D5/.5 F5/.5 G5/1 Bb5/1 C6/1 | D6/3 -/1 | D6/.5 C6/.5 Bb5/1 G5/1 F5/1 | G5/2 Bb5/1 C6/1 | Eb6/1 D6/1 C6/1 Bb5/1 | A5/3 -/1",
    lead: "guitar", leadOct: 0, layers: [{ i: "epiano", comp: [0, 1.5, 3], v: .3, oct: 12 }, { i: "pad", hold: 1, v: .25 }, { i: "bass", root: [0, 1.5, 2, 3.5], v: .75 }, { i: "kick", beat: [0, 2], v: 1 }, { i: "clap", beat: [1, 3], v: .8 }, { i: "shaker", beat: [.5, 1.5, 2.5, 3.5], v: .6 }] },
  berceau: { bpm: 88, beats: 3, rev: .62, vol: 1.25, prog: "Eb Cm Ab Bb Eb Gm Ab Bb Eb Cm Fm Bb Ab Bb Eb Eb",
    mel: "G5/2 Bb5/1 | Eb6/2 C6/1 | C6/1 Bb5/1 Ab5/1 | F5/3 | G5/2 Bb5/1 | D6/2 Bb5/1 | C6/1 Ab5/1 F5/1 | Bb5/3 | G5/2 Eb5/1 | C6/2 G5/1 | Ab5/1 C6/1 F6/1 | D6/2 Bb5/1 | C6/2 Eb6/1 | D6/1 F6/1 D6/1 | Eb6/3 | -/3",
    lead: "celesta", layers: [{ i: "harp", arp: [0, 1, 2, 3, 2, 1], step: .5, v: .38, oct: 12 }, { i: "pad", hold: 1, v: .42 }, { i: "bass", root: [0], v: .5 }] }
};

/* ---------- Karplus-Strong ბუფერები (ქეში) ---------- */
const KS = new Map();
function ks(c, m, kind){ const key = c.sampleRate + ":" + m + ":" + kind; if (KS.has(key)) return KS.get(key);
  const sr = c.sampleRate, f = hz(m), N = Math.max(2, Math.round(sr / f)), dur = kind === "harp" ? 3.2 : kind === "koto" ? 2.6 : 2.2, L = Math.floor(sr * dur), b = c.createBuffer(1, L, sr), d = b.getChannelData(0);
  const decay = kind === "harp" ? .9975 : kind === "koto" ? .9955 : .9965, bright = kind === "koto" ? .75 : kind === "harp" ? .55 : .5; let lp = 0;
  for (let i = 0; i < N; i++){ const r = Math.random() * 2 - 1; lp = lp + (r - lp) * bright; d[i] = lp; }
  for (let i = N; i < L; i++) d[i] = (d[i - N] + (d[i - N - 1] || 0)) * .5 * decay;
  let mx = 0; for (let i = 0; i < L; i++) mx = Math.max(mx, Math.abs(d[i])); for (let i = 0; i < L; i++) d[i] /= mx || 1;
  KS.set(key, b); return b; }

/* ---------- ინსტრუმენტები: (c, dry, wet, midi, t, წამი, ძალა) ---------- */
let NB = null; const noise = c => { if (!NB || NB.sampleRate !== c.sampleRate){ NB = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } const s = c.createBufferSource(); s.buffer = NB; return s; };
function out(c, dry, wet, send){ const g = c.createGain(); g.connect(dry); if (send){ const s = c.createGain(); s.gain.value = send; g.connect(s); s.connect(wet); } return g; }
function o(c, type, f, t, end, dest, gain = 1, det = 0){ const x = c.createOscillator(), g = c.createGain(); x.type = type; x.frequency.value = f; x.detune.value = det; g.gain.value = gain; x.connect(g); g.connect(dest); x.start(t); x.stop(end); return x; }
const pluck = kind => (c, dry, wet, m, t, d, v) => { const s = c.createBufferSource(), g = out(c, dry, wet, kind === "harp" ? .7 : .45), lp = c.createBiquadFilter(); s.buffer = ks(c, m, kind); lp.type = "lowpass"; lp.frequency.value = kind === "koto" ? 5200 : 3600;
  s.connect(lp); lp.connect(g); g.gain.setValueAtTime(.32 * v, t); g.gain.setTargetAtTime(0, t + Math.max(d, .25) + (kind === "harp" ? 1.4 : .6), .35); s.start(t); s.stop(t + s.buffer.duration); };
const INS = {
  guitar: pluck("guitar"), harp: pluck("harp"), koto: pluck("koto"),
  epiano(c, dry, wet, m, t, d, v){ const f = hz(m), g = out(c, dry, wet, .35), end = t + d + 1.8, car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain();
    car.frequency.value = f; mod.frequency.value = f; mg.gain.setValueAtTime(f * 1.6, t); mg.gain.setTargetAtTime(f * .25, t, .25); mod.connect(mg); mg.connect(car.frequency); car.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.13 * v, t + .006); g.gain.setTargetAtTime(.05 * v, t + .01, .4); g.gain.setTargetAtTime(0, t + d, .3); car.start(t); mod.start(t); car.stop(end); mod.stop(end);
    const tg = c.createGain(); tg.connect(g); tg.gain.setValueAtTime(.25, t); tg.gain.setTargetAtTime(0, t, .05); o(c, "sine", f * 14, t, t + .3, tg, 1); },
  celesta(c, dry, wet, m, t, d, v){ const f = hz(m), g = out(c, dry, wet, .55), end = t + 2.6; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12 * v, t + .003); g.gain.setTargetAtTime(0, t + .01, .55);
    o(c, "sine", f, t, end, g, 1); o(c, "sine", f * 2, t, end, g, .18); const h = c.createGain(); h.connect(g); h.gain.setValueAtTime(.4, t); h.gain.setTargetAtTime(0, t, .06); o(c, "sine", f * 4.02, t, t + .4, h, 1); },
  bell(c, dry, wet, m, t, d, v){ const f = hz(m), g = out(c, dry, wet, .8), end = t + 4; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.07 * v, t + .004); g.gain.setTargetAtTime(0, t + .01, 1.2); [1, 2.76, 5.4].forEach((k, i) => o(c, "sine", f * k, t, end, g, [1, .3, .12][i])); },
  pad(c, dry, wet, m, t, d, v){ const f = hz(m), g = out(c, dry, wet, .8), end = t + d + 2, lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = .6; lp.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.028 * v, t + 1.1); g.gain.setValueAtTime(.028 * v, t + d); g.gain.linearRampToValueAtTime(0, end); [-8, 8].forEach(dt => o(c, "sawtooth", f, t, end, lp, .5, dt)); o(c, "triangle", f * 2, t, end, lp, .3); },
  cello(c, dry, wet, m, t, d, v){ const f = hz(m), g = out(c, dry, wet, .55), end = t + d + 1, lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1600; lp.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05 * v, t + .35); g.gain.setValueAtTime(.05 * v, t + d); g.gain.linearRampToValueAtTime(0, end);
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 5.3; lg.gain.value = 7; lfo.connect(lg); lfo.start(t + .3); lfo.stop(end); const x = o(c, "sawtooth", f, t, end, lp, .6); lg.connect(x.detune); },
  bass(c, dry, wet, m, t, d, v){ const f = hz(m), g = out(c, dry, wet, .08), end = t + d + .4, lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.2 * v, t + .01); g.gain.setTargetAtTime(.08 * v, t + .02, .2); g.gain.setTargetAtTime(0, t + d, .1); o(c, "triangle", f, t, end, lp, 1); o(c, "sine", f / 2, t, end, lp, .5); },
  kick(c, dry, wet, m, t, d, v){ const g = out(c, dry, wet, 0), x = c.createOscillator(); x.frequency.setValueAtTime(130, t); x.frequency.exponentialRampToValueAtTime(42, t + .15); g.gain.setValueAtTime(.42 * v, t); g.gain.exponentialRampToValueAtTime(.001, t + .38); x.connect(g); x.start(t); x.stop(t + .4); },
  clap(c, dry, wet, m, t, d, v){ const g = out(c, dry, wet, .3), n = noise(c), bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1500; bp.Q.value = .9; n.connect(bp); bp.connect(g);
    g.gain.setValueAtTime(0, t); [0, .012, .024].forEach(k => { g.gain.setValueAtTime(.2 * v, t + k); g.gain.setTargetAtTime(.02 * v, t + k + .002, .006); }); g.gain.setTargetAtTime(0, t + .03, .08); n.start(t, Math.random() * .5); n.stop(t + .3); },
  shaker(c, dry, wet, m, t, d, v){ const g = out(c, dry, wet, .15), n = noise(c), hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7500; n.connect(hp); hp.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035 * v, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .09); n.start(t, Math.random() * .5); n.stop(t + .1); }
};

/* ---------- სიმღერა → მოვლენები ---------- */
function score(S){ const ev = [], P = S.prog.split(/\s+/).map(chord), B = S.beats; let b = 0;
  S.mel.replace(/\|/g, " ").split(/\s+/).filter(Boolean).forEach(tk => { const [n, l] = tk.split("/"), len = +l; if (n !== "-") ev.push({ b, i: S.lead, m: midi(n) + (S.leadOct || 0), d: len, v: 1 }); b += len; });
  P.forEach((c, k) => { const b0 = k * B; for (const L of S.layers){ if (L.only && !L.only.includes(k % 2)) continue; const oc = L.oct || 0;
    if (L.hold) c.tones.forEach(m => ev.push({ b: b0, i: L.i, m: m + 12 + oc, d: B, v: L.v }));
    if (L.arp){ const pool = [...c.tones, ...c.tones.map(x => x + 12)]; for (let s = 0; s * L.step < B - 1e-6; s++) ev.push({ b: b0 + s * L.step, i: L.i, m: pool[L.arp[s % L.arp.length] % pool.length] + 12 + oc, d: L.step * 1.6, v: L.v * (s ? 1 : 1.25) }); }
    if (L.comp) L.comp.forEach(q => c.tones.forEach(m => ev.push({ b: b0 + q, i: L.i, m: m + oc, d: .9, v: L.v })));
    if (L.root) L.root.forEach((q, j) => ev.push({ b: b0 + q, i: L.i, m: c.root - 12 + (j % 2 && !L.beat ? 7 : 0) + oc, d: Math.min(1.5, B - q), v: L.v }));
    if (L.beat) L.beat.forEach(q => ev.push({ b: b0 + q, i: L.i, m: 60, d: .2, v: L.v })); } });
  return { ev: ev.sort((x, y) => x.b - y.b), len: P.length * B, spb: 60 / S.bpm };
}
function bus(c, S){ const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3.5; comp.attack.value = .005; comp.release.value = .2;
  const master = c.createGain(), dry = c.createGain(), wet = c.createGain(), cv = c.createConvolver(), L = c.sampleRate * 2.8 | 0, ir = c.createBuffer(2, L, c.sampleRate);
  for (let ch = 0; ch < 2; ch++){ const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < L; i++){ lp += ((Math.random() * 2 - 1) - lp) * .55; d[i] = lp * Math.pow(1 - i / L, 3); } }
  cv.buffer = ir; wet.gain.value = S.rev; wet.connect(cv); cv.connect(comp); dry.connect(comp); comp.connect(master); master.connect(c.destination); master.gain.value = 0; return { master, dry, wet }; }

/* ---------- ცოცხალი დაკვრა ---------- */
let ctx = null, B = null, SC = null, timer = 0, t0 = 0, idx = 0, cur = null, playing = false;
function play(id){ const S = SONGS[id] || SONGS.brise; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; if (!ctx) ctx = new AC();
  if (cur !== id){ clearInterval(timer); if (B) B.master.disconnect(); B = bus(ctx, S); SC = score(S); cur = id; t0 = ctx.currentTime + .12; idx = 0;
    B.master.gain.setValueAtTime(0, ctx.currentTime); B.master.gain.linearRampToValueAtTime(S.vol, ctx.currentTime + 2.4);
    timer = setInterval(() => { const ahead = ctx.currentTime + .4; for (;;){ const e = SC.ev[idx], at = t0 + e.b * SC.spb; if (at > ahead) break; if (at >= ctx.currentTime - .03) try { INS[e.i](ctx, B.dry, B.wet, e.m, at, e.d * SC.spb, e.v); } catch (_) {}
      if (++idx >= SC.ev.length){ idx = 0; t0 += SC.len * SC.spb; } } }, 45); }
  ctx.resume(); playing = true; return true; }
function pause(){ if (ctx) ctx.suspend(); playing = false; }
function unlock(){ const AC = window.AudioContext || window.webkitAudioContext; if (!ctx && AC) ctx = new AC(); if (ctx) ctx.resume(); }
document.addEventListener("visibilitychange", () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (playing) ctx.resume(); });
/* ---------- ვიდეოსთვის: ხაზგარეშე ჩაწერა ---------- */
function render(id, sec, delay = 0){ const S = SONGS[id] || SONGS.brise, sr = 48000, c = new OfflineAudioContext(2, Math.ceil(sr * sec), sr), b = bus(c, S), sc = score(S);
  b.master.gain.setValueAtTime(0, 0); b.master.gain.setValueAtTime(0, delay); b.master.gain.linearRampToValueAtTime(S.vol, delay + 2.2); b.master.gain.setValueAtTime(S.vol, Math.max(delay + 2.3, sec - 2.2)); b.master.gain.linearRampToValueAtTime(0, sec - .05);
  for (let L = delay + .05; L < sec; L += sc.len * sc.spb) for (const e of sc.ev){ const at = L + e.b * sc.spb; if (at >= sec) break; try { INS[e.i](c, b.dry, b.wet, e.m, at, e.d * sc.spb, e.v); } catch (_) {} }
  return c.startRendering(); }
return { play, pause, unlock, render, get playing(){ return playing; }, songs: Object.keys(SONGS) };
})();
