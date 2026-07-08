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
  | "CEM_QUESTOES_RESPONDIDAS"
  | "MIL_XP"
  | "CINCO_MIL_XP"
  | "PRIMEIRA_ANOTACAO"
  | "PRIMEIRO_PLANO_CONCLUIDO"
  | "DEZ_QUIZZES_CRIADOS";

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
