/* CHANGE-001/003: navigation, progressive copy and guided direct contact. No orientation engine. */
(() => {
  const links = [...document.querySelectorAll('.section-rail .rail-item, .mobile-story-nav a')];
  const sections = [...new Set(links.map(link => link.getAttribute('href')).filter(href => href && href.startsWith('#')))]
    .map(href => document.querySelector(href)).filter(Boolean);
  function setActive(id) {
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  }
  if (sections.length) {
    let scheduled = false;
    const update = () => {
      const marker = window.innerHeight * .35;
      const active = [...sections].reverse().find(section => section.getBoundingClientRect().top <= marker) || sections[0];
      setActive(active.id);
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        reveal.unobserve(entry.target);
      }
    }), { threshold: .18 });
    document.querySelectorAll('[data-reveal]').forEach(node => {
      node.classList.add('is-pending');
      reveal.observe(node);
    });
  }

  document.querySelectorAll('.mobile-menu-list a[href*="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const panel = link.closest('[uk-offcanvas]');
      if (panel && window.UIkit) window.UIkit.offcanvas(panel).hide();
    });
  });

  const marceloForm = document.querySelector('[data-contact-form="marcelo"]');
  document.querySelectorAll('[data-format]').forEach(link => link.addEventListener('click', () => {
    if (!marceloForm) return;
    marceloForm.elements.formato.value = link.dataset.format;
    const previous = marceloForm.querySelector('input[name="conferencia"]');
    if (previous) previous.remove();
    if (link.dataset.conference) {
      const field = document.createElement('input');
      field.type = 'hidden'; field.name = 'conferencia'; field.value = link.dataset.conference;
      marceloForm.append(field);
    }
  }));

  const proteaForm = document.querySelector('[data-contact-form="protea"][data-progressive-contact]');
  if (proteaForm) {
    const steps = [...proteaForm.querySelectorAll('[data-contact-step]')];
    const indicators = [...proteaForm.querySelectorAll('[data-contact-step-indicator]')];
    const progressStatus = proteaForm.querySelector('[data-contact-progress-status]');
    let currentStep = 0;

    const syncReview = () => {
      proteaForm.querySelectorAll('[data-contact-review]').forEach(output => {
        const field = proteaForm.elements[output.dataset.contactReview];
        output.textContent = field && field.value.trim() ? field.value.trim() : '—';
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
      if (progressStatus) progressStatus.textContent = `Paso ${currentStep + 1} de ${steps.length}: ${indicators[currentStep].textContent.trim()}`;
      if (moveFocus) {
        const focusTarget = steps[currentStep].querySelector('input, textarea, button');
        if (focusTarget) requestAnimationFrame(() => focusTarget.focus());
      }
    };

    const validateStep = step => {
      const invalid = [...step.querySelectorAll('input, textarea, select')].find(field => !field.checkValidity());
      if (!invalid) return true;
      invalid.reportValidity();
      return false;
    };

    proteaForm.addEventListener('click', event => {
      const next = event.target.closest('[data-contact-next]');
      const back = event.target.closest('[data-contact-back]');
      if (next && validateStep(steps[currentStep])) showStep(currentStep + 1);
      if (back) showStep(currentStep - 1);
    });

    proteaForm.addEventListener('keydown', event => {
      if (event.key !== 'Enter' || event.target.matches('textarea, button') || currentStep === steps.length - 1) return;
      event.preventDefault();
      if (validateStep(steps[currentStep])) showStep(currentStep + 1);
    });

    proteaForm.classList.add('is-enhanced');
    showStep(0, false);
  }

  // The baseline has no delivery endpoint. Never simulate a successful submission,
  // expose a made-up email address, or persist personal information in local storage.
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const status = form.querySelector('.contact-status');
      status.textContent = 'El envío todavía no está disponible. Tus datos no se han enviado.';
    });
  });
})();
