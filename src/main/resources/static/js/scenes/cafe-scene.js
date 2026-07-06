/**
 * ==========================================================================
 * LeiaScenes.CafeScene  (codigo_cena: "cafe")
 * --------------------------------------------------------------------------
 * Interior de café aconchegante: mesa com xícara fumegante, varal de luzes,
 * planta e janela com luz quente da tarde.
 *
 * Interações:
 *   - clicar na xícara gera uma baforada extra de vapor;
 *   - clicar no varal de luzes alterna entre luz suave e mais quente.
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class CafeScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #F6E9D2 0%, #F0E0C8 75%, #C9A876 75%, #B7935C 100%)');

      const svg = this._montarPalco();
      this._configurarXicara(svg);
      this._configurarVaral(svg);
      this._agendarVaporAmbiente(svg);
    }

    _montarPalco() {
      this.container.innerHTML = `
        <svg class="leia-cena-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Café aconchegante">
          <defs>
            <linearGradient id="cafeParede" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F6E9D2"/>
              <stop offset="100%" stop-color="#F0E0C8"/>
            </linearGradient>
            <radialGradient id="cafeJanelaLuz" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stop-color="#FFDDA0" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#FFDDA0" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="400" height="196" fill="url(#cafeParede)"/>
          <rect x="0" y="196" width="400" height="64" fill="#C9A876"/>
          <rect x="0" y="196" width="400" height="4" fill="#B7935C"/>

          <!-- janela quente ao fundo -->
          <rect x="278" y="30" width="90" height="110" rx="6" fill="#F7C978"/>
          <circle cx="323" cy="60" r="46" fill="url(#cafeJanelaLuz)"/>
          <rect x="278" y="30" width="90" height="110" rx="6" fill="none" stroke="#8A5A34" stroke-width="6"/>
          <line x1="323" y1="30" x2="323" y2="140" stroke="#8A5A34" stroke-width="4"/>
          <line x1="278" y1="82" x2="368" y2="82" stroke="#8A5A34" stroke-width="4"/>

          <!-- planta -->
          <g class="cena-arbusto" style="transform-origin:60px 190px;">
            <rect x="46" y="176" width="28" height="20" fill="#B95D4C"/>
            <ellipse cx="60" cy="150" rx="22" ry="18" fill="#3FA872"/>
            <ellipse cx="46" cy="160" rx="14" ry="12" fill="#5FCBA0"/>
            <ellipse cx="76" cy="158" rx="14" ry="12" fill="#5FCBA0"/>
          </g>

          <!-- estante com xícaras e potes -->
          <rect x="90" y="52" width="150" height="8" fill="#8A5A34"/>
          <circle cx="106" cy="42" r="9" fill="#F0A93B"/>
          <rect x="122" y="30" width="16" height="20" rx="2" fill="#6685EE"/>
          <rect x="146" y="26" width="14" height="24" rx="2" fill="#B95D4C"/>
          <circle cx="182" cy="42" r="9" fill="#5FCBA0"/>
          <rect x="200" y="32" width="16" height="18" rx="2" fill="#F0A93B"/>

          <!-- mesa com xícara fumegante -->
          <rect x="150" y="186" width="100" height="8" fill="#8A5A34"/>
          <rect x="158" y="194" width="7" height="30" fill="#6B4226"/>
          <rect x="235" y="194" width="7" height="30" fill="#6B4226"/>

          <g class="cena-xicara" tabindex="0" role="button" aria-label="Xícara de café">
            <rect x="182" y="170" width="30" height="18" rx="4" fill="#FFFFFF"/>
            <path d="M212 174 q10 0 10 7 q0 7 -10 7" fill="none" stroke="#FFFFFF" stroke-width="3"/>
            <ellipse cx="197" cy="171" rx="13" ry="3" fill="#6B4226"/>
          </g>
          <g class="cena-vapor-grupo"></g>

          <!-- varal de luzes no teto -->
          <g class="cena-varal" tabindex="0" role="button" aria-label="Varal de luzes">
            <path d="M20 20 Q200 46 380 20" fill="none" stroke="#8A5A34" stroke-width="1.5" opacity="0.6"/>
            <circle cx="60" cy="26" r="3.5" fill="#FFE9AE" class="cena-luz-string" style="--atraso:0s"/>
            <circle cx="120" cy="34" r="3.5" fill="#FFE9AE" class="cena-luz-string" style="--atraso:0.4s"/>
            <circle cx="180" cy="38" r="3.5" fill="#FFE9AE" class="cena-luz-string" style="--atraso:0.8s"/>
            <circle cx="240" cy="37" r="3.5" fill="#FFE9AE" class="cena-luz-string" style="--atraso:1.2s"/>
            <circle cx="300" cy="32" r="3.5" fill="#FFE9AE" class="cena-luz-string" style="--atraso:1.6s"/>
            <circle cx="350" cy="24" r="3.5" fill="#FFE9AE" class="cena-luz-string" style="--atraso:2s"/>
          </g>
        </svg>
      `;
      return this.container.querySelector('.leia-cena-svg');
    }

    _criarVapor(svg) {
      const grupo = svg.querySelector('.cena-vapor-grupo');
      const x = this._aleatorio(190, 204);
      const vapor = this._el('path', {
        d: `M${x} 168 q-4 -8 0 -16 q4 8 0 16`,
        stroke: '#FFFFFF',
        'stroke-width': '2.4',
        fill: 'none',
        'stroke-linecap': 'round',
        class: 'cena-vapor',
      });
      vapor.style.setProperty('--duracao', `${this._aleatorio(2, 3).toFixed(1)}s`);
      grupo.appendChild(vapor);
      this._setTimeout(() => vapor.remove(), 3200);
    }

    _configurarXicara(svg) {
      const xicara = svg.querySelector('.cena-xicara');
      const disparar = () => {
        for (let i = 0; i < 3; i += 1) {
          this._setTimeout(() => this._criarVapor(svg), i * 150);
        }
      };
      this._on(xicara, 'click', disparar);
      this._on(xicara, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') disparar();
      });
    }

    _configurarVaral(svg) {
      const varal = svg.querySelector('.cena-varal');
      this._on(varal, 'click', () => varal.classList.toggle('cena-varal--quente'));
      this._on(varal, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') varal.dispatchEvent(new Event('click'));
      });
    }

    /** Um fiozinho de vapor constante sai da xícara sozinho, de tempos em tempos. */
    _agendarVaporAmbiente(svg) {
      const agendarProxima = () => {
        this._setTimeout(() => {
          this._criarVapor(svg);
          agendarProxima();
        }, this._aleatorio(1800, 2600));
      };
      agendarProxima();
    }
  }

  NS.CafeScene = CafeScene;
  NS.gerenciador.registrar('cafe', CafeScene);
})(window);
