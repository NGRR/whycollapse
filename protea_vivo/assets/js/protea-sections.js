(() => {
  const collapseField = document.querySelector('.collapse-field');
  if (!collapseField) return;

  let frame = 0;
  let lastY = window.scrollY || 0;

  function tick(now) {
    const scrollDelta = (window.scrollY || 0) - lastY;
    lastY += scrollDelta * 0.08;
    const drift = Math.sin(now * 0.00035) * 18 + scrollDelta * 0.12;
    collapseField.style.setProperty('--collapse-drift', `${drift.toFixed(2)}px`);
    frame = requestAnimationFrame(tick);
  }

  frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
})();
