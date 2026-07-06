/**
 * ==========================================================================
 * LeiaScenes.BedroomScene  (codigo_cena: "quarto")
 * --------------------------------------------------------------------------
 * O quarto de estudos cozy da Leia: cama, mesa com luminária, estante,
 * quadros na parede, cortinas balançando e um relógio de parede funcional.
 *
 * Interações:
 *   - clicar na janela alterna dia/noite (céu, lua/sol, brilho geral);
 *   - clicar na luminária liga/desliga a luz (glow quente sobre a mesa).
 * ==========================================================================
 */
(function (global) {
  'use strict';
  const NS = global.LeiaScenes;

  class BedroomScene extends NS.BaseScene {
    init() {
      this._definirFundo('linear-gradient(180deg, #FBF3E4 0%, #FBF3E4 75%, #D9B98A 75%, #C8A672 100%)');

      this.container.innerHTML = `
        <svg class="leia-cena-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Quarto de estudos da Leia">
          <defs>
            <linearGradient id="quartoParede" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FBF3E4"/>
              <stop offset="100%" stop-color="#F0E2C8"/>
            </linearGradient>
            <radialGradient id="quartoLuzLuminaria" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FFE9AE" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#FFE9AE" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Parede e piso -->
          <rect x="0" y="0" width="400" height="196" fill="url(#quartoParede)"/>
          <rect x="0" y="196" width="400" height="64" fill="#D9B98A"/>
          <rect x="0" y="196" width="400" height="4" fill="#C8A672"/>

          <!-- Janela -->
          <g class="cena-janela" tabindex="0" role="button" aria-label="Alternar dia e noite">
            <rect x="26" y="24" width="104" height="80" rx="6" fill="#7FB3D5" class="cena-janela__ceu"/>
            <circle cx="58" cy="52" r="16" fill="#FFE9AE" class="cena-janela__sol"/>
            <g class="cena-janela__lua-grupo">
              <circle cx="58" cy="52" r="13" fill="#EFF3FE" class="cena-janela__lua"/>
              <circle cx="63" cy="47" r="11" fill="#7FB3D5" class="cena-janela__lua-sombra"/>
            </g>
            <circle cx="100" cy="40" r="1.6" fill="#fff" class="cena-janela__estrela" style="--atraso:0.2s"/>
            <circle cx="112" cy="60" r="1.4" fill="#fff" class="cena-janela__estrela" style="--atraso:1.1s"/>
            <circle cx="90" cy="75" r="1.2" fill="#fff" class="cena-janela__estrela" style="--atraso:0.6s"/>
            <rect x="26" y="24" width="104" height="80" rx="6" fill="none" stroke="#B7935C" stroke-width="6"/>
            <line x1="78" y1="24" x2="78" y2="104" stroke="#B7935C" stroke-width="4"/>
            <line x1="26" y1="64" x2="130" y2="64" stroke="#B7935C" stroke-width="4"/>
          </g>

          <!-- Cortinas -->
          <path class="cena-cortina cena-cortina--esq" d="M22 20 Q10 60 20 108 L34 108 Q26 60 34 20 Z" fill="#B7C5F7" opacity="0.9"/>
          <path class="cena-cortina cena-cortina--dir" d="M134 20 Q146 60 136 108 L122 108 Q130 60 122 20 Z" fill="#B7C5F7" opacity="0.9"/>

          <!-- Quadros -->
          <g class="cena-quadro">
            <rect x="160" y="34" width="34" height="26" rx="2" fill="#FFF" stroke="#B7935C" stroke-width="3"/>
            <path d="M164 54 L172 42 L180 50 L186 40 L191 54 Z" fill="#B7C5F7"/>
          </g>
          <g class="cena-quadro">
            <rect x="204" y="34" width="34" height="26" rx="2" fill="#FFF" stroke="#B7935C" stroke-width="3"/>
            <circle cx="221" cy="47" r="7" fill="#FFC94D"/>
          </g>

          <!-- Estante -->
          <rect x="270" y="30" width="108" height="10" fill="#B7935C"/>
          <rect x="278" y="14" width="10" height="16" fill="#FF8C7A"/>
          <rect x="290" y="10" width="10" height="20" fill="#5FCBA0"/>
          <rect x="302" y="16" width="10" height="14" fill="#6685EE"/>
          <rect x="314" y="12" width="10" height="18" fill="#F0A93B"/>
          <rect x="270" y="66" width="108" height="10" fill="#B7935C"/>
          <rect x="284" y="50" width="14" height="16" fill="#8FA3F2"/>
          <rect x="300" y="48" width="10" height="18" fill="#FF8C7A"/>
          <rect x="312" y="52" width="12" height="14" fill="#5FCBA0"/>

          <!-- Mesa + luminária -->
          <rect x="260" y="132" width="120" height="8" fill="#B7935C"/>
          <rect x="266" y="140" width="8" height="40" fill="#A07C46"/>
          <rect x="366" y="140" width="8" height="40" fill="#A07C46"/>
          <g class="cena-luminaria" tabindex="0" role="button" aria-label="Ligar ou desligar a luminária">
            <circle cx="284" cy="132" r="30" fill="url(#quartoLuzLuminaria)" class="cena-luminaria__brilho"/>
            <rect x="280" y="118" width="6" height="16" fill="#5C6B8A"/>
            <path d="M266 108 L302 108 L292 122 L276 122 Z" fill="#FFC94D" class="cena-luminaria__cupula"/>
          </g>

          <!-- Cama -->
          <rect x="20" y="150" width="130" height="50" rx="10" fill="#8FA3F2"/>
          <rect x="20" y="150" width="130" height="16" rx="8" fill="#B7C5F7"/>
          <ellipse cx="44" cy="158" rx="16" ry="10" fill="#FFFFFF"/>
          <rect x="20" y="176" width="130" height="24" fill="#6685EE" opacity="0.55"/>

          <!-- Relógio -->
          <g class="cena-relogio">
            <circle cx="200" cy="150" r="20" fill="#FFFBF2" stroke="#B7935C" stroke-width="3"/>
            <line x1="200" y1="150" x2="200" y2="137" stroke="#1C2B4A" stroke-width="2.4" stroke-linecap="round" class="cena-relogio__ponteiro-hora"/>
            <line x1="200" y1="150" x2="211" y2="150" stroke="#4C6FE5" stroke-width="1.8" stroke-linecap="round" class="cena-relogio__ponteiro-minuto"/>
            <circle cx="200" cy="150" r="1.6" fill="#1C2B4A"/>
          </g>
        </svg>
      `;

      this._configurarJanela();
      this._configurarLuminaria();
    }

    _configurarJanela() {
      const janela = this.container.querySelector('.cena-janela');
      this._on(janela, 'click', () => {
        this.container.querySelector('.leia-cena-svg').classList.toggle('cena--noite');
      });
      this._on(janela, 'keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') janela.dispatchEvent(new Event('click'));
      });
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
  }

  NS.BedroomScene = BedroomScene;
  NS.gerenciador.registrar('quarto', BedroomScene);
})(window);
