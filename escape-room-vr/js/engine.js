import * as THREE from '../vendor/three.module.js';
import { canvasTex, roundRect } from './tex.js';
import { sfx } from './audio.js';

const EYE_HEIGHT = 1.6;
const DWELL_SECONDS = 1.8;
// Rough physical size of a CSS pixel on phones; the lens distance setting absorbs the error.
const MM_PER_CSS_PX = 0.17;
const VIEW_KEY = 'ertg-vr-view';

// Device-orientation to quaternion (same math as three's old DeviceOrientationControls).
const zee = new THREE.Vector3(0, 0, 1);
const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const euler = new THREE.Euler();
const q0 = new THREE.Quaternion();
function orientationQuat(q, alpha, beta, gamma, orient) {
  euler.set(beta, alpha, -gamma, 'YXZ');
  q.setFromEuler(euler);
  q.multiply(q1);
  q.multiply(q0.setFromAxisAngle(zee, -orient));
}

export class Engine {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.02, 600);
    this.rig = new THREE.Group();
    this.rig.position.y = EYE_HEIGHT;
    this.rig.add(this.camera);
    this.scene.add(this.rig);

    // Stereo eyes for cardboard mode.
    this.eyeL = new THREE.PerspectiveCamera(80, 1, 0.02, 600);
    this.eyeR = new THREE.PerspectiveCamera(80, 1, 0.02, 600);
    this.camera.add(this.eyeL, this.eyeR);
    this.view = { lensMM: 62, depth: true };
    try { Object.assign(this.view, JSON.parse(localStorage.getItem(VIEW_KEY) || '{}')); } catch (e) { /* ignore */ }
    this.applyEyeSeparation();

    this.mode = 'screen'; // 'screen' | 'cardboard' | 'xr'
    this.yaw = 0;
    this.pitch = 0;
    this.gyro = null; // { alpha, beta, gamma }
    this.gyroYawOffset = null;
    this.useGyro = false;

    this.ticks = [];
    this.pickables = [];
    this.handlers = new Map();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 30;
    this.hover = null;
    this.dwell = 0;
    this.dwellLocked = null;
    this.dwellEnabled = true;
    this.panel = null;
    this.liveView = null;
    this.mouse = null;
    this.lastFrame = performance.now();
    this.time = 0;

    this.buildReticle();
    this.setupInput();
    this.setupXR();

    window.addEventListener('resize', () => this.resize());
    this.renderer.setAnimationLoop((t, frame) => this.frame(frame));
  }

  // ---------- public API for scenes ----------

  onTick(fn) { this.ticks.push(fn); return () => { this.ticks = this.ticks.filter((f) => f !== fn); }; }

  // Register an object that blocks the gaze ray (walls, furniture).
  addBlocker(obj) { this.pickables.push(obj); return obj; }

  // Register a clickable object. handler(hit) is called on click.
  addClickable(obj, handler, opts = {}) {
    this.pickables.push(obj);
    obj.userData.clickable = { handler, dwell: opts.dwell !== false, enabled: opts.enabled ?? (() => true), region: opts.region };
    return obj;
  }

  removePickable(obj) { this.pickables = this.pickables.filter((o) => o !== obj); }

  // Show an inspect panel in front of the user. `mesh` gets click events via onClick(uv).
  // A close button is added below it; clicking outside also closes.
  openPanel(mesh, { onClick, onClose, region, distance = 1.1, closeLabel = 'SLUITEN' } = {}) {
    this.closePanel(true);
    const group = new THREE.Group();
    group.add(mesh);
    const h = mesh.geometry.parameters.height;
    const close = makeButtonMesh(closeLabel, 0.34, 0.09);
    close.position.set(0, -h / 2 - 0.08, 0.001);
    group.add(close);
    // Dark backdrop to separate panel from the room.
    const back = new THREE.Mesh(new THREE.SphereGeometry(2.5, 24, 16), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, side: THREE.BackSide, depthWrite: false }));
    back.renderOrder = 900;
    group.renderOrder = 1000;
    // Transparent so the panel joins the backdrop's render pass and is drawn after it:
    // with depthTest off it writes no depth, so an opaque panel got darkened by the
    // backdrop wherever the room behind it was further away than the sphere.
    [mesh, close].forEach((m) => { m.renderOrder = 1001; m.material.depthTest = false; m.material.transparent = true; });

    const camPos = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    this.viewPose(camPos, camDir);
    camDir.y = THREE.MathUtils.clamp(camDir.y, -0.5, 0.5);
    camDir.normalize();
    group.position.copy(camPos).addScaledVector(camDir, distance);
    group.lookAt(camPos);
    back.position.copy(camPos);
    this.scene.add(group, back);

    mesh.userData.clickable = { handler: (hit) => onClick && onClick(hit.uv, hit), dwell: !!(onClick && onClick.dwell), enabled: () => true, region: region || (onClick && onClick.region) };
    close.userData.clickable = { handler: () => this.closePanel(), dwell: true, enabled: () => true };
    back.userData.clickable = { handler: () => this.closePanel(), dwell: false, enabled: () => true };
    this.panel = { group, back, mesh, close, onClose, pickables: [mesh, close, back] };
    sfx.click();
  }

  closePanel(silent) {
    if (!this.panel) return;
    const p = this.panel;
    this.panel = null;
    this.scene.remove(p.group, p.back);
    if (!silent) sfx.click();
    p.onClose && p.onClose();
  }

  // Head-locked live view rendered from a second camera (periscope, binoculars).
  // opts.scene: scene to render, opts.position: Vector3 getter, opts.fov, opts.mask: 'circle' | 'binocular',
  // opts.hud(ctx, w, h, yawDeg): optional overlay drawing.
  openLiveView(opts) {
    this.closeLiveView(true);
    const size = 1024;
    const rt = new THREE.WebGLRenderTarget(size, size, { colorSpace: THREE.SRGBColorSpace });
    const cam = new THREE.PerspectiveCamera(opts.fov || 30, 1, 0.05, 2000);
    const mask = canvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      if (opts.mask === 'binocular') {
        ctx.beginPath(); ctx.arc(w * 0.33, h / 2, w * 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(w * 0.67, h / 2, w * 0.3, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(w / 2, h / 2, w * 0.47, 0, Math.PI * 2); ctx.fill();
      }
    });
    const dist = 1.2;
    const planeSize = 2 * dist * Math.tan(THREE.MathUtils.degToRad(32));
    const mat = new THREE.MeshBasicMaterial({ map: rt.texture, alphaMap: mask.tex, transparent: true, depthTest: false, toneMapped: false });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize), mat);
    plane.position.z = -dist;
    plane.renderOrder = 1100;
    // Black surround so the room is hidden while looking through.
    // Transparent (but fully opaque) so it sorts after see-through scene objects such as glass.
    const surround = new THREE.Mesh(new THREE.SphereGeometry(2, 24, 16), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, depthTest: false, transparent: true }));
    surround.renderOrder = 1050;
    this.camera.add(plane, surround);
    let hud = null;
    if (opts.hud) {
      hud = canvasTex(1024, 1024, () => {});
      const hm = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize), new THREE.MeshBasicMaterial({ map: hud.tex, transparent: true, depthTest: false, toneMapped: false }));
      hm.renderOrder = 1101;
      hm.position.set(0, 0, 0.001);
      plane.add(hm);
    }
    this.liveView = { rt, cam, plane, surround, hud, opts };
    sfx.click();
  }

  closeLiveView(silent) {
    if (!this.liveView) return;
    const lv = this.liveView;
    this.liveView = null;
    this.camera.remove(lv.plane, lv.surround);
    lv.rt.dispose();
    if (!silent) sfx.click();
    lv.opts.onClose && lv.opts.onClose();
  }

  // Small floating message in front of the user.
  toast(text, seconds = 3) {
    if (this.toastMesh) this.camera.remove(this.toastMesh);
    const m = makeLabelMesh(text, 0.5, 0.07, { bg: 'rgba(0,0,0,0.75)', color: '#fff' });
    m.position.set(0, -0.22, -0.9);
    m.material.depthTest = false;
    m.renderOrder = 1200;
    this.camera.add(m);
    this.toastMesh = m;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.camera.remove(m); if (this.toastMesh === m) this.toastMesh = null; }, seconds * 1000);
  }

  // Current head position and look direction in world space.
  viewPose(pos, dir) {
    const cam = this.mode === 'xr' ? this.renderer.xr.getCamera() : this.camera;
    cam.updateMatrixWorld();
    pos.setFromMatrixPosition(cam.matrixWorld);
    dir.set(0, 0, -1).transformDirection(cam.matrixWorld);
  }

  headQuaternion(q) {
    const cam = this.mode === 'xr' ? this.renderer.xr.getCamera() : this.camera;
    cam.updateMatrixWorld();
    cam.matrixWorld.decompose(new THREE.Vector3(), q, new THREE.Vector3());
    return q;
  }

  // ---------- modes ----------

  async enterCardboard() {
    this.mode = 'cardboard';
    this.resize();
    await this.enableGyro();
    try { await document.documentElement.requestFullscreen(); } catch (e) { /* not supported */ }
    try { await screen.orientation.lock('landscape'); } catch (e) { /* not supported */ }
    this.resize();
  }

  async enterScreen(withGyro) {
    this.mode = 'screen';
    if (withGyro) await this.enableGyro();
    this.resize();
  }

  async enterXR() {
    const init = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] };
    const session = await navigator.xr.requestSession('immersive-vr', init);
    let space = 'local-floor';
    try {
      this.renderer.xr.setReferenceSpaceType('local-floor');
      await this.renderer.xr.setSession(session);
    } catch (e) {
      space = 'local';
      this.renderer.xr.setReferenceSpaceType('local');
      await this.renderer.xr.setSession(session);
    }
    this.mode = 'xr';
    this.rig.position.y = space === 'local' ? EYE_HEIGHT : 0;
    // Keep the initial look direction the same as the non-XR view.
    this.rig.rotation.y = 0;
    this.camera.position.set(0, 0, 0);
    session.addEventListener('end', () => {
      this.mode = 'screen';
      this.rig.position.y = EYE_HEIGHT;
      this.camera.quaternion.identity();
      this.onExitXR && this.onExitXR();
      this.resize();
    });
  }

  async enableGyro() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const r = await DeviceOrientationEvent.requestPermission();
        if (r !== 'granted') return false;
      } catch (e) { return false; }
    }
    if (!this.gyroListening) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.alpha === null) return;
        this.gyro = { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
      });
      this.gyroListening = true;
    }
    this.useGyro = true;
    this.gyroYawOffset = null;
    return true;
  }

  recenter() {
    if (this.useGyro) this.gyroYawOffset = null;
    else { this.yaw = 0; this.pitch = 0; }
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.eyeL.aspect = this.eyeR.aspect = (w / 2) / h;
    this.eyeL.updateProjectionMatrix();
    this.eyeR.updateProjectionMatrix();
    // Shift each eye's image centre so it sits under the headset lens instead of in the middle
    // of its half of the screen. Without this most phones need your eyes to diverge: double vision.
    const quarter = w / 4;
    const lensHalfPx = (this.view.lensMM / 2) / MM_PER_CSS_PX;
    const shift = THREE.MathUtils.clamp((quarter - lensHalfPx) / quarter, -0.8, 0.8);
    for (const [eye, sign] of [[this.eyeL, -1], [this.eyeR, 1]]) {
      eye.projectionMatrix.elements[8] = sign * shift;
      eye.projectionMatrixInverse.copy(eye.projectionMatrix).invert();
    }
    if (!this.renderer.xr.isPresenting) this.renderer.setSize(w, h);
  }

  applyEyeSeparation() {
    const half = this.view.depth ? 0.032 : 0;
    this.eyeL.position.x = -half;
    this.eyeR.position.x = half;
  }

  saveView() {
    try { localStorage.setItem(VIEW_KEY, JSON.stringify(this.view)); } catch (e) { /* ignore */ }
    this.applyEyeSeparation();
    this.resize();
  }

  // Menu entries to tune the cardboard view from inside the headset.
  viewMenuItems() {
    if (this.mode !== 'cardboard') return [];
    return [
      { label: 'Beelden verder uit elkaar', action: () => { this.view.lensMM = Math.min(80, this.view.lensMM + 2); this.saveView(); this.toast(`Lensafstand ${this.view.lensMM} mm`, 2); } },
      { label: 'Beelden dichter bij elkaar', action: () => { this.view.lensMM = Math.max(40, this.view.lensMM - 2); this.saveView(); this.toast(`Lensafstand ${this.view.lensMM} mm`, 2); } },
      { label: '3D-diepte aan/uit', action: () => { this.view.depth = !this.view.depth; this.saveView(); this.toast(this.view.depth ? '3D-diepte aan' : '3D-diepte uit', 2); } },
    ];
  }

  // ---------- internals ----------

  buildReticle() {
    const g = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.006, 0.010, 32), ringMat);
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.0025, 16), ringMat);
    const prog = new THREE.Mesh(new THREE.RingGeometry(0.011, 0.016, 48, 1, Math.PI / 2, 0.001), new THREE.MeshBasicMaterial({ color: 0xffb020, depthTest: false, transparent: true }));
    [ring, dot, prog].forEach((m) => { m.renderOrder = 2000; g.add(m); });
    g.position.z = -1;
    this.camera.add(g);
    this.reticle = { g, ring, dot, prog, ringMat };
  }

  setReticle(hovering, progress, distance = 2) {
    const r = this.reticle;
    // Put the ring at the depth of what you look at, so both eyes see one ring.
    const d = THREE.MathUtils.clamp(distance, 0.35, 8) * 0.97;
    r.g.position.z = -d;
    r.g.scale.setScalar(d);
    const s = hovering ? 1.7 : 1;
    r.ring.scale.setScalar(s);
    r.ringMat.color.set(hovering ? 0xffb020 : 0xffffff);
    const len = Math.max(0.001, progress * Math.PI * 2);
    if (Math.abs((r.prog.userData.len || 0) - len) > 0.01) {
      r.prog.geometry.dispose();
      r.prog.geometry = new THREE.RingGeometry(0.011 * s, 0.016 * s, 48, 1, Math.PI / 2, len);
      r.prog.userData.len = len;
    }
    r.prog.visible = progress > 0;
    // In screen mode with a mouse the reticle is hidden; the cursor is used instead.
    r.g.visible = !(this.mode === 'screen' && this.mouse && this.mouse.isMouse);
  }

  setupInput() {
    const el = this.renderer.domElement;
    let down = null;
    el.addEventListener('pointerdown', (e) => {
      down = { x: e.clientX, y: e.clientY, yaw: this.yaw, pitch: this.pitch, moved: false, id: e.pointerId };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      this.mouse = { x: e.clientX, y: e.clientY, isMouse: e.pointerType === 'mouse' };
      if (!down || down.id !== e.pointerId) return;
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 8) down.moved = true;
      if (this.mode === 'screen' && !this.useGyro && down.moved) {
        const k = 0.0045 * (75 / 75);
        this.yaw = down.yaw + dx * k;
        this.pitch = THREE.MathUtils.clamp(down.pitch + dy * k, -1.4, 1.4);
      }
    });
    el.addEventListener('pointerup', (e) => {
      if (!down) return;
      const wasMoved = down.moved;
      down = null;
      if (wasMoved) return;
      if (this.mode === 'cardboard' || this.mode === 'xr' || (this.mode === 'screen' && this.useGyro)) {
        this.click(this.gazeRay());
      } else {
        this.click(this.screenRay(e.clientX, e.clientY));
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') this.click(this.currentRay());
      if (e.code === 'Escape') { if (this.liveView) this.closeLiveView(); else if (this.panel) this.closePanel(); }
      const step = 0.08;
      if (e.code === 'ArrowLeft') this.yaw += step;
      if (e.code === 'ArrowRight') this.yaw -= step;
      if (e.code === 'ArrowUp') this.pitch = Math.min(1.4, this.pitch + step);
      if (e.code === 'ArrowDown') this.pitch = Math.max(-1.4, this.pitch - step);
    });
  }

  setupXR() {
    this.controllers = [];
    for (let i = 0; i < 2; i++) {
      const c = this.renderer.xr.getController(i);
      c.userData.mode = null;
      c.addEventListener('connected', (e) => {
        c.userData.mode = e.data.targetRayMode;
        if (e.data.targetRayMode === 'tracked-pointer') {
          const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]), new THREE.LineBasicMaterial({ color: 0xffb020 }));
          line.scale.z = 5;
          line.name = 'laser';
          c.add(line);
        }
      });
      c.addEventListener('disconnected', () => { c.userData.mode = null; c.clear(); });
      c.addEventListener('select', () => {
        if (c.userData.mode === 'tracked-pointer') { this.activeController = c; this.click(this.controllerRay(c)); }
        else this.click(this.gazeRay());
      });
      this.rig.add(c);
      this.controllers.push(c);
    }
  }

  gazeRay() {
    const pos = new THREE.Vector3();
    const dir = new THREE.Vector3();
    this.viewPose(pos, dir);
    return { origin: pos, dir };
  }

  controllerRay(c) {
    c.updateMatrixWorld();
    const origin = new THREE.Vector3().setFromMatrixPosition(c.matrixWorld);
    const dir = new THREE.Vector3(0, 0, -1).transformDirection(c.matrixWorld);
    return { origin, dir };
  }

  screenRay(x, y) {
    const ndc = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    return { origin: this.raycaster.ray.origin.clone(), dir: this.raycaster.ray.direction.clone() };
  }

  currentRay() {
    if (this.mode === 'xr') {
      const c = this.activeController || this.controllers.find((k) => k.userData.mode === 'tracked-pointer');
      if (c && c.userData.mode === 'tracked-pointer') return this.controllerRay(c);
      return this.gazeRay();
    }
    if (this.mode === 'screen' && !this.useGyro && this.mouse && this.mouse.isMouse) return this.screenRay(this.mouse.x, this.mouse.y);
    return this.gazeRay();
  }

  pick(ray) {
    if (!ray) return null;
    this.raycaster.set(ray.origin, ray.dir);
    let list = this.pickables;
    if (this.liveView) return { live: true };
    if (this.panel) list = this.panel.pickables;
    const hits = this.raycaster.intersectObjects(list, true);
    this.lastHitDistance = 2;
    for (const h of hits) {
      if (!isVisible(h.object)) continue;
      this.lastHitDistance = h.distance;
      let o = h.object;
      while (o) {
        const c = o.userData.clickable;
        if (c) return c.enabled() ? { obj: o, hit: h, c } : null;
        o = o.parent;
      }
      return null; // blocked by a non-clickable object
    }
    return null;
  }

  click(ray) {
    const p = this.pick(ray);
    if (!p) return;
    if (p.live) { this.closeLiveView(); return; }
    p.c.handler(p.hit);
  }

  frame(xrFrame) {
    const now = performance.now();
    const dt = Math.min((now - this.lastFrame) / 1000, 0.1);
    this.lastFrame = now;
    this.time += dt;

    if (this.mode !== 'xr') {
      if (this.useGyro && this.gyro) {
        const orient = THREE.MathUtils.degToRad(screen.orientation ? screen.orientation.angle : (window.orientation || 0));
        const q = new THREE.Quaternion();
        orientationQuat(q, THREE.MathUtils.degToRad(this.gyro.alpha), THREE.MathUtils.degToRad(this.gyro.beta), THREE.MathUtils.degToRad(this.gyro.gamma), orient);
        if (this.gyroYawOffset === null) {
          const e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
          this.gyroYawOffset = -e.y;
        }
        const off = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.gyroYawOffset);
        this.camera.quaternion.copy(off.multiply(q));
      } else {
        this.camera.quaternion.setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
      }
    }

    for (const f of this.ticks) f(dt, this.time);

    // Hover + dwell.
    const p = this.pick(this.currentRay());
    const target = p && !p.live ? p.obj : null;
    // Dwell is tracked per object and, when the object reports one, per region (button) on it.
    const key = target ? target.uuid + ':' + (p.c.region ? p.c.region(p.hit) : '') : null;
    const dwellable = !!(target && p.c.dwell && (!p.c.region || p.c.region(p.hit) !== null));
    const gazeMode = this.mode === 'cardboard' || (this.mode === 'xr' && !this.controllers.some((c) => c.userData.mode === 'tracked-pointer'));
    if (key !== this.hover) {
      this.hover = key;
      this.dwell = 0;
      if (key !== this.dwellLocked) this.dwellLocked = null;
    }
    let progress = 0;
    if (gazeMode && this.dwellEnabled && dwellable && key !== this.dwellLocked) {
      this.dwell += dt;
      progress = Math.min(1, this.dwell / DWELL_SECONDS);
      if (this.dwell >= DWELL_SECONDS) {
        this.dwellLocked = key;
        this.dwell = 0;
        p.c.handler(p.hit);
      }
    }
    if (gazeMode && this.liveView) {
      // Look straight down to leave a live view without a button.
      const pos = new THREE.Vector3(); const dir = new THREE.Vector3();
      this.viewPose(pos, dir);
      if (dir.y < -0.85) { this.lvExit = (this.lvExit || 0) + dt; progress = Math.min(1, this.lvExit / DWELL_SECONDS); if (this.lvExit > DWELL_SECONDS) { this.lvExit = 0; this.closeLiveView(); } }
      else this.lvExit = 0;
    }
    this.setReticle(!!target || !!(p && p.live), progress, p && p.live ? 1.2 : this.lastHitDistance);
    this.renderer.domElement.style.cursor = target ? 'pointer' : 'grab';

    // Live view render pass.
    if (this.liveView) {
      const lv = this.liveView;
      const q = this.headQuaternion(new THREE.Quaternion());
      lv.cam.quaternion.copy(q);
      lv.opts.position && lv.cam.position.copy(lv.opts.position());
      lv.cam.updateMatrixWorld();
      const xrOn = this.renderer.xr.enabled;
      this.renderer.xr.enabled = false;
      const prevRT = this.renderer.getRenderTarget();
      // Hide head-locked overlays so the view does not render into itself.
      const overlays = [lv.plane, lv.surround, this.reticle.g, this.toastMesh].filter(Boolean);
      const vis = overlays.map((o) => o.visible);
      overlays.forEach((o) => { o.visible = false; });
      this.renderer.setRenderTarget(lv.rt);
      this.renderer.render(lv.opts.scene || this.scene, lv.cam);
      this.renderer.setRenderTarget(prevRT);
      overlays.forEach((o, i) => { o.visible = vis[i]; });
      this.renderer.xr.enabled = xrOn;
      if (lv.hud) {
        const e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
        const yawDeg = ((-THREE.MathUtils.radToDeg(e.y) % 360) + 360) % 360;
        lv.hud.ctx.clearRect(0, 0, lv.hud.w, lv.hud.h);
        lv.opts.hud(lv.hud.ctx, lv.hud.w, lv.hud.h, yawDeg);
        lv.hud.tex.needsUpdate = true;
      }
    }

    if (this.mode === 'cardboard') {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const r = this.renderer;
      this.camera.updateMatrixWorld();
      r.setScissorTest(true);
      r.setViewport(0, 0, w / 2, h); r.setScissor(0, 0, w / 2, h); r.render(this.scene, this.eyeL);
      r.setViewport(w / 2, 0, w / 2, h); r.setScissor(w / 2, 0, w / 2, h); r.render(this.scene, this.eyeR);
      r.setScissorTest(false);
      r.setViewport(0, 0, w, h);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

function isVisible(o) {
  while (o) { if (!o.visible) return false; o = o.parent; }
  return true;
}

export function makeLabelMesh(text, width, height, { bg = '#222', color = '#fff', font = 'bold 54px sans-serif', px = 512 } = {}) {
  const pxH = Math.round(px * height / width);
  const ct = canvasTex(px, pxH, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg;
    roundRect(ctx, 2, 2, w - 4, h - 4, Math.min(24, h / 3));
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let size = parseInt(font.match(/(\d+)px/)[1], 10);
    while (ctx.measureText(text).width > w - 30 && size > 10) { size -= 2; ctx.font = font.replace(/\d+px/, size + 'px'); }
    ctx.fillText(text, w / 2, h / 2 + 2);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: ct.tex, transparent: true, toneMapped: false }));
  return m;
}

export function makeButtonMesh(text, w, h) {
  return makeLabelMesh(text, w, h, { bg: '#b8860b', color: '#111', font: 'bold 60px sans-serif' });
}
