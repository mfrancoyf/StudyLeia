/**
 * ==========================================================================
 * LeiaScenes.SceneManager
 * --------------------------------------------------------------------------
 * Orquestra qual cena viva está montada atrás da Leia.
 *
 * Padrão: REGISTRY. Cada arquivo de cena (bedroom-scene.js, beach-scene.js…)
 * se auto-registra sob um código único ao ser carregado:
 *
 *     LeiaScenes.gerenciador.registrar('praia', LeiaScenes.BeachScene);
 *
 * O SceneManager em si NUNCA conhece a lista de cenas existentes — ele só
 * sabe montar/desmontar o que estiver no registro. Isso é o que garante o
 * princípio Aberto/Fechado pedido: para adicionar um cenário novo (ex.:
 * "cabana-na-montanha"), basta criar um novo arquivo `mountain-scene.js`
 * que se registra sozinho — nenhuma linha deste arquivo, nem de nenhuma
 * cena existente, precisa mudar.
 *
 * Também resolve o ciclo de vida: ao trocar de cena, a anterior é sempre
 * destruída (timers cancelados, listeners removidos, DOM limpo) antes da
 * próxima ser inicializada — nunca há duas cenas "vivas" ao mesmo tempo.
 * ==========================================================================
 */
(function (global) {
  'use strict';

  const NS = (global.LeiaScenes = global.LeiaScenes || {});

  class SceneManager {
    constructor() {
      this._registro = new Map();
      this._cenaAtiva = null;
      this._elementoAtivo = null;
      this._codigoAtivo = null;
    }

    /**
     * Registra uma classe de cena sob um código estável (o mesmo valor
     * salvo em `background_themes.codigo_cena` no banco).
     */
    registrar(codigo, ClasseCena) {
      if (this._registro.has(codigo) && console && console.warn) {
        console.warn(`[LeiaScenes] cena "${codigo}" já estava registrada — substituindo.`);
      }
      this._registro.set(codigo, ClasseCena);
      return this;
    }

    /** Existe uma cena viva implementada para este código? */
    possuiCena(codigo) {
      return !!codigo && this._registro.has(codigo);
    }

    /**
     * Monta a cena `codigo` dentro do elemento informado (nó ou id).
     * Retorna `true` se uma cena viva foi montada, `false` se o código não
     * tem cena registrada — nesse caso o chamador deve aplicar o fallback
     * de gradiente (ver principal.html), mantendo o comportamento antigo
     * para cenários que ainda não ganharam uma versão viva.
     */
    montar(elementoOuId, codigo) {
      const elemento = typeof elementoOuId === 'string' ? document.getElementById(elementoOuId) : elementoOuId;
      if (!elemento) return false;

      if (this._codigoAtivo === codigo && this._elementoAtivo === elemento) {
        return true; // já é a cena atual — evita reiniciar animações à toa
      }

      this.desmontar();

      const ClasseCena = this._registro.get(codigo);
      if (!ClasseCena) return false;

      elemento.classList.add('leia-cenario__scene--ativa');
      elemento.dataset.cenaAtiva = codigo;

      const instancia = new ClasseCena(elemento);
      instancia.init();

      this._cenaAtiva = instancia;
      this._elementoAtivo = elemento;
      this._codigoAtivo = codigo;
      return true;
    }

    /** Desmonta a cena ativa (se houver), limpando tudo o que ela criou. */
    desmontar() {
      if (this._cenaAtiva) {
        this._cenaAtiva.destroy();
      }
      if (this._elementoAtivo) {
        this._elementoAtivo.classList.remove('leia-cenario__scene--ativa');
        delete this._elementoAtivo.dataset.cenaAtiva;
      }
      this._cenaAtiva = null;
      this._elementoAtivo = null;
      this._codigoAtivo = null;
    }
  }

  // Singleton compartilhado por toda a aplicação.
  NS.gerenciador = NS.gerenciador || new SceneManager();
})(window);
