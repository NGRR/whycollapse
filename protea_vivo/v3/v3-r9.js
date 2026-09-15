(() => {
  'use strict';

  const preload = document.getElementById('v3-preloader');
  const hero = document.getElementById('observatorio');
  if (!preload || !hero) {
    document.documentElement.classList.remove('v3-preloading');
    document.body?.classList.remove('v3-preloading');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  try { seen = sessionStorage.getItem('proteaV3PreloaderSeen') === '1'; } catch (_) {}

  const INITIAL_HOLD = seen ? 180 : 560;
  const MAX_CRITICAL_WAIT = seen ? 850 : 2200;
  const ALIGN_DURATION = reduceMotion ? 80 : (seen ? 390 : 840);
  const ALIGN_SETTLE = reduceMotion ? 20 : 90;
  const FADE_DURATION = reduceMotion ? 180 : 430;

  if (seen) preload.classList.add('is-returning');

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));

  /*
   * Replica la geometría inicial de la lente definida en assets/js/protea.js,
   * pero sólo dentro de V3. De este modo la transición termina exactamente
   * donde comienza la lente real del Hero sin modificar la consolidada.
   */
  function syncWithHeroLens() {
    const rect = hero.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    const mobile = window.matchMedia('(max-width: 959px)').matches;

    const r = mobile
      ? clamp(Math.min(w * 0.38, h * 0.19), 96, 156)
      : clamp(Math.min(w * 0.34, h * 0.255), 118, 310);
    const x = rect.left + (mobile ? w * 0.5 : w * 0.76 - 50);
    const y = rect.top + (mobile ? h * 0.72 : h * 0.52);

    preload.style.setProperty('--v3-preload-x', `${x}px`);
    preload.style.setProperty('--v3-preload-y', `${y}px`);
    preload.style.setProperty('--v3-preload-r', `${r}px`);
    preload.style.setProperty('--v3-preload-angle', '0deg');
  }

  function warmHeroAsset(path) {
    return new Promise(resolve => {
      const image = new Image();
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        resolve();
      };
      image.onload = done;
      image.onerror = done;
      image.src = path;
      if (image.complete) done();
    });
  }

  async function criticalAssetsReady() {
    const heroAssets = [
      'components/hero/assets/bg_far.png',
      'components/hero/assets/bg_mid.png',
      'components/hero/assets/base_sharp.png',
      'components/hero/assets/network_far.png',
      'components/hero/assets/network_mid.png',
      'components/hero/assets/network_near.png',
      'components/hero/assets/glow_far.png',
      'components/hero/assets/glow_mid.png'
    ];

    const jobs = heroAssets.map(warmHeroAsset);
    if (document.fonts?.ready) jobs.push(document.fonts.ready.catch(() => {}));
    await Promise.allSettled(jobs);

    /* El hero compartido recibe dos frames para resolver tamaño y primera pintura. */
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function cleanup() {
    window.removeEventListener('resize', syncWithHeroLens);
    preload.remove();
    document.documentElement.classList.remove('v3-preloading');
    document.body.classList.remove('v3-preloading');
    try { sessionStorage.setItem('proteaV3PreloaderSeen', '1'); } catch (_) {}
  }

  async function runSequence() {
    /* Fase 1: sólo azul profundo + lente centrada. */
    syncWithHeroLens();
    window.addEventListener('resize', syncWithHeroLens, { passive: true });

    await Promise.all([
      wait(INITIAL_HOLD),
      Promise.race([criticalAssetsReady(), wait(MAX_CRITICAL_WAIT)])
    ]);

    /* Fase 2: la misma lente se desplaza al centro/radio exactos del Hero. */
    syncWithHeroLens();
    await new Promise(resolve => requestAnimationFrame(() => {
      preload.classList.add('is-aligning');
      resolve();
    }));
    await wait(ALIGN_DURATION + ALIGN_SETTLE);

    /* Fase 3: sólo después de llegar a destino se revela la página. */
    preload.classList.add('is-leaving');
    await wait(FADE_DURATION);
    cleanup();
  }

  runSequence().catch(() => {
    preload.classList.add('is-leaving');
    window.setTimeout(cleanup, FADE_DURATION);
  });
})();
