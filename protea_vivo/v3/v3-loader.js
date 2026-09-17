(() => {
  'use strict';

  const host = document.querySelector('.canvas-injection-note');
  const hero = document.getElementById('observatorio');
  if (!host || !hero || host.dataset.v3RealLoader === '1') return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => matchMedia('(max-width:959px)').matches;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  /*
   * LOADER V3 R16
   * - El progreso depende de recursos realmente resueltos, no del reloj.
   * - 3 s es sólo la permanencia mínima estética.
   * - 30 s es un fail-safe; no es el mecanismo normal de liberación.
   * - PerformanceObserver se usa para telemetría/auditoría, no como semáforo.
   */
  const CFG = Object.freeze({
    timing: {
      minDisplay: reduceMotion ? 180 : 3000,
      dock: reduceMotion ? 120 : 850,
      settle: reduceMotion ? 20 : 70,
      fade: reduceMotion ? 160 : 360,
      maxWait: reduceMotion ? 2500 : 30000,
      heroFrameWait: reduceMotion ? 900 : 8000
    },
    drive: {
      artMobile: 960,
      artDesktop: 1600,
      teamMobile: 720,
      teamDesktop: 1200
    },
    marks: {
      gap: 3,
      length: 8,
      thickness: 1,
      spacing: 3.4,
      min: 180,
      max: 480,
      majorDivisions: 24,
      majorLength: 14,
      cardinalDivisions: 4,
      cardinalLength: 18
    },
    rings: [
      { inset: 0, duration: 6.8, direction: 1, opacity: .46, dash: false, mode: 'burst-a' },
      { inset: 6, duration: 4.4, direction: -1, opacity: .34, dash: true, mode: 'burst-b' },
      { inset: 12, duration: 8.6, direction: 1, opacity: .26, dash: true, mode: 'burst-a' },
      { inset: 19, duration: 3.2, direction: -1, opacity: .38, dash: true, mode: 'burst-b' },
      { inset: 27, duration: 11.2, direction: 1, opacity: .20, dash: false, mode: 'burst-a' },
      { inset: 35, duration: 5.4, direction: -1, opacity: .28, dash: true, mode: 'implode' },
      { inset: 43, duration: 14, direction: 1, opacity: .18, dash: false, mode: 'implode' }
    ],
    scans: [
      { inset: -5, duration: 2.8, direction: 1, opacity: .50 },
      { inset: 8, duration: 4.6, direction: -1, opacity: .32 },
      { inset: 20, duration: 7.2, direction: 1, opacity: .24 },
      { inset: 33, duration: 10.4, direction: -1, opacity: .16 }
    ],
    heroAssets: [
      'components/hero/assets/bg_far.png',
      'components/hero/assets/bg_mid.png',
      'components/hero/assets/base_sharp.png',
      'components/hero/assets/network_far.png',
      'components/hero/assets/network_mid.png',
      'components/hero/assets/network_near.png',
      'components/hero/assets/glow_far.png',
      'components/hero/assets/glow_mid.png'
    ]
  });

  const style = document.createElement('style');
  style.id = 'v3-loader-r16-style';
  style.textContent = `
    .protea-v3 .v3-preloader__lens{contain:layout style!important;overflow:visible!important}
    .protea-v3 .v3-preloader__readiness{position:absolute;left:50%;top:68%;z-index:8;transform:translate(-50%,-50%);font:600 8px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.16em;color:rgba(255,255,255,.48);white-space:nowrap;pointer-events:none}
    .protea-v3 .v3-preloader__shockwaves{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:visible}
    .protea-v3 .v3-preloader__shockwaves i{position:absolute;inset:0;border:1px solid rgba(255,255,255,.72);border-radius:50%;opacity:0;transform:scale(.58);will-change:transform,opacity}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__brand{animation:v3R16BrandCollapse var(--v3-preload-align-ms) cubic-bezier(.14,.72,.14,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__ring[data-dock="burst-a"]{animation:v3R16BurstA var(--v3-preload-align-ms) cubic-bezier(.08,.72,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__ring[data-dock="burst-b"]{animation:v3R16BurstB var(--v3-preload-align-ms) cubic-bezier(.08,.72,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__ring[data-dock="implode"]{animation:v3R16Implode var(--v3-preload-align-ms) cubic-bezier(.12,.76,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__scan{animation:v3R16ScanBurst var(--v3-preload-align-ms) cubic-bezier(.08,.72,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__orbit{animation:v3R16OrbitBurst var(--v3-preload-align-ms) cubic-bezier(.08,.72,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__loadbar{animation:v3R16CompassBurst var(--v3-preload-align-ms) cubic-bezier(.08,.72,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__measurements,.protea-v3 .v3-preloader.is-aligning .v3-preloader__telemetry,.protea-v3 .v3-preloader.is-aligning .v3-preloader__readiness{animation:v3R16ReadoutBurst var(--v3-preload-align-ms) ease-out both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__particles{animation:v3R16ParticleField var(--v3-preload-align-ms) ease-out both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__particles i{animation:v3R16ParticleExplode var(--v3-preload-align-ms) cubic-bezier(.05,.72,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__shockwaves i:nth-child(1){animation:v3R16Shock 620ms cubic-bezier(.08,.7,.1,1) 0ms both}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__shockwaves i:nth-child(2){animation:v3R16Shock 700ms cubic-bezier(.08,.7,.1,1) 80ms both}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__shockwaves i:nth-child(3){animation:v3R16Shock 760ms cubic-bezier(.08,.7,.1,1) 150ms both}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__shockwaves i:nth-child(4){animation:v3R16Shock 820ms cubic-bezier(.08,.7,.1,1) 220ms both}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__lens::before{animation:v3R16RebuildOuter var(--v3-preload-align-ms) cubic-bezier(.12,.76,.12,1) both!important}
    .protea-v3 .v3-preloader.is-aligning .v3-preloader__lens::after{animation:v3R16RebuildInner var(--v3-preload-align-ms) cubic-bezier(.12,.76,.12,1) both!important}
    @keyframes v3R16BrandCollapse{0%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1)}18%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1.10)}42%{opacity:.12;transform:translate3d(-50%,-50%,0) scale(.48)}100%{opacity:0;transform:translate3d(-50%,-50%,0) scale(.08)}}
    @keyframes v3R16BurstA{0%{transform:scale(1) rotate(0deg);opacity:.52}22%{transform:scale(1.16) rotate(18deg);opacity:.80}62%{transform:scale(2.05) rotate(132deg);opacity:.48}100%{transform:scale(3.15) rotate(260deg);opacity:0}}
    @keyframes v3R16BurstB{0%{transform:scale(1) rotate(0deg);opacity:.42}25%{transform:scale(.82) rotate(-28deg);opacity:.78}58%{transform:scale(1.82) rotate(-168deg);opacity:.42}100%{transform:scale(2.72) rotate(-310deg);opacity:0}}
    @keyframes v3R16Implode{0%{transform:scale(1) rotate(0deg);opacity:.34}34%{transform:scale(.34) rotate(110deg);opacity:.86}56%{transform:scale(.12) rotate(190deg);opacity:.24}100%{transform:scale(.02) rotate(300deg);opacity:0}}
    @keyframes v3R16ScanBurst{0%{transform:scale(1) rotate(0deg);opacity:.5}30%{transform:scale(1.3) rotate(140deg);opacity:.7}100%{transform:scale(3.45) rotate(620deg);opacity:0}}
    @keyframes v3R16OrbitBurst{0%{transform:scale(1) rotate(0deg);opacity:1}28%{transform:scale(1.18) rotate(-90deg);opacity:1}100%{transform:scale(2.6) rotate(-520deg);opacity:0}}
    @keyframes v3R16CompassBurst{0%{transform:scale(1) rotate(0deg);opacity:1}18%{transform:scale(1.12) rotate(3deg);opacity:1}48%{transform:scale(1.7) rotate(16deg);opacity:.78}100%{transform:scale(2.55) rotate(38deg);opacity:0}}
    @keyframes v3R16ReadoutBurst{0%{transform:scale(1);opacity:1}28%{transform:scale(1.14);opacity:.9}70%{transform:scale(1.72);opacity:.25}100%{transform:scale(2.15);opacity:0}}
    @keyframes v3R16ParticleField{0%{opacity:1}72%{opacity:.95}100%{opacity:0}}
    @keyframes v3R16ParticleExplode{0%{transform:translate(-50%,-50%) translate3d(0,0,0) scale(1);opacity:.55}22%{opacity:1}100%{transform:translate(-50%,-50%) translate3d(var(--burst-x),var(--burst-y),0) scale(.15);opacity:0}}
    @keyframes v3R16Shock{0%{transform:scale(.58);opacity:0}12%{opacity:.9}100%{transform:scale(3.65);opacity:0}}
    @keyframes v3R16RebuildOuter{0%,54%{transform:scale(.06) rotate(-240deg);opacity:0}68%{transform:scale(.42) rotate(-90deg);opacity:.68}82%{transform:scale(1.28) rotate(14deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:.72}}
    @keyframes v3R16RebuildInner{0%,61%{transform:scale(2.8) rotate(240deg);opacity:0}73%{transform:scale(1.55) rotate(88deg);opacity:.42}88%{transform:scale(.82) rotate(-8deg);opacity:.92}100%{transform:scale(1) rotate(0deg);opacity:.58}}
    @media (prefers-reduced-motion:reduce){.protea-v3 .v3-preloader.is-aligning *{animation:none!important}.protea-v3 .v3-preloader__readiness{display:none}}
  `;
  document.head.append(style);

  host.dataset.v3RealLoader = '1';
  host.id = 'v3-preloader';
  host.classList.add('v3-preloader');
  host.style.setProperty('--v3-preload-align-ms', `${CFG.timing.dock}ms`);
  host.style.setProperty('--v3-preload-fade-ms', `${CFG.timing.fade}ms`);
  host.innerHTML = `
    <div class="v3-preloader__lens" aria-hidden="true">
      <div class="v3-preloader__brand"><span class="brand-mark">protea</span></div>
      <span class="v3-preloader__readiness">LOAD 000%</span>
    </div>`;

  document.documentElement.classList.add('v3-preloading');
  document.body.classList.add('v3-preloading');

  const lens = host.querySelector('.v3-preloader__lens');
  const readiness = host.querySelector('.v3-preloader__readiness');
  const report = {
    version: 'R16-real-loader',
    startedAt: performance.now(),
    timedOut: false,
    progress: 0,
    tasks: [],
    resources: []
  };
  window.__PROTEA_V3_LOAD_REPORT__ = report;

  let observer = null;
  try {
    if ('PerformanceObserver' in window) {
      observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          report.resources.push({
            name: entry.name,
            initiatorType: entry.initiatorType,
            duration: Math.round(entry.duration * 10) / 10,
            transferSize: entry.transferSize || 0,
            decodedBodySize: entry.decodedBodySize || 0,
            responseEnd: Math.round(entry.responseEnd * 10) / 10
          });
        });
      });
      observer.observe({ type: 'resource', buffered: true });
    }
  } catch (_) {}

  const measurementNodes = [];
  const telemetryNodes = [];
  let telemetryTimer = 0;
  let loadbar = null;
  let segments = [];
  let currentRadius = 0;
  let released = false;
  let targetProgress = 0;
  let visualProgress = 0;
  let progressFrame = 0;

  function buildVisuals() {
    CFG.rings.forEach((ringCfg, index) => {
      const ring = document.createElement('i');
      ring.className = 'v3-preloader__ring v3-preloader__ring--generated v3-preloader__dynamic';
      ring.dataset.dock = ringCfg.mode;
      ring.style.inset = `${ringCfg.inset}%`;
      ring.style.opacity = ringCfg.opacity;
      ring.style.border = `1px ${ringCfg.dash ? 'dashed' : 'solid'} rgba(255,255,255,.92)`;
      ring.style.animation = `${ringCfg.direction < 0 ? 'v3PreloadSpinReverse' : 'v3PreloadSpin'} ${ringCfg.duration}s linear infinite`;
      lens.append(ring);

      const orbit = document.createElement('span');
      orbit.className = 'v3-preloader__orbit v3-preloader__dynamic';
      orbit.style.cssText = `position:absolute;inset:${ringCfg.inset}%;z-index:2;border-radius:50%;pointer-events:none;animation:${ringCfg.direction < 0 ? 'v3PreloadSpinReverse' : 'v3PreloadSpin'} ${Math.max(2.2, ringCfg.duration * .72)}s linear infinite;`;
      const count = index % 2 ? 1 : 2;
      for (let markerIndex = 0; markerIndex < count; markerIndex += 1) {
        const marker = document.createElement('i');
        const angle = ((markerIndex / count) * Math.PI * 2) + index * .51;
        marker.style.cssText = `position:absolute;left:${(50 + Math.cos(angle) * 50).toFixed(2)}%;top:${(50 + Math.sin(angle) * 50).toFixed(2)}%;width:${markerIndex ? 2 : 3}px;height:${markerIndex ? 2 : 3}px;transform:translate(-50%,-50%);border-radius:50%;background:#fff;box-shadow:0 0 7px rgba(255,255,255,.55);opacity:${markerIndex ? .55 : .9};`;
        orbit.append(marker);
      }
      lens.append(orbit);
    });

    CFG.scans.forEach((scanCfg) => {
      const scan = document.createElement('i');
      scan.className = 'v3-preloader__scan v3-preloader__dynamic';
      scan.style.inset = `${scanCfg.inset}%`;
      scan.style.opacity = scanCfg.opacity;
      scan.style.animation = `${scanCfg.direction < 0 ? 'v3PreloadSpinReverse' : 'v3PreloadSpin'} ${scanCfg.duration}s linear infinite`;
      lens.append(scan);
    });

    const measures = document.createElement('span');
    measures.className = 'v3-preloader__measurements v3-preloader__dynamic';
    measures.style.cssText = 'position:absolute;inset:0;z-index:3;pointer-events:none;';
    for (let index = 0; index < 12; index += 1) {
      const angle = index * 30;
      const node = document.createElement('span');
      node.dataset.baseAngle = angle;
      node.textContent = String(angle).padStart(3, '0');
      node.style.cssText = `position:absolute;left:50%;top:50%;font:500 8px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:rgba(255,255,255,.58);letter-spacing:.12em;white-space:nowrap;transform:translate(-50%,-50%) rotate(${angle}deg) translateY(calc(var(--v3-measure-radius) * -1)) rotate(${-angle}deg);`;
      measures.append(node);
      measurementNodes.push(node);
    }
    lens.append(measures);

    const telemetry = document.createElement('span');
    telemetry.className = 'v3-preloader__telemetry v3-preloader__dynamic';
    telemetry.style.cssText = 'position:absolute;inset:0;z-index:4;pointer-events:none;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;';
    [
      ['BIO',31,43,.61,.96,3,1.7],
      ['SYNC',69,44,71,99,1,1.25],
      ['Δ',50,76,11,28,1,2.1],
      ['PHI',50,24,.42,.88,2,1.45]
    ].forEach(([label,x,y,min,max,decimals,speed], index) => {
      const node = document.createElement('span');
      node.style.cssText = `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);display:flex;gap:4px;color:rgba(255,255,255,.68);font-size:7px;letter-spacing:.11em;white-space:nowrap;`;
      node.innerHTML = `<b style="font:600 7px/1 inherit;color:rgba(255,255,255,.42)">${label}</b><i style="font:500 8px/1 inherit;font-style:normal;color:rgba(255,255,255,.82)">0</i>`;
      telemetry.append(node);
      telemetryNodes.push({ value: node.querySelector('i'), min, max, decimals, speed, index });
    });
    lens.append(telemetry);

    const particles = document.createElement('span');
    particles.className = 'v3-preloader__particles v3-preloader__dynamic';
    particles.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
    for (let index = 0; index < 24; index += 1) {
      const point = document.createElement('i');
      const t = ((index * 47) % 101) / 100;
      const rr = .14 + (.46 - .14) * t;
      const angle = index * 2.3999632297;
      const x = 50 + Math.cos(angle) * rr * 100;
      const y = 50 + Math.sin(angle) * rr * 100;
      const size = 1 + (index % 3);
      const burst = 120 + (index % 7) * 18;
      point.style.cssText = `position:absolute;left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;width:${size}px;height:${size}px;transform:translate(-50%,-50%);border-radius:50%;background:#fff;opacity:${(.14 + (index % 5) * .07).toFixed(2)};box-shadow:0 0 ${3 + size * 2}px rgba(255,255,255,.32);--burst-x:${(Math.cos(angle) * burst).toFixed(1)}px;--burst-y:${(Math.sin(angle) * burst).toFixed(1)}px;`;
      particles.append(point);
      if (!reduceMotion && point.animate) {
        point.animate([
          { transform: 'translate(-50%,-50%) translate3d(-2px,2px,0) scale(.72)', opacity: .10 },
          { transform: 'translate(-50%,-50%) translate3d(3px,-3px,0) scale(1.18)', opacity: .62 },
          { transform: 'translate(-50%,-50%) translate3d(1px,2px,0) scale(.88)', opacity: .24 }
        ], { duration: 1500 + (index * 173) % 1900, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', delay: -(index * 79) });
      }
    }
    lens.append(particles);

    const shockwaves = document.createElement('span');
    shockwaves.className = 'v3-preloader__shockwaves';
    shockwaves.innerHTML = '<i></i><i></i><i></i><i></i>';
    lens.append(shockwaves);

    const tick = () => {
      const elapsed = (performance.now() - report.startedAt) / 1000;
      measurementNodes.forEach((node, index) => {
        const base = Number(node.dataset.baseAngle || 0);
        node.textContent = String((base + Math.floor(elapsed * 7) + index * 2) % 360).padStart(3, '0');
      });
      telemetryNodes.forEach(({ value, min, max, decimals, speed, index }) => {
        const wave = (Math.sin(elapsed * speed + index * 1.37) + 1) / 2;
        value.textContent = (min + (max - min) * wave).toFixed(decimals);
      });
    };
    tick();
    telemetryTimer = window.setInterval(tick, 90);
  }

  function buildLoadbar(radius) {
    loadbar?.remove();
    loadbar = document.createElement('span');
    loadbar.className = 'v3-preloader__loadbar';
    loadbar.style.cssText = 'position:absolute;inset:0;z-index:6;border-radius:50%;pointer-events:none;overflow:visible;';
    const m = CFG.marks;
    const circumference = 2 * Math.PI * (radius + m.gap + m.length / 2);
    const raw = clamp(Math.round(circumference / m.spacing), m.min, m.max);
    const count = Math.round(raw / m.majorDivisions) * m.majorDivisions;
    const majorStep = count / m.majorDivisions;
    const cardinalStep = count / 4;
    segments = [];

    for (let index = 0; index < count; index += 1) {
      const angle = index / count * Math.PI * 2 - Math.PI / 2;
      const cardinal = index % cardinalStep === 0;
      const major = cardinal || index % majorStep === 0;
      const length = cardinal ? m.cardinalLength : major ? m.majorLength : m.length;
      const thickness = cardinal ? 1.5 : major ? 1.25 : m.thickness;
      const r = radius + m.gap + length / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const rotation = angle * 180 / Math.PI + 90;
      const segment = document.createElement('span');
      segment.dataset.tick = cardinal ? 'cardinal' : major ? 'major' : 'minor';
      segment.style.cssText = `position:absolute;left:calc(50% + ${x.toFixed(2)}px);top:calc(50% + ${y.toFixed(2)}px);width:${thickness}px;height:${length}px;background:#fff;opacity:${cardinal ? .13 : major ? .10 : .07};transform:translate3d(-50%,-50%,0) rotate(${rotation.toFixed(3)}deg);transform-origin:50% 50%;transition:opacity .12s linear;will-change:opacity;`;
      loadbar.append(segment);
      segments.push(segment);
    }
    lens.append(loadbar);
    paintProgress(true);
  }

  function paintProgress(immediate = false) {
    if (!segments.length) return;
    const p = clamp(visualProgress, 0, 1);
    const lit = Math.round(p * segments.length);
    segments.forEach((segment, index) => {
      const on = index < lit;
      const active = segment.dataset.tick === 'cardinal' ? .98 : segment.dataset.tick === 'major' ? .92 : .86;
      const idle = segment.dataset.tick === 'cardinal' ? .13 : segment.dataset.tick === 'major' ? .10 : .07;
      segment.style.opacity = String(on ? active : idle);
      if (immediate) segment.style.transition = 'none';
    });
    if (immediate) requestAnimationFrame(() => segments.forEach((segment) => { segment.style.transition = 'opacity .12s linear'; }));
    readiness.textContent = `LOAD ${String(Math.round(p * 100)).padStart(3, '0')}%`;
  }

  function animateProgress() {
    if (released) return;
    visualProgress += (targetProgress - visualProgress) * .11;
    if (Math.abs(targetProgress - visualProgress) < .002) visualProgress = targetProgress;
    paintProgress();
    progressFrame = requestAnimationFrame(animateProgress);
  }

  function syncLens() {
    const rect = hero.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const radius = mobile()
      ? clamp(Math.min(width * .38, height * .19), 96, 156)
      : clamp(Math.min(width * .34, height * .255), 118, 310);
    const x = rect.left + (mobile() ? width * .5 : width * .76 - 50);
    const y = rect.top + (mobile() ? height * .72 : height * .52);
    const dx = x - (hostRect.left + hostRect.width * .5);
    const dy = y - (hostRect.top + hostRect.height * .5);
    host.style.setProperty('--v3-preload-dx', `${dx}px`);
    host.style.setProperty('--v3-preload-dy', `${dy}px`);
    host.style.setProperty('--v3-preload-r', `${radius}px`);
    host.style.setProperty('--v3-measure-radius', `${radius * .72}px`);
    host.style.setProperty('--v3-preload-angle', '0deg');
    if (!currentRadius || Math.abs(radius - currentRadius) > 8) {
      currentRadius = radius;
      buildLoadbar(radius);
    }
  }

  function responsiveDriveUrl(img) {
    const src = img.currentSrc || img.getAttribute('src') || '';
    if (!src.includes('drive.google.com/thumbnail')) return src;
    const team = Boolean(img.closest('.v3-team-card'));
    const width = mobile()
      ? (team ? CFG.drive.teamMobile : CFG.drive.artMobile)
      : (team ? CFG.drive.teamDesktop : CFG.drive.artDesktop);
    if (/([?&]sz=)w\d+/.test(src)) return src.replace(/([?&]sz=)w\d+/, `$1w${width}`);
    return `${src}${src.includes('?') ? '&' : '?'}sz=w${width}`;
  }

  function waitForDomImage(img) {
    return new Promise((resolve) => {
      const desired = responsiveDriveUrl(img);
      if (desired && desired !== img.getAttribute('src')) img.src = desired;
      img.loading = 'eager';
      img.decoding = 'async';
      if ('fetchPriority' in img) img.fetchPriority = img.closest('#observatorio') ? 'high' : 'auto';

      let done = false;
      const finish = async (ok) => {
        if (done) return;
        done = true;
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        if (ok && img.decode) {
          try { await img.decode(); } catch (_) {}
        }
        resolve(ok);
      };
      const onLoad = () => finish(true);
      const onError = () => finish(false);
      if (img.complete) finish(img.naturalWidth > 0);
      else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });
      }
    });
  }

  function warmImage(url, priority = 'high') {
    return new Promise((resolve) => {
      const image = new Image();
      image.decoding = 'async';
      if ('fetchPriority' in image) image.fetchPriority = priority;
      let done = false;
      const finish = async (ok) => {
        if (done) return;
        done = true;
        if (ok && image.decode) {
          try { await image.decode(); } catch (_) {}
        }
        resolve(ok);
      };
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = url;
      if (image.complete) finish(image.naturalWidth > 0);
    });
  }

  function waitForHeroFrame() {
    const canvas = document.getElementById('protea-canvas');
    if (!canvas) return Promise.resolve(false);
    const deadline = performance.now() + CFG.timing.heroFrameWait;
    return new Promise((resolve) => {
      const probe = () => {
        if (canvas.width > 2 && canvas.height > 2) {
          try {
            const ctx = canvas.getContext('2d');
            const points = [
              [canvas.width * .18, canvas.height * .22],
              [canvas.width * .50, canvas.height * .50],
              [canvas.width * .78, canvas.height * .64]
            ];
            const visible = points.some(([x, y]) => {
              const d = ctx.getImageData(Math.max(0, Math.floor(x)), Math.max(0, Math.floor(y)), 1, 1).data;
              return d[0] + d[1] + d[2] > 12;
            });
            if (visible) return resolve(true);
          } catch (_) {
            if (performance.now() - report.startedAt > 900) return resolve(true);
          }
        }
        if (performance.now() >= deadline) return resolve(false);
        window.setTimeout(probe, 80);
      };
      probe();
    });
  }

  function makeTasks() {
    const tasks = [];
    const add = (label, weight, promiseFactory) => tasks.push({ label, weight, promiseFactory });

    [...new Set(CFG.heroAssets)].forEach((url) => add(`hero:${url.split('/').pop()}`, 1.2, () => warmImage(url, 'high')));

    const viva = window.PROTEA_VIVA_CONFIG || {};
    const vivaAssets = [
      ...(viva.growthLayers || []).map((layer) => layer && layer.path).filter(Boolean),
      viva.finalTexturePath
    ].filter(Boolean);
    [...new Set(vivaAssets)].forEach((url) => add(`viva:${url.split('/').pop()}`, 1.35, () => warmImage(url, 'high')));

    document.querySelectorAll('img[src]').forEach((img, index) => {
      const team = Boolean(img.closest('.v3-team-card'));
      add(`dom:${index}:${team ? 'team' : 'content'}`, team ? .8 : 1.4, () => waitForDomImage(img));
    });

    if (document.fonts?.ready) add('fonts', .8, () => document.fonts.ready.then(() => true, () => false));
    add('hero:first-frame', 1.8, waitForHeroFrame);
    return tasks;
  }

  async function runReadinessGate() {
    const tasks = makeTasks();
    const total = tasks.reduce((sum, task) => sum + task.weight, 0) || 1;
    let complete = 0;

    const tracked = tasks.map((task) => Promise.resolve()
      .then(task.promiseFactory)
      .then((ok) => {
        complete += task.weight;
        targetProgress = clamp(complete / total, 0, 1);
        report.progress = targetProgress;
        report.tasks.push({ label: task.label, ok: ok !== false, completedAt: Math.round(performance.now() - report.startedAt) });
        return ok;
      })
      .catch((error) => {
        complete += task.weight;
        targetProgress = clamp(complete / total, 0, 1);
        report.progress = targetProgress;
        report.tasks.push({ label: task.label, ok: false, error: String(error), completedAt: Math.round(performance.now() - report.startedAt) });
        return false;
      }));

    const allResources = Promise.allSettled(tracked).then(() => 'ready');
    const outcome = await Promise.race([
      allResources,
      wait(CFG.timing.maxWait).then(() => 'timeout')
    ]);
    report.timedOut = outcome === 'timeout';
    if (!report.timedOut) {
      targetProgress = 1;
      report.progress = 1;
    }
    return outcome;
  }

  function prepareExplosion() {
    window.clearInterval(telemetryTimer);
    host.querySelectorAll('.v3-preloader__particles i').forEach((point) => {
      point.getAnimations().forEach((animation) => {
        try { animation.cancel(); } catch (_) {}
      });
    });
    host.classList.add('is-aligning');
  }

  function cleanup() {
    if (released) return;
    released = true;
    window.clearInterval(telemetryTimer);
    cancelAnimationFrame(progressFrame);
    window.removeEventListener('resize', syncLens);
    observer?.disconnect();
    report.completedAt = Math.round(performance.now() - report.startedAt);
    host.remove();
    document.documentElement.classList.remove('v3-preloading');
    document.body.classList.remove('v3-preloading');
  }

  async function run() {
    buildVisuals();
    syncLens();
    window.addEventListener('resize', syncLens, { passive: true });
    progressFrame = requestAnimationFrame(animateProgress);

    const minTime = wait(CFG.timing.minDisplay);
    const readinessGate = runReadinessGate();
    const [, outcome] = await Promise.all([minTime, readinessGate]);

    if (outcome === 'timeout') host.classList.add('is-load-timeout');
    else host.classList.add('is-load-complete');

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    syncLens();
    prepareExplosion();
    await wait(CFG.timing.dock + CFG.timing.settle);

    host.classList.add('is-leaving');
    await wait(CFG.timing.fade);
    cleanup();
  }

  run().catch((error) => {
    report.error = String(error);
    host.classList.add('is-leaving');
    window.setTimeout(cleanup, CFG.timing.fade);
  });
})();