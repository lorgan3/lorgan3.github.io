import * as THREE from '../vendor/three.module.js';

// Canvas-backed texture that can be redrawn at any time.
export function canvasTex(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const api = {
    canvas, ctx, tex, w, h,
    redraw(...args) {
      ctx.save();
      draw(ctx, w, h, ...args);
      ctx.restore();
      tex.needsUpdate = true;
    },
  };
  if (draw) api.redraw();
  return api;
}

// A flat plane showing a canvas texture.
export function canvasPlane(width, height, pxW, pxH, draw, opts = {}) {
  const ct = canvasTex(pxW, pxH, draw);
  const mat = new THREE.MeshBasicMaterial({
    map: ct.tex,
    transparent: !!opts.transparent,
    side: opts.side ?? THREE.FrontSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  mesh.userData.ct = ct;
  return mesh;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Random-noise texture, used for metal, rock, grass and similar surfaces.
export function noiseTex(w, h, base, variance, opts = {}) {
  const ct = canvasTex(w, h, (ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * variance;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
    if (opts.extra) opts.extra(ctx, w, h);
  });
  ct.tex.wrapS = ct.tex.wrapT = THREE.RepeatWrapping;
  if (opts.repeat) ct.tex.repeat.set(opts.repeat[0], opts.repeat[1]);
  return ct.tex;
}

export function loadTex(url) {
  const t = new THREE.TextureLoader().load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export async function loadFonts(list) {
  await Promise.all(list.map(async ([family, url]) => {
    try {
      const f = new FontFace(family, `url(${url})`);
      await f.load();
      document.fonts.add(f);
    } catch (e) {
      console.warn('font failed', family, e);
    }
  }));
}
