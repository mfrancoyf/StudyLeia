/**
 * ==========================================================================
 * LeiaScenes.CityScene  (codigo_cena: "cidade")
 * --------------------------------------------------------------------------
 * Skyline noturno com prédios, janelas piscando aleatoriamente, uma placa
 * de neon, carros passando na rua e pessoas caminhando ao longe.
 *
 * Interações:
 *   - clicar em uma janela liga/desliga a luz dela;
 *   - clicar na placa dispara um efeito extra de flicker no neon.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class CityScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #1B1F3B 0%, #33395C 75%, #20263F 75%, #20263F 100%)');

      const svg = this._montarPalco();
      this._gerarJanelas(svg);
      this._configurarPlaca(svg);
      this._agendarCarros(svg);
    }

    _predio(x, largura, altura, cor) {
      return `<rect class="cena-predio" x="${x}" y="${196 - altura}" width="${largura}" height="${altura}" fill="${cor}"/>`;
    }

    _montarPalco() {
      this.container.innerHTML = `
        <svg class="leia-cena-svg cena-noite" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Cidade à noite">
          <defs>
            <linearGradient id="cidadeCeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1B1F3B"/>
              <stop offset="100%" stop-color="#33395C"/>
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="400" height="196" fill="url(#cidadeCeu)"/>

          <g class="cena-predios-fundo" opacity="0.55">
            ${this._predio(10, 34, 90, '#242A47')}
            ${this._predio(48, 26, 70, '#242A47')}
            ${this._predio(330, 30, 100, '#242A47')}
            ${this._predio(365, 28, 76, '#242A47')}
          </g>

          <g class="cena-predios-frente">
            ${this._predio(80, 46, 130, '#2E355A')}
            ${this._predio(132, 38, 110, '#343C63')}
            ${this._predio(176, 52, 150, '#2E355A')}
            ${this._predio(234, 40, 118, '#343C63')}
            ${this._predio(280, 44, 140, '#2E355A')}
          </g>

          <g class="cena-janelas"></g>

          <g class="cena-placa-neon" tabindex="0" role="button" aria-label="Placa de neon">
            <rect x="284" y="72" width="40" height="18" rx="3" fill="#12162A" stroke="#FF6FD8" stroke-width="1.5"/>
            <text x="304" y="85" text-anchor="middle" font-size="10" font-family="monospace" fill="#FF6FD8" class="cena-placa-neon__texto">LEIA</text>
          </g>

          <rect x="0" y="196" width="400" height="64" fill="#20263F"/>
          <rect x="0" y="222" width="400" height="4" fill="#FFC94D" opacity="0.6" stroke-dasharray="10 8" class="cena-rua-faixa"/>

          <g class="cena-pessoas" opacity="0.75">
            <g transform="translate(120 214)"><rect width="4" height="12" fill="#5C6B8A"/><circle cx="2" cy="-3" r="3" fill="#5C6B8A"/></g>
            <g transform="translate(260 216)"><rect width="4" height="10" fill="#5C6B8A"/><circle cx="2" cy="-3" r="2.6" fill="#5C6B8A"/></g>
          </g>

          <g class="cena-carros"></g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    _gerarJanelas(svg) {
      const grupo = svg.querySelector('.cena-janelas');
      const predios = svg.querySelectorAll('.cena-predios-frente rect');

      predios.forEach((predio) => {
        const x = parseFloat(predio.getAttribute('x'));
        const y = parseFloat(predio.getAttribute('y'));
        const largura = parseFloat(predio.getAttribute('width'));
        const altura = parseFloat(predio.getAttribute('height'));

        const colunas = Math.max(2, Math.floor(largura / 12));
        const linhas = Math.max(3, Math.floor(altura / 16));

        for (let linha = 0; linha < linhas; linha += 1) {
          for (let coluna = 0; coluna < colunas; coluna += 1) {
            const jx = x + 4 + coluna * (largura - 8) / colunas;
            const jy = y + 8 + linha * (altura - 16) / linhas;
            const acesa = Math.random() > 0.45;

            const janela = this._el('rect', {
              x: jx.toFixed(1),
              y: jy.toFixed(1),
              width: (largura / colunas - 5).toFixed(1),
              height: (altura / linhas - 7).toFixed(1),
              rx: '1',
              class: 'cena-janela-predio' + (acesa ? ' cena-janela-predio--acesa' : ''),
              tabindex: '0',
              role: 'button',
              'aria-label': 'Janela',
            });
            janela.style.setProperty('--atraso', `${this._aleatorio(0, 6).toFixed(1)}s`);
            grupo.appendChild(janela);

            this._on(janela, 'click', () => janela.classList.toggle('cena-janela-predio--acesa'));
          }
        }
      });
    }

    _configurarPlaca(svg) {
      const placa = svg.querySelector('.cena-placa-neon');
      const disparar = () => {
        placa.classList.add('cena-placa-neon--flicker');
        this._setTimeout(() => placa.classList.remove('cena-placa-neon--flicker'), 1400);
      };
      this._on(placa, 'click', disparar);
      this._on(placa, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') disparar();
      });
    }

    _agendarCarros(svg) {
      const grupo = svg.querySelector('.cena-carros');
      const cores = ['#FF8C7A', '#8FA3F2', '#FFC94D', '#5FCBA0'];

      const criarCarro = () => {
        const carro = this._el('g', { class: 'cena-carro' });
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const corpo = this._el('rect', { x: '0', y: '0', width: '22', height: '8', rx: '2', fill: cor });
        const farol = this._el('circle', { cx: '21', cy: '4', r: '1.6', fill: '#FFF3C4' });
        carro.appendChild(corpo);
        carro.appendChild(farol);
        carro.style.setProperty('--duracao', `${this._aleatorio(4, 7).toFixed(1)}s`);
        carro.style.setProperty('--y', `${this._aleatorio(206, 214).toFixed(0)}px`);
        grupo.appendChild(carro);
        this._setTimeout(() => carro.remove(), 8000);
      };

      const agendarProximo = () => {
        this._setTimeout(() => {
          criarCarro();
          agendarProximo();
        }, this._aleatorio(1800, 4200));
      };

      criarCarro();
      agendarProximo();
    }
  }

  NS.CityScene = CityScene;
  NS.gerenciador.registrar('cidade', CityScene);
})(window);
