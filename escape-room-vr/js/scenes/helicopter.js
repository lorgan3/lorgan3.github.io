import * as THREE from '../../vendor/three.module.js';
import { canvasPlane, noiseTex, roundRect } from '../tex.js';
import { mat, box, cyl, pipe, menuPanel } from '../build.js';
import { sfx, noiseLoop, morseLoop, loadBuffer, playRadio, audioCtx, noise } from '../audio.js';
import { loadState, saveState, clearState } from '../state.js';

const KEY = 'ertg-vr-behindenemylines';
const DEFAULTS = { digits: [1, 0, 0, 0], doorOpen: false };

// Frequencies the radio responds to.
const MORSE_FREQ = '328500';
const MORSE_CODE = '..-. -.. .- -...';
const VOICE_FREQ = '120800';

// Beacon light patterns (morse, one character each).
const BEACONS = [
  { code: '.-..', pos: [-14, -36], height: 16 },
  { code: '-..-', pos: [70, 22], height: 18 },
];

export function buildHelicopter(engine, ui) {
  const S = loadState(KEY, DEFAULTS);
  const save = () => saveState(KEY, S);
  const scene = engine.scene;
  scene.background = new THREE.Color(0xbcd3d8);
  scene.fog = new THREE.Fog(0xc9dcd9, 120, 900);

  scene.add(new THREE.HemisphereLight(0xeef6ff, 0x4b5a3a, 1.2));
  const sun = new THREE.DirectionalLight(0xfff2d8, 2.2);
  sun.position.set(-120, 200, -260);
  scene.add(sun);
  const cabinLight = new THREE.PointLight(0xfff0d0, 1.2, 5, 1.5);
  cabinLight.position.set(0, 1.9, 0.4);
  scene.add(cabinLight);

  buildWorld(scene);

  // ---------- fuselage ----------
  const olive = noiseTex(256, 256, '#59633f', 22, {
    repeat: [3, 3],
    extra: (ctx, w, h) => {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let x = 10; x < w; x += 40) for (let y = 10; y < h; y += 80) { ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); }
    },
  });
  const wallMat = new THREE.MeshStandardMaterial({ map: olive, roughness: 0.75, metalness: 0.25, side: THREE.DoubleSide });
  const darkMat = mat(0x2b2f25, { roughness: 0.8 });
  const floorTex = noiseTex(256, 256, '#4a4d48', 18, {
    repeat: [4, 6],
    extra: (ctx, w, h) => {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 3;
      for (let i = -h; i < w; i += 16) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke(); }
    },
  });
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.6, metalness: 0.5 });
  const parts = new THREE.Group();
  scene.add(parts);
  const slab = (x0, x1, y0, y1, z0, z1, m = wallMat) => {
    const b = box(x1 - x0, y1 - y0, z1 - z0, m, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], parts);
    engine.addBlocker(b);
    return b;
  };
  const T = 0.05;
  // Cabin floor and roof.
  slab(-1.1, 1.1, -T, 0, -0.8, 2.2, floorMat);
  slab(-1.1, 1.1, 2.1, 2.1 + T, -0.8, 2.2);
  // Rear wall.
  slab(-1.1, 1.1, 0, 2.1, 2.2, 2.2 + T);
  // Left wall with door opening z[-0.3, 1.1].
  slab(-1.1 - T, -1.1, 0, 2.1, -0.8, -0.3);
  slab(-1.1 - T, -1.1, 0, 2.1, 1.1, 2.2);
  slab(-1.1 - T, -1.1, 1.9, 2.1, -0.3, 1.1);
  // Right wall with window z[0.2, 1.0], y[1.1, 1.7].
  slab(1.1, 1.1 + T, 0, 2.1, -0.8, 0.2);
  slab(1.1, 1.1 + T, 0, 2.1, 1.0, 2.2);
  slab(1.1, 1.1 + T, 0, 1.1, 0.2, 1.0);
  slab(1.1, 1.1 + T, 1.7, 2.1, 0.2, 1.0);
  // Cockpit floor with chin window x[-0.9,-0.2], z[-2.9,-2.3].
  slab(-1.1, 1.1, -T, 0, -2.3, -0.8, floorMat);
  slab(-0.2, 1.1, -T, 0, -3.0, -2.3, floorMat);
  slab(-1.1, -0.9, -T, 0, -3.0, -2.3, floorMat);
  slab(-0.9, -0.2, -T, 0, -3.0, -2.9, floorMat);
  // Cockpit roof with skylight x[-0.7,0.7], z[-2.2,-1.2].
  slab(-1.1, 1.1, 2.1, 2.1 + T, -1.2, -0.8);
  slab(-1.1, -0.7, 2.1, 2.1 + T, -2.6, -1.2);
  slab(0.7, 1.1, 2.1, 2.1 + T, -2.6, -1.2);
  slab(-0.7, 0.7, 2.1, 2.1 + T, -2.6, -2.2);
  // Cockpit side walls with windows z[-2.4,-1.0], y[1.0,1.95].
  for (const sx of [-1, 1]) {
    const x0 = sx < 0 ? -1.1 - T : 1.1;
    const x1 = x0 + T;
    slab(x0, x1, 0, 1.0, -3.0, -0.8);
    slab(x0, x1, 1.95, 2.1, -2.6, -0.8);
    slab(x0, x1, 1.0, 1.95, -1.0, -0.8);
    slab(x0, x1, 1.0, 2.1, -3.0, -2.4);
  }
  // Lower nose wall with chin opening x[-0.9,-0.2], y[0.1,0.6].
  slab(-1.1, -0.9, 0, 0.8, -3.0 - T, -3.0);
  slab(-0.2, 1.1, 0, 0.8, -3.0 - T, -3.0);
  slab(-0.9, -0.2, 0, 0.1, -3.0 - T, -3.0);
  slab(-0.9, -0.2, 0.6, 0.8, -3.0 - T, -3.0);
  // Windscreen frame (open, with pillars).
  const frameMat = mat(0x48502f, { roughness: 0.6 });
  for (const x of [-1.08, 0, 1.08]) pipe([x, 0.8, -3.0], [x, 2.1, -2.6], 0.035, frameMat, parts);
  pipe([-1.1, 0.8, -3.0], [1.1, 0.8, -3.0], 0.035, frameMat, parts);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xaaccbb, transparent: true, opacity: 0.08, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false });
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.2, Math.hypot(1.3, 0.4)), glassMat);
  ws.position.set(0, 1.45, -2.8);
  ws.rotation.x = -Math.atan2(0.4, 1.3);
  parts.add(ws);
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), glassMat);
  sky.rotation.x = Math.PI / 2; sky.position.set(0, 2.1, -1.7);
  parts.add(sky);

  // Seats.
  const seatMat = mat(0x5f7a52, { roughness: 0.9 });
  for (const x of [-0.5, 0.5]) {
    box(0.55, 0.12, 0.5, seatMat, [x, 0.45, -1.7], parts);
    const back = box(0.55, 0.5, 0.12, seatMat, [x, 0.72, -1.42], parts);
    back.rotation.x = -0.15;
    box(0.08, 0.45, 0.08, darkMat, [x, 0.22, -1.7], parts);
  }
  // Cyclic stick in front of the left seat.
  pipe([-0.5, 0.05, -2.05], [-0.48, 0.75, -2.2], 0.025, darkMat, parts);
  const grip = cyl(0.04, 0.04, 0.16, darkMat, [-0.48, 0.82, -2.22], parts, 10);
  grip.rotation.x = -0.2;
  cyl(0.015, 0.015, 0.02, new THREE.MeshStandardMaterial({ color: 0xcc0000, emissive: 0x550000 }), [-0.48, 0.91, -2.23], parts, 8);
  // Pedals.
  for (const x of [-0.65, -0.35]) box(0.1, 0.03, 0.22, mat(0x777777, { metalness: 0.8 }), [x, 0.15, -2.55], parts).rotation.x = -0.5;
  // Cabin benches and cargo net.
  box(0.45, 0.45, 1.6, seatMat, [0.85, 0.22, 1.3], parts);
  const net = canvasPlane(2.0, 1.6, 512, 410, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#3b3a2c'; ctx.lineWidth = 5;
    for (let i = -h; i < w + h; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i, h); ctx.lineTo(i + h, 0); ctx.stroke(); }
  }, { transparent: true, side: THREE.DoubleSide });
  net.position.set(0, 1.1, 2.15); net.rotation.y = Math.PI;
  parts.add(net);
  cyl(0.07, 0.07, 0.45, mat(0xb01515), [0.95, 0.95, 2.05], parts, 12);

  // ---------- rotor (seen through the skylight and windows) ----------
  const rotor = new THREE.Group();
  rotor.position.set(0, 2.7, -1.5);
  scene.add(rotor);
  cyl(0.18, 0.22, 0.5, darkMat, [0, -0.3, 0], rotor, 16);
  cyl(0.25, 0.25, 0.15, darkMat, [0, 0, 0], rotor, 16);
  const bladeMat = mat(0x262a22, { roughness: 0.6 });
  const tipMat = mat(0xe0b020, { roughness: 0.6 });
  const blades = [
    { yaw: THREE.MathUtils.degToRad(-35), len: 6.5, droop: 0.12 },
    { yaw: THREE.MathUtils.degToRad(60), len: 6.5, droop: 0.22 },
    { yaw: THREE.MathUtils.degToRad(150), len: 6.5, droop: 0.1 },
    { yaw: THREE.MathUtils.degToRad(235), len: 1.6, droop: 0.05, broken: true },
  ];
  for (const b of blades) {
    const arm = new THREE.Group();
    arm.rotation.y = b.yaw;
    rotor.add(arm);
    const tilt = new THREE.Group();
    tilt.rotation.z = -b.droop;
    arm.add(tilt);
    box(b.len, 0.05, 0.36, bladeMat, [b.len / 2 + 0.2, 0, 0], tilt);
    if (!b.broken) {
      box(0.3, 0.055, 0.37, tipMat, [b.len - 0.2, 0, 0], tilt);
      box(0.15, 0.055, 0.37, tipMat, [b.len - 0.65, 0, 0], tilt);
    } else {
      // Jagged end.
      for (let i = 0; i < 4; i++) box(0.12 + Math.random() * 0.15, 0.05, 0.08, bladeMat, [b.len + 0.25, 0, -0.14 + i * 0.09], tilt);
    }
  }

  // ---------- door + binoculars ----------
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-1.12, 0, 1.1);
  scene.add(doorPivot);
  const door = box(0.05, 1.85, 1.4, wallMat, [0, 0.975, -0.7], doorPivot);
  const doorWin = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), new THREE.MeshStandardMaterial({ color: 0x223322, roughness: 0.2, metalness: 0.5 }));
  doorWin.position.set(0.03, 1.45, -0.7); doorWin.rotation.y = Math.PI / 2;
  doorPivot.add(doorWin);
  const handle = new THREE.Group();
  handle.position.set(0.08, 1.0, -1.25);
  doorPivot.add(handle);
  box(0.04, 0.05, 0.22, mat(0xb0b0b0, { metalness: 0.9 }), [0, 0, 0], handle);
  box(0.06, 0.12, 0.05, mat(0x888888, { metalness: 0.9 }), [-0.02, 0, 0.1], handle);
  engine.addBlocker(door);
  engine.addClickable(handle, () => toggleDoor());
  let doorAnim = S.doorOpen ? 1 : 0;

  const bino = new THREE.Group();
  bino.position.set(-1.02, 1.25, 1.45);
  scene.add(bino);
  const binoMat = mat(0x1d1f1b, { roughness: 0.5 });
  for (const dz of [-0.045, 0.045]) {
    cyl(0.035, 0.04, 0.16, binoMat, [0, 0, dz], bino, 14);
    cyl(0.038, 0.038, 0.01, mat(0x445566, { metalness: 0.9, roughness: 0.1 }), [0, -0.085, dz], bino, 14);
  }
  box(0.03, 0.05, 0.06, binoMat, [0, 0.02, 0], bino);
  pipe([-1.08, 1.48, 1.45], [-1.02, 1.33, 1.45], 0.006, mat(0x6b4a2a), scene);
  const binoHit = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.26, 0.26), new THREE.MeshBasicMaterial({ visible: false }));
  bino.add(binoHit);
  engine.addClickable(bino, () => openBinoculars());

  // ---------- radio ----------
  const radio = new THREE.Group();
  radio.position.set(0, 0.92, -1.05);
  radio.rotation.x = -0.75;
  scene.add(radio);
  const consoleBox = box(0.46, 0.62, 0.42, darkMat, [0, 0.31, -1.2], scene);
  engine.addBlocker(consoleBox);
  box(0.78, 0.46, 0.08, mat(0x1e1c15), [0, 0, -0.045], radio);
  const RADIO_W = 1024; const RADIO_H = 576;
  const radioScreen = canvasPlane(0.74, 0.74 * RADIO_H / RADIO_W, RADIO_W, RADIO_H, () => {});
  radio.add(radioScreen);
  engine.addClickable(radioScreen, (hit) => radioPress(hit.uv, false), { region: (hit) => radioRegionId(hit.uv, false) });
  let txActive = null; // { kind, stop }

  // Battery compartment next to the radio.
  const comp = new THREE.Group();
  comp.position.set(0.42, 0.62, -1.0);
  comp.rotation.y = -0.4;
  scene.add(comp);
  box(0.3, 0.3, 0.2, mat(0x2a2c22), [0, 0, -0.08], comp);
  const compFace = canvasPlane(0.28, 0.28, 512, 512, drawBatteries);
  compFace.position.z = 0.025;
  comp.add(compFace);
  engine.addClickable(compFace, () => openBatteries());

  // ---------- dashboard ----------
  const dash = new THREE.Group();
  dash.position.set(0, 0.74, -2.55);
  dash.rotation.x = -0.45;
  scene.add(dash);
  box(2.0, 0.5, 0.25, darkMat, [0, 0, -0.13], dash);
  const DASH_W = 2048; const DASH_H = 512;
  const dashFace = canvasPlane(1.96, 0.49, DASH_W, DASH_H, () => {});
  dashFace.position.z = 0.002;
  dash.add(dashFace);
  engine.addClickable(dashFace, () => openDash());
  box(0.5, 0.5, 0.4, darkMat, [0, 0.25, -2.55], scene);

  // Menu plate on the rear wall.
  const menuPlate = canvasPlane(0.34, 0.12, 256, 90, (ctx, w, h) => {
    ctx.fillStyle = '#d4a017'; roundRect(ctx, 0, 0, w, h, 14); ctx.fill();
    ctx.fillStyle = '#111'; ctx.font = 'bold 50px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('MENU', w / 2, h / 2 + 2);
  });
  menuPlate.position.set(-0.5, 0.75, -0.73);
  scene.add(menuPlate);
  box(0.4, 0.18, 0.03, darkMat, [-0.5, 0.75, -0.75], scene);
  engine.addClickable(menuPlate, () => openMenu());

  // ---------- beacons ----------
  const beaconLamps = BEACONS.map((b) => {
    const [x, z] = b.pos;
    const y = terrainHeight(x, z);
    const tower = latticeTower(b.height);
    tower.position.set(x, y, z);
    scene.add(tower);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffeeaa }));
    lamp.position.set(x, y + b.height + 0.5, z);
    scene.add(lamp);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xffe6a0, transparent: true, depthWrite: false, fog: false }));
    glow.scale.setScalar(8);
    glow.position.copy(lamp.position);
    scene.add(glow);
    return { lamp, glow, timeline: morseTimeline(b.code) };
  });

  // ---------- audio ----------
  let wind = null;
  engine.onStart = () => {
    audioCtx();
    if (!wind) wind = noiseLoop({ gain: 0.06, filter: 'bandpass', freq: 500, q: 0.4 });
  };
  let voiceBuf = null;
  loadBuffer('assets/audio/radio_voice.m4a').then((b) => { voiceBuf = b; }).catch(() => {});

  // ---------- logic ----------
  function toggleDoor() {
    S.doorOpen = !S.doorOpen;
    save();
    sfx.open();
  }

  function freqString() { return S.digits.join('') + '00'; }

  const radioLayout = {
    digit: (i) => ({ x: 330 + i * 112, y: 230, w: 100, h: 130 }),
    knob: { x: 860, y: 470, r: 62 },
  };

  function radioRegion(uv) {
    const x = uv.x * RADIO_W; const y = (1 - uv.y) * RADIO_H;
    for (let i = 0; i < 6; i++) {
      const d = radioLayout.digit(i);
      if (x >= d.x - 4 && x <= d.x + d.w + 4) {
        if (y >= 110 && y < 225) return { kind: 'up', i };
        if (y > 365 && y <= 470) return { kind: 'down', i };
      }
    }
    const k = radioLayout.knob;
    if (Math.hypot(x - k.x, y - k.y) < k.r + 25) return { kind: 'send' };
    return null;
  }

  function radioRegionId(uv, inZoom) {
    const r = radioRegion(uv);
    if (r && (r.kind === 'send' || r.i < 4)) return r.kind + (r.i ?? '');
    return inZoom ? null : 'zoom';
  }

  function radioPress(uv, inZoom) {
    const r = radioRegion(uv);
    if (!r || ((r.kind === 'up' || r.kind === 'down') && r.i >= 4)) {
      if (!inZoom) openRadioZoom();
      return;
    }
    if (r.kind === 'send') { sfx.press(); transmit(); return; }
    sfx.click();
    S.digits[r.i] = (S.digits[r.i] + (r.kind === 'up' ? 1 : 9)) % 10;
    save();
    stopTx();
  }

  function stopTx() {
    if (txActive) { txActive.stop(); txActive = null; }
  }

  function transmit() {
    stopTx();
    const f = freqString();
    if (f === MORSE_FREQ) {
      const hiss = noiseLoop({ gain: 0.02, filter: 'bandpass', freq: 2200, q: 0.3 });
      const stopMorse = morseLoop(MORSE_CODE, { unit: 0.14, freq: 780, gain: 0.16, gapAfter: 2.6 });
      txActive = { kind: 'morse', stop: () => { stopMorse(); hiss.stop(); } };
    } else if (f === VOICE_FREQ) {
      const hiss = noiseLoop({ gain: 0.025, filter: 'bandpass', freq: 2000, q: 0.3 });
      let stopped = false;
      let src = null;
      let timer = null;
      const loop = () => {
        if (stopped) return;
        if (voiceBuf) {
          src = playRadio(voiceBuf);
          timer = setTimeout(loop, (voiceBuf.duration + 2.5) * 1000);
        } else {
          speakFallback();
          timer = setTimeout(loop, 7000);
        }
      };
      loop();
      txActive = { kind: 'voice', stop: () => { stopped = true; clearTimeout(timer); try { src && src.stop(); } catch (e) { /* ended */ } hiss.stop(); } };
    } else {
      noise(1.6, { freq: 2500, q: 0.3, gain: 0.12 });
      txActive = { kind: 'static', stop: () => {} };
      setTimeout(() => { if (txActive && txActive.kind === 'static') txActive = null; }, 1600);
    }
  }

  function speakFallback() {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance('Delta. Bravo. Alfa. Charlie.');
    u.lang = 'en-GB';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }

  function liveZoom(src, w, h, width, onClick, region) {
    const mesh = canvasPlane(width, width * h / w, w, h, () => {});
    const update = () => { mesh.userData.ct.ctx.drawImage(src.userData.ct.canvas, 0, 0); mesh.userData.ct.tex.needsUpdate = true; };
    update();
    const stop = engine.onTick(update);
    let handler = null;
    if (onClick) { handler = (uv) => onClick(uv); handler.dwell = true; handler.region = region; }
    engine.openPanel(mesh, { onClick: handler, onClose: stop, distance: 0.95 });
  }

  function openRadioZoom() {
    liveZoom(radioScreen, RADIO_W, RADIO_H, 0.95, (uv) => radioPress(uv, true), (hit) => radioRegionId(hit.uv, true));
  }

  function openDash() { liveZoom(dashFace, DASH_W, DASH_H, 1.3); }

  function openBatteries() {
    const mesh = canvasPlane(0.7, 0.7, 512, 512, drawBatteries);
    engine.openPanel(mesh);
  }

  function openBinoculars() {
    engine.openLiveView({
      fov: 9,
      mask: 'binocular',
      position: () => { const p = new THREE.Vector3(); engine.viewPose(p, new THREE.Vector3()); return p; },
      hud: (ctx, w, h) => {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '22px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('kijk omlaag of tik om te sluiten', w / 2, h * 0.86);
      },
    });
  }

  function openMenu() {
    const close = () => engine.closePanel();
    const { mesh, onClick } = menuPanel('BEHIND ENEMY LINES', [
      { label: 'Verder spelen', action: close },
      { label: 'Centreer blikrichting', action: () => { engine.recenter(); close(); } },
      { label: 'Radio terugzetten', action: () => { stopTx(); S.digits = [...DEFAULTS.digits]; save(); close(); } },
      ...engine.viewMenuItems(),
      { label: 'Stoppen', danger: true, action: () => ui.exit() },
    ]);
    engine.openPanel(mesh, { onClick });
  }

  ui.reset = () => { stopTx(); clearState(KEY); Object.assign(S, structuredClone(DEFAULTS)); };

  // ---------- drawing ----------
  function drawRadio(ctx, w, h) {
    ctx.fillStyle = '#2b281d'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#383425'; roundRect(ctx, 10, 10, w - 20, h - 20, 26); ctx.fill();
    for (const [x, y] of [[40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40]]) { ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill(); }
    // Speaker block.
    const g = ctx.createLinearGradient(40, 0, 290, 0);
    g.addColorStop(0, '#9c9579'); g.addColorStop(1, '#d4cdb0');
    ctx.fillStyle = g; roundRect(ctx, 40, 110, 250, 400, 14); ctx.fill();
    const lit = txActive && txActive.kind !== 'static' ? 0.6 + 0.4 * Math.sin(engine.time * 9) : 0.15;
    ctx.fillStyle = '#222'; ctx.fillRect(74, 146, 182, 72);
    ctx.fillStyle = `rgba(255,170,30,${lit})`; ctx.fillRect(82, 154, 166, 56);
    for (let i = 0; i < 8; i++) {
      const y = 250 + i * 30;
      ctx.fillStyle = '#7d775f'; ctx.fillRect(70, y, 190, 16);
      ctx.fillStyle = '#e9e3c8'; ctx.fillRect(70, y, 190, 6);
    }
    // Digits.
    const f = freqString();
    for (let i = 0; i < 6; i++) {
      const d = radioLayout.digit(i);
      const active = i < 4;
      ctx.fillStyle = '#121519'; roundRect(ctx, d.x, d.y, d.w, d.h, 8); ctx.fill();
      ctx.fillStyle = '#ffb21c'; ctx.font = '112px LCD, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ff9a00'; ctx.shadowBlur = 12;
      ctx.fillText(f[i], d.x + d.w / 2, d.y + d.h / 2 + 6);
      ctx.shadowBlur = 0;
      ctx.fillStyle = active ? '#e8a21c' : '#77735e';
      tri(ctx, d.x + d.w / 2, 168, 46, true);
      tri(ctx, d.x + d.w / 2, 418, 46, false);
    }
    // Signal bar.
    ctx.fillStyle = '#5a5640'; ctx.fillRect(330, 448, 400, 46);
    let sig = 0.12;
    if (txActive) sig = txActive.kind === 'static' ? 0.2 + Math.random() * 0.2 : 0.75 + 0.2 * Math.sin(engine.time * 3);
    ctx.fillStyle = '#ffc94a'; ctx.fillRect(330, 448, 400 * sig, 46);
    // Knob.
    const k = radioLayout.knob;
    ctx.fillStyle = '#3d3a2c'; roundRect(ctx, k.x - 92, k.y - 92, 184, 184, 14); ctx.fill();
    const kg = ctx.createRadialGradient(k.x - 20, k.y - 20, 10, k.x, k.y, k.r);
    kg.addColorStop(0, '#8a8a8a'); kg.addColorStop(1, '#2b2b2b');
    ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(k.x, k.y, k.r, 0, 7); ctx.fill();
    ctx.strokeStyle = '#ddd'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(k.x, k.y + 4, 26, -Math.PI / 2 + 0.7, -Math.PI / 2 - 0.7 + Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(k.x, k.y - 30); ctx.lineTo(k.x, k.y - 4); ctx.stroke();
    void h;
  }

  function drawDash(ctx, w, h) {
    ctx.fillStyle = '#23261f'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2d3128'; roundRect(ctx, 8, 8, w - 16, h - 16, 20); ctx.fill();
    const gauge = (x, y, r, drawInner, label) => {
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x, y, r + 14, 0, 7); ctx.fill();
      ctx.fillStyle = '#0c0d0c'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.save(); drawInner(x, y, r); ctx.restore();
      if (label) { ctx.fillStyle = '#c9c9b0'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, x, y + r + 46); }
    };
    const ticks = (x, y, r, n, a0, a1, labels) => {
      ctx.strokeStyle = '#eee'; ctx.fillStyle = '#eee'; ctx.lineWidth = 3; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= n; i++) {
        const a = a0 + (a1 - a0) * i / n;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.85); ctx.lineTo(x + Math.cos(a) * r * 0.97, y + Math.sin(a) * r * 0.97); ctx.stroke();
        if (labels && labels[i] !== undefined && labels[i] !== '') ctx.fillText(labels[i], x + Math.cos(a) * r * 0.68, y + Math.sin(a) * r * 0.68);
      }
    };
    const needle = (x, y, r, a, color = '#fff') => {
      ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); ctx.stroke();
      ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
    };
    const cy = 220;
    // Clock (stopped).
    gauge(190, cy, 120, (x, y) => {
      ctx.fillStyle = '#1a0f0a'; roundRect(ctx, x - 108, y - 44, 216, 88, 8); ctx.fill();
      ctx.fillStyle = '#ff3b2a'; ctx.font = '62px LCD, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ff3b2a'; ctx.shadowBlur = 10;
      ctx.fillText('17:35:50', x, y + 4);
      ctx.shadowBlur = 0;
    }, 'KLOK');
    // Compass.
    gauge(490, cy, 120, (x, y, r) => {
      const hd = -0.4;
      ctx.translate(x, y); ctx.rotate(hd);
      ctx.fillStyle = '#eee'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      [['N', 0], ['O', Math.PI / 2], ['Z', Math.PI], ['W', -Math.PI / 2]].forEach(([l, a]) => ctx.fillText(l, Math.sin(a) * r * 0.72, -Math.cos(a) * r * 0.72));
      ctx.rotate(-hd);
      ctx.fillStyle = '#e8a21c'; ctx.beginPath(); ctx.moveTo(0, -r * 0.5); ctx.lineTo(14, 20); ctx.lineTo(-14, 20); ctx.fill();
    }, 'KOMPAS');
    // Fuel.
    gauge(790, cy, 120, (x, y, r) => {
      const a0 = Math.PI * 0.8; const a1 = Math.PI * 2.2;
      ticks(x, y, r, 10, a0, a1, ['0', '', '4', '', '8', '', '12', '', '16', '', '20']);
      needle(x, y, r, a0 + (a1 - a0) * (1210 / 2000));
      ctx.fillStyle = '#111'; roundRect(ctx, x - 70, y + 34, 140, 48, 6); ctx.fill();
      ctx.fillStyle = '#7dff7a'; ctx.font = '36px LCD, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('1210 kg', x, y + 60);
      ctx.fillStyle = '#aaa'; ctx.font = '18px sans-serif'; ctx.fillText('x100 kg', x, y - 34);
    }, 'BRANDSTOF');
    // Wind meter: Beaufort scale plus a direction indicator relative to the helicopter.
    gauge(1100, cy, 120, (x, y, r) => {
      const a0 = Math.PI * 0.75; const a1 = Math.PI * 2.25;
      ticks(x, y, r, 12, a0, a1, ['0', '', '2', '', '4', '', '6', '', '8', '', '10', '', '12']);
      needle(x, y, r, a0 + (a1 - a0) * (6 / 12), '#ffcc33');
      // Helicopter silhouette (top view, nose up) with wind arrow coming from the tail.
      ctx.fillStyle = '#9fa58a';
      ctx.beginPath(); ctx.ellipse(x, y + 22, 12, 22, 0, 0, 7); ctx.fill();
      ctx.fillRect(x - 3, y + 40, 6, 30);
      ctx.strokeStyle = '#4fc3ff'; ctx.fillStyle = '#4fc3ff'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(x + 34, y + 80); ctx.lineTo(x + 34, y - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 34, y - 22); ctx.lineTo(x + 24, y - 4); ctx.lineTo(x + 44, y - 4); ctx.fill();
    }, 'WIND');
    // Decorative instruments.
    gauge(1400, cy, 110, (x, y, r) => { ticks(x, y, r, 10, Math.PI * 0.75, Math.PI * 2.25, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '']); needle(x, y, r, Math.PI * 0.75 + 0.1); }, 'HOOGTE');
    gauge(1680, cy, 110, (x, y, r) => { ticks(x, y, r, 8, Math.PI * 0.75, Math.PI * 2.25); needle(x, y, r, Math.PI * 0.75); }, 'ROTOR RPM');
    // Warning lamps.
    const blink = Math.sin(engine.time * 5) > 0;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#300'; roundRect(ctx, 1860, 90 + i * 110, 120, 70, 8); ctx.fill();
      ctx.fillStyle = (i === 0 && blink) || i === 2 ? '#ff2a1a' : '#5a1210'; roundRect(ctx, 1870, 100 + i * 110, 100, 50, 6); ctx.fill();
    }
    void w; void h;
  }

  function drawBatteries(ctx, w, h) {
    ctx.fillStyle = '#1d1f19'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2e3127'; roundRect(ctx, 20, 20, w - 40, h - 40, 20); ctx.fill();
    const cols = [['#ff8a1c', '+'], ['#2a6dff', '-'], ['#9b3fd6', '+']];
    cols.forEach(([c, top], i) => {
      const x = 70 + i * 135; const y = 70; const bw = 100; const bh = 370;
      const g = ctx.createLinearGradient(x, 0, x + bw, 0);
      g.addColorStop(0, shade(c, -40)); g.addColorStop(0.4, c); g.addColorStop(1, shade(c, -60));
      ctx.fillStyle = g; roundRect(ctx, x, y + 40, bw, bh - 80, 10); ctx.fill();
      const capTop = top === '+' ? '#36b53c' : '#d23a24';
      const capBot = top === '+' ? '#d23a24' : '#36b53c';
      ctx.fillStyle = capTop; roundRect(ctx, x, y, bw, 50, 10); ctx.fill();
      ctx.fillStyle = capBot; roundRect(ctx, x, y + bh - 50, bw, 50, 10); ctx.fill();
      ctx.fillStyle = '#111'; ctx.font = 'bold 54px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(top === '+' ? '+' : '–', x + bw / 2, y + 27);
      ctx.fillText(top === '+' ? '–' : '+', x + bw / 2, y + bh - 23);
    });
    void h;
  }

  // ---------- per frame ----------
  engine.onTick((dt, t) => {
    drawRadio(radioScreen.userData.ct.ctx, RADIO_W, RADIO_H); radioScreen.userData.ct.tex.needsUpdate = true;
    if (Math.floor(t * 4) !== Math.floor((t - dt) * 4)) { drawDash(dashFace.userData.ct.ctx, DASH_W, DASH_H); dashFace.userData.ct.tex.needsUpdate = true; }
    const target = S.doorOpen ? 1 : 0;
    doorAnim += (target - doorAnim) * Math.min(1, dt * 3);
    doorPivot.rotation.y = doorAnim * 1.9; // swings outward
    for (const b of beaconLamps) {
      const on = b.timeline(t);
      b.lamp.material.color.set(on ? 0xfff2b0 : 0x3a3326);
      b.glow.visible = on;
    }
    if (wind) wind.gain.gain.value = 0.04 + 0.03 * (0.5 + 0.5 * Math.sin(t * 0.4) * Math.sin(t * 0.13));
  });
  drawDash(dashFace.userData.ct.ctx, DASH_W, DASH_H); dashFace.userData.ct.tex.needsUpdate = true;

  return { state: S };
}

// ---------- world ----------

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x, y) {
  const xi = Math.floor(x); const yi = Math.floor(y);
  const xf = x - xi; const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf); const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi); const b = hash(xi + 1, yi); const c = hash(xi, yi + 1); const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) {
  let s = 0; let a = 0.5; let f = 1;
  for (let i = 0; i < 5; i++) { s += a * vnoise(x * f, y * f); a *= 0.5; f *= 2.03; }
  return s;
}

function riverX(z) { return 70 * Math.sin((z + 60) / 85) - 25; }

export function terrainHeight(x, z) {
  // Valley with a winding river ahead (negative z), mountains around.
  const d = Math.abs(x - riverX(z));
  const valley = -75 + Math.pow(Math.max(0, Math.min(d, 320) - 25), 1.2) * 0.4 + fbm(x * 0.012, z * 0.012) * 70 - 20;
  const far = Math.max(0, (-z - 450) * 0.5);
  let h = valley + far;
  // The crash site sits on a ledge; in front of the helicopter the ground falls away steeply.
  const plateau = -0.2 + (fbm(x * 0.08, z * 0.08) - 0.5) * 1.2;
  const drop = Math.max(-8 - z, x < -60 ? -60 - x : 0, x > 22 ? x - 22 : 0);
  h = Math.max(h, plateau - drop * 2.6);
  if (drop <= 0) h = plateau;
  // Mountains behind the helicopter.
  if (z > 60) h = Math.max(h, (z - 60) * 0.9 + fbm(x * 0.01, z * 0.01) * 120);
  return h;
}

function buildWorld(scene) {
  const size = 1600; const seg = 220;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -400);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cGrass = new THREE.Color(0x5e7a3a); const cForest = new THREE.Color(0x3d5a2c); const cRock = new THREE.Color(0x8c8a7a); const cLow = new THREE.Color(0x6f8f4a);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i); const z = pos.getZ(i);
    const y = terrainHeight(x, z);
    pos.setY(i, y);
    const n = fbm(x * 0.05, z * 0.05);
    if (y > 60) tmp.copy(cForest).lerp(cRock, Math.min(1, (y - 60) / 120));
    else if (y < -80) tmp.copy(cLow).lerp(cGrass, n);
    else tmp.copy(cForest).lerp(cGrass, n);
    if (Math.hypot(x + 10, z - 5) < 50) tmp.copy(cGrass).lerp(cLow, n);
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  scene.add(ground);

  // River ribbon.
  const pts = [];
  for (let z = -40; z > -1200; z -= 10) {
    const x = riverX(z);
    const y = terrainHeight(x, z) + 0.8;
    pts.push(new THREE.Vector3(x, y, z));
  }
  const rv = [];
  const ri = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const next = pts[Math.min(i + 1, pts.length - 1)];
    const prev = pts[Math.max(i - 1, 0)];
    const dir = next.clone().sub(prev).setY(0).normalize();
    const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(14);
    rv.push(p.x + side.x, p.y, p.z + side.z, p.x - side.x, p.y, p.z - side.z);
    if (i < pts.length - 1) { const a = i * 2; ri.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const rgeo = new THREE.BufferGeometry();
  rgeo.setAttribute('position', new THREE.Float32BufferAttribute(rv, 3));
  rgeo.setIndex(ri);
  rgeo.computeVertexNormals();
  const river = new THREE.Mesh(rgeo, new THREE.MeshStandardMaterial({ color: 0x5aa6b8, roughness: 0.15, metalness: 0.4, side: THREE.DoubleSide }));
  scene.add(river);

  // Sky dome.
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vP; void main(){ float t = clamp(vP.y,0.0,1.0); vec3 c = mix(vec3(0.82,0.88,0.84), vec3(0.45,0.66,0.85), pow(t,0.6)); vec3 s = normalize(vec3(-0.3,0.45,-0.85)); float g = pow(max(dot(vP,s),0.0), 60.0); gl_FragColor = vec4(c + vec3(1.0,0.95,0.8)*g*0.8, 1.0); }',
  }));
  scene.add(sky);

  // Trees.
  const treeGeo = new THREE.ConeGeometry(1.4, 5, 7);
  treeGeo.translate(0, 2.5, 0);
  const treeMat = new THREE.MeshLambertMaterial({ color: 0x2f4a26 });
  const N = 900;
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, N);
  const m = new THREE.Matrix4();
  let n = 0;
  let seed = 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  while (n < N) {
    const x = -400 + rnd() * 800; const z = -700 + rnd() * 760;
    if (Math.hypot(x + 10, z - 5) < 22) continue;
    if (Math.abs(x - riverX(z)) < 22) continue;
    const y = terrainHeight(x, z);
    if (y > 120) continue;
    const s = 0.7 + rnd() * 1.4;
    m.makeScale(s, s * (0.8 + rnd() * 0.6), s).setPosition(x, y - 0.2, z);
    trees.setMatrixAt(n++, m);
  }
  scene.add(trees);

  // Pilot in the meadow outside the door: legs sticking out of the ground, branches forming a figure.
  const site = new THREE.Group();
  const sx = -30; const sz = 2;
  site.position.set(sx, terrainHeight(sx, sz), sz);
  // Face the helicopter (local +x ends up on the viewer's right).
  site.rotation.y = Math.PI / 2;
  scene.add(site);
  const trousers = new THREE.MeshLambertMaterial({ color: 0xd8d2b0 });
  const boot = new THREE.MeshLambertMaterial({ color: 0xc9935e });
  for (const dx of [-0.22, 0.22]) {
    const leg = cyl(0.09, 0.1, 0.55, trousers, [dx, 0.2, 0], site, 10);
    leg.rotation.z = dx * 0.4;
    const foot = box(0.14, 0.32, 0.14, boot, [dx * 1.25, 0.6, 0], site);
    foot.rotation.z = dx * 0.4;
  }
  const branch = new THREE.MeshLambertMaterial({ color: 0x6b4a2b });
  const stick = (x0, y0, x1, y1, r = 0.05) => pipe([x0, y0, -0.5], [x1, y1, -0.5], r, branch, site);
  // A "4" built from branches standing just behind the legs.
  stick(0.0, 2.25, -0.62, 0.85);
  stick(-0.66, 0.85, 0.85, 1.3);
  stick(0.2, 1.95, 0.05, 0.35);
  // A small fence and trees nearby.
  for (let i = 0; i < 6; i++) {
    const fx = -24; const fz = -8 + i * 2.2;
    const fy = terrainHeight(fx, fz);
    cyl(0.05, 0.05, 1.0, branch, [fx, fy + 0.5, fz], scene, 6);
    if (i < 5) pipe([fx, fy + 0.8, fz], [fx, terrainHeight(fx, fz + 2.2) + 0.8, fz + 2.2], 0.03, branch, scene);
  }
}

function latticeTower(h) {
  const g = new THREE.Group();
  const white = new THREE.MeshLambertMaterial({ color: 0x7c7c7c });
  const red = new THREE.MeshLambertMaterial({ color: 0xb02a1a });
  const w0 = 2.2; const w1 = 0.5;
  for (let s = 0; s < 4; s++) {
    const a = s * Math.PI / 2 + Math.PI / 4;
    const p0 = [Math.cos(a) * w0, 0, Math.sin(a) * w0];
    const p1 = [Math.cos(a) * w1, h, Math.sin(a) * w1];
    pipe(p0, p1, 0.08, white, g);
  }
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const y0 = h * i / steps; const y1 = h * (i + 1) / steps;
    const wA = w0 + (w1 - w0) * i / steps; const wB = w0 + (w1 - w0) * (i + 1) / steps;
    const m = i >= steps - 3 ? red : white;
    for (let s = 0; s < 4; s++) {
      const a = s * Math.PI / 2 + Math.PI / 4; const b = a + Math.PI / 2;
      pipe([Math.cos(a) * wA, y0, Math.sin(a) * wA], [Math.cos(b) * wB, y1, Math.sin(b) * wB], 0.04, m, g);
      pipe([Math.cos(a) * wB, y1, Math.sin(a) * wB], [Math.cos(b) * wB, y1, Math.sin(b) * wB], 0.04, m, g);
    }
  }
  return g;
}

let glowTexCache = null;
function glowTex() {
  if (glowTexCache) return glowTexCache;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,230,1)'); g.addColorStop(0.25, 'rgba(255,230,160,0.7)'); g.addColorStop(0.6, 'rgba(255,210,120,0.2)'); g.addColorStop(1, 'rgba(255,200,100,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  glowTexCache = new THREE.CanvasTexture(c);
  glowTexCache.colorSpace = THREE.SRGBColorSpace;
  return glowTexCache;
}

// Returns f(t) -> on/off for a looping morse pattern.
function morseTimeline(code) {
  const unit = 0.35;
  const segs = [];
  let t = 0;
  for (const ch of code) {
    const len = ch === '.' ? 1 : 3;
    segs.push([t, t + len * unit]);
    t += (len + 1) * unit;
  }
  const total = t + 6 * unit;
  return (now) => {
    const x = now % total;
    return segs.some(([a, b]) => x >= a && x < b);
  };
}

function tri(ctx, x, y, s, up) {
  ctx.beginPath();
  if (up) { ctx.moveTo(x, y - s / 2); ctx.lineTo(x + s * 0.62, y + s / 2); ctx.lineTo(x - s * 0.62, y + s / 2); }
  else { ctx.moveTo(x, y + s / 2); ctx.lineTo(x + s * 0.62, y - s / 2); ctx.lineTo(x - s * 0.62, y - s / 2); }
  ctx.closePath();
  ctx.fill();
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}
