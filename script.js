// Menu em telemóvel
const botao = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
botao.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  botao.setAttribute('aria-expanded', aberto);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
  }
});

// Link ativo conforme a secção visível
const ligacoes = [...menu.querySelectorAll('a')];
const obsMenu = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      ligacoes.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => obsMenu.observe(s));

// Contagem animada dos números (respeita "reduzir movimento")
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const formatar = (v, casas) => v.toFixed(casas).replace('.', ',');

function contar(el) {
  const alvo = parseFloat(el.dataset.alvo);
  const casas = parseInt(el.dataset.casas || '0', 10);
  const sufixo = el.dataset.sufixo || '';
  const duracao = 1200;
  const inicio = performance.now();
  function passo(agora) {
    const t = Math.min((agora - inicio) / duracao, 1);
    el.textContent = formatar(alvo * (1 - Math.pow(1 - t, 3)), casas) + sufixo;
    if (t < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

const obsNum = new IntersectionObserver((entradas, obs) => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      if (!reduzir) contar(en.target);
      obs.unobserve(en.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.num').forEach(n => obsNum.observe(n));

// Verificador dos 13 itens essenciais
const caixas = document.querySelectorAll('#itens input');
const contador = document.getElementById('contador');
caixas.forEach(c => c.addEventListener('change', () => {
  c.closest('li').classList.toggle('marcado', c.checked);
  const n = [...caixas].filter(x => x.checked).length;
  const privacao = n >= 5;
  contador.textContent = n + ' de 13 itens em falta' + (privacao ? ' — situação de privação material e social' : '');
  contador.classList.toggle('alerta', privacao);
}));

// Fluidez: entrada suave dos elementos e barra de progresso
document.documentElement.classList.add('js');
const alvos = document.querySelectorAll('.bloco .estreito > *, .cartao, .foto, .numeros > div, .evolucao, .impacto, .itens');
alvos.forEach(el => el.classList.add('reveal'));
const obsReveal = new IntersectionObserver((entradas, obs) => {
  entradas.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('visivel'); obs.unobserve(en.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
alvos.forEach(el => obsReveal.observe(el));

const barra = document.querySelector('.progresso');
let esperando = false;
function atualizarBarra() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
  esperando = false;
}
window.addEventListener('scroll', () => {
  if (!esperando) { esperando = true; requestAnimationFrame(atualizarBarra); }
}, { passive: true });
atualizarBarra();
