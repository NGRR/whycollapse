(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => matchMedia('(max-width: 959px)').matches;

  /*
   * ÚNICA FUENTE DE TIEMPOS DEL PRELOADER.
   * Para retocar la animación, edita sólo este objeto.
   */
  const PRELOADER_TIMING = Object.freeze({
    load: 2000,
    align: 850,
    settle: 60,
    fade: 360,
    segment: 100,
    failSafePadding: 1200
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function initPreloader() {
    const preload = document.querySelector('.canvas-injection-note');
    const hero = document.getElementById('observatorio');
    if (!preload || !hero || preload.classList.contains('v3-preloader')) return;

    const timing = reduceMotion
      ? { ...PRELOADER_TIMING, load: 180, align: 120, settle: 20, fade: 160, segment: 0 }
      : PRELOADER_TIMING;

    const html = document.documentElement;
    html.classList.add('v3-preloading');
    document.body.classList.add('v3-preloading');

    preload.id = 'v3-preloader';
    preload.classList.add('v3-preloader');
    preload.style.setProperty('--v3-preload-align-ms', `${timing.align}ms`);
    preload.style.setProperty('--v3-preload-fade-ms', `${timing.fade}ms`);
    preload.style.setProperty('--v3-load-segment-ms', `${timing.segment}ms`);
    preload.innerHTML = `
      <div class="v3-preloader__lens" aria-hidden="true">
        <div class="v3-preloader__brand">
          <span class="brand-mark">protea</span>
        </div>
        <i class="v3-preloader__ring v3-preloader__ring--outer"></i>
        <i class="v3-preloader__ring v3-preloader__ring--mid"></i>
        <i class="v3-preloader__ring v3-preloader__ring--inner"></i>
        <i class="v3-preloader__scan"></i>
      </div>`;

    const lens = preload.querySelector('.v3-preloader__lens');
    const brandMark = preload.querySelector('.v3-preloader__brand .brand-mark');
    if (lens) {
      lens.style.left = '50%';
      lens.style.top = '50%';
    }
    if (brandMark) brandMark.style.transform = 'none';

    if (lens) {
      const loadbar = document.createElement('span');
      loadbar.className = 'v3-preloader__loadbar';
      const segmentCount = 96;
      const stepDelay = timing.segment
        ? Math.max(0, timing.load - timing.segment) / (segmentCount - 1)
        : 0;

      for (let index = 0; index < segmentCount; index += 1) {
        const segment = document.createElement('span');
        const angle = (index / segmentCount) * 360;
        const glyph = index % 3 === 0 || index % 7 === 0 ? '/' : '|';
        segment.textContent = glyph;
        segment.style.setProperty('--v3-load-angle', `${angle.toFixed(2)}deg`);
        segment.style.setProperty('--v3-load-delay', `${Math.round(index * stepDelay)}ms`);
        segment.style.setProperty('--v3-load-glyph-angle', glyph === '/' ? '-18deg' : '0deg');
        loadbar.append(segment);
      }
      lens.append(loadbar);
    }

    function syncWithHeroLens() {
      const rect = hero.getBoundingClientRect();
      const preloadRect = preload.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const mobile = isMobile();
      const radius = mobile
        ? clamp(Math.min(width * 0.38, height * 0.19), 96, 156)
        : clamp(Math.min(width * 0.34, height * 0.255), 118, 310);
      const x = rect.left + (mobile ? width * 0.5 : width * 0.76 - 50);
      const y = rect.top + (mobile ? height * 0.72 : height * 0.52);
      const originX = preloadRect.left + preloadRect.width * 0.5;
      const originY = preloadRect.top + preloadRect.height * 0.5;
      const dx = x - originX;
      const dy = y - originY;

      preload.style.setProperty('--v3-preload-x', `${x}px`);
      preload.style.setProperty('--v3-preload-y', `${y}px`);
      preload.style.setProperty('--v3-preload-dx', `${dx}px`);
      preload.style.setProperty('--v3-preload-dy', `${dy}px`);
      preload.style.setProperty('--v3-preload-r', `${radius}px`);
      preload.style.setProperty('--v3-load-radius', `${-(radius + 3)}px`);
      preload.style.setProperty('--v3-preload-angle', '0deg');
    }

    function warmHeroAsset(path) {
      return new Promise((resolve) => {
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
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }

    let released = false;
    let hardTimer = 0;

    function cleanup() {
      if (released) return;
      released = true;
      window.clearTimeout(hardTimer);
      window.removeEventListener('resize', syncWithHeroLens);
      preload.remove();
      html.classList.remove('v3-preloading');
      document.body.classList.remove('v3-preloading');
      try { sessionStorage.setItem('proteaV3PreloaderSeen', '1'); } catch (_) {}
    }

    function forceRelease() {
      if (released || !preload.isConnected) return;
      preload.classList.add('is-leaving');
      window.setTimeout(cleanup, timing.fade);
    }

    const failSafe = timing.load + timing.align + timing.settle + timing.fade + timing.failSafePadding;
    hardTimer = window.setTimeout(forceRelease, failSafe);

    async function runSequence() {
      syncWithHeroLens();
      window.addEventListener('resize', syncWithHeroLens, { passive: true });

      await Promise.all([
        wait(timing.load),
        Promise.race([criticalAssetsReady(), wait(timing.load)])
      ]);
      preload.classList.add('is-load-complete');

      syncWithHeroLens();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => {
        preload.querySelectorAll('.v3-preloader__ring, .v3-preloader__scan').forEach((node) => {
          node.style.animationPlayState = 'paused';
        });
        preload.classList.add('is-aligning');
        resolve();
      })));
      await wait(timing.align + timing.settle);

      preload.classList.add('is-leaving');
      await wait(timing.fade);
      cleanup();
    }

    runSequence().catch(forceRelease);
  }

  initPreloader();

  /* Complete the left rail with the sixth narrative state. */
  const rail = document.querySelector('.section-rail');
  if (rail && !rail.querySelector('a[href*="#contacto-final"]')) {
    const contactRailItem = document.createElement('a');
    contactRailItem.className = 'rail-item';
    contactRailItem.href = 'v3/#contacto-final';
    contactRailItem.innerHTML = '<span>06</span><small>Conversemos</small>';
    rail.append(contactRailItem);
  }

  /* Persistent markers in the first quarter. Their state mirrors the rail. */
  const markerConfig = {
    colapso: { number: '02', title: 'Nuestra mirada', code: 'READ / SIGNALS' },
    'becoming-adaptive': { number: '03', title: 'Qué hacemos', code: 'BUILD / CAPACITY' },
    'adaptive-thinking': { number: '04', title: 'Pensamiento', code: 'THINK / REFRAME' },
    equipo: { number: '05', title: 'Equipo', code: 'NOUS / NETWORK' },
    'contacto-final': { number: '06', title: 'Conversemos', code: 'ACT / TOGETHER' }
  };

  Object.entries(markerConfig).forEach(([sectionId, config]) => {
    const section = document.getElementById(sectionId);
    const marker = section?.querySelector('.v3-quarter-marker');
    if (!marker) return;

    marker.dataset.sectionMarker = sectionId;
    marker.innerHTML = `<span>${config.number}</span><mark>${config.title}</mark><i></i><small>${config.code}</small>`;

    if (!marker.parentElement?.classList.contains('v3-marker-track')) {
      const track = document.createElement('div');
      track.className = 'v3-marker-track';
      marker.parentNode.insertBefore(track, marker);
      track.append(marker);
    }
  });

  /* Section 03: ordered alphabetically and exposed as a live sub-state. */
  const stageConfig = [
    { id: 'comprender', letter: 'A', label: 'IAO', title: 'DIAGNOS · IAO' },
    { id: 'entrenar', letter: 'B', label: 'TRAINING', title: 'TRAINING' },
    { id: 'arraigar', letter: 'C', label: 'LAB', title: 'LAB' },
    { id: 'sostener', letter: 'D', label: 'HUB', title: 'HUB' }
  ];

  stageConfig.forEach(({ id, letter, label, title }) => {
    const stage = document.getElementById(id);
    const stageIndex = stage?.querySelector('.v3-stage-index');
    const heading = stage?.querySelector('.v3-stage-copy h3');
    if (stageIndex) stageIndex.innerHTML = `<span>${letter}</span><small>${label}</small>`;
    if (heading) heading.textContent = title;
  });

  const section03Marker = document.querySelector('[data-section-marker="becoming-adaptive"]');
  let stageReadout = section03Marker?.querySelector('.v3-marker-substage');
  if (section03Marker && !stageReadout) {
    stageReadout = document.createElement('div');
    stageReadout.className = 'v3-marker-substage';
    stageReadout.innerHTML = '<span>A</span><b>IAO</b>';
    section03Marker.append(stageReadout);
  }

  const navLinks = [...document.querySelectorAll('.section-rail .rail-item, .mobile-story-nav a, .site-nav a, .mobile-menu-list a')];
  const sectionLinks = navLinks.filter((link) => {
    const href = link.getAttribute('href') || '';
    const hashPart = href.includes('#') ? href.split('#')[1] : '';
    return hashPart && document.getElementById(hashPart);
  });

  const railLinks = [...document.querySelectorAll('.section-rail .rail-item')];
  const railSections = railLinks
    .map((link) => {
      const hashPart = (link.getAttribute('href') || '').split('#')[1];
      return hashPart ? document.getElementById(hashPart) : null;
    })
    .filter(Boolean);
  const sectionMarkers = [...document.querySelectorAll('[data-section-marker]')];
  const mobileStoryNav = document.querySelector('.mobile-story-nav');
  const contactSection = document.getElementById('contacto-final');
  const heroSection = document.getElementById('observatorio');
  const siteNav = document.querySelector('.site-nav');
  const heroContainer = heroSection?.querySelector('.uk-container');
  const heroGrid = heroSection?.querySelector('.uk-grid-large');
  const heroCopyPanel = heroSection?.querySelector('.hero-copy-panel');
  const heroTitle = heroSection?.querySelector('.hero-title');
  const heroCopy = heroSection?.querySelector('.hero-copy');
  const heroCanvasSpace = heroSection?.querySelector('.hero-canvas-space');
  const heroQuote = heroSection?.querySelector('.hero-transition-quote');
  const siteBrandMark = siteNav?.querySelector('.brand-mark');
  const siteBrandClaim = siteNav?.querySelector('.brand-claim');
  const mobileMenuButton = siteNav?.querySelector('.mobile-menu-button');

  const setImportant = (node, property, value) => {
    if (node) node.style.setProperty(property, value, 'important');
  };

  const clearInline = (node, properties) => {
    if (!node) return;
    properties.forEach((property) => node.style.removeProperty(property));
  };

  const setActive = (id) => {
    const normalizedId = (id || '').replace(/^#/, '');

    railLinks.forEach((link) => {
      const linkId = (link.getAttribute('href') || '').split('#')[1] || '';
      const active = linkId === normalizedId;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });

    sectionMarkers.forEach((marker) => {
      marker.classList.toggle('is-active', marker.dataset.sectionMarker === normalizedId);
    });
  };

  const updateStageState = () => {
    const stages = stageConfig
      .map((config) => ({ ...config, element: document.getElementById(config.id) }))
      .filter((item) => item.element);
    if (!stages.length) return;

    const probe = window.innerHeight * 0.45;
    let active = stages[0];

    for (const stage of stages) {
      const rect = stage.element.getBoundingClientRect();
      if (rect.top <= probe) active = stage;
      if (rect.top <= probe && rect.bottom > probe) {
        active = stage;
        break;
      }
    }

    stages.forEach((stage) => stage.element.classList.toggle('is-stage-active', stage.id === active.id));

    if (stageReadout) {
      const letter = stageReadout.querySelector('span');
      const label = stageReadout.querySelector('b');
      if (letter) letter.textContent = active.letter;
      if (label) label.textContent = active.label;
    }
  };

  /* Fade the mobile story rail before it interferes with the contact form. */
  const updateMobileRailClearance = () => {
    if (!mobileStoryNav) return;

    if (!isMobile() || !contactSection) {
      mobileStoryNav.style.removeProperty('opacity');
      mobileStoryNav.style.removeProperty('transform');
      mobileStoryNav.style.removeProperty('pointer-events');
      mobileStoryNav.classList.remove('is-contact-clearing');
      mobileStoryNav.removeAttribute('aria-hidden');
      return;
    }

    const top = contactSection.getBoundingClientRect().top;
    const start = window.innerHeight * 1.05;
    const end = window.innerHeight * 0.70;
    const progress = Math.max(0, Math.min(1, (start - top) / Math.max(1, start - end)));

    mobileStoryNav.style.opacity = String(1 - progress);
    mobileStoryNav.style.transform = `translateY(${Math.round(progress * 84)}px)`;
    mobileStoryNav.style.pointerEvents = progress > 0.62 ? 'none' : '';
    mobileStoryNav.classList.toggle('is-contact-clearing', progress > 0);

    if (progress >= 0.96) mobileStoryNav.setAttribute('aria-hidden', 'true');
    else mobileStoryNav.removeAttribute('aria-hidden');
  };

  let railFrame = 0;
  const updateNarrativeState = () => {
    railFrame = 0;
    if (!railSections.length) return;

    const probe = window.innerHeight * 0.42;
    let activeSection = railSections[0];

    for (const section of railSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probe) activeSection = section;
      if (rect.top <= probe && rect.bottom > probe) {
        activeSection = section;
        break;
      }
    }

    const doc = document.documentElement;
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 3) {
      activeSection = railSections[railSections.length - 1];
    }

    setActive(activeSection.id);
    updateStageState();
    updateMobileRailClearance();
  };

  const scheduleNarrativeState = () => {
    if (railFrame) return;
    railFrame = requestAnimationFrame(updateNarrativeState);
  };

  /*
   * Reconstrucción móvil: iOS cambia el visual viewport varias veces al rotar.
   * Medimos el viewport real, recalculamos alturas y reconfiguramos Hero/rail.
   * Al asentarse la orientación emitimos un resize final para los dos canvas.
   */
  let mobileViewportFrame = 0;
  let orientationSettleTimer = 0;

  const rebuildMobileViewport = () => {
    mobileViewportFrame = 0;
    const viewport = window.visualViewport;
    const viewportWidth = Math.round(viewport?.width || window.innerWidth);
    const viewportHeight = Math.round(viewport?.height || window.innerHeight);
    const mobile = viewportWidth <= 959;

    if (!mobile) {
      document.body.removeAttribute('data-v3-orientation');
      document.documentElement.style.removeProperty('--mobile-nav-h');
      document.documentElement.style.removeProperty('--mobile-story-h');
      document.documentElement.style.removeProperty('--mobile-critical-h');
      [heroSection, heroContainer, heroGrid, heroCopyPanel, heroTitle, heroCopy, heroCanvasSpace, heroQuote, siteNav, siteBrandMark, siteBrandClaim, mobileMenuButton, mobileStoryNav].forEach((node) => {
        if (!node) return;
        node.removeAttribute('style');
      });
      mobileStoryNav?.querySelectorAll('a').forEach((link) => link.style.removeProperty('min-height'));
      scheduleNarrativeState();
      return;
    }

    const landscape = viewportWidth > viewportHeight;
    document.body.dataset.v3Orientation = landscape ? 'landscape' : 'portrait';

    if (landscape) {
      setImportant(mobileStoryNav, 'left', 'max(12px, env(safe-area-inset-left))');
      setImportant(mobileStoryNav, 'right', 'max(12px, env(safe-area-inset-right))');
      setImportant(mobileStoryNav, 'width', 'auto');
      setImportant(mobileStoryNav, 'min-height', '46px');
      setImportant(mobileStoryNav, 'bottom', 'max(8px, env(safe-area-inset-bottom))');
      setImportant(mobileStoryNav, 'border-radius', '18px');
      mobileStoryNav?.querySelectorAll('a').forEach((link) => setImportant(link, 'min-height', '46px'));

      setImportant(siteNav, 'min-height', '50px');
      setImportant(siteNav, 'padding-top', '5px');
      setImportant(siteNav, 'padding-bottom', '5px');
      setImportant(siteNav, 'padding-left', 'max(16px, env(safe-area-inset-left))');
      setImportant(siteNav, 'padding-right', 'max(16px, env(safe-area-inset-right))');
      setImportant(siteBrandMark, 'font-size', '25px');
      setImportant(siteBrandClaim, 'font-size', '7px');
      setImportant(mobileMenuButton, 'width', '36px');
      setImportant(mobileMenuButton, 'height', '36px');
    } else {
      clearInline(mobileStoryNav, ['left', 'right', 'width', 'min-height', 'bottom', 'border-radius']);
      mobileStoryNav?.querySelectorAll('a').forEach((link) => link.style.removeProperty('min-height'));
      clearInline(siteNav, ['min-height', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right']);
      clearInline(siteBrandMark, ['font-size']);
      clearInline(siteBrandClaim, ['font-size']);
      clearInline(mobileMenuButton, ['width', 'height']);
    }

    requestAnimationFrame(() => {
      const navHeight = Math.round(siteNav?.getBoundingClientRect().height || (landscape ? 50 : 62));
      const storyHeight = Math.round(mobileStoryNav?.getBoundingClientRect().height || (landscape ? 46 : 58));
      const minimum = landscape ? 280 : 520;
      const criticalHeight = Math.max(minimum, viewportHeight - navHeight - storyHeight);

      document.documentElement.style.setProperty('--mobile-nav-h', `${navHeight}px`);
      document.documentElement.style.setProperty('--mobile-story-h', `${storyHeight}px`);
      document.documentElement.style.setProperty('--mobile-critical-h', `${criticalHeight}px`);

      setImportant(heroSection, 'min-height', `${criticalHeight}px`);
      setImportant(heroContainer, 'min-height', `${criticalHeight}px`);
      setImportant(heroGrid, 'min-height', `${criticalHeight}px`);

      if (landscape) {
        setImportant(heroGrid, 'display', 'grid');
        setImportant(heroGrid, 'grid-template-columns', 'minmax(0,.92fr) minmax(260px,1.08fr)');
        setImportant(heroGrid, 'grid-template-rows', 'minmax(0,1fr)');
        setImportant(heroGrid, 'align-items', 'center');
        setImportant(heroGrid, 'align-content', 'center');
        setImportant(heroCopyPanel, 'width', '100%');
        setImportant(heroCopyPanel, 'max-width', 'none');
        setImportant(heroCopyPanel, 'margin-top', '0');
        setImportant(heroCopyPanel, 'padding', '18px 22px');
        setImportant(heroCopyPanel, 'text-align', 'left');
        setImportant(heroTitle, 'font-size', 'clamp(32px,5.1vw,50px)');
        setImportant(heroTitle, 'line-height', '.96');
        setImportant(heroCopy, 'max-width', '430px');
        setImportant(heroCopy, 'font-size', 'clamp(13px,1.65vw,16px)');
        setImportant(heroCopy, 'line-height', '1.5');
        setImportant(heroCanvasSpace, 'min-height', `${criticalHeight}px`);
        setImportant(heroCanvasSpace, 'height', `${criticalHeight}px`);
        setImportant(heroQuote, 'display', 'none');
        heroCopyPanel?.querySelectorAll(':scope > *').forEach((node) => {
          setImportant(node, 'margin-left', '0');
          setImportant(node, 'margin-right', '0');
        });
      } else {
        const portraitShift = Math.round(clamp(viewportHeight * 0.07, 42, 72));
        setImportant(heroGrid, 'display', 'grid');
        setImportant(heroGrid, 'grid-template-columns', '1fr');
        setImportant(heroGrid, 'grid-template-rows', 'auto minmax(190px,1fr)');
        setImportant(heroGrid, 'align-items', 'start');
        setImportant(heroGrid, 'align-content', 'start');
        setImportant(heroCopyPanel, 'width', '100%');
        setImportant(heroCopyPanel, 'max-width', '100%');
        setImportant(heroCopyPanel, 'margin-top', `${-portraitShift}px`);
        setImportant(heroCopyPanel, 'padding-top', '8px');
        setImportant(heroCopyPanel, 'padding-bottom', '6px');
        setImportant(heroCopyPanel, 'padding-left', '28px');
        setImportant(heroCopyPanel, 'padding-right', '28px');
        setImportant(heroCopyPanel, 'text-align', 'center');
        clearInline(heroTitle, ['font-size', 'line-height']);
        clearInline(heroCopy, ['max-width', 'font-size', 'line-height']);
        clearInline(heroCanvasSpace, ['height']);
        setImportant(heroCanvasSpace, 'min-height', 'min(40dvh,300px)');
        clearInline(heroQuote, ['display']);
        heroCopyPanel?.querySelectorAll(':scope > *').forEach((node) => {
          setImportant(node, 'margin-left', 'auto');
          setImportant(node, 'margin-right', 'auto');
        });
      }

      scheduleNarrativeState();
    });
  };

  const queueMobileViewportRebuild = () => {
    if (mobileViewportFrame) cancelAnimationFrame(mobileViewportFrame);
    mobileViewportFrame = requestAnimationFrame(rebuildMobileViewport);
  };

  const settleOrientation = () => {
    queueMobileViewportRebuild();
    window.clearTimeout(orientationSettleTimer);
    window.setTimeout(queueMobileViewportRebuild, 120);
    orientationSettleTimer = window.setTimeout(() => {
      queueMobileViewportRebuild();
      /* Los motores compartidos ya escuchan resize; este pulso ocurre con el viewport estable. */
      window.dispatchEvent(new Event('resize'));
    }, 360);
  };

  window.addEventListener('scroll', scheduleNarrativeState, { passive: true });
  window.addEventListener('resize', queueMobileViewportRebuild, { passive: true });
  window.addEventListener('resize', scheduleNarrativeState, { passive: true });
  window.addEventListener('orientationchange', settleOrientation, { passive: true });
  window.visualViewport?.addEventListener('resize', queueMobileViewportRebuild, { passive: true });
  queueMobileViewportRebuild();

  sectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hashPart = (link.getAttribute('href') || '').split('#')[1];
      if (!hashPart) return;
      const target = document.getElementById(hashPart);
      if (!target) return;
      event.preventDefault();
      setActive(hashPart);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `${location.pathname}#${hashPart}`);
      if (window.UIkit && link.closest('#mobile-menu')) UIkit.offcanvas('#mobile-menu')?.hide();
    });
  });

  /* Carrusel móvil del equipo. */
  const teamRail = document.querySelector('[data-team-carousel]');
  const prev = document.querySelector('[data-team-prev]');
  const next = document.querySelector('[data-team-next]');
  const moveTeam = (direction) => {
    if (!teamRail) return;
    const card = teamRail.querySelector('.v3-team-card');
    if (!card) return;
    const styles = getComputedStyle(teamRail);
    const gap = parseFloat(styles.columnGap || styles.gap || 16) || 16;
    teamRail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  prev?.addEventListener('click', () => moveTeam(-1));
  next?.addEventListener('click', () => moveTeam(1));

  /* Aparición discreta sólo en el cuerpo. */
  const revealTargets = [...document.querySelectorAll('[data-reveal], .v3-stage-art, .v3-team-card')];
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  /* Contacto guiado heredado de la consolidada. No persiste ni envía datos todavía. */
  const proteaForm = document.querySelector('[data-contact-form="protea"][data-progressive-contact]');
  if (proteaForm) {
    const steps = [...proteaForm.querySelectorAll('[data-contact-step]')];
    const indicators = [...proteaForm.querySelectorAll('[data-contact-step-indicator]')];
    const progressStatus = proteaForm.querySelector('[data-contact-progress-status]');
    let currentStep = 0;

    const getReviewValue = (name) => {
      if (name === 'senales') {
        const selected = [...proteaForm.querySelectorAll('input[name="senales"]:checked')].map((field) => field.value.trim()).filter(Boolean);
        return selected.length ? selected.join('\n• ') : '—';
      }
      const field = proteaForm.elements[name];
      if (!field) return '—';
      const value = typeof field.value === 'string' ? field.value.trim() : '';
      return value || '—';
    };

    const syncReview = () => {
      proteaForm.querySelectorAll('[data-contact-review]').forEach((output) => {
        const name = output.dataset.contactReview;
        const value = getReviewValue(name);
        output.textContent = name === 'senales' && value !== '—' ? `• ${value}` : value;
      });
    };

    const positionMobileStep = (step, focusTarget) => {
      if (!isMobile()) {
        if (focusTarget) requestAnimationFrame(() => focusTarget.focus());
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const progress = proteaForm.querySelector('.contact-progress');
          const anchor = step || progress || proteaForm;
          const offset = window.innerWidth <= 520 ? 142 : 152;
          const targetTop = Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - offset);

          window.scrollTo({
            top: targetTop,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });

          if (focusTarget) {
            const focusDelay = reduceMotion ? 0 : 260;
            window.setTimeout(() => {
              try { focusTarget.focus({ preventScroll: true }); }
              catch (_) { focusTarget.focus(); }
            }, focusDelay);
          }
        });
      });
    };

    const showStep = (index, moveFocus = true) => {
      currentStep = Math.max(0, Math.min(index, steps.length - 1));
      proteaForm.dataset.currentStep = String(currentStep);
      steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== currentStep; });
      indicators.forEach((indicator, indicatorIndex) => {
        const active = indicatorIndex === currentStep;
        indicator.classList.toggle('is-active', active);
        indicator.classList.toggle('is-complete', indicatorIndex < currentStep);
        if (active) indicator.setAttribute('aria-current', 'step');
        else indicator.removeAttribute('aria-current');
      });
      if (currentStep === steps.length - 1) syncReview();
      if (progressStatus && indicators[currentStep]) {
        progressStatus.textContent = `Paso ${currentStep + 1} de ${steps.length}: ${indicators[currentStep].textContent.trim()}`;
      }

      if (moveFocus) {
        const focusTarget = steps[currentStep]?.querySelector('input, textarea, button');
        positionMobileStep(steps[currentStep], focusTarget);
      }
    };

    const validateStep = (step) => {
      const invalid = [...step.querySelectorAll('input, textarea, select')].find((field) => !field.checkValidity());
      if (!invalid) return true;
      invalid.reportValidity();
      return false;
    };

    proteaForm.addEventListener('click', (event) => {
      const nextButton = event.target.closest('[data-contact-next]');
      const backButton = event.target.closest('[data-contact-back]');
      if (nextButton && validateStep(steps[currentStep])) showStep(currentStep + 1);
      if (backButton) showStep(currentStep - 1);
    });

    proteaForm.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.target.matches('textarea, button') || currentStep === steps.length - 1) return;
      event.preventDefault();
      if (validateStep(steps[currentStep])) showStep(currentStep + 1);
    });

    proteaForm.addEventListener('change', () => {
      if (currentStep === steps.length - 1) syncReview();
    });

    proteaForm.addEventListener('submit', (event) => {
      event.preventDefault();
      syncReview();
      const status = proteaForm.querySelector('.contact-status');
      if (status) status.textContent = 'El envío todavía no está disponible. Tus datos no se han enviado.';
    });

    proteaForm.classList.add('is-enhanced');
    showStep(0, false);
  }

  if (location.hash && document.querySelector(location.hash)) setActive(location.hash);
  updateNarrativeState();
})();