/* ამბავი · ორიგინალური მელოდიები, Web Audio-თი ცოცხლად სინთეზირებული (ფაილი არ სჭირდება).
   config.js → music: "romance" (ფორტეპიანოს ბალადა) | "waltz" (გიტარა-არფა) | "party" (საცეკვაო)
                       "kids" (ქსილოფონი და უკულელე) | "lullaby" (მუსიკალური ყუთი)
                       "kartuli" (ქართული: ფანდური, დუდუკი, მრავალხმიანი ბანი და დოლი — ორიგინალური მელოდია)
   საკუთარი სიმღერა: music: "music/song.mp3" (mp3 / m4a / ogg / wav, დგება მოსაწვევის music/ საქაღალდეში).
   YouTube: music: "https://www.youtube.com/watch?v=..." — უკრავს YouTube-ის ოფიციალური პატარა ფლეერით (ქვედა კუთხეში).
   თუ ფაილი ან ვიდეო ვერ ჩაიტვირთა, ჟღერს musicFallback-ის მელოდია (მაგ. musicFallback: "kartuli"). */
window.Music = (function(){
"use strict";
let ctx = null, out = null, bus = null, wet = null, dest = null, timer = null, EV = [], LOOP = 0, STEP = .25, loopStart = 0, idx = 0, playing = false, noiseBuf = null, warned = false;
let audio = null;
const isFile = n => /\.(mp3|m4a|aac|ogg|oga|wav|webm)(\?|$)/i.test(String(n || ""));
/* your own song from a file: loops, fades in; falls back to a built-in melody if the file is missing */
function startFile(src){
  if (!audio){
    audio = new Audio(src); audio.loop = true; audio.preload = "auto"; audio.volume = 0;
    audio.addEventListener("error", () => { audio = null; playing = false; const fb = (window.CONFIG || {}).musicFallback; if (fb && !isFile(fb)) start(fb); }, { once: true });
  }
  playing = true;
  const p = audio.play(); if (p && p.catch) p.catch(() => {});
  const a = audio, t0 = performance.now(), up = () => { if (!a || a !== audio || !playing) return; const k = Math.min(1, (performance.now() - t0) / 1500); a.volume = .85 * k; if (k < 1) requestAnimationFrame(up); }; up();
  return true;
}
/* ---------- YouTube: the official embedded player in a small card; loaded early so a tap can start it ---------- */
const ytId = n => { const m = String(n || "").match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
let yt = null, ytReady = false, ytWant = false, ytCard = null;
function ytFail(){ ytWant = false; playing = false; if (ytCard) ytCard.hidden = true; yt = null; const fb = (window.CONFIG || {}).musicFallback; if (fb && !isFile(fb) && !ytId(fb)) start(fb); }
function ytPrepare(id){
  if (ytCard) return;
  const css = document.createElement("style");
  css.textContent = ".yt-card{position:fixed;left:14px;bottom:calc(max(16px,env(safe-area-inset-bottom)) + 58px);z-index:171;width:200px;border-radius:14px;overflow:hidden;background:#000;box-shadow:0 12px 30px rgba(0,0,0,.28);transition:opacity .4s,transform .4s}" +
    ".yt-card iframe{display:block;width:200px;height:113px;border:0}.yt-x{position:absolute;top:4px;right:4px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font:16px/26px system-ui;text-align:center}" +
    ".preview .yt-card{display:none!important}";
  document.head.appendChild(css);
  ytCard = document.createElement("div"); ytCard.className = "yt-card"; ytCard.hidden = true;
  ytCard.innerHTML = '<div id="yt-player"></div><button type="button" class="yt-x" aria-label="✕">✕</button>';
  document.body.appendChild(ytCard);
  ytCard.querySelector(".yt-x").addEventListener("click", e => { e.stopPropagation(); pause(); ytCard.hidden = true; const b = document.getElementById("music"); if (b) b.classList.remove("playing"); });
  const make = () => { yt = new YT.Player("yt-player", { videoId: id, width: 200, height: 113,
    playerVars: { playsinline: 1, loop: 1, playlist: id, rel: 0, modestbranding: 1 },
    events: {
      onReady: () => { ytReady = true; if (ytWant){ yt.playVideo(); } },
      onStateChange: e => { if (e.data === 1) playing = true; if (e.data === 2 && !ytWant) playing = false; const b = document.getElementById("music"); if (b) b.classList.toggle("playing", playing); },
      onError: ytFail } }); };
  if (window.YT && window.YT.Player) make();
  else { const prev = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { if (prev) prev(); make(); };
    const sc = document.createElement("script"); sc.src = "https://www.youtube.com/iframe_api"; sc.onerror = ytFail; document.head.appendChild(sc); }
}
function startYT(id){ ytPrepare(id); ytWant = true; playing = true; ytCard.hidden = false; if (yt && ytReady) yt.playVideo(); return true; }
(function(){ const id = ytId((window.CONFIG || {}).music); if (!id || location.protocol === "file:") return; if (document.body) ytPrepare(id); else document.addEventListener("DOMContentLoaded", () => ytPrepare(id)); })();
const hz = m => 440 * Math.pow(2, (m - 69) / 12), rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- songs: chords = one per bar {b: bass, n: chord}, mel = [bar, step, midi, length] ---------- */
const G = {b: 43, n: [55, 59, 62]}, Dj = {b: 50, n: [57, 62, 66]}, Em = {b: 40, n: [55, 59, 64]}, Cg = {b: 48, n: [55, 60, 64]};
const C1 = {b: 48, n: [60, 64, 67]}, G1 = {b: 43, n: [59, 62, 67]}, Am = {b: 45, n: [60, 64, 69]}, F1 = {b: 41, n: [60, 65, 69]};
const KD = {b: 38, n: [62, 66, 69]}, KC = {b: 36, n: [60, 64, 67]}, KG = {b: 43, n: [62, 67, 71]}, KDc = {b: 38, n: [62, 69, 74]};
const SONGS = {
  romance: { bpm: 72, div: 2, bar: 8, wet: .42, gain: 1.4, lead: "piano", leadVel: 1.15,
    chords: [{b: 38, n: [62, 66, 69]}, {b: 49, n: [61, 64, 69]}, {b: 47, n: [62, 66, 71]}, {b: 43, n: [62, 67, 71]}, {b: 38, n: [62, 66, 69]}, {b: 45, n: [61, 64, 69]}, {b: 43, n: [62, 67, 71]}, {b: 45, n: [61, 64, 69]}],
    mel: [[0,0,78,3],[0,3,76,1],[0,4,74,2],[0,6,69,2],[1,0,73,3],[1,3,74,1],[1,4,76,4],[2,0,74,3],[2,3,73,1],[2,4,71,2],[2,6,78,2],[3,0,79,3],[3,3,78,1],[3,4,76,4],
          [4,0,81,3],[4,3,78,1],[4,4,74,2],[4,6,78,2],[5,0,76,3],[5,3,73,1],[5,4,69,2],[5,6,73,2],[6,0,71,2],[6,2,74,2],[6,4,79,2],[6,6,78,1],[6,7,76,1],[7,0,76,4],[7,4,73,2],[7,6,76,2]],
    parts: [
      { i: "piano", s: [0], note: c => c.b, v: .8 },
      { i: "piano", s: [4], note: c => c.b + 7, v: .55 },
      { i: "piano", s: [1, 2, 3, 5, 6, 7], note: (c, s, k) => c.n[[0, 1, 2, 2, 1, 0][k]], v: .3 },
      { i: "pad", s: [0], chord: true, v: .8, d: 8 }
    ] },
  waltz: { bpm: 112, div: 2, bar: 8, wet: .3, gain: 1.4, lead: "lead",
    chords: [G, Dj, Em, Cg, G, Dj, Cg, Dj],
    mel: [[0,0,71,2],[0,2,74,1],[0,3,79,1],[0,4,78,2],[0,6,74,2],[1,0,69,2],[1,2,74,1],[1,3,78,1],[1,4,76,2],[1,6,74,2],[2,0,76,2],[2,2,74,1],[2,3,71,1],[2,4,67,2],[2,6,71,2],
          [3,0,72,2],[3,2,76,1],[3,3,79,1],[3,4,76,4],[4,0,74,2],[4,2,71,1],[4,3,74,1],[4,4,79,2],[4,6,78,2],[5,0,76,2],[5,2,78,1],[5,3,81,1],[5,4,78,2],[5,6,74,2],
          [6,0,76,1],[6,1,74,1],[6,2,72,2],[6,4,74,2],[6,6,76,2],[7,0,74,2],[7,2,78,2],[7,4,81,2],[7,6,78,2]],
    parts: [
      { i: "lowpluck", s: [0, 4], note: (c, s) => s ? c.b + 7 : c.b },
      { i: "pluck", s: [1, 2, 3, 5, 6, 7], note: (c, s, k) => c.n[[0, 1, 2, 1, 2, 1][k]] + 12, v: .45 },
      { i: "pad", s: [0], chord: true, v: .9, d: 8 },
      { i: "shaker", s: [1, 3, 5, 7] }
    ] },
  party: { bpm: 120, div: 4, bar: 16, wet: .2, gain: .85, lead: "synth",
    chords: [{b: 41, n: [65, 69, 72]}, {b: 48, n: [64, 67, 72]}, {b: 50, n: [65, 69, 74]}, {b: 46, n: [65, 70, 74]}, {b: 41, n: [65, 69, 72]}, {b: 48, n: [64, 67, 72]}, {b: 50, n: [65, 69, 74]}, {b: 46, n: [65, 70, 74]}],
    mel: [[0,0,81,2],[0,2,81,2],[0,4,79,2],[0,6,77,2],[0,8,81,4],[0,12,84,4],[1,0,79,2],[1,2,79,2],[1,4,77,2],[1,6,76,2],[1,8,79,6],[1,14,72,2],
          [2,0,77,2],[2,2,77,2],[2,4,76,2],[2,6,74,2],[2,8,77,4],[2,12,81,4],[3,0,79,4],[3,4,77,2],[3,6,74,2],[3,8,77,4],[3,12,79,4],
          [4,0,81,2],[4,2,84,2],[4,4,81,2],[4,6,77,2],[4,8,81,2],[4,10,84,2],[4,12,86,4],[5,0,84,4],[5,4,79,2],[5,6,76,2],[5,8,79,4],[5,12,84,4],
          [6,0,86,2],[6,2,84,2],[6,4,81,2],[6,6,77,2],[6,8,81,4],[6,12,79,4],[7,0,77,4],[7,4,79,4],[7,8,81,4],[7,12,79,4]],
    parts: [
      { i: "kick", s: [0, 4, 8, 12] },
      { i: "clap", s: [4, 12] },
      { i: "hat", s: [2, 6, 10, 14], v: .8, d: 2 },
      { i: "hat", s: [1, 3, 5, 7, 9, 11, 13, 15], v: .35 },
      { i: "bass", s: [0, 3, 6, 8, 11, 14], note: (c, s, k) => c.b + [0, 12, 0, 0, 12, 0][k], d: 2, v: .9 },
      { i: "stab", s: [2, 6, 10, 14], chord: true, v: .7 },
      { i: "pad", s: [0], chord: true, v: .55, d: 16 }
    ] },
  kids: { bpm: 126, div: 2, bar: 8, wet: .18, lead: "marimba",
    chords: [C1, G1, Am, F1, C1, F1, G1, C1],
    mel: [[0,0,76,1],[0,1,79,1],[0,2,84,2],[0,4,79,1],[0,5,76,1],[0,6,79,2],[1,0,74,1],[1,1,79,1],[1,2,83,2],[1,4,79,1],[1,5,74,1],[1,6,79,2],
          [2,0,72,1],[2,1,76,1],[2,2,81,2],[2,4,79,1],[2,5,76,1],[2,6,72,2],[3,0,77,1],[3,1,81,1],[3,2,84,2],[3,4,81,2],[3,6,79,2],
          [4,0,76,2],[4,2,76,1],[4,3,77,1],[4,4,79,2],[4,6,76,2],[5,0,77,2],[5,2,81,1],[5,3,79,1],[5,4,77,2],[5,6,81,2],
          [6,0,79,1],[6,1,81,1],[6,2,79,1],[6,3,77,1],[6,4,76,1],[6,5,74,1],[6,6,71,2],[7,0,72,2],[7,2,76,2],[7,4,79,1],[7,5,76,1],[7,6,72,2]],
    parts: [
      { i: "strum", s: [0, 2, 3, 5, 6], chord: true, v: .5 },
      { i: "bass", s: [0, 4, 6], note: (c, s, k) => c.b + [0, 0, 7][k], v: .8, d: 2 },
      { i: "clap", s: [2, 6], v: .6 },
      { i: "kick", s: [0, 4], v: .55 },
      { i: "shaker", s: [0, 1, 2, 3, 4, 5, 6, 7], v: .7 }
    ] },
  /* original melody in the manner of Georgian folk polyphony: 6/8, D mixolydian, drone bass,
     panduri strums, a duduk-like lead and a cadence on the open fifth */
  kartuli: { bpm: 92, div: 2, bar: 6, wet: .36, gain: 1.35, lead: "duduk",
    chords: [KD, KC, KD, KG, KD, KC, KG, KDc, KD, KC, KD, KG, KD, KC, KG, KDc],
    mel: [[0,0,69,2],[0,2,71,1],[0,3,69,1],[0,4,66,2],[1,0,67,2],[1,2,64,1],[1,3,67,1],[1,4,72,2],[2,0,69,3],[2,3,67,1],[2,4,66,1],[2,5,64,1],
          [3,0,62,2],[3,2,67,2],[3,4,71,2],[4,0,74,2],[4,2,72,1],[4,3,71,1],[4,4,69,2],[5,0,72,1],[5,1,71,1],[5,2,67,2],[5,4,64,2],
          [6,0,67,2],[6,2,69,1],[6,3,71,1],[6,4,69,1],[6,5,67,1],[7,0,66,1],[7,1,64,1],[7,2,62,4],
          [8,0,74,2],[8,2,76,1],[8,3,74,1],[8,4,69,2],[9,0,72,2],[9,2,67,1],[9,3,72,1],[9,4,76,2],[10,0,74,3],[10,3,72,1],[10,4,69,2],
          [11,0,71,2],[11,2,74,2],[11,4,79,2],[12,0,78,2],[12,2,76,1],[12,3,74,1],[12,4,72,1],[12,5,69,1],[13,0,67,2],[13,2,72,2],[13,4,76,2],
          [14,0,74,1],[14,1,72,1],[14,2,71,2],[14,4,69,2],[15,0,69,2],[15,2,64,1],[15,3,62,3]],
    parts: [
      { i: "bani", s: [0], note: c => c.b + 12, v: 1, d: 6 },
      { i: "choir", s: [0], note: c => c.n[1], v: 1, d: 6 },
      { i: "pstrum", s: [0, 3], chord: true, v: .8 },
      { i: "panduri", s: [1, 2, 4, 5], note: (c, s, k) => c.n[[2, 1, 2, 0][k]] + 12, v: .36 },
      { i: "doli", s: [0, 3], v: .7 },
      { i: "doli", s: [5], v: .3 }
    ] },
  lullaby: { bpm: 96, div: 2, bar: 6, wet: .45, gain: 1.6, lead: "bell",
    chords: [C1, F1, C1, G1, C1, F1, G1, C1],
    mel: [[0,0,76,2],[0,2,79,2],[0,4,84,2],[1,0,81,3],[1,3,79,1],[1,4,77,2],[2,0,76,2],[2,2,79,1],[2,3,76,1],[2,4,72,2],[3,0,74,4],[3,4,67,2],
          [4,0,76,2],[4,2,79,2],[4,4,84,2],[5,0,86,3],[5,3,84,1],[5,4,81,2],[6,0,79,2],[6,2,71,1],[6,3,74,1],[6,4,77,2],[7,0,76,4],[7,4,72,2]],
    parts: [
      { i: "bell", s: [0], note: c => c.b + 12, v: .6 },
      { i: "bell", s: [2, 4], note: (c, s, k) => c.n[k + 1], v: .38 },
      { i: "pad", s: [0], chord: true, v: .6, d: 6 }
    ] },

  /* ===== second collection (2026-10): ten new original pieces, each for its own mood ===== */
  /* "garden": 6/8 nylon-guitar fingerpicking and a flute — olive garden, outdoor weddings */
  garden: { bpm: 84, div: 2, bar: 6, wet: .3, gain: 1.75, lead: "flute",
    chords: [{b: 43, n: [55, 59, 62]}, {b: 40, n: [55, 59, 64]}, {b: 48, n: [55, 60, 64]}, {b: 50, n: [54, 57, 62]}, {b: 43, n: [55, 59, 62]}, {b: 40, n: [55, 59, 64]}, {b: 45, n: [57, 60, 64]}, {b: 50, n: [54, 57, 62]}],
    mel: [[0,0,79,2],[0,2,78,1],[0,3,79,1],[0,4,83,2],[1,0,79,3],[1,3,76,1],[1,4,74,2],[2,0,76,2],[2,2,79,1],[2,3,81,1],[2,4,79,2],[3,0,78,3],[3,3,76,1],[3,4,74,2],
          [4,0,79,2],[4,2,83,1],[4,3,86,1],[4,4,83,2],[5,0,81,2],[5,2,79,1],[5,3,76,1],[5,4,79,2],[6,0,81,2],[6,2,79,2],[6,4,76,2],[7,0,78,4],[7,4,74,2]],
    parts: [
      { i: "nylon", s: [0], note: c => c.b, v: .9 },
      { i: "nylon", s: [1, 2, 3, 4, 5], note: (c, s, k) => c.n[[0, 1, 2, 1, 0][k]] + 12, v: .42 },
      { i: "strings", s: [0], chord: true, v: .5, d: 6 },
      { i: "shaker", s: [2, 5], v: .5 }
    ] },
  /* "nocturne": slow jazz ballad, electric piano with maj7/9 chords under the stars */
  nocturne: { bpm: 66, div: 2, bar: 8, wet: .45, gain: 1.5, lead: "epiano", leadVel: 1.1,
    chords: [{b: 38, n: [61, 64, 66, 69]}, {b: 47, n: [59, 62, 66, 69]}, {b: 40, n: [62, 66, 67, 71]}, {b: 45, n: [61, 66, 67, 71]}, {b: 43, n: [62, 66, 67, 71]}, {b: 42, n: [61, 64, 66, 69]}, {b: 40, n: [62, 66, 67, 71]}, {b: 45, n: [61, 66, 67, 71]}],
    mel: [[0,0,81,3],[0,3,78,1],[0,4,76,4],[1,2,78,2],[1,4,81,2],[1,6,83,2],[2,0,83,3],[2,3,81,1],[2,4,78,4],[3,0,76,6],[3,6,73,2],
          [4,0,78,2],[4,2,81,2],[4,4,86,4],[5,0,85,3],[5,3,83,1],[5,4,81,4],[6,0,79,2],[6,2,78,2],[6,4,76,2],[6,6,78,2],[7,0,76,8]],
    parts: [
      { i: "epstrum", s: [0], chord: true, v: .9 },
      { i: "epstrum", s: [5], chord: true, v: .45 },
      { i: "walk", s: [0, 4], note: (c, s, k) => c.b + [0, 7][k], v: .8 },
      { i: "strings", s: [0], chord: true, v: .35, d: 8 },
      { i: "brush", s: [2, 6], v: .8 }
    ] },
  /* "boho": Andalusian rumba — nylon strums, hand percussion, a Spanish-flavoured guitar line */
  boho: { bpm: 100, div: 2, bar: 8, wet: .25, gain: 1.25, lead: "nylon", leadVel: 1.25,
    chords: [{b: 45, n: [57, 60, 64]}, {b: 43, n: [55, 59, 62]}, {b: 41, n: [57, 60, 65]}, {b: 40, n: [56, 59, 64]}, {b: 45, n: [57, 60, 64]}, {b: 43, n: [55, 59, 62]}, {b: 41, n: [57, 60, 65]}, {b: 40, n: [56, 59, 64]}],
    mel: [[0,0,76,2],[0,2,77,1],[0,3,76,1],[0,4,72,2],[0,6,69,2],[1,0,74,2],[1,2,76,1],[1,3,74,1],[1,4,71,4],[2,0,72,2],[2,2,74,1],[2,3,72,1],[2,4,69,2],[2,6,65,2],[3,0,68,3],[3,3,69,1],[3,4,71,4],
          [4,0,81,2],[4,2,79,1],[4,3,77,1],[4,4,76,2],[4,6,72,2],[5,0,79,2],[5,2,77,1],[5,3,76,1],[5,4,74,4],[6,0,77,2],[6,2,76,1],[6,3,74,1],[6,4,72,2],[6,6,69,2],[7,0,71,2],[7,2,68,2],[7,4,64,4]],
    parts: [
      { i: "nstrum", s: [0, 3, 4, 6], chord: true, v: .8 },
      { i: "walk", s: [0, 3, 6], note: (c, s, k) => c.b + [0, 7, 12][k], v: .7 },
      { i: "shaker", s: [0, 1, 2, 3, 4, 5, 6, 7], v: .6 },
      { i: "clap", s: [2, 6], v: .35 }
    ] },
  /* "lounge": swing jazz trio — walking bass, ride cymbal, Rhodes comping and vibraphone */
  lounge: { bpm: 104, div: 3, bar: 12, wet: .28, gain: 1.3, lead: "vibes", leadVel: 1.2,
    chords: [{b: 41, n: [57, 60, 64]}, {b: 38, n: [57, 60, 65]}, {b: 43, n: [58, 62, 65]}, {b: 36, n: [58, 64, 67]}, {b: 45, n: [60, 64, 67]}, {b: 38, n: [57, 60, 66]}, {b: 43, n: [58, 62, 65]}, {b: 36, n: [58, 64, 67]}],
    mel: [[0,0,77,3],[0,3,76,2],[0,5,74,1],[0,6,72,6],[1,0,74,3],[1,3,77,3],[1,6,81,6],[2,0,79,3],[2,3,77,2],[2,5,74,1],[2,6,70,6],[3,0,72,9],[3,9,76,3],
          [4,0,79,3],[4,3,76,2],[4,5,72,1],[4,6,69,6],[5,0,74,3],[5,3,78,3],[5,6,81,6],[6,0,82,3],[6,3,81,2],[6,5,79,1],[6,6,77,6],[7,0,76,6],[7,6,72,6]],
    parts: [
      { i: "walk", s: [0, 3, 6, 9], note: (c, s, k) => c.b + [0, 7, 12, 10][k], v: .9 },
      { i: "epstrum", s: [5, 11], chord: true, v: .55 },
      { i: "ride", s: [0, 3, 5, 6, 9, 11], v: .9 },
      { i: "brush", s: [3, 9], v: .5 }
    ] },
  /* "harp": a dreamy harp in 16ths with long string lines — watercolour, tender moments */
  harp: { bpm: 80, div: 4, bar: 16, wet: .5, gain: 2.4, lead: "strings", leadVel: 1.5,
    chords: [{b: 36, n: [60, 64, 67, 71]}, {b: 45, n: [60, 64, 67, 69]}, {b: 41, n: [60, 64, 65, 69]}, {b: 43, n: [62, 67, 71, 74]}, {b: 40, n: [59, 64, 67, 71]}, {b: 45, n: [60, 64, 67, 69]}, {b: 38, n: [60, 62, 65, 69]}, {b: 43, n: [62, 67, 71, 74]}],
    mel: [[0,0,76,8],[0,8,79,8],[1,0,81,12],[1,12,79,4],[2,0,77,8],[2,8,76,8],[3,0,74,16],[4,0,79,8],[4,8,83,8],[5,0,84,12],[5,12,81,4],[6,0,81,8],[6,8,77,8],[7,0,79,16]],
    parts: [
      { i: "harp", s: [0], note: c => c.b, v: .8 },
      { i: "harp", s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], note: (c, s, k) => { const a = [c.n[0], c.n[1], c.n[2], c.n[3], c.n[0] + 12, c.n[1] + 12, c.n[2] + 12, c.n[3] + 12]; return a[k < 8 ? k : 15 - k]; }, v: .4 },
      { i: "pad", s: [0], chord: true, v: .45, d: 16 }
    ] },
  /* "chonguri": a new Georgian piece in 3/4 — chonguri-like arpeggios, salamuri flute, men's choir, doli */
  chonguri: { bpm: 108, div: 2, bar: 6, wet: .32, gain: 1.65, lead: "flute", leadVel: 1.1,
    chords: [{b: 40, n: [59, 64, 67]}, {b: 38, n: [57, 62, 66]}, {b: 40, n: [59, 64, 67]}, {b: 36, n: [60, 64, 67]}, {b: 40, n: [59, 64, 67]}, {b: 38, n: [57, 62, 66]}, {b: 45, n: [57, 61, 64]}, {b: 40, n: [59, 64, 67]}],
    mel: [[0,0,76,2],[0,2,79,1],[0,3,78,1],[0,4,76,2],[1,0,74,2],[1,2,78,2],[1,4,81,2],[2,0,79,1],[2,1,78,1],[2,2,76,2],[2,4,71,2],[3,0,72,2],[3,2,76,2],[3,4,79,2],
          [4,0,83,2],[4,2,81,1],[4,3,79,1],[4,4,78,2],[5,0,81,2],[5,2,78,1],[5,3,74,1],[5,4,78,2],[6,0,76,2],[6,2,73,2],[6,4,76,2],[7,0,71,2],[7,2,76,4]],
    parts: [
      { i: "panduri", s: [0, 1, 2, 3, 4, 5], note: (c, s, k) => [c.b + 12, c.n[2], c.n[1], c.n[2], c.n[0] + 12, c.n[2]][k], v: .42 },
      { i: "choir", s: [0], note: c => c.n[0], v: 1, d: 6 },
      { i: "bani", s: [0], note: c => c.b, v: .8, d: 6 },
      { i: "doli", s: [0], v: .8 },
      { i: "doli", s: [3], v: .4 }
    ] },
  /* "island": a sunny seaside groove — ukulele strums, steel drum melody, soft beach beat */
  island: { bpm: 96, div: 2, bar: 8, wet: .22, gain: 1.15, lead: "steel", leadVel: 1.1,
    chords: [{b: 48, n: [60, 64, 67]}, {b: 41, n: [60, 65, 69]}, {b: 43, n: [59, 62, 67]}, {b: 48, n: [60, 64, 67]}, {b: 45, n: [60, 64, 69]}, {b: 41, n: [60, 65, 69]}, {b: 43, n: [59, 62, 67]}, {b: 48, n: [60, 64, 67]}],
    mel: [[0,0,79,1],[0,1,76,1],[0,2,79,2],[0,4,84,2],[0,6,79,2],[1,0,81,2],[1,2,77,1],[1,3,81,1],[1,4,84,4],[2,0,83,1],[2,1,79,1],[2,2,74,2],[2,4,79,2],[2,6,83,2],[3,0,84,4],[3,4,79,4],
          [4,0,76,1],[4,1,79,1],[4,2,81,2],[4,4,84,2],[4,6,81,2],[5,0,77,2],[5,2,81,2],[5,4,77,2],[5,6,72,2],[6,0,74,1],[6,1,77,1],[6,2,79,2],[6,4,83,2],[6,6,79,2],[7,0,84,4],[7,4,72,4]],
    parts: [
      { i: "ustrum", s: [0, 3, 4, 6], chord: true, v: .8 },
      { i: "walk", s: [0, 3, 6], note: (c, s, k) => c.b - 12 + [0, 7, 12][k], v: .8 },
      { i: "shaker", s: [0, 1, 2, 3, 4, 5, 6, 7], v: .45 },
      { i: "kick", s: [0, 4], v: .45 },
      { i: "clap", s: [2, 6], v: .3 }
    ] },
  /* "chiptune": an 8-bit adventure for kids' parties — square-wave lead, fast arpeggios, noise drums */
  chiptune: { bpm: 140, div: 4, bar: 16, wet: .1, gain: 1.45, lead: "chip", leadVel: 1.2,
    chords: [{b: 36, n: [60, 64, 67]}, {b: 45, n: [60, 64, 69]}, {b: 41, n: [60, 65, 69]}, {b: 43, n: [59, 62, 67]}, {b: 36, n: [60, 64, 67]}, {b: 45, n: [60, 64, 69]}, {b: 41, n: [60, 65, 69]}, {b: 43, n: [59, 62, 67]}],
    mel: [[0,0,84,2],[0,2,88,2],[0,4,91,4],[0,8,88,2],[0,10,84,2],[0,12,86,4],[1,0,88,4],[1,4,84,2],[1,6,81,2],[1,8,84,8],[2,0,81,2],[2,2,84,2],[2,4,89,4],[2,8,88,2],[2,10,86,2],[2,12,84,4],[3,0,86,4],[3,4,83,4],[3,8,79,4],[3,12,83,4],
          [4,0,91,2],[4,2,88,2],[4,4,84,2],[4,6,88,2],[4,8,91,4],[4,12,96,4],[5,0,93,4],[5,4,91,2],[5,6,88,2],[5,8,84,8],[6,0,89,2],[6,2,88,2],[6,4,86,2],[6,6,84,2],[6,8,81,4],[6,12,84,4],[7,0,83,4],[7,4,86,4],[7,8,91,8]],
    parts: [
      { i: "chiparp", s: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], note: (c, s, k) => c.n[k % 3] + 12, v: .8 },
      { i: "tri", s: [0, 4, 8, 12], note: (c, s, k) => c.b + [0, 12, 0, 12][k], d: 3, v: 1 },
      { i: "kick", s: [0, 8], v: .6 },
      { i: "snare", s: [4, 12], v: .6 },
      { i: "hat", s: [2, 6, 10, 14], v: .5 }
    ] },
  /* "snow": a winter tale — glockenspiel, harp eighths, sleigh bells, pizzicato strings */
  snow: { bpm: 88, div: 2, bar: 8, wet: .42, gain: 2.0, lead: "glock", leadVel: 1.3,
    chords: [{b: 38, n: [62, 66, 69]}, {b: 47, n: [62, 66, 71]}, {b: 43, n: [62, 67, 71]}, {b: 45, n: [61, 64, 69]}, {b: 38, n: [62, 66, 69]}, {b: 42, n: [61, 66, 69]}, {b: 43, n: [62, 67, 71]}, {b: 45, n: [61, 64, 69]}],
    mel: [[0,0,81,2],[0,2,78,2],[0,4,81,2],[0,6,86,2],[1,0,83,4],[1,4,78,4],[2,0,79,2],[2,2,83,2],[2,4,86,2],[2,6,83,2],[3,0,81,6],[3,6,76,2],
          [4,0,78,2],[4,2,81,2],[4,4,86,2],[4,6,90,2],[5,0,88,4],[5,4,85,4],[6,0,86,2],[6,2,83,2],[6,4,79,2],[6,6,83,2],[7,0,81,8]],
    parts: [
      { i: "harp", s: [0, 1, 2, 3, 4, 5, 6, 7], note: (c, s, k) => c.n[[0, 1, 2, 1, 0, 1, 2, 1][k]], v: .32 },
      { i: "pizz", s: [0, 4], note: (c, s, k) => c.b + [0, 7][k], v: .9 },
      { i: "strings", s: [0], chord: true, v: .4, d: 8 },
      { i: "sleigh", s: [0, 1, 2, 3, 4, 5, 6, 7], v: .7 }
    ] },
  /* "synthwave": 80s neon night-drive — pulsing saw bass, wide pads, big snare */
  synthwave: { bpm: 100, div: 4, bar: 16, wet: .3, gain: 1.0, lead: "polysyn", leadVel: 1.1,
    chords: [{b: 45, n: [57, 60, 64]}, {b: 41, n: [57, 60, 65]}, {b: 48, n: [55, 60, 64]}, {b: 43, n: [55, 59, 62]}, {b: 45, n: [57, 60, 64]}, {b: 41, n: [57, 60, 65]}, {b: 48, n: [55, 60, 64]}, {b: 43, n: [55, 59, 62]}],
    mel: [[0,0,76,6],[0,6,79,2],[0,8,81,8],[1,0,77,4],[1,4,76,4],[1,8,72,8],[2,0,72,4],[2,4,76,4],[2,8,79,6],[2,14,76,2],[3,0,74,12],[3,12,71,4],
          [4,0,81,6],[4,6,84,2],[4,8,83,4],[4,12,81,4],[5,0,79,4],[5,4,77,4],[5,8,76,8],[6,0,76,4],[6,4,79,4],[6,8,84,8],[7,0,83,8],[7,8,79,8]],
    parts: [
      { i: "sawbass", s: [0, 2, 4, 6, 8, 10, 12, 14], note: (c, s, k) => c.b - 12 + (k % 2) * 12, v: .9 },
      { i: "spad", s: [0], chord: true, v: 1, d: 16 },
      { i: "kick", s: [0, 8], v: .7 },
      { i: "snare", s: [4, 12], v: .8 },
      { i: "hat", s: [1, 3, 5, 7, 9, 11, 13, 15], v: .3 }
    ] }
};

/* ---------- instruments ---------- */
function env(gn, at, peak, a, tail){ gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(peak, at + a); gn.gain.exponentialRampToValueAtTime(.0003, at + tail); }
function voice(m, at, o){
  const f = hz(m), gn = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.setValueAtTime(o.cut, at); lp.frequency.exponentialRampToValueAtTime(Math.max(300, o.cut * (o.close || .3)), at + o.tail * .8);
  env(gn, at, o.peak, o.a || .004, o.tail);
  lp.connect(gn); gn.connect(bus); gn.connect(wet);
  o.p.forEach(([k, amp, type]) => {
    const osc = ctx.createOscillator(), og = ctx.createGain();
    osc.type = type || "sine"; osc.frequency.value = f * k; if (o.det) osc.detune.value = rnd(-o.det, o.det);
    og.gain.value = amp; osc.connect(og); og.connect(lp); osc.start(at); osc.stop(at + o.tail + .05);
  });
}
function noise(){
  if (!noiseBuf){ noiseBuf = ctx.createBuffer(1, ctx.sampleRate | 0, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; return s;
}
function hit(at, o){
  const s = noise(), f = ctx.createBiquadFilter(), gn = ctx.createGain();
  f.type = o.type; f.frequency.value = o.f; f.Q.value = o.q || .7;
  env(gn, at, o.peak, o.a || .002, o.tail);
  s.connect(f); f.connect(gn); gn.connect(bus); if (o.wet) gn.connect(wet);
  s.start(at, rnd(0, .5)); s.stop(at + o.tail + .05);
}
function sustained(m, at, len, o){
  const gn = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = o.cut; if (o.q) lp.Q.value = o.q;
  gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(o.peak, at + o.a);
  gn.gain.setValueAtTime(o.peak, at + Math.max(o.a, len * .85)); gn.gain.linearRampToValueAtTime(0, at + len + o.r);
  lp.connect(gn); gn.connect(bus); if (o.wet) gn.connect(wet);
  o.osc.forEach(([type, k, det]) => { const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = hz(m) * k; osc.detune.value = det || 0; osc.connect(lp); osc.start(at); osc.stop(at + len + o.r + .05); });
}
/* a reed voice like the duduk: soft attack, a little scoop into the note, slow vibrato */
function reed(m, at, len, v){
  const f = hz(m), gn = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain(), r = .25, peak = .085 * v;
  lp.type = "lowpass"; lp.frequency.value = 1700; lp.Q.value = 2.2;
  gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(peak, at + .07); gn.gain.setValueAtTime(peak * .92, at + Math.max(.07, len * .8)); gn.gain.linearRampToValueAtTime(0, at + len + r);
  lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, at); lg.gain.linearRampToValueAtTime(12, at + Math.min(.4, len)); lfo.connect(lg);
  lp.connect(gn); gn.connect(bus); gn.connect(wet);
  [["sawtooth", 1, .5], ["triangle", 1, .7], ["sine", 2, .1]].forEach(([type, k, amp]) => {
    const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = f * k;
    o.detune.setValueAtTime(-45, at); o.detune.linearRampToValueAtTime(0, at + .09); lg.connect(o.detune);
    og.gain.value = amp; o.connect(og); og.connect(lp); o.start(at); o.stop(at + len + r + .05);
  });
  lfo.start(at); lfo.stop(at + len + r + .05);
}
const INST = {
  piano: (m, at, d, v) => voice(m, at, { peak: .15 * v, tail: Math.max(.9, 2.8 - (m - 50) * .04), cut: 2600 + (m - 60) * 40, close: .35, det: 4, p: [[1, 1, "triangle"], [2, .45], [3, .2], [4, .1], [5, .05]] }),
  pluck: (m, at, d, v) => voice(m, at, { peak: .15 * v, tail: 1.1, cut: 3200, p: [[1, 1, "triangle"], [2, .4], [3, .16], [4, .07]] }),
  lowpluck: (m, at, d, v) => voice(m, at, { peak: .14 * v, tail: 1.2, cut: 900, p: [[1, 1, "triangle"], [2, .4], [3, .16]] }),
  lead: (m, at, d, v) => voice(m, at, { peak: .17 * v, tail: Math.max(.7, d * STEP * 1.8), cut: 4200, p: [[1, 1, "triangle"], [2, .4], [3, .16], [4, .07]] }),
  bell: (m, at, d, v) => voice(m, at, { peak: .11 * v, tail: 2.4, cut: 9000, close: .5, a: .002, p: [[1, 1], [2, .18], [3, .32], [5.4, .1], [8.9, .04]] }),
  marimba: (m, at, d, v) => voice(m, at, { peak: .2 * v, tail: .6, cut: 6000, a: .002, p: [[1, 1], [4, .3], [9.9, .05]] }),
  synth: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .065 * v, a: .01, r: .18, cut: 2400, q: 2, wet: true, osc: [["square", 1, 0], ["sawtooth", 1, 7], ["sine", .5, 0]] }),
  stab: (ns, at, d, v) => ns.forEach(m => voice(m, at, { peak: .05 * v, tail: .28, cut: 2400, close: .4, p: [[1, 1, "sawtooth"], [2, .2]] })),
  strum: (ns, at, d, v) => ns.forEach((m, k) => voice(m, at + k * .018, { peak: .1 * v, tail: .7, cut: 2800, p: [[1, 1, "triangle"], [2, .5], [3, .2]] })),
  pad: (ns, at, d, v) => ns.forEach(m => sustained(m, at, d * STEP, { peak: .018 * v, a: .8, r: .6, cut: 1100, wet: true, osc: [["sawtooth", 1, -5], ["sawtooth", 1, 5]] })),
  bass: (m, at, d, v) => sustained(m, at, Math.max(.12, d * STEP * .9), { peak: .2 * v, a: .008, r: .08, cut: 650, osc: [["triangle", 1, 0], ["sine", .5, 0]] }),
  kick: (m, at, d, v) => { const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(45, at + .13); gn.gain.setValueAtTime(.55 * v, at); gn.gain.exponentialRampToValueAtTime(.001, at + .32); o.connect(gn); gn.connect(bus); o.start(at); o.stop(at + .35); },
  clap: (m, at, d, v) => [0, .012, .024].forEach((o, k) => hit(at + o, { type: "bandpass", f: 1400, q: .9, peak: (k === 2 ? .22 : .14) * v, tail: k === 2 ? .16 : .03, wet: true })),
  hat: (m, at, d, v) => hit(at, { type: "highpass", f: 7500, peak: .06 * v, tail: d > 1 ? .2 : .045 }),
  shaker: (m, at, d, v) => hit(at, { type: "highpass", f: 6000, peak: .028 * v, a: .004, tail: .07 }),
  /* Georgian instruments for "kartuli" */
  panduri: (m, at, d, v) => voice(m, at, { peak: .12 * v, tail: .9, cut: 3600, close: .25, a: .002, det: 3, p: [[1, 1, "sawtooth"], [2, .35], [3, .18], [5, .06]] }),
  pstrum: (ns, at, d, v) => ns.forEach((m, k) => INST.panduri(m, at + k * .022, d, .7 * v)),
  duduk: (m, at, d, v) => reed(m, at, d * STEP, v),
  choir: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .028 * v, a: .5, r: .5, cut: 1300, wet: true, osc: [["triangle", 1, -4], ["sawtooth", 1, 4]] }),
  bani: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .05 * v, a: .4, r: .5, cut: 600, wet: true, osc: [["triangle", 1, 0], ["sine", 2, 0]] }),
  doli: (m, at, d, v) => { const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.setValueAtTime(115, at); o.frequency.exponentialRampToValueAtTime(62, at + .18); gn.gain.setValueAtTime(.3 * v, at); gn.gain.exponentialRampToValueAtTime(.001, at + .3); o.connect(gn); gn.connect(bus); o.start(at); o.stop(at + .32); hit(at, { type: "bandpass", f: 900, q: 1.2, peak: .05 * v, tail: .08 }); },
  /* second set of instruments (2026-10): strings, keys, guitars, flute, chip, synthwave, jazz kit */
  strings: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .045 * v, a: .3, r: .55, cut: 2400, wet: true, osc: [["sawtooth", 1, -8], ["sawtooth", 1, 8], ["triangle", 2, 0]] }),
  epiano: (m, at, d, v) => voice(m, at, { peak: .15 * v, tail: 2.4, cut: 3200, close: .45, det: 2, p: [[1, 1], [2, .22], [3, .07], [7, .025]] }),
  epstrum: (ns, at, d, v) => ns.forEach((m, k) => INST.epiano(m, at + k * .012, d, .55 * v)),
  vibes: (m, at, d, v) => voice(m, at, { peak: .13 * v, tail: 1.9, cut: 5200, close: .6, a: .003, p: [[1, 1], [4, .18], [10, .03]] }),
  harp: (m, at, d, v) => voice(m, at, { peak: .12 * v, tail: 2.2, cut: 5000, close: .4, a: .002, p: [[1, 1, "triangle"], [2, .3], [3, .1]] }),
  glock: (m, at, d, v) => voice(m, at, { peak: .085 * v, tail: 1.7, cut: 9500, close: .7, a: .001, p: [[1, 1], [2.76, .35], [5.4, .15], [8.93, .06]] }),
  nylon: (m, at, d, v) => voice(m, at, { peak: .14 * v, tail: 1.5, cut: 2300, close: .25, det: 3, p: [[1, 1, "triangle"], [2, .6], [3, .3], [4, .12], [5, .05]] }),
  nstrum: (ns, at, d, v) => ns.forEach((m, k) => INST.nylon(m, at + k * .02, d, .55 * v)),
  uke: (m, at, d, v) => voice(m, at, { peak: .11 * v, tail: .75, cut: 3800, close: .3, p: [[1, 1, "triangle"], [2, .5], [3, .22]] }),
  ustrum: (ns, at, d, v) => ns.forEach((m, k) => INST.uke(m + 12, at + k * .016, d, .6 * v)),
  steel: (m, at, d, v) => voice(m, at, { peak: .14 * v, tail: 1.0, cut: 4600, close: .5, a: .002, p: [[1, 1], [2, .55], [3, .22], [4.1, .1]] }),
  flute: (m, at, d, v) => { sustained(m, at, d * STEP, { peak: .075 * v, a: .07, r: .2, cut: 3400, wet: true, osc: [["sine", 1, 0], ["sine", 1, 7], ["triangle", 2, 0]] }); hit(at, { type: "bandpass", f: hz(m) * 2, q: 2, peak: .02 * v, a: .03, tail: .2 }); },
  pizz: (m, at, d, v) => voice(m, at, { peak: .16 * v, tail: .4, cut: 1300, close: .4, p: [[1, 1, "triangle"], [2, .3]] }),
  walk: (m, at, d, v) => voice(m, at, { peak: .22 * v, tail: .7, cut: 750, close: .5, p: [[1, 1, "triangle"], [2, .3]] }),
  chip: (m, at, d, v) => sustained(m, at, Math.max(.06, d * STEP * .85), { peak: .045 * v, a: .004, r: .03, cut: 7000, osc: [["square", 1, 0]] }),
  chiparp: (m, at, d, v) => sustained(m, at, .07, { peak: .022 * v, a: .002, r: .02, cut: 6000, osc: [["square", 1, 0]] }),
  tri: (m, at, d, v) => sustained(m, at, Math.max(.1, d * STEP * .8), { peak: .16 * v, a: .004, r: .04, cut: 2000, osc: [["triangle", 1, 0]] }),
  sawbass: (m, at, d, v) => sustained(m, at, Math.max(.1, d * STEP * .8), { peak: .1 * v, a: .004, r: .05, cut: 850, q: 5, osc: [["sawtooth", 1, 0], ["sawtooth", 1, -10], ["square", .5, 0]] }),
  polysyn: (m, at, d, v) => sustained(m, at, d * STEP, { peak: .06 * v, a: .02, r: .35, cut: 3000, q: 1.5, wet: true, osc: [["sawtooth", 1, -9], ["sawtooth", 1, 9], ["square", 1, 0]] }),
  spad: (ns, at, d, v) => ns.forEach(m => sustained(m, at, d * STEP, { peak: .022 * v, a: .4, r: .5, cut: 1600, wet: true, osc: [["sawtooth", 1, -12], ["sawtooth", 1, 12]] })),
  snare: (m, at, d, v) => { hit(at, { type: "bandpass", f: 1900, q: .6, peak: .26 * v, tail: .2, wet: true }); const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.setValueAtTime(220, at); o.frequency.exponentialRampToValueAtTime(140, at + .08); gn.gain.setValueAtTime(.14 * v, at); gn.gain.exponentialRampToValueAtTime(.001, at + .12); o.connect(gn); gn.connect(bus); o.start(at); o.stop(at + .14); },
  ride: (m, at, d, v) => hit(at, { type: "highpass", f: 6500, peak: .045 * v, a: .002, tail: .35 }),
  brush: (m, at, d, v) => hit(at, { type: "bandpass", f: 3200, q: .5, peak: .05 * v, a: .03, tail: .22 }),
  sleigh: (m, at, d, v) => [0, .025, .05].forEach(o => hit(at + o, { type: "highpass", f: 8500, peak: .035 * v, a: .002, tail: .1 })),
  timp: (m, at, d, v) => { const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.setValueAtTime(hz(m) * 1.05, at); o.frequency.exponentialRampToValueAtTime(hz(m), at + .1); gn.gain.setValueAtTime(.4 * v, at); gn.gain.exponentialRampToValueAtTime(.001, at + 1.1); o.connect(gn); gn.connect(bus); gn.connect(wet); o.start(at); o.stop(at + 1.15); }
};

function build(S){
  const ev = [];
  S.mel.forEach(([b, s, m, d]) => ev.push({ t: b * S.bar + s, i: S.lead, m, d, v: S.leadVel || 1 }));
  S.chords.forEach((c, b) => S.parts.forEach(p => p.s.forEach((s, k) =>
    ev.push({ t: b * S.bar + s, i: p.i, m: p.chord ? c.n : p.note ? p.note(c, s, k) : 0, d: p.d || 1, v: p.v || 1 }))));
  return ev.sort((a, b) => a.t - b.t);
}
function impulse(sec){
  const len = (ctx.sampleRate * sec) | 0, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++){ const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  return buf;
}
function schedule(){
  const ahead = ctx.currentTime + .3;
  while (true){
    const e = EV[idx], at = loopStart + e.t * STEP;
    if (at > ahead) break;
    if (at >= ctx.currentTime - .02){ try { INST[e.i](e.m, at, e.d, e.v); } catch(err) { if (!warned){ warned = true; console.warn("Music:", e.i, err); } } }
    if (++idx >= EV.length){ idx = 0; loopStart += LOOP * STEP; }
  }
}
function start(name){
  if (isFile(name)) return startFile(name);
  const yid = ytId(name); if (yid){ if (location.protocol === "file:"){ const fb = (window.CONFIG || {}).musicFallback; return fb ? start(fb) : false; } return startYT(yid); }
  try {
    if (!ctx){
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      const S = SONGS[name] || SONGS.romance;
      EV = build(S); LOOP = S.chords.length * S.bar; STEP = 60 / S.bpm / S.div;
      ctx = new AC();
      out = ctx.createGain(); out.gain.setValueAtTime(0, ctx.currentTime); out.gain.linearRampToValueAtTime(.9 * (S.gain || 1), ctx.currentTime + 2.2);
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .2;
      bus = ctx.createGain(); bus.gain.value = .8; bus.connect(comp); comp.connect(out); out.connect(ctx.destination);
      const conv = ctx.createConvolver(); conv.buffer = impulse(2.6);
      wet = ctx.createGain(); wet.gain.value = S.wet; wet.connect(conv); conv.connect(comp);
      try { dest = ctx.createMediaStreamDestination(); out.connect(dest); } catch(_) {}
      loopStart = ctx.currentTime + .15; idx = 0;
      timer = setInterval(schedule, 40);
    }
    ctx.resume(); playing = true; return true;
  } catch(e){ return false; }
}
/* offline render of a built-in melody (for adding sound to videos): AudioBuffer of `sec` seconds, music starts at `delay` */
function render(name, sec, delay){
  const S = SONGS[name] || SONGS.romance, sr = 48000, keep = [ctx, bus, wet, out, STEP, noiseBuf], G0 = .9 * (S.gain || 1);
  const oc = new OfflineAudioContext(2, Math.ceil(sr * sec), sr); ctx = oc; STEP = 60 / S.bpm / S.div; noiseBuf = null; delay = delay || 0;
  out = oc.createGain(); out.gain.setValueAtTime(0, 0); out.gain.setValueAtTime(0, delay); out.gain.linearRampToValueAtTime(G0, delay + 2.2); out.gain.setValueAtTime(G0, Math.max(delay + 2.3, sec - 1.8)); out.gain.linearRampToValueAtTime(0, sec - .05);
  const comp = oc.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .2;
  bus = oc.createGain(); bus.gain.value = .8; bus.connect(comp); comp.connect(out); out.connect(oc.destination);
  const conv = oc.createConvolver(); conv.buffer = impulse(2.6); wet = oc.createGain(); wet.gain.value = S.wet; wet.connect(conv); conv.connect(comp);
  const ev = build(S), loop = S.chords.length * S.bar * STEP;
  for (let L = delay + .05; L < sec; L += loop) for (const e of ev){ const at = L + e.t * STEP; if (at >= sec) break; try { INST[e.i](e.m, at, e.d, e.v); } catch(_) {} }
  const restore = () => { [ctx, bus, wet, out, STEP, noiseBuf] = keep; };
  return oc.startRendering().then(b => { restore(); return b; }, e => { restore(); throw e; });
}
function pause(){ ytWant = false; if (yt && ytReady) yt.pauseVideo(); if (audio) audio.pause(); if (ctx) ctx.suspend(); playing = false; }
function fadeOut(sec){ if (yt && ytReady){ ytWant = false; yt.pauseVideo(); } if (audio){ const a = audio, v0 = a.volume, t0 = performance.now(), d = (sec || 1.5) * 1000; const dn = () => { const k = Math.min(1, (performance.now() - t0) / d); a.volume = v0 * (1 - k); if (k < 1) requestAnimationFrame(dn); else a.pause(); }; dn(); } if (!ctx) return; const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + (sec || 1.5)); }
document.addEventListener("visibilitychange", () => { if (audio){ if (document.hidden) audio.pause(); else if (playing) audio.play().catch(() => {}); } if (!ctx) return; if (document.hidden) ctx.suspend(); else if (playing) ctx.resume(); });
return { start, pause, fadeOut, render, songs: Object.keys(SONGS), get playing(){ return playing; }, get stream(){ return dest && dest.stream; } };
})();
