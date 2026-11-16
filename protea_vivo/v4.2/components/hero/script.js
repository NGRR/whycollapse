
(() => {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

  const ASSETS = {
    bgFar: 'assets/bg_far.png',
    bgMid: 'assets/bg_mid.png',
    baseSharp: 'assets/base_sharp.png',
    networkFar: 'assets/network_far.png',
    networkMid: 'assets/network_mid.png',
    networkNear: 'assets/network_near.png',
    glowFar: 'assets/glow_far.png',
    glowMid: 'assets/glow_mid.png'
  };

  const CFG = {
    fps: 38,
    dprMax: 1.15,
    lensFollow: 0.16,
    lensBandInner: 0.72,
    lensMagnetOuter: 1.55,
    motionEase: 0.11,
    pointerParallax: 15.6,
    depthTravel: 1.3,
    overlayDrift: 0.35
  };

  const state = {
    images: {},
    loaded: false,
    w: 1,
    h: 1,
    dpr: 1,
    t: 0,
    last: 0,
    acc: 0,
    pointer: { x: 0, y: 0, active: false, nx: 0, ny: 0 },
    lens: {
      ax: 0, ay: 0,
      x: 0, y: 0,
      tx: 0, ty: 0,
      r: 170,
      angle: 0,
      spin: 0,
      magnet: 0
    }
  };

  const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  function loadImages() {
    const entries = Object.entries(ASSETS);
    return Promise.all(entries.map(([key, src]) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve([key, img]);
      img.onerror = reject;
      img.src = src;
    }))).then(results => {
      for (const [key, img] of results) state.images[key] = img;
      state.loaded = true;
    });
  }

  function resize() {
    state.w = Math.max(1, window.innerWidth);
    state.h = Math.max(1, window.innerHeight);
    state.dpr = Math.min(window.devicePixelRatio || 1, CFG.dprMax);
    canvas.width = Math.round(state.w * state.dpr);
    canvas.height = Math.round(state.h * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const lens = state.lens;
    lens.r = clamp(Math.min(state.w, state.h) * 0.205, 118, 270);
    lens.ax = state.w * 0.72;
    lens.ay = state.h * 0.52;
    lens.x = lens.ax;
    lens.y = lens.ay;
    lens.tx = lens.ax;
    lens.ty = lens.ay;

    state.pointer.x = lens.ax;
    state.pointer.y = lens.ay;
    updatePointerNorm();
    render();
  }

  function updatePointerNorm() {
    state.pointer.nx = (state.pointer.x / state.w - 0.5) * 2;
    state.pointer.ny = (state.pointer.y / state.h - 0.5) * 2;
  }

  function drawCover(img, dx = 0, dy = 0, scale = 1) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const fit = Math.max(state.w / iw, state.h / ih) * scale;
    const dw = iw * fit;
    const dh = ih * fit;
    const x = (state.w - dw) * 0.5 + dx;
    const y = (state.h - dh) * 0.5 + dy;
    ctx.drawImage(img, x, y, dw, dh);
  }

  function updateLens(dt) {
    const lens = state.lens;
    const dx = state.pointer.x - lens.ax;
    const dy = state.pointer.y - lens.ay;
    const dist = Math.hypot(dx, dy) || 1;

    const inner = lens.r * CFG.lensBandInner;
    const outer = lens.r * CFG.lensMagnetOuter;
    const band = 1 - smoothstep(inner, outer, dist);
    const hollow = smoothstep(0, inner * 0.95, dist);
    const magnet = state.pointer.active ? clamp(band * hollow, 0, 1) : 0;

    const maxOffset = lens.r * CFG.lensFollow;
    lens.tx = lens.ax + (dx / dist) * maxOffset * magnet;
    lens.ty = lens.ay + (dy / dist) * maxOffset * magnet;
    lens.x = lerp(lens.x, lens.tx, CFG.motionEase);
    lens.y = lerp(lens.y, lens.ty, CFG.motionEase);

    const targetAngle = Math.atan2(dy, dx);
    let delta = targetAngle - lens.angle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    lens.spin = lerp(lens.spin, delta * magnet, 0.06);
    lens.angle += lens.spin * 0.055 + dt * (0.04 + magnet * 0.16);
    lens.magnet = lerp(lens.magnet, magnet, 0.08);
  }

  function layerMotion(depth, phase) {
    const p = state.pointer;
    const t = state.t;
    const driftX = Math.cos(t * (0.18 + depth * 0.05) + phase) * (1.2 + depth * 1.45);
    const driftY = Math.sin(t * (0.14 + depth * 0.04) + phase * 0.7) * (0.8 + depth * 1.2);
    const px = -p.nx * CFG.pointerParallax * depth;
    const py = -p.ny * CFG.pointerParallax * depth * 0.65;
    return { x: driftX + px, y: driftY + py };
  }

  function drawBackgroundLayers() {
    let m = layerMotion(0.16, 0.3);
    ctx.globalAlpha = 0.70;
    drawCover(state.images.bgFar, m.x, m.y, 1.02);

    m = layerMotion(0.22, 1.2);
    ctx.globalAlpha = 0.14;
    drawCover(state.images.glowFar, m.x * 1.1, m.y * 1.1, 1.04);

    m = layerMotion(0.42, 2.6);
    ctx.globalAlpha = 0.26;
    drawCover(state.images.bgMid, m.x * 0.8, m.y * 0.8, 1.03);

    m = layerMotion(0.58, 3.4);
    ctx.globalAlpha = 0.30;
    drawCover(state.images.networkFar, m.x, m.y, 1.02);

    m = layerMotion(0.78, 4.0);
    ctx.globalAlpha = 0.26;
    drawCover(state.images.glowMid, m.x * 0.9, m.y * 0.9, 1.025);

    m = layerMotion(0.95, 1.1);
    ctx.globalAlpha = 0.38;
    drawCover(state.images.networkMid, m.x, m.y, 1.028);

    m = layerMotion(1.18, 5.0);
    ctx.globalAlpha = 0.17;
    drawCover(state.images.networkNear, m.x * 0.88, m.y * 0.88, 1.02);

    ctx.globalAlpha = 1;

    const vg = ctx.createRadialGradient(
      state.w * 0.65, state.h * 0.52, Math.min(state.w, state.h) * 0.18,
      state.w * 0.50, state.h * 0.50, Math.max(state.w, state.h) * 0.74
    );
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.26)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, state.w, state.h);
  }

  function drawLensInterior() {
    const lens = state.lens;
    const r = lens.r;

    ctx.save();
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, r * 0.965, 0, Math.PI * 2);
    ctx.clip();

    const focus = 0.34 + lens.magnet * 0.66;
    let m = layerMotion(0.25, 0.5);
    drawCover(
      state.images.baseSharp,
      m.x * 0.18 + Math.cos(lens.angle) * focus * 4,
      m.y * 0.18 + Math.sin(lens.angle) * focus * 3,
      1.012
    );

    const planes = [
      { img: state.images.glowFar, alpha: 0.15, depth: 0.28, scale: 1.018, phase: 0.2 },
      { img: state.images.networkFar, alpha: 0.18, depth: 0.46, scale: 1.022, phase: 1.1 },
      { img: state.images.glowMid, alpha: 0.16, depth: 0.62, scale: 1.026, phase: 2.4 },
      { img: state.images.networkMid, alpha: 0.24, depth: 0.84, scale: 1.032, phase: 3.2 },
      { img: state.images.networkNear, alpha: 0.36, depth: 1.12, scale: 1.036, phase: 4.0 }
    ];

    for (let i = 0; i < planes.length; i++) {
      const p = planes[i];
      const motion = layerMotion(p.depth, p.phase);
      const ox = motion.x + Math.cos(lens.angle + i * 0.42) * focus * p.depth * 6.8 * CFG.depthTravel;
      const oy = motion.y + Math.sin(lens.angle * 0.82 + i * 0.25) * focus * p.depth * 4.4 * CFG.depthTravel;
      ctx.globalAlpha = p.alpha + lens.magnet * 0.08;
      drawCover(p.img, ox, oy, p.scale);
    }
    ctx.globalAlpha = 1;

    const glass = ctx.createRadialGradient(lens.x - r * 0.34, lens.y - r * 0.36, 0, lens.x, lens.y, r);
    glass.addColorStop(0, 'rgba(235,248,255,0.10)');
    glass.addColorStop(0.40, 'rgba(76,160,255,0.05)');
    glass.addColorStop(0.78, 'rgba(0,18,72,0.20)');
    glass.addColorStop(1, 'rgba(0,8,38,0.46)');
    ctx.fillStyle = glass;
    ctx.fillRect(lens.x - r, lens.y - r, r * 2, r * 2);

    const streak = ctx.createLinearGradient(lens.x - r, lens.y - r, lens.x + r, lens.y + r);
    streak.addColorStop(0.10, 'rgba(255,255,255,0)');
    streak.addColorStop(0.42, 'rgba(255,255,255,0.04)');
    streak.addColorStop(0.52, 'rgba(255,255,255,0.20)');
    streak.addColorStop(0.60, 'rgba(255,255,255,0.03)');
    streak.addColorStop(1.00, 'rgba(255,255,255,0)');
    ctx.fillStyle = streak;
    ctx.fillRect(lens.x - r, lens.y - r, r * 2, r * 2);

    ctx.save();
    ctx.translate(lens.x, lens.y);
    ctx.rotate(lens.angle * 0.8);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.66, -0.2, 1.45);
    ctx.lineWidth = 1.0;
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = 'rgba(210,238,255,0.22)';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.42, 0.3, 2.8);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(190,225,255,0.14)';
    ctx.stroke();

    for (let i = 0; i < 14; i++) {
      const a = -1.2 + i * 0.18;
      const x0 = Math.cos(a) * r * 0.52;
      const y0 = Math.sin(a) * r * 0.52;
      const x1 = Math.cos(a) * r * 0.58;
      const y1 = Math.sin(a) * r * 0.58;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(214,240,255,0.16)';
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  function glowDot(x, y, r, rgb, a = 1) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 4.8);
    grad.addColorStop(0, `rgba(${rgb},${0.95 * a})`);
    grad.addColorStop(0.28, `rgba(${rgb},${0.24 * a})`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 4.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(${rgb},${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function strokeArc(cx, cy, r, a0, a1, color, width = 1, dash = []) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawTickRing(cx, cy, r, start, end, count, len, color, width, rot = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    for (let i = 0; i < count; i++) {
      const a = start + (end - start) * (i / Math.max(1, count - 1));
      const x0 = Math.cos(a) * (r - len * 0.5);
      const y0 = Math.sin(a) * (r - len * 0.5);
      const x1 = Math.cos(a) * (r + len * 0.5);
      const y1 = Math.sin(a) * (r + len * 0.5);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawDegreeScale(cx, cy, r, rot = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let deg = 0; deg < 360; deg += 5) {
      const a = (deg - 90) * Math.PI / 180;
      const major30 = deg % 30 === 0;
      const major10 = deg % 10 === 0;
      const inner = r * (major30 ? 1.095 : major10 ? 1.105 : 1.112);
      const outer = r * 1.132;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
      ctx.lineWidth = major30 ? 1.0 : 0.8;
      ctx.strokeStyle = major30 ? 'rgba(224,244,255,0.34)' : 'rgba(190,225,255,0.18)';
      ctx.stroke();

      if (major30) {
        const lx = Math.cos(a) * r * 1.165;
        const ly = Math.sin(a) * r * 1.165;
        ctx.fillStyle = 'rgba(222,244,255,0.52)';
        ctx.fillText(`${deg}°`, lx, ly);
      }
    }
    ctx.restore();
  }

  function drawLabel(x, y, text, align = 'left', color = 'rgba(228,246,255,0.78)') {
    ctx.save();
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(110,175,255,0.26)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawBracketMeasure(x0, y0, x1, y1, cap = 8, color = 'rgba(220,243,255,0.22)', label = '') {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d;
    const ny = dx / d;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x0 + nx * cap, y0 + ny * cap);
    ctx.lineTo(x0 - nx * cap, y0 - ny * cap);
    ctx.moveTo(x1 + nx * cap, y1 + ny * cap);
    ctx.lineTo(x1 - nx * cap, y1 - ny * cap);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    if (label) {
      drawLabel((x0 + x1) * 0.5 + nx * 14, (y0 + y1) * 0.5 + ny * 14, label, 'center', 'rgba(220,243,255,0.64)');
    }
  }

  function drawScientificOverlay() {
    const lens = state.lens;
    const r = lens.r;
    const cx = lens.ax + Math.cos(state.t * 0.20) * CFG.overlayDrift * 3;
    const cy = lens.ay + Math.sin(state.t * 0.18) * CFG.overlayDrift * 2;
    const ang = lens.angle;
    const thetaDeg = (((ang * 180 / Math.PI) % 360) + 360) % 360;
    const scanDeg = 18 + lens.magnet * 52 + Math.sin(state.t * 0.9) * 2.6;
    const radiusVal = r * (1.76 + Math.sin(state.t * 0.36) * 0.015);
    const offsetVal = Math.hypot(lens.x - lens.ax, lens.y - lens.ay);
    const vx = Math.cos(state.t * 0.52 + ang) * 0.46;
    const vy = Math.sin(state.t * 0.58 - ang * 0.6) * 0.34;

    ctx.save();

    strokeArc(cx, cy, r * 1.28, -1.08 + ang * 0.06, 2.26 + ang * 0.06, 'rgba(235,248,255,0.22)', 1.0, [26, 16, 3, 12]);
    strokeArc(cx, cy, r * 1.58, -0.62 + ang * 0.03, 2.82 + ang * 0.03, 'rgba(230,245,255,0.30)', 1.0, [10, 10, 2, 10]);
    strokeArc(cx, cy, r * 1.96, -1.42 + Math.sin(state.t * 0.2) * 0.06, 1.92 + Math.cos(state.t * 0.18) * 0.06, 'rgba(110,175,255,0.20)', 0.9, [32, 20, 4, 18]);
    strokeArc(cx, cy, r * 2.34, -1.10 + ang * 0.02, 0.88 + ang * 0.02, 'rgba(255,91,22,0.32)', 1.1, [12, 10, 2, 10]);
    drawTickRing(cx, cy, r * 1.58, -0.40, 1.30, 18, 8, 'rgba(225,244,255,0.24)', 1, ang * 0.03);
    drawTickRing(cx, cy, r * 1.96, -1.10, 0.20, 12, 10, 'rgba(180,220,255,0.18)', 1, -ang * 0.02);

    const rx = cx + r * 1.75;
    const ry = cy + r * 1.18;
    strokeArc(rx, ry, r * 0.14, 0, Math.PI * 2, 'rgba(215,240,255,0.22)', 1.0, [4, 6]);
    strokeArc(rx, ry, r * 0.08, 0, Math.PI * 2, 'rgba(215,240,255,0.30)', 1.0);
    ctx.beginPath();
    ctx.moveTo(rx - r * 0.20, ry);
    ctx.lineTo(rx + r * 0.20, ry);
    ctx.moveTo(rx, ry - r * 0.20);
    ctx.lineTo(rx, ry + r * 0.20);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(210,238,255,0.20)';
    ctx.stroke();

    const mx0 = cx + r * 1.02;
    const my0 = cy - r * 1.55;
    const mx1 = cx + r * 2.08;
    const my1 = cy - r * 1.18;
    ctx.beginPath();
    ctx.moveTo(mx0, my0);
    ctx.lineTo(mx1, my1);
    ctx.lineTo(mx1 + r * 0.36, my1);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = 'rgba(228,246,255,0.30)';
    ctx.stroke();
    glowDot(mx1 + r * 0.36, my1, 3.4, '255,91,22', 0.95);
    glowDot(mx0, my0, 2.8, '255,91,22', 0.90);
    drawLabel(mx1 + r * 0.40, my1 - 10, `θ ${thetaDeg.toFixed(1)}°`);
    drawLabel(mx1 + r * 0.40, my1 + 8, `Δ ${scanDeg.toFixed(1)}°`, 'left', 'rgba(255,196,174,0.76)');

    const lx0 = cx - r * 0.38;
    const ly0 = cy + r * 1.95;
    const lx1 = cx + r * 0.72;
    const ly1 = cy + r * 1.64;
    ctx.beginPath();
    ctx.moveTo(lx0, ly0);
    ctx.lineTo(lx1, ly1);
    ctx.lineTo(lx1 + r * 0.34, ly1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(214,240,255,0.24)';
    ctx.stroke();
    glowDot(lx1 + r * 0.34, ly1, 3.1, '255,91,22', 0.95);
    drawLabel(lx1 + r * 0.40, ly1 - 8, `R ${radiusVal.toFixed(1)}`);
    drawLabel(lx1 + r * 0.40, ly1 + 10, `OFF ${offsetVal.toFixed(2)}`, 'left', 'rgba(255,196,174,0.76)');

    const ocx = cx - r * 0.10;
    const ocy = cy + r * 0.05;
    strokeArc(ocx, ocy, r * 2.62, -0.56 + ang * 0.02, 1.96 + ang * 0.02, 'rgba(255,91,22,0.24)', 1.0, [8, 10, 2, 10]);
    const nodeAngles = [-0.18, 0.52, 1.28];
    for (let i = 0; i < nodeAngles.length; i++) {
      const a = nodeAngles[i] + ang * 0.02 + Math.sin(state.t * 0.5 + i) * 0.02;
      glowDot(ocx + Math.cos(a) * r * 2.62, ocy + Math.sin(a) * r * 2.62, 3.6 + i * 0.5, '255,91,22', 0.9);
    }

    const guides = [
      { a: -0.88, len0: 1.12, len1: 2.18 },
      { a: -0.22, len0: 1.18, len1: 1.95 },
      { a: 0.78,  len0: 1.10, len1: 2.38 },
      { a: 1.68,  len0: 1.05, len1: 1.92 }
    ];
    for (const g of guides) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(g.a) * r * g.len0, cy + Math.sin(g.a) * r * g.len0);
      ctx.lineTo(cx + Math.cos(g.a) * r * g.len1, cy + Math.sin(g.a) * r * g.len1);
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'rgba(195,225,255,0.18)';
      ctx.stroke();
      glowDot(cx + Math.cos(g.a) * r * g.len1, cy + Math.sin(g.a) * r * g.len1, 2.9, '255,91,22', 0.82);
    }

    const fcX = cx + r * 2.30;
    const fcY = cy - r * 0.58;
    strokeArc(fcX, fcY, r * 0.44, -1.22 + state.t * 0.05, 2.54 + state.t * 0.05, 'rgba(230,245,255,0.18)', 1.0, [14, 10]);
    strokeArc(fcX, fcY, r * 0.24, 0, Math.PI * 2, 'rgba(180,220,255,0.18)', 1.0);
    glowDot(fcX + Math.cos(-0.36) * r * 0.44, fcY + Math.sin(-0.36) * r * 0.44, 3.4, '255,91,22', 0.90);
    drawLabel(fcX + r * 0.56, fcY, `A ${(62 + Math.sin(state.t * 0.8) * 4).toFixed(1)}°`);

    // Additional fine measurement structures and fictional calculations
    drawBracketMeasure(cx - r * 1.90, cy - r * 1.38, cx - r * 0.78, cy - r * 1.38, 7, 'rgba(214,240,255,0.20)', `ARC ${(r * 1.12).toFixed(1)}`);
    drawBracketMeasure(cx - r * 1.58, cy - r * 0.92, cx - r * 1.58, cy + r * 0.30, 7, 'rgba(214,240,255,0.18)', `ΔY ${(vy * 100).toFixed(1)}`);
    drawBracketMeasure(cx + r * 1.30, cy + r * 1.52, cx + r * 2.18, cy + r * 1.10, 7, 'rgba(214,240,255,0.18)', `β ${(118 + Math.cos(state.t * 0.44) * 8).toFixed(1)}°`);
    drawBracketMeasure(cx - r * 0.10, cy - r * 2.12, cx + r * 0.78, cy - r * 2.12, 7, 'rgba(214,240,255,0.16)', `Φ ${(0.82 + Math.sin(state.t * 0.7) * 0.06).toFixed(3)}`);

    // Callout panel style labels
    drawLabel(cx - r * 2.12, cy - r * 1.62, `CEN ${(cx).toFixed(1)} ${(cy).toFixed(1)}`);
    drawLabel(cx - r * 2.12, cy - r * 1.50, `VEC ${vx.toFixed(3)} ${vy.toFixed(3)}`, 'left', 'rgba(255,196,174,0.76)');
    drawLabel(cx - r * 2.12, cy - r * 1.38, `λ ${(1.32 + Math.sin(state.t * 0.25) * 0.04).toFixed(3)}`);
    drawLabel(cx - r * 2.12, cy - r * 1.26, `κ ${(2.84 + Math.cos(state.t * 0.29) * 0.08).toFixed(3)}`, 'left', 'rgba(255,196,174,0.76)');

    drawLabel(cx + r * 1.34, cy + r * 1.74, `γ ${(24 + Math.sin(state.t * 0.45) * 3.2).toFixed(1)}°`);
    drawLabel(cx + r * 1.34, cy + r * 1.86, `τ ${(0.46 + Math.cos(state.t * 0.63) * 0.04).toFixed(3)}`, 'left', 'rgba(255,196,174,0.76)');
    drawLabel(cx + r * 1.34, cy + r * 1.98, `μ ${(7.4 + Math.sin(state.t * 0.58) * 0.3).toFixed(2)}`);

    ctx.restore();
  }

  function drawLensFrame() {
    const lens = state.lens;
    const r = lens.r;

    // external degree scale for the lens graph
    drawDegreeScale(lens.x, lens.y, r, lens.angle * 0.15);

    ctx.save();
    ctx.translate(lens.x, lens.y);
    ctx.rotate(lens.angle);

    ctx.shadowColor = 'rgba(150,210,255,0.92)';
    ctx.shadowBlur = 20;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = 'rgba(226,246,255,0.58)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.91, -0.13, Math.PI * 0.98);
    ctx.lineWidth = 5.2;
    ctx.strokeStyle = 'rgba(178,224,255,0.92)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.91, Math.PI * 1.22, Math.PI * 1.84);
    ctx.lineWidth = 5.2;
    ctx.strokeStyle = 'rgba(178,224,255,0.78)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.78, -0.62, 1.96);
    ctx.lineWidth = 1.0;
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = 'rgba(218,240,255,0.26)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.67, -1.1, 2.95);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 7]);
    ctx.strokeStyle = 'rgba(180,220,255,0.18)';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(0, 0, r * 1.05, Math.PI * 0.04, Math.PI * 1.84);
    ctx.lineWidth = 1.0;
    ctx.setLineDash([34, 24, 4, 14]);
    ctx.strokeStyle = 'rgba(194,230,255,0.26)';
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < 24; i++) {
      const a = -Math.PI * 0.9 + i * (Math.PI * 1.8 / 23);
      const x0 = Math.cos(a) * r * 0.70;
      const y0 = Math.sin(a) * r * 0.70;
      const x1 = Math.cos(a) * r * 0.74;
      const y1 = Math.sin(a) * r * 0.74;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(214,240,255,0.16)';
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(205,236,255,0.10)';
    ctx.stroke();

    // Fine inner angle marks on the lens itself
    for (let deg = -150; deg <= 150; deg += 15) {
      const a = deg * Math.PI / 180;
      const major = deg % 45 === 0;
      const x0 = Math.cos(a) * r * (major ? 0.80 : 0.82);
      const y0 = Math.sin(a) * r * (major ? 0.80 : 0.82);
      const x1 = Math.cos(a) * r * 0.86;
      const y1 = Math.sin(a) * r * 0.86;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineWidth = major ? 1.0 : 0.8;
      ctx.strokeStyle = major ? 'rgba(214,240,255,0.22)' : 'rgba(214,240,255,0.14)';
      ctx.stroke();
    }

    const nodeA = Math.PI * 0.08;
    glowDot(Math.cos(nodeA) * r, Math.sin(nodeA) * r, 6.8 + lens.magnet * 2.8, '255,91,22', 1);
    glowDot(Math.cos(nodeA + Math.PI) * r * 0.98, Math.sin(nodeA + Math.PI) * r * 0.98, 2.3, '235,248,255', 0.85);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, r * 1.03, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(70,155,255,0.040)';
    ctx.stroke();
    ctx.restore();
  }

  function render() {
    if (!state.loaded) return;
    ctx.clearRect(0, 0, state.w, state.h);
    drawBackgroundLayers();
    drawScientificOverlay();
    drawLensInterior();
    drawLensFrame();
  }

  function frame(now) {
    const frameMs = 1000 / CFG.fps;
    if (!state.last) state.last = now;
    state.acc += now - state.last;
    state.last = now;
    if (state.acc >= frameMs) {
      const dt = Math.min(0.05, state.acc / 1000);
      state.acc = 0;
      state.t += dt;
      updateLens(dt);
      render();
    }
    requestAnimationFrame(frame);
  }

  function setPointer(e) {
    state.pointer.x = e.clientX;
    state.pointer.y = e.clientY;
    state.pointer.active = true;
    updatePointerNorm();
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', setPointer, { passive: true });
  window.addEventListener('pointerdown', setPointer, { passive: true });
  window.addEventListener('pointerleave', () => state.pointer.active = false, { passive: true });

  loadImages().then(() => {
    resize();
    requestAnimationFrame(frame);
  }).catch(err => console.error('No se pudieron cargar los assets', err));
})();
