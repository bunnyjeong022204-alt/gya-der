/* =========================================================
   audio.js — 효과음 (WebAudio 합성, 외부 파일 없음)
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  let ctx = null;
  let master = null;
  let muted = false;
  let humNode = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, vol, slideTo) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(start, dur, vol, filterFreq, type) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime + start;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = type || 'lowpass';
    f.frequency.value = filterFreq || 1200;
    const g = c.createGain();
    g.gain.value = vol || 0.3;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  const SFX = {
    sparkle() { [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, i * 0.06, 0.35, 'triangle', 0.08)); },
    pop() { tone(660, 0, 0.12, 'sine', 0.15, 1320); },
    select() { tone(880, 0, 0.08, 'square', 0.04); },
    coin() { tone(1046, 0, 0.08, 'square', 0.05); tone(1318, 0.08, 0.2, 'square', 0.05); },
    loss() { tone(523, 0, 0.18, 'triangle', 0.1); tone(392, 0.15, 0.35, 'triangle', 0.1); },
    door() { noise(0, 0.06, 0.6, 3000, 'highpass'); tone(180, 0.02, 0.12, 'square', 0.12, 90); noise(0.12, 0.05, 0.4, 2000, 'highpass'); },
    doorClose() { noise(0, 0.35, 0.8, 300); tone(70, 0, 0.4, 'sine', 0.3, 40); },
    step() { tone(60, 0, 0.18, 'sine', 0.45, 35); noise(0, 0.08, 0.25, 400); },
    impact() { noise(0, 0.25, 1.0, 900); tone(90, 0, 0.3, 'sine', 0.5, 30); },
    shatter() { for (let i = 0; i < 7; i++) tone(2000 + Math.random() * 3000, i * 0.03, 0.15, 'triangle', 0.05); noise(0, 0.3, 0.3, 5000, 'highpass'); },
    heartbeat() { tone(55, 0, 0.15, 'sine', 0.5, 40); tone(55, 0.22, 0.15, 'sine', 0.35, 40); },
    breath() { noise(0, 0.9, 0.12, 700, 'bandpass'); },
    glitch() { for (let i = 0; i < 6; i++) tone(100 + Math.random() * 900, i * 0.025, 0.04, 'square', 0.06); },
    phone() { tone(1318, 0, 0.09, 'sine', 0.12); tone(1760, 0.11, 0.12, 'sine', 0.12); },
    brake() { noise(0, 1.1, 0.5, 2500, 'bandpass'); tone(900, 0, 1.0, 'sawtooth', 0.04, 700); },
    crash() { noise(0, 0.6, 1.0, 1200); tone(60, 0, 0.6, 'sine', 0.6, 25); },
    chime() { [523, 659, 784].forEach((f, i) => tone(f, i * 0.12, 0.6, 'sine', 0.08)); },
  };

  GD.sfx = function (name) {
    try { if (SFX[name]) SFX[name](); } catch (e) { /* ignore */ }
  };

  // 낮게 깔리는 불안한 잡음 (후반부)
  GD.hum = function (on) {
    const c = ac(); if (!c) return;
    if (on && !humNode && !muted) {
      const o = c.createOscillator();
      const o2 = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = 48; o2.frequency.value = 48.7;
      o.type = 'sine'; o2.type = 'sine';
      g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(0.09, c.currentTime + 3);
      o.connect(g); o2.connect(g); g.connect(master);
      o.start(); o2.start();
      humNode = { o, o2, g };
    } else if (!on && humNode) {
      const h = humNode; humNode = null;
      h.g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1);
      setTimeout(() => { try { h.o.stop(); h.o2.stop(); } catch (e) { /* ignore */ } }, 1200);
    }
  };

  GD.unlockAudio = function () { ac(); };
  GD.toggleMute = function () {
    muted = !muted;
    if (muted) GD.hum(false);
    return muted;
  };
  GD.isMuted = function () { return muted; };
})(window.GD);
