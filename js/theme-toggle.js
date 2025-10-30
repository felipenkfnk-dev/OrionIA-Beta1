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

// === Orion Header Flare Control ===
(() => {
  const toggleHeaderFlare = () => {
    if (window.scrollY > 20) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', toggleHeaderFlare);
  toggleHeaderFlare(); // executa na carga
})();

// ativa .scrolled quando rolar
(() => {
  const toggleHeaderFlare = () => {
    if (window.scrollY > 20) document.body.classList.add('scrolled');
    else document.body.classList.remove('scrolled');
  };
  window.addEventListener('scroll', toggleHeaderFlare);
  toggleHeaderFlare();
})();

// pausa o flare e as partículas quando o chat é usado
const prompt = document.querySelector('#prompt');
if (prompt) {
  prompt.addEventListener('focus', () => document.body.classList.remove('scrolled'));
  prompt.addEventListener('blur',  () => {
    if (window.scrollY > 20) document.body.classList.add('scrolled');
  });
}

// === Orion Chat Activity Controller ===
(() => {
  const BODY = document.body;
  const prompt = document.querySelector('#prompt');           // input da barra
  const chatDrawer = document.querySelector('#orion-chat');   // se tiver container do chat (opcional)
  let typingTimer = null;
  const TYPING_GRACE_MS = 1200; // mantém "chat-active" por 1.2s após última tecla

  // Liga/desliga classe de forma segura
  const setChatActive = (on) => {
    if (on) BODY.classList.add('chat-active');
    else    BODY.classList.remove('chat-active');
  };

  // Foco no input do chat => ativa
  if (prompt) {
    prompt.addEventListener('focus', () => setChatActive(true));
    prompt.addEventListener('blur',  () => setChatActive(false));
    prompt.addEventListener('keydown', () => {
      setChatActive(true);
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => setChatActive(false), TYPING_GRACE_MS);
    });
  }

  // Se você abre o chat por evento (nosso FAB dispara 'orion:openChat'):
  window.addEventListener('orion:openChat', () => setChatActive(true));
  window.addEventListener('orion:closeChat', () => setChatActive(false));

  // (Opcional) Observa um drawer/modal de chat abrindo/fechando por classe
  if (chatDrawer) {
    const obs = new MutationObserver(() => {
      const open = chatDrawer.classList.contains('open') || chatDrawer.getAttribute('aria-hidden') === 'false';
      setChatActive(open);
    });
    obs.observe(chatDrawer, { attributes: true, attributeFilter: ['class','aria-hidden'] });
  }

  // Integração com a rolagem (mantém lógica existente da classe .scrolled)
  const syncOnScroll = () => {
    // Se estiver ativo no chat, não força exibição; ao sair, volta normal
    if (!BODY.classList.contains('chat-active')) {
      if (window.scrollY > 20) BODY.classList.add('scrolled');
      else BODY.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', syncOnScroll);
  syncOnScroll();
})();

// Aurora Orion: só exibe uma vez por sessão
(() => {
  if (!sessionStorage.getItem('orionGlowShown')) {
    document.body.classList.add('welcome-glow');
    sessionStorage.setItem('orionGlowShown', '1');
  }
})();



  // Exemplo: abrir painel de chat e esconder CTA
  const btn = document.getElementById('cta-orion');

  btn?.addEventListener('click', () => {
    // TODO: chame aqui sua função real de abertura do chat
    // openOrionChat();

    document.documentElement.classList.add('chat-open'); // controla visibilidade pelo CSS
  });

  // Se já existe um evento global de fechar chat, remova a classe:
  // closeOrionChat = () => {
  //   document.documentElement.classList.remove('chat-open');
  // }

