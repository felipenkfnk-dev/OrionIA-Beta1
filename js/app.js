(function(){
  const $ = s => document.querySelector(s);
  const room = $('#room');
  const chatBox = $('#chat');
  const input = $('#prompt');
  const sendBtn = $('#sendBtn');
  const themeToggle = $('#themeToggle');
  const year = $('#year');

  const LOCAL_KEY = 'orion_chat_history_v1';
  const THEME_KEY = 'orion_theme';

  function setTheme(mode){
    document.body.classList.toggle('light', mode==='light');
    document.body.classList.toggle('dark', mode!=='light');
    localStorage.setItem(THEME_KEY, mode==='light'?'light':'dark');
  }

  function msg(role, html, typing=false){
    const wrap = document.createElement('div');
    wrap.className = 'msg '+(role==='user'?'me':'ai');
    const avatar = document.createElement('div'); avatar.className = 'avatar';
    const bubble = document.createElement('div'); bubble.className = 'bubble';
    if(typing) bubble.classList.add('typing');
    wrap.appendChild(avatar); wrap.appendChild(bubble);
    room.appendChild(wrap);
    chatBox.style.display = 'block';
    room.scrollTop = room.scrollHeight;

    if(!typing){ bubble.innerHTML = html; return bubble; }
    typeHTML(bubble, html, 12, ()=>{ bubble.classList.remove('typing'); save(); });
    return bubble;
  }

  function typeHTML(el, html, delay, done){
    let i=0, out='';
    function step(){
      if(i>=html.length){ el.innerHTML = out; return done&&done(); }
      const ch = html[i];
      if(ch === '<'){
        const j = html.indexOf('>', i);
        if(j === -1){ out += ch; i++; } else { out += html.slice(i, j+1); i = j+1; }
      } else { out += ch; i++; }
      el.innerHTML = out;
      el.scrollIntoView({block:'end'});
      setTimeout(step, delay);
    }
    step();
  }

  function escapeHTML(str){
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[m]));
  }

  function save(){
    const items = [...room.querySelectorAll('.bubble')].map(el=>el.innerHTML);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }

  function load(){
    const raw = localStorage.getItem(LOCAL_KEY);
    if(!raw) return;
    const items = JSON.parse(raw);
    if(items.length){ chatBox.style.display='block'; }
    items.forEach((t,i)=> msg(i%2? 'assistant':'user', t, false));
  }

  function orionAnswer(){
    const answer = `Sou a Orion IA. Vamos transformar isso em ação agora mesmo.<br><br>
      • <b>Gerar Ideias</b>: abra o módulo <a href="/sistema/ideia.html">Ideia</a><br>
      • <b>Validar</b>: verifique potencial em <a href="/sistema/validador.html">Validador</a><br>
      • <b>Oferta</b>: crie proposta em <a href="/sistema/oferta.html">Oferta</a><br>
      • <b>Landing Page</b>: gere sua LP em <a href="/sistema/lp.html">LP</a><br>
      • <b>Vendas</b>: siga roteiro em <a href="/sistema/vendas.html">Vendas</a>`;
    msg('assistant', answer, true);
  }

  function submitPrompt(){
    const v = input.value.trim();
    if(!v) return;
    msg('user', escapeHTML(v), false);
    input.value='';
    setTimeout(orionAnswer, 250);
    save();
  }

  // Submit handlers
  input.addEventListener('keydown', e=>{
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault();
      submitPrompt();
    }
  });
  sendBtn.addEventListener('click
  try { orionUncenterOnce(); } catch(e) {}
', submitPrompt);

  // Quick fills
  document.querySelectorAll('.chip').forEach(ch=> ch.addEventListener('click', ()=>{
    input.value = ch.getAttribute('data-suggest');
    input.focus();
  }));

  // CTA
  document.getElementById('openSystem').addEventListener('click', ()=>{
    window.location.href = '/sistema/';
  });

  // Footer year
  year.textContent = new Date().getFullYear();

  // Theme init from storage or OS
  const osLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(localStorage.getItem(THEME_KEY) || (osLight ? 'light' : 'dark'));

  // Toggle theme by clicking the gradient pill (no icons)
  themeToggle.addEventListener('click', ()=>{
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(next);
  });

  // Load history
  load();


  document.getElementById('orion-chat-fab')?.addEventListener('click', () => {
    // TODO: troque por sua função real
    // openChatDrawer();  // ex.: abre a lateral do chat
    const evt = new CustomEvent('orion:openChat'); // evento padrão Orion
    window.dispatchEvent(evt);
  });

})();


// Orion CTA – abrir chat e ocultar botão
const btnCTA = document.getElementById('cta-orion');

if (btnCTA){
  btnCTA.addEventListener('click', () => {
    document.documentElement.classList.add('chat-open');
    // openOrionChat(); // substitua por sua função real se já existir
  });
}

// função para reexibir quando o chat fechar
function closeOrionChat(){
  document.documentElement.classList.remove('chat-open');
}

// --- Versão opcional: botão mini automático no scroll ---
const cta = document.getElementById('cta-orion');
let miniState = false;

function handleMiniScroll(){
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const limit = 220; // altura para entrar no modo mini
  if (cta){
    if (scrollY > limit && !miniState){
      cta.classList.add('cta--mini');
      miniState = true;
    } else if (scrollY <= limit && miniState){
      cta.classList.remove('cta--mini');
      miniState = false;
    }
  }
}

window.addEventListener('scroll', handleMiniScroll);

// Animação suave ao abrir/fechar chat
// já controlada pela classe .chat-open via CSS
function openOrionChat(){
  document.documentElement.classList.add('chat-open');
}
function closeOrionChat(){
  document.documentElement.classList.remove('chat-open');
}

// Exemplo: liga/desliga simulando a abertura real
const btn = document.getElementById('cta-orion');
btn?.addEventListener('click', () => {
  // Se o chat não estiver aberto, abre
  if(!document.documentElement.classList.contains('chat-open')){
    openOrionChat();
  } else {
    closeOrionChat();
  }
});

// força mini
document.getElementById('cta-orion')?.classList.add('cta--mini');
// desfaz
// document.getElementById('cta-orion')?.classList.remove('cta--mini');


