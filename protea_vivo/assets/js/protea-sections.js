(() => {
  const process = document.querySelector('.capability-process');
  if (process) {
    const cards = Array.from(process.querySelectorAll('.capability-card'));
    const desktopQuery = window.matchMedia('(min-width: 960px)');

    function activateCard(card) {
      if (!desktopQuery.matches) return;

      cards.forEach((item) => {
        const isActive = item === card;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-expanded', String(isActive));
        item.parentElement?.classList.toggle('is-active-item', isActive);
      });
    }

    function disableCards() {
      process.classList.remove('is-expanded');
      cards.forEach((item) => {
        item.classList.remove('is-active');
        item.removeAttribute('role');
        item.removeAttribute('tabindex');
        item.removeAttribute('aria-expanded');
        item.parentElement?.classList.remove('is-active-item');
      });
    }

    function enableCards() {
      process.classList.add('is-expanded');
      cards.forEach((item) => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
      });
      activateCard(cards.find((item) => item.classList.contains('is-active')) || cards[0]);
    }

    function syncInteractionMode() {
      if (desktopQuery.matches) {
        enableCards();
      } else {
        disableCards();
      }
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => activateCard(card));
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activateCard(card);
      });
    });

    syncInteractionMode();
    desktopQuery.addEventListener('change', syncInteractionMode);
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
