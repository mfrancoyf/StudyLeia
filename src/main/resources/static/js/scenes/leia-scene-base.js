/**
 * ==========================================================================
 * LeiaScenes.BaseScene
 * --------------------------------------------------------------------------
 * Classe-base que toda cena viva da Leia deve estender. Define o contrato
 * mínimo (init/destroy) e resolve, de forma genérica, os dois problemas que
 * costumam gerar vazamento de memória em cenas animadas:
 *
 *   1) Timers (setInterval/setTimeout) esquecidos rodando após a troca de
 *      cenário — resolvido pelos helpers `_setInterval` / `_setTimeout`,
 *      que registram cada timer para serem limpos automaticamente.
 *   2) Listeners de clique/hover que continuam presos a nós antigos do DOM
 *      — resolvido pelo helper `_on`, que registra cada listener para ser
 *      removido automaticamente.
 *
 * Uma cena concreta só precisa:
 *   - implementar `init()`, desenhando seu SVG dentro de `this.container`
 *     e usando os helpers acima para timers/listeners;
 *   - chamar `_definirFundo(gradienteCss)` logo no início do `init()`, para
 *     que o container tenha a mesma cor da cena por trás do SVG (evita
 *     faixas de letterbox nas laterais em cartões mais largos);
 *   - opcionalmente sobrescrever `destroy()` SE precisar de alguma limpeza
 *     extra além do genérico (raro — a maioria nunca precisa).
 *
 * Nenhuma cena concreta deve manipular `this.container.innerHTML` fora do
 * `init()`, nem registrar timers/listeners fora dos helpers — isso é o que
 * garante que o SceneManager consiga trocar de cenário sem deixar rastro.
 * ==========================================================================
 */
(function (global) {
  'use strict';

  const NS = (global.LeiaScenes = global.LeiaScenes || {});
  const SVG_NS = 'http://www.w3.org/2000/svg';

  class BaseScene {
    /**
     * @param {HTMLElement} container elemento (já vazio) onde a cena desenha.
     */
    constructor(container) {
      this.container = container;
      this._timers = [];
      this._listeners = [];
    }

    /** Ponto de entrada. Sobrescrever obrigatoriamente. */
    init() {
      throw new Error('Cena sem init() implementado.');
    }

    /**
     * Limpeza padrão: cancela timers, remove listeners, esvazia o DOM e
     * remove qualquer cor/gradiente de fundo que a cena tenha aplicado ao
     * container via `_definirFundo` — sem isso, a próxima cena (ou o
     * fallback de gradiente do tema) herdaria a cor da cena anterior.
     * Cenas com necessidades extras podem sobrescrever e chamar super.destroy().
     */
    destroy() {
      this._timers.forEach((id) => {
        clearInterval(id);
        clearTimeout(id);
      });
      this._timers = [];

      this._listeners.forEach(({ alvo, evento, handler }) => {
        alvo.removeEventListener(evento, handler);
      });
      this._listeners = [];

      this.container.style.background = '';
      this.container.innerHTML = '';
    }

    // ---- Helpers protegidos, usados pelas subclasses -----------------

    _setInterval(fn, ms) {
      const id = setInterval(fn, ms);
      this._timers.push(id);
      return id;
    }

    _setTimeout(fn, ms) {
      const id = setTimeout(fn, ms);
      this._timers.push(id);
      return id;
    }

    _on(alvo, evento, handler) {
      alvo.addEventListener(evento, handler);
      this._listeners.push({ alvo, evento, handler });
      return handler;
    }

    /**
     * Pinta o fundo do CONTAINER (não do SVG) com o mesmo gradiente da cena.
     *
     * Motivo: o SVG usa `preserveAspectRatio="... meet"` para nunca cortar
     * nem distorcer o desenho — mas isso significa que, quando o cartão da
     * Leia tem uma proporção mais larga que o viewBox (400x260), sobram
     * faixas nas laterais. Pintando o container com o mesmo gradiente da
     * cena, essas faixas ficam invisíveis: parecem parte do cenário, em vez
     * de uma barra de letterbox.
     */
    _definirFundo(gradienteCss) {
      this.container.style.background = gradienteCss;
    }

    /** Cria um nó SVG com atributos, sem precisar repetir createElementNS. */
    _el(tag, attrs = {}) {
      const el = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([chave, valor]) => el.setAttribute(chave, valor));
      return el;
    }

    /** Cria o <svg> raiz padrão de uma cena (viewBox comum a todas). */
    _criarPalco(classeExtra) {
      const svg = this._el('svg', {
        class: 'leia-cena-svg' + (classeExtra ? ' ' + classeExtra : ''),
        viewBox: '0 0 400 260',
        preserveAspectRatio: 'xMidYMax meet',
        role: 'img',
        'aria-hidden': 'true',
      });
      this.container.appendChild(svg);
      return svg;
    }

    /** Número aleatório entre min e max (inclusive). */
    _aleatorio(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  NS.BaseScene = BaseScene;
})(window);
