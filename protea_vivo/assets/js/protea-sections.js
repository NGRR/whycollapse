(() => {
  const signalButtons = Array.from(document.querySelectorAll('[data-signal-grid] button'));
  const response = document.querySelector('[data-signal-response]');
  const segmentButtons = Array.from(document.querySelectorAll('[data-segment]'));
  const stateNode = document.querySelector('[data-adaptive-state]');
  const summary = document.querySelector('[data-adaptive-summary]');
  const footerCta = document.querySelector('.footer-cta');
  const finalCta = document.querySelector('[data-final-debrief]');
  const journeyLinks = Array.from(document.querySelectorAll('.journey-line [data-route]'));
  const selectedBox = document.querySelector('[data-selected-signals]');
  const selectedList = document.querySelector('[data-selected-signals-list]');
  const confirmButton = document.querySelector('[data-confirm-orientation]');
  const storageKey = 'protea-adaptive-context-v2';
  const handoffKey = 'protea-contact-handoff-v1';

  const routeLabels = {
    diagnos: 'Conviene comenzar comprendiendo qué ocurre y ordenando prioridades.',
    iao: 'Conviene comenzar observando señales, tensiones y capacidad de adaptación.',
    lab: 'Conviene trabajar un desafío real mediante exploración y evidencia.',
    hub: 'Conviene sostener el aprendizaje y conectar conocimiento entre áreas.',
    training: 'Conviene entrenar lenguaje, criterio y capacidades compartidas.'
  };
  const routeTitles = {
    diagnos: 'Consciencia · comprender antes de actuar',
    iao: 'Medición estratégica · saber dónde estás',
    lab: 'Arraigo · trabajar un desafío real',
    hub: 'Huella · sostener el aprendizaje',
    training: 'Entrenamiento · desarrollar capacidades'
  };
  const segmentLabels = { empresa: 'empresa', publica: 'administración pública' };

  let context = { segment: '', selected: [] };
  let confirmed = false;
  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    if (stored && typeof stored === 'object') context = { ...context, ...stored };
  } catch (_) {}

  function signalText(id) {
    const btn = signalButtons.find((item) => item.dataset.signal === id);
    return btn ? btn.textContent.replace(/^\s*\d+\s*/, '').replace(/Seleccionada\s*$/i, '').trim() : '';
  }

  function dominantRoute() {
    if (!context.selected.length) return '';
    const counts = context.selected.reduce((acc, signalId) => {
      const button = signalButtons.find((item) => item.dataset.signal === signalId);
      if (!button) return acc;
      const route = button.dataset.route;
      acc[route] = (acc[route] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  function referenceFor(route) {
    const base = `${route || 'general'}-${context.segment || 'sinsegmento'}-${context.selected.join('-')}`;
    let hash = 0;
    for (let i = 0; i < base.length; i += 1) hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0;
    return `PROTEA-${Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padStart(6, '0')}`;
  }

  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(context)); } catch (_) {}
  }

  function clearConfirmation() {
    confirmed = false;
    if (summary) summary.hidden = true;
    if (footerCta) footerCta.classList.remove('has-orientation');
    if (finalCta) {
      finalCta.href = 'pages/debrief.html';
      finalCta.textContent = 'Preparar conversación →';
    }
  }

  function renderSelectedTags() {
    if (!selectedBox || !selectedList) return;
    selectedList.innerHTML = '';
    selectedBox.hidden = context.selected.length === 0;
    context.selected.forEach((id) => {
      const tag = document.createElement('button');
      tag.type = 'button';
      tag.className = 'selected-signal-tag';
      tag.dataset.removeSignal = id;
      tag.setAttribute('aria-label', `Quitar: ${signalText(id)}`);
      tag.innerHTML = `<span>${signalText(id)}</span><b aria-hidden="true">×</b>`;
      tag.addEventListener('click', () => {
        context.selected = context.selected.filter((item) => item !== id);
        clearConfirmation();
        persist();
        applyContext();
      });
      selectedList.appendChild(tag);
    });
    if (confirmButton) confirmButton.disabled = context.selected.length === 0;
  }

  function renderSummary(route) {
    if (!summary || !route) return;
    const reference = referenceFor(route);
    const selectedTexts = context.selected.map(signalText);
    summary.hidden = false;
    summary.querySelector('[data-summary-title]').textContent = routeTitles[route];
    summary.querySelector('[data-summary-copy]').textContent = `${routeLabels[route]}${context.segment ? ` Orientación ajustada para ${segmentLabels[context.segment]}.` : ''}`;
    summary.querySelector('[data-summary-reference]').textContent = reference;
    const signalWrap = summary.querySelector('[data-summary-signals]');
    signalWrap.innerHTML = selectedTexts.map((text) => `<span>${text}</span>`).join('');
    const handoff = {
      reference,
      route,
      routeTitle: routeTitles[route],
      recommendation: routeLabels[route],
      segment: context.segment,
      segmentLabel: segmentLabels[context.segment] || 'sin segmento definido',
      signals: selectedTexts
    };
    try { sessionStorage.setItem(handoffKey, JSON.stringify(handoff)); } catch (_) {}
    if (finalCta) {
      finalCta.href = `pages/debrief.html?ref=${encodeURIComponent(reference)}`;
      finalCta.textContent = 'Revisar orientación y preparar conversación →';
    }
    if (footerCta) footerCta.classList.add('has-orientation');
  }

  function applyContext() {
    signalButtons.forEach((button) => {
      const selected = context.selected.includes(button.dataset.signal);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    segmentButtons.forEach((button) => {
      const selected = button.dataset.segment === context.segment;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderSelectedTags();

    if (stateNode) {
      stateNode.textContent = context.segment
        ? `Contexto activo: ${segmentLabels[context.segment]}. La orientación se conservará durante esta sesión.`
        : 'Sin contexto definido. La orientación será general.';
    }

    const route = dominantRoute();
    journeyLinks.forEach((link) => link.classList.toggle('is-recommended', link.dataset.route === route));

    if (!response) return;
    const strong = response.querySelector('strong');
    const span = response.querySelector('span');
    if (!route) {
      strong.textContent = 'Si reconoces una o más señales, hay un desafío adaptativo.';
      span.textContent = 'Selecciona situaciones para visualizar una orientación inicial.';
      clearConfirmation();
      return;
    }

    strong.textContent = `${context.selected.length} señal${context.selected.length > 1 ? 'es' : ''} reconocida${context.selected.length > 1 ? 's' : ''}.`;
    span.textContent = `${routeLabels[route]} Confirma la selección para incorporarla a tu orientación.`;
    if (confirmed) renderSummary(route);
  }

  signalButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const signalId = button.dataset.signal;
      const index = context.selected.indexOf(signalId);
      if (index >= 0) context.selected.splice(index, 1);
      else context.selected.push(signalId);
      clearConfirmation();
      persist();
      applyContext();
    });
  });

  segmentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      context.segment = context.segment === button.dataset.segment ? '' : button.dataset.segment;
      clearConfirmation();
      persist();
      applyContext();
    });
  });

  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      const route = dominantRoute();
      if (!route) return;
      confirmed = true;
      renderSummary(route);
      window.requestAnimationFrame(() => {
        summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => summary.focus({ preventScroll: true }), 620);
      });
    });
  }

  applyContext();
})();


// Rail narrativo: estado activo sincronizado con el recorrido real.
(() => {
  const railLinks = Array.from(document.querySelectorAll('.section-rail .rail-item'));
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-story-nav a'));
  const sections = railLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  function setActive(id) {
    [...railLinks, ...mobileLinks].forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-28% 0px -54% 0px', threshold: [0.01, 0.15, 0.35, 0.6] });

  sections.forEach((section) => observer.observe(section));
})();
