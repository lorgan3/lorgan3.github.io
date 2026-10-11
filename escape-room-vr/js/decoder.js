import { adventureFromUrl } from './adventures.js';
import { KEYS, keySvg } from './keys.js';
import { SEALED } from './sealed.js';
import { sfx, tone, audioCtx } from './audio.js';
import { loadState, saveState, clearState } from './state.js';

const TOTAL = 60 * 60;
const PENALTY = 60;

const adv = adventureFromUrl();
if (!adv) location.href = 'index.html';
const sealed = SEALED[adv.id];
const KEY = `ertg-decoder-${adv.id}`;
const DEFAULTS = { startedAt: null, pausedAt: null, pausedTotal: 0, penalty: 0, part: 0, slots: [null, null, null, null], finishedAt: null, revealed: [] };
const S = loadState(KEY, DEFAULTS);
const save = () => saveState(KEY, S);

const $ = (sel) => document.querySelector(sel);
document.body.style.setProperty('--accent', adv.accent);
$('#logo').src = adv.logo;
$('#logo').alt = adv.title;
document.title = `Chrono Decoder · ${adv.title}`;

let selected = null;
let busy = false;

function fnv(s) {
  let h = 0x811c9dc5;
  for (const c of new TextEncoder().encode(s)) { h ^= c; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

function elapsed(now = Date.now()) {
  if (!S.startedAt) return 0;
  const end = S.finishedAt || now;
  const paused = S.pausedTotal + (S.pausedAt ? end - S.pausedAt : 0);
  return (end - S.startedAt - paused) / 1000;
}

function remaining() { return TOTAL - elapsed() - S.penalty; }

function fmt(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ---------- rendering ----------

function renderKeys() {
  const wrap = $('#keys');
  wrap.innerHTML = '';
  for (const k of KEYS) {
    const b = document.createElement('button');
    b.className = 'key' + (selected === k.id ? ' selected' : '');
    b.innerHTML = keySvg(k, { idSuffix: '-tray' });
    b.setAttribute('aria-label', `Sleutel ${k.id}`);
    b.addEventListener('click', () => {
      audioCtx();
      selected = selected === k.id ? null : k.id;
      sfx.click();
      renderKeys();
      renderZoom();
    });
    wrap.appendChild(b);
  }
}

function renderZoom() {
  const z = $('#zoom');
  if (!selected) { z.innerHTML = '<p class="muted">Tik op een sleutel om hem te vergroten, en daarna op een opening in de Chrono Decoder.</p>'; return; }
  const k = KEYS.find((x) => x.id === selected);
  z.innerHTML = keySvg(k, { idSuffix: '-zoom' });
}

function renderSlots() {
  const slots = document.querySelectorAll('.slot');
  slots.forEach((el, i) => {
    const id = S.slots[i];
    el.classList.toggle('filled', !!id);
    el.innerHTML = id ? keySvg(KEYS.find((k) => k.id === id), { idSuffix: `-slot${i}` }) : '<span class="keyhole"></span>';
  });
}

function renderProgress() {
  const lamps = document.querySelectorAll('.progress .lamp');
  lamps.forEach((l, i) => l.classList.toggle('on', i < S.part));
  $('#partLabel').textContent = S.part >= 3 ? 'ONTSNAPT' : `CODE ${S.part + 1} / 3`;
}

function renderTimer() {
  const r = remaining();
  $('#timer').textContent = fmt(r);
  $('#timer').classList.toggle('low', r < 300);
  $('#startBtn').hidden = !!S.startedAt;
  $('#pauseBtn').textContent = S.pausedAt ? 'Hervat' : 'Pauze';
  $('#pauseBtn').disabled = !S.startedAt || !!S.finishedAt;
  $('#pausedBanner').hidden = !S.pausedAt;
  updateHintBadge();
}

function updateHintBadge() {
  const avail = availableHints().length;
  $('#hintBtn').textContent = avail ? `Hints (${avail})` : 'Hints';
}

function availableHints() {
  if (!S.startedAt) return [];
  const minLeft = remaining() / 60;
  return sealed.hints.map(([m], i) => ({ m, i })).filter((h) => minLeft <= h.m);
}

// ---------- actions ----------

function placeIn(i) {
  audioCtx();
  if (busy || S.finishedAt) return;
  if (!S.startedAt) { flash('Druk eerst op START', 'info'); return; }
  if (S.pausedAt) { flash('De tijd staat op pauze', 'info'); return; }
  if (S.slots[i]) {
    S.slots[i] = null;
    sfx.click();
  } else if (selected) {
    S.slots[i] = selected;
    // Clear the selection so the same key can be picked again for the next opening.
    selected = null;
    renderKeys();
    renderZoom();
    tone(160, 0.08, { type: 'square', gain: 0.12 });
    tone(90, 0.12, { type: 'triangle', gain: 0.2, when: 0.04 });
  } else {
    flash('Kies eerst een sleutel', 'info');
    return;
  }
  save();
  renderSlots();
  if (S.slots.every(Boolean)) check();
}

function check() {
  busy = true;
  const guess = fnv(`${adv.id}|${S.part}|${S.slots.join(',')}`);
  setTimeout(() => {
    if (guess === sealed.codeHashes[S.part]) {
      sfx.good();
      S.part += 1;
      flash(S.part >= 3 ? 'ONTSNAPT!' : 'GOED!', 'good');
      if (S.part >= 3) S.finishedAt = Date.now();
      save();
      setTimeout(() => {
        S.slots = [null, null, null, null];
        selected = null;
        save();
        busy = false;
        renderAll();
        if (S.finishedAt) showVictory();
      }, 1600);
    } else {
      sfx.wrong();
      S.penalty += PENALTY;
      save();
      flash('FOUT  −1:00', 'bad');
      busy = false;
      renderTimer();
    }
    renderProgress();
  }, 500);
}

function flash(text, kind) {
  const el = $('#flash');
  el.textContent = text;
  el.className = `flash show ${kind}`;
  clearTimeout(flash.t);
  flash.t = setTimeout(() => { el.className = 'flash'; }, 1600);
}

function start() {
  audioCtx();
  S.startedAt = Date.now();
  save();
  tone(880, 0.15, { type: 'square', gain: 0.1 });
  tone(1320, 0.25, { type: 'square', gain: 0.1, when: 0.18 });
  renderAll();
}

function togglePause() {
  if (!S.startedAt || S.finishedAt) return;
  if (S.pausedAt) { S.pausedTotal += Date.now() - S.pausedAt; S.pausedAt = null; }
  else S.pausedAt = Date.now();
  save();
  renderTimer();
}

function showVictory() {
  const used = elapsed() + S.penalty;
  openDialog(`
    <h2>GEFELICITEERD!</h2>
    <p class="big">WIJ ZIJN ONTSNAPT!</p>
    <p>Resterende tijd: <b>${fmt(remaining())}</b><br>Gebruikte tijd: ${fmt(used)}</p>
    <p class="muted">Neem nu een foto van je team met jullie ontsnaptijd.</p>
    <button data-close>Sluiten</button>`);
}

function decode(b64) {
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function showHints() {
  const avail = new Set(availableHints().map((h) => h.i));
  const rows = sealed.hints.map(([m, text], i) => {
    if (S.revealed.includes(i)) return `<li class="revealed"><b>Hint ${i + 1}</b> <span class="muted">(${m} min)</span><p>${decode(text)}</p></li>`;
    if (avail.has(i)) return `<li><b>Hint ${i + 1}</b> <span class="muted">(${m} min)</span> <button data-reveal="${i}">Toon</button></li>`;
    return `<li class="locked"><b>Hint ${i + 1}</b> <span class="muted">beschikbaar bij ${m} min</span></li>`;
  }).join('');
  openDialog(`
    <h2>HINTS</h2>
    <p class="muted">Een hint komt vrij als de klok onder de aangegeven tijd komt. Tik pas op "Toon" als je echt vastzit.</p>
    <ul class="hints">${rows}</ul>
    <button data-close>Sluiten</button>`);
  $('#dialog').querySelectorAll('[data-reveal]').forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.reveal);
    if (!confirm(`Hint ${i + 1} bekijken?`)) return;
    S.revealed.push(i);
    save();
    showHints();
  }));
}

function showInfo() {
  openDialog(`
    <h2>WERKING DIGITALE CHRONO DECODER</h2>
    <p>Druk op START als jullie beginnen. Start de VR-omgeving en de Chrono Decoder tegelijk.</p>
    <p>Tik op een sleutel om hem te vergroten. Tik daarna op 1 van de 4 openingen in de Chrono Decoder om de sleutel daar te plaatsen. Een sleutel haal je er weer uit door erop te tikken.</p>
    <p>Zodra de vierde sleutel geplaatst is wordt de code gecontroleerd en klinkt er een 'goed' of 'fout' signaal. Een foute code kost 1 minuut.</p>
    <p>Bekijk de afbeeldingen van alle sleutels in de spelregels goed voordat je begint.</p>
    <button data-close>Sluiten</button>`);
}

function resetGame() {
  if (!confirm('Weet je zeker dat je de Chrono Decoder wilt resetten? De tijd en voortgang worden gewist.')) return;
  clearState(KEY);
  Object.assign(S, structuredClone(DEFAULTS));
  selected = null;
  renderAll();
}

function openDialog(html) {
  const d = $('#dialog');
  d.innerHTML = `<div class="dialog-inner">${html}</div>`;
  d.hidden = false;
  d.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => { d.hidden = true; }));
}

function renderAll() {
  renderKeys();
  renderZoom();
  renderSlots();
  renderProgress();
  renderTimer();
}

// ---------- wiring ----------

document.querySelectorAll('.slot').forEach((el, i) => el.addEventListener('click', () => placeIn(i)));
$('#startBtn').addEventListener('click', start);
$('#pauseBtn').addEventListener('click', togglePause);
$('#hintBtn').addEventListener('click', showHints);
$('#infoBtn').addEventListener('click', showInfo);
$('#resetBtn').addEventListener('click', resetGame);

let lastWhole = null;
setInterval(() => {
  renderTimer();
  const r = Math.ceil(remaining());
  if (S.startedAt && !S.pausedAt && !S.finishedAt && r !== lastWhole) {
    // Short beeps during the final minute.
    if (r <= 60 && r > 0) tone(1200, 0.05, { type: 'square', gain: 0.05 });
    if (r === 0) sfx.alarm(4);
  }
  lastWhole = r;
}, 250);

renderAll();
if (S.finishedAt) showVictory();
