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

 (function(){
const frases = [
  'Olá eu sou a <strong class="orion-gradient-animated orion-delay-1">Orion,</strong> uma IA criada para transformar ideias em negócios digitais reais.',
  'Pronta para levar suas ideias ao próximo nível, com <strong class="orion-gradient-animated orion-delay-2">resultados concretos</strong> e consistentes.',
  'Vamos <strong class="orion-gradient-animated orion-delay-3">começar</strong> a construir o<br>futuro do seu projeto hoje?'
];

  const container = document.querySelector('.hero-headline');
  const title = container?.querySelector('.hero-title');
  if (!container || !title) return;

  title.innerHTML = '';
  const slides = frases.map((frase, index) => {
    const span = document.createElement('span');
    span.className = 'hero-slide';
    if (index === 0) span.classList.add('is-active');
    span.innerHTML = frase;
    title.appendChild(span);
    return span;
  });

  let activeIndex = 0;
  let timer = null;
  const PERIOD = 5000;

  function show(index){
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    activeIndex = index;
  }

  function measure(){
    if (!slides.length) return;
    const snapshots = slides.map(slide => ({
      position: slide.style.position,
      opacity: slide.style.opacity,
      visibility: slide.style.visibility,
      transform: slide.style.transform
    }));

    slides.forEach(slide => {
      slide.style.position = 'static';
      slide.style.opacity = '1';
      slide.style.visibility = 'hidden';
      slide.style.transform = 'none';
    });

    const maxHeight = slides.reduce((max, slide) => Math.max(max, slide.offsetHeight), 0);

    slides.forEach((slide, idx) => {
      const state = snapshots[idx];
      slide.style.position = state.position || '';
      slide.style.opacity = state.opacity || '';
      slide.style.visibility = state.visibility || '';
      slide.style.transform = state.transform || '';
    });

    if (maxHeight) {
      container.style.setProperty('--hero-title-height', `${maxHeight}px`);
    }
  }

  function requestMeasure(){
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(measure);
    } else {
      measure();
    }
  }

  requestMeasure();
  window.setTimeout(requestMeasure, 250);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(requestMeasure, 150);
  });

  function play(){
    if (slides.length <= 1) return;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      const next = (activeIndex + 1) % slides.length;
      show(next);
    }, PERIOD);
  }

  function pause(){
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(); else play();
  });

  let pausedByScroll = false;
  const SCROLL_LIMIT = 120;
  window.addEventListener('scroll', () => {
    const y = window.scrollY || window.pageYOffset;
    if (!pausedByScroll && y > SCROLL_LIMIT) {
      pausedByScroll = true;
      pause();
    } else if (pausedByScroll && y <= SCROLL_LIMIT) {
      pausedByScroll = false;
      play();
    }
  }, { passive: true });

  const motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery) {
    const handleMotionChange = (event) => {
      if (event.matches) {
        requestMeasure();
      }
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(handleMotionChange);
    }
  }

  show(activeIndex);
  if (!document.hidden) {
    play();
  }
})();



  


