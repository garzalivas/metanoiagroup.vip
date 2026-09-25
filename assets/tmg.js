(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  window.TMG = { reduce, $, $$ };
  const L = document.documentElement.lang === 'en';

  /* Analítica: cada CTA se registra con su propia etiqueta */
  $$('[data-ev]').forEach(a => a.addEventListener('click', () => {
    try { gtag('event','click',{event_category:'cta',event_label:a.dataset.ev}); } catch(e){}
  }));

  /* Flama compartida: se incrusta una sola vez en el logo */
  const FL = $('.brand img') && $('.brand img').src;
  $$('[data-flame]').forEach(i => i.src = FL);
  window.TMG.FL = FL;

  /* Menú móvil */
  const mb = $('.menu-btn');
  const close = () => { document.body.classList.remove('menu-open'); mb.setAttribute('aria-expanded', false); };
  mb.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    mb.setAttribute('aria-expanded', open);
    mb.setAttribute('aria-label', open ? (L ? 'Close menu' : 'Cerrar menú') : (L ? 'Open menu' : 'Abrir menú'));
  });
  $$('.drawer a').forEach(a => a.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* Scroll: progreso, nav sólida, CTA móvil */
  const nav = $('#nav'), bar = $('.progress'), hero = $('[data-hero]'), door = $('[data-door]'), mcta = $('#mcta');
  const hooks = [];
  window.TMG.onScroll = fn => hooks.push(fn);
  function onScroll(){
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const hb = hero ? hero.getBoundingClientRect().bottom : 0;
    nav.classList.toggle('solid', hb < 80);
    nav.classList.toggle('scrolled', y > 12 && hb >= 80);
    const dt = door ? door.getBoundingClientRect().top : Infinity;
    mcta.classList.toggle('show', hb < innerHeight * .4 && dt > innerHeight * .9);
    hooks.forEach(f => f());
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('load', onScroll); onScroll();

  /* Revelados sutiles, una sola vez */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv,.draw').forEach(el => io.observe(el));

  /* Índice lateral generado desde las secciones */
  const toc = $('#toc'), secs = $$('[data-toc]');
  if (toc && secs.length){
    secs.forEach(s => toc.insertAdjacentHTML('beforeend', `<li><a href="#${s.id}"><span>${s.dataset.tocLabel}</span><i>${s.dataset.toc}</i></a></li>`));
    const links = $$('#toc a');
    const tio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting){
        links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
        toc.classList.toggle('on-dark', e.target.matches('.dark,.door'));
      }
    }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => tio.observe(s));
    if (hero) new IntersectionObserver(es => es.forEach(e => toc.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0))).observe(hero);
  }

  /* Pestañas accesibles (diferenciadores) */
  $$('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const sel = tab => tabs.forEach(t => {
      const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).classList.toggle('on', on);
    });
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
          const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; sel(n); n.focus();
        }
      });
    });
  });

  /* Matriz 3×3 (dominio × profundidad) */
  const mx = $('#matrix');
  if (mx){
    const rows = L ? ['Person','Company','Wealth'] : ['Persona','Empresa','Patrimonio'];
    const cols = L ? ['Structure','Purpose','Adaptation'] : ['Estructura','Propósito','Adaptación'];
    const idle = mx.dataset.idle || '';
    const read = $('#mx-read');
    rows.forEach((r, ri) => {
      mx.insertAdjacentHTML('beforeend', `<button class="mx-h row" data-r="${ri}">${r}</button>`);
      cols.forEach((c, ci) => mx.insertAdjacentHTML('beforeend',
        `<button class="mx-c${ri===2?' r-last':''}${ci===2?' c-last':''}" data-r="${ri}" data-c="${ci}" aria-label="${r} × ${c}"><i></i></button>`));
    });
    const cells = [...mx.querySelectorAll('.mx-c')], heads = [...mx.querySelectorAll('.mx-h')];
    const light = (r, c) => {
      cells.forEach(el => { const hit = (r == null || el.dataset.r == r) && (c == null || el.dataset.c == c); el.classList.toggle('on', hit); el.classList.toggle('dim', !hit); });
      heads.forEach(h => h.classList.toggle('on', (h.dataset.r != null && h.dataset.r == r) || (h.dataset.c != null && h.dataset.c == c)));
      if (r != null && c != null) read.innerHTML = `<b>${rows[r]}</b> × ${cols[c]}`;
      else if (r != null) read.innerHTML = `<b>${rows[r]}</b>: ${cols.join(', ').toLowerCase()}`;
      else read.innerHTML = `<b>${cols[c]}</b>: ${rows.join(', ').toLowerCase()}`;
    };
    const reset = () => { cells.forEach(el => el.classList.remove('on','dim')); heads.forEach(h => h.classList.remove('on')); read.textContent = idle; };
    [...cells, ...heads].forEach(el => {
      const go = () => light(el.dataset.r ?? null, el.dataset.c ?? null);
      el.addEventListener('mouseenter', go); el.addEventListener('focus', go); el.addEventListener('click', go);
    });
    mx.addEventListener('mouseleave', reset);
    let demo = false;
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !demo && !reduce){ demo = true;
        [[0,0],[1,1],[2,2]].forEach(([r,c],i) => setTimeout(() => light(r,c), 500 + i*650));
        setTimeout(reset, 2950);
      }
    }), { threshold: .6 }).observe(mx);
    reset();
    window.TMG.matrix = mx;
  }

  /* Órbita de verticales (home) */
  const orbit = $('#orbit');
  if (orbit && !orbit.dataset.scrolly){
    const svg = $('#orbit-svg'), items = $$('.v-item'), keys = ['MSA','MEC','MBC','MWS','MES','MFB'];
    let cur = 0, auto = null;
    buildOrbit(orbit, svg, keys);
    const nodes = [...orbit.querySelectorAll('.o-node')], spokes = [...svg.querySelectorAll('.spoke')];
    const set = (i, user) => {
      cur = (i + 6) % 6;
      nodes.forEach(n => n.classList.toggle('on', +n.dataset.i === cur));
      items.forEach(it => it.classList.toggle('on', it.dataset.k === keys[cur]));
      spokes.forEach(s => s.classList.toggle('on', cur === 0 || +s.dataset.i === cur));
      $('#v-count').textContent = `${cur + 1} ${L ? 'of' : 'de'} 6`;
      if (user){ clearInterval(auto); auto = null; orbit.dataset.touched = 1; }
    };
    nodes.forEach(n => n.addEventListener('click', () => set(+n.dataset.i, true)));
    $('#v-prev').addEventListener('click', () => set(cur - 1, true));
    $('#v-next').addEventListener('click', () => set(cur + 1, true));
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && auto === null && !reduce && !orbit.dataset.touched) auto = setInterval(() => set(cur + 1), 4200);
      if (!e.isIntersecting){ clearInterval(auto); auto = null; }
    }), { threshold: .5 }).observe(orbit);
    set(0);
  }

  function buildOrbit(orbit, svg, keys){
    orbit.insertAdjacentHTML('beforeend', `<button class="o-node core on" data-i="0" data-k="MSA" style="left:50%;top:50%" aria-label="MSA, Metanoia Strategic Advisory"><span><img src="${FL}" alt="">MSA</span></button>`);
    keys.slice(1).forEach((k, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 5, x = 50 + Math.cos(a) * 38, y = 50 + Math.sin(a) * 38;
      svg.insertAdjacentHTML('afterbegin', `<line class="spoke" data-i="${i+1}" x1="50" y1="50" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}"/>`);
      orbit.insertAdjacentHTML('beforeend', `<button class="o-node" data-i="${i+1}" data-k="${k}" style="left:${x}%;top:${y}%" aria-label="${k}">${k}</button>`);
    });
  }
  window.TMG.buildOrbit = buildOrbit;
})();
