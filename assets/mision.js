(function(){
  const { reduce, $, $$ } = window.TMG;
  const all = $('#vals-all'), vals = $$('.val'), EN = document.documentElement.lang === 'en';
  if (all){
    const sync = () => { const open = vals.every(v => v.open); all.textContent = open ? (EN ? 'Close all eight' : 'Cerrar los ocho') : (EN ? 'Open all eight' : 'Abrir los ocho'); };
    all.addEventListener('click', () => { const open = vals.every(v => v.open); vals.forEach(v => v.open = !open); sync(); });
    vals.forEach(v => v.addEventListener('toggle', sync)); sync();
  }
  const nums = $$('[data-count]');
  if (!nums.length || reduce) return;
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, t0 = performance.now(), D = 1600;
    if (to === 0){ el.textContent = '0'; return; }
    const step = now => { const k = Math.min(1, (now - t0) / D), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = v; if (k < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  }), { threshold: .6 });
  nums.forEach(n => io.observe(n));
})();
