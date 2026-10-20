(() => {
  'use strict';
  // Non-interfering diagnostic: only starts with ?hero-debug=1.
  const params = new URLSearchParams(location.search);
  if (params.get('hero-debug') !== '1') return;
  const start = performance.now();
  const hero = document.getElementById('observatorio');
  const canvas = document.getElementById('protea-canvas');
  if (!hero || !canvas) return;

  const records = [];
  const counters = {
    canvasResizes: 0, canvasStyleChanges: 0, heroGeometryChanges: 0,
    windowResizes: 0, visualViewportResizes: 0, longTasks: 0,
    frameGapsOver70ms: 0, frameGapsOver150ms: 0, sampleOutliers: 0
  };
  let lastFrame = 0;
  let peakFrameGap = 0;
  let lastSize = '';
  let lastPixelLuma = null;
  const elapsed = () => Math.round(performance.now() - start);
  const log = (type, info) => {
    records.push({ ms: elapsed(), type, info });
    if (records.length > 180) records.shift();
  };
  const sizeOf = () => {
    const r = hero.getBoundingClientRect();
    return [Math.round(r.width), Math.round(r.height)].join('x');
  };
  log('begin', { browser: navigator.userAgent, url: location.href, viewport: [innerWidth, innerHeight], dpr: devicePixelRatio, hero: sizeOf(), reducedMotion: matchMedia('(prefers-reduced-motion:reduce)').matches });

  const canvasAttributes = new MutationObserver(items => {
    for (const item of items) {
      if (item.attributeName === 'width' || item.attributeName === 'height') {
        counters.canvasResizes++;
        log('canvas-bitmap-resize', { width: canvas.width, height: canvas.height, attr: item.attributeName });
      } else if (item.attributeName === 'style') {
        counters.canvasStyleChanges++;
      }
    }
  });
  canvasAttributes.observe(canvas, { attributes: true, attributeFilter: ['width', 'height', 'style'] });

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {
      const next = sizeOf();
      if (next !== lastSize) {
        counters.heroGeometryChanges++;
        lastSize = next;
        log('hero-geometry-change', next);
      }
    });
    observer.observe(hero);
  }

  window.addEventListener('resize', () => {
    counters.windowResizes++;
    log('window-resize', [innerWidth, innerHeight]);
  }, { passive: true });
  window.visualViewport?.addEventListener('resize', () => {
    counters.visualViewportResizes++;
    if (counters.visualViewportResizes <= 25 || counters.visualViewportResizes % 10 === 0) {
      log('visual-viewport-resize', [Math.round(window.visualViewport.width), Math.round(window.visualViewport.height)]);
    }
  }, { passive: true });
  const bodyClasses = new MutationObserver(() => {
    log('body-class', document.body.className);
  });
  bodyClasses.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  try {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        counters.longTasks++;
        log('longtask', { durationMs: Math.round(entry.duration), name: entry.name });
      });
    });
    observer.observe({ entryTypes: ['longtask'] });
  } catch (_) {}

  const tick = now => {
    if (lastFrame) {
      const delta = now - lastFrame;
      if (delta > 70 && !document.hidden) {
        counters.frameGapsOver70ms++;
        peakFrameGap = Math.max(peakFrameGap, delta);
        if (delta > 150) counters.frameGapsOver150ms++;
        if (counters.frameGapsOver70ms <= 30) log('frame-gap', Math.round(delta));
      }
    }
    lastFrame = now;
    if (!document.hidden) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => {
    lastFrame = 0;
    log('visibility', document.visibilityState);
    if (!document.hidden) requestAnimationFrame(tick);
  });

  // Pixel sampling happens AFTER the canvas engine is initialized.
  // Read only sparse samples; sampling cannot prove absence of a sub-frame tear.
  const sample = () => {
    if (!canvas.width || !canvas.height || document.hidden) return;
    try {
      const ctx = canvas.getContext('2d');
      const attrs = typeof ctx.getContextAttributes === 'function' ? ctx.getContextAttributes() : {};
      const probes = [[.18,.22],[.50,.50],[.78,.64]];
      const samples = probes.map(([x,y]) => {
        const pixel = ctx.getImageData(Math.floor(canvas.width * x), Math.floor(canvas.height * y),1,1).data;
        return Math.round((pixel[0]+pixel[1]+pixel[2])/3);
      });
      const luma = samples.reduce((s,v)=>s+v,0)/samples.length;
      if (lastPixelLuma !== null && Math.abs(luma-lastPixelLuma)>65) {
        counters.sampleOutliers++;
        log('pixel-luma-change', { from: Math.round(lastPixelLuma), to: Math.round(luma), samples });
      }
      lastPixelLuma=luma;
      window.__PROTEA_HERO_DIAGNOSTIC__.contextAttributes = attrs;
    } catch(e) { log('sampling-unavailable', String(e).slice(0,150)); }
  };
  const api = window.__PROTEA_HERO_DIAGNOSTIC__ = {
    counters, records, contextAttributes: null,
    report: () => ({
      url: location.href,
      elapsedMs: elapsed(),
      counters: {...counters},
      peakFrameGapMs: Math.round(peakFrameGap),
      contextAttributes: api.contextAttributes,
      canvasBitmap: [canvas.width, canvas.height],
      heroSize: sizeOf(),
      viewport: [innerWidth,innerHeight],
      loadReport: window.__PROTEA_V3_LOAD_REPORT__ ? {
        timedOut: window.__PROTEA_V3_LOAD_REPORT__.timedOut,
        completedAt: window.__PROTEA_V3_LOAD_REPORT__.completedAt,
        tasks: window.__PROTEA_V3_LOAD_REPORT__.tasks
      } : null,
      events: records.slice()
    })
  };
  setInterval(sample, 220);
  const panel = document.createElement('div');
  panel.id='hero-debug-panel';
  panel.style.cssText='position:fixed;z-index:99999;right:9px;bottom:9px;background:rgba(0,11,30,.94);color:white;border:1px solid #ff8a48;padding:12px;width:min(390px,calc(100vw - 18px));box-sizing:border-box;font:12px/1.4 ui-monospace,monospace;box-shadow:0 12px 30px #0006';
  const title=document.createElement('strong');
  title.textContent='PROTEA · DIAGNÓSTICO HERO';
  const output=document.createElement('pre');
  output.style.cssText='white-space:pre-wrap;margin:8px 0;font:11px/1.35 ui-monospace,monospace';
  const copy=document.createElement('button');
  copy.type='button';copy.textContent='Copiar informe';
  copy.style.cssText='background:#0759f4;color:white;border:0;padding:8px 10px;cursor:pointer;margin-right:9px';
  const close=document.createElement('button');
  close.type='button';close.textContent='Ocultar';
  close.style.cssText='background:transparent;color:white;border:1px solid #fff8;padding:7px 10px;cursor:pointer';
  copy.addEventListener('click', async () => {
    const report=JSON.stringify(api.report(),null,2);
    try {await navigator.clipboard.writeText(report);copy.textContent='Copiado';}
    catch(_) {console.log('PROTEA HERO REPORT',report);copy.textContent='Ver consola';}
  });
  close.addEventListener('click',()=>panel.remove());
  panel.append(title,output,copy,close);
  document.body.appendChild(panel);
  setInterval(()=>{
    const c=counters;
    output.textContent=[
      'Tiempo: '+Math.round(elapsed()/1000)+' s',
      'Canvas redim.: '+c.canvasResizes+' | Hero camb.: '+c.heroGeometryChanges,
      'Resize window/visual: '+c.windowResizes+'/'+c.visualViewportResizes,
      'Long tasks: '+c.longTasks+' | Gaps >70ms: '+c.frameGapsOver70ms,
      'Peor gap: '+Math.round(peakFrameGap)+'ms | Saltos luminosidad: '+c.sampleOutliers,
      'Canvas: '+(api.contextAttributes?.desynchronized?'desync (legado)':'sync (V4)')
    ].join('\n');
  },500);
})();