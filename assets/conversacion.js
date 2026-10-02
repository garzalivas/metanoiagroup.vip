(function(){
  const { $, $$ } = window.TMG;
  const EN = document.documentElement.lang === 'en';
  const T = EN ? {
    name:'Enter your name.', mail:'Enter a valid email, for example name@company.com.', msg:'Tell us briefly what is at stake in your system.',
    sending:'Sending…', send:'Send inquiry', fail:'The message could not be sent. Try again, or write directly via WhatsApp or email.'
  } : {
    name:'Escribe tu nombre.', mail:'Escribe un email válido, por ejemplo nombre@empresa.com.', msg:'Cuéntanos brevemente qué está en juego en tu sistema.',
    sending:'Enviando…', send:'Enviar consulta', fail:'No se pudo enviar el mensaje. Intenta de nuevo, o escribe directamente por WhatsApp o email.'
  };
  const CT = $('#contacto') || $('#contact');
  // Elegir un nivel lleva al formulario con ese nivel ya marcado
  $$('.tier .pick').forEach(b => b.addEventListener('click', () => {
    const r = $$('input[name="nivel"]').find(i => i.value === b.dataset.level);
    if (r) r.checked = true;
    CT.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => $('#f-n').focus({ preventScroll: true }), 700);
  }));
  const f = $('#cf'); if (!f) return;
  const err = $('#ferr'), ok = $('#fmsg'), btn = f.querySelector('button[type="submit"]');
  const say = m => { err.textContent = m; err.classList.toggle('on', !!m); };
  f.addEventListener('submit', async e => {
    e.preventDefault(); say('');
    const n = $('#f-n'), m = $('#f-m'), t = $('#f-t');
    if (!n.value.trim()) { say(T.name); n.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(m.value.trim())) { say(T.mail); m.focus(); return; }
    if (!t.value.trim()) { say(T.msg); t.focus(); return; }
    btn.disabled = true; btn.textContent = T.sending;
    try {
      const res = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (!data.success) throw new Error();
      try { gtag('event','generate_lead',{event_category:'contact',event_label:'form'}); } catch(_){}
      f.style.display = 'none'; ok.classList.add('on');
    } catch (_) {
      btn.disabled = false; btn.textContent = T.send;
      say(T.fail);
    }
  });
})();
