/* ამბავი · ორიგინალური მელოდია (Web Audio), ფაილი არ სჭირდება. */
// original guitar-like barcarolle in 6/8 (Web Audio, composed for this page)
window.Music = (function(){
  let ctx = null, master = null, wet = null, timer = null, loopStart = 0, idx = 0, playing = false;
  const STEP = 60 / 168, LOOP = 48;
  const mel = [[78,3],[76,1],[74,2],[74,3],[73,1],[71,2],[71,2],[74,1],[79,3],[78,2],[76,2],[73,2],
               [78,3],[81,1],[78,2],[76,3],[74,1],[71,2],[74,2],[76,2],[79,2],[76,3],[73,3]];
  const roots = [50,47,43,45,50,47,43,45], minor = new Set([1,5]);
  const events = [];
  let t = 0; mel.forEach(([m,d]) => { events.push({t, m, lead:true}); t += d; });
  roots.forEach((r,b) => { const th = minor.has(b) ? 15 : 16;
    [r, r+7, r+th, r+19, r+th, r+7].forEach((m,k) => events.push({t:b*6+k, m, lead:false})); });
  events.sort((a,b) => a.t - b.t);
  function impulse(){
    const len = ctx.sampleRate * 2.4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++){ const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 3); }
    return buf;
  }
  function note(m, time, lead){
    const f = 440 * Math.pow(2, (m - 69) / 12), g = ctx.createGain(), peak = lead ? .2 : .085, tail = lead ? 1.5 : 1.2;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + .004);
    g.gain.exponentialRampToValueAtTime(.0005, time + tail);
    g.connect(master); g.connect(wet);
    [[1,1],[2,.35],[3,.12],[4,.05]].forEach(([k,a]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = k === 1 ? "triangle" : "sine"; o.frequency.value = f * k; og.gain.value = a;
      o.connect(og); og.connect(g); o.start(time); o.stop(time + tail + .1);
    });
  }
  function schedule(){
    const ahead = ctx.currentTime + .25;
    while (true){
      const ev = events[idx], at = loopStart + ev.t * STEP;
      if (at > ahead) break;
      if (at >= ctx.currentTime - .02) note(ev.m, at, ev.lead);
      idx++;
      if (idx >= events.length){ idx = 0; loopStart += LOOP * STEP; }
    }
  }
  function start(){
    try{
      if (!ctx){
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        ctx = new AC();
        const out = ctx.createGain(); out.gain.setValueAtTime(0, ctx.currentTime); out.gain.linearRampToValueAtTime(.85, ctx.currentTime + 2.5);
        out.connect(ctx.destination);
        master = ctx.createGain(); master.gain.value = .55; master.connect(out);
        const conv = ctx.createConvolver(); conv.buffer = impulse();
        wet = ctx.createGain(); wet.gain.value = .3; wet.connect(conv); conv.connect(out);
        loopStart = ctx.currentTime + .15; idx = 0;
        timer = setInterval(schedule, 40);
      }
      ctx.resume(); playing = true; return true;
    }catch(e){ return false; }
  }
  function pause(){ if (ctx) ctx.suspend(); playing = false; }
  document.addEventListener("visibilitychange", () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (playing) ctx.resume(); });
  return { start, pause, get playing(){ return playing; } };
})();
