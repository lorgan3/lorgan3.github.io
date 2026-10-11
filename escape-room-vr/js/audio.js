// Procedural sound effects and ambience via the Web Audio API.
let ctx = null;
let master = null;

export function audioCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function out() {
  audioCtx();
  return master;
}

export function tone(freq, dur, { type = 'sine', gain = 0.2, when = 0, attack = 0.005, release = 0.03, dest } = {}) {
  const c = audioCtx();
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + Math.max(attack, dur - release));
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  o.connect(g).connect(dest || out());
  o.start(t0);
  o.stop(t0 + dur + 0.05);
  return o;
}

let noiseBuf = null;
function noiseBuffer() {
  const c = audioCtx();
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

export function noise(dur, { gain = 0.15, when = 0, filter = 'bandpass', freq = 1000, q = 1, dest } = {}) {
  const c = audioCtx();
  const t0 = c.currentTime + when;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer();
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
  g.gain.setValueAtTime(gain, t0 + Math.max(0.02, dur - 0.05));
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  src.connect(f).connect(g).connect(dest || out());
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

// A continuous filtered-noise loop. Returns { gain, filter, stop }.
export function noiseLoop({ gain = 0.1, filter = 'lowpass', freq = 400, q = 0.7 } = {}) {
  const c = audioCtx();
  const src = c.createBufferSource();
  src.buffer = noiseBuffer();
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(out());
  src.start();
  return { gain: g, filter: f, stop: () => { try { src.stop(); } catch (e) { /* already stopped */ } } };
}

export const sfx = {
  click() { tone(1800, 0.03, { type: 'square', gain: 0.06 }); },
  press() { tone(220, 0.08, { type: 'square', gain: 0.08 }); tone(330, 0.05, { type: 'square', gain: 0.05, when: 0.04 }); },
  good() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: 'triangle', gain: 0.18, when: i * 0.12 })); },
  wrong() { tone(140, 0.5, { type: 'sawtooth', gain: 0.15 }); tone(110, 0.5, { type: 'sawtooth', gain: 0.12, when: 0.05 }); },
  open() { noise(0.4, { freq: 600, q: 0.5, gain: 0.12 }); tone(90, 0.3, { type: 'triangle', gain: 0.15 }); },
  clunk() { tone(70, 0.25, { type: 'triangle', gain: 0.3 }); noise(0.15, { freq: 300, gain: 0.15 }); },
  staticBurst(d = 0.6) { noise(d, { freq: 2500, q: 0.3, gain: 0.12 }); },
  sonarPing() {
    tone(1250, 1.6, { type: 'sine', gain: 0.07, attack: 0.01, release: 1.4 });
    tone(1250, 1.2, { type: 'sine', gain: 0.02, when: 0.45, attack: 0.01, release: 1.0 });
  },
  alarm(times = 3) {
    for (let i = 0; i < times; i++) {
      tone(700, 0.35, { type: 'square', gain: 0.07, when: i * 0.8 });
      tone(520, 0.35, { type: 'square', gain: 0.07, when: i * 0.8 + 0.38 });
    }
  },
  engineStart() {
    const c = audioCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(30, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(90, c.currentTime + 2.5);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, c.currentTime + 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 3.5);
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 400;
    o.connect(f).connect(g).connect(out());
    o.start();
    o.stop(c.currentTime + 3.6);
  },
};

// Morse playback. `code` uses '.', '-' and ' ' (letter gap). Returns a stop function.
export function morseLoop(code, { unit = 0.13, freq = 760, gain = 0.15, gapAfter = 2.4, dest } = {}) {
  let stopped = false;
  let timer = null;
  const play = () => {
    if (stopped) return;
    let t = 0;
    for (const ch of code) {
      if (ch === '.') { tone(freq, unit, { type: 'sine', gain, when: t, dest }); t += unit * 2; }
      else if (ch === '-') { tone(freq, unit * 3.4, { type: 'sine', gain, when: t, dest }); t += unit * 4.4; }
      else if (ch === ' ') { t += unit * 5; }
    }
    timer = setTimeout(play, (t + gapAfter) * 1000);
  };
  play();
  return () => { stopped = true; clearTimeout(timer); };
}

const bufCache = new Map();
export async function loadBuffer(url) {
  if (bufCache.has(url)) return bufCache.get(url);
  const c = audioCtx();
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  const buf = await c.decodeAudioData(arr);
  bufCache.set(url, buf);
  return buf;
}

// Play a buffer through a "radio" band-pass filter.
export function playRadio(buf, { gain = 1.4, when = 0 } = {}) {
  const c = audioCtx();
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 450;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2800;
  const shaper = c.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 2.2); }
  shaper.curve = curve;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(hp).connect(lp).connect(shaper).connect(g).connect(out());
  src.start(c.currentTime + when);
  return src;
}
