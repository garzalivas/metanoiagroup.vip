(function(){
  const { reduce, $, $$ } = window.TMG;
  const rg = $('.regime'); if (rg) rg.scrollLeft = (rg.scrollWidth - rg.clientWidth) * .55;
  const mx = $('#matrix.net'); if (!mx) return;
  const cells = [...mx.querySelectorAll('.mx-c')];
  const J = [[-14,9],[11,-12],[-6,15],[16,6],[-12,-10],[8,14],[-16,-4],[13,-15],[-7,11]];
  cells.forEach((c, i) => {
    if (c.dataset.c === '0') c.classList.add('c-first');
    if (c.dataset.r === '0') c.classList.add('r-first');
    c.style.setProperty('--jx', J[i][0] + 'px'); c.style.setProperty('--jy', J[i][1] + 'px');
  });
  const btns = $$('.coh-toggle button');
  const set = v => { mx.classList.toggle('linked', v === 'system'); btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); };
  btns.forEach(b => b.addEventListener('click', () => { set(b.dataset.v); mx.dataset.touched = 1; }));
  if (reduce) { set('system'); return; }
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting){ o.disconnect(); setTimeout(() => { if (!mx.dataset.touched) set('system'); }, 3400); }
  }), { threshold: .6 }).observe(mx);
})();
