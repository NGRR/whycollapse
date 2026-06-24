(() => {
  const canvas = document.getElementById('protea-canvas');
  const hero = document.getElementById('observatorio');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const ASSET_BASE = 'components/hero/assets/';
  const ASSETS = {
    bgFar: 'bg_far.png',
    bgMid: 'bg_mid.png',
    baseSharp: 'base_sharp.png',
    networkFar: 'network_far.png',
    networkMid: 'network_mid.png',
    networkNear: 'network_near.png',
    glowFar: 'glow_far.png',
    glowMid: 'glow_mid.png'
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
    lens: { ax: 0, ay: 0, x: 0, y: 0, tx: 0, ty: 0, r: 170, angle: 0, spin: 0, magnet: 0 }
  };

  const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const isMobileLayout = () => window.matchMedia('(max-width: 959px)').matches;
  let resizeQueued = false;
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  function loadImages() {
    return Promise.all(Object.entries(ASSETS).map(([key, file]) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve([key, img]);
      img.onerror = reject;
      img.src = ASSET_BASE + file;
    }))).then(results => {
      for (const [key, img] of results) state.images[key] = img;
      state.loaded = true;
    });
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    const nextW = Math.max(1, Math.round(rect.width));
    const nextH = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, CFG.dprMax);
    if (nextW === state.w && nextH === state.h && nextDpr === state.dpr) {
      render();
      return;
    }

    state.w = nextW;
    state.h = nextH;
    state.dpr = nextDpr;
    canvas.width = Math.round(state.w * state.dpr);
    canvas.height = Math.round(state.h * state.dpr);
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const lens = state.lens;
    const mobile = isMobileLayout();
    lens.r = mobile ? clamp(Math.min(state.w * 0.38, state.h * 0.19), 96, 156) : clamp(Math.min(state.w * 0.34, state.h * 0.255), 118, 310);
    lens.ax = mobile ? state.w * 0.5 : state.w * 0.76 - 50;
    lens.ay = mobile ? state.h * 0.72 : state.h * 0.52;
    lens.x = lens.ax;
    lens.y = lens.ay;
    lens.tx = lens.ax;
    lens.ty = lens.ay;

    state.pointer.x = lens.ax;
    state.pointer.y = lens.ay;
    state.pointer.active = false;
    updatePointerNorm();
    render();
  }

  function queueResize() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resizeQueued = false;
        resize();
      });
    });
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
    ctx.drawImage(img, (state.w - dw) * 0.5 + dx, (state.h - dh) * 0.5 + dy, dw, dh);
  }

  function layerMotion(depth, phase) {
    const driftX = Math.cos(state.t * (0.18 + depth * 0.05) + phase) * (1.2 + depth * 1.45);
    const driftY = Math.sin(state.t * (0.14 + depth * 0.04) + phase * 0.7) * (0.8 + depth * 1.2);
    const px = -state.pointer.nx * CFG.pointerParallax * depth;
    const py = -state.pointer.ny * CFG.pointerParallax * depth * 0.65;
    return { x: driftX + px, y: driftY + py };
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

  function updateMobileParallax() {
    if (!isMobileLayout()) return;
    const rect = hero.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height), -1, 1);
    state.pointer.x = state.lens.ax + Math.sin(state.t * 0.45) * state.lens.r * 0.22;
    state.pointer.y = state.lens.ay + progress * state.lens.r * 0.32 + Math.cos(state.t * 0.38) * state.lens.r * 0.14;
    state.pointer.active = false;
    updatePointerNorm();
  }

  function drawBackgroundLayers() {
    const layers = [
      ['bgFar', 0.70, 0.16, 0.3, 1.02],
      ['glowFar', 0.14, 0.22, 1.2, 1.04],
      ['bgMid', 0.26, 0.42, 2.6, 1.03],
      ['networkFar', 0.30, 0.58, 3.4, 1.02],
      ['glowMid', 0.26, 0.78, 4.0, 1.025],
      ['networkMid', 0.38, 0.95, 1.1, 1.028],
      ['networkNear', 0.17, 1.18, 5.0, 1.02]
    ];

    for (const [name, alpha, depth, phase, scale] of layers) {
      const m = layerMotion(depth, phase);
      ctx.globalAlpha = alpha;
      drawCover(state.images[name], m.x, m.y, scale);
    }

    ctx.globalAlpha = 1;
    const vg = ctx.createRadialGradient(
      state.w * 0.65, state.h * 0.52, Math.min(state.w, state.h) * 0.18,
      state.w * 0.50, state.h * 0.50, Math.max(state.w, state.h) * 0.74
    );
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, state.w, state.h);
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

  function drawScientificOverlay() {
    const lens = state.lens;
    const r = lens.r;
    const cx = lens.ax + Math.cos(state.t * 0.20) * CFG.overlayDrift * 3;
    const cy = lens.ay + r * 0.34 + Math.sin(state.t * 0.18) * CFG.overlayDrift * 2;
    const ang = lens.angle;
    const thetaDeg = (((ang * 180 / Math.PI) % 360) + 360) % 360;
    const scanDeg = 18 + lens.magnet * 52 + Math.sin(state.t * 0.9) * 2.6;
    const radiusVal = r * (1.76 + Math.sin(state.t * 0.36) * 0.015);
    const offsetVal = Math.hypot(lens.x - lens.ax, lens.y - lens.ay);
    const vx = Math.cos(state.t * 0.52 + ang) * 0.46;
    const vy = Math.sin(state.t * 0.58 - ang * 0.6) * 0.34;

    ctx.save();
    strokeArc(cx, cy, r * 1.28, -1.08 + ang * 0.06, 2.26 + ang * 0.06, 'rgba(235,248,255,0.22)', 1, [26, 16, 3, 12]);
    strokeArc(cx, cy, r * 1.58, -0.62 + ang * 0.03, 2.82 + ang * 0.03, 'rgba(230,245,255,0.30)', 1, [10, 10, 2, 10]);
    strokeArc(cx, cy, r * 1.96, -1.42, 1.92, 'rgba(110,175,255,0.20)', 0.9, [32, 20, 4, 18]);
    strokeArc(cx, cy, r * 2.34, -1.10 + ang * 0.02, 0.88 + ang * 0.02, 'rgba(255,91,22,0.32)', 1.1, [12, 10, 2, 10]);
    drawTickRing(cx, cy, r * 1.58, -0.40, 1.30, 18, 8, 'rgba(225,244,255,0.24)', 1, ang * 0.03);
    drawTickRing(cx, cy, r * 1.96, -1.10, 0.20, 12, 10, 'rgba(180,220,255,0.18)', 1, -ang * 0.02);

    const rx = cx + r * 1.75;
    const ry = cy + r * 1.18;
    strokeArc(rx, ry, r * 0.14, 0, Math.PI * 2, 'rgba(215,240,255,0.22)', 1, [4, 6]);
    strokeArc(rx, ry, r * 0.08, 0, Math.PI * 2, 'rgba(215,240,255,0.30)', 1);
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
    drawLabel(mx1 + r * 0.40, my1 - 10, `TH ${thetaDeg.toFixed(1)} deg`);
    drawLabel(mx1 + r * 0.40, my1 + 8, `SCAN ${scanDeg.toFixed(1)} deg`, 'left', 'rgba(255,196,174,0.76)');

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
    strokeArc(ocx, ocy, r * 2.62, -0.56 + ang * 0.02, 1.96 + ang * 0.02, 'rgba(255,91,22,0.24)', 1, [8, 10, 2, 10]);
    for (const aBase of [-0.18, 0.52, 1.28]) {
      const a = aBase + ang * 0.02 + Math.sin(state.t * 0.5 + aBase) * 0.02;
      glowDot(ocx + Math.cos(a) * r * 2.62, ocy + Math.sin(a) * r * 2.62, 3.8, '255,91,22', 0.9);
    }

    const guides = [
      { a: -0.88, len0: 1.12, len1: 2.18 },
      { a: -0.22, len0: 1.18, len1: 1.95 },
      { a: 0.78, len0: 1.10, len1: 2.38 },
      { a: 1.68, len0: 1.05, len1: 1.92 }
    ];
    for (const g of guides) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(g.a) * r * g.len0, cy + Math.sin(g.a) * r * g.len0);
      ctx.lineTo(cx + Math.cos(g.a) * r * g.len1, cy + Math.sin(g.a) * r * g.len1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(195,225,255,0.18)';
      ctx.stroke();
      glowDot(cx + Math.cos(g.a) * r * g.len1, cy + Math.sin(g.a) * r * g.len1, 2.9, '255,91,22', 0.82);
    }

    const fcX = cx + r * 2.30;
    const fcY = cy - r * 0.58;
    strokeArc(fcX, fcY, r * 0.44, -1.22 + state.t * 0.05, 2.54 + state.t * 0.05, 'rgba(230,245,255,0.18)', 1, [14, 10]);
    strokeArc(fcX, fcY, r * 0.24, 0, Math.PI * 2, 'rgba(180,220,255,0.18)', 1);
    glowDot(fcX + Math.cos(-0.36) * r * 0.44, fcY + Math.sin(-0.36) * r * 0.44, 3.4, '255,91,22', 0.90);
    drawLabel(fcX + r * 0.56, fcY, `A ${(62 + Math.sin(state.t * 0.8) * 4).toFixed(1)} deg`);

    drawBracketMeasure(cx - r * 1.90 - 100, cy - r * 1.38 + 50, cx - r * 0.78 - 100, cy - r * 1.38 + 50, 7, 'rgba(214,240,255,0.20)', `ARC ${(r * 1.12).toFixed(1)}`);
    drawBracketMeasure(cx - r * 1.58, cy - r * 0.92, cx - r * 1.58, cy + r * 0.30, 7, 'rgba(214,240,255,0.18)', `DY ${(vy * 100).toFixed(1)}`);
    drawBracketMeasure(cx + r * 1.30, cy + r * 1.52, cx + r * 2.18, cy + r * 1.10, 7, 'rgba(214,240,255,0.18)', `B ${(118 + Math.cos(state.t * 0.44) * 8).toFixed(1)} deg`);
    drawBracketMeasure(cx - r * 0.10, cy - r * 2.12, cx + r * 0.78, cy - r * 2.12, 7, 'rgba(214,240,255,0.16)', `PHI ${(0.82 + Math.sin(state.t * 0.7) * 0.06).toFixed(3)}`);

    drawLabel(cx - r * 2.12, cy - r * 1.62, `CEN ${cx.toFixed(1)} ${cy.toFixed(1)}`);
    drawLabel(cx - r * 2.12, cy - r * 1.50, `VEC ${vx.toFixed(3)} ${vy.toFixed(3)}`, 'left', 'rgba(255,196,174,0.76)');
    drawLabel(cx - r * 2.12, cy - r * 1.38, `LAM ${(1.32 + Math.sin(state.t * 0.25) * 0.04).toFixed(3)}`);
    drawLabel(cx - r * 2.12, cy - r * 1.26, `K ${(2.84 + Math.cos(state.t * 0.29) * 0.08).toFixed(3)}`, 'left', 'rgba(255,196,174,0.76)');

    drawLabel(cx + r * 1.34, cy + r * 1.74, `G ${(24 + Math.sin(state.t * 0.45) * 3.2).toFixed(1)} deg`);
    drawLabel(cx + r * 1.34, cy + r * 1.86, `TAU ${(0.46 + Math.cos(state.t * 0.63) * 0.04).toFixed(3)}`, 'left', 'rgba(255,196,174,0.76)');
    drawLabel(cx + r * 1.34, cy + r * 1.98, `MU ${(7.4 + Math.sin(state.t * 0.58) * 0.3).toFixed(2)}`);
    ctx.restore();
  }

  function drawLensInterior() {
    const lens = state.lens;
    const r = lens.r;
    ctx.save();
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, r * 0.965, 0, Math.PI * 2);
    ctx.clip();

    const focus = 0.34 + lens.magnet * 0.66;
    const base = layerMotion(0.25, 0.5);
    drawCover(state.images.baseSharp, base.x * 0.18 + Math.cos(lens.angle) * focus * 4, base.y * 0.18 + Math.sin(lens.angle) * focus * 3, 1.012);

    const planes = [
      ['glowFar', 0.15, 0.28, 1.018, 0.2],
      ['networkFar', 0.18, 0.46, 1.022, 1.1],
      ['glowMid', 0.16, 0.62, 1.026, 2.4],
      ['networkMid', 0.24, 0.84, 1.032, 3.2],
      ['networkNear', 0.36, 1.12, 1.036, 4.0]
    ];

    planes.forEach(([name, alpha, depth, scale, phase], i) => {
      const motion = layerMotion(depth, phase);
      const ox = motion.x + Math.cos(lens.angle + i * 0.42) * focus * depth * 6.8 * CFG.depthTravel;
      const oy = motion.y + Math.sin(lens.angle * 0.82 + i * 0.25) * focus * depth * 4.4 * CFG.depthTravel;
      ctx.globalAlpha = alpha + lens.magnet * 0.08;
      drawCover(state.images[name], ox, oy, scale);
    });

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
    streak.addColorStop(0.52, 'rgba(255,255,255,0.20)');
    streak.addColorStop(1.00, 'rgba(255,255,255,0)');
    ctx.fillStyle = streak;
    ctx.fillRect(lens.x - r, lens.y - r, r * 2, r * 2);
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
      ctx.lineWidth = major30 ? 1 : 0.8;
      ctx.strokeStyle = major30 ? 'rgba(224,244,255,0.34)' : 'rgba(190,225,255,0.18)';
      ctx.stroke();
      if (major30) {
        ctx.fillStyle = 'rgba(222,244,255,0.52)';
        ctx.fillText(`${deg}`, Math.cos(a) * r * 1.165, Math.sin(a) * r * 1.165);
      }
    }
    ctx.restore();
  }

  function drawLensFrame() {
    const lens = state.lens;
    const r = lens.r;
    drawDegreeScale(lens.x, lens.y, r, lens.angle * 0.15);

    ctx.save();
    ctx.translate(lens.x, lens.y);
    ctx.rotate(lens.angle);
    ctx.shadowColor = 'rgba(150,210,255,0.92)';
    ctx.shadowBlur = 20;
    ctx.lineCap = 'round';

    strokeArc(0, 0, r, 0, Math.PI * 2, 'rgba(226,246,255,0.58)', 1.25);
    strokeArc(0, 0, r * 0.91, -0.13, Math.PI * 0.98, 'rgba(178,224,255,0.92)', 5.2);
    strokeArc(0, 0, r * 0.91, Math.PI * 1.22, Math.PI * 1.84, 'rgba(178,224,255,0.78)', 5.2);
    strokeArc(0, 0, r * 0.78, -0.62, 1.96, 'rgba(218,240,255,0.26)', 1, [10, 8]);
    strokeArc(0, 0, r * 1.05, Math.PI * 0.04, Math.PI * 1.84, 'rgba(194,230,255,0.26)', 1, [34, 24, 4, 14]);

    for (let deg = -150; deg <= 150; deg += 15) {
      const a = deg * Math.PI / 180;
      const major = deg % 45 === 0;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * (major ? 0.80 : 0.82), Math.sin(a) * r * (major ? 0.80 : 0.82));
      ctx.lineTo(Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86);
      ctx.lineWidth = major ? 1 : 0.8;
      ctx.strokeStyle = major ? 'rgba(214,240,255,0.22)' : 'rgba(214,240,255,0.14)';
      ctx.stroke();
    }

    glowDot(Math.cos(Math.PI * 0.08) * r, Math.sin(Math.PI * 0.08) * r, 6.8 + lens.magnet * 2.8, '255,91,22', 1);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(lens.x, lens.y, r * 1.03, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(70,155,255,0.040)';
    ctx.stroke();
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
      updateMobileParallax();
      updateLens(dt);
      render();
    }
    requestAnimationFrame(frame);
  }

  function setPointer(e) {
    if (isMobileLayout()) return;
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = e.clientX - rect.left;
    state.pointer.y = e.clientY - rect.top;
    state.pointer.active = true;
    updatePointerNorm();
  }

  window.addEventListener('resize', queueResize, { passive: true });
  window.addEventListener('load', queueResize, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueResize);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(queueResize);
    ro.observe(hero);
  }
  hero.addEventListener('pointermove', setPointer, { passive: true });
  hero.addEventListener('pointerdown', setPointer, { passive: true });
  hero.addEventListener('pointerleave', () => { state.pointer.active = false; }, { passive: true });

  loadImages()
    .then(() => {
      queueResize();
      requestAnimationFrame(frame);
    })
    .catch(err => console.error('No se pudieron cargar los assets del hero', err));
})();
