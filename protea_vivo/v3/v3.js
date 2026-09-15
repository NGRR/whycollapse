(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* R4 styles: loaded here to avoid altering the protected Hero/bootstrap chain. */
  if (!document.querySelector('link[data-v3-r4]')) {
    const r4Styles = document.createElement('link');
    r4Styles.rel = 'stylesheet';
    r4Styles.href = 'v3/v3-r4.css?v=20260915-4';
    r4Styles.dataset.v3R4 = 'true';
    document.head.append(r4Styles);
  }

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
  });

  /* Section 03: ordered alphabetically, in uppercase, without changing the underlying stage IDs. */
  [
    { id: 'comprender', letter: 'A', label: 'IAO', title: 'DIAGNOS · IAO' },
    { id: 'entrenar', letter: 'B', label: 'TRAINING', title: 'TRAINING' },
    { id: 'arraigar', letter: 'C', label: 'LAB', title: 'LAB' },
    { id: 'sostener', letter: 'D', label: 'HUB', title: 'HUB' }
  ].forEach(({ id, letter, label, title }) => {
    const stage = document.getElementById(id);
    const stageIndex = stage?.querySelector('.v3-stage-index');
    const heading = stage?.querySelector('.v3-stage-copy h3');
    if (stageIndex) stageIndex.innerHTML = `<span>${letter}</span><small>${label}</small>`;
    if (heading) heading.textContent = title;
  });

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

  /*
   * One scroll probe drives both systems. This avoids the rail and quarter marker
   * selecting different sections when a tall section occupies most of the viewport.
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

    const showStep = (index, moveFocus = true) => {
      currentStep = Math.max(0, Math.min(index, steps.length - 1));
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
        if (focusTarget) requestAnimationFrame(() => focusTarget.focus());
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
