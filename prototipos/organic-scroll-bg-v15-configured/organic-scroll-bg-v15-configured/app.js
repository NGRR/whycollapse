(() => {
  "use strict";

  const DEFAULT_CONFIG = {
    version: 9,
    seed: 2772206847,
    previewDurationSeconds: 20,
    previewLoop: true,
    maxDpr: 1.75,
    centerXDesktop: 0.235,
    centerXMobile: 0.50,
    centerYDesktop: 0.50,
    centerYMobile: 0.44,
    heightDesktop: 0.96,
    heightMobile: 0.86,
    scrollSmoothing: 0.065,
    pointerSmoothing: 0.045,

    // La construcción depende del scroll; la vida interna depende del tiempo.
    strandIdleTurnsPerMinute: 0.11,
    strandScrollTurns: 0.46,
    orbitalTurnsPerMinute: 0.42,

    strandCountDesktop: 64,
    strandCountMobile: 38,
    strandStepsDesktop: 112,
    strandStepsMobile: 78,
    initialRootStage: 0.34,

    growthLayers: [
      { path: "assets/stage-03-bud.webp", start: 0.16, peak: 0.30, end: 0.46, opacity: 0.10, scale: 1, yOffset: 0, drift: 1.5, kind: "bud" },
      { path: "assets/stage-05-petals.webp", start: 0.31, peak: 0.48, end: 0.66, opacity: 0.11, scale: 1, yOffset: 0, drift: 1.5, kind: "petals" },
      { path: "assets/stage-07-bloom.webp", start: 0.49, peak: 0.66, end: 0.83, opacity: 0.12, scale: 1, yOffset: 0, drift: 1.5, kind: "bloom" },
      { path: "assets/stage-09-mature.webp", start: 0.60, peak: 0.82, end: 0.985, opacity: 0.48, scale: 1.095, yOffset: 0, drift: 2, kind: "mature" }
    ],

    finalTexturePath: "assets/final-frame.webp",
    finalTextureStart: 0.76,
    finalTextureFull: 0.985,
    finalTextureScale: 1,
    finalTextureYOffset: 0,
    finalTextureBreathing: 0.0015,
    finalBaseAlpha: 0.86,
    finalFrontAlpha: 0.08,
    finalBackLowerAlpha: 0.10,
    finalBackMiddleAlpha: 0.11,
    finalBackUpperAlpha: 0.07,
    accentStrandAlpha: 0.58,
    accentOrbitalAlpha: 0.82,

    showGrowthLayers: true,
    showRoots: true,
    showStrands: true,
    showPetals: true,
    showPod: true,
    showClusters: true,
    showOrbits: true,
    showFinalTexture: true,

    rootAlpha: 0.72,
    orbitBackAlpha: 0.62,
    strandBackAlpha: 0.72,
    petalBackAlpha: 0.80,
    podAlpha: 0.76,
    clusterAlpha: 0.70,
    strandFrontBaseAlpha: 0.32,
    petalFrontBaseAlpha: 0.28,
    orbitFrontBaseAlpha: 0.18
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeConfig(target, source) {
    if (!source || typeof source !== "object") return target;
    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) {
        target[key] = deepClone(value);
      } else if (value && typeof value === "object") {
        if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) target[key] = {};
        mergeConfig(target[key], value);
      } else {
        target[key] = value;
      }
    }
    return target;
  }

  function readStoredConfig() {
    try {
      const raw = localStorage.getItem("organic-animation-config-v9");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  const CONFIG = deepClone(DEFAULT_CONFIG);
  mergeConfig(CONFIG, window.ORGANIC_CONFIG || readStoredConfig());

  const TAU = Math.PI * 2;
  const canvas = document.querySelector("#organic-canvas");
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const progressLabel = document.querySelector("#progressLabel");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const previewRaw = new URLSearchParams(location.search).get("progress");
  const previewParam = previewRaw === null || previewRaw === "" ? NaN : Number(previewRaw);
  let previewProgress = Number.isFinite(previewParam) ? clamp(previewParam) : null;

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    mobile: false,
    progress: 0,
    targetProgress: 0,
    pointerX: 0,
    pointerY: 0,
    pointerTargetX: 0,
    pointerTargetY: 0,
    lastTime: performance.now(),
    strands: [],
    roots: [],
    petals: [],
    podCells: [],
    clusters: [],
    orbiters: [],
    growthLayers: [],
    finalTexture: null
  };

  let random = mulberry32(Number(CONFIG.seed) || DEFAULT_CONFIG.seed);
  const rand = (min, max) => lerp(min, max, random());

  function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function invLerp(a, b, value) { return clamp((value - a) / (b - a)); }
  function smoothstep(a, b, value) { const x = invLerp(a, b, value); return x * x * (3 - 2 * x); }
  function easeOutCubic(x) { return 1 - Math.pow(1 - clamp(x), 3); }
  function easeInOutSine(x) { return -(Math.cos(Math.PI * clamp(x)) - 1) / 2; }
  function mulberry32(seed) {
    return function randomFn() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function buildScene() {
    random = mulberry32(Number(CONFIG.seed) || DEFAULT_CONFIG.seed);
    state.strands.length = 0;
    state.roots.length = 0;
    state.petals.length = 0;
    state.podCells.length = 0;
    state.clusters.length = 0;
    state.orbiters.length = 0;

    const strandCount = state.mobile ? CONFIG.strandCountMobile : CONFIG.strandCountDesktop;
    for (let i = 0; i < strandCount; i += 1) {
      const scaffold = i < (state.mobile ? 9 : 14);
      state.strands.push({
        phase: scaffold ? rand(-0.52, 0.52) : rand(0, TAU),
        turns: scaffold ? rand(1.10, 2.55) * (i % 2 ? 1 : -1) : rand(1.55, 4.85) * (random() > 0.48 ? 1 : -1),
        radius: scaffold ? rand(0.33, 0.72) : rand(0.44, 1.08),
        sway: scaffold ? rand(0.18, 0.58) : rand(0.30, 1.08),
        drift: rand(-1, 1),
        width: scaffold ? rand(0.70, 1.48) : rand(0.34, 1.02),
        start: scaffold ? rand(-0.40, -0.20) : rand(0.03, 0.43),
        finish: scaffold ? rand(0.24, 0.42) : rand(0.46, 0.93),
        brightness: rand(0.62, 1),
        scaffold,
        introTone: scaffold ? (i % 3 === 0 ? "white" : "orange") : "orange",
        hero: scaffold || random() > 0.90,
        crownTaper: rand(0.70, 0.88),
        dash: !scaffold && random() < 0.08,
        seed: rand(0, 1000)
      });
    }

    const makeRoot = (x, y, angle, length, depth, reveal, width) => {
      if (depth <= 0 || length < 0.016) return;
      const bend = rand(-0.46, 0.46);
      const endX = x + Math.cos(angle + bend) * length;
      const endY = y + Math.sin(angle + bend) * length * 0.56;
      state.roots.push({ x1: x, y1: y, x2: endX, y2: endY, bend: rand(-0.38, 0.38), reveal, width, phase: rand(0, TAU) });
      const branches = depth > 2 ? 2 + (random() > 0.65 ? 1 : 0) : 2;
      for (let i = 0; i < branches; i += 1) {
        makeRoot(endX, endY, angle + rand(-0.76, 0.76), length * rand(0.56, 0.75), depth - 1, reveal + rand(0.012, 0.042), width * 0.70);
      }
    };

    for (let i = 0; i < (state.mobile ? 16 : 24); i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      makeRoot(rand(-0.032, 0.032), rand(-0.012, 0.014), side > 0 ? rand(-0.22, 0.56) : rand(Math.PI - 0.56, Math.PI + 0.22), rand(0.16, 0.33), state.mobile ? 4 : 5, rand(-0.12, 0.10), rand(0.58, 1.34));
    }

    const petalLevels = [
      { t: 0.30, length: 0.15, width: 0.105, reveal: 0.24, wrap: 0.10 },
      { t: 0.38, length: 0.19, width: 0.125, reveal: 0.31, wrap: 0.13 },
      { t: 0.46, length: 0.24, width: 0.155, reveal: 0.39, wrap: 0.17 },
      { t: 0.54, length: 0.29, width: 0.190, reveal: 0.47, wrap: 0.22 },
      { t: 0.62, length: 0.31, width: 0.205, reveal: 0.55, wrap: 0.26 },
      { t: 0.69, length: 0.285, width: 0.185, reveal: 0.62, wrap: 0.24 },
      { t: 0.75, length: 0.245, width: 0.160, reveal: 0.68, wrap: 0.20 }
    ];

    petalLevels.forEach((level, levelIndex) => {
      [-1, 1].forEach((side, pairIndex) => {
        state.petals.push({
          ...level,
          t: level.t + rand(-0.012, 0.012),
          phase: levelIndex * 0.78 + pairIndex * Math.PI + rand(-0.30, 0.30),
          side,
          length: level.length * rand(0.90, 1.09),
          width: level.width * rand(0.88, 1.12),
          curl: rand(-0.36, 0.36),
          lateral: rand(0.12, 0.21),
          veins: Math.round(rand(7, 12)),
          longitudinal: Math.round(rand(3, 6)),
          seed: rand(0, 1000)
        });
      });
    });

    [{ t: 0.50, side: -1, phase: 0.55, length: 0.245, width: 0.145, reveal: 0.43 }, { t: 0.58, side: 1, phase: 2.65, length: 0.270, width: 0.155, reveal: 0.51 }]
      .forEach((spec) => state.petals.push({ ...spec, wrap: 0.30, curl: spec.side * -0.24, lateral: 0.13, veins: 10, longitudinal: 5, seed: rand(0, 1000) }));

    const podCellCount = state.mobile ? 48 : 92;
    let attempts = 0;
    while (state.podCells.length < podCellCount && attempts < podCellCount * 20) {
      attempts += 1;
      const x = rand(-1, 1);
      const y = rand(-1, 1);
      if (x * x + y * y > 0.95) continue;
      const edge = Math.sqrt(Math.max(0.04, 1 - x * x - y * y));
      state.podCells.push({ x, y, rx: rand(0.028, 0.075) * (0.72 + edge * 0.55), ry: rand(0.024, 0.065) * (0.72 + edge * 0.55), rotation: rand(-1.1, 1.1), phase: rand(0, TAU) });
    }

    [{ t: 0.525, count: state.mobile ? 28 : 46, reveal: 0.46, radius: 0.078 }, { t: 0.675, count: state.mobile ? 34 : 58, reveal: 0.58, radius: 0.094 }].forEach((cluster, clusterIndex) => {
      const particles = [];
      for (let i = 0; i < cluster.count; i += 1) {
        const a = i * 2.399963 + rand(-0.18, 0.18);
        const r = Math.sqrt((i + 0.5) / cluster.count) * cluster.radius;
        particles.push({ targetX: Math.cos(a) * r, targetY: Math.sin(a) * r * 0.82, orbitRadius: rand(0.16, 0.40), orbitPhase: rand(0, TAU), size: rand(1.5, 4.6), delay: rand(0, 0.14) });
      }
      state.clusters.push({ ...cluster, clusterIndex, particles });
    });

    const orbiterCount = state.mobile ? 28 : 52;
    for (let i = 0; i < orbiterCount; i += 1) {
      state.orbiters.push({
        radiusX: rand(0.21, 0.56),
        radiusY: rand(0.09, 0.40),
        centerY: rand(0.20, 0.87),
        phase: rand(0, TAU),
        speed: rand(0.26, 0.72) * (random() > 0.5 ? 1 : -1),
        tilt: rand(-0.78, 0.78),
        size: rand(0.7, 3.6),
        reveal: rand(0.02, 0.60),
        ring: random() < 0.16,
        major: random() > 0.72,
        depthBias: rand(-1, 1)
      });
    }
  }

  function loadImage(path) {
    return new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = path;
    });
  }

  async function loadTextures() {
    const growth = await Promise.all(CONFIG.growthLayers.map(async (layer) => ({ ...layer, image: await loadImage(layer.path) })));
    state.growthLayers = growth.filter((layer) => layer.image);
    state.finalTexture = await loadImage(CONFIG.finalTexturePath);
  }

  function resize() {
    state.width = innerWidth;
    state.height = innerHeight;
    state.mobile = state.width < 900;
    state.dpr = Math.min(devicePixelRatio || 1, CONFIG.maxDpr);
    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScene();
    updateScroll();
  }

  function updateScroll() {
    if (previewProgress !== null) { state.targetProgress = previewProgress; return; }
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    state.targetProgress = clamp(scrollY / max);
  }

  function updatePointer(event) {
    state.pointerTargetX = event.clientX / Math.max(1, state.width) * 2 - 1;
    state.pointerTargetY = event.clientY / Math.max(1, state.height) * 2 - 1;
  }

  function geometry() {
    const heightRatio = state.mobile ? CONFIG.heightMobile : CONFIG.heightDesktop;
    const cxRatio = state.mobile ? CONFIG.centerXMobile : CONFIG.centerXDesktop;
    const cyRatio = state.mobile ? CONFIG.centerYMobile : CONFIG.centerYDesktop;
    const h = state.height * heightRatio;
    return {
      cx: state.width * cxRatio + state.pointerX * (state.mobile ? 5 : 14),
      cy: state.height * cyRatio + state.pointerY * 6,
      h,
      w: h * 0.54,
      top: state.height * cyRatio - h * 0.5,
      bottom: state.height * cyRatio + h * 0.5
    };
  }

  function strandSpin(time) {
    if (reducedMotion) return state.progress * TAU * 0.12;
    const idle = time / 60000 * CONFIG.strandIdleTurnsPerMinute;
    return TAU * (idle + state.progress * CONFIG.strandScrollTurns);
  }

  function orbitalSpin(time) {
    if (reducedMotion) return time * 0.00002;
    return TAU * (time / 60000 * CONFIG.orbitalTurnsPerMinute);
  }

  function strandPoint(spec, t, spin, geo) {
    const profile = Math.pow(Math.sin(Math.PI * clamp(t)), 0.72);
    const crown = smoothstep(0.56, 1, t);
    const radius = geo.w * (0.055 + profile * 0.17 + crown * 0.08) * spec.radius;
    const angle = spec.phase + spec.turns * TAU * t + spin;
    const z = Math.sin(angle);
    const cylinderX = Math.cos(angle) * radius;
    const slowSway = Math.sin(t * 7.5 + spec.seed + spin * 0.55) * geo.w * 0.014 * spec.sway;
    const spineSway = Math.sin(t * Math.PI * 2.2 + spin * 0.32) * geo.w * 0.02 * (0.25 + t);
    const x = geo.cx + cylinderX + slowSway + spineSway + spec.drift * geo.w * 0.012 * t;
    const y = geo.bottom - geo.h * t + Math.cos(angle * 0.65 + spec.seed) * 2.2;
    return { x, y, z, angle };
  }

  function mainSpinePoint(t, spin, geo) {
    const wave = Math.sin(t * TAU * 1.35 + spin * 0.42) * geo.w * 0.032;
    return { x: geo.cx + wave, y: geo.bottom - geo.h * t };
  }

  function drawRoots(time, spin, geo, alphaMultiplier = 1) {
    const growth = CONFIG.initialRootStage + (1 - CONFIG.initialRootStage) * smoothstep(0, 0.48, state.progress);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const root of state.roots) {
      const local = smoothstep(root.reveal, root.reveal + 0.20, growth);
      if (local <= 0) continue;
      const sway = Math.sin(time * 0.00025 + root.phase + spin) * 0.004;
      const x1 = geo.cx + root.x1 * geo.w;
      const y1 = geo.bottom + root.y1 * geo.h * 0.28;
      const x2Full = geo.cx + (root.x2 + sway) * geo.w;
      const y2Full = geo.bottom + root.y2 * geo.h * 0.28;
      const x2 = lerp(x1, x2Full, easeOutCubic(local));
      const y2 = lerp(y1, y2Full, easeOutCubic(local));
      const cx = lerp(x1, x2, 0.52) + root.bend * geo.w * 0.04;
      const cy = lerp(y1, y2, 0.52) - Math.abs(root.bend) * geo.h * 0.018;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.strokeStyle = `rgba(255, 66, 48, ${(0.13 + local * 0.29) * alphaMultiplier})`;
      ctx.lineWidth = Math.max(0.34, root.width * (0.5 + local * 0.8));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStrands(time, spin, geo, frontPass, alphaMultiplier = 1, mode = "all") {
    const steps = state.mobile ? CONFIG.strandStepsMobile : CONFIG.strandStepsDesktop;
    const matured = smoothstep(0.82, 1, state.progress);
    const cleaned = smoothstep(0.86, 1, state.progress);
    const sorted = state.strands.slice().sort((a, b) => {
      const za = Math.sin(a.phase + a.turns * Math.PI + spin);
      const zb = Math.sin(b.phase + b.turns * Math.PI + spin);
      return za - zb;
    });

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const spec of sorted) {
      const midDepth = Math.sin(spec.phase + spec.turns * Math.PI + spin);
      const isFront = midDepth > 0;
      if (isFront !== frontPass) continue;
      if (mode === "accent" && !spec.hero) continue;
      if (mode === "base" && spec.hero && frontPass) continue;
      const reveal = smoothstep(spec.start, spec.finish, state.progress);
      if (reveal <= 0) continue;

      const endT = Math.max(0.035, easeOutCubic(reveal));
      const effectiveEndT = endT * (spec.hero ? 1 : lerp(1, spec.crownTaper, matured));
      const alphaDepth = isFront ? 1 : 0.42;
      const clarity = mode === "accent"
        ? lerp(0.82, 0.62, cleaned)
        : isFront
          ? (spec.hero ? lerp(1, 0.62, cleaned) : lerp(1, 0.18, cleaned))
          : lerp(1, 0.28, cleaned);
      const introPresence = spec.scaffold ? (1 - smoothstep(0.44, 0.58, state.progress)) : 0;

      ctx.beginPath();
      let begun = false;
      const count = Math.max(3, Math.floor(steps * effectiveEndT));
      for (let i = 0; i <= count; i += 1) {
        const t = i / steps;
        const point = strandPoint(spec, t, spin, geo);
        if (!begun) { ctx.moveTo(point.x, point.y); begun = true; }
        else ctx.lineTo(point.x, point.y);
      }
      const pulse = 0.86 + Math.sin(time * 0.0012 + spec.seed) * 0.14;
      const baseAlpha = alphaDepth * reveal * (0.18 + spec.brightness * 0.24) * pulse * clarity * alphaMultiplier;
      let strokeR = 255;
      let strokeG = 52 + spec.brightness * 34;
      let strokeB = 43;
      let lineWidth = spec.width * (isFront ? 1.0 : 0.68) * (0.70 + reveal * 0.54) * lerp(1, 0.88, cleaned);
      let finalAlpha = baseAlpha;

      if (spec.scaffold && introPresence > 0.001) {
        const tintMix = 0.72 * introPresence;
        if (spec.introTone === "white") {
          strokeG = lerp(strokeG, 245, tintMix);
          strokeB = lerp(strokeB, 255, tintMix);
        } else {
          strokeG = lerp(strokeG, 154, tintMix);
          strokeB = lerp(strokeB, 78, tintMix * 0.8);
        }
        finalAlpha = Math.max(finalAlpha, (isFront ? 0.18 : 0.10) * introPresence * alphaMultiplier);
        lineWidth *= lerp(1.24, 1.0, 1 - introPresence);
      }

      ctx.strokeStyle = `rgba(${strokeR}, ${strokeG}, ${strokeB}, ${finalAlpha})`;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash(spec.dash && cleaned < 0.75 ? [2.2, 5.4] : []);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  function petalShape(spec, spin, geo, time, bloom) {
    const attach = mainSpinePoint(spec.t, spin, geo);
    const angle3d = spin + spec.phase;
    const depth = Math.sin(angle3d);
    const compression = 0.18 + 0.82 * Math.abs(Math.cos(angle3d));
    const open = 0.18 + easeOutCubic(bloom) * 0.82;
    const length = spec.length * geo.h * (0.58 + open * 0.42);
    const width = spec.width * geo.w * open * (0.62 + compression * 0.56);
    const depthShift = Math.cos(angle3d) * geo.w * 0.055 * spec.side;
    const curl = spec.curl + Math.sin(time * 0.00031 + spec.seed) * 0.055;
    const pointsLeft = [];
    const pointsRight = [];
    const centerPoints = [];
    const slices = state.mobile ? 18 : 29;
    for (let i = 0; i <= slices; i += 1) {
      const s = i / slices;
      const belly = Math.pow(Math.sin(Math.PI * s), 0.80);
      const outward = spec.side * length * spec.lateral * belly * open;
      const returnToCenter = -spec.side * length * spec.wrap * Math.pow(s, 2.25) * open;
      const centerX = attach.x + depthShift * belly + outward + returnToCenter + curl * length * 0.12 * s * s;
      const centerY = attach.y - length * s + Math.sin(s * Math.PI) * length * 0.035;
      const organic = 1 + Math.sin(s * 9.2 + spec.seed) * 0.055 + Math.sin(s * 17.4 + spec.seed * 0.7) * 0.025;
      const half = belly * width * organic;
      const normalX = compression;
      const normalY = spec.side * (0.08 + 0.05 * Math.sin(s * Math.PI));
      pointsLeft.push({ x: centerX - half * normalX, y: centerY - half * normalY });
      pointsRight.push({ x: centerX + half * normalX, y: centerY + half * normalY });
      centerPoints.push({ x: centerX, y: centerY });
    }
    return { pointsLeft, pointsRight, centerPoints, depth, attach };
  }

  function drawPetals(time, spin, geo, frontPass, alphaMultiplier = 1) {
    const sorted = state.petals.slice().sort((a, b) => Math.sin(spin + a.phase) - Math.sin(spin + b.phase));
    for (const spec of sorted) {
      const bloom = smoothstep(spec.reveal, spec.reveal + 0.235, state.progress);
      if (bloom <= 0) continue;
      const petal = petalShape(spec, spin, geo, time, bloom);
      const isFront = petal.depth > 0;
      if (isFront !== frontPass) continue;
      const visibleSlices = Math.max(3, Math.floor((petal.pointsLeft.length - 1) * easeOutCubic(bloom)));
      const left = petal.pointsLeft.slice(0, visibleSlices + 1);
      const right = petal.pointsRight.slice(0, visibleSlices + 1);
      const center = petal.centerPoints.slice(0, visibleSlices + 1);
      const depthAlpha = isFront ? 1 : 0.34;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const fill = ctx.createLinearGradient(petal.attach.x, petal.attach.y, center.at(-1).x, center.at(-1).y);
      fill.addColorStop(0, `rgba(255, 104, 26, ${depthAlpha * bloom * 0.105 * alphaMultiplier})`);
      fill.addColorStop(0.48, `rgba(255, 38, 92, ${depthAlpha * bloom * 0.082 * alphaMultiplier})`);
      fill.addColorStop(1, `rgba(122, 18, 255, ${depthAlpha * bloom * 0.025 * alphaMultiplier})`);
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < left.length; i += 1) ctx.lineTo(left[i].x, left[i].y);
      for (let i = right.length - 1; i >= 0; i -= 1) ctx.lineTo(right[i].x, right[i].y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 34, 92, ${depthAlpha * bloom * 0.13 * alphaMultiplier})`;
      ctx.lineWidth = isFront ? 4.0 : 2.0;
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 101, 30, ${depthAlpha * bloom * 0.72 * alphaMultiplier})`;
      ctx.lineWidth = isFront ? 1.45 : 0.78;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(center[0].x, center[0].y);
      for (let i = 1; i < center.length; i += 1) ctx.lineTo(center[i].x, center[i].y);
      ctx.strokeStyle = `rgba(255, 127, 28, ${depthAlpha * bloom * 0.72 * alphaMultiplier})`;
      ctx.lineWidth = isFront ? 1.16 : 0.62;
      ctx.stroke();
      for (let v = 1; v <= spec.veins; v += 1) {
        const index = Math.min(center.length - 2, Math.floor(v / (spec.veins + 1) * center.length));
        if (index < 1) continue;
        const c = center[index];
        const l = left[index];
        const r = right[index];
        const bend = Math.sin(v * 1.7 + spec.seed) * 4.5;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.quadraticCurveTo(lerp(c.x, l.x, 0.58) + bend, lerp(c.y, l.y, 0.58) - 3, l.x, l.y);
        ctx.moveTo(c.x, c.y);
        ctx.quadraticCurveTo(lerp(c.x, r.x, 0.58) - bend, lerp(c.y, r.y, 0.58) - 3, r.x, r.y);
        ctx.strokeStyle = `rgba(255, 54, 72, ${depthAlpha * bloom * 0.31 * alphaMultiplier})`;
        ctx.lineWidth = 0.58;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawPod(time, spin, geo, alphaMultiplier = 1) {
    const reveal = smoothstep(0.63, 0.88, state.progress);
    if (reveal <= 0) return;
    const center = mainSpinePoint(0.805, spin, geo);
    const rx = geo.w * 0.205 * (0.52 + reveal * 0.48);
    const ry = geo.h * 0.155 * (0.52 + reveal * 0.48);
    const phase = spin * 0.48;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(center.x, center.y - ry * 0.16);
    ctx.rotate(Math.sin(phase) * 0.035);
    const shell = new Path2D();
    shell.ellipse(0, 0, rx, ry, 0, 0, TAU);
    const shellFill = ctx.createRadialGradient(-rx * 0.18, -ry * 0.22, 0, 0, 0, Math.max(rx, ry));
    shellFill.addColorStop(0, `rgba(255, 55, 82, ${0.082 * reveal * alphaMultiplier})`);
    shellFill.addColorStop(0.62, `rgba(207, 26, 133, ${0.048 * reveal * alphaMultiplier})`);
    shellFill.addColorStop(1, `rgba(79, 11, 255, ${0.012 * reveal * alphaMultiplier})`);
    ctx.fillStyle = shellFill; ctx.fill(shell);
    ctx.strokeStyle = `rgba(255, 82, 40, ${0.54 * reveal * alphaMultiplier})`;
    ctx.lineWidth = 1.35; ctx.stroke(shell);
    ctx.save(); ctx.clip(shell);
    for (const cell of state.podCells) {
      const pulse = 0.92 + Math.sin(time * 0.00055 + cell.phase) * 0.08;
      const x = cell.x * rx * 0.94;
      const y = cell.y * ry * 0.94;
      ctx.beginPath();
      ctx.ellipse(x, y, rx * cell.rx * pulse, ry * cell.ry * pulse, cell.rotation + Math.sin(phase) * 0.16, 0, TAU);
      ctx.strokeStyle = `rgba(255, ${48 + Math.round((cell.y + 1) * 18)}, 72, ${reveal * 0.31 * alphaMultiplier})`;
      ctx.lineWidth = 0.62;
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  function drawClusters(time, spin, geo, alphaMultiplier = 1) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const cluster of state.clusters) {
      const center = mainSpinePoint(cluster.t, spin, geo);
      for (const particle of cluster.particles) {
        const settle = smoothstep(cluster.reveal + particle.delay, cluster.reveal + 0.24 + particle.delay, state.progress);
        if (settle <= 0) continue;
        const orbitAngle = particle.orbitPhase + spin * (0.65 + cluster.clusterIndex * 0.14) + time * 0.00008;
        const orbitX = Math.cos(orbitAngle) * particle.orbitRadius * geo.w;
        const orbitY = Math.sin(orbitAngle * 1.17) * particle.orbitRadius * geo.h * 0.33;
        const targetX = particle.targetX * geo.w;
        const targetY = particle.targetY * geo.h;
        const x = center.x + lerp(orbitX, targetX, easeOutCubic(settle));
        const y = center.y + lerp(orbitY, targetY, easeOutCubic(settle));
        const pulse = 0.82 + Math.sin(time * 0.002 + particle.orbitPhase * 5) * 0.18;
        const size = particle.size * (0.55 + settle * 0.65) * pulse;
        ctx.beginPath(); ctx.arc(x, y, size, 0, TAU);
        ctx.fillStyle = `rgba(255, 88, 30, ${(0.28 + settle * 0.46) * alphaMultiplier})`; ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawOrbits(time, orbitSpinValue, geo, frontPass, alphaMultiplier = 1, mode = "all") {
    const reveal = smoothstep(0.03, 0.60, state.progress);
    const cleaned = smoothstep(0.84, 1, state.progress);
    if (reveal <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const orbitCount = state.mobile ? 6 : 9;
    for (let i = 0; i < orbitCount; i += 1) {
      const level = i / Math.max(1, orbitCount - 1);
      const center = mainSpinePoint(0.18 + level * 0.70, orbitSpinValue * 0.42, geo);
      const rx = geo.w * lerp(0.12, 0.34, Math.sin(level * Math.PI));
      const ry = geo.h * lerp(0.030, 0.075, 1 - Math.abs(level - 0.5) * 2);
      const angle = orbitSpinValue * (0.65 + level * 0.28) + i * 0.34;
      const depth = Math.sin(angle + i * 0.31);
      const isFront = depth > 0;
      if (isFront !== frontPass) continue;
      if (mode === "accent" && (!isFront || i % 2 === 1)) continue;
      const orbitClarity = isFront ? lerp(1, 0.70, cleaned) : lerp(1, 0.30, cleaned);
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(Math.sin(angle) * 0.78 + i * 0.11);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.strokeStyle = `rgba(255, 45, 72, ${reveal * (isFront ? 0.10 : 0.05) * orbitClarity * alphaMultiplier})`;
      ctx.lineWidth = isFront ? 0.78 : 0.48;
      ctx.setLineDash(i % 4 === 0 ? [3, 7] : []);
      ctx.stroke();
      ctx.restore();
    }
    ctx.setLineDash([]);

    for (const orbiter of state.orbiters) {
      const local = smoothstep(orbiter.reveal, orbiter.reveal + 0.17, state.progress);
      if (local <= 0) continue;
      const center = mainSpinePoint(orbiter.centerY, orbitSpinValue * 0.32, geo);
      const angle = orbiter.phase + time * 0.00018 * orbiter.speed * TAU;
      const x = center.x + Math.cos(angle) * orbiter.radiusX * geo.w;
      const y = center.y + Math.sin(angle + orbiter.tilt) * orbiter.radiusY * geo.h;
      const depth = Math.sin(angle + orbiter.depthBias);
      const isFront = depth > 0;
      if (isFront !== frontPass) continue;
      if (mode === "accent" && !(isFront && orbiter.major)) continue;
      if (mode === "base" && isFront && orbiter.major) continue;
      const allow = mode === "accent"
        ? lerp(0.92, 0.72, cleaned)
        : isFront ? (orbiter.major ? 1 : lerp(1, 0.32, cleaned)) : lerp(1, 0.24, cleaned);
      const glow = 0.45 + 0.55 * (depth * 0.5 + 0.5);
      ctx.beginPath();
      ctx.arc(x, y, orbiter.size * (0.65 + glow * 0.36), 0, TAU);
      ctx.fillStyle = `rgba(255, ${68 + glow * 45}, 28, ${local * (isFront ? 0.42 : 0.18) * allow * alphaMultiplier})`;
      ctx.fill();
      if (orbiter.ring && (orbiter.major || cleaned < 0.7)) {
        ctx.beginPath();
        ctx.arc(x, y, orbiter.size * 4.0, 0, TAU);
        ctx.strokeStyle = `rgba(255, 45, 86, ${local * (isFront ? 0.20 : 0.08) * allow * alphaMultiplier})`;
        ctx.lineWidth = isFront ? 0.72 : 0.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function growthWindow(start, peak, end, progress) {
    const enter = smoothstep(start, peak, progress);
    const leave = 1 - smoothstep(peak, end, progress);
    return Math.min(enter, leave);
  }

  function fittedRect(image, geo, scale = 1, yOffset = 0) {
    const aspect = image.naturalWidth / image.naturalHeight;
    const h = geo.h * scale;
    const w = h * aspect;
    return { x: geo.cx - w * 0.5, y: geo.cy - h * 0.5 + yOffset, w, h };
  }

  function drawImageFitted(image, geo, options = {}) {
    if (!image) return;
    const { alpha = 1, scale = 1, yOffset = 0, xOffset = 0 } = options;
    const rect = fittedRect(image, geo, scale, yOffset);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, rect.x + xOffset, rect.y, rect.w, rect.h);
    ctx.restore();
    return rect;
  }

  function organicBlobPath(rect, blob, reveal, time) {
    const cx = rect.x + rect.w * blob.cx;
    const cy = rect.y + rect.h * blob.cy;
    const rx = rect.w * blob.rx * (0.48 + reveal * 0.62);
    const ry = rect.h * blob.ry * (0.48 + reveal * 0.62);
    const steps = 32;
    const wobble = blob.wobble || 0.10;
    ctx.beginPath();
    for (let i = 0; i <= steps; i += 1) {
      const a = i / steps * TAU;
      const wave = 1 + Math.sin(a * blob.lobes + blob.seed + time * 0.00025) * wobble + Math.sin(a * (blob.lobes * 0.5 + 1.3) + blob.seed * 0.7) * wobble * 0.45;
      const x = Math.cos(a) * rx * wave;
      const y = Math.sin(a) * ry * wave;
      const xr = x * Math.cos(blob.rotation) - y * Math.sin(blob.rotation);
      const yr = x * Math.sin(blob.rotation) + y * Math.cos(blob.rotation);
      if (i === 0) ctx.moveTo(cx + xr, cy + yr);
      else ctx.lineTo(cx + xr, cy + yr);
    }
    ctx.closePath();
  }

  function layerBlobs(kind) {
    switch (kind) {
      case "bud":
        return [
          { cx: 0.50, cy: 0.56, rx: 0.11, ry: 0.16, rotation: -0.18, lobes: 4, wobble: 0.08, seed: 1.2 },
          { cx: 0.46, cy: 0.45, rx: 0.08, ry: 0.11, rotation: -0.44, lobes: 5, wobble: 0.08, seed: 1.9 },
          { cx: 0.54, cy: 0.44, rx: 0.08, ry: 0.11, rotation: 0.44, lobes: 5, wobble: 0.08, seed: 2.6 }
        ];
      case "petals":
        return [
          { cx: 0.40, cy: 0.50, rx: 0.12, ry: 0.19, rotation: -0.62, lobes: 5, wobble: 0.09, seed: 3.2 },
          { cx: 0.60, cy: 0.49, rx: 0.12, ry: 0.19, rotation: 0.62, lobes: 5, wobble: 0.09, seed: 3.8 },
          { cx: 0.50, cy: 0.59, rx: 0.11, ry: 0.16, rotation: 0.00, lobes: 5, wobble: 0.09, seed: 4.4 },
          { cx: 0.50, cy: 0.37, rx: 0.10, ry: 0.13, rotation: 0.00, lobes: 4, wobble: 0.08, seed: 4.9 }
        ];
      case "bloom":
        return [
          { cx: 0.50, cy: 0.54, rx: 0.17, ry: 0.24, rotation: 0.00, lobes: 6, wobble: 0.10, seed: 5.2 },
          { cx: 0.38, cy: 0.48, rx: 0.12, ry: 0.18, rotation: -0.54, lobes: 5, wobble: 0.08, seed: 5.8 },
          { cx: 0.62, cy: 0.48, rx: 0.12, ry: 0.18, rotation: 0.54, lobes: 5, wobble: 0.08, seed: 6.1 },
          { cx: 0.50, cy: 0.31, rx: 0.16, ry: 0.14, rotation: 0.02, lobes: 5, wobble: 0.07, seed: 6.7 }
        ];
      case "mature-lower":
        return [
          { cx: 0.50, cy: 0.76, rx: 0.15, ry: 0.14, rotation: 0.00, lobes: 6, wobble: 0.07, seed: 7.1 },
          { cx: 0.43, cy: 0.66, rx: 0.11, ry: 0.14, rotation: -0.54, lobes: 5, wobble: 0.07, seed: 7.4 },
          { cx: 0.57, cy: 0.66, rx: 0.11, ry: 0.14, rotation: 0.54, lobes: 5, wobble: 0.07, seed: 7.8 }
        ];
      case "mature-upper":
        return [
          { cx: 0.50, cy: 0.22, rx: 0.17, ry: 0.14, rotation: 0.00, lobes: 5, wobble: 0.06, seed: 8.3 },
          { cx: 0.50, cy: 0.34, rx: 0.20, ry: 0.18, rotation: 0.00, lobes: 6, wobble: 0.06, seed: 8.8 }
        ];
      case "mature-front":
        return [
          { cx: 0.40, cy: 0.50, rx: 0.12, ry: 0.22, rotation: -0.62, lobes: 5, wobble: 0.07, seed: 9.2 },
          { cx: 0.60, cy: 0.50, rx: 0.12, ry: 0.22, rotation: 0.62, lobes: 5, wobble: 0.07, seed: 9.7 },
          { cx: 0.50, cy: 0.29, rx: 0.15, ry: 0.15, rotation: 0.00, lobes: 5, wobble: 0.06, seed: 10.1 }
        ];
      case "mature":
      default:
        return [
          { cx: 0.50, cy: 0.54, rx: 0.22, ry: 0.35, rotation: 0.00, lobes: 7, wobble: 0.08, seed: 7.1 },
          { cx: 0.40, cy: 0.48, rx: 0.12, ry: 0.22, rotation: -0.58, lobes: 5, wobble: 0.07, seed: 7.9 },
          { cx: 0.60, cy: 0.48, rx: 0.12, ry: 0.22, rotation: 0.58, lobes: 5, wobble: 0.07, seed: 8.2 },
          { cx: 0.50, cy: 0.24, rx: 0.16, ry: 0.14, rotation: 0.00, lobes: 5, wobble: 0.06, seed: 8.6 }
        ];
    }
  }

  function getOffscreenSurface(key, width, height) {
    if (!state[key]) {
      const canvas = document.createElement("canvas");
      state[key] = { canvas, ctx: canvas.getContext("2d", { alpha: true }) };
    }
    const surface = state[key];
    if (surface.canvas.width !== width || surface.canvas.height !== height) {
      surface.canvas.width = width;
      surface.canvas.height = height;
    }
    surface.ctx.setTransform(1, 0, 0, 1, 0, 0);
    surface.ctx.globalAlpha = 1;
    surface.ctx.globalCompositeOperation = "source-over";
    surface.ctx.filter = "none";
    surface.ctx.clearRect(0, 0, width, height);
    return surface;
  }

  function organicBlobPathOn(context, rect, blob, reveal, time, inflate = 0) {
    const cx = rect.x + rect.w * blob.cx;
    const cy = rect.y + rect.h * blob.cy;
    const rx = rect.w * blob.rx * (0.48 + reveal * 0.62) + inflate;
    const ry = rect.h * blob.ry * (0.48 + reveal * 0.62) + inflate;
    const steps = 40;
    const wobble = blob.wobble || 0.10;
    context.beginPath();
    for (let i = 0; i <= steps; i += 1) {
      const a = i / steps * TAU;
      const wave = 1 + Math.sin(a * blob.lobes + blob.seed + time * 0.00025) * wobble + Math.sin(a * (blob.lobes * 0.5 + 1.3) + blob.seed * 0.7) * wobble * 0.45;
      const x = Math.cos(a) * rx * wave;
      const y = Math.sin(a) * ry * wave;
      const xr = x * Math.cos(blob.rotation) - y * Math.sin(blob.rotation);
      const yr = x * Math.sin(blob.rotation) + y * Math.cos(blob.rotation);
      if (i === 0) context.moveTo(cx + xr, cy + yr);
      else context.lineTo(cx + xr, cy + yr);
    }
    context.closePath();
  }

  function drawSoftMaskedImageRect(image, rect, params) {
    const { alpha, reveal, time, xOffset = 0, yOffset = 0, blobs = [] } = params;
    if (!image || alpha <= 0.001 || reveal <= 0.001 || !blobs.length) return;

    const pad = 32;
    const width = Math.max(2, Math.ceil(rect.w + pad * 2));
    const height = Math.max(2, Math.ceil(rect.h + pad * 2));
    const imageSurface = getOffscreenSurface("imageSurface", width, height);
    const maskSurface = getOffscreenSurface("maskSurface", width, height);
    const ictx = imageSurface.ctx;
    const mctx = maskSurface.ctx;
    const localRect = { x: pad, y: pad, w: rect.w, h: rect.h };

    // Imagen fuente intacta en una superficie independiente.
    ictx.drawImage(image, localRect.x + xOffset, localRect.y + yOffset, localRect.w, localRect.h);

    // La máscara se construye como unión de todas las partes orgánicas.
    // No se aplica destination-in por cada blob, porque eso intersectaría las formas
    // y terminaría eliminando casi toda la imagen.
    for (const blob of blobs) {
      organicBlobPathOn(mctx, localRect, blob, reveal, time, 12);
      mctx.save();
      mctx.filter = "blur(16px)";
      mctx.fillStyle = "rgba(255,255,255,0.34)";
      mctx.fill();
      mctx.restore();

      organicBlobPathOn(mctx, localRect, blob, reveal, time, 5);
      mctx.save();
      mctx.filter = "blur(7px)";
      mctx.fillStyle = "rgba(255,255,255,0.68)";
      mctx.fill();
      mctx.restore();

      organicBlobPathOn(mctx, localRect, blob, reveal, time, 0);
      mctx.fillStyle = "rgba(255,255,255,1)";
      mctx.fill();
    }

    // Aplicar la unión de la máscara una sola vez.
    ictx.globalCompositeOperation = "destination-in";
    ictx.drawImage(maskSurface.canvas, 0, 0);
    ictx.globalCompositeOperation = "source-over";

    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.drawImage(imageSurface.canvas, rect.x - pad, rect.y - pad);
    ctx.restore();
  }

  function drawOrganicMaskedLayer(image, geo, params) {
    const { alpha, reveal, time, scale = 1, yOffset = 0, xOffset = 0, blobs = [] } = params;
    if (!image || alpha <= 0.001 || reveal <= 0.001) return;
    const rect = fittedRect(image, geo, scale, yOffset);
    drawSoftMaskedImageRect(image, rect, { alpha, reveal, time, xOffset, yOffset: 0, blobs });
  }

  function drawGrowthLayers(time, geo) {
    for (const layer of state.growthLayers) {
      const endValue = layer.kind === "mature" ? Math.max(layer.end, 0.985) : layer.end;
      const window = growthWindow(layer.start, layer.peak, endValue, state.progress);
      if (window <= 0.001 || !layer.image) continue;
      const reveal = smoothstep(layer.start, layer.peak, state.progress);
      const settle = smoothstep(layer.peak, endValue, state.progress);
      const alphaBase = layer.kind === "mature" ? 0.04 : 0.10;
      const alphaWindow = layer.kind === "mature" ? easeInOutSine(window) : smoothstep(0, 1, window);
      const alphaReveal = layer.kind === "mature" ? Math.pow(reveal, 1.25) : (0.35 + reveal * 0.65);
      drawOrganicMaskedLayer(layer.image, geo, {
        alpha: layer.opacity * (alphaBase + alphaWindow * (1 - alphaBase)) * alphaReveal,
        reveal,
        time,
        scale: (Number(layer.scale) || 1) * lerp(0.988, 1.008, settle),
        yOffset: (1 - reveal) * geo.h * 0.010 + (Number(layer.yOffset) || 0) * geo.h,
        xOffset: Math.sin(time * 0.00022 + layer.start * 10) * (Number(layer.drift) || 0) * (1 - settle * 0.7),
        blobs: layerBlobs(layer.kind)
      });
    }
  }

  function bandPath(rect, yStart, yEnd, waveAmp, time, seed) {
    const steps = 28;
    ctx.beginPath();
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const x = rect.x + rect.w * t;
      const top = rect.y + rect.h * (yStart + Math.sin(t * TAU * 1.6 + time * 0.00023 + seed) * waveAmp);
      if (i === 0) ctx.moveTo(x, top);
      else ctx.lineTo(x, top);
    }
    for (let i = steps; i >= 0; i -= 1) {
      const t = i / steps;
      const x = rect.x + rect.w * t;
      const bottom = rect.y + rect.h * (yEnd + Math.sin(t * TAU * 1.35 + time * 0.0002 + seed + 2.2) * waveAmp * 0.7);
      ctx.lineTo(x, bottom);
    }
    ctx.closePath();
  }

  function drawFinalComposite(time, geo, drawFrontVeils = false) {
    const image = state.finalTexture;
    if (!image) return;
    const growth = smoothstep(CONFIG.finalTextureStart, CONFIG.finalTextureFull, state.progress);
    if (growth <= 0.001) return;
    const baseAlpha = CONFIG.finalBaseAlpha * smoothstep(0, 0.35, growth);
    const frontAlpha = CONFIG.finalFrontAlpha * smoothstep(0.18, 1, growth);
    const breatheAmount = Number(CONFIG.finalTextureBreathing) || 0;
    const breathe = reducedMotion ? 1 : 1 + Math.sin(time * 0.00058) * breatheAmount;
    const settleScale = lerp(0.988, 1.0, easeOutCubic(growth)) * breathe * (Number(CONFIG.finalTextureScale) || 1);
    const finalYOffset = (Number(CONFIG.finalTextureYOffset) || 0) * geo.h;
    const rect = fittedRect(image, geo, settleScale, (1 - easeOutCubic(growth)) * geo.h * 0.008 + finalYOffset);

    if (!drawFrontVeils) {
      ctx.save();
      ctx.globalAlpha = baseAlpha;
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
      ctx.restore();

      drawSoftMaskedImageRect(image, rect, {
        alpha: CONFIG.finalBackLowerAlpha * growth,
        reveal: growth,
        time,
        blobs: layerBlobs("mature-lower")
      });
      drawSoftMaskedImageRect(image, rect, {
        alpha: CONFIG.finalBackMiddleAlpha * growth,
        reveal: growth,
        time,
        blobs: layerBlobs("mature")
      });
      drawSoftMaskedImageRect(image, rect, {
        alpha: CONFIG.finalBackUpperAlpha * growth,
        reveal: growth,
        time,
        blobs: layerBlobs("mature-upper")
      });
      return;
    }

    drawSoftMaskedImageRect(image, rect, {
      alpha: frontAlpha * 0.86,
      reveal: growth,
      time,
      blobs: layerBlobs("mature-front")
    });
  }

  function drawGlow(geo) {
    const strength = smoothstep(0.18, 0.88, state.progress);
    if (strength <= 0) return;
    const gradient = ctx.createRadialGradient(geo.cx, geo.cy + geo.h * 0.12, 0, geo.cx, geo.cy + geo.h * 0.12, geo.w * 0.72);
    gradient.addColorStop(0, `rgba(255, 30, 90, ${0.075 * strength})`);
    gradient.addColorStop(0.45, `rgba(255, 50, 45, ${0.032 * strength})`);
    gradient.addColorStop(1, "rgba(255, 50, 45, 0)");
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = gradient; ctx.fillRect(geo.cx - geo.w, geo.cy - geo.h * 0.5, geo.w * 2, geo.h); ctx.restore();
  }

  function render(time) {
    const delta = Math.min(50, time - state.lastTime);
    state.lastTime = time;
    const scrollEase = reducedMotion ? 1 : 1 - Math.pow(1 - CONFIG.scrollSmoothing, delta / 16.67);
    const pointerEase = 1 - Math.pow(1 - CONFIG.pointerSmoothing, delta / 16.67);
    state.progress = lerp(state.progress, state.targetProgress, scrollEase);
    state.pointerX = lerp(state.pointerX, state.pointerTargetX, pointerEase);
    state.pointerY = lerp(state.pointerY, state.pointerTargetY, pointerEase);

    ctx.clearRect(0, 0, state.width, state.height);
    const geo = geometry();
    const sSpin = strandSpin(time);
    const oSpin = orbitalSpin(time);

    drawGlow(geo);

    if (CONFIG.showGrowthLayers) drawGrowthLayers(time, geo);

    if (CONFIG.showRoots) drawRoots(time, sSpin, geo, CONFIG.rootAlpha);
    if (CONFIG.showOrbits) drawOrbits(time, oSpin, geo, false, CONFIG.orbitBackAlpha, "base");
    if (CONFIG.showStrands) drawStrands(time, sSpin, geo, false, CONFIG.strandBackAlpha, "all");
    if (CONFIG.showPetals) drawPetals(time, sSpin, geo, false, CONFIG.petalBackAlpha);
    if (CONFIG.showPod) drawPod(time, sSpin, geo, CONFIG.podAlpha);
    if (CONFIG.showClusters) drawClusters(time, sSpin, geo, CONFIG.clusterAlpha);
    if (CONFIG.showStrands) drawStrands(time, sSpin, geo, true, CONFIG.strandFrontBaseAlpha, "base");
    if (CONFIG.showPetals) drawPetals(time, sSpin, geo, true, CONFIG.petalFrontBaseAlpha);
    if (CONFIG.showOrbits) drawOrbits(time, oSpin, geo, true, CONFIG.orbitFrontBaseAlpha, "base");

    if (CONFIG.showFinalTexture) {
      drawFinalComposite(time, geo, false);
      drawFinalComposite(time, geo, true);
    }

    const finalized = smoothstep(0.92, 1, state.progress);
    const accentStrands = lerp(CONFIG.accentStrandAlpha, CONFIG.accentStrandAlpha * 0.84, finalized);
    const accentOrbitals = lerp(CONFIG.accentOrbitalAlpha, CONFIG.accentOrbitalAlpha * 0.86, finalized);
    if (CONFIG.showStrands) drawStrands(time, sSpin, geo, true, accentStrands, "accent");
    if (CONFIG.showOrbits) drawOrbits(time, oSpin, geo, true, accentOrbitals, "accent");

    if (progressLabel) progressLabel.textContent = String(Math.round(state.progress * 100)).padStart(3, "0");
    requestAnimationFrame(render);
  }

  function getConfig() {
    return deepClone(CONFIG);
  }

  function getDefaults() {
    return deepClone(DEFAULT_CONFIG);
  }

  function persistConfig() {
    try {
      localStorage.setItem("organic-animation-config-v9", JSON.stringify(CONFIG));
      return true;
    } catch {
      return false;
    }
  }

  async function setConfig(partial, options = {}) {
    const { rebuild = false, reloadTextures = false, persist = false } = options;
    mergeConfig(CONFIG, partial);
    if (rebuild) buildScene();
    if (reloadTextures) await loadTextures();
    if (persist) persistConfig();
    window.dispatchEvent(new CustomEvent("organic-config-change", { detail: getConfig() }));
    return getConfig();
  }

  async function replaceConfig(nextConfig, options = {}) {
    for (const key of Object.keys(CONFIG)) delete CONFIG[key];
    mergeConfig(CONFIG, deepClone(DEFAULT_CONFIG));
    mergeConfig(CONFIG, nextConfig);
    buildScene();
    await loadTextures();
    if (options.persist) persistConfig();
    window.dispatchEvent(new CustomEvent("organic-config-change", { detail: getConfig() }));
    return getConfig();
  }

  async function resetConfig(options = {}) {
    return replaceConfig(DEFAULT_CONFIG, options);
  }

  function setProgress(value) {
    previewProgress = clamp(Number(value) || 0);
    state.targetProgress = previewProgress;
    return previewProgress;
  }

  function useScrollProgress() {
    previewProgress = null;
    updateScroll();
  }

  window.OrganicAnimator = {
    getConfig,
    getDefaults,
    setConfig,
    replaceConfig,
    resetConfig,
    setProgress,
    useScrollProgress,
    persistConfig,
    rebuild: buildScene,
    reloadTextures: loadTextures,
    resize,
    getProgress: () => state.progress
  };

  window.dispatchEvent(new CustomEvent("organic-animator-ready", { detail: window.OrganicAnimator }));

  addEventListener("resize", resize, { passive: true });
  addEventListener("scroll", updateScroll, { passive: true });
  addEventListener("pointermove", updatePointer, { passive: true });
  addEventListener("pointerleave", () => { state.pointerTargetX = 0; state.pointerTargetY = 0; }, { passive: true });

  resize();
  loadTextures().finally(() => { document.documentElement.classList.add("is-ready"); requestAnimationFrame(render); });
})();
