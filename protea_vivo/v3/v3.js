(() => {
  'use strict';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Rail narrativo V3: conserva la estructura original aunque los href incluyan v3/# por el <base>. */
  const navLinks = [...document.querySelectorAll('.section-rail .rail-item, .mobile-story-nav a, .site-nav a, .mobile-menu-list a')];
  const sectionLinks = navLinks.filter((link) => {
    const href = link.getAttribute('href') || '';
    return href.includes('#');
  });
  const sectionIds = [...new Set(sectionLinks.map((link) => `#${(link.getAttribute('href') || '').split('#')[1]}`).filter((id) => id.length > 1))];
  const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);

  const setActive = (id) => {
    document.querySelectorAll('.section-rail .rail-item').forEach((link) => {
      const hash = `#${(link.getAttribute('href') || '').split('#')[1]}`;
      const active = hash === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(`#${visible.target.id}`);
    }, { rootMargin: '-24% 0px -54% 0px', threshold: [0, .08, .2, .45] });
    sections.forEach((section) => activeObserver.observe(section));
  }

  sectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hashPart = (link.getAttribute('href') || '').split('#')[1];
      if (!hashPart) return;
      const target = document.getElementById(hashPart);
      if (!target) return;
      event.preventDefault();
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

  if (location.hash) requestAnimationFrame(() => setActive(location.hash));
})();
