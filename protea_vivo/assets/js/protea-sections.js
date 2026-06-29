(() => {
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
