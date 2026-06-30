/**
 * memora.js — utilitários compartilhados por todas as páginas:
 * wrapper de fetch com tratamento de erro padronizado, toasts de
 * recompensa (XP/moedas/level up), confete de celebração e a
 * interação de clique/carinho na Leia.
 */

const Memora = (() => {

  async function chamarApi(url, opcoes = {}) {
    const resposta = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) },
      credentials: 'include',
      ...opcoes,
    });

    if (resposta.status === 401) {
      window.location.href = '/login';
      throw new Error('Não autenticado');
    }

    const tipoConteudo = resposta.headers.get('content-type') || '';
    const corpo = tipoConteudo.includes('application/json') ? await resposta.json() : null;

    if (!resposta.ok) {
      const mensagem = corpo?.mensagem || 'Algo deu errado. Tente novamente.';
      const erro = new Error(mensagem);
      erro.camposInvalidos = corpo?.camposInvalidos || null;
      erro.status = resposta.status;
      throw erro;
    }

    return corpo;
  }

  function exibirToast({ titulo, tipo = 'sucesso' }) {
    const container = document.getElementById('memora-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'memora-toast' + (tipo === 'erro' ? ' memora-toast--erro' : tipo === 'nivel' ? ' memora-toast--nivel' : '');
    toast.innerHTML = titulo;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }

  /**
   * Processa um objeto RecompensaResponse vindo da API: mostra o
   * toast de XP ganho, aciona a reação física da Leia (aceno de
   * alegria / surpresa) e, se a usuária subiu de nível ou a Leia
   * evoluiu, dispara o confete e um toast extra mais festivo.
   */
  function processarRecompensa(recompensa) {
    if (!recompensa) return;

    if (recompensa.xpGanho > 0) {
      exibirToast({ titulo: `🐾 +${recompensa.xpGanho} XP` + (recompensa.moedasGanhas > 0 ? ` &nbsp;·&nbsp; +${recompensa.moedasGanhas} moedas` : '') });
      reagirLeia('ganhou-xp');
    }

    if (recompensa.subiuDeNivel) {
      dispararConfete();
      reagirLeia('surpresa');
      exibirToast({ titulo: `🎉 Subiu para o nível ${recompensa.nivelAtual}!`, tipo: 'nivel' });
    }

    if (recompensa.leiaEvoluiu) {
      dispararConfete();
      reagirLeia('surpresa');
      exibirToast({ titulo: `✨ A Leia evoluiu! Agora ela está em ${formatarEstagio(recompensa.novoEstagioEvolucao)}`, tipo: 'nivel' });
    }
  }

  /**
   * Adiciona uma classe de reação temporária (leia--ganhou-xp ou
   * leia--surpresa) ao widget da Leia presente na página, removendo-a
   * automaticamente depois da duração da animação — assim a mesma
   * reação pode ser disparada de novo em seguida sem precisar esperar
   * um reset manual.
   */
  function reagirLeia(nomeReacao) {
    const widget = document.getElementById('leiaWidget');
    if (!widget) return;
    const classe = 'leia--' + nomeReacao;
    widget.classList.remove(classe);
    void widget.offsetWidth;
    widget.classList.add(classe);
    setTimeout(() => widget.classList.remove(classe), 900);
  }

  function formatarEstagio(estagio) {
    const nomes = {
      FILHOTE: 'fase filhote',
      JOVEM: 'fase jovem',
      ADULTA: 'fase adulta',
      SABIA: 'fase sábia',
      RAINHA_LEIA: 'Rainha Leia',
    };
    return nomes[estagio] || estagio;
  }

  function dispararConfete() {
    const cores = ['#4C6FE5', '#FFC94D', '#FF8C7A', '#5FCBA0', '#8FA3F2'];
    const container = document.createElement('div');
    container.className = 'confete-container';
    document.body.appendChild(container);

    for (let i = 0; i < 60; i++) {
      const particula = document.createElement('div');
      particula.className = 'confete-particula';
      particula.style.left = Math.random() * 100 + 'vw';
      particula.style.background = cores[Math.floor(Math.random() * cores.length)];
      particula.style.animationDuration = (2 + Math.random() * 1.5) + 's';
      particula.style.animationDelay = (Math.random() * 0.4) + 's';
      container.appendChild(particula);
    }

    setTimeout(() => container.remove(), 3500);
  }

  /**
   * Liga o clique de "carinho" no widget da Leia presente na página
   * (se houver). Chama o endpoint de carinho e mostra coraçõezinhos.
   */
  /**
   * Remove as classes leia--{humor} antigas do widget e aplica a nova,
   * preservando a classe de estágio de evolução (leia--{estagio}) que
   * já estava aplicada. Usado após qualquer ação que possa ter mudado
   * o humor da Leia (carinho, recompensa, etc).
   */
  function aplicarHumorNoWidget(widget, humor) {
    const HUMORES_VALIDOS = ['triste', 'entediada', 'neutra', 'feliz', 'super-feliz'];
    widget.className = widget.className
      .split(' ')
      .filter(classe => !HUMORES_VALIDOS.some(h => classe === 'leia--' + h))
      .join(' ');
    widget.classList.add('leia--' + humor.toLowerCase().replace(/_/g, '-'));
  }

  function ativarInteracaoLeia() {
    const widget = document.getElementById('leiaWidget');
    if (!widget) return;

    widget.addEventListener('click', async () => {
      widget.classList.add('leia--clicada');
      setTimeout(() => widget.classList.remove('leia--clicada'), 500);

      ['leiaCoracao1', 'leiaCoracao2'].forEach((id, indice) => {
        const coracao = document.getElementById(id);
        if (!coracao) return;
        coracao.classList.remove('ativo');
        coracao.style.left = (45 + indice * 14) + '%';
        void coracao.offsetWidth;
        coracao.classList.add('ativo');
      });

      try {
        const statusAtualizado = await chamarApi('/api/pet/carinho', { method: 'POST' });
        if (statusAtualizado?.humor) {
          aplicarHumorNoWidget(widget, statusAtualizado.humor);
        }
      } catch (e) {
        // Falha silenciosa: a interação visual já aconteceu, e um
        // carinho que falhou ao salvar não é crítico para a UX.
      }
    });
  }

  function alternarSidebarMobile() {
    const drawer = document.getElementById('appDrawer');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!drawer) return;
    drawer.classList.toggle('aberta');
    if (overlay) overlay.classList.toggle('visivel');
  }

  function inicializar() {
    ativarInteracaoLeia();

    document.querySelectorAll('[data-acao="abrir-menu"]').forEach(botao =>
      botao.addEventListener('click', alternarSidebarMobile));
    document.querySelectorAll('.sidebar-overlay').forEach(overlay =>
      overlay.addEventListener('click', alternarSidebarMobile));

    document.querySelectorAll('[data-acao="logout"]').forEach(botao =>
      botao.addEventListener('click', async () => {
        try {
          await chamarApi('/api/auth/logout', { method: 'POST' });
        } finally {
          window.location.href = '/login';
        }
      }));
  }

  document.addEventListener('DOMContentLoaded', inicializar);

  return { chamarApi, exibirToast, processarRecompensa, dispararConfete, reagirLeia, aplicarHumorNoWidget };
})();
