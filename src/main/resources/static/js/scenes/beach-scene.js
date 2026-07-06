/**
 * ==========================================================================
 * LeiaScenes.BeachScene  (codigo_cena: "praia")
 * --------------------------------------------------------------------------
 * Praia com mar animado (ondas contínuas), sol refletindo na água,
 * palmeiras balançando, nuvens lentas e gaivotas voando.
 *
 * Interações:
 *   - clicar na água gera pequenas ondas extras na hora do clique;
 *   - clicar em uma gaivota faz ela "assustar" e bater asas mais rápido.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class BeachScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #BFE7F5 0%, #E9F7FA 58%, #2E8FBF 58%, #4FB3D9 75%, #F4E1B4 75%, #F4E1B4 100%)');

      const svg = this._montarPalco();
      this._configurarAgua(svg);
      this._configurarGaivotas(svg);
    }

    _montarPalco() {
      this.container.innerHTML = `
        <svg class="leia-cena-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Praia">
          <defs>
            <linearGradient id="praiaCeu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#BFE7F5"/>
              <stop offset="100%" stop-color="#E9F7FA"/>
            </linearGradient>
            <linearGradient id="praiaMar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4FB3D9"/>
              <stop offset="100%" stop-color="#2E8FBF"/>
            </linearGradient>
            <radialGradient id="praiaSolBrilho" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stop-color="#FFF3C4" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#FFF3C4" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="400" height="150" fill="url(#praiaCeu)"/>

          <circle cx="330" cy="46" r="34" fill="url(#praiaSolBrilho)"/>
          <circle cx="330" cy="46" r="18" fill="#FFDD73"/>

          <g class="cena-nuvem" style="--duracao:44s; --atraso:0s; --y:26px;">
            <ellipse cx="60" cy="0" rx="30" ry="11" fill="#FFFFFF" opacity="0.85"/>
            <ellipse cx="88" cy="3" rx="20" ry="9" fill="#FFFFFF" opacity="0.85"/>
          </g>
          <g class="cena-nuvem" style="--duracao:60s; --atraso:10s; --y:60px;">
            <ellipse cx="60" cy="0" rx="22" ry="8" fill="#FFFFFF" opacity="0.7"/>
          </g>

          <g class="cena-gaivota" style="--altura:38px; --duracao:9s; --atraso:0s;" tabindex="0" role="button" aria-label="Gaivota">
            <path d="M0 0 Q-8 -6 -16 0 Q-8 2 0 0 Q8 -6 16 0 Q8 2 0 0" fill="#3A4A5C" class="cena-gaivota__asas"/>
          </g>
          <g class="cena-gaivota" style="--altura:64px; --duracao:12s; --atraso:3s;" tabindex="0" role="button" aria-label="Gaivota">
            <path d="M0 0 Q-6 -5 -12 0 Q-6 1.5 0 0 Q6 -5 12 0 Q6 1.5 0 0" fill="#3A4A5C" class="cena-gaivota__asas"/>
          </g>

          <rect x="0" y="150" width="400" height="46" fill="url(#praiaMar)"/>
          <g class="cena-mar-brilho" opacity="0.5">
            <ellipse cx="330" cy="158" rx="30" ry="4" fill="#FFF3C4"/>
            <ellipse cx="310" cy="168" rx="22" ry="3" fill="#FFF3C4"/>
            <ellipse cx="345" cy="176" rx="18" ry="3" fill="#FFF3C4"/>
          </g>

          <rect x="0" y="196" width="400" height="64" fill="#F4E1B4"/>
          <rect x="0" y="196" width="400" height="6" fill="#EAD59A"/>

          <!-- Espuma das ondas desenhada DEPOIS da areia de propósito: assim
               ela "lava" visivelmente por cima da borda da areia, em vez de
               ficar escondida atrás dela (bug antigo: a areia era desenhada
               por cima da espuma e cortava a onda ao meio). -->
          <g class="cena-ondas" transform="translate(0 178)">
            <path class="cena-onda cena-onda--1" d="M-40 8 Q 0 0, 40 8 T 120 8 T 200 8 T 280 8 T 360 8 T 440 8 V 22 H -40 Z" fill="#EAF6FA" opacity="0.9"/>
            <path class="cena-onda cena-onda--2" d="M-40 14 Q 0 6, 40 14 T 120 14 T 200 14 T 280 14 T 360 14 T 440 14 V 22 H -40 Z" fill="#F5FBFD" opacity="0.85"/>
          </g>

          <g class="cena-palmeira" style="--atraso:0s;">
            <rect x="38" y="200" width="8" height="52" fill="#8A5A34" transform="skewX(-4)"/>
            <g class="cena-palmeira__copa" style="transform-origin:42px 200px;">
              <path d="M42 200 Q10 188 6 168" stroke="#3FA872" stroke-width="7" fill="none" stroke-linecap="round"/>
              <path d="M42 200 Q78 186 84 166" stroke="#3FA872" stroke-width="7" fill="none" stroke-linecap="round"/>
              <path d="M42 200 Q20 176 30 156" stroke="#5FCBA0" stroke-width="7" fill="none" stroke-linecap="round"/>
              <path d="M42 200 Q64 176 58 154" stroke="#5FCBA0" stroke-width="7" fill="none" stroke-linecap="round"/>
              <path d="M42 200 Q42 174 42 152" stroke="#3FA872" stroke-width="7" fill="none" stroke-linecap="round"/>
            </g>
          </g>
          <g class="cena-palmeira" style="--atraso:0.6s;">
            <rect x="358" y="206" width="7" height="46" fill="#8A5A34" transform="skewX(4)"/>
            <g class="cena-palmeira__copa" style="transform-origin:361px 206px;">
              <path d="M361 206 Q332 196 326 178" stroke="#3FA872" stroke-width="6" fill="none" stroke-linecap="round"/>
              <path d="M361 206 Q390 194 396 176" stroke="#3FA872" stroke-width="6" fill="none" stroke-linecap="round"/>
              <path d="M361 206 Q361 182 361 164" stroke="#5FCBA0" stroke-width="6" fill="none" stroke-linecap="round"/>
            </g>
          </g>

          <g class="cena-agua-clicavel" tabindex="0" role="button" aria-label="Fazer ondas na água">
            <rect x="0" y="178" width="400" height="82" fill="transparent"/>
          </g>
          <g class="cena-ondas-extra"></g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    _configurarAgua(svg) {
      const areaAgua = svg.querySelector('.cena-agua-clicavel');
      this._on(areaAgua, 'click', (ev) => {
        const ponto = this._converterParaCoordenadasSvg(svg, ev);
        this._criarOndaExtra(svg, ponto.x);
      });
    }

    _converterParaCoordenadasSvg(svg, evento) {
      const ponto = svg.createSVGPoint();
      ponto.x = evento.clientX;
      ponto.y = evento.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 200, y: 200 };
      return ponto.matrixTransform(ctm.inverse());
    }

    _criarOndaExtra(svg, x) {
      const grupo = svg.querySelector('.cena-ondas-extra');
      const circulo = this._el('circle', {
        cx: x.toFixed(0),
        cy: '190',
        r: '2',
        fill: 'none',
        stroke: '#FFFFFF',
        'stroke-width': '2',
        class: 'cena-onda-extra',
      });
      grupo.appendChild(circulo);
      this._setTimeout(() => circulo.remove(), 900);
    }

    _configurarGaivotas(svg) {
      svg.querySelectorAll('.cena-gaivota').forEach((gaivota) => {
        this._on(gaivota, 'click', () => {
          gaivota.classList.add('cena-gaivota--assustada');
          this._setTimeout(() => gaivota.classList.remove('cena-gaivota--assustada'), 2500);
        });
      });
    }
  }

  NS.BeachScene = BeachScene;
  NS.gerenciador.registrar('praia', BeachScene);
})(window);
