export interface ProgressoResponse {
  xpTotal: number;
  nivelAtual: number;
  xpFaltanteProximoNivel: number;
  progressoPercentual: number;
  moedas: number;
  sequenciaAtual: number;
  maiorSequencia: number;
  conquistasDesbloqueadas: string[];
}

export type TipoConquista =
  | "PRIMEIRA_PROVA"
  | "SEQUENCIA_7_DIAS"
  | "SEQUENCIA_30_DIAS"
  | "CEM_QUESTOES_RESPONDIDAS"
  | "MIL_XP"
  | "CINCO_MIL_XP"
  | "PRIMEIRA_ANOTACAO"
  | "PRIMEIRO_PLANO_CONCLUIDO"
  | "DEZ_QUIZZES_CRIADOS"
  | "NIVEL_10"
  | "NIVEL_20"
  | "NIVEL_30";

export interface AchievementResponse {
  tipo: TipoConquista;
  titulo: string;
  descricao: string;
  desbloqueadaEm: string | null;
}

export interface RecompensaResponse {
  xpGanho: number;
  moedasGanhas: number;
  xpTotal: number;
  nivelAnterior: number;
  nivelAtual: number;
  subiuDeNivel: boolean;
  leiaEvoluiu: boolean;
  novoEstagioEvolucao: string | null;
}