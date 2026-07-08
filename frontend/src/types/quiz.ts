export type Dificuldade = "FACIL" | "MEDIA" | "DIFICIL";
export type OrigemQuiz = "MANUAL" | "IA";

export interface AlternativaRequest {
  texto: string;
  letra: string;
  correta: boolean;
}

export interface QuizQuestionRequest {
  pergunta: string;
  alternativas: AlternativaRequest[];
}

export interface QuizCriarRequest {
  titulo: string;
  tema: string;
  dificuldade: Dificuldade;
  questoes: QuizQuestionRequest[];
}

export interface GerarQuizIARequest {
  tema: string;
  quantidade: number; // 1-30
  dificuldade: Dificuldade;
}

export interface AlternativaResponse {
  id: string;
  texto: string;
}

export interface QuestaoResponse {
  id: string;
  pergunta: string;
  ordem: number;
  alternativas: AlternativaResponse[];
}

export interface QuizResponse {
  id: string;
  titulo: string;
  tema: string;
  dificuldade: Dificuldade;
  origem: OrigemQuiz;
  totalQuestoes: number;
  criadoEm: string;
  questoes: QuestaoResponse[];
}

export interface QuizResumoResponse {
  id: string;
  titulo: string;
  tema: string;
  dificuldade: Dificuldade;
  origem: OrigemQuiz;
  totalQuestoes: number;
}

export interface ResponderQuestaoRequest {
  alternativaId: string;
}

import type { RecompensaResponse } from "./gamification";

export interface RespostaQuestaoResultado {
  correta: boolean;
  alternativaCorretaId: string;
  mensagemIncentivo: string;
  recompensa: RecompensaResponse;
}
