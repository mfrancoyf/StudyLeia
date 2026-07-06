/**
 * ==========================================================================
 * LeiaScenes.StarryNightScene  (codigo_cena: "noite-estrelada")
 * --------------------------------------------------------------------------
 * Reformulação artística: em vez de um céu composto por círculos e elipses
 * soltas, a cena agora é construída como uma pequena ilustração em camadas,
 * no espírito de jogos indie — silhuetas orgânicas desenhadas com <path>,
 * profundidade por sobreposição de planos, e uma lua com crateras e luz de
 * borda em vez de três círculos concêntricos.
 *
 * Camadas (do fundo para a frente):
 *   1) céu em gradiente + véu de aurora sutil;
 *   2) campo de estrelas-pontinho (textura);
 *   3) lua (com crateras orgânicas e halo) + estrelas cadentes;
 *   4) estrelas-heroínas (5 e 4 pontas, clicáveis);
 *   5) nuvens orgânicas (path), à deriva, em duas profundidades (parallax);
 *   6) névoa rasteira no horizonte;
 *   7) morros/colinas em duas camadas de profundidade;
 *   8) linha de pinheiros (silhueta) na crista mais próxima;
 *   9) vaga-lumes baixos, para dar vida ao primeiro plano.
 *
 * Interações:
 *   - clicar na lua dispara uma estrela cadente na hora;
 *   - clicar numa estrela-heroína faz ela brilhar mais forte por alguns
 *     segundos;
 *   - estrelas cadentes também aparecem sozinhas, de tempos em tempos.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  const TOTAL_ESTRELAS_PONTO = 50;
  const TOTAL_ESTRELAS_BRILHANTES = 7;
  const TOTAL_VAGA_LUMES = 6;

  class StarryNightScene extends NS.BaseScene {
    init() {
      // Mesmo gradiente do céu do SVG, pintado no container: garante que as
      // faixas laterais (quando o cartão é mais largo que o viewBox) fiquem
      // idênticas ao céu, sem "barra de letterbox" visível.
      this._definirFundo('linear-gradient(180deg, #10182F 0%, #1B2748 55%, #2A3B63 100%)');

      const svg = this._montarPalco();
      this._gerarEstrelasPonto(svg);
      this._gerarEstrelasBrilhantes(svg);
      this._gerarVagaLumes(svg);
      this._configurarLua(svg);
      this._agendarEstrelasCadentesAutomaticas(svg);
    }

    _montarPalco() {
      this.container.innerHTML = `
        <svg class="leia-cena-svg cena-noite" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Céu estrelado">
          <defs>
            <linearGradient id="noiteCeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10182F"/>
              <stop offset="55%" stop-color="#1B2748"/>
              <stop offset="100%" stop-color="#2A3B63"/>
            </linearGradient>

            <!-- Véu de aurora bem sutil, só para o céu não ficar "chapado" -->
            <linearGradient id="noiteAurora" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%"  stop-color="#6C7BD9" stop-opacity="0"/>
              <stop offset="45%" stop-color="#7C8FE0" stop-opacity="0.16"/>
              <stop offset="70%" stop-color="#9AC7E8" stop-opacity="0.10"/>
              <stop offset="100%" stop-color="#9AC7E8" stop-opacity="0"/>
            </linearGradient>

            <radialGradient id="noiteLuaBrilho" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#F7F9FF" stop-opacity="0.5"/>
              <stop offset="60%" stop-color="#F7F9FF" stop-opacity="0.12"/>
              <stop offset="100%" stop-color="#F7F9FF" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="noiteLuaCorpo" cx="38%" cy="34%" r="75%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="60%" stop-color="#F2F1E8"/>
              <stop offset="100%" stop-color="#D9D6C9"/>
            </radialGradient>
            <radialGradient id="noiteEstrelaBrilho" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFE9AE" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#FFE9AE" stop-opacity="0"/>
            </radialGradient>

            <linearGradient id="noiteCadenteTraco" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stop-color="#FFF9F0" stop-opacity="0"/>
              <stop offset="70%"  stop-color="#FFF9F0" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1"/>
            </linearGradient>

            <linearGradient id="noiteMorroFundo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#212F52"/>
              <stop offset="100%" stop-color="#1A2542"/>
            </linearGradient>
            <linearGradient id="noiteMorroPerto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#161F3A"/>
              <stop offset="100%" stop-color="#0F1730"/>
            </linearGradient>
            <linearGradient id="noiteNevoa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4F63A0" stop-opacity="0"/>
              <stop offset="100%" stop-color="#4F63A0" stop-opacity="0.28"/>
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="400" height="260" fill="url(#noiteCeu)"/>
          <path d="M-20 40 Q140 -10 220 70 T440 90 L440 -20 L-20 -20 Z" fill="url(#noiteAurora)"/>

          <g class="cena-estrelas-ponto"></g>

          <!-- Lua: corpo com gradiente + crateras orgânicas (paths irregulares,
               não círculos perfeitos) + um filete de sombra pra dar volume. -->
          <g class="cena-lua" tabindex="0" role="button" aria-label="Gerar uma estrela cadente">
            <circle cx="320" cy="52" r="34" fill="url(#noiteLuaBrilho)"/>
            <circle cx="320" cy="52" r="21" fill="url(#noiteLuaCorpo)"/>
            <path d="M320 31 a21 21 0 0 1 0 42 a16 17 0 0 0 0-42 Z" fill="#C9CBBE" opacity="0.35"/>
            <path d="M312 42 q4 -3 8 0 q3 3 -1 6 q-5 3 -8 -1 q-2 -3 1 -5 Z" fill="#CFCDBF" opacity="0.55"/>
            <path d="M327 58 q5 -2 7 2 q2 4 -3 6 q-5 2 -7 -2 q-1 -4 3 -6 Z" fill="#CFCDBF" opacity="0.5"/>
            <path d="M317 62 q3 -2 5 0 q2 2 -1 4 q-3 2 -5 0 q-1 -2 1 -4 Z" fill="#CFCDBF" opacity="0.45"/>
          </g>

          <g class="cena-estrelas-brilhantes"></g>

          <g class="cena-nuvem-camada cena-nuvem-camada--longe" style="--duracao:64s; --atraso:0s; --y:34px;">
            <path d="M0 8 Q6 -6 20 -4 Q26 -14 42 -9 Q56 -13 64 -3 Q78 -4 80 8 Q84 16 74 18 L6 18 Q-4 16 0 8 Z" fill="#33447A" opacity="0.4"/>
          </g>
          <g class="cena-nuvem-camada cena-nuvem-camada--longe" style="--duracao:78s; --atraso:20s; --y:62px;">
            <path d="M0 6 Q5 -5 16 -3 Q21 -11 34 -7 Q45 -10 51 -2 Q62 -3 63 6 Q66 13 58 14 L5 14 Q-3 13 0 6 Z" fill="#33447A" opacity="0.32"/>
          </g>
          <g class="cena-nuvem-camada cena-nuvem-camada--perto" style="--duracao:46s; --atraso:6s; --y:20px;">
            <path d="M0 12 Q8 -8 28 -5 Q36 -18 58 -12 Q76 -17 86 -4 Q104 -6 106 12 Q112 22 98 24 L8 24 Q-6 22 0 12 Z" fill="#3C4F86" opacity="0.55"/>
          </g>

          <!-- Névoa rasteira, translúcida, para separar o céu dos morros -->
          <rect class="cena-nevoa" x="0" y="150" width="400" height="34" fill="url(#noiteNevoa)"/>

          <!-- Morro distante (mais claro, mais achatado — plano do meio) -->
          <path class="cena-morro cena-morro--fundo" d="M0 196
                   Q40 160 86 188
                   Q130 154 176 184
                   Q222 152 268 182
                   Q312 152 356 182
                   Q380 168 400 184
                   L400 260 L0 260 Z" fill="url(#noiteMorroFundo)"/>

          <!-- Morro próximo (mais escuro, silhueta principal) com contorno
               levemente mais claro para separar dos planos de trás sem
               precisar de blur. -->
          <path class="cena-morro cena-morro--perto" d="M0 224
                   Q30 186 58 212
                   Q80 178 112 206
                   Q140 174 178 204
                   Q210 172 246 202
                   Q276 176 312 206
                   Q344 180 400 214
                   L400 260 L0 260 Z" fill="url(#noiteMorroPerto)"/>
          <path d="M0 224
                   Q30 186 58 212
                   Q80 178 112 206
                   Q140 174 178 204
                   Q210 172 246 202
                   Q276 176 312 206
                   Q344 180 400 214"
                fill="none" stroke="#3A4E80" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>

          <!-- Pinheiros na crista do morro próximo: silhueta simples de
               triângulos orgânicos (base recortada, não retas perfeitas),
               dão identidade de "floresta ao luar" sem virar cena de floresta. -->
          <g class="cena-pinheiros" fill="#0D1428" opacity="0.92">
            <path d="M46 214 L52 190 L58 214 Q52 210 46 214 Z"/>
            <path d="M46 222 L52 198 L58 222 Q52 217 46 222 Z"/>
            <path d="M96 218 L101 198 L106 218 Q101 214 96 218 Z"/>
            <path d="M96 226 L101 206 L106 226 Q101 222 96 226 Z"/>
            <path d="M330 216 L336 194 L342 216 Q336 212 330 216 Z"/>
            <path d="M330 224 L336 202 L342 224 Q336 220 330 224 Z"/>
            <path d="M366 220 L370 204 L374 220 Q370 217 366 220 Z"/>
          </g>

          <g class="cena-vaga-lumes"></g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    /** Constrói o "d" de uma estrela de N pontas centrada em (cx, cy). */
    _pathEstrela(cx, cy, raioExterno, raioInterno, pontas = 5) {
      const passos = pontas * 2;
      let d = '';
      for (let i = 0; i < passos; i += 1) {
        const raio = i % 2 === 0 ? raioExterno : raioInterno;
        const angulo = (Math.PI / pontas) * i - Math.PI / 2;
        const x = cx + raio * Math.cos(angulo);
        const y = cy + raio * Math.sin(angulo);
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      return `${d}Z`;
    }

    /** Campo de estrelas pequenas (pontinhos), só para dar textura ao céu. */
    _gerarEstrelasPonto(svg) {
      const grupo = svg.querySelector('.cena-estrelas-ponto');
      for (let i = 0; i < TOTAL_ESTRELAS_PONTO; i += 1) {
        const x = this._aleatorio(6, 394);
        const y = this._aleatorio(6, 145);
        const r = this._aleatorio(0.6, 1.7);
        const estrela = this._el('circle', {
          cx: x.toFixed(1),
          cy: y.toFixed(1),
          r: r.toFixed(1),
          class: 'cena-estrela-ponto',
        });
        estrela.style.setProperty('--duracao', `${this._aleatorio(2.4, 5).toFixed(1)}s`);
        estrela.style.setProperty('--atraso', `${this._aleatorio(0, 4).toFixed(1)}s`);
        grupo.appendChild(estrela);
      }
    }

    /**
     * Estrelas-heroínas: mistura de 5 e 4 pontas, douradas, com um halo de
     * brilho atrás (o halo e a estrela ficam no mesmo grupo, então giram/
     * pulsam juntos com uma única animação — sem duplicar keyframes).
     */
    _gerarEstrelasBrilhantes(svg) {
      const grupo = svg.querySelector('.cena-estrelas-brilhantes');
      for (let i = 0; i < TOTAL_ESTRELAS_BRILHANTES; i += 1) {
        const x = this._aleatorio(16, 384);
        const y = this._aleatorio(12, 128);
        const raio = this._aleatorio(4, 7.5);
        const pontas = i % 3 === 0 ? 4 : 5;

        const g = this._el('g', {
          class: 'cena-estrela-brilhante',
          tabindex: '0',
          role: 'button',
          'aria-label': 'Estrela',
        });
        g.style.setProperty('--duracao', `${this._aleatorio(2.8, 4.6).toFixed(1)}s`);
        g.style.setProperty('--atraso', `${this._aleatorio(0, 4).toFixed(1)}s`);

        const halo = this._el('circle', {
          cx: x.toFixed(1),
          cy: y.toFixed(1),
          r: (raio * 2.8).toFixed(1),
          fill: 'url(#noiteEstrelaBrilho)',
        });
        const estrela = this._el('path', {
          d: this._pathEstrela(x, y, raio, raio * (pontas === 4 ? 0.32 : 0.42), pontas),
          fill: '#FFD873',
        });

        g.appendChild(halo);
        g.appendChild(estrela);
        grupo.appendChild(g);

        this._on(g, 'click', () => this._brilharForte(g));
        this._on(g, 'keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') this._brilharForte(g);
        });
      }
    }

    /** Vaga-lumes baixos, perto da linha dos pinheiros, para dar vida ao chão. */
    _gerarVagaLumes(svg) {
      const grupo = svg.querySelector('.cena-vaga-lumes');
      for (let i = 0; i < TOTAL_VAGA_LUMES; i += 1) {
        const x = this._aleatorio(20, 380);
        const y = this._aleatorio(196, 234);
        const vagaLume = this._el('circle', {
          cx: x.toFixed(1),
          cy: y.toFixed(1),
          r: this._aleatorio(1.1, 1.9).toFixed(1),
          class: 'cena-vaga-lume',
          fill: '#FFE9A8',
        });
        vagaLume.style.setProperty('--duracao', `${this._aleatorio(3.2, 5.5).toFixed(1)}s`);
        vagaLume.style.setProperty('--atraso', `${this._aleatorio(0, 4).toFixed(1)}s`);
        grupo.appendChild(vagaLume);
      }
    }

    _brilharForte(estrela) {
      estrela.classList.add('cena-estrela-brilhante--brilhando');
      this._setTimeout(() => estrela.classList.remove('cena-estrela-brilhante--brilhando'), 1600);
    }

    _configurarLua(svg) {
      const lua = svg.querySelector('.cena-lua');
      const disparar = () => this._criarEstrelaCadente(svg);
      this._on(lua, 'click', disparar);
      this._on(lua, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') disparar();
      });
    }

    _agendarEstrelasCadentesAutomaticas(svg) {
      const agendarProxima = () => {
        this._setTimeout(() => {
          this._criarEstrelaCadente(svg);
          agendarProxima();
        }, this._aleatorio(6000, 13000));
      };
      agendarProxima();
    }

    _criarEstrelaCadente(svg) {
      const y = this._aleatorio(18, 105);
      const comprimento = this._aleatorio(50, 80);
      const cadente = this._el('line', {
        x1: (360).toFixed(0),
        y1: y.toFixed(0),
        x2: (360 - comprimento).toFixed(0),
        y2: (y + comprimento * 0.42).toFixed(0),
        class: 'cena-estrela-cadente',
      });
      svg.appendChild(cadente);
      this._setTimeout(() => cadente.remove(), 900);
    }
  }

  NS.StarryNightScene = StarryNightScene;
  NS.gerenciador.registrar('noite-estrelada', StarryNightScene);
})(window);
