/* === Orion — Toggle de tema leve, persistente, sem mexer no seu CSS === */
(function themeAdapter(){
  const KEY='orion_theme';

  function apply(theme){ // 'light' | 'dark'
    document.body.classList.remove('light','dark');
    document.body.classList.add(theme === 'light' ? 'light' : 'dark');
    try { localStorage.setItem(KEY, theme); } catch(_) {}
  }

  function preferred(){
    try{
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }catch(_){}
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  // Estado inicial
  apply(preferred());

  // Pega o seu botão (qualquer um destes seletores) ou cria um botão flutuante se não existir
  let btn = document.querySelector('#themeToggle, #modeToggle, [data-toggle-theme], .toggle-mode');
  if (!btn){
    btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.type = 'button';
    btn.textContent = 'Tema';
    Object.assign(btn.style, {
      position:'fixed', right:'16px', bottom:'16px', zIndex:'9999',
      padding:'8px 12px', borderRadius:'999px', border:'0', cursor:'pointer',
      background:'linear-gradient(90deg,#6C00FF,#005BFF)', color:'#fff',
      boxShadow:'0 6px 18px rgba(0,0,0,.25)', fontWeight:'600'
    });
    document.body.appendChild(btn);
  }

  btn.addEventListener('click', ()=>{
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    apply(next);
  });

  // Se o SO mudar e o usuário nunca clicou, acompanha
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
  if (mq && mq.addEventListener){
    mq.addEventListener('change', e => {
      try{
        const saved = localStorage.getItem(KEY);
        if (saved !== 'light' && saved !== 'dark') apply(e.matches ? 'light' : 'dark');
      }catch(_){}
    });
  }
})();
