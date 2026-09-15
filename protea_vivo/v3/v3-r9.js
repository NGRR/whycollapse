(() => {
  'use strict';

  const preload = document.getElementById('v3-preloader');
  const hero = document.getElementById('observatorio');
  if (!preload || !hero) {
    document.documentElement.classList.remove('v3-preloading');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seen = sessionStorage.getItem('proteaV3PreloaderSeen') === '1';
  const t0 = performance.now();
  const minimumVisible = seen ? 320 : 980;
  const maximumWait = seen ? 900 : 2200;
  const alignDelay = seen ? 90 : 220;
  const fadeMs = reduceMotion ? 180 : 430;

  if (seen) preload.classList.add('is-returning');

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));

  /*
   * Esta geometría replica exactamente la posición/radio iniciales utilizados
   * por assets/js/protea.js. Se mantiene aquí, en R9, para no modificar el
   * motor compartido de la consolidada.
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
    preload.style.setProperty('--v3-preload-angle', mobile ? '0deg' : '0deg');
  }

  function warmHeroAsset(path) {
    return new Promise(resolve => {
      const image = new Image();
      const done = () => resolve();
      image.onload = done;
      image.onerror = done;
      image.src = path;
      if (image.complete) resolve();
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
    if (document.fonts && document.fonts.ready) jobs.push(document.fonts.ready.catch(() => {}));
    await Promise.allSettled(jobs);

    /* Dos frames permiten al canvas compartido pintar con los recursos ya cacheados. */
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function startAlignment() {
    syncWithHeroLens();
    requestAnimationFrame(() => preload.classList.add('is-aligning'));
  }

  function cleanup() {
    preload.remove();
    document.documentElement.classList.remove('v3-preloading');
    document.body.classList.remove('v3-preloading');
    try { sessionStorage.setItem('proteaV3PreloaderSeen', '1'); } catch (_) {}
  }

  syncWithHeroLens();
  window.addEventListener('resize', syncWithHeroLens, { passive: true });
  window.setTimeout(startAlignment, alignDelay);

  Promise.race([
    criticalAssetsReady(),
    wait(maximumWait)
  ]).then(async () => {
    const elapsed = performance.now() - t0;
    if (elapsed < minimumVisible) await wait(minimumVisible - elapsed);

    /* Garantiza que el trayecto centro → lente haya tenido tiempo de leerse. */
    if (!reduceMotion && !seen) {
      const alignmentFloor = 900;
      const elapsedAfterReady = performance.now() - t0;
      if (elapsedAfterReady < alignmentFloor) await wait(alignmentFloor - elapsedAfterReady);
    }

    preload.classList.add('is-leaving');
    await wait(fadeMs);
    cleanup();
  }).catch(() => {
    preload.classList.add('is-leaving');
    window.setTimeout(cleanup, fadeMs);
  });
})();
