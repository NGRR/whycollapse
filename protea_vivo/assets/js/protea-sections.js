(() => {
  const process = document.querySelector('.capability-process');
  if (process) {
    const cards = Array.from(process.querySelectorAll('.capability-card'));
    process.classList.add('is-expanded');

    function activateCard(card) {
      cards.forEach((item) => {
        const isActive = item === card;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-expanded', String(isActive));
        item.parentElement?.classList.toggle('is-active-item', isActive);
      });
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => activateCard(card));
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activateCard(card);
      });
    });
  }

  const collapseField = document.querySelector('.collapse-field');
  if (!collapseField) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let frame = 0;
  let lastY = window.scrollY || 0;

  function tick(now) {
    const scrollDelta = (window.scrollY || 0) - lastY;
    lastY += scrollDelta * 0.08;
    const drift = Math.sin(now * 0.00025) * 12 + scrollDelta * 0.08;
    collapseField.style.setProperty('--collapse-drift', `${drift.toFixed(2)}px`);
    frame = requestAnimationFrame(tick);
  }

  frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
})();
