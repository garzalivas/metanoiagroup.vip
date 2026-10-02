(function(){
  const { reduce, $ } = window.TMG;
  const hero = $('#inicio');
/* ---------- Hero: campo de partículas caos → orden ---------- */
  const cv = $('#field'), ctx = cv.getContext('2d');
  let W, H, DPR, P = [], nodes = [], prog = reduce ? 1 : 0, t0 = performance.now();
  const N_PER = 22;
  function layout(){
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    const mobile = W < 760;
    const size = mobile ? Math.min(W * .56, H * .26) : Math.min(W * .3, H * .5);
    const cx = mobile ? W * .5 : W * .74, cy = mobile ? H * .74 : H * .5;
    nodes = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
      nodes.push({ x: cx + (c - 1) * size / 2, y: cy + (r - 1) * size / 2 });
    if (!P.length) {
      for (let i = 0; i < 9 * N_PER; i++) P.push({
        bx: Math.random(), by: Math.random(),
        ax: 30 + Math.random() * 90, ay: 30 + Math.random() * 90,
        fx: .15 + Math.random() * .5, fy: .15 + Math.random() * .5,
        ph: Math.random() * 6.28, n: i % 9, k: Math.floor(i / 9),
        s: .8 + Math.random() * 1.6, d: Math.random()
      });
    }
  }
  const ease = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
  function draw(now){
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    // cada partícula tiene un retraso propio: el orden llega por olas, no de golpe
    const lines = Math.max(0, (prog - .55) / .45);
    if (lines > 0) {
      ctx.strokeStyle = `rgba(212,180,90,${.28 * lines})`; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 0; r < 3; r++){ ctx.moveTo(nodes[r*3].x, nodes[r*3].y); ctx.lineTo(nodes[r*3+2].x, nodes[r*3+2].y); }
      for (let c = 0; c < 3; c++){ ctx.moveTo(nodes[c].x, nodes[c].y); ctx.lineTo(nodes[6+c].x, nodes[6+c].y); }
      ctx.stroke();
    }
    for (const p of P) {
      const local = Math.min(1, Math.max(0, (prog * 1.35 - p.d * .35)));
      const e = ease(local);
      const chaos = 1 - e;
      const x0 = p.bx * W + Math.sin(t * p.fx + p.ph) * p.ax + Math.sin(t * 1.7 * p.fy + p.ph * 2) * 18;
      const y0 = p.by * H + Math.cos(t * p.fy + p.ph) * p.ay + Math.cos(t * 1.3 * p.fx + p.ph) * 18;
      const nd = nodes[p.n], ang = p.k / N_PER * 6.283 + t * .12, rad = 5 + (p.k % 3) * 5;
      const x1 = nd.x + Math.cos(ang) * rad, y1 = nd.y + Math.sin(ang) * rad;
      const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e;
      ctx.fillStyle = `rgba(${Math.round(184 + 28*e)},${Math.round(150 + 30*e)},${Math.round(46 + 44*e)},${.5 + .4 * e + .2 * chaos * Math.sin(t*2 + p.ph)})`;
      ctx.beginPath(); ctx.arc(x, y, p.s * (1.25 - .55 * e), 0, 6.283); ctx.fill();
    }
    if (lines > .6) {
      ctx.fillStyle = `rgba(236,231,221,${(lines - .6) * 2.2})`;
      for (const n of nodes){ ctx.beginPath(); ctx.arc(n.x, n.y, 2.2, 0, 6.283); ctx.fill(); }
    }
  }
  let heroVisible = true;
  new IntersectionObserver(es => es.forEach(e => heroVisible = e.isIntersecting)).observe(hero);
  function loop(now){ if (heroVisible) draw(now); requestAnimationFrame(loop); }
  layout(); addEventListener('resize', layout);
  if (reduce) draw(performance.now()); else requestAnimationFrame(loop);

  
  const cue = $('#cue'), stA = $('#st-a'), stB = $('#st-b');
  window.TMG.onScroll(() => {
    const hr = hero.getBoundingClientRect(), span = hero.offsetHeight - innerHeight;
    if (!reduce) prog = Math.min(1, Math.max(0, -hr.top / (span * .9)));
    if (prog > .08){ cue.style.animation = 'none'; cue.style.opacity = 0; } else if (cue.style.animation === 'none'){ cue.style.opacity = 1; }
    stA.style.opacity = 1 - prog * .65; stB.style.opacity = .35 + prog * .65;
    if (reduce) draw(performance.now());
  });
})();
