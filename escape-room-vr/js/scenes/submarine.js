import * as THREE from '../../vendor/three.module.js';
import { canvasPlane, canvasTex, noiseTex, roundRect } from '../tex.js';
import { mat, box, cyl, pipe, menuPanel } from '../build.js';
import { sfx, tone, noiseLoop, audioCtx } from '../audio.js';
import { loadState, saveState, clearState } from '../state.js';

const KEY = 'ertg-vr-submarine';
const DEFAULTS = {
  restarted: false,
  phase2: false,
  buttons: [-1, -1, -1],
  mainMeasured: false,
  battery: [0, 2, 6, 1], // top, left, right, bottom
  batterySolved: false,
  surfaced: false,
};

const BTN_COLORS = [
  ['rood', '#e0262b'], ['oranje', '#ff8a1c'], ['geel', '#ffd51f'], ['groen', '#33c447'],
  ['blauw', '#2a7fff'], ['paars', '#9b3fd6'], ['wit', '#f4f4f4'],
];
// The bridge buttons light up in a colour; the target is checked by index.
const BTN_TARGET = [4, 3, 1];

const LAMP = { R: '#ff2a2a', G: '#4be04b', Y: '#ffd21f', B: '#2aa8ff' };
const LAMP_COMBOS = [['B', 'Y'], ['R', 'G'], ['G', 'B'], ['Y', 'B'], ['G', 'R'], ['Y', 'G'], ['R', 'Y']];
const LAMP_TARGET = [5, 1, 3, 4]; // top, left, right, bottom
const OPPOSITE = [3, 2, 1, 0]; // button on side i drives the lamps on the opposite side

const GAUGES = [
  ['LPRO', 1], ['RPRO', 6],
  ['VNT1', 2], ['VNT2', 1],
  ['VNT3', 2], ['VNT4', 5],
];

export function buildSubmarine(engine, ui) {
  const S = loadState(KEY, DEFAULTS);
  const save = () => saveState(KEY, S);
  let ping = 0;
  let restartFlash = 0;
  let ascent = -1; // -1 idle, 0..1 during ascent
  let alarmTimer = 0;
  const tankMsg = { 1: 0, 2: 0 };
  const scene = engine.scene;
  scene.background = new THREE.Color(0x02101a);
  scene.fog = new THREE.FogExp2(0x03243a, 0.055);

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight(0x9fb8c8, 0x202428, 0.5);
  scene.add(hemi);
  const lamps = [];
  for (const z of [-2.0, 0, 2.0]) {
    const l = new THREE.PointLight(0xfff1d6, 6, 7, 1.6);
    l.position.set(0, 3.3, z);
    scene.add(l);
    lamps.push(l);
  }
  const alarmLight = new THREE.PointLight(0xff1a1a, 0, 9, 1.4);
  alarmLight.position.set(0, 3.2, 0);
  scene.add(alarmLight);
  const windowLight = new THREE.PointLight(0x3aa0d0, 3, 6, 1.5);
  windowLight.position.set(0, 1.8, -3.0);
  scene.add(windowLight);

  // ---------- hull ----------
  const R = 2.4;
  const HC = 1.4; // hull centre height
  const L = 6.8;
  const hullTex = noiseTex(512, 512, '#56625f', 26, {
    repeat: [8, 3],
    extra: (ctx, w, h) => {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      for (let x = 16; x < w; x += 64) for (let y = 16; y < h; y += 64) { ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 3;
      for (let y = 0; y < h; y += 128) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    },
  });
  const hullMat = new THREE.MeshStandardMaterial({ map: hullTex, roughness: 0.6, metalness: 0.5, side: THREE.BackSide });
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 40, 1, true), hullMat);
  hull.rotation.x = Math.PI / 2;
  hull.position.y = HC;
  scene.add(hull);
  engine.addBlocker(hull);

  const ribMat = mat(0x3d4645, { metalness: 0.6, roughness: 0.4 });
  for (let z = -3; z <= 3; z += 1) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(R - 0.03, 0.05, 8, 48), ribMat);
    rib.position.set(0, HC, z);
    scene.add(rib);
  }

  const floorTex = noiseTex(256, 256, '#3a3f42', 20, {
    repeat: [6, 12],
    extra: (ctx, w, h) => {
      ctx.strokeStyle = '#1d2022';
      ctx.lineWidth = 6;
      for (let i = 0; i <= w; i += 32) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
    },
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4, L), new THREE.MeshStandardMaterial({ map: floorTex, metalness: 0.6, roughness: 0.5 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);
  engine.addBlocker(floor);

  // End caps. The front one has a round window.
  const capMat = new THREE.MeshStandardMaterial({ map: hullTex, roughness: 0.6, metalness: 0.5 });
  const WIN = { x: 0, y: 1.75, r: 0.78 };
  const frontShape = new THREE.Shape();
  frontShape.absarc(0, HC, R, 0, Math.PI * 2);
  const hole = new THREE.Path();
  hole.absarc(WIN.x, WIN.y, WIN.r, 0, Math.PI * 2, true);
  frontShape.holes.push(hole);
  const front = new THREE.Mesh(new THREE.ShapeGeometry(frontShape, 48), capMat);
  front.position.z = -L / 2;
  scene.add(front);
  engine.addBlocker(front);
  const back = new THREE.Mesh(new THREE.CircleGeometry(R, 48), capMat);
  back.position.set(0, HC, L / 2);
  back.rotation.y = Math.PI;
  scene.add(back);
  engine.addBlocker(back);

  const brass = mat(0xb08d3a, { metalness: 0.9, roughness: 0.35 });
  const winRing = new THREE.Mesh(new THREE.TorusGeometry(WIN.r, 0.07, 12, 64), brass);
  winRing.position.set(WIN.x, WIN.y, -L / 2 + 0.03);
  scene.add(winRing);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const bolt = cyl(0.025, 0.025, 0.04, brass, [WIN.x + Math.cos(a) * (WIN.r + 0.12), WIN.y + Math.sin(a) * (WIN.r + 0.12), -L / 2 + 0.03], scene, 8);
    bolt.rotation.x = Math.PI / 2;
  }
  const glass = new THREE.Mesh(new THREE.CircleGeometry(WIN.r, 48), new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1 }));
  glass.position.set(WIN.x, WIN.y, -L / 2 + 0.01);
  scene.add(glass);

  // Pipes for atmosphere.
  const pipeMat = mat(0x6b5a3a, { metalness: 0.7, roughness: 0.4 });
  const pipeMat2 = mat(0x8a2a22, { metalness: 0.5, roughness: 0.5 });
  pipe([1.4, 3.2, -3.3], [1.4, 3.2, 3.3], 0.06, pipeMat, scene);
  pipe([-1.4, 3.2, -3.3], [-1.4, 3.2, 3.3], 0.05, pipeMat2, scene);
  pipe([1.6, 2.95, -3.3], [1.6, 2.95, 3.3], 0.04, pipeMat, scene);
  pipe([-1.75, 2.8, -3.3], [-1.75, 2.8, 3.3], 0.035, pipeMat, scene);
  for (const z of [-2.0, 0, 2.0]) {
    const cage = cyl(0.12, 0.16, 0.12, mat(0x222222), [0, 3.62, z], scene, 12);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe2a0, emissiveIntensity: 1 }));
    bulb.position.set(0, 3.52, z);
    scene.add(bulb);
    bulb.userData.isBulb = true;
    lamps.push(bulb);
    cage.userData.cage = true;
  }

  // ---------- outside (underwater + surface) ----------
  const outside = new THREE.Group();
  scene.add(outside);
  const skyUniforms = { top: { value: new THREE.Color(0x0c3a5a) }, bottom: { value: new THREE.Color(0x010608) } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float t = clamp(vP.y*0.6+0.5,0.0,1.0); gl_FragColor = vec4(mix(bottom, top, t),1.0); }',
  }));
  outside.add(sky);

  const under = new THREE.Group();
  outside.add(under);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x3a3a34, roughness: 1, flatShading: true });
  const rnd = mulberry(7);
  for (let i = 0; i < 70; i++) {
    const s = 1 + rnd() * 4;
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), rockMat);
    const side = rnd() < 0.5 ? -1 : 1;
    rock.position.set(side * (4 + rnd() * 16), -6 + rnd() * 16, -6 - rnd() * 45);
    if (rnd() < 0.3) rock.position.set(-14 + rnd() * 28, -9 - rnd() * 4, -6 - rnd() * 40);
    if (rnd() < 0.15) rock.position.set(-14 + rnd() * 28, 9 + rnd() * 5, -6 - rnd() * 40);
    rock.scale.set(1, 0.6 + rnd(), 1);
    rock.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    under.add(rock);
  }
  // Marine snow / bubbles.
  const PN = 700;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PN * 3);
  for (let i = 0; i < PN; i++) { pPos[i * 3] = -10 + rnd() * 20; pPos[i * 3 + 1] = -6 + rnd() * 16; pPos[i * 3 + 2] = -4 - rnd() * 24; }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xbfe6ff, size: 0.06, transparent: true, opacity: 0.7 }));
  under.add(particles);
  // A slowly passing fish shape.
  const fish = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 6), new THREE.MeshStandardMaterial({ color: 0x556677, roughness: 0.8 }));
  fish.rotation.z = Math.PI / 2;
  under.add(fish);

  const surface = new THREE.Group();
  surface.visible = false;
  outside.add(surface);
  const seaTex = noiseTex(256, 256, '#1d5f86', 50, { repeat: [60, 60] });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: seaTex, color: 0x5aa8cc, roughness: 0.3, metalness: 0.2 }));
  sea.rotation.x = -Math.PI / 2;
  // Only in front of the hull: the sea is seen through the window, never inside.
  sea.position.set(0, 1.55, -L / 2 - 0.05 - 200);
  surface.add(sea);

  // ---------- bridge (front) ----------
  const deskMat = mat(0x2f3a3d, { metalness: 0.5, roughness: 0.5 });
  const desk = box(2.4, 0.9, 0.7, deskMat, [0, 0.45, -2.75], scene);
  engine.addBlocker(desk);
  const deskTop = box(2.4, 0.06, 0.8, mat(0x22292b), [0, 0.92, -2.72], scene);
  deskTop.rotation.x = 0.25;
  engine.addBlocker(deskTop);

  // Restart button sits on the desk behind the wheel.
  const restartBase = cyl(0.11, 0.12, 0.05, mat(0x1a1a1a), [0, 0.99, -2.85], scene);
  restartBase.rotation.x = 0.25;
  const restartBtn = cyl(0.075, 0.08, 0.06, new THREE.MeshStandardMaterial({ color: 0xc81e1e, emissive: 0x400000, roughness: 0.4 }), [0, 1.03, -2.86], scene);
  restartBtn.rotation.x = 0.25;
  const powerIcon = canvasPlane(0.1, 0.1, 128, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(w / 2, h / 2 + 6, 36, -Math.PI / 2 + 0.6, -Math.PI / 2 - 0.6 + Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, 20); ctx.lineTo(w / 2, 62); ctx.stroke();
  }, { transparent: true });
  powerIcon.position.set(0, 0.031, 0);
  powerIcon.rotation.x = -Math.PI / 2;
  restartBtn.add(powerIcon);
  engine.addClickable(restartBtn, () => tryRestart());

  // Steering wheel / yoke.
  const wheel = new THREE.Group();
  wheel.position.set(0, 1.18, -2.45);
  wheel.rotation.x = -0.35;
  scene.add(wheel);
  const wheelMat = mat(0x8c8c8c, { metalness: 0.8, roughness: 0.3 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 10, 48, Math.PI * 1.45), wheelMat);
  rim.rotation.z = -Math.PI * 0.225 - Math.PI / 2 + Math.PI;
  wheel.add(rim);
  for (const a of [Math.PI / 2 + 0.75, Math.PI / 2 - 0.75, -Math.PI / 2]) {
    const sp = box(0.03, 0.26, 0.02, wheelMat, [Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0], wheel);
    sp.rotation.z = a - Math.PI / 2;
  }
  const hub = cyl(0.06, 0.06, 0.05, mat(0x444444), [0, 0, 0], wheel);
  hub.rotation.x = Math.PI / 2;
  const column = cyl(0.03, 0.03, 0.5, wheelMat, [0, -0.1, -0.22], wheel);
  column.rotation.x = Math.PI / 2;
  let wheelSpin = 0;
  engine.addClickable(wheel, () => { wheelSpin = 1; sfx.clunk(); });

  // Sonar screen (left on desk).
  const sonarGroup = new THREE.Group();
  sonarGroup.position.set(-0.78, 1.25, -2.9);
  sonarGroup.rotation.x = -0.2;
  sonarGroup.rotation.y = 0.25;
  scene.add(sonarGroup);
  box(0.62, 0.62, 0.12, mat(0x1c2124), [0, 0, -0.07], sonarGroup);
  const sonarScreen = canvasPlane(0.56, 0.56, 512, 512, drawSonar, {});
  sonarGroup.add(sonarScreen);
  box(0.08, 0.35, 0.08, mat(0x1c2124), [-0.78, 0.98, -2.95], scene);
  engine.addClickable(sonarScreen, () => openZoom(drawSonar, 512, 512, 0.7, sonarScreen.userData.ct));

  // Three stacked buttons (right on desk).
  const btnPanel = new THREE.Group();
  btnPanel.position.set(0.78, 1.28, -2.9);
  btnPanel.rotation.x = -0.2;
  btnPanel.rotation.y = -0.25;
  scene.add(btnPanel);
  box(0.32, 0.72, 0.1, mat(0x1c2124), [0, 0, -0.06], btnPanel);
  box(0.08, 0.35, 0.08, mat(0x1c2124), [0.78, 0.98, -2.95], scene);
  const bridgeButtons = [0, 1, 2].map((i) => {
    const b = cyl(0.075, 0.08, 0.06, new THREE.MeshStandardMaterial({ color: 0x555555, emissive: 0x000000, roughness: 0.3 }), [0, 0.22 - i * 0.22, 0.01], btnPanel);
    b.rotation.x = Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.012, 8, 32), mat(0x999999, { metalness: 0.9 }));
    ring.position.set(0, 0.22 - i * 0.22, 0.0);
    btnPanel.add(ring);
    engine.addClickable(b, () => pressBridge(i));
    return b;
  });

  // Status screens above the window.
  const status = [];
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    g.position.set((i - 1) * 0.72, 2.95, -L / 2 + 0.06);
    scene.add(g);
    box(0.62, 0.42, 0.06, mat(0x15191b), [0, 0, -0.02], g);
    const scr = canvasPlane(0.56, 0.36, 512, 330, () => {}, {});
    scr.position.z = 0.012;
    g.add(scr);
    status.push(scr);
  }
  engine.addClickable(status[1], () => openZoom(drawStatusMid, 512, 330, 0.8, status[1].userData.ct));

  // ---------- ballast tanks (back) ----------
  const tankColors = { 2: 0x9b3fd6, H: 0xf2f2f2, 1: 0xff8a1c };
  const tanks = [
    { id: 2, label: 'BALLAST TANK 2', x: 0.9 },
    { id: 'H', label: 'HOOFD TANK', x: 0 },
    { id: 1, label: 'BALLAST TANK 1', x: -0.9 },
  ];
  const tankScreens = {};
  for (const t of tanks) {
    const g = new THREE.Group();
    g.position.set(t.x, 1.55, L / 2 - 0.35);
    g.rotation.y = Math.PI;
    scene.add(g);
    const bodyMat = mat(tankColors[t.id], { metalness: 0.3, roughness: 0.5 });
    const body = cyl(0.33, 0.33, 2.6, bodyMat, [0, -0.2, -0.25], g, 28);
    engine.addBlocker(body);
    cyl(0.36, 0.36, 0.08, mat(0x333333, { metalness: 0.8 }), [0, 0.9, -0.25], g);
    cyl(0.36, 0.36, 0.08, mat(0x333333, { metalness: 0.8 }), [0, -1.2, -0.25], g);
    const housing = box(0.62, 0.76, 0.14, mat(0x2a2e30, { metalness: 0.7, roughness: 0.4 }), [0, 0, 0.05], g);
    engine.addBlocker(housing);
    const scr = canvasPlane(0.52, 0.66, 400, 508, () => {}, {});
    scr.position.z = 0.125;
    g.add(scr);
    scr.userData.tank = t;
    tankScreens[t.id] = scr;
    engine.addClickable(scr, () => measureTank(t.id));
  }

  // ---------- emergency battery (left wall) ----------
  const batt = new THREE.Group();
  batt.position.set(-2.05, 1.5, -0.4);
  batt.rotation.y = Math.PI / 2;
  scene.add(batt);
  const battBack = box(1.0, 1.0, 0.25, mat(0x202325, { metalness: 0.6 }), [0, 0, -0.14], batt);
  engine.addBlocker(battBack);
  const battScreen = canvasPlane(0.9, 0.9, 1024, 1024, () => {}, {});
  batt.add(battScreen);
  pipe([-2.25, 0.0, -0.1], [-2.25, 1.0, -0.1], 0.06, pipeMat2, scene);
  pipe([-2.25, 0.0, -0.7], [-2.25, 1.0, -0.7], 0.06, pipeMat2, scene);
  engine.addClickable(battScreen, (hit) => pressBattery(hit.uv, false), { region: (hit) => battRegion(hit.uv, false) });

  // ---------- pressure gauges, binder, periscope (right side) ----------
  const gaugeGroup = new THREE.Group();
  gaugeGroup.position.set(2.05, 1.75, -0.7);
  gaugeGroup.rotation.y = -Math.PI / 2;
  scene.add(gaugeGroup);
  const gaugeBack = box(1.5, 0.6, 0.14, mat(0x2a2e30, { metalness: 0.6 }), [0, 0, -0.08], gaugeGroup);
  engine.addBlocker(gaugeBack);
  const gaugeScreen = canvasPlane(1.44, 0.54, 1024, 384, () => {}, {});
  gaugeGroup.add(gaugeScreen);
  engine.addClickable(gaugeScreen, () => openZoom(drawGauges, 1024, 384, 1.1, gaugeScreen.userData.ct));

  const shelf = box(0.45, 0.04, 0.9, mat(0x4a3b2a), [2.0, 0.95, 0.65], scene);
  engine.addBlocker(shelf);
  box(0.04, 0.5, 0.9, mat(0x4a3b2a), [2.2, 0.72, 0.65], scene);
  const binder = new THREE.Group();
  binder.position.set(1.98, 1.1, 0.65);
  scene.add(binder);
  const binderBody = box(0.28, 0.32, 0.08, mat(0x1d3d78), [0, 0, 0], binder);
  binderBody.rotation.y = Math.PI / 2;
  const spineFace = canvasPlane(0.08, 0.32, 64, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1d3d78'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ccc'; ctx.fillRect(10, 30, w - 20, 50);
    drawWheelIcon(ctx, w / 2, 160, 22, '#fff');
  });
  // The body is turned 90 degrees, so its local -z face looks towards the room.
  spineFace.position.set(0, 0, -0.041);
  spineFace.rotation.y = Math.PI;
  binderBody.add(spineFace);
  engine.addClickable(binder, () => openBinder(), { enabled: () => S.surfaced });
  engine.addClickable(binderBody, () => openBinder(), { enabled: () => S.surfaced });

  const peri = new THREE.Group();
  peri.position.set(1.0, 0, 1.0);
  scene.add(peri);
  const periMat = mat(0x707a7d, { metalness: 0.8, roughness: 0.3 });
  cyl(0.08, 0.08, 2.3, periMat, [0, 2.55, 0], peri);
  box(0.2, 0.22, 0.28, periMat, [0, 1.55, 0], peri);
  box(0.16, 0.08, 0.1, mat(0x111111), [0, 1.58, -0.17], peri);
  box(0.24, 0.04, 0.04, mat(0x222222), [-0.2, 1.48, 0], peri);
  box(0.24, 0.04, 0.04, mat(0x222222), [0.2, 1.48, 0], peri);
  engine.addClickable(peri, () => openPeriscope());

  // Menu plate on the desk front.
  const menuPlate = canvasPlane(0.34, 0.12, 256, 90, (ctx, w, h) => {
    ctx.fillStyle = '#d4a017'; roundRect(ctx, 0, 0, w, h, 14); ctx.fill();
    ctx.fillStyle = '#111'; ctx.font = 'bold 50px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('MENU', w / 2, h / 2 + 2);
  });
  menuPlate.position.set(0, 0.55, -2.395);
  scene.add(menuPlate);
  engine.addClickable(menuPlate, () => openMenu());

  // ---------- periscope world ----------
  const periScene = buildPeriscopeScene();

  // ---------- audio ----------
  let hum = null;
  engine.onStart = () => {
    audioCtx();
    if (!hum) {
      hum = noiseLoop({ gain: 0.05, filter: 'lowpass', freq: 160 });
    }
  };

  // ---------- state logic ----------

  function pressBridge(i) {
    sfx.press();
    S.buttons[i] = (S.buttons[i] + 1) % BTN_COLORS.length;
    save();
  }

  function tryRestart() {
    sfx.press();
    if (S.restarted) { sfx.clunk(); return; }
    const ok = S.buttons.every((b, i) => b === BTN_TARGET[i]);
    if (!ok) { sfx.wrong(); restartFlash = 1; return; }
    S.restarted = true;
    save();
    sfx.engineStart();
    setTimeout(() => sfx.good(), 1800);
    setTimeout(() => { if (!S.phase2) { S.phase2 = true; save(); sfx.alarm(4); } }, 9000);
  }

  function measureTank(id) {
    sfx.click();
    if (id === 'H') { S.mainMeasured = true; save(); }
    else { tankMsg[id] = 3; sfx.wrong(); }
    openZoom(null, 400, 508, 0.55, tankScreens[id].userData.ct);
  }

  const BATT_PX = 1024;
  const battLayout = () => {
    const k = BATT_PX / 326;
    return {
      k,
      buttons: [
        [120, 8, 205, 45], // top
        [8, 118, 45, 205], // left
        [281, 118, 318, 205], // right
        [120, 281, 205, 318], // bottom
      ].map((r) => r.map((v) => v * k)),
      lamps: [
        [[97, 25], [229, 25]],
        [[27, 97], [27, 233]],
        [[299, 97], [299, 231]],
        [[97, 301], [231, 301]],
      ].map((pair) => pair.map(([x, y]) => [x * k, y * k])),
      screen: [68 * k, 68 * k, 194 * k, 194 * k],
    };
  };

  // Region id for gaze dwell: a button index, 'screen' (opens zoom) or null (no dwell).
  function battRegion(uv, inZoom) {
    const x = uv.x * BATT_PX;
    const y = (1 - uv.y) * BATT_PX;
    const idx = battLayout().buttons.findIndex(([x0, y0, x1, y1]) => x >= x0 - 30 && x <= x1 + 30 && y >= y0 - 30 && y <= y1 + 30);
    if (idx >= 0) return 'b' + idx;
    return inZoom ? null : 'screen';
  }

  function pressBattery(uv, inZoom) {
    const x = uv.x * BATT_PX;
    const y = (1 - uv.y) * BATT_PX;
    const lay = battLayout();
    const idx = lay.buttons.findIndex(([x0, y0, x1, y1]) => x >= x0 - 30 && x <= x1 + 30 && y >= y0 - 30 && y <= y1 + 30);
    if (idx < 0) {
      if (!inZoom) openZoom(drawBattery, 1024, 1024, 0.9, battScreen.userData.ct, (u) => pressBattery(u, true), (hit) => battRegion(hit.uv, true));
      return;
    }
    sfx.press();
    if (!S.phase2 || S.batterySolved) return;
    const target = OPPOSITE[idx];
    S.battery[target] = (S.battery[target] + 1) % LAMP_COMBOS.length;
    if (S.battery.every((b, i) => b === LAMP_TARGET[i])) {
      S.batterySolved = true;
      setTimeout(() => sfx.good(), 300);
      setTimeout(() => startAscent(), 4000);
    }
    save();
  }

  function startAscent() {
    if (S.surfaced || ascent >= 0) return;
    ascent = 0;
    sfx.engineStart();
  }

  function openZoom(draw, w, h, width, liveCt, onClick, region) {
    const mesh = canvasPlane(width, width * h / w, w, h, () => {});
    const update = () => { mesh.userData.ct.ctx.drawImage(liveCt.canvas, 0, 0); mesh.userData.ct.tex.needsUpdate = true; };
    update();
    const stop = engine.onTick(update);
    const handler = onClick ? (uv) => onClick(uv) : null;
    if (handler) { handler.dwell = !!region; handler.region = region; }
    engine.openPanel(mesh, { onClick: handler, onClose: stop });
  }

  function openBinder() {
    const mesh = canvasPlane(0.6, 0.78, 600, 780, (ctx, w, h) => {
      ctx.fillStyle = '#f3efe2'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#c9c2ab';
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(34, 140 + i * 160, 14, 0, 7); ctx.fill(); }
      ctx.strokeStyle = '#d7d0bb'; ctx.lineWidth = 2;
      for (let y = 90; y < h; y += 34) { ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(w - 30, y); ctx.stroke(); }
      drawWheelIcon(ctx, w / 2 + 20, 270, 150, '#333');
      const bx = 130; const by = 530; const s = 80; const gap = 20;
      for (let i = 0; i < 4; i++) {
        const x = bx + i * (s + gap);
        ctx.strokeStyle = '#222'; ctx.lineWidth = 6; ctx.strokeRect(x, by, s, s);
        if (i === 1) {
          ctx.strokeStyle = '#c0161b'; ctx.lineWidth = 10; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(x + 14, by + 14); ctx.lineTo(x + s - 14, by + s - 14); ctx.moveTo(x + s - 14, by + 14); ctx.lineTo(x + 14, by + s - 14); ctx.stroke();
        }
      }
    });
    engine.openPanel(mesh);
  }

  function openPeriscope() {
    if (!S.surfaced) { sfx.clunk(); return; }
    engine.openLiveView({
      scene: periScene.scene,
      fov: 28,
      position: () => new THREE.Vector3(0, 3.2, 0),
      hud: drawPeriHud,
    });
  }

  function openMenu() {
    const close = () => engine.closePanel();
    const { mesh, onClick } = menuPanel('SUBMARINE', [
      { label: 'Verder spelen', action: close },
      { label: 'Ga naar deel 1', action: () => { jumpTo(1); close(); } },
      { label: 'Ga naar deel 2', action: () => { jumpTo(2); close(); } },
      { label: 'Ga naar deel 2 (boven water)', action: () => { jumpTo(3); close(); } },
      { label: 'Centreer blikrichting', action: () => { engine.recenter(); close(); } },
      ...engine.viewMenuItems(),
      { label: 'Stoppen', danger: true, action: () => ui.exit() },
    ]);
    engine.openPanel(mesh, { onClick });
  }

  function jumpTo(n) {
    Object.assign(S, structuredClone(DEFAULTS));
    if (n >= 2) { S.restarted = true; S.phase2 = true; }
    if (n >= 3) { S.batterySolved = true; S.surfaced = true; S.battery = [...LAMP_TARGET]; }
    ascent = -1;
    save();
  }

  ui.reset = () => { clearState(KEY); jumpTo(1); };

  // ---------- drawing ----------
  function drawSonar(ctx, w, h) {
    const t = engine.time;
    const cx = w / 2; const cy = h / 2; const r = w * 0.44;
    ctx.fillStyle = '#0b0d0e'; ctx.fillRect(0, 0, w, h);
    const bez = ctx.createLinearGradient(0, 0, w, h);
    bez.addColorStop(0, '#d9dde0'); bez.addColorStop(0.5, '#6b7276'); bez.addColorStop(1, '#c8cdd0');
    ctx.fillStyle = bez; ctx.beginPath(); ctx.arc(cx, cy, w * 0.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, 7); ctx.fill();
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      ctx.fillStyle = '#aaa'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * w * 0.47, cy + Math.sin(a) * w * 0.47, 5, 0, 7); ctx.fill();
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, '#3d6b17'); g.addColorStop(1, '#030701');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(140,255,80,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r - 4, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(140,255,80,0.12)';
    for (const f of [0.33, 0.66]) { ctx.beginPath(); ctx.arc(cx, cy, r * f, 0, 7); ctx.stroke(); }
    // Sweep.
    const sweep = t * 1.3;
    for (let i = 0; i < 40; i++) {
      const a = sweep - i * 0.02;
      ctx.strokeStyle = `rgba(150,255,90,${0.25 * (1 - i / 40)})`;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
    }
    // Faint background blips.
    const rb = mulberry(3);
    for (let i = 0; i < 9; i++) {
      const a = rb() * Math.PI * 2; const d = 0.2 + rb() * 0.7;
      const x = cx + Math.cos(a) * r * d; const y = cy + Math.sin(a) * r * d;
      const fade = ((sweep - a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      ctx.fillStyle = `rgba(120,230,70,${0.15 + 0.35 * Math.max(0, 1 - fade / 3)})`;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill();
    }
    // The bright pulsing contact.
    const ang = THREE.MathUtils.degToRad(45);
    const tx = cx + Math.sin(ang) * r * 0.72; const ty = cy - Math.cos(ang) * r * 0.72;
    const pulse = 0.5 + 0.5 * Math.sin(t * 4);
    ctx.shadowColor = '#b6ff6a'; ctx.shadowBlur = 25 + pulse * 20;
    ctx.fillStyle = `rgba(190,255,120,${0.75 + 0.25 * pulse})`;
    ctx.beginPath(); ctx.arc(tx, ty, 13 + pulse * 5, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
    // Ping sound when the sweep passes.
    const sweepNorm = ((sweep % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    if (ping > sweepNorm) sfx.sonarPing();
    ping = sweepNorm;
  }

  function drawStatusMid(ctx, w, h) {
    drawStatic(ctx, w, h, 0.9);
    if (S.restarted) {
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 12;
      // Same lean as key II's hole (paraR): top edge shifted right.
      roundedPoly(ctx, [[w * 0.32, h * 0.28], [w * 0.82, h * 0.28], [w * 0.68, h * 0.72], [w * 0.18, h * 0.72]], 14);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    if (restartFlash > 0) { ctx.fillStyle = `rgba(255,0,0,${restartFlash * 0.6})`; ctx.fillRect(0, 0, w, h); }
  }

  function drawStatusSide(ctx, w, h, which) {
    ctx.fillStyle = '#04130a'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(80,255,120,0.15)';
    for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.fillStyle = '#5dff7a'; ctx.font = '40px LCD, monospace'; ctx.textAlign = 'center';
    if (which === 0) {
      const depth = S.surfaced ? 0 : Math.round(312 * (ascent >= 0 ? 1 - ascent : 1));
      ctx.fillText('DIEPTE', w / 2, 70);
      ctx.font = '110px LCD, monospace';
      ctx.fillText(String(depth).padStart(3, '0') + 'm', w / 2, 210);
    } else {
      ctx.fillText('O2       CO2', w / 2, 70);
      const co2 = S.surfaced ? 0.92 : S.phase2 ? 0.75 : 0.55;
      ctx.fillStyle = '#5dff7a'; ctx.fillRect(110, 270 - 160 * 0.4, 70, 160 * 0.4);
      ctx.fillStyle = co2 > 0.7 ? '#ff4a3a' : '#ffd23a'; ctx.fillRect(330, 270 - 160 * co2, 70, 160 * co2);
      ctx.strokeStyle = '#5dff7a'; ctx.strokeRect(110, 110, 70, 160); ctx.strokeRect(330, 110, 70, 160);
    }
    if (!S.restarted && !S.phase2) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, w, h); }
  }

  function drawTank(ctx, w, h, t) {
    ctx.fillStyle = '#121416'; ctx.fillRect(0, 0, w, h);
    const x0 = 70; const x1 = w - 70; const y0 = 30; const y1 = h - 70;
    let air = null;
    if (t.id === 'H' && S.mainMeasured) air = 0.7;
    const anim = 0.5 + 0.18 * Math.sin(engine.time * 0.7 + (t.id === 1 ? 2 : 0));
    const split = air !== null ? air : (t.id === 'H' ? 0.5 + 0.05 * Math.sin(engine.time * 3) : anim);
    const ySplit = y0 + (y1 - y0) * split;
    ctx.fillStyle = '#45bf68'; ctx.fillRect(x0, y0, x1 - x0, ySplit - y0);
    ctx.fillStyle = '#3db6ea'; ctx.fillRect(x0, ySplit, x1 - x0, y1 - ySplit);
    // Icons.
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    drawFan(ctx, (x0 + x1) / 2, y0 + 50, 26);
    ctx.font = 'bold 34px sans-serif'; ctx.fillText('LUCHT', (x0 + x1) / 2, y0 + 105);
    drawDrop(ctx, (x0 + x1) / 2, y1 - 95, 24);
    ctx.fillText('WATER', (x0 + x1) / 2, y1 - 35);
    // Scales.
    ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2; ctx.font = '15px sans-serif';
    for (let i = 0; i <= 10; i++) {
      const y = y0 + (y1 - y0) * i / 10;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 + 12, y); ctx.stroke();
      ctx.fillText(String(100 - i * 10), x1 + 34, y);
    }
    // Label.
    ctx.save(); ctx.translate(36, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 24px sans-serif'; ctx.fillText(t.label, 0, 0); ctx.restore();
    // Level marker.
    if (air !== null) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc((x0 + x1) / 2, ySplit, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#111'; ctx.fillRect(x0 + 10, ySplit - 54, 150, 40);
      ctx.fillStyle = '#5dff7a'; ctx.font = '28px LCD, monospace'; ctx.textAlign = 'left';
      ctx.fillText('LUCHT 70%', x0 + 16, ySplit - 33);
      ctx.textAlign = 'center';
    }
    // Measure button / messages.
    ctx.fillStyle = '#333'; roundRect(ctx, w / 2 - 80, h - 58, 160, 46, 10); ctx.fill();
    ctx.fillStyle = '#ffd34d'; ctx.font = 'bold 26px sans-serif';
    let label = 'METEN';
    if (t.id !== 'H' && tankMsg[t.id] > 0) { label = 'STORING'; ctx.fillStyle = '#ff5a4a'; }
    ctx.fillText(label, w / 2, h - 34);
  }

  function drawBattery(ctx, w, h) {
    const lay = battLayout();
    const k = lay.k;
    ctx.fillStyle = '#0c0d0e'; ctx.fillRect(0, 0, w, h);
    // Corner tubes.
    ctx.strokeStyle = '#7d8084'; ctx.lineWidth = 34;
    for (const [cx, cy, a0] of [[68, 68, Math.PI], [258, 68, -Math.PI / 2], [258, 258, 0], [68, 258, Math.PI / 2]]) {
      ctx.beginPath(); ctx.arc(cx * k, cy * k, 34 * k, a0, a0 + Math.PI / 2); ctx.stroke();
    }
    ctx.lineWidth = 3; ctx.strokeStyle = '#55585c';
    for (const [cx, cy, a0] of [[68, 68, Math.PI], [258, 68, -Math.PI / 2], [258, 258, 0], [68, 258, Math.PI / 2]]) {
      for (let i = 0; i < 9; i++) {
        const a = a0 + (i + 0.5) / 9 * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(cx * k + Math.cos(a) * 25 * k, cy * k + Math.sin(a) * 25 * k); ctx.lineTo(cx * k + Math.cos(a) * 43 * k, cy * k + Math.sin(a) * 43 * k); ctx.stroke();
      }
    }
    // Modules.
    const modules = [[68, 0, 194, 62], [0, 68, 62, 194], [264, 68, 62, 194], [68, 264, 194, 62]];
    modules.forEach(([x, y, mw, mh]) => {
      const gr = ctx.createLinearGradient(x * k, y * k, (x + mw) * k, (y + mh) * k);
      gr.addColorStop(0, '#8d9196'); gr.addColorStop(1, '#5d6166');
      ctx.fillStyle = gr; roundRect(ctx, x * k, y * k, mw * k, mh * k, 10); ctx.fill();
    });
    lay.buttons.forEach(([x0, y0, x1, y1]) => {
      ctx.fillStyle = '#b9bcc0'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.strokeStyle = '#6d7075'; ctx.lineWidth = 6; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    });
    const active = S.phase2;
    lay.lamps.forEach((pair, side) => {
      const combo = LAMP_COMBOS[S.battery[side]];
      pair.forEach(([x, y], j) => {
        ctx.fillStyle = '#202224'; ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.fill();
        const col = active ? LAMP[combo[j]] : '#3a3c3e';
        if (active) { ctx.shadowColor = col; ctx.shadowBlur = 30; }
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 24, 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
      });
    });
    // Centre screen.
    const [sx, sy, sw, sh] = lay.screen;
    ctx.fillStyle = '#9a9ea3'; roundRect(ctx, sx, sy, sw, sh, 14); ctx.fill();
    ctx.fillStyle = active ? '#2a2c2e' : '#111'; ctx.fillRect(sx + 26, sy + 26, sw - 52, sh - 52);
    if (active) {
      const map = (x, y) => [sx + 26 + (x - 50) / 520 * (sw - 52), sy + 26 + (y - 50) / 520 * (sh - 52)];
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(...map(310, 50)); ctx.lineTo(...map(310, 570)); ctx.moveTo(...map(50, 310)); ctx.lineTo(...map(570, 310)); ctx.stroke();
      ctx.strokeStyle = '#8ee62e'; ctx.lineWidth = 9; ctx.shadowColor = '#8ee62e'; ctx.shadowBlur = S.batterySolved ? 30 : 12;
      batteryShape(ctx, map, (sw - 52) / 520);
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Code progress boxes.
      const bw = 52; const gap = 14; const total = 4 * bw + 3 * gap;
      for (let i = 0; i < 4; i++) {
        const bx = sx + sw / 2 - total / 2 + i * (bw + gap); const by = sy + sh - 26 - bw - 14;
        ctx.fillStyle = '#eee'; ctx.fillRect(bx, by, bw, bw);
        ctx.fillStyle = '#111'; ctx.font = 'bold 38px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(i === 0 && S.batterySolved ? 'I' : '?', bx + bw / 2, by + bw / 2 + 2);
      }
    }
  }

  function drawGauges(ctx, w, h) {
    ctx.fillStyle = '#1f2325'; ctx.fillRect(0, 0, w, h);
    const live = S.phase2;
    for (let u = 0; u < 3; u++) {
      const ux = 20 + u * 335;
      ctx.fillStyle = '#2d3236'; roundRect(ctx, ux, 16, 315, h - 32, 18); ctx.fill();
      ctx.strokeStyle = '#555c61'; ctx.lineWidth = 4; roundRect(ctx, ux, 16, 315, h - 32, 18); ctx.stroke();
      for (let d = 0; d < 2; d++) {
        const [label, value] = GAUGES[u * 2 + d];
        const cx = ux + 82 + d * 152; const cy = 175; const r = 66;
        ctx.fillStyle = '#c9ccce'; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, 7); ctx.fill();
        ctx.fillStyle = '#f2ecd9'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
        ctx.strokeStyle = '#222'; ctx.fillStyle = '#222'; ctx.lineWidth = 3; ctx.font = 'bold 17px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let i = 0; i <= 9; i++) {
          const a = Math.PI * 0.75 + i / 9 * Math.PI * 1.5;
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82); ctx.lineTo(cx + Math.cos(a) * r * 0.96, cy + Math.sin(a) * r * 0.96); ctx.stroke();
          ctx.fillText(String(i), cx + Math.cos(a) * r * 0.64, cy + Math.sin(a) * r * 0.64);
        }
        const v = live ? value + Math.sin(engine.time * 5 + u * 3 + d) * 0.04 : 0;
        const a = Math.PI * 0.75 + v / 9 * Math.PI * 1.5;
        ctx.strokeStyle = '#c01818'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8); ctx.stroke();
        ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, 7); ctx.fill();
        ctx.fillStyle = '#111'; roundRect(ctx, cx - 58, 268, 116, 44, 8); ctx.fill();
        ctx.fillStyle = '#ffd34d'; ctx.font = 'bold 30px sans-serif';
        ctx.fillText(label, cx, 291);
      }
      ctx.fillStyle = '#9aa3a8'; ctx.font = 'bold 22px sans-serif';
      ctx.fillText('DRUKMETER ' + (u + 1), ux + 157, 50);
    }
  }

  function drawPeriHud(ctx, w, h, yaw) {
    ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(w / 2, h * 0.3); ctx.lineTo(w / 2, h * 0.7); ctx.moveTo(w * 0.3, h / 2); ctx.lineTo(w * 0.7, h / 2); ctx.stroke();
    // Heading tape.
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(w * 0.2, h * 0.08, w * 0.6, 90);
    ctx.fillStyle = '#ffd34d'; ctx.strokeStyle = '#ffd34d'; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pxPerDeg = (w * 0.6) / 60;
    for (let d = Math.floor(yaw - 30); d <= yaw + 30; d++) {
      const x = w / 2 + (d - yaw) * pxPerDeg;
      const dn = ((d % 360) + 360) % 360;
      if (dn % 5 === 0) { ctx.beginPath(); ctx.moveTo(x, h * 0.08 + 60); ctx.lineTo(x, h * 0.08 + (dn % 10 === 0 ? 40 : 50)); ctx.stroke(); }
      if (dn % 10 === 0) ctx.fillText(String(dn), x, h * 0.08 + 24);
    }
    ctx.fillStyle = '#ff5a3a'; ctx.beginPath(); ctx.moveTo(w / 2, h * 0.08 + 92); ctx.lineTo(w / 2 - 14, h * 0.08 + 112); ctx.lineTo(w / 2 + 14, h * 0.08 + 112); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '22px sans-serif';
    ctx.fillText('kijk omlaag of tik om te sluiten', w / 2, h * 0.86);
  }

  // ---------- per-frame updates ----------
  const tmpCol = new THREE.Color();
  engine.onTick((dt, t) => {
    if (restartFlash > 0) restartFlash = Math.max(0, restartFlash - dt * 1.5);
    for (const k of [1, 2]) if (tankMsg[k] > 0) tankMsg[k] -= dt;

    sonarScreen.userData.ct.redraw();
    drawStatusMid(status[1].userData.ct.ctx, 512, 330); status[1].userData.ct.tex.needsUpdate = true;
    drawStatusSide(status[0].userData.ct.ctx, 512, 330, 0); status[0].userData.ct.tex.needsUpdate = true;
    drawStatusSide(status[2].userData.ct.ctx, 512, 330, 1); status[2].userData.ct.tex.needsUpdate = true;
    for (const id of [2, 'H', 1]) {
      const sc = tankScreens[id];
      drawTank(sc.userData.ct.ctx, 400, 508, sc.userData.tank); sc.userData.ct.tex.needsUpdate = true;
    }
    drawBattery(battScreen.userData.ct.ctx, 1024, 1024); battScreen.userData.ct.tex.needsUpdate = true;
    drawGauges(gaugeScreen.userData.ct.ctx, 1024, 384); gaugeScreen.userData.ct.tex.needsUpdate = true;

    // Bridge buttons.
    bridgeButtons.forEach((b, i) => {
      const idx = S.buttons[i];
      if (idx < 0) { b.material.color.set(0x555555); b.material.emissive.set(0x000000); }
      else { b.material.color.set(BTN_COLORS[idx][1]); b.material.emissive.set(BTN_COLORS[idx][1]); b.material.emissiveIntensity = 0.6; }
    });

    // Lighting by phase.
    const bright = S.restarted ? 1 : 0.18;
    const flicker = S.restarted ? 1 : (0.75 + 0.25 * Math.sin(t * 13) * Math.sin(t * 3.1));
    lamps.forEach((l) => {
      if (l.isLight) l.intensity = 6 * bright * flicker;
      else l.material.emissiveIntensity = bright * flicker;
    });
    hemi.intensity = S.restarted ? 0.55 : 0.18;
    const alarmOn = S.phase2 && !S.surfaced && ascent < 0 && !S.batterySolved;
    alarmLight.intensity = alarmOn ? 4 + 4 * Math.sin(t * 4) : 0;
    if (alarmOn) { alarmTimer += dt; if (alarmTimer > 20) { alarmTimer = 0; sfx.alarm(2); } }
    restartBtn.material.emissive.set(S.restarted ? 0x00ff44 : 0x400000);
    restartBtn.material.color.set(S.restarted ? 0x22aa44 : 0xc81e1e);

    if (wheelSpin > 0) { wheelSpin = Math.max(0, wheelSpin - dt * 1.5); wheel.rotation.z = Math.sin(wheelSpin * Math.PI * 2) * 0.4 * wheelSpin; }

    // Outside.
    let depthT = S.surfaced ? 1 : 0;
    if (ascent >= 0) {
      ascent += dt / 22;
      depthT = Math.min(1, ascent);
      engine.camera.position.x = (Math.random() - 0.5) * 0.004;
      if (ascent >= 1) {
        ascent = -1;
        S.surfaced = true;
        save();
        sfx.open();
        engine.camera.position.x = 0;
      }
    }
    under.visible = depthT < 1;
    surface.visible = depthT >= 1;
    const deep = new THREE.Color(0x0c3a5a); const shallow = new THREE.Color(0x6fc4ef);
    skyUniforms.top.value.copy(deep).lerp(shallow, depthT);
    skyUniforms.bottom.value.copy(new THREE.Color(0x010608)).lerp(new THREE.Color(0x1a6a98), depthT);
    if (depthT >= 1) { skyUniforms.top.value.set(0x4aa3e0); skyUniforms.bottom.value.set(0xcfe8f5); }
    scene.fog.color.copy(tmpCol.set(0x03243a).lerp(new THREE.Color(0x9cc8e0), depthT));
    scene.fog.density = depthT >= 1 ? 0.004 : 0.055 - 0.035 * depthT;
    windowLight.color.set(depthT >= 1 ? 0xfff4dd : 0x3aa0d0);
    windowLight.intensity = 3 + depthT * 5;
    under.position.y = -depthT * 40;
    const pos = pGeo.attributes.position.array;
    const speed = ascent >= 0 ? 6 : 0.15;
    for (let i = 0; i < PN; i++) {
      pos[i * 3 + 1] -= speed * dt * (ascent >= 0 ? -1 : 1) * 0.5;
      if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -6;
      if (pos[i * 3 + 1] < -6) pos[i * 3 + 1] = 10;
    }
    pGeo.attributes.position.needsUpdate = true;
    fish.position.set(-25 + ((t * 1.2) % 50), 2 + Math.sin(t * 0.3), -18);
    seaTex.offset.set(t * 0.01, t * 0.006);
    sea.position.y = 1.55 + Math.sin(t * 0.9) * 0.05;
    periScene.update(t);
  });

  return { state: S };
}

// ---------- helpers ----------

function batteryShape(ctx, map, s) {
  const cx = 318; const cy = 300; const r = 215;
  const P = (x, y) => map(x, y);
  const ang = (x, y) => Math.atan2(y - cy, x - cx);
  const [mcx, mcy] = P(cx, cy);
  ctx.beginPath();
  ctx.moveTo(...P(378, 94.4));
  ctx.arc(mcx, mcy, r * s, ang(378, 94.4), ang(432, 482), false);
  ctx.lineTo(...P(432, 365));
  ctx.lineTo(...P(198, 365));
  ctx.lineTo(...P(198, 478.4));
  ctx.arc(mcx, mcy, r * s, ang(198, 478.4), ang(255, 94.4) + Math.PI * 2, false);
  ctx.lineTo(...P(255, 192));
  ctx.lineTo(...P(378, 192));
  ctx.closePath();
  const [e1x, e1y] = P(256, 256); const [e2x, e2y] = P(376, 256);
  ctx.moveTo(e1x + 21 * s, e1y); ctx.arc(e1x, e1y, 21 * s, 0, Math.PI * 2);
  ctx.moveTo(e2x + 21 * s, e2y); ctx.arc(e2x, e2y, 21 * s, 0, Math.PI * 2);
}

function drawWheelIcon(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = r * 0.16;
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI * 0.3, Math.PI * 1.3, false); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, 7); ctx.fill();
  for (const a of [-Math.PI * 0.2, -Math.PI * 0.8, Math.PI / 2]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke();
  }
  ctx.restore();
}

function drawFan(ctx, x, y, r) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r + 8, 0, 7); ctx.fill();
  ctx.fillStyle = '#45bf68';
  for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI * 2 / 3); ctx.beginPath(); ctx.ellipse(0, -r * 0.5, r * 0.28, r * 0.5, 0.4, 0, 7); ctx.fill(); }
  ctx.restore();
}

function drawDrop(ctx, x, y, r) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r + 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#3db6ea';
  ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.8, 0, r * 0.55, r * 0.45); ctx.arc(0, r * 0.3, r * 0.58, 0.3, Math.PI - 0.3); ctx.quadraticCurveTo(-r * 0.8, 0, 0, -r); ctx.fill();
  ctx.restore();
}

function drawStatic(ctx, w, h, amount) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y += 2) {
    const band = Math.random() < 0.05 ? 60 : 0;
    for (let x = 0; x < w; x += 2) {
      const v = Math.random() * 120 * amount + band;
      const i = (y * w + x) * 4;
      for (const o of [0, 4, w * 4, w * 4 + 4]) {
        d[i + o] = v * 0.6; d[i + o + 1] = v * 0.85; d[i + o + 2] = v; d[i + o + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

function roundedPoly(ctx, pts, r) {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const m1 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    if (i === 0) ctx.moveTo(...m1);
    ctx.arcTo(p1[0], p1[1], p2[0], p2[1], r);
  }
  ctx.closePath();
}

function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sea world seen through the periscope: four lifeboats with flag signallers.
function buildPeriscopeScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8cc4e8);
  scene.fog = new THREE.Fog(0xb9d9ee, 60, 400);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x335566, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(30, 50, 20);
  scene.add(sun);
  const seaTex = noiseTex(256, 256, '#1f6a92', 60, { repeat: [80, 80] });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshStandardMaterial({ map: seaTex, color: 0x6ab4d8, roughness: 0.35 }));
  sea.rotation.x = -Math.PI / 2;
  scene.add(sea);

  // Arm angles are measured from hanging straight down, positive = raised outward
  // on the viewer's side. [viewerLeft, viewerRight]
  const signals = [
    { bearing: 0, arms: [-28, -28], cross: true },
    { bearing: 90, arms: [135, 45] },
    { bearing: 180, arms: [180, 135] },
    { bearing: 270, arms: [8, 90] },
  ];
  const boats = [];
  for (const s of signals) {
    const g = new THREE.Group();
    const b = THREE.MathUtils.degToRad(s.bearing);
    const d = 24;
    g.position.set(Math.sin(b) * d, 0, -Math.cos(b) * d);
    // Face the periscope with a plain yaw. lookAt() stores the 180° case as x=π, z=π,
    // and the per-frame roll in update() overwrites z, flipping that boat upside down.
    g.rotation.y = -b;
    scene.add(g);
    // Lifeboat.
    const hullM = new THREE.MeshStandardMaterial({ color: 0xff6a1a, roughness: 0.6 });
    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 1.3), hullM);
    hull.position.y = 0.2;
    hull.rotation.y = Math.PI / 2;
    g.add(hull);
    const rimB = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 1.4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    rimB.position.y = 0.55; rimB.rotation.y = Math.PI / 2;
    g.add(rimB);
    g.add(signaller(s));
    boats.push(g);
  }
  return {
    scene,
    update(t) {
      seaTex.offset.set(t * 0.01, t * 0.004);
      boats.forEach((g, i) => { g.position.y = Math.sin(t * 1.1 + i) * 0.12; g.rotation.z = Math.sin(t * 0.9 + i * 2) * 0.04; });
    },
  };
}

function signaller(s) {
  const man = new THREE.Group();
  man.position.y = 0.55;
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.8 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xd9a77a, roughness: 0.8 });
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.85, 0.22), dark);
  legs.position.y = 0.43; man.add(legs);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.65, 0.26), dark);
  torso.position.y = 1.18; man.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), skin);
  head.position.y = 1.66; man.add(head);
  const flagM = new THREE.MeshBasicMaterial({ color: 0xf01a1a, side: THREE.DoubleSide });
  // Local +x is the viewer's right because the group faces the periscope.
  [-1, 1].forEach((side, idx) => {
    const angle = THREE.MathUtils.degToRad(s.arms[idx]);
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.27, 1.45, s.cross ? 0.08 : 0);
    pivot.rotation.z = side * angle;
    man.add(pivot);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.1), dark);
    arm.position.y = -0.31;
    pivot.add(arm);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35), new THREE.MeshStandardMaterial({ color: 0x8a6a3a }));
    stick.position.y = -0.78;
    pivot.add(stick);
    const flag = new THREE.Group();
    flag.position.set(side * 0.17, -0.82, 0.02 * idx);
    pivot.add(flag);
    const f1 = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), flagM);
    flag.add(f1);
  });
  return man;
}
