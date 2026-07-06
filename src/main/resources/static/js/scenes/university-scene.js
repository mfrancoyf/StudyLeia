/**
 * ==========================================================================
 * LeiaScenes.UniversityScene  (codigo_cena: "universidade")
 * --------------------------------------------------------------------------
 * Fachada de campus com colunas, relógio de torre, bandeira tremulando,
 * pássaros e nuvens passando, e estudantes caminhando ao longe.
 *
 * Boa parte dos elementos reaproveita classes/keyframes já existentes em
 * outras cenas (nuvem, pássaro/gaivota, ponteiros do relógio) — só a
 * bandeira e a "badalada" do sino são novas.
 *
 * Interações:
 *   - clicar no relógio da torre faz o sino "badalar";
 *   - clicar na bandeira faz ela tremular mais forte por alguns segundos.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class UniversityScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #FBE8E4 0%, #F5D2C8 75%, #D9B98A 75%, #C8A672 100%)');

      const svg = this._montarPalco();
      this._configurarRelogio(svg);
      this._configurarBandeira(svg);
    }

    _coluna(x) {
      return `
        <rect x="${x}" y="98" width="12" height="94" fill="#F3E9DD"/>
        <rect x="${x - 2}" y="94" width="16" height="6" fill="#E4D3BE"/>
        <rect x="${x - 2}" y="192" width="16" height="6" fill="#E4D3BE"/>
      `;
    }

    _montarPalco() {
      this.container.innerHTML = `
        <svg class="leia-cena-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Campus da universidade">
          <defs>
            <linearGradient id="uniCeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FBE8E4"/>
              <stop offset="100%" stop-color="#F5D2C8"/>
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="400" height="196" fill="url(#uniCeu)"/>
          <rect x="0" y="196" width="400" height="64" fill="#D9B98A"/>
          <rect x="0" y="196" width="400" height="4" fill="#C8A672"/>

          <g class="cena-nuvem" style="--duracao:50s; --atraso:0s; --y:20px;">
            <ellipse cx="60" cy="0" rx="30" ry="11" fill="#FFFFFF" opacity="0.8"/>
            <ellipse cx="88" cy="3" rx="20" ry="9" fill="#FFFFFF" opacity="0.8"/>
          </g>

          <g class="cena-gaivota" style="--altura:34px; --duracao:11s; --atraso:1s;">
            <path d="M0 0 Q-7 -5 -14 0 Q-7 1.6 0 0 Q7 -5 14 0 Q7 1.6 0 0" fill="#5C6B8A" class="cena-gaivota__asas"/>
          </g>
          <g class="cena-gaivota" style="--altura:52px; --duracao:14s; --atraso:5s;">
            <path d="M0 0 Q-6 -4 -12 0 Q-6 1.4 0 0 Q6 -4 12 0 Q6 1.4 0 0" fill="#5C6B8A" class="cena-gaivota__asas"/>
          </g>

          <!-- prédio principal: fachada neoclássica com colunas e frontão -->
          <rect x="70" y="98" width="260" height="94" fill="#F7EEE2"/>
          <path d="M60 98 L200 46 L340 98 Z" fill="#EADACB"/>
          ${this._coluna(96)}
          ${this._coluna(132)}
          ${this._coluna(168)}
          ${this._coluna(204)}
          ${this._coluna(240)}
          ${this._coluna(276)}
          <rect x="182" y="150" width="36" height="42" fill="#5C6B8A"/>

          <!-- torre do relógio -->
          <rect x="184" y="30" width="32" height="70" fill="#EADACB"/>
          <path d="M180 30 L200 8 L220 30 Z" fill="#D9B98A"/>
          <g class="cena-relogio" tabindex="0" role="button" aria-label="Relógio da torre">
            <circle cx="200" cy="56" r="16" fill="#FFFBF2" stroke="#B7935C" stroke-width="3"/>
            <line x1="200" y1="56" x2="200" y2="46" stroke="#1C2B4A" stroke-width="2" stroke-linecap="round" class="cena-relogio__ponteiro-hora"/>
            <line x1="200" y1="56" x2="208" y2="56" stroke="#4C6FE5" stroke-width="1.6" stroke-linecap="round" class="cena-relogio__ponteiro-minuto"/>
            <circle cx="200" cy="56" r="1.4" fill="#1C2B4A"/>
          </g>

          <!-- bandeira no mastro -->
          <g tabindex="0" role="button" aria-label="Bandeira" class="cena-bandeira-clicavel">
            <rect x="352" y="30" width="3" height="100" fill="#8A5A34"/>
            <path d="M355 32 L388 40 L355 48 Z" fill="#6685EE" class="cena-bandeira"/>
          </g>

          <!-- estudantes caminhando ao longe -->
          <g class="cena-pessoas" opacity="0.8">
            <g transform="translate(50 210)"><rect width="4" height="12" fill="#8A5A34"/><circle cx="2" cy="-3" r="3" fill="#8A5A34"/></g>
            <g transform="translate(150 214)"><rect width="4" height="10" fill="#B95D4C"/><circle cx="2" cy="-3" r="2.6" fill="#B95D4C"/></g>
            <g transform="translate(300 212)"><rect width="4" height="11" fill="#5C6B8A"/><circle cx="2" cy="-3" r="2.8" fill="#5C6B8A"/></g>
          </g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    _configurarRelogio(svg) {
      const relogio = svg.querySelector('.cena-relogio');
      const badalar = () => {
        relogio.classList.add('cena-sino-badalada');
        this._setTimeout(() => relogio.classList.remove('cena-sino-badalada'), 1200);
      };
      this._on(relogio, 'click', badalar);
      this._on(relogio, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') badalar();
      });
    }

    _configurarBandeira(svg) {
      const gatilho = svg.querySelector('.cena-bandeira-clicavel');
      const bandeira = svg.querySelector('.cena-bandeira');
      const tremular = () => {
        bandeira.classList.add('cena-bandeira--tremulando');
        this._setTimeout(() => bandeira.classList.remove('cena-bandeira--tremulando'), 2500);
      };
      this._on(gatilho, 'click', tremular);
      this._on(gatilho, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') tremular();
      });
    }
  }

  NS.UniversityScene = UniversityScene;
  NS.gerenciador.registrar('universidade', UniversityScene);
})(window);
