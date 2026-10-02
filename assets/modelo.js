(function(){
  const { $, $$ } = window.TMG;
  const orbit = $('#orbit[data-scrolly]'); if (!orbit) return;
  const svg = $('#orbit-svg'), legend = $('#legend');
  window.TMG.buildOrbit(orbit, svg, ['MSA','MEC','MBC','MWS','MES','MFB']);
  const nodes = [...orbit.querySelectorAll('.o-node')], spokes = [...svg.querySelectorAll('.spoke')];
  const arts = $$('.vx'), chips = $$('.chips a');
  const names = {}; arts.forEach(a => names[a.dataset.k] = a.querySelector('.v-name').textContent);
  function set(k){
    nodes.forEach(n => n.classList.toggle('on', n.dataset.k === k));
    const i = nodes.find(n => n.dataset.k === k).dataset.i;
    spokes.forEach(s => s.classList.toggle('on', k === 'MSA' || s.dataset.i === i));
    legend.textContent = names[k];
    chips.forEach(c => {
      const on = c.dataset.k === k; c.classList.toggle('on', on);
      if (on && c.parentElement.scrollWidth > c.parentElement.clientWidth)
        c.parentElement.scrollTo({ left: c.offsetLeft - 24, behavior: 'smooth' });
    });
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(e.target.dataset.k); }), { rootMargin: '-40% 0px -55% 0px' });
  arts.forEach(a => io.observe(a));
  nodes.forEach(n => n.addEventListener('click', () => document.getElementById('v-' + n.dataset.k.toLowerCase()).scrollIntoView({ block: 'start' })));
  set('MSA');
})();
