
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelectorAll('.protea-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${e.clientX-r.left}px`);
      card.style.setProperty('--my',`${e.clientY-r.top}px`);
    });
  });
});
