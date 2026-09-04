/* CHANGE-001: navigation, progressive copy and direct contact. No orientation engine. */
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
