/**
 * ==========================================================================
 * LEIA — Sistema de acessórios em camadas (AccessoryConfig + AccessoryRenderer)
 * ==========================================================================
 *
 * PROBLEMA QUE ISSO RESOLVE
 * --------------------------------------------------------------------------
 * Antes, cada acessório equipado era um emoji (ex.: "🎀") num <span> solto,
 * posicionado com top/left em % por CIMA da imagem da Leia. Isso causava:
 *   - desalinhamento (emoji não tem "ponto de encaixe" com a anatomia);
 *   - tamanho fixo em rem, que não acompanha o estágio de evolução da Leia;
 *   - renderização diferente por SO/navegador (fonte de emoji varia).
 *
 * ARQUITETURA NOVA
 * --------------------------------------------------------------------------
 *   Avatar (fragments/leia.html, <svg viewBox="0 0 220 210">)
 *     └── AccessoryLayer  → <g id="leiaAcessorios"> dentro do MESMO svg
 *           └── AccessoryRenderer (este arquivo) desenha um <g> por item,
 *               usando as mesmas coordenadas do corpo/cabeça/olhos.
 *
 *   Como tudo vive dentro do viewBox do próprio SVG, a posição do acessório
 *   é sempre relativa à anatomia da Leia — nunca à tela. Redimensionar o
 *   widget (mobile, tablet, desktop, ou trocar de estágio de evolução) só
 *   escala o SVG inteiro, e o acessório escala junto, sempre no lugar certo.
 *
 * COMO ADICIONAR UM NOVO ACESSÓRIO NO FUTURO
 * --------------------------------------------------------------------------
 *   1. Se nenhuma forma existente servir, crie uma nova função em
 *      ACCESSORY_SHAPES (recebe cores, devolve markup SVG centrado em 0,0
 *      com "y negativo" = para cima e "y positivo" = para baixo).
 *   2. Adicione uma entrada em ACCESSORY_CONFIG usando o `nome` exato do
 *      CosmeticItem cadastrado no banco. Escolha a âncora anatômica mais
 *      próxima (LEIA_ANCHORS) e ajuste offsetX/offsetY/escala/rotacao.
 *   3. Nunca invente coordenadas soltas — sempre a partir de uma âncora.
 *
 * Se um item novo for cadastrado no banco sem entrada aqui, o sistema usa
 * um fallback por `categoria` (CATEGORIA_PADRAO), então nada quebra —
 * mas o ideal é sempre cadastrar a entrada específica para o encaixe ficar
 * perfeito.
 * ==========================================================================
 */
(function () {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * LEIA_ANCHORS — pontos fixos da anatomia da Leia, nas MESMAS coordenadas
   * do <svg viewBox="0 0 220 210"> em fragments/leia.html. Cada acessório
   * parte de uma dessas âncoras + um pequeno offset, nunca de um valor solto.
   * ------------------------------------------------------------------------
   *  topoCabeca → entre as orelhas, sobre o topo do crânio (laços, chapéus, coroa)
   *  olhos      → centro exato entre os dois olhos (óculos)
   *  peito      → logo abaixo do queixo/boca, no peito (gravatas, colares)
   *  costas     → atrás dos ombros/corpo (asas, capas)
   */
  const LEIA_ANCHORS = {
    topoCabeca: { x: 110, y: 38 },
    olhos: { x: 110, y: 108 },
    peito: { x: 110, y: 146 },
    costas: { x: 110, y: 150 },
  };

  /** Ordem de empilhamento (o que vem depois desenha por cima). */
  const ORDEM_ANCORAS = ['costas', 'peito', 'olhos', 'topoCabeca'];

  // ------------------------------------------------------------------------
  // ACCESSORY SHAPES — desenhos vetoriais, centrados no próprio ponto de
  // encaixe (0,0). Nunca usam <image>/emoji: são formas geométricas simples
  // no mesmo estilo "chibi" flat do resto da Leia.
  // ------------------------------------------------------------------------
  const ACCESSORY_SHAPES = {

    // Laço — preso entre as orelhas, dois laços + nó central.
    laco(cores) {
      const c1 = cores.principal || '#4C6FE5';
      const c2 = cores.secundaria || '#2F4EA6';
      return `
        <path d="M -15 2 Q -23 -8 -15 -17 Q -6 -13 -1 -2 Q -6 3 -15 2 Z" fill="${c1}" stroke="${c2}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M 15 2 Q 23 -8 15 -17 Q 6 -13 1 -2 Q 6 3 15 2 Z" fill="${c1}" stroke="${c2}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M -4 6 L -8 13 L 0 9 L 8 13 L 4 6 Z" fill="${c1}" stroke="${c2}" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="0" cy="1" r="4.2" fill="${c2}"/>
      `;
    },

    // Óculos redondos — lentes centradas exatamente nos dois olhos.
    oculosRedondo(cores) {
      const armacao = cores.armacao || '#3A2E26';
      const lente = cores.lente || 'rgba(255,255,255,0.16)';
      return `
        <circle cx="-24" cy="0" r="19" fill="${lente}" stroke="${armacao}" stroke-width="3.2"/>
        <circle cx="24" cy="0" r="19" fill="${lente}" stroke="${armacao}" stroke-width="3.2"/>
        <path d="M -5 -1 Q 0 3 5 -1" fill="none" stroke="${armacao}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M -43 -2 Q -52 -1 -53 6" fill="none" stroke="${armacao}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 43 -2 Q 52 -1 53 6" fill="none" stroke="${armacao}" stroke-width="2.6" stroke-linecap="round"/>
        <circle cx="-30" cy="-6" r="2.4" fill="#FFFFFF" opacity="0.75"/>
        <circle cx="18" cy="-6" r="2.4" fill="#FFFFFF" opacity="0.75"/>
      `;
    },

    // Óculos escuros — mesma geometria dos redondos, lentes opacas.
    oculosSol(cores) {
      const armacao = cores.armacao || '#1C2B4A';
      const lente = cores.lente || '#2B3A55';
      return `
        <path d="M -43 -4 Q -24 -12 -5 -3 Q 0 -6 5 -3 Q 24 -12 43 -4 L 43 -1 Q 24 -9 5 0 Q 0 -3 -5 0 Q -24 -9 -43 -1 Z" fill="${armacao}"/>
        <circle cx="-24" cy="1" r="17" fill="${lente}" stroke="${armacao}" stroke-width="3"/>
        <circle cx="24" cy="1" r="17" fill="${lente}" stroke="${armacao}" stroke-width="3"/>
        <path d="M -43 -1 Q -52 0 -53 7" fill="none" stroke="${armacao}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 43 -1 Q 52 0 53 7" fill="none" stroke="${armacao}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M -30 -5 Q -26 -8 -20 -6" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.55" stroke-linecap="round"/>
      `;
    },

    // Chapéu de formatura — capelo apoiado no topo da cabeça + borla.
    chapeuFormatura(cores) {
      const banda = cores.banda || '#1C2B4A';
      const topo = cores.topo || '#243B6B';
      const borla = cores.borla || '#FFC94D';
      return `
        <ellipse cx="0" cy="4" rx="27" ry="9" fill="${banda}"/>
        <polygon points="-38,-8 38,-8 0,-30 -38,-8" fill="${topo}" stroke="${banda}" stroke-width="1.5" stroke-linejoin="round"/>
        <circle cx="0" cy="-8" r="3.6" fill="${banda}"/>
        <path d="M 0 -8 Q 20 -2 22 14" fill="none" stroke="${borla}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="22" cy="16" r="3.4" fill="${borla}"/>
      `;
    },

    // Chapéu de bruxinha — cone com aba, levemente inclinado.
    chapeuBruxa(cores) {
      const principal = cores.principal || '#5B4B8A';
      const faixa = cores.faixa || '#3D2F63';
      const fivela = cores.fivela || '#FFC94D';
      return `
        <ellipse cx="0" cy="9" rx="34" ry="8" fill="${principal}"/>
        <path d="M -20 6 Q -4 -46 8 -50 Q 4 -20 18 6 Z" fill="${principal}" stroke="${faixa}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M -18 -2 Q 0 4 16 -3" fill="none" stroke="${faixa}" stroke-width="4" stroke-linecap="round"/>
        <rect x="-4" y="-4" width="8" height="6" rx="1.2" fill="${fivela}"/>
      `;
    },

    // Gravata borboleta — laço horizontal preso no peito.
    gravataBorboleta(cores) {
      const c1 = cores.principal || '#E0AA5C';
      const c2 = cores.secundaria || '#C98B7A';
      return `
        <path d="M -18 0 Q -22 -9 -14 -12 Q -4 -6 0 0 Q -4 6 -14 12 Q -22 9 -18 0 Z" fill="${c1}" stroke="${c2}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 18 0 Q 22 -9 14 -12 Q 4 -6 0 0 Q 4 6 14 12 Q 22 9 18 0 Z" fill="${c1}" stroke="${c2}" stroke-width="1.3" stroke-linejoin="round"/>
        <circle cx="0" cy="0" r="4.4" fill="${c2}"/>
      `;
    },

    // Colar de pérolas — arco de pequenas esferas seguindo a curva do peito.
    colarPerolas(cores) {
      const perola = cores.perola || '#FFFFFF';
      const contorno = cores.contorno || '#E8DCC8';
      const pts = [-26, -14, -2, 10, 22];
      return `
        <path d="M -28 -4 Q 0 12 28 -4" fill="none" stroke="${contorno}" stroke-width="1.4" opacity="0.6"/>
        ${pts.map((x) => {
          const y = (2 - Math.abs(x) * 0.12).toFixed(1);
          return `<circle cx="${x}" cy="${y}" r="4.2" fill="${perola}" stroke="${contorno}" stroke-width="1"/>`;
        }).join('')}
      `;
    },

    // Coroa real — mesma linguagem visual da coroa de evolução, um pouco maior.
    coroa(cores) {
      const principal = cores.principal || '#FFC94D';
      const contorno = cores.contorno || '#E0AA5C';
      const joia = cores.joia || '#FF8C7A';
      return `
        <path d="M -20 6 L -14 -14 L -5 0 L 0 -20 L 5 0 L 14 -14 L 20 6 Z" fill="${principal}" stroke="${contorno}" stroke-width="1.4" stroke-linejoin="round"/>
        <rect x="-20" y="5" width="40" height="6" rx="1.5" fill="${principal}" stroke="${contorno}" stroke-width="1.2"/>
        <circle cx="0" cy="-16" r="3" fill="${joia}"/>
      `;
    },

    // Asas de anjo — duas asas simétricas, levemente para trás do corpo.
    asas(cores) {
      const pena = cores.pena || '#FFFFFF';
      const sombra = cores.sombra || '#E8DCC8';
      const asa = (sinal) => `
        <path d="M 0 0
                 Q ${sinal * 34} -22 ${sinal * 48} -6
                 Q ${sinal * 56} 6 ${sinal * 44} 14
                 Q ${sinal * 30} 22 ${sinal * 14} 14
                 Q ${sinal * 4} 8 0 0 Z"
              fill="${pena}" stroke="${sombra}" stroke-width="1.3" opacity="0.95"/>
        <path d="M 0 2 Q ${sinal * 20} -4 ${sinal * 38} -2" fill="none" stroke="${sombra}" stroke-width="1" opacity="0.5"/>
        <path d="M 0 8 Q ${sinal * 16} 6 ${sinal * 30} 10" fill="none" stroke="${sombra}" stroke-width="1" opacity="0.5"/>
      `;
      return `${asa(-1)}${asa(1)}`;
    },
  };

  // ------------------------------------------------------------------------
  // ACCESSORY_CONFIG — mapeia cada item do catálogo (pelo `nome`, que é
  // único) para: forma vetorial, âncora anatômica, offset fino, escala e
  // rotação. TODOS os valores aqui são intencionais, medidos a partir da
  // geometria real do SVG da Leia — nunca aleatórios.
  // ------------------------------------------------------------------------
  const ACCESSORY_CONFIG = {
    'Laço Azul Clássico': {
      forma: 'laco', ancora: 'topoCabeca', offsetX: 0, offsetY: -1, escala: 1, rotacao: -4,
      cores: { principal: '#4C6FE5', secundaria: '#2F4EA6' },
    },
    'Laço Dourado': {
      forma: 'laco', ancora: 'topoCabeca', offsetX: 0, offsetY: -1, escala: 1.08, rotacao: 5,
      cores: { principal: '#FFC94D', secundaria: '#E0AA5C' },
    },
    'Óculos de Estudante': {
      forma: 'oculosRedondo', ancora: 'olhos', offsetX: 0, offsetY: 0, escala: 1, rotacao: 0,
      cores: { armacao: '#3A2E26', lente: 'rgba(255,255,255,0.18)' },
    },
    'Óculos de Sol': {
      forma: 'oculosSol', ancora: 'olhos', offsetX: 0, offsetY: 0, escala: 1, rotacao: 0,
      cores: { armacao: '#1C2B4A', lente: '#2B3A55' },
    },
    'Chapéu de Formatura': {
      forma: 'chapeuFormatura', ancora: 'topoCabeca', offsetX: 0, offsetY: 4, escala: 1, rotacao: 0,
      cores: { banda: '#1C2B4A', topo: '#243B6B', borla: '#FFC94D' },
    },
    'Chapéu de Bruxinha': {
      forma: 'chapeuBruxa', ancora: 'topoCabeca', offsetX: -2, offsetY: 4, escala: 0.9, rotacao: -6,
      cores: { principal: '#5B4B8A', faixa: '#3D2F63', fivela: '#FFC94D' },
    },
    'Gravata Borboleta': {
      forma: 'gravataBorboleta', ancora: 'peito', offsetX: 0, offsetY: 0, escala: 1, rotacao: 0,
      cores: { principal: '#E0AA5C', secundaria: '#C98B7A' },
    },
    'Coleira de Pérolas': {
      forma: 'colarPerolas', ancora: 'peito', offsetX: 0, offsetY: 3, escala: 1, rotacao: 0,
      cores: { perola: '#FFFFFF', contorno: '#E8DCC8' },
    },
    'Coroa Real': {
      forma: 'coroa', ancora: 'topoCabeca', offsetX: 0, offsetY: -3, escala: 1.1, rotacao: 0,
      cores: { principal: '#FFC94D', contorno: '#E0AA5C', joia: '#FF8C7A' },
    },
    'Asas de Anjo': {
      forma: 'asas', ancora: 'costas', offsetX: 0, offsetY: 0, escala: 1, rotacao: 0,
      cores: { pena: '#FFFFFF', sombra: '#E8DCC8' },
    },
  };

  /**
   * Fallback por categoria — só é usado se um item novo for cadastrado no
   * catálogo sem uma entrada específica em ACCESSORY_CONFIG. Garante que
   * nada "quebra" visualmente, mesmo sem ajuste fino ainda.
   */
  const CATEGORIA_PADRAO = {
    LACO: { forma: 'laco', ancora: 'topoCabeca', offsetX: 0, offsetY: -1, escala: 1, rotacao: 0, cores: {} },
    OCULOS: { forma: 'oculosRedondo', ancora: 'olhos', offsetX: 0, offsetY: 0, escala: 1, rotacao: 0, cores: {} },
    CHAPEU: { forma: 'chapeuFormatura', ancora: 'topoCabeca', offsetX: 0, offsetY: 4, escala: 1, rotacao: 0, cores: {} },
    GRAVATA: { forma: 'gravataBorboleta', ancora: 'peito', offsetX: 0, offsetY: 0, escala: 1, rotacao: 0, cores: {} },
    ACESSORIO_ESPECIAL: { forma: 'coroa', ancora: 'topoCabeca', offsetX: 0, offsetY: -3, escala: 1, rotacao: 0, cores: {} },
  };

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function resolverConfig(item) {
    return ACCESSORY_CONFIG[item.nome] || CATEGORIA_PADRAO[item.categoria] || null;
  }

  /**
   * AccessoryRenderer — constrói um <g class="leia-acessorio"> por item
   * equipado e injeta dentro da AccessoryLayer (<g id="leiaAcessorios">)
   * do SVG informado. Idempotente: sempre limpa antes de redesenhar.
   *
   * @param {SVGSVGElement} svgEl  o <svg id="leiaSvg"> do fragmento mascote()
   * @param {Array} itensEquipados itens do inventário com equipado=true e tipoItem='COSMETICO'
   */
  function aplicar(svgEl, itensEquipados) {
    if (!svgEl) return;
    const camada = svgEl.querySelector('#leiaAcessorios');
    if (!camada) return;

    while (camada.firstChild) camada.removeChild(camada.firstChild);

    const itensValidos = (itensEquipados || [])
      .map((item) => ({ item, config: resolverConfig(item) }))
      .filter((entrada) => entrada.config !== null)
      .sort((a, b) => ORDEM_ANCORAS.indexOf(a.config.ancora) - ORDEM_ANCORAS.indexOf(b.config.ancora));

    itensValidos.forEach(({ item, config }) => {
      const desenhar = ACCESSORY_SHAPES[config.forma];
      if (!desenhar) return;

      const ancora = LEIA_ANCHORS[config.ancora];
      const x = ancora.x + config.offsetX;
      const y = ancora.y + config.offsetY;

      // Grupo EXTERNO: só cuida de posição (translate/rotate/scale via
      // atributo transform). Nunca é alvo de animação CSS, para não colidir
      // com esse transform de posicionamento.
      const grupoPosicao = document.createElementNS(SVG_NS, 'g');
      grupoPosicao.setAttribute('class', 'leia-acessorio leia-acessorio--' + config.forma);
      grupoPosicao.setAttribute(
        'transform',
        `translate(${x} ${y}) rotate(${config.rotacao}) scale(${config.escala})`
      );
      grupoPosicao.setAttribute('data-item-nome', item.nome || '');

      // Grupo INTERNO: só cuida do desenho + animação de "equipar" (fade/pop
      // via CSS). Como não tem transform de posição, a animação CSS pode
      // mexer no transform dele livremente sem deslocar o acessório do lugar.
      const grupoForma = document.createElementNS(SVG_NS, 'g');
      grupoForma.setAttribute('class', 'leia-acessorio__forma');
      grupoForma.innerHTML = desenhar(config.cores || {});

      grupoPosicao.appendChild(grupoForma);
      camada.appendChild(grupoPosicao);
    });
  }

  window.LeiaAccessories = {
    aplicar,
    ANCORAS: LEIA_ANCHORS,
    CONFIG: ACCESSORY_CONFIG,
  };
})();
