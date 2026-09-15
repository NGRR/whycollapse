(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => matchMedia('(max-width: 959px)').matches;

  /* R4 + R5 styles load after the protected Hero/bootstrap chain. */
  const ensureStyle = (href, dataKey) => {
    if (document.querySelector(`link[${dataKey}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(dataKey, 'true');
    document.head.append(link);
  };
  ensureStyle('v3/v3-r4.css?v=20260915-4', 'data-v3-r4');
  ensureStyle('v3/v3-r5.css?v=20260915-5', 'data-v3-r5');

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

    /* A dedicated full-height track makes sticky persist for the whole section. */
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

  /*
   * One scroll probe drives rail, section marker and A–D product state. This avoids
   * different observers disagreeing while a long section occupies the viewport.
   */
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

  window.addEventListener('scroll', scheduleNarrativeState, { passive: true });
  window.addEventListener('resize', scheduleNarrativeState, { passive: true });

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
          const anchor = progress || step || proteaForm;
          const offset = window.innerWidth <= 520 ? 64 : 72;
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
      if (progressStatus && indicators[currentStep]) progressStatus.textContent = `Paso ${currentStep + 1} de ${steps.length}: ${indicators[currentStep].textContent.trim()}`;

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
