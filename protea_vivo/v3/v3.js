(() => {
  const rail = document.querySelector('[data-team-carousel]');
  const prev = document.querySelector('[data-team-prev]');
  const next = document.querySelector('[data-team-next]');

  const move = (direction) => {
    if (!rail) return;
    const card = rail.querySelector('.team-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(rail).gap || 16);
    rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };
  prev?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));

  const heroVisual = document.querySelector('.hero-organism img');
  const canAnimate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroVisual && canAnimate) {
    let ticking = false;
    const update = () => {
      const y = Math.min(window.scrollY * .045, 26);
      heroVisual.style.transform = `translate(-50%, calc(-48% + ${y}px))`;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  const cards = [...document.querySelectorAll('.team-card')];
  if ('IntersectionObserver' in window && canAnimate) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: .24 });
    cards.forEach(card => observer.observe(card));
  }
})();
