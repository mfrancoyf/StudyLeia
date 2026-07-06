/**
 * ==========================================================================
 * LeiaScenes.LibraryScene  (codigo_cena: "biblioteca")
 * --------------------------------------------------------------------------
 * Estantes de livros até o teto, uma mesa de leitura com luminária e poeira
 * dourada flutuando lentamente na luz — um cantinho silencioso de estudo.
 *
 * Interações:
 *   - clicar na luminária liga/desliga a luz (reaproveita a mesma classe
 *     `.cena-luminaria__brilho` do quarto — mesma logica, cenário diferente);
 *   - clicar numa estante faz algumas páginas soltas caírem dela.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class LibraryScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #F3E9D6 0%, #E8DCC8 75%, #C9A876 75%, #B7935C 100%)');

      const svg = this._montarPalco();
      this._configurarLuminaria();
      this._configurarEstantes(svg);
      this._gerarPoeira(svg);
    }

    _estante(x, largura, cores) {
      const alturaTotal = 150;
      let livros = '';
      const linhas = 3;
      for (let linha = 0; linha < linhas; linha += 1) {
        let cursor = x + 4;
        const y = 46 + linha * 34;
        while (cursor < x + largura - 6) {
          const largLivro = this._aleatorio(6, 11);
          const cor = cores[Math.floor(Math.random() * cores.length)];
          const alturaLivro = this._aleatorio(24, 30);
          livros += `<rect x="${cursor.toFixed(1)}" y="${(y + (30 - alturaLivro)).toFixed(1)}" width="${largLivro.toFixed(1)}" height="${alturaLivro.toFixed(1)}" fill="${cor}"/>`;
          cursor += largLivro + 1.4;
        }
      }
      return `
        <g class="cena-estante" tabindex="0" role="button" aria-label="Estante de livros">
          <rect x="${x}" y="40" width="${largura}" height="${alturaTotal}" fill="#8A5A34"/>
          <rect x="${x + 3}" y="43" width="${largura - 6}" height="${alturaTotal - 6}" fill="#6B4226"/>
          ${livros}
          <rect x="${x}" y="74" width="${largura}" height="4" fill="#8A5A34"/>
          <rect x="${x}" y="108" width="${largura}" height="4" fill="#8A5A34"/>
        </g>
      `;
    }

    _montarPalco() {
      const coresEsq = ['#B95D4C', '#4C6FE5', '#3FA872', '#D9A441', '#7A5AC2'];
      const coresDir = ['#5FCBA0', '#F0A93B', '#6685EE', '#C25A7A', '#8A5A34'];

      this.container.innerHTML = `
        <svg class="leia-cena-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Biblioteca">
          <defs>
            <linearGradient id="bibliotecaParede" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F3E9D6"/>
              <stop offset="100%" stop-color="#E8DCC8"/>
            </linearGradient>
            <radialGradient id="bibliotecaLuzLuminaria" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FFE9AE" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#FFE9AE" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="400" height="196" fill="url(#bibliotecaParede)"/>
          <rect x="0" y="196" width="400" height="64" fill="#C9A876"/>
          <rect x="0" y="196" width="400" height="4" fill="#B7935C"/>

          ${this._estante(14, 118, coresEsq)}
          ${this._estante(268, 118, coresDir)}

          <!-- janela arqueada ao fundo, entre as estantes -->
          <path d="M170 190 V110 Q170 76 200 76 Q230 76 230 110 V190 Z" fill="#DCE9F5" stroke="#B7935C" stroke-width="6"/>
          <path d="M170 190 V110 Q170 76 200 76 Q230 76 230 110 V190 Z" fill="none" stroke="#B7935C" stroke-width="2" opacity="0.5"/>
          <line x1="200" y1="80" x2="200" y2="190" stroke="#B7935C" stroke-width="3"/>

          <!-- mesa de leitura + luminária -->
          <rect x="152" y="176" width="96" height="8" fill="#8A5A34"/>
          <rect x="158" y="184" width="7" height="34" fill="#6B4226"/>
          <rect x="235" y="184" width="7" height="34" fill="#6B4226"/>
          <g class="cena-luminaria" tabindex="0" role="button" aria-label="Ligar ou desligar a luminária">
            <circle cx="196" cy="176" r="26" fill="url(#bibliotecaLuzLuminaria)" class="cena-luminaria__brilho"/>
            <rect x="193" y="164" width="6" height="14" fill="#5C6B8A"/>
            <path d="M182 154 L214 154 L206 166 L190 166 Z" fill="#FFC94D" class="cena-luminaria__cupula"/>
          </g>
          <rect x="212" y="172" width="20" height="4" fill="#FFF" opacity="0.9"/>
          <rect x="212" y="172" width="20" height="10" fill="none" stroke="#B7935C" stroke-width="1.5"/>

          <g class="cena-poeira-luminaria"></g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    _configurarLuminaria() {
      const luminaria = this.container.querySelector('.cena-luminaria');
      this._on(luminaria, 'click', () => {
        this.container.querySelector('.leia-cena-svg').classList.toggle('cena--luz-apagada');
      });
      this._on(luminaria, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') luminaria.dispatchEvent(new Event('click'));
      });
    }

    _configurarEstantes(svg) {
      svg.querySelectorAll('.cena-estante').forEach((estante) => {
        const disparar = () => this._soltarPaginas(svg, estante);
        this._on(estante, 'click', disparar);
        this._on(estante, 'keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') disparar();
        });
      });
    }

    /** Reaproveita o mesmo padrão de "folha caindo" da floresta, mas como página de livro. */
    _soltarPaginas(svg, estanteEl) {
      const rect = estanteEl.getBBox();
      for (let i = 0; i < 5; i += 1) {
        const x = rect.x + this._aleatorio(6, rect.width - 6);
        const pagina = this._el('rect', {
          x: x.toFixed(1),
          y: rect.y.toFixed(1),
          width: '6',
          height: '8',
          fill: '#FBF3E4',
          class: 'cena-pagina-caindo',
        });
        pagina.style.setProperty('--deriva', `${this._aleatorio(-18, 18).toFixed(0)}px`);
        pagina.style.setProperty('--duracao', `${this._aleatorio(1.6, 2.4).toFixed(1)}s`);
        pagina.style.setProperty('--atraso', `${this._aleatorio(0, 0.3).toFixed(1)}s`);
        svg.appendChild(pagina);
        this._setTimeout(() => pagina.remove(), 3000);
      }
    }

    _gerarPoeira(svg) {
      const grupo = svg.querySelector('.cena-poeira-luminaria');
      for (let i = 0; i < 10; i += 1) {
        const poeira = this._el('circle', {
          cx: this._aleatorio(172, 220).toFixed(1),
          cy: this._aleatorio(140, 176).toFixed(1),
          r: '1',
          fill: '#FFE9AE',
          class: 'cena-poeira',
        });
        poeira.style.setProperty('--duracao', `${this._aleatorio(3, 6).toFixed(1)}s`);
        poeira.style.setProperty('--atraso', `${this._aleatorio(0, 4).toFixed(1)}s`);
        grupo.appendChild(poeira);
      }
    }
  }

  NS.LibraryScene = LibraryScene;
  NS.gerenciador.registrar('biblioteca', LibraryScene);
})(window);
