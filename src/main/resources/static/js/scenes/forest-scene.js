/**
 * ==========================================================================
 * LeiaScenes.ForestScene  (codigo_cena: "floresta")
 * --------------------------------------------------------------------------
 * Floresta em camadas de profundidade (árvores de fundo mais escuras e
 * pequenas, árvores de frente maiores), arbustos, flores e vaga-lumes
 * piscando. A copa das árvores balança continuamente, e folhas caem aos
 * poucos o tempo todo.
 *
 * Interações:
 *   - clicar em uma árvore faz um grupo de folhas cair dela na hora.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class ForestScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #DFF5EA 0%, #C8EFD9 75%, #A9D9B6 75%, #A9D9B6 100%)');

      const svg = this._montarPalco();
      this._configurarArvores(svg);
      this._agendarQuedaDeFolhasAmbiente(svg);
      this._agendarVagaLumes(svg);
    }

    _arvore(x, baseY, escala, corCopa, corTronco, id) {
      return `
        <g class="cena-arvore" data-arvore-id="${id}" tabindex="0" role="button" aria-label="Árvore"
           style="transform-origin:${x}px ${baseY}px; --escala:${escala};">
          <rect x="${x - 4 * escala}" y="${baseY - 34 * escala}" width="${8 * escala}" height="${34 * escala}" fill="${corTronco}"/>
          <g class="cena-arvore__copa" style="transform-origin:${x}px ${baseY - 34 * escala}px;">
            <circle cx="${x}" cy="${baseY - 60 * escala}" r="${26 * escala}" fill="${corCopa}"/>
            <circle cx="${x - 20 * escala}" cy="${baseY - 46 * escala}" r="${18 * escala}" fill="${corCopa}"/>
            <circle cx="${x + 20 * escala}" cy="${baseY - 46 * escala}" r="${18 * escala}" fill="${corCopa}"/>
          </g>
        </g>
      `;
    }

    _montarPalco() {
      this.container.innerHTML = `
        <svg class="leia-cena-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Floresta">
          <defs>
            <linearGradient id="florestaCeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#DFF5EA"/>
              <stop offset="100%" stop-color="#C8EFD9"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="400" height="200" fill="url(#florestaCeu)"/>
          <rect x="0" y="196" width="400" height="64" fill="#A9D9B6"/>

          <!-- camada de fundo: árvores menores e mais escuras (mais distantes) -->
          <g class="cena-camada-fundo" opacity="0.65">
            ${this._arvore(40, 190, 0.6, '#7FBF93', '#6B5138', 'f1')}
            ${this._arvore(100, 186, 0.5, '#7FBF93', '#6B5138', 'f2')}
            ${this._arvore(320, 188, 0.55, '#7FBF93', '#6B5138', 'f3')}
            ${this._arvore(365, 184, 0.48, '#7FBF93', '#6B5138', 'f4')}
          </g>

          <!-- arbustos -->
          <g class="cena-arbusto">
            <ellipse cx="70" cy="222" rx="26" ry="14" fill="#5FCBA0"/>
            <ellipse cx="94" cy="226" rx="18" ry="11" fill="#5FCBA0"/>
          </g>
          <g class="cena-arbusto">
            <ellipse cx="300" cy="228" rx="24" ry="13" fill="#5FCBA0"/>
          </g>

          <!-- flores -->
          <g class="cena-flor" style="--atraso:0.2s"><circle cx="130" cy="236" r="3" fill="#FF8C7A"/><circle cx="126" cy="233" r="2" fill="#FFC94D"/></g>
          <g class="cena-flor" style="--atraso:0.9s"><circle cx="230" cy="240" r="3" fill="#8FA3F2"/><circle cx="234" cy="237" r="2" fill="#FFC94D"/></g>
          <g class="cena-flor" style="--atraso:1.4s"><circle cx="270" cy="234" r="3" fill="#FF8C7A"/><circle cx="266" cy="231" r="2" fill="#FFC94D"/></g>

          <!-- camada de frente: árvores grandes e clicáveis -->
          <g class="cena-camada-frente">
            ${this._arvore(56, 232, 1, '#3FA872', '#5B4632', 'p1')}
            ${this._arvore(345, 230, 1.05, '#39A06A', '#5B4632', 'p2')}
          </g>

          <g class="cena-vaga-lumes"></g>
          <g class="cena-folhas-caindo"></g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    _configurarArvores(svg) {
      svg.querySelectorAll('.cena-camada-frente .cena-arvore').forEach((arvore) => {
        const disparar = () => this._derrubarFolhas(svg, arvore);
        this._on(arvore, 'click', disparar);
        this._on(arvore, 'keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') disparar();
        });
      });
    }

    _folhaSvg(x, y, cor) {
      return this._el('path', {
        d: `M${x} ${y} q6 -8 12 0 q-6 8 -12 0 Z`,
        fill: cor,
        class: 'cena-folha-caindo',
      });
    }

    _derrubarFolhas(svg, arvoreEl) {
      const grupo = svg.querySelector('.cena-folhas-caindo');
      const rect = arvoreEl.getBBox();
      const cores = ['#3FA872', '#5FCBA0', '#FFC94D'];
      for (let i = 0; i < 6; i += 1) {
        const x = rect.x + this._aleatorio(0, rect.width);
        const folha = this._folhaSvg(x, rect.y, cores[i % cores.length]);
        folha.style.setProperty('--deriva', `${this._aleatorio(-24, 24).toFixed(0)}px`);
        folha.style.setProperty('--duracao', `${this._aleatorio(1.6, 2.6).toFixed(1)}s`);
        folha.style.setProperty('--atraso', `${this._aleatorio(0, 0.4).toFixed(1)}s`);
        grupo.appendChild(folha);
        this._setTimeout(() => folha.remove(), 3200);
      }
    }

    /** Além das folhas por clique, a floresta solta folhas sozinha de vez em quando. */
    _agendarQuedaDeFolhasAmbiente(svg) {
      const arvores = svg.querySelectorAll('.cena-camada-frente .cena-arvore');
      const agendarProxima = () => {
        this._setTimeout(() => {
          const arvore = arvores[Math.floor(Math.random() * arvores.length)];
          this._derrubarFolhas(svg, arvore);
          agendarProxima();
        }, this._aleatorio(4500, 9000));
      };
      agendarProxima();
    }

    _agendarVagaLumes(svg) {
      const grupo = svg.querySelector('.cena-vaga-lumes');
      const total = 5;
      for (let i = 0; i < total; i += 1) {
        const vagaLume = this._el('circle', {
          cx: this._aleatorio(40, 360).toFixed(0),
          cy: this._aleatorio(140, 210).toFixed(0),
          r: '2',
          fill: '#FFE9AE',
          class: 'cena-vaga-lume',
        });
        vagaLume.style.setProperty('--duracao', `${this._aleatorio(3, 6).toFixed(1)}s`);
        vagaLume.style.setProperty('--atraso', `${this._aleatorio(0, 4).toFixed(1)}s`);
        grupo.appendChild(vagaLume);
      }
    }
  }

  NS.ForestScene = ForestScene;
  NS.gerenciador.registrar('floresta', ForestScene);
})(window);
