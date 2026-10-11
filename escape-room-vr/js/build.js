import * as THREE from '../vendor/three.module.js';
import { canvasPlane, roundRect } from './tex.js';

export function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.2, ...opts });
}

export function box(w, h, d, material, pos, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  if (pos) m.position.set(...pos);
  if (parent) parent.add(m);
  return m;
}

export function cyl(rt, rb, h, material, pos, parent, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  if (pos) m.position.set(...pos);
  if (parent) parent.add(m);
  return m;
}

// Pipe from a to b.
export function pipe(a, b, r, material, parent) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const len = va.distanceTo(vb);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), material);
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  parent.add(m);
  return m;
}

// In-VR menu panel with a vertical list of buttons. items: [{ label, action }]
export function menuPanel(title, items) {
  const rowH = 110;
  const pxW = 1024;
  const pxH = 150 + items.length * rowH + 30;
  const width = 0.8;
  const height = width * pxH / pxW;
  const mesh = canvasPlane(width, height, pxW, pxH, (ctx, w, h) => {
    ctx.fillStyle = '#16191c';
    roundRect(ctx, 0, 0, w, h, 30);
    ctx.fill();
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 8;
    roundRect(ctx, 6, 6, w - 12, h - 12, 26);
    ctx.stroke();
    ctx.fillStyle = '#ffd34d';
    ctx.font = '64px Stencil, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, w / 2, 80);
    items.forEach((it, i) => {
      const y = 150 + i * rowH;
      ctx.fillStyle = it.danger ? '#7a1f1f' : '#2c3238';
      roundRect(ctx, 60, y, w - 120, rowH - 20, 18);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText(it.label, w / 2, y + (rowH - 20) / 2 + 2);
    });
  });
  const onClick = (uv) => {
    const y = (1 - uv.y) * pxH;
    const i = Math.floor((y - 150) / rowH);
    const within = (y - 150) - i * rowH < rowH - 20;
    if (i >= 0 && i < items.length && within) items[i].action();
  };
  onClick.dwell = true;
  onClick.region = (hit) => {
    const y = (1 - hit.uv.y) * pxH;
    const i = Math.floor((y - 150) / rowH);
    return i >= 0 && i < items.length && (y - 150) - i * rowH < rowH - 20 ? 'row' + i : null;
  };
  return { mesh, onClick };
}

// Stand-alone text sign.
export function sign(text, w, h, { bg = '#222', fg = '#eee', font = 'bold 60px sans-serif', px = 512 } = {}) {
  return canvasPlane(w, h, px, Math.round(px * h / w), (ctx, cw, ch) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = fg;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cw / 2, ch / 2 + 2);
  });
}
