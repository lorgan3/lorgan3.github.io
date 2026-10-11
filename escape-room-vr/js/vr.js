import { Engine } from './engine.js';
import { loadFonts } from './tex.js';
import { adventureFromUrl } from './adventures.js';
import { buildSubmarine } from './scenes/submarine.js';
import { buildHelicopter } from './scenes/helicopter.js';
import { audioCtx } from './audio.js';

const adv = adventureFromUrl();
if (!adv) location.href = 'index.html';
const $ = (s) => document.querySelector(s);
document.title = `VR-omgeving · ${adv.title}`;

await loadFonts([
  ['LCD', 'assets/fonts/lcd.ttf'],
  ['Stencil', 'assets/fonts/stencil.otf'],
]);

const engine = new Engine($('#stage'));
window.__engine = engine; // handy for debugging from the console
const ui = {
  exit() {
    engine.closePanel(true);
    if (engine.renderer.xr.isPresenting) engine.renderer.xr.getSession().end();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    document.body.classList.remove('cardboard', 'screen');
    engine.mode = 'screen';
    engine.useGyro = false;
    engine.resize();
    $('#startScreen').hidden = false;
  },
};

const build = adv.id === 'submarine' ? buildSubmarine : buildHelicopter;
const game = build(engine, ui);
engine.onExitXR = () => ui.exit();

$('#loading').remove();
$('#startScreen').hidden = false;
$('#startScreen').style.setProperty('--bg', `url(${new URL(adv.background, location.href)})`);
$('#advLogo').src = adv.logo;
$('#resumeNote').hidden = !hasProgress(game.state);

if (navigator.xr) {
  navigator.xr.isSessionSupported('immersive-vr').then((ok) => { $('#modeXR').hidden = !ok; }).catch(() => {});
}

function begin(mode) {
  audioCtx();
  engine.onStart && engine.onStart();
  $('#startScreen').hidden = true;
  document.body.classList.remove('cardboard', 'screen');
  if (mode !== 'xr') document.body.classList.add(mode);
}

$('#modeCardboard').addEventListener('click', async () => {
  begin('cardboard');
  await engine.enterCardboard();
});
$('#modeScreen').addEventListener('click', async () => {
  begin('screen');
  // Phones and tablets look around by moving the device; desktops drag with the mouse.
  const touch = matchMedia('(pointer: coarse)').matches;
  await engine.enterScreen(touch);
});
$('#modeXR').addEventListener('click', async () => {
  begin('xr');
  try { await engine.enterXR(); } catch (e) { alert('WebXR kon niet starten: ' + e.message); ui.exit(); }
});
$('#hudRecenter').addEventListener('click', (e) => { e.stopPropagation(); engine.recenter(); });
$('#hudExit').addEventListener('click', (e) => { e.stopPropagation(); ui.exit(); });
$('#resetLink').addEventListener('click', (e) => {
  e.preventDefault();
  if (!confirm('Weet je zeker dat je de VR-omgeving opnieuw wilt beginnen?')) return;
  ui.reset && ui.reset();
  $('#resumeNote').hidden = true;
});

// Keep the screen awake while playing.
let wakeLock = null;
async function keepAwake() {
  try {
    wakeLock = await navigator.wakeLock?.request('screen');
    wakeLock?.addEventListener('release', () => { wakeLock = null; });
  } catch (e) { wakeLock = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !wakeLock) keepAwake(); });
keepAwake();

function hasProgress(s) {
  return Object.entries(s).some(([k, v]) => {
    if (k === 'digits') return v.join('') !== '1000';
    if (k === 'battery') return false;
    if (Array.isArray(v)) return v.some((x) => x !== -1);
    return v === true;
  });
}
